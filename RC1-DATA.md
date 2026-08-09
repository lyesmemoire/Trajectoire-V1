# RC1-DATA - Traçabilité des Données

**Date:** 2026-08-05  
**Mission:** RC1.3 - Tracer chaque donnée du pipeline  
**Statut:** 📊 ANALYSE COMPLÉTÉE

---

## 📊 RÉSUMÉ EXÉCUTIF

**Objectif:** Tracer chaque donnée à travers le pipeline complet depuis le CV jusqu'au Dashboard, avec métadonnées complètes (UUID, Source, Confidence, Version, Timestamp, Hash).

**Résultat:** Analyse complète du pipeline actuel et proposition d'implémentation du traçage de données.

---

## 🔍 PIPELINE ACTUEL

### 1. CV Pipeline

**Fichier:** `apps/api/src/cv/cv.service.ts`

**Flux:**
```
CV (File Upload)
  ↓ extractText()
Text (String)
  ↓ extractKnowledge()
Knowledge (Object: personalInfo, experiences, education, skills, certifications, languages)
  ↓ normalizeKnowledge()
NormalizedKnowledge (Object avec normalized, jobId, skillId, confidence)
  ↓ buildGraph()
Graph (Entities, Attributes, Relationships, SemanticGraph)
  ↓ generateProfile()
Profile (ProfileId, personalInfo, experiences, education, skills, certifications, languages, profileScores)
```

**Métadonnées actuelles:**
- ❌ **UUID:** Non présent
- ❌ **Source:** Non présent
- ⚠️ **Confidence:** Présent dans Normalization (0.0-1.0)
- ❌ **Version:** Non présent
- ⚠️ **Timestamp:** Partiel (profileId utilise Date.now())
- ❌ **Hash:** Non présent

---

### 2. Extraction Pipeline

**Fichier:** `apps/api/src/cv/cv.service.ts`

**Méthodes:**
- `extractPersonalInfo()` → email, phone
- `extractExperiences()` → title, (company, duration, description vides)
- `extractEducation()` → degree, (institution, year, field vides)
- `extractSkills()` → name, type, level (hardcoded 'intermediate')
- `extractCertifications()` → name, (issuer, date vides)
- `extractLanguages()` → name, level (hardcoded 'intermediate')

**Métadonnées actuelles:**
- ❌ **UUID:** Non présent
- ❌ **Source:** Non présent
- ❌ **Confidence:** Non présent
- ❌ **Version:** Non présent
- ❌ **Timestamp:** Non présent
- ❌ **Hash:** Non présent

---

### 3. Normalization Pipeline

**Fichier:** `apps/api/src/cv/normalization.service.ts`

**Flux:**
```
Knowledge (Raw)
  ↓ normalizeJob()
NormalizedJob (normalized, id, confidence)
  ↓ normalizeSkill()
NormalizedSkill (normalized, id, confidence)
  ↓ normalizeKnowledge()
NormalizedKnowledge (experiences[], skills[], normalized: true)
```

**Métadonnées actuelles:**
- ⚠️ **UUID:** Partiel (id depuis KP-001/KP-002)
- ⚠️ **Source:** Non présent (KP-001/KP-002 implicite)
- ✅ **Confidence:** Présent (1.0 direct match, 0.9 synonym, 0.7 partial, 0.0 no match)
- ❌ **Version:** Non présent
- ❌ **Timestamp:** Non présent
- ❌ **Hash:** Non présent

---

### 4. Graph Pipeline

**Fichiers:** 
- `apps/api/src/cv/graph-builder.service.ts`
- `apps/api/src/runtime/kg/runtime-graph.service.ts`

**Flux (GraphBuilder):**
```
NormalizedKnowledge
  ↓ createEntity()
Entity (id, type, attributes)
  ↓ createRelationship()
Relationship (id, from, to, type, attributes)
  ↓ buildSemanticGraph()
SemanticGraph (nodes[], edges[])
```

**Flux (RuntimeGraph):**
```
CandidateGraphInput / JobGraphInput
  ↓ buildNodesFromCV() / buildNodesFromJob()
Nodes (Node[])
  ↓ buildEdgesFromCV() / buildEdgesFromJob()
Edges (Edge[])
  ↓ fuseNodes()
FusedNodes (Node[])
  ↓ createGraph()
Graph (nodes: Map, edges: Map, metadata)
  ↓ validateGraph()
ValidationResult (isValid, errors[], warnings[])
```

