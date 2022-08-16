/** @template T */
class FireAble {
  /**
   * @callback Listener
   * @param {T} fireValue
   * @returns {void}
   */
  
  /** @type {Listener[]} */
  #callbacks = [];
  
  /**
   * @param {Listener=} defaultListener 
   */
  constructor (defaultListener = undefined) {
    if (defaultListener !== undefined) {
      this.addListener(defaultListener);
    }
  }

  /** 
   * @param {Listener|Listener[]} listener 
   */
  addListener (listener) {
    if (listener instanceof Array) {
      this.#callbacks = this.#callbacks.concat(listener);
      return;
    }
    
    this.#callbacks.push(listener);
  }

  /**
   * @param {T} value
   */
  fire (value) {
    for (let i = 0; i < this.#callbacks.length; i++) {
      this.#callbacks[i](value);
    }
  }
}