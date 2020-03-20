const BaseController = require('./lib/base-ctrl');

class Register extends BaseController {
  method = () => 'POST';

  path = () => '/admin/identity/register';

  features = () => ({ auth: true, ws: false, docs: true });

  config = kernel => {
    const {
      Joi,
      plugins: {
        docs: { getBaseUrl },
        db: { default: db },
      },
    } = kernel;

    const User = db(kernel).getModel('User');
    const fullBaseUrl = getBaseUrl();
    const { payload } = this._validationSchema(Joi);

    return {
      description: 'Register a new identity.',
      notes: `In order to obtain JWT token use "${fullBaseUrl}/identity/login" endpoint.`,
      validate: {
        payload: payload.append({
          role: Joi.string()
            .required()
            .lowercase()
            .valid(...User.TYPES)
            .default(User.TYPE.USER)
            .example(User.TYPE.USER),
        }),
      },
    };
  };

  /**
   * @inheritdoc
   */
  async handler(kernel, request, _h) {
    if (!request.user.isAdmin()) {
      throw kernel.Boom.unauthorized('You must be an admin');
    }

    request.payload.password = this._preparePassword(
      kernel,
      request.payload.password,
    );
    const { username, password } = request.payload;

    const User = this._userModel(request);
    const userExists = await User.count({ where: { username } });

    if (userExists) {
      throw kernel.Boom.conflict('Identity Already Exists');
    }

    const user = await User.create({ username, password });

    kernel.emit('user.register', user);

    return user;
  }
}

module.exports = Register;
