# Template de Domaine IA (Server-Only)

Ce template sert de modèle de référence pour la migration ou la création de modules d'Intelligence Artificielle au sein de Trajectoire. Il s'appuie sur une architecture propre (Clean Architecture) permettant de garantir l'absence totale de logique IA dans les bundles clients.

## Principes Fondamentaux

1. **Isolation Cliente :** Les composants React (`"use client"`) ne doivent **jamais** importer directement la logique de domaine ou d'infrastructure. Ils ne communiquent avec le domaine que via HTTP (Server Actions ou Route Handlers).
2. **Ports & Adapters :** Le domaine métier (Use Cases) définit des contrats (Ports). L'infrastructure implémente ces ports (Adapters).
3. **Séparation du flux :** L'UI consomme un flux texte (`streamText`) via `useChat` pour un affichage en temps réel, complété par des métadonnées asynchrones.

---

## Structure du domaine

Chaque domaine IA (ex: `career-copilot`, `interview-simulator`, `career-forecast`) doit respecter cette hiérarchie stricte dans le dossier `lib/[domaine]/` :

```text
lib/[domaine]/
├── application/
│   └── use-cases/          # Logique d'orchestration (ex: MyUseCase.ts)
├── domain/
│   ├── contracts/          # DTOs, Événements, Erreurs (ex: my-domain.dto.ts)
│   └── ports/              # Interfaces requises par le Use Case (ex: engine.port.ts)
├── infrastructure/
│   ├── adapters/           # Adaptateurs réseau ou stream (ex: stream.adapter.ts)
│   ├── builders/           # Construction de contexte métier depuis la BDD (ex: context.builder.ts)
│   └── engines/            # Implémentation réelle de l'IA (ex: mistral.engine.ts)
├── presentation/
│   └── validators/         # Schémas Zod pour validation des requêtes HTTP (ex: input.schema.ts)
└── composition/
    └── [domaine].factory.ts # Injection de dépendances manuelle (câblage Builder + Engine)
```

## Règles d'implémentation

- **Application (Use Cases) :** Ne doit avoir aucune dépendance à Supabase, React, ou `@ai-sdk/core`. Un Use Case orchestre la récupération du contexte via un `Builder` et génère un flux via un `Engine`.
- **Domain (Ports & DTOs) :** Code 100% agnostique. Contient des interfaces, types et exceptions spécifiques au domaine.
- **Infrastructure (Adapters/Engines/Builders) :** Seule couche autorisée à importer `ai` (SDK AI V6), `Supabase` ou la base de données.
- **Presentation :** Fournit les fonctions et schémas pour transformer une requête brute (JSON) en `DTO` valide.
- **Composition (Factory) :** Injecte les implémentations d'infrastructure dans les Use Cases.

## Points d'entrée (Route Handlers)

Le point d'entrée pour le domaine doit se trouver dans `app/api/[domaine]/route.ts`.
Il effectue l'authentification (`getStrictUser()`), parse les données avec les validateurs de `presentation/`, instancie le Use Case via la `Factory`, et renvoie le flux via l'Adapter de Stream.
