const HapiSequelize = require('hapi-sequelizejs');
const Sequelize = require('sequelize');
const path = require('path');
const Plugin = require('../src/plugin');

/**
 * @ref https://github.com/valtlfelipe/hapi-sequelizejs
 */
class DB extends Plugin {
  DEFAULT_NAME = 'default';

  /**
   * @inheritdoc
   */
  name() {
    return 'db';
  }

  /**
   * @inheritdoc
   */
  instance() {
    return {
      plugin: HapiSequelize,
      options: [
        {
          name: this.DEFAULT_NAME,
          models: [
            path.join(__dirname, '..', process.env.DB_MODELS_PATH, '**/*.js'),
          ],
          sequelize: new Sequelize(process.env.DB_DSN),
          sync: true, // sync models - default false
          forceSync: !!parseInt(process.env.DB_FORCE_SYNC, 10), // force sync (drops tables) - default false
        },
      ],
    };
  }

  /**
   * Get default database
   * @param {Kernel} kernel
   * @returns {HapiSequelize.DB}
   */
  default(kernel) {
    return kernel.server.plugins['hapi-sequelizejs'].default;
  }

  /**
   * Initiate a transaction
   * @param {Kernel} kernel
   * @param {Function} handler
   * @returns {Sequelize.Transaction}
   */
  async transaction(kernel, handler) {
    const { sequelize } = this.default(kernel);

    return sequelize.transaction(handler);
  }

  /**
   * @returns {Sequelize}
   */
  get Sequelize() {
    return Sequelize;
  }
}

module.exports = DB;
