# IOS v3 Implementation Roadmap

**Date**: 30 juillet 2026  
**Objectif**: Construire la plateforme Interview Operating System v3  
**Approche**: Architecture native IOS v3, HIIOS legacy comme référence fonctionnelle uniquement  
**Statut**: EN ATTENTE VALIDATION

---

## Architecture Overview

### Architecture IOS v3

```
┌─────────────────────────────────────────────────────────────┐
│                      Phase 0: Contracts                      │
│  Event | Fact | Snapshot | Engine | EngineCapability        │
│  RuntimeContext | InvestigationContext | DomainEvent         │
│  EventMetadata | SnapshotMetadata | PromptDefinition         │
│  Provider interfaces | Query interfaces                     │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    Phase A: Runtime Foundation              │
│  CognitiveRuntime | EngineScheduler | EventBus | Snapshot │
│  Builder | EngineRegistry | EngineCapability | Prompt     │
│  Registry | Telemetry | Feature Flags                        │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                   Phase B: Domain Foundation                │
│  InvestigationContext | Snapshot | KnowledgeGraphReducer  │
│  Event metadata | CognitivePolicies | CognitiveQueries     │
│  InvestigationLedger | DecisionGraph                         │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                     Phase C: Core Engines                    │
│  Normalizer | Identity | Perception | Evidence |           │
│  Contradiction | Temporal | Confidence                     │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    Phase D: Conversation                     │
│  Strategy | Planner | InterviewDirector | InterviewAgent  │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                      Phase E: Migration                       │
│  Migration des services existants vers CognitiveRuntime     │
└─────────────────────────────────────────────────────────────┘
```

---

## Phase 0 — Contracts

**Objectif**: Figer tous les contrats et interfaces avant toute implémentation  
**Durée estimée**: 5 jours  
**Complexité**: 🟡 Moyenne  
**Dépendances**: Aucune

**Règle**: Aucun code métier, uniquement les interfaces TypeScript

### 0.1 Event

**Responsabilité**: Contrat d'événement de base  
**Emplacement**: `apps/web/src/lib/ai/contracts/Event.ts`

**Interface**:
```typescript
interface BaseEvent<T = any> {
  id: string;
  sessionId: string;
  sequence: number;
  engine: string;
  eventType: string;
  engineVersion: string;
  payload: T;
  createdAt: Date;
}
```

**Effort**: 0.5 jour

### 0.2 Fact

**Responsabilité**: Contrat de fait cognitif  
**Emplacement**: `apps/web/src/domain/cognitive/Fact.ts`

**Interface**:
```typescript
interface Fact {
  id: string;
  type: FactType;
  content: string;
  confidence: number;
  source: string;
  timestamp: Date;
}
```

**Effort**: 0.5 jour

### 0.3 Snapshot

**Responsabilité**: Contrat de snapshot cognitif  
**Emplacement**: `apps/web/src/domain/cognitive/Snapshot.ts`

**Interface**:
```typescript
interface Snapshot {
  id: string;
  sessionId: string;
  timestamp: Date;
  sequence: number;
  cognitiveState: CognitiveState;
  decisionGraph: DecisionGraph;
  metadata: SnapshotMetadata;
}
```

**Effort**: 0.5 jour

### 0.4 Engine

**Responsabilité**: Contrat de moteur  
**Emplacement**: `apps/web/src/lib/ai/contracts/Engine.ts`

**Interface**:
```typescript
interface Engine<I extends EngineInput = EngineInput, E extends BaseEvent = BaseEvent> {
  readonly name: string;
  readonly version: string;
  execute(input: I): Promise<EngineResult<E>>;
}
```

**Effort**: 0.5 jour (existe déjà)

### 0.5 EngineCapability

**Responsabilité**: Contrat de capacité de moteur  
**Emplacement**: `apps/web/src/lib/ai/contracts/EngineCapability.ts`

**Interface**:
```typescript
interface EngineCapability {
  engineName: string;
  version: string;
  inputSchema: z.ZodSchema;
  outputSchema: z.ZodSchema;
  requiredContext: string[];
  providedEvents: string[];
  maxConcurrency: number;
  estimatedTokens: number;
}
```

**Effort**: 0.5 jour

### 0.6 RuntimeContext

**Responsabilité**: Contrat de contexte d'exécution  
**Emplacement**: `apps/web/src/lib/ai/contracts/RuntimeContext.ts`

**Interface**:
```typescript
interface RuntimeContext {
  sessionId: string;
  startTime: Date;
  configuration: RuntimeConfiguration;
  capabilities: EngineCapability[];
}
```

**Effort**: 0.5 jour

### 0.7 InvestigationContext

