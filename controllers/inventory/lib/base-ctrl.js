const Controller = require('../../../src/controller');

class BaseController extends Controller {
  /**
   * Get inventory model
   * @param {Hapi.Request} request
   * @returns {Inventory}
   */
  _inventoryModel(request) {
    return request.getModel('Inventory');
  }

  /**
   * Inventory validation schema
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
        .example('bed'),
      description: Joi.string()
        .optional()
        .example('Some inventory details'),
    })
      .unknown(true)
      .label('Inventory');

    return {
      payload: multiple
        ? Joi.array()
            .items(schema)
            .label('InventoryArray')
        : schema,
    };
  }
}

module.exports = BaseController;
