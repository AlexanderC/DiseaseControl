const BaseController = require('./lib/base-ctrl');

class Promote extends BaseController {
  method = () => 'PUT';

  path = () => '/identity/{id}/promote';

  features = () => ({ auth: true, ws: false, docs: true });

  config = kernel => {
    const {
      Joi,
      plugins: {
        db: { default: db },
      },
    } = kernel;

    const User = db(kernel).getModel('User');

    return {
      description: 'Update user role',
      notes: `Available roles: ${User.TYPES.join(', ')}`,
      validate: {
        params: Joi.object({
          id: Joi.number()
            .integer()
            .required()
            .min(1)
            .description('User ID')
            .example(1),
        }).label('UserID'),
        payload: Joi.object({
          role: Joi.string()
            .required()
            .lowercase()
            .valid(...User.TYPES)
            .example(User.TYPE.USER),
        }).label('Role'),
      },
    };
  };

  /**
   * @inheritdoc
   */
  async handler(kernel, request, _h) {
    const { id } = request.params;
    const { role } = request.payload;

    if (!request.user.isAdmin()) {
      throw kernel.Boom.unauthorized('You must be an admin');
    }

    const User = this._userModel(request);
    const user = await User.findByPk(id);

    if (!user) {
      throw kernel.Boom.notFound('Identity Does Not Exist');
    }

    user.type = role;

    return user.save();
  }
}

module.exports = Promote;
