# Moteur du compagnon Éclaire (29 octobre 2026)

## Ce qui existe réellement

Cette évolution ajoute un **contrôleur d'états JavaScript sans dépendances**, une **vue DOM embarquable** et une **démo pilotable**. Les GIF, sprites PNG et `animations.json` historiques restent inchangés. Aucun modèle d'IA n'est intégré, aucune donnée n'est transmise à un serveur.

- `src/eclaire-engine.js` : transitions, durées, priorités, annulation et événements.
- `src/eclaire-widget.js` : projection des états sur les GIF/PNG dans un élément HTML.
- `src/demo.js` et `index.html` : commandes manuelles et scénarios de travail/succès/échec.
- `tests/engine.test.cjs` : tests Node intégrés, horloge simulée et contrôle des assets.
- `.github/workflows/tests.yml` : CI sur PR et branches.

## Démarrer et tester

1. Télécharger ou cloner le dépôt.
2. Ouvrir **`index.html` directement** dans Chrome, Firefox ou Edge, sans serveur ni dépendances.
3. Cliquer sur « Travail », puis « Saluer » : Éclaire revient ensuite au travail. Cliquer sur « Erreur », puis « Sauter » : le saut est ignoré tant que l'erreur joue.
4. Exécuter `node --test tests/*.test.cjs` avec Node.js 18+ pour la suite de tests automatisés.
5. Les boutons « Tâche réussie » et « Tâche échouée » reproduisent uniquement des **événements locaux simulés**. Pour un agent réel, brancher ses événements sur l'API ci-dessous.

## Embarquer le compagnon dans un autre projet

Copier `src/eclaire-engine.js`, `src/eclaire-widget.js` et le répertoire `assets/` dans le projet cible. Les deux scripts utilisent des variables globales et fonctionnent aussi sur une page HTML locale.

```html
<div id="assistant-pet" aria-label="Compagnon Éclaire"></div>
<script src="src/eclaire-engine.js"></script>
<script src="src/eclaire-widget.js"></script>
<script>
  const pet = EclaireWidget.createWidget(
    document.getElementById('assistant-pet'),
    { basePath: 'assets/' }
  );

  // Ces exemples peuvent être raccordés à des événements réels de l'agent.
  pet.setMode('active-work');     // travail en cours
  pet.trigger('review');          // analyse, puis retour au travail
  pet.trigger('wave');            // succès, puis retour au travail
  pet.setMode('waiting');         // agent en attente
  // À la fermeture de la vue : pet.destroy();
</script>
```

**Important :** fournir ses propres règles CSS de dimensionnement (par exemple `.eclaire-companion { width: 180px; }`). Le widget n'impose pas de placement, de fenêtre transparente ni d'overlay OS.

### API

`EclaireEngine.createController(options)` retourne :

- `setMode('idle' | 'waiting' | 'active-work')` : définit immédiatement le mode persistant, annule une réaction en cours.
- `trigger('jump' | 'wave' | 'review' | 'failure' | 'fly-left' | 'fly-right', { durationMs? })` : joue une réaction temporaire et revient au mode précédent ; renvoie `false` si bloquée par une erreur en cours, `true` sinon.
- `getSnapshot()` : état courant `{ state, mode, transient, busy }`.
- `subscribe(listener)` : abonne un observateur et l'appelle immédiatement ; renvoie une fonction de désabonnement.
- `destroy()` : annule les délais et libère les abonnés. Toute nouvelle commande échoue ensuite clairement.

`EclaireWidget.createWidget(container, options)` ajoute un élément `img` et expose `setMode`, `trigger`, `getSnapshot`, `setReducedMotion(boolean)`, `destroy`, ainsi que `element` et `controller`. Options principales : `basePath` (par défaut `assets/`), `initialMode`, `durations`, `reducedMotion`, `onChange`.

**Contrat de transitions :** les erreurs (`failure`) ne peuvent pas être interrompues par les autres réactions ponctuelles. Les changements explicites de mode interrompent toute animation, y compris une erreur. Une nouvelle réaction non prioritaire peut remplacer une réaction normale précédente. Les durées correspondent à la présence visuelle des GIF, et non à une synchronisation précise avec leur boucle interne.

La préférence système `prefers-reduced-motion` est lue à la création ; en mode réduit, le widget affiche la frame PNG `-00` de l'état choisi. Un changement de préférence système *après* création n'est pas suivi automatiquement ; utiliser `setReducedMotion`.

### Brancher les événements d'un agent

Exemple de table de correspondance, à adapter à la sémantique de l'application :

| Événement logiciel | API |
| --- | --- |
| Agent disponible | `pet.setMode('idle')` |
| Attente d'un prompt / utilisateur | `pet.setMode('waiting')` |
| Outil ou tâche en cours | `pet.setMode('active-work')` |
| Phase de vérification | `pet.trigger('review')` |
| Succès | `pet.trigger('wave')` |
| Erreur | `pet.trigger('failure')` |
| Événement amusant sans enjeu | `pet.trigger('jump')` |

Le moteur ne sait rien de Codex/Jade, ne lit pas les processus ni le bureau, et ne possède pas de connecteur Twitch/Discord. L'intégration doit rester explicite du côté de l'application, sans simulation présentée comme une télémétrie réelle.

## Limitations et prochains travaux pour Codex

1. **Valider visuellement** les neuf états sur ordinateur et mobile, y compris la taille des images, la lisibilité et les PNG du mode mouvement réduit. Les tests Node ne remplacent pas cette inspection.
2. **Relier un consommateur réel** : définir un adaptateur événementiel pour Jade, un tableau de bord ou un IDE. Éviter les faux événements affichés comme réels.
3. **Tester en navigateur** automatiquement (Playwright, si le coût des dépendances est acceptable), puis capturer les régressions CSS et les scénarios asynchrones.
4. **Améliorer les transitions** : file d'attente optionnelle des réactions, durées calibrées sur les GIF, comportements de temporisation et gestion de l'onglet masqué. Le contrôleur actuel n'est volontairement pas un ordonnanceur de tâches.
5. **Desktop transparent** seulement après cadrage : toujours au-dessus, glisser-déplacer, clic traversant, sécurité et comportement multi-écrans nécessitent un conteneur OS adapté.

## Reprise Codex

Branche initiale de travail : `feat/reactive-companion-engine-20261029`. Ne pas écraser les anciennes ressources ni `versions/work-pet-v2/`. Lire `README.md`, `AGENTS.md`, `docs/CHATGPT_PROJECT_HISTORY.md`, puis cette documentation. Vérifier les changements existants avant d'en ajouter. La preuve minimale est `node --test tests/*.test.cjs` et un essai manuel de la galerie. Ne pas prétendre avoir vérifié un navigateur sans l'avoir ouvert.
