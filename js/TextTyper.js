class TextTyper {
  #typerElement;
  #aniManager;

  static SPEED_NORMAL = 125;
  #speed;
  set speed (val) {
    this.#speed = val;
  }
  get speed () {
    return this.#speed;
  }



  
  



  /**
   * @param {HTMLElement} element 
   */
  constructor (element, speed = 125) {
    this.#typerElement = element;
    this.#speed = speed;
    this.#aniManager = new TextTyperAnimationManager();
  }



  static writeMode = Object.freeze({
    APPEND: 0,
    REPLACE: 1,
    PREPEND: 2,
    AT: index => ({index})
  });

  /**
   * @param {string} text 
   * @param {number|{index: number}} writeMode 
   */
  async write (text, writeMode = 0) {
    const span = html({
      name: "span",
      className: ["-text-typer", "animate"]
    });

    let replacement;

    if (writeMode == TextTyper.writeMode.REPLACE) {
      let temp = this.#typerElement.innerText;
      this.#typerElement.textContent = "";
  
      span.innerText = temp;
      this.#typerElement.append(span);
  
      await this.#aniManager.deleteOut(span, temp, 25);
      replacement = text;
    }

    if (writeMode == TextTyper.writeMode.APPEND) {
      replacement = this.#typerElement.innerText + text;
      this.#typerElement.append(span);
    }

    if (writeMode == TextTyper.writeMode.PREPEND) {
      replacement = text + this.#typerElement.innerText;
      this.#typerElement.prepend(span);
    }

    if (writeMode.index !== undefined) {
      let start = this.#typerElement.innerText.substring(0, writeMode.index);
      let end = this.#typerElement.innerText.substring(writeMode.index);
      
      replacement = start + text + end;
      this.#typerElement.textContent = "";
      this.#typerElement.append(document.createTextNode(start), span, document.createTextNode(end));
    }
    
    await this.#aniManager.push(this.#aniManager.typeInFactory(
      span,
      text,
      text,
      this.#speed,
      _ => {
        this.#typerElement.textContent = replacement;
      }
    ));

  }

  /**
   * @param {string} haystack 
   * @param {string} needle 
   */
  #find = (haystack, needle) => {
    if (haystack.length < needle.length) return [];
    const coords = [];

    for (let i = 0; i < haystack.length; i++) {
      let equals = true;
      for (let o = 0; o < needle.length; o++) {
        if (haystack[i + o] !== needle[o]) {
          equals = false;
          break;
        }
      }

      if (equals === true) {
        coords.push([i, i + needle.length]);
      }
    }

    return coords;
  }

  /**
   * @param {string} text If set to undefined => deletes whole content
   * @param {number} position Set `-` to index from the end starting at `-1`
   * @param {number} count 
   * @param {string} replace Value to replace with
   */
  async delete (text = undefined, position = 0, count = 1, replace = undefined) {
    let replacement = "";

    if (text !== undefined) {
      count = Math.floor(Number(count));
      if (count < 1) return;
      
      const original = this.#typerElement.innerText;
      const coords = this.#find(original, text);
      position = Math.floor(Number(position));
      position = (position < 0) ? (coords.length + position) : position;
  
      if (position >= coords.length || position < 0) return;
  
      const toBeRemoved = coords.slice(position, position + count).flat();
      const elements = [];
  
      let last = 0;
      for (let i = 0; i < toBeRemoved.length + 1; i++) {
        const substr = original.substring(last, toBeRemoved[i]);
        last = toBeRemoved[i];
  
        if (substr === "") continue;
  
        if (substr === text) {
          elements.push(html({
            name: "span",
            className: "-text-typer",
            content: substr
          }));

          if (replace !== undefined) {
            replacement += replace;
          }
        } else {
          elements.push(document.createTextNode(substr));
          replacement += substr;
        }
      }
  
      this.#typerElement.textContent = "";
      this.#typerElement.append(...elements);
      const filtered = elements.filter(e => e.tagName === "SPAN");
  
      for (let i = 0; i < filtered.length; i++) {
        filtered[i].classList.add("animate");
        const t = filtered[i].innerText;
        
        if (replace === undefined) {
          if (i !== filtered.length - 1) {
            await this.#aniManager.deleteOut(filtered[i], t, 25);
            filtered[i].classList.remove("animate");
          } else {
            await this.#aniManager.push(this.#aniManager.deleteOutFactory(
              filtered[i],
              t,
              "",
              25,
              _ => {
                this.#typerElement.textContent = replacement;
              }
            ));
          }
        } else {
          if (i !== filtered.length - 1) {
            await this.#aniManager.deleteOut(filtered[i], t, 25);
            await this.#aniManager.typeIn(filtered[i], replace, this.#speed);
            filtered[i].classList.remove("animate");
          } else {            
            await this.#aniManager.deleteOut(filtered[i], t, 25);
            await this.#aniManager.push(this.#aniManager.typeInFactory(
              filtered[i],
              replace,
              replace,
              this.#speed,
              _ => {
                this.#typerElement.textContent = replacement;
              }
            ));
          }
        }
      }
    } else {
      const span = html({
        name: "span",
        className: ["-text-typer", "animate"]
      });

      const temp = this.#typerElement.innerText;
      this.#typerElement.textContent = "";

      span.innerText = temp;
      this.#typerElement.append(span);

      await this.#aniManager.push(this.#aniManager.deleteOutFactory(
        span,
        temp,
        "",
        25,
        _ => {
          this.#typerElement.textContent = replacement;
        }
      ));
    }
  }

  /**
   * @param {string} text text to replace
   * @param {string} replace
   * @param {number} position Set `-` to index from the end starting at `-1`
   * @param {number} count 
   */
  replace (text, replace, position = 0, count = 1) {
    return this.delete(text, position, count, replace);
  }

  async abort () {
    return this.#aniManager.abort();
  }
}