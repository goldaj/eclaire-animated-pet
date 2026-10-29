(function () {
  'use strict';
  const root = document.getElementById('stage');
  if (!root) return;

  const stateLabel = document.getElementById('current-state');
  const modeLabel = document.getElementById('current-mode');
  const statusLabel = document.getElementById('scenario-status');
  const log = document.getElementById('event-log');
  const motion = document.getElementById('reduce-motion');
  let sequenceTimers = [];
  let scenarioName = null;

  function writeLog(description) {
    const entry = document.createElement('li');
    entry.textContent = new Date().toLocaleTimeString('fr-FR') + ' · ' + description;
    log.prepend(entry);
    while (log.children.length > 10) log.removeChild(log.lastChild);
  }

  const pet = EclaireWidget.createWidget(root, {
    onChange(snapshot) {
      stateLabel.textContent = EclaireWidget.LABELS[snapshot.state] || snapshot.state;
      modeLabel.textContent = snapshot.mode;
      writeLog('État : ' + snapshot.state);
      document.querySelectorAll('[data-mode]').forEach(button => {
        button.setAttribute('aria-pressed', String(button.dataset.mode === snapshot.mode));
      });
    }
  });

  function clearScenario() {
    sequenceTimers.forEach(clearTimeout);
    sequenceTimers = [];
    scenarioName = null;
    statusLabel.textContent = 'Séquence inactive';
  }
  function delay(ms, callback) {
    sequenceTimers.push(setTimeout(callback, ms));
  }

  document.querySelectorAll('[data-mode]').forEach(button => {
    button.addEventListener('click', () => {
      clearScenario();
      pet.setMode(button.dataset.mode);
    });
  });
  document.querySelectorAll('[data-signal]').forEach(button => {
    button.addEventListener('click', () => {
      clearScenario();
      const accepted = pet.trigger(button.dataset.signal);
      if (!accepted) writeLog('Signal ignoré : une erreur est en cours');
    });
  });

  function startScenario(name) {
    clearScenario();
    scenarioName = name;
    statusLabel.textContent = 'Séquence en cours : ' + name;
    writeLog('Scénario lancé : ' + name);
    pet.setMode('active-work');
    if (name === 'success') {
      delay(1500, () => pet.trigger('review'));
      delay(3200, () => pet.trigger('wave'));
      delay(4900, () => { pet.setMode('idle'); clearScenario(); });
    } else if (name === 'failure') {
      delay(1500, () => pet.trigger('failure'));
      delay(4100, () => { pet.setMode('waiting'); clearScenario(); });
    } else if (name === 'movement') {
      delay(1400, () => pet.trigger('fly-left'));
      delay(2900, () => pet.trigger('fly-right'));
      delay(4400, () => { pet.setMode('idle'); clearScenario(); });
    }
  }
  document.querySelectorAll('[data-scenario]').forEach(button => {
    button.addEventListener('click', () => startScenario(button.dataset.scenario));
  });
  document.getElementById('stop-scenario').addEventListener('click', () => {
    clearScenario();
    pet.setMode('idle');
    writeLog('Scénario arrêté');
  });
  motion.addEventListener('change', () => {
    pet.setReducedMotion(motion.checked);
    writeLog(motion.checked ? 'Images fixes activées' : 'Animations activées');
  });

  const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  motion.checked = Boolean(prefersReduced);
  // The widget already reads the initial OS setting. No extra reload needed.
  window.addEventListener('pagehide', () => {
    clearScenario();
    pet.destroy();
  }, { once: true });
})();
