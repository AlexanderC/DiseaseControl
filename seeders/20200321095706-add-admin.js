'use strict';

const crypto = require('crypto');

function hash(password) {
  return crypto
    .createHmac('sha256', process.env.SEC_SEED)
    .update(password)
    .digest('hex');
}

module.exports = {
  up: (queryInterface, _Sequelize) => {
    return queryInterface.bulkInsert(
      'Users',
      [
        {
          username: 'admin@example.com',
          password: hash('password'),
          type: 'admin',
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
