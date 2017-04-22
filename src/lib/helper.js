class Helper {
  constructor({ paneIndex, source }) {
    this._dragPromise = new Promise((resolve, reject) => {
      this._dragResolve = resolve;
      this._dragReject = reject;
    });

    this._dropPromise = new Promise((resolve, reject) => {
      this._dropResolve = resolve;
      this._dropReject = reject;
    });

    this.paneIndex = paneIndex;
    this.source = source;
  }

  wait() {
    return Promise.all([this._dragPromise, this._dropPromise]);
  }
}

export default Helper;
