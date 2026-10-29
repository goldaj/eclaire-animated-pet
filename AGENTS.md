# AGENTS.md — Éclaire

## Avant toute intervention
- Lire `README.md`, puis **`docs/CHATGPT_PROJECT_HISTORY.md`** pour les décisions de conception et les limites documentaires. Consulter ensuite les documents spécialisés cités par le README.
- Mission : Assets du compagnon animé 2D : sprites, GIF, états idle/jump/wave/work/review/failure et galerie web, sans moteur complet.
- Invariants : Conserver les fichiers originaux et correspondances des noms d'états/animations ; ne pas annoncer un moteur prêt à intégrer.

## Exécution
- Ouvrir `index.html` ; contrôler le chargement des GIF et des états.
- Préserver le travail préexistant, les versions anciennes et les fichiers non concernés. Valider uniquement ce qui peut être vérifié dans l'environnement disponible.

## Continuité du contexte
- Après toute modification de projet, consulter et enrichir `docs/CHATGPT_PROJECT_HISTORY.md` avec les échanges fournis, les décisions et le résultat de la validation.
- Distinguer `Utilisateur (verbatim)`, `Assistant (verbatim)` et `Résumé reconstruit (non verbatim)`. Donner date et heure uniquement si attestées, sinon noter qu'elles manquent.
- Ne pas inventer d'échanges ou de tests. Si une transcription n'est pas accessible, demander son export plutôt que supposer son contenu.
- Le dépôt peut être public : expurger secrets, données personnelles et contenus ne relevant pas du projet. Ne pas écraser les éléments historiques.

## État fonctionnel après la branche du 2026-10-29
- Le moteur **existe désormais** sur `feat/reactive-companion-engine-20261029` : lire `docs/COMPANION_ENGINE.md`.
- La galerie n'est plus seulement statique : `index.html` simule une activité, des succès et des erreurs. Ne pas confondre avec une vraie activité de Jade/Codex.
- État persistant : idle/waiting/active-work ; six réactions temporaires. `failure` prime sur les signaux ordinaires. Un changement explicite de mode annule l'animation.
- Bibliothèque sans dépendance : fichiers `src/eclaire-engine.js` et `src/eclaire-widget.js` ; réutiliser ces composants au lieu de recréer une machine d'états dans chaque intégration.
- Tests : `node --test tests/*.test.cjs` avec Node 18+, contrôle de la syntaxe, inspection visuelle obligatoire pour la validation graphique.
- L'intégration native desktop, la communication avec Jade, les événements en temps réel et les transitions physiques **ne sont pas implémentés**.
- Conserver `assets/`, `animations.json` et `versions/work-pet-v2/` sans modifications destructrices.

## Prochaine intervention Codex
1. Prendre connaissance du diff/PR existant et de `docs/COMPANION_ENGINE.md` avant d'ajouter du code.
2. Exécuter les tests et confirmer les neuf GIF dans un navigateur sur ordinateur et mobile.
3. Ajouter un adaptateur **réel**, testable et désactivable aux événements d'un projet consommateur, sans espionner le bureau ni inventer des statuts.
4. Si de nouvelles fonctionnalités sont ajoutées, ajouter un test de régression et documenter ce qui est effectivement validé.
