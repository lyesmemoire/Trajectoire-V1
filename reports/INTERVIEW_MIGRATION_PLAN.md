# Plan de migration — Interview AI Domain

**Statut :** Proposition à valider avant toute implémentation  
**Précondition :** validation de `INTERVIEW_DOMAIN_CONTRACT.md`.

## But

Remplacer progressivement l'exécution IA client de Interview Simulator par le standard AI Domain, sans modifier Career Copilot, sans perdre le streaming et sans régression fonctionnelle.

La cible est :

```text
UI useChat -> POST /api/interview/chat -> InterviewConversationUseCase
           -> Context Builder -> Interview Engine -> LLM Provider
```

## Principes d'exécution

- Une seule migration fonctionnelle : le domaine Interview.
- Une seule PR de migration, avec commits et validations par phase ; aucune couche critique n'est modifiée en parallèle.
- Les routes historiques restent actives tant que la route chat n'a pas atteint la parité validée.
- Aucun `dynamic()` ne sert de correctif architectural.
- Aucun prompt, engine, orchestrateur, provider ou module `core/intelligence` n'est importé par l'UI.
- Chaque phase est testée avant de commencer la suivante.
- Les mesures de bundle sont prises seulement après nettoyage de `.next`, build de production et absence de serveur de développement mélangeant les artefacts.

## État de départ validé

| Élément | Constat |
| --- | --- |
| Route UI | `/dashboard/interview-simulation` : 351 kB First Load JS dans la baseline |
| Fuite | cinq engines IA sont atteignables depuis les hooks client |
| Prompts | sept prompts sont atteignables transitivement |
| Streaming existant | `/api/interview/generate` utilise AI SDK mais n'est pas consommé par l'UI de simulation |
| Route cible | `/api/interview/chat` absente |
| Contrôle architecture | échoue actuellement sur 76 violations préexistantes hors migration ; il doit être isolé avant de devenir un gate final |

## Plan par phase

### 0. Verrouillage du contrat

**But :** accepter les trois documents de conception.

**Écritures autorisées :** documentation seulement.

**Sortie :**

- DTO, événements, erreurs, ports et contexte approuvés ;
- ADR-018 accepté ;
- comportement legacy documenté sans le modifier.

**Gate :** validation explicite de l'architecture.

### 1. Contrats de domaine

**But :** créer exclusivement `lib/interview/domain/contracts` et `lib/interview/domain/ports` conformément au contrat.

**Inclut :**

- DTO stricts ;
- événements métier ;
- hiérarchie d'erreurs et mapper ;
- trois ports ;
- tests de compilation des contrats.

**Exclut :** routes, UI, providers, prompts, Supabase, AI SDK.

**Gate :** typecheck ciblé et tests unitaires de formes d'événements/erreurs.

### 2. Application

**But :** créer `InterviewConversationUseCase`.

**Inclut :**

- validation métier ;
- appel du context builder ;
- délégation à l'engine ;
- propagation des événements ;
- normalisation d'erreurs.

**Exclut :** Next.js, HTTP, React, SDK, construction de dépendances.

**Gate :** tests unitaires avec doubles strictement typés pour builder et engine ; aucun accès réseau.

### 3. Infrastructure serveur

**But :** implémenter les adaptateurs serveur derrière les ports.

**Inclut :**

- `SupabaseInterviewContextBuilder` ;
- `InterviewEngine` ;
- provider LLM ;
- prompts exclusivement importés par l'engine ;
- `InterviewStreamAdapter`.

**Décision streaming :** l'engine produit des événements de domaine ; l'adaptateur seul connaît le format AI SDK.

**Gate :** tests unitaires de mapping de contexte, événements de stream et erreurs provider ; vérification que les modules serveur déclarent leur frontière server-only lors de l'implémentation.

### 4. Composition

**But :** créer `composition/interview.factory.ts`.

**Inclut :**

- `createInterviewUseCase()` ;
- assemblage provider -> engine -> builder -> use case.

**Exclut :** toute instanciation dans une route ou un composant.

