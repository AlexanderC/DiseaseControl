const AuthController = require('./lib/base-ctrl');

class Register extends AuthController {
  method = () => 'POST';

  path = () => '/identity/register';

  features = () => ({ auth: false, ws: false, docs: true });

  config = ({
    Joi,
    plugins: {
      docs: { getBaseUrl },
    },
  }) => {
    const fullBaseUrl = getBaseUrl();

    return {
      description: 'Register a new identity.',
      notes: `In order to obtain JWT token use "${fullBaseUrl}/identity/login" endpoint.`,
      validate: this._validationSchema(Joi),
    };
  };

  /**
   * @inheritdoc
   */
  async handler(kernel, request, _h) {
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
