const ListController = require('./list');
const WebsocketListController = require('./list-ws');
const CreateController = require('./create');
const PatchController = require('./patch');
const RemoveController = require('./remove');
const UpdateInventoryController = require('./update-inventory');

module.exports = [
  new ListController(),
  new WebsocketListController(),
  new CreateController(),
  new RemoveController(),
  new PatchController(),
  new UpdateInventoryController(),
];
