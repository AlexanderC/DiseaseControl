const path = require('path');
const fs = require('fs-extra');
const Hapi = require('@hapi/hapi');
const Boom = require('boom');
const dotenv = require('dotenv');
const origDebug = require('debug');
const Kernel = require('../src/kernel');

const debug = (...args) =>
  process.env.DEBUG ? origDebug('qu')(...args) : undefined;
const init = async () => {
  // Configure environment
  let configFile = path.resolve(process.cwd(), '.env');
  if (!(await fs.exists(configFile))) {
    configFile = path.resolve(process.cwd(), 'sample.env');
  }
  dotenv.config({ path: configFile });

  // Configure server and initialize kernel
  const server = Hapi.server({
    port: process.env.SERVER_PORT,
    host: process.env.SERVER_HOST,
    debug: process.env.DEBUG
      ? { request: process.env.DEBUG, log: process.env.DEBUG }
      : false,
    state: {
      strictHeader: false, // Avoid "invalid cookie name" error
    },
    routes: {
      validate: {
        failAction: async (_request, _h, error) => {
          if (error.isBoom) {
            throw Boom.badRequest(error.output.payload.message);
          }

          throw Boom.badRequest(error.message);
        },
      },
    },
  });
  const kernel = new Kernel(server);

  // Register logging handlers
  kernel.on('plugin', pin =>
    console.info('Loaded plugin <%s>', pin.constructor.name),
  );
  kernel.on('feature.register', name =>
    console.info('Registered feature <%s>', name),
  );
  kernel.on('feature.use', (name, target, opts) => {
    console.info(
      'Using feature <%s>',
      name,
      'target=',
      target,
      'options=',
      opts,
    );
  });
  kernel.on('controller', (ctrl, route) => {
    console.info(
      'Loaded ctrl <%s> at %s:%s',
      ctrl.constructor.name,
      ctrl.method(kernel),
      ctrl.path(kernel),
      'route=',
      route,
    );
  });

  // Register debugging handlers
  kernel.on('request', (req, ctrl) => {
    debug(
      `Incoming request on "${req.route.fingerprint}" dispatched by <${ctrl.constructor.name}>`,
      'payload=',
      req.payload,
    );
  });

  // These might be different, depending on settings
  // eslint-disable-next-line global-require
  const plugins = require('../plugins');
  // eslint-disable-next-line global-require
  const controllers = require('../controllers');

  // Configure and bootstrap kernel
  await kernel.plugin(...plugins);
  await kernel.controller(...controllers);
  await kernel.bootstrap();

  console.log('Server running on %s', server.info.uri);
};

// Handle unexpected issues
process.on('unhandledRejection', error => {
  console.log(error);
  process.exit(1);
});

// Start the server
init();
