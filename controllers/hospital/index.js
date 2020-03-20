const ListController = require('./list');
const CreateController = require('./create');
const UpdateController = require('./update');
const RemoveController = require('./remove');

module.exports = [
  new ListController(),
  new CreateController(),
  new RemoveController(),
  new UpdateController(),
];
