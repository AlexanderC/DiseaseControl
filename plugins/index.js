const Core = require('./core');
const Docs = require('./docs');
const Health = require('./health');
const Auth = require('./auth');
const WebSocketServer = require('./wss');
const DB = require('./db');
const Paginate = require('./paginate');
const Mailer = require('./mailer');

module.exports = [
  new Core(),
  new Health(),
  new Auth(),
  new WebSocketServer(),
  new DB(),
  new Paginate(),
  new Mailer(),
  new Docs(),
];
