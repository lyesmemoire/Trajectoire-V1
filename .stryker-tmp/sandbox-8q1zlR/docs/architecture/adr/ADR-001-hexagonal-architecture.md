# ADR-001: Architecture Hexagonale

## Statut
Accepté — Sprint 3.3.4

## Contexte
L'application nécessitait une meilleure séparation des responsabilités entre la logique métier, les cas d'utilisation et les détails d'implémentation (base de données, IA, etc.). Le couplage fort rendait les tests difficiles et les refactorisations risquées.

## Décision
Nous adoptons l'Architecture Hexagonale (Ports & Adapters).
Chaque domaine est structuré comme suit :
- `domain/` : Entités, Value Objects, Domain Events.
- `application/` : Use Cases, DTOs, Mappers, Validation.
- `ports/` : Interfaces (capacités métier attendues).
- `infrastructure/` : Repositories et Adapters implémentant les Ports.

## Conséquences
- **Avantages** : Découplage total de la logique métier vis-à-vis des frameworks et bases de données. Testabilité maximale via des fausses implémentations.
- **Inconvénients** : Légère augmentation du nombre de fichiers et de la verbosité.

## Alternatives rejetées
- **MVC classique** : Trop de couplage entre la couche présentation et la logique métier.
- **Clean Architecture complète** : Jugée trop lourde pour un projet Next.js monolithique.
