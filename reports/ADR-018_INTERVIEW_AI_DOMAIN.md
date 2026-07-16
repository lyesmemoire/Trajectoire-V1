# ADR-018 : Standard AI Domain pour Interview Simulator

**Date :** 2026-07-13  
**Statut :** Proposed  
**Décideurs :** Architecture Trajectoire

## Contexte

L'audit `INTERVIEW_ARCHITECTURE_AUDIT.md` a confirmé que la page client Interview Simulator importe des hooks qui atteignent directement des AI Engines, leurs prompts, `AIOrchestrator` et des providers. Cette chaîne explique la fuite de logique sensible côté navigateur et participe à la baseline de 351 kB de First Load JS.

Career Copilot a déjà adopté une séparation application/domain/infrastructure/presentation/composition. Cette structure devient le standard de référence pour Interview.

ADR-017 impose une IA server-only. Il évoquait des Server Actions comme mécanisme de frontière. La conversation Interview exige toutefois un flux progressif compatible AI SDK ; une Server Action n'est pas la frontière de transport retenue pour ce cas streamé.

## Décision

Interview adopte le standard AI Domain suivant :

```text
Client UI -> POST /api/interview/chat -> Use Case -> Context Builder -> Engine -> LLM Provider
```

1. Le domaine cible vit sous `lib/interview/` avec les mêmes couches que Career Copilot.
2. Les contrats, événements, erreurs et ports sont indépendants de Next.js, React, HTTP, AI SDK et Supabase.
3. `InterviewConversationUseCase` coordonne validation métier, contexte, engine et événements ; il ne construit aucune dépendance.
4. `SupabaseInterviewContextBuilder`, `InterviewEngine`, le provider LLM et `InterviewStreamAdapter` sont des implémentations infrastructure server-only.
5. `InterviewStreamAdapter` est la seule couche qui traduit les événements métier au format AI SDK.
6. `createInterviewUseCase()` est l'unique point de composition des dépendances concrètes.
7. L'UI utilise exclusivement `useChat()` et la route chat ; elle n'importe jamais `core/intelligence`, `core/ai`, `core/prompts`, providers ou engines.
8. Les prompts sont importés uniquement par l'engine infrastructure serveur.

## Clarification d'ADR-017

ADR-018 **spécialise** ADR-017 pour les conversations streamées :

- les Server Actions restent possibles pour des commandes courtes et non streamées ;
- le chat Interview utilise un Route Handler, car il représente une frontière HTTP explicite et adapte le stream AI SDK ;
- dans les deux cas, le principe non négociable reste : IA, prompts et providers server-only.

Cette décision ne remet pas en cause le principe de sécurité d'ADR-017 ; elle choisit le transport adapté au streaming.

## Conséquences

### Positives

- prompts et logique IA ne sont plus présents dans le graphe client ;
- réduction mesurable du bundle client et amélioration attendue du chargement ;
- remplacement du provider ou du modèle sans modification de l'UI ;
- tests unitaires rapides du use case avec mocks de ports ;
- événements métier stables malgré l'évolution du SDK ou du protocole HTTP ;
- cohérence structurelle entre Career Copilot et Interview.

### Contraintes

- le contexte doit rester minimal et explicitement typé ;
- la route ne peut pas contenir de logique métier ;
- le SDK AI ne peut apparaître que dans l'infrastructure ;
- la factory doit être le seul endroit d'instanciation ;
- les contrôles d'architecture doivent couvrir les hooks situés sous `app/`, pas seulement ceux sous `hooks/`.

### Coûts et risques

- migration incrémentale nécessaire pour préserver le streaming et la parité fonctionnelle ;
- maintien temporaire de routes legacy pendant la bascule ;
- adaptation de l'UI aux événements structurés de score, question et suggestion.

## Alternatives rejetées

### 1. Ajouter des imports dynamiques côté client

Rejeté : un import différé réduit éventuellement le coût initial, mais laisse prompts et engines dans un chunk navigateur et ne crée aucune frontière de sécurité.

### 2. Conserver les hooks IA et appeler le provider depuis le navigateur

Rejeté : viole le principe server-only, expose la logique et empêche une gouvernance fiable des clés, coûts et limites.

### 3. Utiliser uniquement une Server Action pour le chat

Rejeté pour le flux conversationnel : le Route Handler rend la frontière HTTP et le streaming AI SDK explicites. Les Server Actions restent valides pour les commandes non streamées.

### 4. Réutiliser directement les routes `generate` ou `orchestrate`

Rejeté : elles ne satisfont pas simultanément le contrat de contexte, le use case streamé, la factory et l'adaptateur de domaine. Elles peuvent rester en compatibilité temporaire, mais ne sont pas la cible.

### 5. Copier le code Career Copilot sans adaptation

Rejeté : le pattern est réutilisable, mais Interview a ses propres contraintes de session, question, score, objectif et niveau. Les types métier doivent rester spécifiques et stricts.

## Critères de succès

La décision est considérée appliquée lorsque :

- la page Interview n'importe plus aucun module IA interdit ;
- `POST /api/interview/chat` est l'unique frontière de conversation streamée ;
- le domaine compile sans dépendance framework ou SDK ;
- les prompts et engines Interview ont disparu des chunks client ;
- les validations, tests, build et mesure de bundle sont verts ;
- Career Copilot ne subit aucune modification fonctionnelle.