**Responsabilité**: Contrat de contexte d'investigation  
**Emplacement**: `apps/web/src/domain/cognitive/InvestigationContext.ts`

**Interface**:
```typescript
interface InvestigationContext {
  sessionId: string;
  candidateId: string;
  interviewId: string;
  startTime: Date;
  metadata: Record<string, any>;
  constraints: InvestigationConstraints;
  goals: InvestigationGoal[];
}
```

**Effort**: 0.5 jour

### 0.8 DomainEvent

**Responsabilité**: Contrat d'événement de domaine  
**Emplacement**: `apps/web/src/domain/cognitive/DomainEvent.ts`

**Interface**:
```typescript
interface DomainEvent extends BaseEvent {
  domain: string;
  aggregateId: string;
  aggregateVersion: number;
}
```

**Effort**: 0.5 jour

### 0.9 EventMetadata

**Responsabilité**: Contrat de métadonnées d'événement  
**Emplacement**: `apps/web/src/lib/ai/contracts/EventMetadata.ts`

**Interface**:
```typescript
interface EventMetadata {
  eventId: string;
  sessionId: string;
  sequence: number;
  timestamp: Date;
  source: string;
  causalityId?: string;
  correlationId?: string;
  tags: string[];
}
```

**Effort**: 0.5 jour

### 0.10 SnapshotMetadata

**Responsabilité**: Contrat de métadonnées de snapshot  
**Emplacement**: `apps/web/src/domain/cognitive/SnapshotMetadata.ts`

**Interface**:
```typescript
interface SnapshotMetadata {
  snapshotId: string;
  sessionId: string;
  sequence: number;
  timestamp: Date;
  eventCount: number;
  checksum: string;
}
```

**Effort**: 0.5 jour

### 0.11 PromptDefinition

**Responsabilité**: Contrat de définition de prompt  
**Emplacement**: `apps/web/src/lib/ai/contracts/PromptDefinition.ts`

**Interface**:
```typescript
interface PromptDefinition {
  key: string;
  system: string;
  template: string;
  variables: Record<string, PromptVariable>;
  version: string;
}
```

**Effort**: 0.5 jour

### 0.12 Provider Interfaces

**Responsabilité**: Contrats des providers LLM  
**Emplacement**: `apps/web/src/lib/ai/contracts/LLMProvider.ts`

**Interfaces**:
```typescript
interface StructuredLLMProvider {
  generateObject<T>(params: GenerateObjectParams): Promise<GenerateObjectResult<T>>;
  generateText(params: GenerateTextParams): Promise<GenerateTextResult>;
  streamText(params: GenerateTextParams): AsyncIterable<TextChunk>;
}

interface GenerateObjectParams<T> {
  system: string;
  prompt: string;
  schema: z.ZodSchema<T>;
  schemaName: string;
  schemaDescription: string;
}
```

**Effort**: 1 jour

### 0.13 Query Interfaces

**Responsabilité**: Contrats de requêtes  
**Emplacement**: `apps/web/src/domain/cognitive/QueryInterfaces.ts`

**Interfaces**:
```typescript
interface CognitiveQuery {
  type: QueryType;
  filters: QueryFilter[];
  sort?: QuerySort;
  limit?: number;
  offset?: number;
}

interface QueryResult<T> {
  data: T[];
  total: number;
  metadata: QueryMetadata;
}
```

**Effort**: 0.5 jour

**Total Phase 0**: 5 jours

**Critères de validation**:
- [ ] Tous les contrats définis
- [ ] Contrats validés TypeScript (compilation)
- [ ] Contrats documentés
- [ ] Aucun code métier
- [ ] Tests de validation des contrats
- [ ] Revue de contrat approuvée

---

## Phase A — Runtime Foundation

**Objectif**: Construire l'infrastructure d'exécution cognitive  
**Durée estimée**: 12 jours  
**Complexité**: 🔴 Élevée  
**Dépendances**: Phase 0

**Règles de responsabilité** (voir ADR-001):
- Runtime = orchestration uniquement
- Jamais de calcul métier, score, décision, validation
- Uniquement : exécuter, publier, construire le snapshot, gérer les erreurs, gérer le budget

### A.1 CognitiveRuntime

**Responsabilité**: Orchestrateur principal du système cognitif  
**Emplacement**: `apps/web/src/lib/ai/runtime/CognitiveRuntime.ts`

**Interface**:
```typescript
interface CognitiveRuntime {
  initialize(sessionId: string, context: InvestigationContext): Promise<void>;
  processEvent(event: BaseEvent): Promise<Snapshot>;
  getSnapshot(sessionId: string): Snapshot;
  shutdown(sessionId: string): Promise<void>;
}
```

**Fonctionnalités**:
- Initialisation d'une session cognitive
- Traitement des événements
- Gestion du cycle de vie
- Coordination avec EngineScheduler

