const Strategy = require('../strategy');

class JsonStrategy extends Strategy {
  /**
   * @param {object} people
   * @example {
   *   1: {
   *     id: 1,
   *     username: 'user',
   *     password: 'password',
   *   },
   * }
   */
  constructor(people) {
    super();

    this.people = people;
  }

  /**
   * @inheritdoc
   */
  async authorize(_kernel, request, _h) {
    const { username, password } = request.payload;

    for (const user of Object.values(this.people)) {
      if (user.username === username && user.password === password) {
        return { id: user.id };
      }
    }

    return false;
  }

  /**
   * @inheritdoc
   */
  async validate(_kernel, decoded, _request, _h) {
    return this.people.hasOwnProperty(decoded.id);
  }
}

module.exports = JsonStrategy;
