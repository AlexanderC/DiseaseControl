const AbstractClass = require('../../src/utils/abc');

class Strategy extends AbstractClass {
  constructor() {
    super(Strategy, ['authorize', 'validate']);
  }

  /**
   * Authorize the request and return info object or false if identity not found
   * @param {Kernel} kernel
   * @param {Hapi.Request} request
   * @param {Hapi.Response} h
   * @returns {*}
   */
  // async authorize(kernel, request, h) {}

  /**
   * Validate decoded object created by authorize
   * @param {*} decoded
   * @param {Kernel} kernel
   * @param {Hapi.Request} request
   * @param {Hapi.Response} h
   * @returns {object|boolean}
   */
  // async validate(kernel, decoded, request, h) {}
}

module.exports = Strategy;
