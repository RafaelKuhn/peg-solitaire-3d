export default class UniqueDomEvent {

  private _event: callback|null = null;

  private type: keyof GlobalEventHandlersEventMap;

  public constructor(type: keyof GlobalEventHandlersEventMap) {
    this.type = type;
  }

  public setEvent(newEvent: callback) {
    if (this._event !== null) {
      window.removeEventListener(this.type, this._event);  
    }

    this._event = newEvent;
    window.addEventListener(this.type, this._event);
  }

  public unsetEvent() {
    if (this._event !== null) {
      window.removeEventListener(this.type, this._event);
      this._event = null;
    }
  }

}

type callback = (any?) => void;