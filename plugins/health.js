const HapiAndHealthy = require('hapi-and-healthy');
const Plugin = require('../src/plugin');

/**
 * @ref https://www.npmjs.com/package/hapi-and-healthy
 */
class Healthcheck extends Plugin {
  _checks = [];

  /**
   * @inheritdoc
   */
  name() {
    return 'health';
  }

  /**
   * @inheritdoc
   */
  instance(kernel) {
    return {
      plugin: HapiAndHealthy,
      options: {
        tags: ['api', 'docs'],
        test: {
          node: [
            async () => {
              await Promise.all(this._checks.map(x => x(kernel)));

              return true;
            },
          ],
        },
      },
    };
  }

  /**
   * @param {...function} handler
   */
  addCheck(...handler) {
    this._checks.push(...handler);

    return this;
  }
}

module.exports = Healthcheck;
