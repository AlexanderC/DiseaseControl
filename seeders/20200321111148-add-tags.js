'use strict';

const { MYSQL_NOW } = process.env;

module.exports = {
  up: (queryInterface, _Sequelize) => {
    return queryInterface.bulkInsert(
      'Tags',
      [
        {
          name: 'copii',
          description: 'Copii',
          createdAt: MYSQL_NOW,
          updatedAt: MYSQL_NOW,
        },
        {
          name: 'adulti',
          description: 'Adulti',
          createdAt: MYSQL_NOW,
          updatedAt: MYSQL_NOW,
        },
        {
          name: 'gravide',
          description: 'Femei gravide',
          createdAt: MYSQL_NOW,
          updatedAt: MYSQL_NOW,
        },
        {
          name: 'forma-usoara',
          description: 'Forma usoara',
          createdAt: MYSQL_NOW,
          updatedAt: MYSQL_NOW,
        },
        {
          name: 'forma-medie',
          description: 'Forma medie',
          createdAt: MYSQL_NOW,
          updatedAt: MYSQL_NOW,
        },
        {
          name: 'forma-severa',
          description: 'Forma severa',
          createdAt: MYSQL_NOW,
          updatedAt: MYSQL_NOW,
        },
      ],
      {},
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete(
      'Tags',
      {
        name: {
          [Sequelize.Op.in]: [
            'copii',
            'adulti',
            'gravide',
            'forma-usoara',
            'forma-medie',
            'forma-severa',
          ],
        },
      },
      {},
    );
  },
};
