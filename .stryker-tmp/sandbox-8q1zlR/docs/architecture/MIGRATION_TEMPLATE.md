# Modèle de Migration d'un Domaine (Golden Path)

Ce document décrit le processus reproductible (workflow) pour migrer un domaine Legacy vers l'Architecture Hexagonale cible. Le domaine **CV** a servi de modèle ("Golden Domain") pour établir ce processus.

## Workflow de Migration (Étapes 0 à 8)

### Étape 0 : Discovery & Cartographie
*Ne pas écrire de code.*
- Identifier les responsabilités métier actuelles du domaine.
- Faire la liste des dépendances techniques (ex: Supabase, Prisma, OpenAI, API externes).
- Modéliser les Entités métier (`domain/entities/`).
- Définir les événements de domaine nécessaires (`domain/events/`).

### Étape 1 : Ports (Contrats)
- Créer le sous-dossier `ports/`.
- Définir les interfaces qui représentent les **capacités métier** (ex: `FileStorage`, `DocumentParser`, `BillingRepositoryPort`).
- Les Ports ne doivent pas exposer de détails techniques (pas de types Prisma ou Supabase).

### Étape 2 : Repositories (Infrastructure)
- Créer `infrastructure/repositories/`.
- Implémenter les accès BDD (Supabase, Prisma, Redis) en respectant les Ports définis.
- Un Repository doit retourner des Entités métier ou des DTOs, **jamais** de types natifs BDD (`Prisma.User`, etc.).

### Étape 3 : Adapters (Infrastructure)
- Créer `infrastructure/adapters/`.
- Implémenter l'intégration avec les services tiers (IA, Stripe, Email, etc.) via les Ports dédiés.

### Étape 4 : Use Cases (Application)
- Créer `application/use-cases/`.
- Implémenter la logique applicative.
- **Règle absolue : 1 Use Case = 1 Objectif métier.**
- Limite stricte : ~150-200 lignes par Use Case. Si un Use Case devient trop long, déléguer à d'autres Use Cases ou extraire la logique complexe dans un Domain Service (`domain/services/`).
- Les comportements transverses (Logs, Observabilité) doivent être gérés par des wrappers (ex: `createApiHandler`), non pollués dans le Use Case.

### Étape 5 : Container (Composition Root)
- Créer `container.ts` à la racine du domaine (`lib/[domaine]/container.ts`).
- Instancier **manuellement** toutes les dépendances (Repositories, Adapters).
- Instancier les Use Cases en leur injectant ces dépendances.
- Aucun constructeur métier (`new *UseCase`, `new *Repository`, `new *Adapter`) ne doit être appelé en dehors de ce fichier.

### Étape 6 : API Publique (Index)
- Créer `index.ts` à la racine du domaine.
- N'exporter que le strict nécessaire : le conteneur (`[domaine]Module`), les DTOs, les événements, et éventuellement les types de Ports.
- **Règle** : Les autres domaines ne doivent jamais importer le contenu des sous-dossiers internes. Ils doivent importer exclusivement depuis `index.ts`.

### Étape 7 : Tests Contractuels
- Créer des tests dans `tests/contracts/[type]/`.
- S'assurer que chaque implémentation (Adapter/Repository) respecte les assertions comportementales du Port, indépendamment de la technologie sous-jacente.

### Étape 8 : Nettoyage Legacy
- Mettre à jour les routes API pour utiliser le nouveau `[domaine]Module` au lieu des anciens `*.service.ts` ou `*.orchestrator.ts`.
- Ajouter des commentaires `@deprecated` sur les anciens services s'ils sont encore utilisés par d'autres domaines non migrés.
- Supprimer les fichiers inutiles.
