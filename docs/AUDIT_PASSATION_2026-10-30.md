# Audit contradictoire et passation — goldaj/eclaire-animated-pet (2026-10-30)

GitHub : références, PR et arborescence vérifiées ; runtime et animation non testés localement.

## Branches
`main` = `c453679a9f5da71427ae17f5d33855e99495a8b0`.
- `chatgpt/review-20261024`: behind, 0 commit(s) exclusif(s), 15 commit(s) derrière. Absorbée, candidate au retrait après vérification des dépendances.
- `feat/reactive-companion-engine-20261029`: behind, 0 commit(s) exclusif(s), 1 commit(s) derrière. Absorbée, candidate au retrait après vérification des dépendances.

## PR
- [#2](https://github.com/goldaj/eclaire-animated-pet/pull/2) — fusionnée (closed) : feat: turn Éclaire asset gallery into reactive companion engine
- [#1](https://github.com/goldaj/eclaire-animated-pet/pull/1) — fusionnée (closed) : [ChatGPT] Revue parallèle: Réduction des animations et vérification des ressources

## Structure et README
`.github`, `.gitignore`, `AGENTS.md`, `README.md`, `animations.json`, `assets`, `docs`, `index.html`, `src`, `tests`, `versions`.

# Éclaire | Animated Pet

**Compagnon 2D intégrable en HTML/JavaScript · 9 animations · sans framework ni serveur**

Éclaire était à l'origine une bibliothèque de sprites et une galerie GIF. Le nouveau moteur ajoute une logique de réactions : une tâche peut placer le compagnon en travail, une validation le faire réagir, une erreur prendre temporairement la priorité, puis le personnage revient à son état de fond.

## Essayer immédiatement

1. Ouvrir **`index.html`** dans un navigateur desktop ou mobile.
2. Tester les modes **Repos**, **Attente**, **Travail**, puis les six réactions.
3. Lancer **Tâche réussie**, **Tâche échouée** ou **Déplacement** pour observer des événements simulés.
4. Cocher **Utiliser des images fixes** pour limiter les mouvements.

La démo fonctionne aussi comme fichier local `file://`, sans installation. Elle n'est **pas connectée** à Jade, Codex ou à un service externe.

## Réutiliser dans un logiciel

Le moteur se compose de :

| Fichier | Fonction |
| --- | --- |
| `src/eclaire-engine.js` | État persistant, réactions temporaires, priorité des erreurs, annulations |
| `src/eclaire-widget.js` | Widget HTML `img` piloté par le moteur, GIF ou PNG réduit |
| `src/demo.js` | Simulateur de tâches et commandes de 

## Tests et risques à challenger
1. Mesurer les performances des animations, le nombre de ressources et la charge CPU/GPU de la boucle de vie du compagnon.
2. Tester les interactions / transitions d'état, réaction aux actions répétées, redémarrage et coupure de l'interface.
3. Contrôler le fonctionnement sans assets facultatifs et les contraintes d'accessibilité/mouvement réduit.
4. Vérifier la CI et effectuer un playtest visuel ; une fusion réussie n'est pas une preuve que le personnage est réellement utilisable.
5. Aucune des deux branches de fonctionnalités ne contient désormais de commit exclusif ; suppression seulement après inspection des workflows.
