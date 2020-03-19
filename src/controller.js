const AbstractClass = require('./utils/abc');

/**
 * @ref https://hapi.dev/tutorials/routing/?lang=en_US
 */
class Controller extends AbstractClass {
  constructor() {
    // Hapi route configuration parameters (see ref link above)
    // Kernel passed as first argument to every of it
    super(Controller, ['method', 'path', 'handler']);
  }

  /**
   * Configure controller before registering route
   * @param {Kernel} kernel
   */
  async configure(kernel) {}

  /**
   * Route config
   * @param {Kernel} kernel
   * @returns {*}
   */
  config(kernel) {}

  /**
   * Route vhost
   * @param {Kernel} kernel
   * @returns {*}
   */
  vhost(kernel) {}

  /**
   * Route rules
   * @param {Kernel} kernel
   * @returns {*}
   */
  rules(kernel) {}

  /**
   * Apply features on route raw object
   * @ref Kernel.features
   * @param {Kernel} kernel
   * @returns {*}
   */
  features(kernel) {}
}

module.exports = Controller;
