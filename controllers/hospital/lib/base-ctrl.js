const Controller = require('../../../src/controller');

class BaseController extends Controller {
  /**
   * Get hospital model
   * @param {Hapi.Request} request
   * @returns {Hospital}
   */
  _hospitalModel(request) {
    return request.getModel('Hospital');
  }

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
   * @param {boolean} partial
   * @returns {*}
   */
  _validationSchema(Joi, partial = false) {
    const tags = Joi.array()
      .items(Joi.string())
      .optional()
      .example(['some-tag']);

    const description = Joi.string()
      .optional()
      .example('Some hospital description');

    if (partial) {
      return {
        params: Joi.object({
          id: Joi.number()
            .integer()
            .required()
            .min(1)
            .description('Hospital ID')
            .example(1),
        }).label('HospitalID'),
        payload: Joi.object({
          tags,
          description,
        }).label('PartialHospital'),
      };
    }

    return {
      payload: Joi.object({
        name: Joi.string()
          .required()
          .min(3)
          .example('IMSP SCR „Timofei Moșneaga”'),
        description,
        tags,
      }).label('Hospital'),
    };
  }
}

module.exports = BaseController;
