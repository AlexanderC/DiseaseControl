'use strict';

const crypto = require('crypto');

function hash(password) {
  return crypto
    .createHmac('sha256', process.env.SEC_SEED)
    .update(password)
    .digest('hex');
}

const { MYSQL_NOW } = process.env;

module.exports = {
  up: (queryInterface, _Sequelize) => {
    return queryInterface.bulkInsert(
      'Users',
      [
        {
          username: 'admin@example.com',
          password: hash('password'),
          type: 'admin',
          createdAt: MYSQL_NOW,
          updatedAt: MYSQL_NOW,
        },
      ],
      {},
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete(
      'Users',
      { username: { [Sequelize.Op.in]: ['admin@example.com'] } },
      {},
    );
  },
};