**Tests requis**:
- Tests unitaires du runtime
- Tests d'intégration avec EventBus
- Tests de cycle de vie

**Effort**: 3 jours

### A.2 EngineScheduler

**Responsabilité**: Ordonnanceur d'exécution des moteurs  
**Emplacement**: `apps/web/src/lib/ai/runtime/EngineScheduler.ts`

**Interface**:
```typescript
interface EngineScheduler {
  schedule(engine: Engine, input: EngineInput): Promise<EngineResult>;
  scheduleBatch(engines: Engine[], inputs: EngineInput[]): Promise<EngineResult[]>;
  getQueueStatus(): QueueStatus;
}
```

**Fonctionnalités**:
- Ordonnancement des moteurs
- Gestion de la file d'attente
- Priorisation des tâches
- Gestion des ressources

**Tests requis**:
- Tests d'ordonnancement
- Tests de priorisation
- Tests de charge

**Effort**: 2 jours

### A.3 EventBus

**Responsabilité**: Bus d'événements inter-moteurs  
**Emplacement**: `apps/web/src/lib/ai/runtime/EventBus.ts`

**Interface**:
```typescript
interface EventBus {
  publish(event: BaseEvent): void;
  subscribe(pattern: string, handler: EventHandler): void;
  unsubscribe(pattern: string, handler: EventHandler): void;
  getHistory(sessionId: string): BaseEvent[];
}
```

**Règle critique**: Le Runtime ne doit jamais connaître le type des événements. Uniquement `publish(event)` et `subscribe(...)`.

**Fonctionnalités**:
- Publication d'événements (type-agnostic)
- Abonnement aux événements (pattern matching)
- Filtrage par pattern
- Historique des événements
- Aucune logique de type dans le runtime

**Tests requis**:
- Tests de publication/abonnement
- Tests de filtrage
- Tests de performance
- Tests de découplage de types

**Effort**: 1.5 jours

### A.4 SnapshotBuilder

**Responsabilité**: Constructeur de snapshots cognitifs  
**Emplacement**: `apps/web/src/lib/ai/runtime/SnapshotBuilder.ts`

**Interface**:
```typescript
interface SnapshotBuilder {
  build(events: BaseEvent[], context: InvestigationContext): Snapshot;
  buildIncremental(previous: Snapshot, newEvents: BaseEvent[]): Snapshot;
  validate(snapshot: Snapshot): ValidationResult;
}
```

**Fonctionnalités**:
- Construction de snapshot complet
- Construction incrémentale
- Validation de snapshot
- Optimisation de performance

**Tests requis**:
- Tests de construction
- Tests de construction incrémentale
- Tests de validation

**Effort**: 2 jours

### A.5 EngineRegistry

**Responsabilité**: Registre des moteurs disponibles  
**Emplacement**: `apps/web/src/lib/ai/registry/EngineRegistry.ts` (existe déjà)

**Interface**:
```typescript
interface EngineRegistry {
  register(engine: Engine): void;
  get(name: string): Engine | undefined;
  getRequired(name: string): Engine;
  getAll(): Engine[];
  getCapabilities(): EngineCapability[];
}
```

**Statut**: 🟡 Partiellement implémenté  
**Fonctionnalités manquantes**:
- getCapabilities()
- Validation des capacités

**Effort**: 0.5 jour

### A.6 EngineCapability

**Responsabilité**: Définition des capacités des moteurs  
**Emplacement**: `apps/web/src/lib/ai/contracts/EngineCapability.ts`

**Interface**:
```typescript
interface EngineCapability {
  engineName: string;
  version: string;
  inputSchema: z.ZodSchema;
  outputSchema: z.ZodSchema;
  requiredContext: string[];
  providedEvents: string[];
  maxConcurrency: number;
  estimatedTokens: number;
}
```

**Fonctionnalités**:
- Définition des capacités
- Validation des schémas
- Métadonnées de performance

**Tests requis**:
- Tests de validation
- Tests de schémas

**Effort**: 1 jour

### A.7 PromptRegistry

**Responsabilité**: Registre des prompts système  
**Emplacement**: `apps/web/src/lib/ai/prompting/PromptRegistry.ts`

**Interface**:
```typescript
interface PromptRegistry {
  register(key: string, prompt: SystemPrompt): void;
  get(key: string): SystemPrompt;
  getTemplate(key: string, variables: Record<string, any>): string;
  validate(key: string): boolean;
}
```

**Fonctionnalités**:
- Enregistrement des prompts
- Récupération des prompts
- Templating des prompts
- Validation des prompts

**Tests requis**:
- Tests d'enregistrement
- Tests de templating
- Tests de validation

