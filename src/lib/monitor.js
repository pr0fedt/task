import EventEmitter from 'events';

class Monitor {
  constructor() {
    this._emitter = new EventEmitter;
    this._isDragging = false;
  }

  getEmitter() {
    return this._emitter;
  }

  toggleDragging(isDragging) {
    if (this._isDragging === isDragging) {
      throw new Error('state mismatch');
    }

    this._isDragging = isDragging;
  }
}

export default Monitor;