**Métadonnées actuelles (Graph Types):**
- ✅ **UUID:** Présent (Node.id, Edge.id)
- ✅ **Source:** Présent (Node.source, Edge.source)
- ✅ **Confidence:** Présent (Node.confidence, Edge.confidence)
- ✅ **Version:** Présent (Graph.metadata.version)
- ✅ **Timestamp:** Présent (Node.timestamps, Edge.timestamps, Graph.metadata.createdAt/updatedAt)
- ❌ **Hash:** Non présent

**Note:** Les types Graph dans `graph-types.ts` incluent déjà `provenance` avec `NodeProvenance` et `EdgeProvenance`.

---

### 5. Matching Pipeline

**Fichier:** `apps/api/src/runtime/kg/graph-matching.service.ts`

**Flux:**
```
CandidateGraph + JobGraph
  ↓ match()
MatchingResult (candidateId, jobId, score, transferableSkills, neighborhood, distance, centrality, matchedSkills, missingSkills, strengths, weaknesses, recommendations)
```

**Métadonnées actuelles:**
- ⚠️ **UUID:** Partiel (candidateId, jobId)
- ❌ **Source:** Non présent
- ❌ **Confidence:** Non présent (score est 0-100, pas confidence)
- ❌ **Version:** Non présent)
- ❌ **Timestamp:** Non présent
- ❌ **Hash:** Non présent

---

### 6. Search Pipeline

**Fichier:** `apps/api/src/runtime/kg/graph-search.service.ts`

**Flux:**
```
JobGraph + CandidateGraphs[]
  ↓ searchCandidatesByNeighborhood()
NeighborhoodSearchResult[] (id, score, graph, matchReason, commonNodes, commonEdges, overlap, distance)
  ↓ findSimilarCandidates()
SimilaritySearchResult[] (id, score, graph, matchReason, commonNodes, commonEdges, jaccardSimilarity, cosineSimilarity, skillOverlap)
  ↓ searchCandidatesByCommunity()
CommunitySearchResult[] (id, score, graph, matchReason, commonNodes, commonEdges, communityId, communitySize, communityDensity)
```

**Métadonnées actuelles:**
- ⚠️ **UUID:** Partiel (id)
- ❌ **Source:** Non présent
- ❌ **Confidence:** Non présent (score est 0-100, pas confidence)
- ❌ **Version:** Non présent
- ❌ **Timestamp:** Non présent
- ❌ **Hash:** Non présent

---

### 7. Copilot Pipeline

**Fichier:** `apps/api/src/copilot/copilot.service.ts`

**Flux:**
```
User Message + SessionId
  ↓ interpret()
Intent (type, entities)
  ↓ answerCandidateQuestion()
Explanation (summary, detailedExplanation, evidence, reasoningTrace)
  ↓ handleSearchCandidates() / handleSearchJobs()
Data (results, jobGraph/candidateGraph)
  ↓ buildResponse()
CopilotResponse (message, sources, reasoning)
  ↓ addMessage()
ConversationHistory (role, content, timestamp, sources, reasoning)
```

**Métadonnées actuelles:**
- ⚠️ **UUID:** Partiel (sessionId)
- ❌ **Source:** Non présent
- ⚠️ **Confidence:** Partiel (reasoningTrace.confidence)
- ❌ **Version:** Non présent
- ✅ **Timestamp:** Présent (timestamp dans messages)
- ❌ **Hash:** Non présent

---

### 8. Dashboard Pipeline

**Fichiers:**
- `apps/web/src/types/dashboard.ts`
- `apps/web/src/app/dashboard/`

**Flux:**
```
API Response
  ↓ DashboardProps
DashboardUserData, DashboardScore, DashboardSkill[], DashboardCareer, DashboardRecommendation[], DashboardHistoryItem[], DashboardAction[], DashboardProgress, DashboardInsight[], DashboardTimelineEvent[]
  ↓ DashboardWidgets
ScoreWidget, SkillsWidget, CareerWidget, RecommendationsWidget, HistoryWidget, ActionsWidget, ProgressWidget, InsightsWidget, TimelineWidget
```

