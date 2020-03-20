const Strategy = require('../strategy');

class DBStrategy extends Strategy {
  /**
   * @param {object} config
   * @example {
   *   model: 'User'
   * }
   */
  constructor(config) {
    super();

    this.config = config;
  }

  /**
   * @inheritdoc
   */
  async authorize(_kernel, request, _h) {
    const { username, password } = request.payload;

    const user = await this._model(request).findOne({
      where: { username, password },
      attributes: ['id', 'password', 'type'],
    });

    return user || false;
  }

  /**
   * @inheritdoc
   */
  async validate(_kernel, decoded, request, _h) {
    const { id, password } = decoded;

    const user = await this._model(request).findOne({
      where: { id, password },
    });

    return user || false;
  }

  /**
   * Get model to work
   * @param {Hapi.Request} request
   * @returns {Sequelize.Model}
   */
  _model(request) {
    return request.getModel(this.config.model);
  }
}

module.exports = DBStrategy;