**Effort**: 1 jour

### A.8 Telemetry

**Responsabilité**: Télémétrie et observabilité  
**Emplacement**: `apps/web/src/lib/ai/observability/Telemetry.ts`

**Interface**:
```typescript
interface Telemetry {
  recordEvent(event: TelemetryEvent): void;
  recordMetric(metric: TelemetryMetric): void;
  recordSpan(span: TelemetrySpan): void;
  getSessionStats(sessionId: string): SessionStats;
}
```

**Fonctionnalités**:
- Enregistrement des événements
- Enregistrement des métriques
- Tracing distribué
- Statistiques de session

**Tests requis**:
- Tests d'enregistrement
- Tests de performance
- Tests d'intégration

**Effort**: 1.5 jours

### A.9 Feature Flags

**Responsabilité**: Gestion des feature flags  
**Emplacement**: `apps/web/src/lib/ai/config/FeatureFlags.ts`

**Interface**:
```typescript
interface FeatureFlags {
  isEnabled(flag: string): boolean;
  getFlag(flag: string): any;
  setFlag(flag: string, value: any): void;
  getSessionFlags(sessionId: string): Record<string, any>;
}
```

**Fonctionnalités**:
- Vérification des flags
- Récupération des flags
- Configuration par session
- Intégration avec système de flags existant

**Tests requis**:
- Tests de vérification
- Tests de configuration
- Tests d'intégration

**Effort**: 0.5 jour

**Total Phase A**: 12 jours

**Critères de validation**:
- [ ] CognitiveRuntime initialise et traite les événements
- [ ] EngineScheduler ordonnance correctement les moteurs
- [ ] EventBus publie et distribue les événements
- [ ] SnapshotBuilder construit des snapshots valides
- [ ] EngineRegistry gère les moteurs et capacités
- [ ] PromptRegistry gère les prompts système
- [ ] Telemetry enregistre les événements et métriques
- [ ] FeatureFlags gère les flags de fonctionnalité
- [ ] Tests unitaires passent avec > 80% de couverture
- [ ] Tests d'intégration passent

---

## Phase B — Domain Foundation

**Objectif**: Construire le fondement du domaine cognitif  
**Durée estimée**: 11 jours  
**Complexité**: 🔴 Élevée  
**Dépendances**: Phase A

**Règles de responsabilité** (voir ADR-003, ADR-004):
- Reducers = seules mutations autorisées (Events → Reducer → Snapshot)
- Policies = toutes les règles métier (testables sans LLM, 100% déterministes)
- Moteurs très fins, logique métier dans Policies

### B.1 InvestigationContext

**Responsabilité**: Contexte d'investigation cognitif  
**Emplacement**: `apps/web/src/domain/cognitive/InvestigationContext.ts`

**Interface**:
```typescript
interface InvestigationContext {
  sessionId: string;
  candidateId: string;
  interviewId: string;
  startTime: Date;
  metadata: Record<string, any>;
  constraints: InvestigationConstraints;
  goals: InvestigationGoal[];
}
```

**Fonctionnalités**:
- Définition du contexte d'investigation
- Gestion des contraintes
- Gestion des objectifs
- Métadonnées de session

**Tests requis**:
- Tests de création
- Tests de validation
- Tests de contraintes

**Effort**: 1.5 jours

### B.2 Snapshot

**Responsabilité**: Snapshot de l'état cognitif  
**Emplacement**: `apps/web/src/domain/cognitive/Snapshot.ts`

**Interface**:
```typescript
interface Snapshot {
  id: string;
  sessionId: string;
  timestamp: Date;
  sequence: number;
  cognitiveState: CognitiveState;
  decisionGraph: DecisionGraph;
  metadata: SnapshotMetadata;
}
```

**Fonctionnalités**:
- Représentation de l'état cognitif
- Versioning des snapshots
- Métadonnées de snapshot
- Validation de cohérence

**Tests requis**:
- Tests de création
- Tests de versioning
- Tests de validation

**Effort**: 2 jours

### B.3 KnowledgeGraphReducer

**Responsabilité**: Réducteur de graphe de connaissances  
**Emplacement**: `apps/web/src/lib/ai/reducers/KnowledgeGraphReducer.ts`

**Interface**:
```typescript
interface KnowledgeGraphReducer {
  reduce(events: BaseEvent[], previousState: CognitiveState): CognitiveState;
  reduceIncremental(event: BaseEvent, currentState: CognitiveState): CognitiveState;
  validateState(state: CognitiveState): ValidationResult;
}
```

**Fonctionnalités**:
- Réduction des événements en état
- Réduction incrémentale
- Validation de l'état
- Gestion des conflits

**Tests requis**:
- Tests de réduction
- Tests de réduction incrémentale
- Tests de validation d'état

