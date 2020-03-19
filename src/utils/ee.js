const OriginalEventEmitter = require('events');
const WrongImplementationError = require('../error/wrong-impl');

class EventEmitter extends OriginalEventEmitter {
  _pipes = [];

  /**
   * Pipe all events from original emitter with or without a prefix
   * @param {OriginalEventEmitter} consumer
   * @param {string} prefix
   * @returns {EventEmitter}
   */
  pipe(consumer, prefix = null) {
    WrongImplementationError.assert(consumer, OriginalEventEmitter);

    this._pipes.push({ consumer, prefix });

    return this;
  }

  /**
   * Remove registered pipes
   * @returns {EventEmitter}
   */
  depipe() {
    this._pipes = [];

    return this;
  }

  /**
   * @inheritdoc
   * @returns {boolean} True if itself or piped
   *  emitters has listeners on propagated event
   */
  emit(eventName, ...args) {
    return (
      [
        super.emit(eventName, ...args),
        this._pipes.map(({ consumer, prefix }) => {
          return consumer.emit(
            prefix ? `${prefix}.${eventName}` : eventName,
            ...args,
          );
        }),
      ].filter(Boolean).length > 0
    );
  }
}

module.exports = EventEmitter;