**Gate :** test de composition avec fakes ; recherche statique confirmant qu'aucun autre fichier ne construit ces dépendances.

### 5. Route Handler de chat

**But :** ajouter `POST /api/interview/chat` sans supprimer les routes historiques.

**Inclut :**

- authentification ;
- rate limiting ;
- validation presentation ;
- factory ;
- use case ;
- stream adapter.

**Exclut :** prompt, score, question, décision métier et accès Supabase direct hors builder.

**Gate :** tests de route avec mocks ; test de streaming ; réponses 401, 400, 429, 500 ; contrôle que la route ne connaît aucun engine concret.

### 6. Migration UI

**But :** connecter la page Interview à `useChat()` et à la nouvelle route.

**Inclut :**

- suppression des imports IA directs de `page.tsx` et de ses hooks ;
- adaptation de l'état UI aux événements de stream ;
- conservation des interactions, écrans, Suspense et chargements existants.

**Exclut :** refactor de Career Copilot et changement de design.

**Gate :**

- test de l'UI avec flux simulé ;
- test E2E du tour de conversation ;
- recherche stricte : zéro import `core/intelligence`, `core/ai`, `core/prompts`, engine ou provider dans la surface UI Interview.

### 7. Parité, retrait et garde-fous

**But :** retirer les chemins legacy uniquement lorsqu'ils sont non utilisés et que la parité est prouvée.

**Inclut :**

- suppression ciblée des hooks IA obsolètes ;
- mise à jour des contrôles d'architecture pour couvrir `app/(app)/dashboard/interview-simulation` ;
- suppression des exceptions qui masquent `useInterviewReport` ;
- rapport de bundle final.

**Gate final :**

```text
pnpm lint
pnpm type-check
pnpm test
pnpm test:architecture
pnpm build
```

Puis, depuis un `.next` nettoyé :

1. build production ;
2. analyse des chunks client ;
3. contrôle de l'absence de chaînes de prompts et d'engines Interview ;
4. comparaison du First Load JS avec la baseline 351 kB ;
5. Playwright sur production, sans lancer `npm run dev` sur les artefacts du build.

## Matrice des responsabilités

| Couche | Peut connaître | Ne peut jamais connaître |
| --- | --- | --- |
| UI | `useChat`, DTO de présentation, événements projetés | engines, prompts, providers, Supabase serveur |
| Route | auth, validation, factory, adaptateur | règles de question, score, prompt |
| Application | ports, DTO, événements, erreurs | HTTP, React, Next, SDK |
| Domain | contrats et règles pures | infrastructure et transport |
| Infrastructure | Supabase, AI SDK, provider, prompt, mapping | composants React |
| Composition | implémentations concrètes | logique de présentation |

## Risques et parades

| Risque | Parade |
| --- | --- |
| Régression du streaming | contrat d'événements stable, test de stream de l'adaptateur, E2E du tour complet |
| Changement du format AI SDK | le SDK est confiné à l'adaptateur ; le domaine reste inchangé |
| Contexte trop lourd ou sensible | `InterviewContext` minimal, explicite et construit côté serveur |
| Parité de scores/rapport | tests de golden data sur les sorties avant bascule UI |
| Faux gain de bundle | mesure post-build propre, inspection de chunks et recherche de prompts |
| Dette dans les contrôles | règle d'architecture élargie à la vraie surface `app/` avant le gate final |
| Régression Career Copilot | aucun fichier Career Copilot n'est dans le périmètre de modification |

## Critères d'acceptation de Sprint 6.7.2

- `POST /api/interview/chat` streamé et authentifié ;
- `InterviewConversationUseCase` sans dépendance technique ;
- prompts, engines et providers exclusivement serveur ;
- UI Interview sans import interdit ;
- zéro changement Career Copilot ;
- build, typecheck, tests et tests d'architecture verts ;
- preuve de bundle avec comparaison explicite à 351 kB ;
- `INTERVIEW_MIGRATION_REPORT.md` et `INTERVIEW_BUNDLE_VERIFICATION.md` produits à la clôture d'implémentation.

