const crypto = require('crypto');
const BaseController = require('./lib/base-ctrl');

class List extends BaseController {
  method = () => 'POST';

  path = () => '/hospital/live';

  features = () => ({
    auth: false,
    ws: { only: true, autoping: 30 * 1000 },
    docs: true,
  });

  config = ({
    Joi,
    plugins: {
      docs: { getBaseUrl },
    },
  }) => {
    const baseUrl = getBaseUrl(/* includeProtocol = */ false);

    return {
      description: 'Subscribe to hospital changes.',
      notes: `
        To test connection use "wscat --connect ${baseUrl}/hospital/live".
        -----------
        > To subscribe to changes send an empty frame.
        > To install wscat run "npm i -g wscat"
      `,
    };
  };

  /**
   * @inheritdoc
   */
  async handler(_kernel, request, _h) {
    let lastHash = null;

    const tick = async (id = null) => {
      const { peers, ws } = request.websocket();

      try {
        const { hash, data } = await this._tick(request);

        if (id && (!peers || peers.length <= 0)) {
          clearInterval(id);
          return JSON.parse(data);
        }

        if (hash !== lastHash) {
          lastHash = hash;
          ws.send(data);
        }
      } catch (e) {
        clearInterval(id);
        throw e;
      }

      return null;
    };

    await tick();

    return new Promise((resolve, reject) => {
      const id = setInterval(async () => {
        try {
          const data = await tick(id);

          if (data) {
            resolve(data);
          }
        } catch (e) {
          reject(e);
        }
      }, 30000);
    });
  }

  /**
   * @param {Hapi.Request} request
   * @returns {object}
   */
  async _tick(request) {
    const Hospital = this._hospitalModel(request);
    const data = JSON.stringify(
      await Hospital.scope('tags', 'inventory', 'supervisors').findAll(),
    );
    const hash = crypto
      .createHash('md5')
      .update(data)
      .digest('hex');

    return { hash, data };
  }
}

module.exports = List;
