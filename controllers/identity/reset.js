const cryptoRandomString = require('crypto-random-string');
const AuthController = require('./lib/base-ctrl');

class Reset extends AuthController {
  method = () => 'POST';

  path = () => '/identity/reset';

  features = () => ({ auth: false, ws: true, docs: true });

  config = ({ Joi }) => {
    return {
      description: 'Reset account password.',
      validate: this._validationSchema(Joi, /* onlyUsername = */ true),
    };
  };

  /**
   * @inheritdoc
   */
  async handler(kernel, request, _h) {
    const { username } = request.payload;

    const User = this._userModel(request);
    const user = await User.findOne({ where: { username } });

    if (!user) {
      throw kernel.Boom.notFound('Identity Does Not Exist');
    }

    const password = cryptoRandomString({ length: 8 });
    await user.update({ password: this._preparePassword(kernel, password) });

    const to = user.username;
    const parameters = { user, password };
    const template = 'reset';

    await kernel.plugins.mailer.send({ to, template, parameters });

    return { message: 'Password Reset Request Received' };
  }
}

module.exports = Reset;
