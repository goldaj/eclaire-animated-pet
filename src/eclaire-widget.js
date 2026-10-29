(function (root, factory) {
  'use strict';
  const engine = root && root.EclaireEngine
    ? root.EclaireEngine
    : (typeof module === 'object' && module.exports ? require('./eclaire-engine.js') : null);
  const api = factory(engine);
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.EclaireWidget = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function (engine) {
  'use strict';
  if (!engine) throw new Error('Load eclaire-engine.js before eclaire-widget.js');

  const LABELS = Object.freeze({
    idle: 'au repos', waiting: 'en attente', 'active-work': 'en plein travail',
    jump: 'saute', wave: 'fait coucou', review: 'vérifie son travail',
    failure: 'rencontre un problème', 'fly-left': 'vole vers la gauche',
    'fly-right': 'vole vers la droite'
  });

  function createWidget(container, options = {}) {
    if (!container || typeof container.appendChild !== 'function' || !container.ownerDocument) {
      throw new TypeError('container must be a DOM element');
    }
    const doc = container.ownerDocument;
    const view = doc.defaultView;
    const media = view && typeof view.matchMedia === 'function'
      ? view.matchMedia('(prefers-reduced-motion: reduce)')
      : null;
    let reducedMotion = options.reducedMotion === undefined ? Boolean(media && media.matches) : Boolean(options.reducedMotion);
    const basePath = options.basePath === undefined ? 'assets/' : options.basePath;
    if (typeof basePath !== 'string') throw new TypeError('basePath must be a string');
    const prefix = basePath.endsWith('/') ? basePath : basePath + '/';
    const controller = options.controller || engine.createController(options);
    const img = doc.createElement('img');
    img.className = 'eclaire-companion';
    img.decoding = 'async';
    img.draggable = false;
    img.alt = 'Éclaire, compagnon animé';
    container.appendChild(img);

    function render(snapshot) {
      const file = snapshot.state + (reducedMotion ? '-00.png' : '.gif');
      const next = prefix + file;
      // Comparing against the attribute prevents reloading the GIF mid-animation.
      if (img.getAttribute('src') !== next) img.setAttribute('src', next);
      img.alt = 'Éclaire ' + LABELS[snapshot.state];
      container.setAttribute('data-eclaire-state', snapshot.state);
      if (typeof options.onChange === 'function') options.onChange(snapshot);
    }

    const unsubscribe = controller.subscribe(render);
    let destroyed = false;
    function ensureAlive() {
      if (destroyed) throw new Error('Éclaire widget was destroyed');
    }

    const widget = {
      element: img,
      controller,
      setMode(name) { ensureAlive(); return controller.setMode(name); },
      trigger(name, config) { ensureAlive(); return controller.trigger(name, config); },
      getSnapshot() { return controller.getSnapshot(); },
      setReducedMotion(enabled) {
        ensureAlive();
        reducedMotion = Boolean(enabled);
        render(controller.getSnapshot());
      },
      destroy() {
        if (destroyed) return;
        destroyed = true;
        unsubscribe();
        if (!options.controller) controller.destroy();
        if (img.parentNode === container) container.removeChild(img);
        container.removeAttribute('data-eclaire-state');
      }
    };
    return Object.freeze(widget);
  }

  return Object.freeze({ createWidget, LABELS });
});