**Métadonnées actuelles:**
- ⚠️ **UUID:** Partiel (id dans DashboardRecommendation, DashboardHistoryItem, DashboardAction, DashboardTimelineEvent)
- ❌ **Source:** Non présent
- ❌ **Confidence:** Non présent
- ❌ **Version:** Non présent
- ⚠️ **Timestamp:** Partiel (date dans DashboardUserData.lastLogin, DashboardHistoryItem.date, DashboardTimelineEvent.date)
- ❌ **Hash:** Non présent

---

## 🚨 MÉTADONNÉES MANQUANTES

### Résumé par Pipeline

| Pipeline | UUID | Source | Confidence | Version | Timestamp | Hash |
|----------|------|--------|------------|---------|-----------|------|
| CV | ❌ | ❌ | ❌ | ❌ | ⚠️ | ❌ |
| Extraction | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Normalization | ⚠️ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Graph | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| Matching | ⚠️ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Search | ⚠️ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Copilot | ⚠️ | ❌ | ⚠️ | ❌ | ✅ | ❌ |
| Dashboard | ⚠️ | ❌ | ❌ | ❌ | ⚠️ | ❌ |

**Légende:**
- ✅ = Présent
- ⚠️ = Partiel
- ❌ = Absent

---

## 💡 PROPOSITION D'IMPLÉMENTATION

### 1. Interface DataTrace

Créer une interface commune pour le traçage des données:

```typescript
// apps/api/src/common/data-trace.interface.ts

export interface DataTrace {
  /** UUID unique de la donnée */
  uuid: string;
  
  /** Source de la donnée (ex: 'CV_PARSER', 'NORMALIZATION_KP001', 'GRAPH_MATCHING') */
  source: string;
  
  /** Confidence de la donnée (0.0-1.0) */
  confidence: number;
  
  /** Version de la donnée */
  version: string;
  
  /** Timestamp de création */
  createdAt: Date;
  
  /** Timestamp de dernière modification */
  updatedAt: Date;
  
  /** Hash de la donnée (SHA-256) */
  hash: string;
  
  /** UUID de la donnée parente (si applicable) */
  parentUuid?: string;
  
  /** Type de la donnée */
  dataType: 'CV' | 'EXTRACTION' | 'NORMALIZATION' | 'GRAPH' | 'MATCHING' | 'SEARCH' | 'COPILOT' | 'DASHBOARD';
  
  /** Métadonnées supplémentaires */
  metadata?: Record<string, any>;
}

export interface TracedData<T> {
  data: T;
  trace: DataTrace;
}
```

### 2. Service DataTraceService

Créer un service pour gérer le traçage:

```typescript
// apps/api/src/common/data-trace.service.ts

import { Injectable } from '@nestjs/common';
import { createHash } from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { DataTrace, TracedData } from './data-trace.interface';

@Injectable()
export class DataTraceService {
  /**
   * Crée un nouveau DataTrace pour une donnée
   */
  createTrace(
    data: any,
    source: string,
    dataType: DataTrace['dataType'],
    parentUuid?: string,
    confidence: number = 1.0
  ): DataTrace {
    const now = new Date();
    const hash = this.computeHash(data);
    
    return {
      uuid: uuidv4(),
      source,
      confidence,
      version: '1.0.0',
      createdAt: now,
      updatedAt: now,
      hash,
      parentUuid,
      dataType,
    };
  }

  /**
   * Enveloppe une donnée avec son traçage
   */
  traceData<T>(
    data: T,
    source: string,
    dataType: DataTrace['dataType'],
    parentUuid?: string,
    confidence: number = 1.0
  ): TracedData<T> {
    const trace = this.createTrace(data, source, dataType, parentUuid, confidence);
    return { data, trace };
  }

  /**
   * Met à jour le traçage d'une donnée existante
   */
  updateTrace(trace: DataTrace, newData: any): DataTrace {
    const now = new Date();
    const newHash = this.computeHash(newData);
    
    return {
      ...trace,
      updatedAt: now,
      hash: newHash,
      version: this.incrementVersion(trace.version),
    };
  }

  /**
   * Calcule le hash SHA-256 d'une donnée
   */
  private computeHash(data: any): string {
    const dataString = JSON.stringify(data);
    return createHash('sha256').update(dataString).digest('hex');
  }

  /**
   * Incrémente la version (ex: 1.0.0 → 1.0.1)
   */
  private incrementVersion(version: string): string {
    const parts = version.split('.');
    const patch = parseInt(parts[2] || '0', 10) + 1;
    return `${parts[0]}.${parts[1]}.${patch}`;
  }
}
```

