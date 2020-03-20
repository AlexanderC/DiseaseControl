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
    const validation = Joi.object({
      limit: Joi.number()
        .integer()
        .default(50)
        .description('Limit items per listing')
        .example(50),
      offset: Joi.number()
        .integer()
        .default(1)
        .description('Offset items')
        .example(0),
    })
      .unknown(false) // To avoid SQL injections
      .label('Pagination');

    routeObj.config.validate.query = routeObj.config.validate.query
      ? routeObj.config.validate.query.append(validation)
      : validation;

    const originalHandler = routeObj.handler;
    routeObj.handler = async (request, h) => {
      const { docs, total } = await originalHandler(request, h);

      request.totalCount = total;
      return docs || [];
    };

    return routeObj;
  }
}

module.exports = Paginate;
