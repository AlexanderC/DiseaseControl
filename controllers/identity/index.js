const MeController = require('./me');
const LoginController = require('./login');
const RegisterController = require('./register');
const ResetController = require('./reset');
const PromoteController = require('./promote');

module.exports = [
  new MeController(),
  new LoginController(),
  new ResetController(),
  new PromoteController(),
  new RegisterController(),
];
