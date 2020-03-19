const AbstractClass = require('./utils/abc');

class Plugin extends AbstractClass {
  constructor() {
    // Should return native Hapi plugin proto
    super(Plugin, ['instance', 'name']);
  }

  /**
   * Configure plugin before registration
   * @param {Kernel} kernel
   */
  async configure(kernel) {}

  /**
   * Load the plugin after registration
   * @param {Kernel} kernel
   */
  async load(kernel) {}
}

module.exports = Plugin;