**Effort**: 2.5 jours

### B.4 Event Metadata

**Responsabilité**: Métadonnées des événements  
**Emplacement**: `apps/web/src/lib/ai/contracts/EventMetadata.ts`

**Interface**:
```typescript
interface EventMetadata {
  eventId: string;
  sessionId: string;
  sequence: number;
  timestamp: Date;
  source: string;
  causalityId?: string;
  correlationId?: string;
  tags: string[];
}
```

**Fonctionnalités**:
- Métadonnées standardisées
- Traçabilité des événements
- Corrélation des événements
- Tagging des événements

**Tests requis**:
- Tests de création
- Tests de traçabilité
- Tests de corrélation

**Effort**: 0.5 jour

### B.5 CognitivePolicies

**Responsabilité**: Politiques cognitives  
**Emplacement**: `apps/web/src/domain/cognitive/policies/`

**Architecture**: Séparation claire des policies individuelles

**Policies requises**:
- `MinimumEvidencePolicy.ts` - Politique de preuve minimale
- `TerminationPolicy.ts` - Politique de terminaison
- `ConfidencePolicy.ts` - Politique de confiance
- `QuestionSelectionPolicy.ts` - Politique de sélection de questions
- `FollowUpPolicy.ts` - Politique de suivi
- `RiskPolicy.ts` - Politique de risque
- `ContradictionPolicy.ts` - Politique de contradiction

**Interface générique**:
```typescript
interface Policy<TInput, TOutput> {
  name: string;
  version: string;
  evaluate(input: TInput, context: InvestigationContext): TOutput;
  isApplicable(context: InvestigationContext): boolean;
}
```

**Règle critique**: Les moteurs deviennent très fins. Toute la logique métier vit dans Policies.

**Fonctionnalités par policy**:
- MinimumEvidencePolicy: Validation du nombre minimum de preuves
- TerminationPolicy: Règles de terminaison d'investigation
- ConfidencePolicy: Seuils de confiance par compétence
- QuestionSelectionPolicy: Règles de sélection de questions
- FollowUpPolicy: Règles de questions de suivi
- RiskPolicy: Évaluation et gestion des risques
- ContradictionPolicy: Gestion des contradictions

**Tests requis**:
- Tests de chaque policy individuellement
- Tests de composition des policies
- Tests d'application des policies

**Effort**: 2.5 jours

### B.6 CognitiveQueries

**Responsabilité**: Requêtes sur l'état cognitif  
**Emplacement**: `apps/web/src/domain/cognitive/CognitiveQueries.ts`

**Interface**:
```typescript
interface CognitiveQueries {
  queryState(snapshot: Snapshot, query: CognitiveQuery): QueryResult;
  queryHistory(sessionId: string, query: HistoryQuery): HistoryResult;
  queryDecisions(snapshot: Snapshot, query: DecisionQuery): DecisionResult;
}
```

**Fonctionnalités**:
- Requêtes sur l'état
- Requêtes historiques
- Requêtes de décisions
- Optimisation des requêtes

**Tests requis**:
- Tests de requêtes
- Tests d'historique
- Tests de performance

**Effort**: 1.5 jours

### B.7 InvestigationLedger

**Responsabilité**: Journal d'investigation  
**Emplacement**: `apps/web/src/domain/cognitive/InvestigationLedger.ts`

**Interface**:
```typescript
interface InvestigationLedger {
  recordEntry(entry: LedgerEntry): void;
  getEntries(sessionId: string): LedgerEntry[];
  getTimeline(sessionId: string): TimelineEntry[];
  reconcile(sessionId: string): ReconciliationResult;
}
```

**Fonctionnalités**:
- Enregistrement des entrées
- Récupération des entrées
- Timeline d'investigation
- Réconciliation

**Tests requis**:
- Tests d'enregistrement
- Tests de timeline
- Tests de réconciliation

**Effort**: 1.5 jours

### B.8 DecisionGraph

**Responsabilité**: Graphe de décisions  
**Emplacement**: `apps/web/src/domain/cognitive/DecisionGraph.ts`

**Interface**:
```typescript
interface DecisionGraph {
  addNode(node: DecisionNode): void;
  addEdge(from: string, to: string, weight: number): void;
  getPath(decisionId: string): DecisionPath;
  evaluateDecision(decisionId: string): DecisionEvaluation;
}
```

**Fonctionnalités**:
- Construction du graphe
- Ajout de nœuds et arêtes
- Calcul de chemins
- Évaluation des décisions

**Tests requis**:
- Tests de construction
- Tests de chemins
- Tests d'évaluation

**Effort**: 1.5 jours

**Total Phase B**: 10 jours

