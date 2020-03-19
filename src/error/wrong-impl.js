class WrongImplementationError extends TypeError {
  /**
   * @param {object|function} thing
   * @param {object|function} expectation
   */
  constructor(thing, expectation) {
    super(
      `${WrongImplementationError._constr(
        thing,
      )} must an instance of ${WrongImplementationError._constr(expectation)}`,
    );
  }

  /**
   * Stringify the thing
   * @param {*} x
   * @returns {string} Return constructor name name
   */
  static _constr(x) {
    return typeof x === 'object' ? x.constructor.name : x.name;
  }

  /**
   * Assert expected type
   * @param {object|function} thing
   * @param {object|function} expectation
   */
  static assert(thing, expectation) {
    const isProto = thing.prototype instanceof expectation;
    const isInstance = thing instanceof expectation;

    if (!isProto && !isInstance) {
      throw new this(thing, expectation);
    }
  }
}

module.exports = WrongImplementationError;
