const Joi = require('@hapi/joi');
const Boom = require('boom');
const EventEmitter = require('./utils/ee');
const Features = require('./features');
const AbstractPlugin = require('./plugin');
const AbstractController = require('./controller');
const WrongImplementationError = require('./error/wrong-impl');

class Kernel extends EventEmitter {
  plugins = {};

  /**
   * @param {Hapi.server} server
   */
  constructor(server) {
    super();

    this.server = server;
    this.features = new Features().pipe(this, 'feature');
  }

  /**
   * Register a feature
   * @param {string} name
   * @param {string} handler
   * @returns {Kernel}
   */
  async feature(name, handler) {
    this.features.register(name, handler);

    return this;
  }

  /**
   * Load a plugin
   * @param {...AbstractPlugin} plugins
   * @returns {Kernel}
   */
  async plugin(...plugins) {
    for (const plugin of plugins) {
      WrongImplementationError.assert(plugin, AbstractPlugin);

      await plugin.configure(this);
      const pluginDefinition = plugin.instance(this);
      if (pluginDefinition) {
        // it might be internal plugin
        await this.server.register(pluginDefinition);
      }
      await plugin.load(this);

      this.plugins[plugin.name()] = plugin;
      this.emit('plugin', plugin);
    }

    return this;
  }

  /**
   * Load a controller
   * @param {...AbstractController} controllers
   * @returns {Kernel}
   */
  async controller(...controllers) {
    for (const controller of controllers) {
      WrongImplementationError.assert(controller, AbstractController);

      await controller.configure(this);
      const route = await this._applyRouteFeatures(
        {
          method: controller.method(this),
          path: controller.path(this),
          handler: this._requestHandler(controller),
          /* optionals */
          config: controller.config(this),
          vhost: controller.vhost(this),
          rules: controller.rules(this),
        },
        controller.features(this),
      );

      this.server.route(route);
      this.emit('controller', controller, route);
    }

    return this;
  }

  /**
   * Bootstrap and start API server
   * @param {*} opts
   */
  async bootstrap(opts = {}) {
    return this.server.start(opts);
  }

  /**
   * Shortcut to "const Joi = require('@hapi/joi');"
   * @returns {Joi}
   */
  get Joi() {
    return Joi;
  }

  /**
   * Shortcut to "const Boom = require('boom');"
   * @returns {Boom}
   */
  get Boom() {
    return Boom;
  }

  /**
   * Apply route features
   * @param {*} route
   * @param {*} features
   */
  async _applyRouteFeatures(route, features) {
    if (!features || typeof features !== 'object') {
      return route;
    }

    return this.features.useAll(route, features);
  }

  /**
   * Create wrapped request handler
   * @param {AbstractController} controller
   * @returns {function}
   */
  _requestHandler(controller) {
    const kernel = this; // avoid missing context

    return async (request, h) => {
      kernel.emit('request', request, controller);

      return controller.handler(kernel, request, h);
    };
  }
}

module.exports = Kernel;
