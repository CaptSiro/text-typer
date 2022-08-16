class TextTyperAnimation extends SequantialAnimation {
  /** @type {HTMLElement} */
  element;
  /** @type {string} */
  finishedText;

  /**
   * @param {SequantialAnimationStep} step 
   * @param {HTMLElement} element 
   * @param {string} finishedText 
   */
  constructor (step, element, finishedText) {
    super(step, new FireAble(tta => {
      tta.element.textContent = tta.finishedText;
    }));

    this.element = element;
    this.finishedText = finishedText;
  }
}