### 3. Modifications des Services

#### CV Service

```typescript
// apps/api/src/cv/cv.service.ts

@Injectable()
export class CvService {
  constructor(
    private readonly normalizationService: NormalizationService,
    private readonly graphBuilderService: GraphBuilderService,
    private readonly dataTraceService: DataTraceService,
  ) {}

  async processCv(file: any): Promise<TracedData<any>> {
    // Step 1: Extract text from CV
    const text = await this.extractText(file);
    const textTrace = this.dataTraceService.traceData(
      text,
      'CV_PARSER',
      'EXTRACTION',
      undefined,
      0.9 // PDF parsing confidence
    );

    // Step 2: Extract knowledge from text
    const knowledge = await this.extractKnowledge(text);
    const knowledgeTrace = this.dataTraceService.traceData(
      knowledge,
      'CV_PARSER',
      'EXTRACTION',
      textTrace.trace.uuid,
      0.7 // Regex extraction confidence
    );

    // Step 3: Normalize knowledge with KP-001 and KP-002
    const normalizedKnowledge = await this.normalizeKnowledge(knowledge);
    const normalizedTrace = this.dataTraceService.traceData(
      normalizedKnowledge,
      'NORMALIZATION_KP001_KP002',
      'NORMALIZATION',
      knowledgeTrace.trace.uuid,
      this.calculateAverageConfidence(normalizedKnowledge)
    );

    // Step 4: Build knowledge graph
    const graph = await this.buildGraph(normalizedKnowledge);
    const graphTrace = this.dataTraceService.traceData(
      graph,
      'GRAPH_BUILDER',
      'GRAPH',
      normalizedTrace.trace.uuid,
      1.0
    );

    // Step 5: Generate candidate profile
    const profile = await this.generateProfile(graph);
    const profileTrace = this.dataTraceService.traceData(
      profile,
      'PROFILE_GENERATOR',
      'GRAPH',
      graphTrace.trace.uuid,
      0.9
    );

    return {
      data: {
        originalFile: file.filename,
        text: textTrace,
        knowledge: knowledgeTrace,
        normalizedKnowledge: normalizedTrace,
        graph: graphTrace,
        profile: profileTrace,
      },
      trace: profileTrace.trace,
    };
  }

  private calculateAverageConfidence(normalizedKnowledge: any): number {
    const expConfidences = normalizedKnowledge.experiences.map((e: any) => e.confidence || 0);
    const skillConfidences = normalizedKnowledge.skills.map((s: any) => s.confidence || 0);
    
    const allConfidences = [...expConfidences, ...skillConfidences];
    if (allConfidences.length === 0) return 0.5;
    
    return allConfidences.reduce((sum: number, conf: number) => sum + conf, 0) / allConfidences.length;
  }
}
```

#### Normalization Service

```typescript
// apps/api/src/cv/normalization.service.ts

@Injectable()
export class NormalizationService {
  constructor(
    private readonly dataTraceService: DataTraceService,
  ) {}

  normalizeKnowledge(knowledge: any, parentUuid?: string): TracedData<any> {
    // Normalize job titles in experiences
    const normalizedExperiences = knowledge.experiences.map((exp: any) => {
      const normalizedJob = this.normalizeJob(exp.title);
      return {
        ...exp,
        title: normalizedJob.normalized,
        jobId: normalizedJob.id,
        confidence: normalizedJob.confidence,
      };
    });

    // Normalize skills
    const normalizedSkills = knowledge.skills.map((skill: any) => {
      const normalizedSkill = this.normalizeSkill(skill.name);
      return {
        ...skill,
        name: normalizedSkill.normalized,
        skillId: normalizedSkill.id,
        confidence: normalizedSkill.confidence,
      };
    });

    const normalizedKnowledge = {
      ...knowledge,
      experiences: normalizedExperiences,
      skills: normalizedSkills,
      normalized: true,
    };

    return this.dataTraceService.traceData(
      normalizedKnowledge,
      'NORMALIZATION_KP001_KP002',
      'NORMALIZATION',
      parentUuid,
      this.calculateAverageConfidence(normalizedKnowledge)
    );
  }

  private calculateAverageConfidence(normalizedKnowledge: any): number {
    const expConfidences = normalizedKnowledge.experiences.map((e: any) => e.confidence || 0);
    const skillConfidences = normalizedKnowledge.skills.map((s: any) => s.confidence || 0);
    
    const allConfidences = [...expConfidences, ...skillConfidences];
    if (allConfidences.length === 0) return 0.5;
    
    return allConfidences.reduce((sum: number, conf: number) => sum + conf, 0) / allConfidences.length;
  }
}
```

