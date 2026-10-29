// The legacy preview test is adapted to the modular companion interface.
// State transitions are exercised separately by tests/engine.test.cjs.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const html = fs.readFileSync('index.html', 'utf8');
for (const script of ['src/eclaire-engine.js', 'src/eclaire-widget.js', 'src/demo.js']) {
  assert.ok(html.includes('src="' + script + '"'), script + ' must be loaded');
  assert.ok(fs.existsSync(script), script + ' must exist');
}
for (const control of ['data-mode="idle"', 'data-mode="waiting"', 'data-mode="active-work"',
                       'data-signal="failure"', 'data-scenario="success"', 'data-scenario="failure"',
                       'id="reduce-motion"', 'id="stop-scenario"']) {
  assert.ok(html.includes(control), 'Missing companion control: ' + control);
}
assert.match(html, /aria-live="polite"/);
assert.match(html, /button:focus-visible/);
console.log('OK: modular companion preview controls and reduced-motion toggle');
