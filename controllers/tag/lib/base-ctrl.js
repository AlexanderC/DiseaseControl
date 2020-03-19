const Controller = require('../../../src/controller');

class BaseController extends Controller {
  /**
   * Get tag model
   * @param {Hapi.Request} request
   * @returns {Tag}
   */
  _tagModel(request) {
    return request.getModel('Tag');
  }

  /**
   * Tag validation schema
   * @param {Joi}
   * @param {boolean} multiple
   * @returns {*}
   */
  _validationSchema(Joi, multiple = false) {
    const schema = Joi.object({
      name: Joi.string()
        .required()
        .lowercase()
        .replace(/\s+/g, '-')
        .min(3)
        .max(256)
        .example('first-tag'),
      description: Joi.string()
        .optional()
        .example('Some tag details'),
    })
      .unknown(true)
      .label('Tag');

    return {
      payload: multiple
        ? Joi.array()
            .items(schema)
            .label('Tags')
        : schema,
    };
  }
}

module.exports = BaseController;
