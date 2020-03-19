const MeController = require('./me');
const LoginController = require('./login');
const RegisterController = require('./register');
const ResetController = require('./reset');

module.exports = [
  new MeController(),
  new LoginController(),
  new ResetController(),
];

if (parseInt(process.env.AUTH_ALLOW_REGISTRATION, 10)) {
  module.exports.push(new RegisterController());
}
