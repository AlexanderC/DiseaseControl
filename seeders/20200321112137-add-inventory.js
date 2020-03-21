'use strict';

module.exports = {
  up: (queryInterface, _Sequelize) => {
    return queryInterface.bulkInsert(
      'Inventories',
      [
        {
          name: 'pat',
          description: 'Pat liber',
        },
      ],
      {},
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete(
      'Inventories',
      { name: { [Sequelize.Op.in]: ['pat'] } },
      {},
    );
  },
};
