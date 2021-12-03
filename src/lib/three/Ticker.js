import { Clock } from "three";

export default class {

  /** @type {Clock} */ #clock;
  /** @type {Array} */ #events;

  constructor() {
    this.#events = []

    this.#createUpdateLoop();
  }


  addOnTickEvent(callback) {
    this.#events.push(callback);
  }

  removeOnTickEvent(callback) {
    this.#events = this.#events.filter(subscriber => subscriber !== callback);
  }

  getElapsedTime() {
    return this.#clock.getElapsedTime();
  }

  getDeltaTime() {
    return this.#clock.getDelta();
  }
  

  #createUpdateLoop() {
    this.#clock = new Clock();
    this.tick = () => {  
      this.#notifyTickEvents()

      // Call tick again on the next frame
      window.requestAnimationFrame(this.tick)
    }
  }

  #notifyTickEvents() {
    this.#events.forEach(callback => callback());
  }

}