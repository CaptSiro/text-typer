class TextTyperAnimationManager {

  /** @type {TextTyperAnimation[]} */
  #stack = []; #running = false;

  /**
   * @param {TextTyperAnimation} animation 
   * @returns {Promise<void>}
   */
  push (animation) {
    this.#stack.push(animation);

    const p = new Promise(resolve => {
      animation.onFinished(() => {
        resolve();
      });
    });

    if (this.#running == false) {
      this.#run();
    }

    return p;
  }

  async #run () {
    this.#running = true;
    while (this.#stack.length !== 0) {
      const ani = this.#stack[0];
      await ani.play();

      this.#stack.shift();
    }
    this.#running = false;
  }


  /**
   * @param {HTMLElement} element 
   * @param {string} text 
   * @param {string} replacement
   * @param {number} speed
   * @param {Listener|Listener[]=} listeners
   */
  typeInFactory (element, text, replacement, speed, listeners) {
    const tta = new TextTyperAnimation(async i => {
      await sleep(flatRNG(speed, speed * 2));
      const substr = text.substring(0, i);
      element.textContent = substr;
      
      return text == substr;
    }, element, replacement);

    if (listeners !== undefined) {
      tta.onFinished(listeners);
    }

    return tta;
  }

  /**
   * @param {HTMLElement} element 
   * @param {string} text 
   * @param {number} speed
   */
  typeIn (element, text, speed) {
    return this.push(this.typeInFactory(element, text, text, speed));
  }

  /**
   * @param {HTMLElement} element 
   * @param {string} text 
   * @param {string} replacement
   * @param {number} speed
   * @param {Listener|Listener[]=} listeners
   */
  deleteOutFactory (element, text, replacement, speed, listeners) {
    const tta = new TextTyperAnimation(async i => {
      await sleep(flatRNG(speed, speed * 2));
      const substr = text.substring(0, text.length - (i + 1));
      element.textContent = substr;

      return substr == "";
    }, element, replacement);

    if (listeners !== undefined) {
      tta.onFinished(listeners);
    }

    return tta;
  }

  /**
   * @param {HTMLElement} element 
   * @param {string} text 
   * @param {number} speed
   */
  deleteOut (element, text, speed) {
    return this.push(this.deleteOutFactory(element, text, "", speed));
  }

  async abort () {
    if (this.#stack.length === 0) return;

    for (let i = 0; i < this.#stack.length; i++) {
      await this.#stack[i].abort();
    }
  }

}