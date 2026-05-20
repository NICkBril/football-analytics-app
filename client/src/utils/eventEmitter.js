// ============================================================
// START: LAB 7 — Reactive Communication with Observables or EventEmitters
// ============================================================

export class EventEmitter {
  constructor() {
    this.listeners = {};
  }

  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  off(event, callback) {
    if (!this.listeners[event]) {
      return;
    }
    this.listeners[event] = this.listeners[event].filter((cb) => {
      return cb !== callback;
    });
  }

  emit(event, data) {
    if (!this.listeners[event]) {
      return;
    }
    this.listeners[event].forEach((callback) => {
      return callback(data);
    });
  }
}

export const favoritesEmitter = new EventEmitter();
// END: LAB 7