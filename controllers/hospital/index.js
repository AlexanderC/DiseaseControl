const ListController = require('./list');
const CreateController = require('./create');
const PatchController = require('./patch');
const RemoveController = require('./remove');
const UpdateInventoryController = require('./update-inventory');

module.exports = [
  new ListController(),
  new CreateController(),
  new RemoveController(),
  new PatchController(),
  new UpdateInventoryController(),
];
