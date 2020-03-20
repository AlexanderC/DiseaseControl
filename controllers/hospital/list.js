const BaseController = require('./lib/base-ctrl');

class List extends BaseController {
  method = () => 'GET';

  path = () => '/hospital';

  features = () => ({ auth: false, ws: false, docs: true });

  config = () => ({ description: 'List hospitals' });

  /**
   * @inheritdoc
   */
  async handler(_kernel, request, _h) {
    const Hospital = this._hospitalModel(request);

    return Hospital.scope('tags', 'inventory').findAll();
  }
}

module.exports = List;
