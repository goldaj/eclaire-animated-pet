# Audit de reprise GitHub — 30/10/2026

Inspection statique des branches, PR, `README.md` et `AGENTS.md`. Aucun test ni rendu navigateur effectué dans cette passe.

## Branches (référence `main`)
- `main` : `61cc1fb563a08c4b8ae4a1dae13138d44782ee94`.
- `chatgpt/review-20261024` : `99fcf421440df36de02af6b1628106cb984d6621` ; `behind` ; ahead 0, behind 17 ; ancêtre intégral, nettoyage envisageable après vérification des références externes.
- `feat/reactive-companion-engine-20261029` : `9862076c9c100d69555227bc09859d9be82e9aea` ; `behind` ; ahead 0, behind 3 ; ancêtre intégral, nettoyage envisageable après vérification des références externes.

## PR
- [#2](https://github.com/goldaj/eclaire-animated-pet/pull/2) : fusionnée
- [#1](https://github.com/goldaj/eclaire-animated-pet/pull/1) : fusionnée

## Points critiques à challenger
Le projet est passé de galerie de GIF à un petit moteur de compagnon réactif : vérifier l'arbitrage entre idle/attente/travail, les priorités d'erreur, l'annulation des animations transitoires et les cas où un signal arrive pendant un autre. Les animations simulées ne témoignent pas d'un branchement réel à Codex/Jade. Vérifier aussi performances navigateur, accessibilité et gestion de timers.

## Plan concret pour le prochain agent
1. Lire docs/COMPANION_ENGINE.md et le journal.
2. Exécuter node --test tests/*.test.cjs puis vérifier manuellement états/transitions et ressources réelles.
3. Concevoir un contrat d'événements stable avant de relier Éclaire à Jade ou à un agent externe.

## Passation et sécurité
Les branche(s) avec ahead=0 n'ont aucun commit exclusif à intégrer, mais cela ne prouve pas qu'une fonctionnalité a été testée. N'effacer aucune branche sans revue des PR/consommateurs. Préserver les GIF et leurs noms. Consulter `docs/CHATGPT_PROJECT_HISTORY.md` et les documents fonctionnels avant toute nouvelle tâche. README : « # Éclaire | Animated Pet ». Seul ce fichier documentaire a été ajouté, aucun code modifié.
