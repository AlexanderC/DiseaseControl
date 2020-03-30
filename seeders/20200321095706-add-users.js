'use strict';

const crypto = require('crypto');

function hash(password) {
  return crypto
    .createHmac('sha256', process.env.SEC_SEED)
    .update(password)
    .digest('hex');
}

const USERS = ['admin', 'user', 'supervisor']; // user types/names
const { MYSQL_NOW } = process.env;

module.exports = {
  up: (queryInterface, _Sequelize) => {
    return queryInterface.bulkInsert(
      'Users',
      USERS.map(user => ({
        username: `${user}@example.com`,
        password: hash('password'),
        type: user,
        createdAt: MYSQL_NOW,
        updatedAt: MYSQL_NOW,
      })),
      {},
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete(
      'Users',
      {
        username: {
          [Sequelize.Op.in]: USERS.map(user => `${user}@example.com`),
        },
      },
      {},
    );
  },
};