**Critères de validation**:
- [ ] InvestigationContext définit correctement le contexte
- [ ] Snapshot représente l'état cognitif
- [ ] KnowledgeGraphReducer réduit les événements correctement
- [ ] EventMetadata fournit les métadonnées nécessaires
- [ ] CognitivePolicies valide et applique les politiques
- [ ] CognitiveQueries exécute les requêtes correctement
- [ ] InvestigationLedger enregistre et récupère les entrées
- [ ] DecisionGraph construit et évalue les décisions
- [ ] Tests unitaires passent avec > 80% de couverture
- [ ] Tests d'intégration avec Phase A passent

---

## Phase C — Core Engines

**Objectif**: Implémenter les moteurs cognitifs de base  
**Durée estimée**: 18 jours  
**Complexité**: 🔴 Très élevée  
**Dépendances**: Phase A, Phase B

**Règles de responsabilité** (voir ADR-005, ADR-006):
- Engines = extraction ou détection uniquement
- Jamais de décision globale (ex: "Le candidat est senior")
- LLM uniquement pour extraction brute
- Toute logique métier en TypeScript déterministe

### C.1 Normalizer

**Responsabilité**: Normalisation des entrées  
**Emplacement**: `apps/web/src/lib/ai/engines/normalizer/NormalizerEngine.ts`

**Interface**:
```typescript
interface NormalizerEngine extends Engine<NormalizerInput, NormalizerEvent> {
  name: "NormalizerEngine";
  version: "1.0.0";
}
```

**Fonctionnalités**:
- Normalisation du texte
- Nettoyage des entrées
- Standardisation des formats
- Détection des anomalies

**Tests requis**:
- Tests de normalisation
- Tests de nettoyage
- Tests de détection d'anomalies

**Effort**: 2 jours

### C.2 Identity

**Responsabilité**: Construction de l'identité  
**Emplacement**: `apps/web/src/lib/ai/engines/identity/IdentityEngine.ts`

**Interface**:
```typescript
interface IdentityEngine extends Engine<IdentityInput, IdentityEvent> {
  name: "IdentityEngine";
  version: "1.0.0";
}
```

**Fonctionnalités**:
- Extraction d'identité
- Construction de profil
- Détection de patterns
- Mise à jour incrémentale

**Tests requis**:
- Tests d'extraction
- Tests de construction
- Tests de patterns

**Effort**: 3 jours

### C.3 Perception

**Responsabilité**: Extraction des observations  
**Emplacement**: `apps/web/src/lib/ai/engines/perception/PerceptionEngine.ts` (existe déjà)

**Statut**: ✅ Implémenté  
**Fonctionnalités manquantes**:
- Intégration avec CognitiveRuntime
- Optimisation de performance

**Effort**: 1 jour

### C.4 Evidence

**Responsabilité**: Qualification des preuves  
**Emplacement**: `apps/web/src/lib/ai/engines/evidence/EvidenceEngine.ts` (existe déjà)

**Statut**: ✅ Implémenté  
**Fonctionnalités manquantes**:
- Intégration avec CognitiveRuntime
- Détection de biais
- Optimisation de performance

**Effort**: 2 jours

### C.5 Contradiction

**Responsabilité**: Détection des contradictions  
**Emplacement**: `apps/web/src/lib/ai/engines/contradiction/ContradictionEngine.ts`

**Interface**:
```typescript
interface ContradictionEngine extends Engine<ContradictionInput, ContradictionEvent> {
  name: "ContradictionEngine";
  version: "1.0.0";
}
```

**Fonctionnalités**:
- Détection de contradictions
- Classification des contradictions
- Analyse de sévérité
- Proposition de résolution

**Tests requis**:
- Tests de détection
- Tests de classification
- Tests de sévérité

**Effort**: 3 jours

### C.6 Temporal

**Responsabilité**: Analyse temporelle  
**Emplacement**: `apps/web/src/lib/ai/engines/temporal/TemporalEngine.ts`

**Architecture**:
```
LLM (extraction)
    ↓
TimelineBuilder (TypeScript)
    ↓
TemporalValidator (TypeScript)
    ↓
Temporal Events
```

**Interface**:
```typescript
interface TemporalEngine extends Engine<TemporalInput, TemporalEvent> {
  name: "TemporalEngine";
  version: "1.0.0";
}
```

**Règle critique**: LLM uniquement pour extraction, toute logique métier en TypeScript déterministe

**Fonctionnalités**:
- Extraction temporelle via LLM (dates, durées, séquences)
- TimelineBuilder (TypeScript): construction de timeline
- TemporalValidator (TypeScript): validation de cohérence
- Détection de patterns temporels (TypeScript)
- Projection temporelle (TypeScript)

