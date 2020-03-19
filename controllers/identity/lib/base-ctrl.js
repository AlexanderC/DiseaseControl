const crypto = require('crypto');
const Controller = require('../../../src/controller');

class BaseController extends Controller {
  /**
   * Prepare passed raw password
   * @param {Kernel} kernel
   * @param {string} password
   * @returns {string}
   */
  _preparePassword(kernel, password) {
    // @think on moving it somewhere
    // This is used on json strategy setup
    if (kernel.plugins.auth.strategy !== 'db') {
      return password;
    }

    return crypto
      .createHmac('sha256', process.env.SEC_SEED)
      .update(password)
      .digest('hex');
  }

  /**
   * Get user model
   * @param {Hapi.Request} request
   * @returns {User}
   */
  _userModel(request) {
    return request.getModel('User');
  }

  /**
   * Get two fa request model
   * @param {Hapi.Request} request
   * @returns {TwoFARequest}
   */
  _requestModel(request) {
    return request.getModel('TwoFARequest');
  }

  /**
   * Identity validation schema
   * @param {Joi}
   * @param {boolean} onlyUsername
   * @returns {*}
   */
  _validationSchema(Joi, onlyUsername = false) {
    const username = Joi.string()
      .email()
      .required()
      .example('user@example.com');
    const password = Joi.string()
      .required()
      .example('password');
    const schema = onlyUsername ? { username } : { username, password };

    return {
      payload: Joi.object(schema).label(
        onlyUsername ? 'PartialCredentials' : 'Credentials',
      ),
    };
  }
}

module.exports = BaseController;
