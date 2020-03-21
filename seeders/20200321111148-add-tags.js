'use strict';

module.exports = {
  up: (queryInterface, _Sequelize) => {
    return queryInterface.bulkInsert(
      'Tags',
      [
        {
          name: 'copii',
          description: 'Copii',
        },
        {
          name: 'adulti',
          description: 'Adulti',
        },
        {
          name: 'gravide',
          description: 'Femei gravide',
        },
        {
          name: 'forma-usoara',
          description: 'Forma usoara',
        },
        {
          name: 'forma-medie',
          description: 'Forma medie',
        },
        {
          name: 'forma-severa',
          description: 'Forma severa',
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
