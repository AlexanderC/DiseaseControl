const JSONStrategy = require('./json');
const DBStrategy = require('./db');

module.exports = {
  json: JSONStrategy,
  db: DBStrategy,
};
