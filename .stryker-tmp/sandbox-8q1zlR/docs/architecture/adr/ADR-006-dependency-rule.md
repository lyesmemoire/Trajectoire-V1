# ADR-006: Dependency Rule

## Statut
Accepté — Sprint 3.3.4

## Contexte
Dans un monolithe modulaire, le couplage direct entre domaines crée des dépendances circulaires et entrave l'extraction de services.

## Décision
Un domaine ne peut dépendre que de `core/` et de ses propres sous-dossiers.
Les communications inter-domaines se font uniquement via Ports, Domain Events, ou une API publique explicite (index.ts).

## Conséquences
- Modularité stricte. Protection contre la « big ball of mud ».
- Les domaines deviennent potentiellement extractibles en micro-services.

## Alternatives rejetées
- **Dépendances libres entre domaines** : Mène inévitablement au spaghetti.
- **Shared Kernel** : Crée un point de couplage central qui grossit sans fin.
