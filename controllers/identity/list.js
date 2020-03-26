const BaseController = require('./lib/base-ctrl');

class List extends BaseController {
  method = () => 'GET';

  path = () => '/admin/identity';

  features = () => ({ auth: true, ws: false, docs: true, paginate: true });

  config = () => ({ description: 'List identities' });

  /**
   * @inheritdoc
   */
  async handler(kernel, request, _h) {
    const { paginate, page } = request.query;

    if (!request.user.isAdmin()) {
      throw kernel.Boom.unauthorized('You must be an admin');
    }

    const User = this._userModel(request);

    return User.scope('hospitals').paginate({ paginate, page });
  }
}

module.exports = List;
