const ListController = require('./list');
const UpsertController = require('./upsert');

module.exports = [new ListController(), new UpsertController()];
