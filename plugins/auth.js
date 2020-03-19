const HapiJwt2 = require('hapi-auth-jwt2');
const JWT = require('jsonwebtoken');
const Plugin = require('../src/plugin');
const WrongImplementationError = require('../src/error/wrong-impl');
const AbstractStrategy = require('./auth/strategy');
const authStrategies = require('./auth/strategies');

/**
 * @ref https://www.npmjs.com/package/hapi-auth-jwt2
 */
class Auth extends Plugin {
  FEATURE = 'auth';

  AUTH_KEY = 'jwt';

  TOKEN_KEY = 'token';

  STRATEGIES = authStrategies;

  _strategy = null;

  strategy = null;

  /**
   * @inheritdoc
   */
  name() {
    return 'auth';
  }

  /**
   * @inheritdoc
   * @returns {HapiJwt2}
   */
  instance() {
    return HapiJwt2;
  }

  /**
   * @inheritdoc
   */
  async configure(kernel) {
    const Strategy = this.STRATEGIES[process.env.AUTH_STRATEGY];
    WrongImplementationError.assert(Strategy, AbstractStrategy);
    const strategyOpts = JSON.parse(process.env.AUTH_PARAMS || null);

    this.strategy = process.env.AUTH_STRATEGY;
    this._strategy = new Strategy(strategyOpts);
    kernel.feature(this.FEATURE, this._featureDecorator.bind(this));
  }

  /**
   * @inheritdoc
   */
  async load(kernel) {
    kernel.server.auth.strategy(this.AUTH_KEY, this.AUTH_KEY, {
      key: process.env.SEC_SEED, // Never Share your secret key
      validate: async (decoded, request, h) => {
        try {
          const user = await this._strategy.validate(
            kernel,
            decoded,
            request,
            h,
          );

          // case we have some credentials returned
          if (user && typeof user === 'object') {
            request.user = user;
            return { isValid: true, credentials: user };
          }

          return { isValid: !!user };
        } catch (e) {
          throw kernel.Boom.unauthorized('Authorization Service Failure');
        }
      },
    });

    kernel.server.auth.default(this.AUTH_KEY);
  }

  /**
   * Gain authorization based on request object
   * @param {*} kernel
   * @param {*} request
   * @param {*} h
   */
  async authorize(kernel, request, h) {
    let user;

    try {
      user = await this._strategy.authorize(kernel, request, h);
    } catch (e) {
      throw kernel.Boom.unauthorized('Authorization Service Failure');
    }

    if (!user) {
      throw kernel.Boom.unauthorized('Authorization Declined');
    }

    request.user = user;

    return { [this.TOKEN_KEY]: this._createToken(user) };
  }

  /**
   * Create signed JWT token from an object
   * @param {*} obj
   * @returns {string}
   */
  _createToken(obj) {
    // Allow change toJSON strategy of user object
    if (typeof obj.get === 'function') {
      obj = obj.get();
    }

    return JWT.sign(JSON.stringify(obj), process.env.SEC_SEED);
  }

  /**
   * Auth feature decorator
   * @param {*} routeObj
   * @param {*} options
   * @returns {*}
   * @todo use options parameter
   */
  async _featureDecorator(routeObj, options) {
    routeObj.config = routeObj.config || {};
    // "options === false" meaning that endpoint should not be secured
    routeObj.config.auth = options === false ? false : this.AUTH_KEY;

    return routeObj;
  }
}

module.exports = Auth;