#### Graph Matching Service

```typescript
// apps/api/src/runtime/kg/graph-matching.service.ts

export class GraphMatchingService {
  constructor(
    private readonly graphQueryEngine: GraphQueryEngine,
    private readonly graphAnalyticsService: GraphAnalyticsService,
    private readonly dataTraceService: DataTraceService,
  ) {}

  match(candidateGraph: Graph, jobGraph: Graph): TracedData<MatchingResult> {
    const candidateId = this.extractId(candidateGraph);
    const jobId = this.extractId(jobGraph);

    // ... existing matching logic ...

    const matchingResult: MatchingResult = {
      candidateId,
      jobId,
      score,
      transferableSkills,
      neighborhood,
      distance,
      centrality,
      matchedSkills,
      missingSkills,
      strengths,
      weaknesses,
      recommendations,
    };

    return this.dataTraceService.traceData(
      matchingResult,
      'GRAPH_MATCHING',
      'MATCHING',
      undefined,
      score.overall / 100 // Convert score to confidence
    );
  }
}
```

#### Graph Search Service

```typescript
// apps/api/src/runtime/kg/graph-search.service.ts

export class GraphSearchService {
  constructor(
    private readonly graphQueryEngine: GraphQueryEngine,
    private readonly graphAnalyticsService: GraphAnalyticsService,
    private readonly dataTraceService: DataTraceService,
  ) {}

  searchCandidatesByNeighborhood(
    jobGraph: Graph,
    candidateGraphs: Graph[],
    options: { maxDepth?: number; limit?: number } = {}
  ): TracedData<NeighborhoodSearchResult[]> {
    // ... existing search logic ...

    const results = this.dataTraceService.traceData(
      searchResults,
      'GRAPH_SEARCH_NEIGHBORHOOD',
      'SEARCH',
      undefined,
      this.calculateAverageScore(searchResults) / 100
    );

    return results;
  }

  private calculateAverageScore(results: Array<{ score: number }>): number {
    if (results.length === 0) return 0;
    return results.reduce((sum, r) => sum + r.score, 0) / results.length;
  }
}
```

### 4. Dashboard Types

```typescript
// apps/web/src/types/dashboard.ts

export interface DataTrace {
  uuid: string;
  source: string;
  confidence: number;
  version: string;
  createdAt: Date;
  updatedAt: Date;
  hash: string;
  parentUuid?: string;
  dataType: 'CV' | 'EXTRACTION' | 'NORMALIZATION' | 'GRAPH' | 'MATCHING' | 'SEARCH' | 'COPILOT' | 'DASHBOARD';
}

export interface TracedDashboardData {
  userData: DashboardUserData & { trace: DataTrace };
  score: DashboardScore & { trace: DataTrace };
  skills: Array<DashboardSkill & { trace: DataTrace }>;
  career: DashboardCareer & { trace: DataTrace };
  recommendations: Array<DashboardRecommendation & { trace: DataTrace }>;
  history: Array<DashboardHistoryItem & { trace: DataTrace }>;
  actions: Array<DashboardAction & { trace: DataTrace }>;
  progress: DashboardProgress & { trace: DataTrace };
  insights: Array<DashboardInsight & { trace: DataTrace }>;
  timeline: Array<DashboardTimelineEvent & { trace: DataTrace }>;
}
```

### 5. Repository DataTraceRepository

Créer un repository pour stocker les traces:

