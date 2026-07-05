# ADR-008: Dependency Injection Strategy

## Statut
Accepté — Sprint 3.3.4

## Contexte
La gestion des dépendances nécessite une approche standardisée pour éviter la prolifération de frameworks lourds ou de Service Locators dynamiques.

## Décision
La stratégie retenue est l'injection de dépendances manuelle par constructeur couplée à un Composition Root statique.
- Pas de framework IoC magique (comme Inversify ou NestJS).
- Pas de Service Locator accessible depuis les consommateurs.
- Les dépendances sont toujours passées explicitement via le constructeur.
- Contraintes : max 5 dépendances par constructeur, max 5 paramètres par méthode, max 15 méthodes publiques, max 3 niveaux d'imbrication.

## Conséquences
- Code « Vanilla TypeScript », facile à lire et à auditer.
- Sécurité au typage (TypeScript empêche d'oublier une dépendance).
- Les consommateurs voient uniquement les façades finales assemblées.

## Alternatives rejetées
- **IoC container (Inversify, tsyringe)** : Ajoute une complexité invisible (décorateurs, tokens).
- **Factory functions globales** : Moins explicite que l'injection par constructeur.
