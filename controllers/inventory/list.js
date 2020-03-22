const BaseController = require('./lib/base-ctrl');

class List extends BaseController {
  method = () => 'GET';

  path = () => '/inventory';

  features = () => ({ auth: true, ws: false, docs: true });

  config = () => ({ description: 'List inventory items' });

  /**
   * @inheritdoc
   */
  async handler(_kernel, request, _h) {
    const Inventory = this._inventoryModel(request);

    return Inventory.findAll();
  }
}

module.exports = List;