**Composants**:
- `TemporalExtractor`: LLM pour extraction brute
- `TimelineBuilder`: Construction structurée
- `TemporalValidator`: Validation déterministe

**Tests requis**:
- Tests d'extraction LLM
- Tests de construction timeline
- Tests de validation
- Tests de déterminisme de la logique métier

**Effort**: 3 jours

### C.7 Confidence

**Responsabilité**: Calcul de confiance  
**Emplacement**: `apps/web/src/lib/ai/engines/confidence/ConfidenceEngine.ts`

**Interface**:
```typescript
interface ConfidenceEngine extends Engine<ConfidenceInput, ConfidenceEvent> {
  name: "ConfidenceEngine";
  version: "1.0.0";
}
```

**Règle critique**: NO LLM - 100% TypeScript - 100% déterministe

**Fonctionnalités**:
- Calcul de confiance (algorithmes déterministes)
- Agrégation de confiance (formules mathématiques)
- Mise à jour de confiance (règles explicites)
- Seuils de confiance (configurables)
- Aucun appel LLM

**Tests requis**:
- Tests de calcul
- Tests d'agrégation
- Tests de seuils
- Tests de déterminisme

**Effort**: 4 jours

**Total Phase C**: 18 jours

**Critères de validation**:
- [ ] Normalizer normalise correctement les entrées
- [ ] Identity construit correctement l'identité
- [ ] Perception extrait correctement les observations
- [ ] Evidence qualifie correctement les preuves
- [ ] Contradiction détecte correctement les contradictions
- [ ] Temporal analyse correctement la timeline
- [ ] Confidence calcule correctement la confiance
- [ ] Tous les moteurs respectent le contrat Engine
- [ ] Tests unitaires passent avec > 80% de couverture
- [ ] Tests d'intégration avec Phase A et B passent

---

## Phase D — Conversation

**Objectif**: Implémenter la couche conversationnelle  
**Durée estimée**: 12 jours  
**Complexité**: 🔴 Élevée  
**Dépendances**: Phase A, Phase B, Phase C

### D.1 Strategy

**Responsabilité**: Stratégie d'entretien  
**Emplacement**: `apps/web/src/lib/ai/engines/strategy/StrategyEngine.ts`

**Interface**:
```typescript
interface StrategyEngine extends Engine<StrategyInput, StrategyEvent> {
  name: "StrategyEngine";
  version: "1.0.0";
}
```

**Fonctionnalités**:
- Définition de stratégie
- Adaptation de stratégie
- Évaluation de stratégie
- Changement de stratégie

**Tests requis**:
- Tests de définition
- Tests d'adaptation
- Tests d'évaluation

**Effort**: 3 jours

### D.2 Planner

**Responsabilité**: Planification des questions  
**Emplacement**: `apps/web/src/lib/ai/engines/planner/PlannerEngine.ts`

**Interface**:
```typescript
interface PlannerEngine extends Engine<PlannerInput, PlannerEvent> {
  name: "PlannerEngine";
  version: "1.0.0";
}
```

**Fonctionnalités**:
- Planification de questions
- Optimisation de l'information
- Gestion du budget
- Adaptation au contexte

**Tests requis**:
- Tests de planification
- Tests d'optimisation
- Tests de budget

**Effort**: 4 jours

### D.3 InterviewDirector

**Responsabilité**: Direction de l'entretien  
**Emplacement**: `apps/web/src/lib/ai/directors/InterviewDirector.ts`

**Interface**:
```typescript
interface InterviewDirector {
  directInterview(sessionId: string): InterviewDirection;
  adjustStrategy(sessionId: string, feedback: Feedback): void;
  handleInterruption(sessionId: string): InterruptionResponse;
}
```

**Fonctionnalités**:
- Direction de l'entretien
- Ajustement de stratégie
- Gestion des interruptions
- Coordination des moteurs

**Tests requis**:
- Tests de direction
- Tests d'ajustement
- Tests d'interruption

**Effort**: 3 jours

### D.4 InterviewAgent

**Responsabilité**: Agent d'entretien  
**Emplacement**: `apps/web/src/lib/ai/agents/InterviewAgent.ts`

**Interface**:
```typescript
interface InterviewAgent {
  generateResponse(context: ConversationContext): Promise<AgentResponse>;
  handleUserMessage(message: string): Promise<AgentResponse>;
  maintainContext(): void;
}
```

**Fonctionnalités**:
- Génération de réponses
- Gestion des messages utilisateur
- Maintien du contexte
- Personnalisation

**Tests requis**:
- Tests de génération
- Tests de contexte
- Tests de personnalisation

**Effort**: 2 jours

**Total Phase D**: 12 jours

