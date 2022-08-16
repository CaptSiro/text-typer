class SequantialAnimation {
  /** @type {boolean} */
  #abort = false;
  abort () {
    this.#abort = true;

    return new Promise(resolve => {
      this.#finishEvent.addListener(_ => {
        resolve();
      });
    })
  }
  /**
   * @callback SequantialAnimationStep
   * @param {number=} iteration
   * @param {SequantialAnimation=} animation
   * @returns {boolean} return `true` to end animation
   */
  /** @type {SequantialAnimationStep|Promise} */
  step;
  /** @type {number} */
  iteration = 0;
  /** @type {FireAble<SequantialAnimation>} */
  #finishEvent;
  /**
   * @param {Listener|Listener[]} listener 
   */
  onFinished (listener) {
    this.#finishEvent.addListener(listener);
  }

  /**
   * @param {SequantialAnimationStep} step 
   * @param {FireAble<SequantialAnimation>} finishEvent 
   */
  constructor (step, finishEvent) {
    this.step = step;
    this.#finishEvent = finishEvent;
  }

  /**
   * @returns {boolean}
   */
  next () {
    return this.step(this.iteration++, this);
  }

  /**
   * @returns {Promise<boolean>}
   */
  async nextAsync () {
    return await this.step(this.iteration++, this);
  }

  play () {
    let run = false;
    if (this.step.constructor.name !== "AsyncFunction") {
      while (run !== true) {
        if (this.#abort === true) {
          break;
        }
        run = this.next();
      }
      
      this.#finishEvent.fire(this);
      return;
    }
    
    return new Promise((async resolve => {
      while (run !== true) {
        if (this.#abort === true) {
          break;
        }
        run = await this.nextAsync();
      }
  
      this.#finishEvent.fire(this);
      resolve();
    }).bind(this));
  }
}