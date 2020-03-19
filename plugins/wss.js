const HapiWebSocket = require('hapi-plugin-websocket');
const Plugin = require('../src/plugin');

/**
 * @ref https://github.com/rse/hapi-plugin-websocket
 */
class WebSocketServer extends Plugin {
  FEATURE = 'ws';

  /**
   * @inheritdoc
   */
  name() {
    return 'wss';
  }

  /**
   * @inheritdoc
   * @returns {HapiWebSocket}
   */
  instance() {
    return HapiWebSocket;
  }

  /**
   * @inheritdoc
   */
  async configure(kernel) {
    kernel.feature(this.FEATURE, this._featureDecorator.bind(this));
  }

  /**
   * WS feature decorator
   * @param {*} routeObj
   * @param {*} options
   * @returns {*}
   */
  async _featureDecorator(routeObj, options) {
    routeObj.config = routeObj.config || {};
    routeObj.config.plugins = routeObj.config.plugins || {};
    // "options === false" meaning that endpoint should not be exposed via WS
    if (options === false) {
      return routeObj;
    }

    routeObj.config.plugins.websocket = options;
    return routeObj;
  }
}

module.exports = WebSocketServer;
