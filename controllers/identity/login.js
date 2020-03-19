const AuthController = require('./lib/base-ctrl');

class Login extends AuthController {
  method = () => 'POST';

  path = () => '/identity/login';

  features = () => ({ auth: false, ws: false, docs: true });

  config = ({ Joi }) => {
    return {
      description: 'Perform identity authentication to obtain JWT token.',
      notes: `
        In case of successfully obtaining authorization, JWT token is returned under "token" key.
        To authorize your calls to REST endpoints you should use either "Authorization: {token}" header or "?token={token}" query parameter.
        To authorize your calls to WebSocket endpoints you must use "?token={token}" query parameter.
      `,
      validate: this._validationSchema(Joi),
    };
  };

  /**
   * @inheritdoc
   */
  async handler(kernel, request, h) {
    request.payload.password = this._preparePassword(
      kernel,
      request.payload.password,
    );

    const { token } = await kernel.plugins.auth.authorize(kernel, request, h);

    return { token };
  }
}

module.exports = Login;
