const HapiPagination = require('hapi-pagination');
const Joi = require('@hapi/joi');
const Plugin = require('../src/plugin');

/**
 * @ref https://www.npmjs.com/package/hapi-pagination
 */
class Paginate extends Plugin {
  FEATURE = 'paginate';

  /**
   * @inheritdoc
   */
  name() {
    return 'paginate';
  }

  /**
   * @inheritdoc
   * @returns {HapiPagination}
   */
  instance() {
    return {
      plugin: HapiPagination,
      options: {
        routes: { include: [], exclude: ['*'] },
      },
    };
  }

  /**
   * @inheritdoc
   */
  async configure(kernel) {
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
    // "options === false" meaning that endpoint should not be paginated
    if (options === false) {
      return routeObj;
    }

    routeObj.config = routeObj.config || {};
    routeObj.config.plugins = routeObj.config.plugins || {};
    routeObj.config.validate = routeObj.config.validate || {};
    routeObj.config.validate.options = routeObj.config.validate.options || {};
    routeObj.config.plugins.pagination = { enabled: true };
    routeObj.config.validate.options.allowUnknown = true;
    // @todo make an attempt to extend not override
    routeObj.config.validate.query = Joi.object({
      limit: Joi.number()
        .integer()
        .default(10)
        .example(10),
      page: Joi.number()
        .integer()
        .default(1)
        .example(1),
    }).label('Pagination');

    return routeObj;
  }
}

module.exports = Paginate;
