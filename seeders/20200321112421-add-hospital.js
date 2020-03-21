'use strict';

const { MYSQL_NOW } = process.env;

module.exports = {
  up: (queryInterface, _Sequelize) => {
    return queryInterface.bulkInsert(
      'Hospitals',
      [
        {
          name: 'scmbcc',
          description:
            'Spitalul Clinic Municipal de Boli Contagioase pentru Copii',
          createdAt: MYSQL_NOW,
          updatedAt: MYSQL_NOW,
        },
        {
          name: 'tomaciorba',
          description: 'Spitalul Clinic de Boli Infecftioase "Toma Ciorba"',
          createdAt: MYSQL_NOW,
          updatedAt: MYSQL_NOW,
        },
        {
          name: 'mama-copilul',
          description: 'Institutul Mamei si Copilului',
          createdAt: MYSQL_NOW,
          updatedAt: MYSQL_NOW,
        },
        {
          name: 'scr',
          description: 'Spitalul Clinic Republican "Timofei Mosneaga"',
          createdAt: MYSQL_NOW,
          updatedAt: MYSQL_NOW,
        },
      ],
      {},
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete(
      'Hospitals',
      {
        name: {
          [Sequelize.Op.in]: ['scmbcc', 'tomaciorba', 'mama-copilul', 'scr'],
        },
      },
      {},
    );
  },
};
