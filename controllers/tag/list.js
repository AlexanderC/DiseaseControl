const BaseController = require('./lib/base-ctrl');

class List extends BaseController {
  method = () => 'GET';

  path = () => '/tags';

  features = () => ({ auth: false, ws: false, docs: true });

  config = () => ({ description: 'List tags' });

  /**
   * @inheritdoc
   */
  async handler(_kernel, request, _h) {
    const Tag = this._tagModel(request);

    return Tag.findAll();
  }
}

module.exports = List;
