const BaseController = require('./lib/base-ctrl');

class Remove extends BaseController {
  method = () => 'DELETE';

  path = () => '/admin/identity/{id}';

  features = () => ({ auth: true, ws: false, docs: true });

  config = ({ Joi }) => {
    return {
      description: 'Delete an user',
      validate: {
        params: Joi.object({
          id: Joi.number()
            .integer()
            .required()
            .min(1)
            .description('User ID')
            .example(1),
        }).label('UserID'),
      },
    };
  };

  /**
   * @inheritdoc
   */
  async handler(kernel, request, _h) {
    const { id } = request.params;

    if (!request.user.isAdmin()) {
      throw kernel.Boom.unauthorized('You must be an admin');
    }

    const User = this._userModel(request);
    const user = await User.findByPk(id);

    if (!user) {
      throw kernel.Boom.notFound('User Does Not Exist');
    }

    return user.destroy();
  }
}

module.exports = Remove;
