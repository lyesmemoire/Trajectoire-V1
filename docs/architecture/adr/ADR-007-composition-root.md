# ADR-007: Composition Root

## Statut
Accepté — Sprint 3.3.4

## Contexte
Les orchestrateurs instanciaient eux-mêmes leurs dépendances (via le mot-clé new), empêchant l'injection de mock pour les tests et créant un couplage fort avec l'infrastructure.

## Décision
Implémentation du pattern Composition Root via un fichier `container.ts` statique par domaine.
C'est le seul endroit où l'infrastructure et l'application sont assemblées. Les routes API importent le use case prêt à l'emploi depuis le conteneur.
Règle absolue : aucun constructeur ne doit être appelé ailleurs que dans `container.ts`.

## Conséquences
- L'API reste ignorante des détails d'infrastructure.
- Pas besoin d'un framework complexe d'Inversion of Control (IoC).

## Alternatives rejetées
- **IoC framework (Inversify, NestJS)** : Trop magique, trop lourd pour un projet Next.js.
- **Service Locator** : Anti-pattern qui masque les dépendances.
