(function (root, factory) {
  'use strict';
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.EclaireEngine = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const MODES = Object.freeze(['idle', 'waiting', 'active-work']);
  const SIGNALS = Object.freeze(['jump', 'wave', 'review', 'failure', 'fly-left', 'fly-right']);
  const STATES = Object.freeze([...MODES, ...SIGNALS]);
  const DEFAULT_DURATIONS = Object.freeze({
    jump: 950, wave: 1150, review: 1550, failure: 2200,
    'fly-left': 1150, 'fly-right': 1150
  });

  function requireState(name, allowed, category) {
    if (!allowed.includes(name)) {
      throw new RangeError('Unknown ' + category + ': ' + String(name));
    }
  }

  function createController(options = {}) {
    const timers = options.timers || {
      setTimeout: (fn, ms) => setTimeout(fn, ms),
      clearTimeout: id => clearTimeout(id)
    };
    if (typeof timers.setTimeout !== 'function' || typeof timers.clearTimeout !== 'function') {
      throw new TypeError('timers must implement setTimeout and clearTimeout');
    }

    let mode = options.initialMode === undefined ? 'idle' : options.initialMode;
    requireState(mode, MODES, 'mode');

    const durations = { ...DEFAULT_DURATIONS, ...(options.durations || {}) };
    for (const name of SIGNALS) {
      if (!Number.isFinite(durations[name]) || durations[name] <= 0) {
        throw new RangeError('Invalid duration for ' + name);
      }
    }

    let state = mode;
    let transient = null;
    let timer = null;
    let generation = 0;
    let destroyed = false;
    const subscribers = new Set();

    function snapshot() {
      return Object.freeze({ state, mode, transient, busy: transient !== null });
    }

    function ensureAlive() {
      if (destroyed) throw new Error('Éclaire controller was destroyed');
    }

    function emit() {
      const current = snapshot();
      for (const listener of [...subscribers]) listener(current);
    }

    function cancelPending() {
      generation += 1;
      if (timer !== null) {
        timers.clearTimeout(timer);
        timer = null;
      }
    }

    function setMode(nextMode) {
      ensureAlive();
      requireState(nextMode, MODES, 'mode');
      const changed = state !== nextMode || mode !== nextMode || transient !== null;
      cancelPending();
      mode = nextMode;
      state = nextMode;
      transient = null;
      if (changed) emit();
      return snapshot();
    }

    function trigger(signal, config = {}) {
      ensureAlive();
      requireState(signal, SIGNALS, 'signal');
      const durationMs = config.durationMs === undefined ? durations[signal] : config.durationMs;
      if (!Number.isFinite(durationMs) || durationMs <= 0) {
        throw new RangeError('durationMs must be a finite positive number');
      }
      // Errors are not visually overwritten by low-priority signals.
      if (transient === 'failure' && signal !== 'failure') return false;

      cancelPending();
      transient = signal;
      state = signal;
      emit();

      const currentGeneration = generation;
      timer = timers.setTimeout(() => {
        if (destroyed || currentGeneration !== generation) return;
        timer = null;
        transient = null;
        state = mode;
        emit();
      }, durationMs);
      return true;
    }

    function subscribe(listener) {
      ensureAlive();
      if (typeof listener !== 'function') throw new TypeError('listener must be a function');
      subscribers.add(listener);
      listener(snapshot());
      return () => subscribers.delete(listener);
    }

    function destroy() {
      if (destroyed) return;
      cancelPending();
      destroyed = true;
      subscribers.clear();
    }

    return Object.freeze({
      getSnapshot: snapshot, setMode, trigger, subscribe, destroy
    });
  }

  return Object.freeze({ MODES, SIGNALS, STATES, DEFAULT_DURATIONS, createController });
});
