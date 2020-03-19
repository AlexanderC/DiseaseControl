const Inert = require('@hapi/inert');
const Vision = require('@hapi/vision');
const HapiSwagger = require('hapi-swagger');
const path = require('path');
const Plugin = require('../src/plugin');
const Pack = require('../package');

/**
 * @ref https://github.com/rse/hapi-plugin-websocket
 */
class Docs extends Plugin {
  FEATURE = 'docs';

  PRIVATE_ENDPOINT = 'private';

  tokenSchema = null;

  /**
   * @inheritdoc
   */
  name() {
    return 'docs';
  }

  /**
   * @inheritdoc
   */
  instance() {
    return [
      Inert,
      Vision,
      {
        plugin: HapiSwagger,
        options: {
          host: process.env.DOCS_HOST,
          documentationPath: process.env.DOCS_PATH,
          schemes: [process.env.DOCS_SCHEME],
          info: {
            title: `${Pack.description} Documentation`,
            version: Pack.version,
          },
          routeTag: this.FEATURE,
        },
      },
    ];
  }

  /**
   * @inheritdoc
   */
  async configure(kernel) {
    if (kernel.plugins.auth) {
      this.tokenSchema = kernel.Joi.object({
        [kernel.plugins.auth.TOKEN_KEY]: kernel.Joi.string()
          .required(true)
          .description('Your JWT token')
          .example('your-jwt-token'),
      });
    }

    kernel.feature(this.FEATURE, this._featureDecorator.bind(this));
  }

  /**
   * Docs feature decorator
   * @param {*} routeObj
   * @param {*} options
   * @returns {*}
   * @todo use options parameter
   */
  async _featureDecorator(routeObj, options) {
    routeObj.config = routeObj.config || {};
    // "options === false" meaning that endpoint should not be exposed in docs
    if (options === false) {
      routeObj.config.tags = routeObj.config.tags || [];
      routeObj.config.tags.push(this.PRIVATE_ENDPOINT);
    }

    const predefinedTags = ['api'];

    // Integrate wss plugin
    if (
      routeObj.config &&
      routeObj.config.plugins &&
      routeObj.config.plugins.websocket
    ) {
      // @ref https://www.npmjs.com/package/hapi-plugin-websocket
      if (routeObj.config.plugins.websocket.only) {
        predefinedTags.shift(); // remove api tag
      }

      predefinedTags.push('ws');
    }

    // Integrate auth plugin
    if (routeObj.config.auth) {
      if (this.tokenSchema) {
        routeObj.config.validate = routeObj.config.validate || {};
        routeObj.config.validate.query = routeObj.config.validate.query
          ? routeObj.config.validate.query.append(this.tokenSchema)
          : this.tokenSchema;
        routeObj.config.plugins = routeObj.config.plugins || {};

        // show lock icon in UI
        routeObj.config.plugins['hapi-swagger'] = {
          security: { jwt: {} },
        };
      }

      predefinedTags.push('secured');
    }

    routeObj.config.tags = routeObj.config.tags
      ? [...routeObj.config.tags, ...predefinedTags]
      : predefinedTags;

    routeObj.config.tags.push(this.FEATURE);

    return routeObj;
  }

  /**
   * Get base url of documentation website
   * @param {boolean} includeProtocol
   * @returns {boolean}
   */
  getBaseUrl(includeProtocol = true) {
    const baseUrl = path
      .join(process.env.DOCS_HOST, process.env.DOCS_PATH)
      .replace(/[/]+$/, '');

    if (!includeProtocol) {
      return baseUrl;
    }

    return `${process.env.DOCS_SCHEME}://${baseUrl}`;
  }
}

module.exports = Docs;
