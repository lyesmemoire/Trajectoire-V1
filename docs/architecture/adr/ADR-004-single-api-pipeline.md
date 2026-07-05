# ADR-004: Pipeline API unique

## Statut
Accepté — Sprint 3.3.4

## Contexte
Chaque route API gérait sa propre validation, son authentification, la gestion des erreurs et les métriques, entraînant de la duplication et des comportements hétérogènes.

## Décision
Utilisation d'un `createApiHandler` standardisé (Pipeline API unique).
Ce wrapper gère l'authentification, la validation Zod, la gestion des erreurs, l'observabilité (logs de succès/erreur/latence) et la sérialisation de la réponse.

## Conséquences
- Sécurité renforcée (impossible d'oublier la validation ou l'auth).
- Observabilité centralisée sans polluer le code métier.
- Code des routes extrêmement minimaliste (souvent < 20 lignes).

## Alternatives rejetées
- **Middleware Express-style** : Trop impératif, difficile à typer avec TypeScript.
- **tRPC** : Trop intrusif pour un projet déjà établi.
