'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { MODES, SIGNALS, STATES, createController } = require('../src/eclaire-engine.js');
const { createWidget } = require('../src/eclaire-widget.js');

function clock() {
  let now = 0;
  let nextId = 0;
  const jobs = new Map();
  return {
    setTimeout(fn, ms) {
      const id = ++nextId;
      jobs.set(id, { fn, at: now + ms });
      return id;
    },
    clearTimeout(id) { jobs.delete(id); },
    tick(ms) {
      const target = now + ms;
      while (true) {
        const next = [...jobs.entries()]
          .filter(([, job]) => job.at <= target)
          .sort((a, b) => a[1].at - b[1].at || a[0] - b[0])[0];
        if (!next) break;
        now = next[1].at;
        jobs.delete(next[0]);
        next[1].fn();
      }
      now = target;
    },
    pending() { return jobs.size; }
  };
}

test('every state is backed by GIF and still frame in the manifest', () => {
  const manifest = JSON.parse(fs.readFileSync(path.join(__dirname, '../animations.json'), 'utf8'));
  assert.equal(STATES.length, 9);
  assert.deepEqual(new Set(Object.keys(manifest.states)), new Set(STATES));
  for (const state of STATES) {
    const asset = manifest.states[state];
    assert.equal(asset.animation, 'assets/' + state + '.gif');
    assert.equal(asset.frames[0], 'assets/' + state + '-00.png');
    for (const file of [asset.animation, ...asset.frames]) {
      assert.ok(fs.existsSync(path.join(__dirname, '..', file)), file);
    }
  }
});

test('persistent mode resumes after a transient animation', () => {
  const timers = clock();
  const controller = createController({ timers });
  const history = [];
  const unsubscribe = controller.subscribe(snapshot => history.push(snapshot.state));
  assert.equal(controller.getSnapshot().state, 'idle');
  controller.setMode('active-work');
  assert.equal(controller.trigger('wave', { durationMs: 100 }), true);
  assert.equal(controller.getSnapshot().mode, 'active-work');
  timers.tick(99);
  assert.equal(controller.getSnapshot().state, 'wave');
  timers.tick(1);
  assert.equal(controller.getSnapshot().state, 'active-work');
  unsubscribe();
  controller.setMode('waiting');
  assert.deepEqual(history, ['idle', 'active-work', 'wave', 'active-work']);
  controller.destroy();
});

test('a new transient cancels the previous expiration', () => {
  const timers = clock();
  const controller = createController({ timers });
  controller.trigger('jump', { durationMs: 100 });
  timers.tick(50);
  controller.trigger('wave', { durationMs: 200 });
  timers.tick(70);
  assert.equal(controller.getSnapshot().state, 'wave');
  timers.tick(130);
  assert.equal(controller.getSnapshot().state, 'idle');
  assert.equal(timers.pending(), 0);
  controller.destroy();
});

test('failure cannot be overwritten by low-priority signals', () => {
  const timers = clock();
  const controller = createController({ timers, initialMode: 'waiting' });
  controller.trigger('failure', { durationMs: 200 });
  assert.equal(controller.trigger('jump'), false);
  timers.tick(200);
  assert.equal(controller.getSnapshot().state, 'waiting');
  assert.equal(controller.trigger('jump', { durationMs: 30 }), true);
  timers.tick(30);
  assert.equal(controller.getSnapshot().state, 'waiting');
  controller.destroy();
});

test('explicit mode changes cancel transient animations', () => {
  const timers = clock();
  const controller = createController({ timers });
  controller.trigger('review');
  controller.setMode('waiting');
  assert.equal(timers.pending(), 0);
  timers.tick(9999);
  assert.equal(controller.getSnapshot().state, 'waiting');
  controller.destroy();
});

test('invalid input and use after destruction fail predictably', () => {
  const controller = createController({ timers: clock() });
  assert.throws(() => controller.setMode('failure'), RangeError);
  assert.throws(() => controller.trigger('unknown'), RangeError);
  assert.throws(() => controller.trigger('jump', { durationMs: 0 }), RangeError);
  controller.destroy();
  assert.throws(() => controller.trigger('wave'), /destroyed/);
  assert.throws(() => controller.setMode('idle'), /destroyed/);
});

function fakeContainer() {
  const doc = {
    defaultView: { matchMedia: () => ({ matches: false }) },
    createElement() { return fakeElement(); }
  };
  function fakeElement() {
    const attrs = new Map();
    return {
      ownerDocument: doc,
      parentNode: null,
      children: [],
      getAttribute(name) { return attrs.get(name) || null; },
      setAttribute(name, value) { attrs.set(name, String(value)); },
      removeAttribute(name) { attrs.delete(name); },
      appendChild(child) { this.children.push(child); child.parentNode = this; },
      removeChild(child) {
        const i = this.children.indexOf(child);
        if (i >= 0) this.children.splice(i, 1);
        child.parentNode = null;
      }
    };
  }
  return fakeElement();
}

test('DOM widget follows state transitions and reduced-motion setting', () => {
  const container = fakeContainer();
  const timers = clock();
  const widget = createWidget(container, { timers, basePath: 'custom-assets' });
  assert.equal(container.children.length, 1);
  assert.equal(widget.element.getAttribute('src'), 'custom-assets/idle.gif');
  widget.setMode('active-work');
  assert.equal(container.getAttribute('data-eclaire-state'), 'active-work');
  widget.setReducedMotion(true);
  assert.equal(widget.element.getAttribute('src'), 'custom-assets/active-work-00.png');
  widget.trigger('wave', { durationMs: 40 });
  assert.equal(widget.element.getAttribute('src'), 'custom-assets/wave-00.png');
  timers.tick(40);
  assert.equal(widget.element.getAttribute('src'), 'custom-assets/active-work-00.png');
  widget.destroy();
  assert.equal(container.children.length, 0);
  assert.equal(container.getAttribute('data-eclaire-state'), null);
  widget.destroy();
  assert.throws(() => widget.trigger('jump'), /destroyed/);
});

test('mode/signal definitions stay disjoint', () => {
  assert.equal(MODES.length, 3);
  assert.equal(SIGNALS.length, 6);
  assert.equal(new Set(STATES).size, STATES.length);
});
