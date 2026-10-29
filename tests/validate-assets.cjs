const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'animations.json'), 'utf8'));
const states = Object.entries(manifest.states);
assert.equal(states.length, 9);

for (const [name, state] of states) {
  assert(state.animation.endsWith('.gif'), name + ': animation expected');
  assert(Array.isArray(state.frames) && state.frames.length > 0, name + ': frames expected');
  for (const relative of [state.animation, state.frames[0]]) {
    assert(fs.existsSync(path.join(root, relative)), name + ': missing ' + relative);
  }
  assert.equal(state.frames[0], 'assets/' + name + '-00.png');
}
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
assert(html.includes('prefers-reduced-motion'));
for (const [name] of states) {
  assert(html.includes("'" + name + "'"), 'Preview missing state: ' + name);
}
console.log('OK: nine previews and accessible still frames');
