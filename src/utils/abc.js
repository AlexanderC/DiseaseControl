class AbstractClass {
  constructor(_class, _required) {
    if (this.constructor === _class) {
      throw new Error(
        `Abstract class ${_class.name} cannot be instantiated without a subclass implementation.`,
      );
    }

    // This weird trick is to allow defininf class properties using new syntax
    // @todo remove when fixed
    process.nextTick(() => {
      for (const method of _required) {
        if (typeof this[method] !== 'function') {
          throw new Error(
            `Classes extending abstract class "${_class.name}" ` +
              `must implement "${_class.name}.${method}()"`,
          );
        }
      }
    });
  }
}

module.exports = AbstractClass;
