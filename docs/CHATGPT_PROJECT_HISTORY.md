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

## 2026-10-24 — Revue parallèle multi-dépôts (heure non disponible)

**Utilisateur (verbatim, message visible dans cette conversation)** :

> tu vois tout le boulot qu'on a fait sur la conversation Avancement projets codex ?
> Tu vas refaire la même chose sur TOUT mon repo git. Tu vas commencer par les projets les plus gros, regarder ce que tu peux faire dessus et le faire sur ta branch (même consignes que sur l'autre conversation).
> Tu vas ensuite me faire un rapport très succint des projets que t'as touché et de ce que t'as avancé dessus.
> Amuse toi !

**Assistant (résumé reconstruit, non verbatim)** : revue des gros dépôts et amélioration isolée sur `chatgpt/review-20261024`. Galerie : respect prefers-reduced-motion et fallback PNG ; validation des fichiers GIF/frames dans GitHub Actions.

**Validation et confiance** : confiance élevée sur la portée du changement ; aucune exécution locale des tests ne peut être attestée depuis l'accès GitHub disponible. Consulter les statuts GitHub Actions de la PR avant intégration. Aucune modification de `main`/`develop`, aucun déploiement. Codex doit inspecter le diff, relancer les tests et choisir les commits à intégrer sans écraser son travail.
