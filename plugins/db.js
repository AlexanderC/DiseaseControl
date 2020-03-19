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
}

module.exports = DB;
