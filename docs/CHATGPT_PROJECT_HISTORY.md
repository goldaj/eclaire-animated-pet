# Contexte de projet ChatGPT : Éclaire

> Journal pour Codex créé le 2026-10-24. **Partiel**, car les exports complets de toutes les conversations ChatGPT ne sont pas accessibles dans cette session. Les résumés ci-dessous ne sont pas des citations.

## Périmètre et état vérifiables
- Dépôt : `goldaj/eclaire-animated-pet`.
- Objet d'après le README : Assets du compagnon animé 2D : sprites, GIF, états idle/jump/wave/work/review/failure et galerie web, sans moteur complet.
- Invariants : Conserver les fichiers originaux et correspondances des noms d'états/animations ; ne pas annoncer un moteur prêt à intégrer.
- Entrée de vérification : Ouvrir `index.html` ; contrôler le chargement des GIF et des états.

## Échanges et références retrouvés

2026-10-18/19 — Assistant, résumé non verbatim : inventaire d'assets historiques et conservation des variantes.

2026-10-18 13:24:13 UTC — Utilisateur (extrait exact) : « N'écrase aucun repo existant. »

2026-10-24 — Utilisateur (verbatim, heure indisponible) : « je te demande de lire mes repo git où tu es le dernier utilisateur, de rajouter un AGENTS.md pertinent s’il n’y en a pas. Mais en plus, tu rajoutera un document repérable par codex [...] où tu mets l’intégralité de nos échanges liés à ce projet. Mes questions, tes réponses [...] et les horodatages si tu les as. » (extrait avec ellipses signalées, donc non intégral).

## À compléter avec les transcriptions sources
**Manquent :** questions/réponses intégrales de chaque session de conception, horaires individuels de certains messages et échanges Codex non publiés. Ne jamais reconstituer un dialogue en prétendant citer des propos exacts.

Lorsque des exports ChatGPT authentiques sont fournis, les archiver par session, avec date ISO/fuseau, rôles et texte intégral en préservant leur ordre. Revoir toute donnée sensible avant de pousser sur GitHub. Après chaque modification, ajouter les échanges exacts nouvellement disponibles, puis actualiser les décisions et l'état vérifié.

## Intervention fonctionnelle du 2026-10-29

- **Utilisateur (verbatim, heure non disponible)** : « Trouve un sujet sur mon github sur lequel tu es pertinent pour avancer. Puis développe le nécessaire en documentant. Bref finalement fait comme tu sais faire, on en a déjà parlé pleins de fois dans ce projet ChatGPT »
- **Assistant (résumé reconstruit, non verbatim)** : inventaire de 41 dépôts puis sélection d'Éclaire, insuffisamment développé fonctionnellement, pour un moteur de réactions réutilisable et testable plutôt qu'une simple documentation.
- **Décision technique (2026-10-29)** : conserver intactes les animations historiques, développer une machine d'états autonome, un widget DOM, une simulation d'événements locaux, des tests automatisés et une documentation d'intégration.
- **Implémentation dans `feat/reactive-companion-engine-20261029`** : moteur `src/eclaire-engine.js`, widget `src/eclaire-widget.js`, galerie interactive `index.html` et `src/demo.js`, tests dans `tests/engine.test.cjs`, CI `.github/workflows/tests.yml`, contrat dans `docs/COMPANION_ENGINE.md`.
- **Validation réellement exécutée au moment de cette note** : 11 vérifications JS isolées en mémoire par exécution du moteur et du widget récupérés depuis GitHub, toutes passées. La suite Node (fichier `tests/engine.test.cjs`) est commitée et prête pour la CI ; ne pas prétendre qu'elle a été lancée localement tant que son exécution n'est pas confirmée. Aucun essai visuel de navigateur réel ni intégration Jade n'a été réalisé dans cette session.
- **À poursuivre** : consulter la CI de la PR, essais visuels, intégration avec un émetteur réel d'événements, puis tests de navigateur et desktop si besoin. Instructions détaillées dans `docs/COMPANION_ENGINE.md`.

> Cette entrée ne constitue pas une transcription complète de la conversation ; seuls les propos utilisateur cités ci-dessus sont repris verbatim.
