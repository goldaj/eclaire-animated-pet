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
| `src/demo.js` | Simulateur de tâches et commandes de la galerie |
| `animations.json` | Manifeste des neuf états et de leurs ressources |
| `assets/` | Animations originales GIF, PNG, spritesheet et vidéo |

**[Guide technique et instructions pour Codex](docs/COMPANION_ENGINE.md)** : API, exemple d'intégration, tests, limites et travaux suivants.

## États existants

- Persistants : `idle`, `waiting`, `active-work`.
- Réactions temporaires : `jump`, `wave`, `review`, `failure`, `fly-left`, `fly-right`.

Le code ne modifie pas les images originales. Les ressources de la variante **Work Pet v2** restent archivées dans `versions/work-pet-v2/`.

## Tests

Node.js 18+ suffit, sans `npm install` :

```bash
node --test tests/*.test.cjs
```

Une GitHub Action exécute ces tests sur les PR et les branches concernées. Pour une validation réelle, vérifier aussi les états et les scénarios dans un navigateur. Le moteur ne détecte pas spontanément l'activité d'un agent : **c'est l'application hôte qui envoie les événements**.

## Périmètre

Les visuels et GIFs sont fournis pour les prototypes d'interface et compagnons graphiques. Ce dépôt ne prétend pas fournir une surcouche native du bureau, de la transparence de fenêtre, un rig 2D, des physiques Live2D ou un flux d'événements en temps réel. Un adaptateur est à concevoir pour une intégration future avec Jade ou d'autres outils.

## Traçabilité

Consulter `AGENTS.md` et `docs/CHATGPT_PROJECT_HISTORY.md` avant toute intervention. Ne pas écraser les variantes historiques et distinguer les validations automatisées des essais visuels.