**Critères de validation**:
- [ ] Strategy définit correctement la stratégie
- [ ] Planner planifie correctement les questions
- [ ] InterviewDirector dirige correctement l'entretien
- [ ] InterviewAgent génère correctement les réponses
- [ ] Tests unitaires passent avec > 80% de couverture
- [ ] Tests d'intégration avec Phases A, B, C passent
- [ ] Tests E2E de conversation passent

---

## Phase E — Migration

**Objectif**: Migrer les services existants vers CognitiveRuntime  
**Durée estimée**: 15 jours  
**Complexité**: 🔴 Très élevée  
**Dépendances**: Phase A, Phase B, Phase C, Phase D

### E.1 Identification des Services

**Responsabilité**: Identifier les services utilisant HIIOS  
**Emplacement**: Analyse du codebase existant

**Services à migrer**:
- Services d'API utilisant HIIOS
- Services d'application utilisant HIIOS
- Services de frontend utilisant HIIOS

**Effort**: 2 jours

### E.2 Création d'Adapters

**Responsabilité**: Créer des adapters pour la migration  
**Emplacement**: `apps/web/src/lib/ai/adapters/`

**Adapters requis**:
- HIIOS → IOS adapter
- API adapter
- State adapter

**Effort**: 4 jours

### E.3 Migration Graduelle

**Responsabilité**: Migrer progressivement les services  
**Stratégie**: Migration par feature flag

**Étapes**:
1. Activer IOS pour un service
2. Valider le comportement
3. Activer pour tous les services
4. Désactiver HIIOS

**Effort**: 6 jours

### E.4 Validation

**Responsabilité**: Valider la migration complète  
**Tests requis**:
- Tests E2E complets
- Tests de performance
- Tests de régression

**Effort**: 3 jours

**Total Phase E**: 15 jours

**Critères de validation**:
- [ ] Tous les services identifiés
- [ ] Adapters créés et testés
- [ ] Migration graduelle réussie
- [ ] Tests E2E passent
- [ ] Tests de performance passent
- [ ] Tests de régression passent
- [ ] HIIOS peut être désactivé

---

## Résumé Global

### Estimation Totale

| Phase | Durée | Complexité | Dépendances |
|-------|-------|------------|-------------|
| Phase 0: Contracts | 5 jours | 🟡 Moyenne | Aucune |
| Phase A: Runtime Foundation | 12 jours | 🔴 Élevée | Phase 0 |
| Phase B: Domain Foundation | 11 jours | 🔴 Élevée | Phase A |
| Phase C: Core Engines | 18 jours | 🔴 Très élevée | Phase A, B |
| Phase D: Conversation | 12 jours | 🔴 Élevée | Phase A, B, C |
| Phase E: Migration | 15 jours | 🔴 Très élevée | Phase A, B, C, D |
| **Total** | **73 jours** | **🔴 Très élevée** | **Séquentiel** |

### Critères de Succès Globaux

- [ ] Toutes les phases complétées
- [ ] Tests unitaires > 80% de couverture
- [ ] Tests d'intégration passent
- [ ] Tests E2E passent
- [ ] Performance acceptable
- [ ] Documentation complète
- [ ] HIIOS peut être désactivé

### Risques

| Risque | Impact | Probabilité | Mitigation |
|--------|--------|-------------|------------|
| Complexité des moteurs | 🔴 Critique | 🟡 Moyenne | Architecture modulaire |
| Performance du runtime | 🔴 Critique | 🟡 Moyenne | Benchmarks continus |
| Migration complexe | 🔴 Critique | 🟡 Moyenne | Migration graduelle |
| Dépendances entre phases | 🟡 Moyen | 🔴 Élevée | Planning précis |
| Tests insuffisants | 🟡 Moyen | 🟡 Moyenne | Couverture élevée |

### Prochaines Étapes

1. **Valider cette roadmap ajustée** avec l'équipe
2. **Créer la branche**: `feature/ios-v3-implementation`
3. **Commencer Phase 0**: Contracts (interfaces uniquement)
4. **Compiler et tester** après chaque phase
5. **Commit après chaque phase validée**
6. **Attendre validation** avant de passer à la phase suivante

### Mode Implémentation Stricte

Une fois validé, passer en mode implémentation stricte:

- ❌ Plus de nouvelles architectures
- ❌ Plus de nouveaux plans
- ❌ Plus de documents de conception
- ❌ Plus de nouvelles estimations

Uniquement:
1. Implémenter une phase
2. Compiler
3. Corriger les erreurs
4. Exécuter tous les tests
5. Commit
6. Attendre validation

---

**Document créé le 30 juillet 2026**
**Basé exclusivement sur l'architecture IOS v3**
**Ajusté avec Phase 0 et règles critiques**
**En attente de validation avant toute implémentation**