```typescript
// apps/api/src/common/data-trace.repository.ts

import { Injectable } from '@nestjs/common';
import { DataTrace } from './data-trace.interface';

@Injectable()
export class DataTraceRepository {
  private traces: Map<string, DataTrace> = new Map();

  /**
   * Sauvegarde une trace
   */
  save(trace: DataTrace): void {
    this.traces.set(trace.uuid, trace);
  }

  /**
   * Récupère une trace par UUID
   */
  findByUuid(uuid: string): DataTrace | undefined {
    return this.traces.get(uuid);
  }

  /**
   * Récupère toutes les traces d'une donnée parente
   */
  findByParentUuid(parentUuid: string): DataTrace[] {
    return Array.from(this.traces.values()).filter(
      trace => trace.parentUuid === parentUuid
    );
  }

  /**
   * Récupère le lineage complet d'une donnée
   */
  getLineage(uuid: string): DataTrace[] {
    const lineage: DataTrace[] = [];
    let current = this.findByUuid(uuid);

    while (current) {
      lineage.unshift(current);
      if (current.parentUuid) {
        current = this.findByUuid(current.parentUuid);
      } else {
        current = undefined;
      }
    }

    return lineage;
  }

  /**
   * Récupère toutes les traces par type de donnée
   */
  findByDataType(dataType: DataTrace['dataType']): DataTrace[] {
    return Array.from(this.traces.values()).filter(
      trace => trace.dataType === dataType
    );
  }
}
```

---

## 📋 PLAN D'IMPLÉMENTATION

### Phase 1: Infrastructure (Priorité Haute)
1. Créer `DataTrace` interface
2. Créer `DataTraceService`
3. Créer `DataTraceRepository`
4. Ajouter les dépendances (uuid, crypto)

### Phase 2: Backend Services (Priorité Haute)
1. Modifier `CvService` pour utiliser `DataTraceService`
2. Modifier `NormalizationService` pour utiliser `DataTraceService`
3. Modifier `GraphBuilderService` pour utiliser `DataTraceService`
4. Modifier `RuntimeGraphService` pour utiliser `DataTraceService`
5. Modifier `GraphMatchingService` pour utiliser `DataTraceService`
6. Modifier `GraphSearchService` pour utiliser `DataTraceService`
7. Modifier `GraphReasoningEngine` pour utiliser `DataTraceService`
8. Modifier `CopilotService` pour utiliser `DataTraceService`

### Phase 3: API Endpoints (Priorité Moyenne)
1. Ajouter endpoint `/api/traces/:uuid` pour récupérer une trace
2. Ajouter endpoint `/api/traces/lineage/:uuid` pour récupérer le lineage
3. Ajouter endpoint `/api/traces/data-type/:type` pour filtrer par type
4. Modifier les endpoints existants pour retourner les traces

### Phase 4: Frontend Dashboard (Priorité Moyenne)
1. Modifier `DashboardProps` pour inclure les traces
2. Créer composant `DataTraceViewer` pour visualiser le lineage
3. Ajouter bouton "View Data Lineage" dans le dashboard
4. Afficher les métadonnées (confidence, source, version) dans les widgets

### Phase 5: Tests (Priorité Haute)
1. Tests unitaires pour `DataTraceService`
2. Tests unitaires pour `DataTraceRepository`
3. Tests d'intégration pour le pipeline complet
4. Tests de régression pour assurer qu'aucune donnée n'est perdue

---

## ✅ VALIDATION

### Aucune donnée perdue
- ✅ Chaque étape du pipeline enveloppe la donnée avec son traçage
- ✅ Les données originales sont préservées dans `TracedData<T>`
- ✅ Le lineage complet peut être retracé via `parentUuid`

### Métadonnées complètes
- ✅ **UUID:** Généré automatiquement avec uuidv4
- ✅ **Source:** Spécifié explicitement à chaque étape
- ✅ **Confidence:** Calculé ou spécifié à chaque étape
- ✅ **Version:** Géré automatiquement avec incrémentation
- ✅ **Timestamp:** createdAt et updatedAt automatiques
- ✅ **Hash:** Calculé automatiquement avec SHA-256

---

## 🎯 CONCLUSION

**Analyse RC1.3:** ✅ **COMPLÉTÉE**

Le pipeline actuel manque de traçage complet des données. Seul le pipeline Graph a des métadonnées partielles. La proposition d'implémentation fournit une solution complète pour tracer chaque donnée à travers tout le pipeline, de CV à Dashboard, avec toutes les métadonnées requises.

**Prochaine étape:** Implémenter Phase 1 (Infrastructure) du plan d'implémentation.

---

**Rapport généré par:** Cascade AI  
**Date:** 2026-08-05  
**Version:** 1.0
