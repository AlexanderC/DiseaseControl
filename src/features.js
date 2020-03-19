const Inflector = require('inflected');
const EventEmitter = require('./utils/ee');

/**
 * Features are some decorators applied to native object
 * passed to server.route (hapi). This functionality should
 * be used for making possible plugins and modules interaction
 * with registered routes
 */
class Features extends EventEmitter {
  _features = {};

  /**
   * Register a feature
   * @param {string} name
   * @param {string} handler
   * @returns {Features}
   */
  register(name, handler) {
    const normalizedName = this._normalizeName(name);
    this._features[normalizedName] = handler;
    this.emit('register', normalizedName, handler);

    return this;
  }

  /**
   * Register a feature
   * @param {string} name
   * @returns {Features}
   */
  deregister(name) {
    const normalizedName = this._normalizeName(name);
    delete this._features[normalizedName];
    this.emit('deregister', normalizedName);

    return this;
  }

  /**
   * Apply the feature on a target
   * @param {*} target
   * @param {string} name
   * @param {*} options
   * @returns {*}
   */
  async use(target, name, options = null) {
    if (!this.exists(name)) {
      throw new Error(`Missing feature "${name}`);
    }

    const normalizedName = this._normalizeName(name);

    this.emit('use', normalizedName, target, options);

    return this._features[normalizedName](target, options);
  }

  /**
   * Apply multiple features
   * @param {*} target
   * @param {object} features e.g. { name: options }
   * @returns {*}
   */
  async useAll(target, features) {
    let result = target;

    for (const name in features) {
      if (!features.hasOwnProperty(name)) {
        continue;
      }

      result = await this.use(result, name, features[name]);
    }

    return result;
  }

  /**
   * Check if feature exists
   * @param {string} name
   * @returns {boolean}
   */
  exists(name) {
    const normalizedName = this._normalizeName(name);
    return this._features.hasOwnProperty(normalizedName);
  }

  /**
   * List available features
   */
  get list() {
    return Object.keys(this._features);
  }

  /**
   * Normalize name string
   * @param {string} name
   * @returns {string}
   */
  _normalizeName(name) {
    return Inflector.constantify(name);
  }
}

module.exports = Features;
