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
   * Get inventory model
   * @param {Hapi.Request} request
   * @returns {Inventory}
   */
  _inventoryModel(request) {
    return request.getModel('Inventory');
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
   * Get hospital inventory model
   * @param {Hapi.Request} request
   * @returns {HospitalInventory}
   */
  _hospitaliInventoryModel(request) {
    return request.getModel('HospitalInventory');
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

    const inventory = Joi.array()
      .items(Joi.string())
      .optional()
      .example(['bed']);

    const description = Joi.string()
      .optional()
      .example('Some hospital description');

    const supervisor = Joi.number()
      .integer()
      .optional()
      .min(1)
      .description('User ID')
      .example(1);

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
          inventory,
          supervisor,
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
        inventory,
        supervisor,
      }).label('Hospital'),
    };
  }
}

module.exports = BaseController;
