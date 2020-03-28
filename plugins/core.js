const { default: HapiGracefulPM2 } = require('hapi-graceful-pm2');
const Twig = require('twig');
const HapiCORS = require('hapi-cors');
const HapiVision = require('@hapi/vision');
const path = require('path');
const Plugin = require('../src/plugin');

/**
 * @ref https://github.com/roylines/hapi-graceful-pm2
 */
class Core extends Plugin {
  /**
   * @inheritdoc
   */
  name() {
    return 'core';
  }

  /**
   * @inheritdoc
   */
  instance() {
    return [
      HapiVision,
      {
        plugin: HapiGracefulPM2,
        options: { timeout: 4000 },
      },
      {
        plugin: HapiCORS,
        options: {
          origins: ['*'],
          methods: ['POST, GET, OPTIONS', 'PUT', 'PATCH', 'DELETE'],
          allowCredentials: 'true',
        },
      },
    ];
  }

  /**
   * @inheritdoc
   */
  async load(kernel) {
    kernel.server.views({
      engines: {
        twig: {
          compile: (src, options) => {
            const template = Twig.twig({ id: options.filename, data: src });
            return ctx => template.render(ctx);
          },
        },
      },
      relativeTo: path.join(__dirname, '..'),
      path: 'templates',
    });
  }
}

module.exports = Core;
