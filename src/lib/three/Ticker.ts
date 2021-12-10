import { Clock } from "three";

export default class {

  public tick: Callback;

  private clock: Clock;
  private events: Array<Callback>;
  
  constructor() {
    this.events = new Array<Callback>();
    this.clock = new Clock();

    this.tick = () => {
      this.events.forEach(callback => callback());
      
      // Call tick again on the next frame
      window.requestAnimationFrame(this.tick)
    }
  }
  
  public pushOnTickEvent(callback: Callback) {
    this.events.push(callback);
  }

  public unshiftOnTickEvent(callback: Callback) {
    this.events.unshift(callback);
  }

  public removeOnTickEvent(callback: Callback) {
    this.events = this.events.filter(subscriber => subscriber !== callback);
  }

  public getElapsedTime() {
    return this.clock.getElapsedTime();
  }

  public getDeltaTime() {
    return this.clock.getDelta();
  }

}

type Callback = () => void;