'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'Hospitals',
      [
        {
          name: 'scmbcc',
          description:
            'Spitalul Clinic Municipal de Boli Contagioase pentru Copii',
        },
        {
          name: 'tomaciorba',
          description: 'Spitalul Clinic de Boli Infecftioase "Toma Ciorba"',
        },
        {
          name: 'mama-copilul',
          description: 'Institutul Mamei si Copilului',
        },
        {
          name: 'scr',
          description: 'Spitalul Clinic Republican "Timofei Mosneaga"',
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
