export default class EventDispatcher<T> {

  private _event: callback<T>|null = null;

  public constructor() { }

  public dispatch(value: T) {
    if (this._event !== null) {
      this._event(value);
    }
  }

  public setEvent(newEvent: callback<T>) {
    this._event = newEvent;
  }

  public unsetEvent() {
    this._event = null;
  }

}

export type callback<T> = (any: T) => void;