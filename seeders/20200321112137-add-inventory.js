'use strict';

const { MYSQL_NOW } = process.env;

module.exports = {
  up: (queryInterface, _Sequelize) => {
    return queryInterface.bulkInsert(
      'Inventories',
      [
        {
          name: 'pat',
          description: 'Pat liber',
          createdAt: MYSQL_NOW,
          updatedAt: MYSQL_NOW,
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
