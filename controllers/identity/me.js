const BaseController = require('./lib/base-ctrl');

class Me extends BaseController {
  method = () => 'GET';

  path = () => '/identity/me';

  features = () => ({ auth: true, ws: false, docs: true });

  config = () => ({ description: 'Returns logged in identity' });

  /**
   * @inheritdoc
   */
  async handler(_kernel, request, _h) {
    return request.user;
  }
}

module.exports = Me;
