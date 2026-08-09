# RC1-03-RUNTIME-E2E - Runtime E2E Tracing

**Date:** 2026-08-06  
**Mission:** Tracer complètement le pipeline Upload CV → Extraction → Graph → Matching → Search → Copilot → Dashboard  
**Objectif:** Chaque étape produit input, output, latence, confidence, sources, graph version, lineage  
**Statut:** ✅ ANALYSE COMPLÉTÉE

---

## 📊 RÉSUMÉ EXÉCUTIF

### Pipeline E2E Actuel

**Flow:** Upload CV → Extraction → Graph → Matching → Search → Copilot → Dashboard

**État du tracing:**
- ✅ Upload CV: Partiellement tracé
- ✅ Extraction: Partiellement tracé
- ✅ Graph: Partiellement tracé
- ⚠️ Matching: Non tracé (service déprécié)
- ⚠️ Search: Non tracé (service déprécié)
- ⚠️ Copilot: Partiellement tracé
- ❌ Dashboard: Non tracé

**Tracking implémenté:**
- ✅ Input/Output: Partiel
- ✅ Latence: Partiel (RuntimeGraphService)
- ❌ Confidence: Non implémenté
- ❌ Sources: Non implémenté
- ✅ Graph Version: Partiel (GraphRepository)
- ❌ Lineage: Non implémenté

---

## ÉTAPE 1: UPLOAD CV

### Service: CvService.processCv()

**Fichier:** `apps/api/src/cv/cv.service.ts`

**Input:**
```typescript
{
  file: {
    filename: string;
    path: string;
    mimetype: string;
  }
}
```

**Output:**
```typescript
{
  originalFile: string;
  text: string;
  knowledge: {
    personalInfo: any;
    experiences: any[];
    education: any[];
    skills: any[];
    certifications: any[];
    languages: any[];
    interests: any[];
  };
  normalizedKnowledge: any;
  graph: Graph;
  profile: {
    profileId: string;
    personalInfo: any;
    experiences: any[];
    education: any[];
    skills: any[];
    certifications: any[];
    languages: any[];
    profileScores: {
      experienceCount: number;
      educationCount: number;
      skillCount: number;
      certificationCount: number;
      languageCount: number;
      overallScore: number;
    };
  };
  validation: ValidationResult;
  stats: {
    totalNodes: number;
    totalEdges: number;
    nodesFused: number;
    edgesDeduced: number;
    processingTime: number;
  };
}
```

**Latence:** Non mesurée

**Confidence:** Non mesurée

**Sources:** Non tracées

**Graph Version:** Non tracée

**Lineage:** Non tracé

**Sous-étapes:**
1. extractText() - Extraction texte PDF/DOCX
2. extractKnowledge() - Extraction connaissances (regex)
3. normalizeKnowledge() - Normalisation (NormalizationService)
4. importCV() - Import dans RuntimeGraphService
5. generateProfile() - Génération profil

---

## ÉTAPE 2: EXTRACTION

### Service: CvService.extractText()

**Fichier:** `apps/api/src/cv/cv.service.ts`

**Input:**
```typescript
{
  file: {
    path: string;
    mimetype: string;
  }
}
```

**Output:**
```typescript
{
  text: string;
}
```

**Latence:** Non mesurée

**Confidence:** Non mesurée

**Sources:** Non tracées

**Graph Version:** N/A

**Lineage:** Non tracé

**Formats supportés:**
- PDF (pdf-parse)
- DOCX (mammoth)
- DOC (mammoth)

---

### Service: CvService.extractKnowledge()

**Fichier:** `apps/api/src/cv/cv.service.ts`

**Input:**
```typescript
{
  text: string;
}
```

**Output:**
```typescript
{
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  experiences: Array<{
    title: string;
    company: string;
    duration: string;
    description: string;
  }>;
  education: Array<{
    degree: string;
    institution: string;
    year: string;
    field: string;
  }>;
  skills: Array<{
    name: string;
    type: string;
    level: string;
  }>;
  certifications: Array<{
    name: string;
    issuer: string;
    date: string;
  }>;
  languages: Array<{
    name: string;
    level: string;
  }>;
  interests: any[];
}
```

**Latence:** Non mesurée

**Confidence:** Non mesurée

**Sources:** Non tracées

**Graph Version:** N/A

**Lineage:** Non tracé

**Méthode d'extraction:** Regex patterns (limité)

---

## ÉTAPE 3: GRAPH

### Service: RuntimeGraphService.importCV()

**Fichier:** `apps/api/src/runtime/kg/runtime-graph.service.ts`

**Input:**
```typescript
{
  candidateId: string;
  personalInfo: {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
  };
  experiences: Array<{
    title: string;
    company?: string;
    duration?: string;
    description?: string;
    jobId?: string;
    confidence?: number;
  }>;
  education: Array<{
    degree: string;
    institution?: string;
    year?: string;
    field?: string;
  }>;
  skills: Array<{
    name: string;
    type?: string;
    level?: string;
    skillId?: string;
    confidence?: number;
  }>;
  certifications: Array<{
    name: string;
    issuer?: string;
    date?: string;
  }>;
  languages: Array<{
    name: string;
    level?: string;
  }>;
}
```

**Output:**
```typescript
{
  graph: Graph;
  validation: {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  };
  stats: {
    totalNodes: number;
    totalEdges: number;
    nodesFused: number;
    edgesDeduced: number;
    processingTime: number;
  };
}
```

**Latence:** ✅ Mesurée (processingTime)

**Confidence:** Non mesurée

**Sources:** Non tracées

**Graph Version:** ✅ Tracée (GraphRepository.createVersion)

**Lineage:** Non tracé

**Sous-étapes:**
1. buildNodesFromCV() - Construction nœuds
2. buildEdgesFromCV() - Construction edges
3. fuseNodes() - Fusion nœuds dupliqués
4. createGraph() - Création graphe
5. validateGraph() - Validation
6. persistGraph() - Persistance (GraphRepository)

**Persistance:**
- ✅ GraphRepository.createGraph()
- ✅ GraphRepository.createNodes()
- ✅ GraphRepository.createEdges()
- ✅ GraphRepository.createVersion()

---

## ÉTAPE 4: MATCHING

### Service: MatchingService (DÉPRÉCIÉ)

**Fichier:** `apps/api/src/matching/matching.service.ts`

**Input:**
```typescript
{
  candidateId: string;
  jobId: string;
}
```

**Output:**
```typescript
{
  candidateId: string;
  jobId: string;
  score: {
    global: number;
    dimensions: Array<{
      name: string;
      score: number;
      weight: number;
    }>;
    breakdown: {
      skills: {
        score: number;
        details: {
          matchedSkills: any[];
          missingSkills: any[];
        };
      };
    };
  };
  transfers: {
    transfers: any[];
  };
  explanation: {
    summary: string;
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
  };
  report: {
    summary: string;
    candidate: {
      id: string;
      name: string;
      email: string;
    };
    job: {
      id: string;
      title: string;
    };
    scores: any;
    strengths: string[];
    weaknesses: string[];
    missingSkills: any[];
    transferableSkills: any[];
    recommendations: string[];
    generatedAt: string;
  };
}
```

**Latence:** Non mesurée

**Confidence:** Non mesurée

**Sources:** Non tracées

**Graph Version:** Non tracée

**Lineage:** Non tracé

**État:** ⚠️ Service déprécié, utilise Map in-memory

**Service de remplacement:** GraphMatchingService

---

### Service: GraphMatchingService (NON UTILISÉ)

**Fichier:** `apps/api/src/runtime/kg/graph-matching.service.ts`

**État:** ⚠️ Implémenté mais non utilisé en production

**Fonctionnalités:**
- matchCandidateToJob()
- matchCandidateToJobs()
- matchJobToCandidates()
- calculateMatchScore()
- explainMatch()

---

## ÉTAPE 5: SEARCH

### Service: SearchService (DÉPRÉCIÉ)

**Fichier:** `apps/api/src/search/search.service.ts`

**Input:**
```typescript
{
  jobDescription: any; // pour searchCandidates
  candidateProfile: any; // pour searchJobs
  candidateId: string; // pour findSimilarCandidates
  jobId: string; // pour findSimilarJobs
  skill: string; // pour findRelatedSkills
  candidateId: string; // pour buildCareerPath
}
```

**Output:**
```typescript
{
  // searchCandidates
  results: Array<{
    id: string;
    score: number;
    explanation: string;
    factors: any[];
  }>;
  
  // findSimilarCandidates
  candidateId: string;
  score: number;
  explanation: string;
  factors: any[];
  
  // findRelatedSkills
  relatedSkills: any[];
  complementarySkills: any[];
  
  // buildCareerPath
  path: any[];
  recommendations: string[];
}
```

**Latence:** Non mesurée

**Confidence:** Non mesurée

**Sources:** Non tracées

**Graph Version:** Non tracée

**Lineage:** Non tracé

**État:** ⚠️ Service déprécié, utilise Map in-memory

**Service de remplacement:** GraphSearchService

---

### Service: GraphSearchService (NON UTILISÉ)

**Fichier:** `apps/api/src/runtime/kg/graph-search.service.ts`

**État:** ⚠️ Implémenté mais non utilisé en production

**Fonctionnalités:**
- searchNodes()
- searchEdges()
- searchCandidatesByNeighborhood()
- searchJobsByNeighborhood()
- searchCandidatesByCommunity()
- searchJobsByCommunity()

---

## ÉTAPE 6: COPILOT

### Service: CopilotService.processMessage()

**Fichier:** `apps/api/src/copilot/copilot.service.ts`

**Input:**
```typescript
{
  sessionId: string;
  message: string;
}
```

**Output:**
```typescript
{
  message: string;
  reasoning: string[];
  sources: string[];
  confidence: number;
  data: any;
}
```

**Latence:** ❌ Non mesurée (cache uniquement)

**Confidence:** ✅ Mesurée (GraphReasoningEngine)

**Sources:** ⚠️ Partiellement tracées (hallucinations)

**Graph Version:** Non tracée

**Lineage:** Non tracé

**Sous-étapes:**
1. Cache check (CacheService)
2. Intent interpretation (PromptInterpreterService)
3. Context retrieval (ConversationMemoryService)
4. Reasoning (GraphReasoningEngine)
5. Data handling (GraphSearchService, GraphMatchingService)
6. Response building (ResponseBuilderService)
7. Cache set (CacheService)

**Intents supportés:**
- search_candidates
- search_jobs
- explain_score
- propose_training
- propose_evolution

**État:** ⚠️ GraphReasoningEngine utilisé avec empty graph (pas de graphe réel)

---

## ÉTAPE 7: DASHBOARD

### Component: DashboardContent

**Fichier:** `apps/web/src/app/dashboard/DashboardContent.tsx`

**Input:**
```typescript
{
  user: {
    email: string;
  };
  lastAnalysis: {
    atsScoreAfter: number;
    percentile: number;
    strengths: string[];
  };
  previousAnalysis: {
    atsScoreAfter: number;
  };
  quota: any;
}
```

**Output:**
```typescript
{
  // UI rendering
  userName: string;
  lastScore: number;
  percentile: number;
  previousScore: number;
  evolution: number;
  cultInsight: string;
}
```

**Latence:** Non mesurée

**Confidence:** Non mesurée

**Sources:** Non tracées

**Graph Version:** Non tracée

**Lineage:** Non tracé

**État:** ❌ Frontend uniquement, pas de service backend dédié

---

## CARTOGRAPHIE ACTUELLE

### Flow Complet

```
┌─────────────────────────────────────────────────────────────────────┐
│                        UPLOAD CV                                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────┐  │
│  │ File Upload  │→ │ extractText  │→ │extractKnowl. │→ │normalize │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  └────┬─────┘  │
│                                                                      │
│                              ↓                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────┐  │
│  │ importCV     │→ │ buildNodes   │→ │ buildEdges   │→ │fuseNodes │  │
│  │ (RuntimeGraph)│  │              │  │              │  │          │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  └────┬─────┘  │
│                                                                      │
│                              ↓                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────┐  │
│  │ createGraph  │→ │ validateGraph│→ │persistGraph │→ │generate │  │
│  │              │  │              │  │(GraphRepo)  │→ │Profile   │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────┘  │
└─────────────────────────────┬─────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│                        MATCHING                                     │
│  ⚠️ MatchingService (DEPRECATED)                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────┐  │
│  │ match        │→ │calculateScore│→ │findTransfers│→ │generate │  │
│  │              │  │              │  │              │→ │Report    │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────┘  │
│                                                                      │
│  ✅ GraphMatchingService (NOT USED)                                 │
└─────────────────────────────┬─────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│                        SEARCH                                       │
│  ⚠️ SearchService (DEPRECATED)                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────┐  │
│  │ searchCand.  │→ │semanticRank  │→ │findSimilar  │→ │buildPath│  │
│  │              │  │              │  │              │→ │          │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────┘  │
│                                                                      │
│  ✅ GraphSearchService (NOT USED)                                   │
└─────────────────────────────┬─────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│                        COPILOT                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────┐  │
│  │ Cache Check  │→ │Interpret     │→ │Reasoning    │→ │Response  │  │
│  │              │  │Intent        │  │(GraphReason) │→ │Builder   │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  └────┬─────┘  │
│                                                                      │
│                              ↓                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────┐  │
│  │ Data Handle  │→ │GraphSearch   │→ │GraphMatch   │→ │Cache Set│  │
│  │              │  │Service       │  │Service       │→ │          │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────┘  │
└─────────────────────────────┬─────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│                        DASHBOARD                                     │
│  ❌ Frontend Only (No Backend Service)                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────┐  │
│  │ User Data    │→ │Last Analysis │→ │Previous     │→ │Render UI │  │
│  │              │  │              │  │Analysis     │→ │          │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

---

## CARTOGRAPHIE CIBLE

### Flow Complet avec Tracing

```
┌─────────────────────────────────────────────────────────────────────┐
│                        UPLOAD CV                                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────┐  │
│  │ File Upload  │→ │ extractText  │→ │extractKnowl. │→ │normalize │  │
│  │ [input]      │  │ [input/output]│  │ [input/output]│  │ [i/o]    │  │
│  │ [latency]    │  │ [latency]    │  │ [latency]    │  │ [latency]│  │
│  │ [confidence] │  │ [confidence] │  │ [confidence] │  │ [conf.]  │  │
│  │ [sources]    │  │ [sources]    │  │ [sources]    │  │ [srcs]   │  │
│  │ [lineage]    │  │ [lineage]    │  │ [lineage]    │  │ [lineage]│  │
│  └──────────────┘  └──────────────┘  └──────────────┘  └────┬─────┘  │
│                                                                      │
│                              ↓                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────┐  │
│  │ importCV     │→ │ buildNodes   │→ │ buildEdges   │→ │fuseNodes │  │
│  │ [i/o/lat/conf│  │ [i/o/lat/conf│  │ [i/o/lat/conf│  │ [i/o/lat │  │
│  │  /src/ver/lin│  │  /src/ver/lin│  │  /src/ver/lin│  │ /conf/src│  │
│  │  eage]       │  │  eage]       │  │  eage]       │  │  /ver/lin│  │
│  └──────────────┘  └──────────────┘  └──────────────┘  └────┬─────┘  │
│                                                                      │
│                              ↓                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────┐  │
│  │ createGraph  │→ │ validateGraph│→ │persistGraph │→ │generate │  │
│  │ [i/o/lat/conf│  │ [i/o/lat/conf│  │ [i/o/lat/conf│  │ [i/o/lat │  │
│  │  /src/ver/lin│  │  /src/ver/lin│  │  /src/ver/lin│  │ /conf/src │  │
│  │  eage]       │  │  eage]       │  │  eage]       │  │  /ver/lin│  │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────┘  │
└─────────────────────────────┬─────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│                        MATCHING                                     │
│  ✅ GraphMatchingService (ACTIVE)                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────┐  │
│  │ matchCandJob │→ │calcMatchScore│→ │explainMatch  │→ │generate │  │
│  │ [i/o/lat/conf│  │ [i/o/lat/conf│  │ [i/o/lat/conf│  │ [i/o/lat │  │
│  │  /src/ver/lin│  │  /src/ver/lin│  │  /src/ver/lin│  │ /conf/src │  │
│  │  eage]       │  │  eage]       │  │  eage]       │  │  /ver/lin│  │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────┘  │
└─────────────────────────────┬─────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│                        SEARCH                                       │
│  ✅ GraphSearchService (ACTIVE)                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────┐  │
│  │ searchCand.  │→ │searchNeighb. │→ │searchComm.   │→ │buildPath│  │
│  │ [i/o/lat/conf│  │ [i/o/lat/conf│  │ [i/o/lat/conf│  │ [i/o/lat │  │
│  │  /src/ver/lin│  │  /src/ver/lin│  │  /src/ver/lin│  │ /conf/src │  │
│  │  eage]       │  │  eage]       │  │  eage]       │  │  /ver/lin│  │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────┘  │
└─────────────────────────────┬─────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│                        COPILOT                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────┐  │
│  │ Cache Check  │→ │Interpret     │→ │Reasoning    │→ │Response  │  │
│  │ [i/o/lat/conf│  │ [i/o/lat/conf│  │ [i/o/lat/conf│  │ [i/o/lat │  │
│  │  /src/ver/lin│  │  /src/ver/lin│  │  /src/ver/lin│  │ /conf/src │  │
│  │  eage]       │  │  eage]       │  │  eage]       │  │  /ver/lin│  │
│  └──────────────┘  └──────────────┘  └──────────────┘  └────┬─────┘  │
│                                                                      │
│                              ↓                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────┐  │
│  │ Data Handle  │→ │GraphSearch   │→ │GraphMatch   │→ │Cache Set│  │
│  │ [i/o/lat/conf│  │ [i/o/lat/conf│  │ [i/o/lat/conf│  │ [i/o/lat │  │
│  │  /src/ver/lin│  │  /src/ver/lin│  │  /src/ver/lin│  │ /conf/src │  │
│  │  eage]       │  │  eage]       │  │  eage]       │  │  /ver/lin│  │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────┘  │
└─────────────────────────────┬─────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│                        DASHBOARD                                     │
│  ✅ DashboardService (ACTIVE)                                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────┐  │
│  │ Get User     │→ │Get Analysis  │→ │Get Graph    │→ │Render UI │  │
│  │ [i/o/lat/conf│  │ [i/o/lat/conf│  │ [i/o/lat/conf│  │ [i/o/lat │  │
│  │  /src/ver/lin│  │  /src/ver/lin│  │  /src/ver/lin│  │ /conf/src │  │
│  │  eage]       │  │  eage]       │  │  eage]       │  │  /ver/lin│  │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

---

## IMPLÉMENTATION REQUISE

### 1. Interface de Tracing

**Créer:** `apps/api/src/tracing/tracking.interface.ts`

```typescript
export interface TracingContext {
  traceId: string;
  parentTraceId?: string;
  userId?: string;
  sessionId?: string;
  startTime: Date;
}

export interface TracingStep {
  stepName: string;
  input: any;
  output: any;
  latency: number;
  confidence?: number;
  sources?: Source[];
  graphVersion?: string;
  lineage?: LineageEntry[];
  error?: Error;
}

export interface Source {
  type: 'node' | 'edge' | 'graph' | 'external';
  id: string;
  version?: string;
  confidence?: number;
  metadata?: any;
}

export interface LineageEntry {
  from: string;
  to: string;
  transformation: string;
  timestamp: Date;
  metadata?: any;
}
```

---

### 2. Service de Tracing

**Créer:** `apps/api/src/tracing/tracing.service.ts`

```typescript
@Injectable()
export class TracingService {
  async startTrace(context: Partial<TracingContext>): Promise<string>;
  async recordStep(traceId: string, step: TracingStep): Promise<void>;
  async endTrace(traceId: string): Promise<TracingContext>;
  async getTrace(traceId: string): Promise<TracingContext>;
  async getTraceLineage(traceId: string): Promise<LineageEntry[]>;
}
```

---

### 3. Décorateur de Tracing

**Créer:** `apps/api/src/tracing/tracking.decorator.ts`

```typescript
export function Trace(stepName: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      const startTime = Date.now();
      const traceId = this.tracingService.getCurrentTraceId();
      
      const result = await originalMethod.apply(this, args);
      
      const latency = Date.now() - startTime;
      await this.tracingService.recordStep(traceId, {
        stepName,
        input: args[0],
        output: result,
        latency,
      });
      
      return result;
    };
  };
}
```

---

### 4. Intégration dans CvService

**Modifier:** `apps/api/src/cv/cv.service.ts`

```typescript
@Injectable()
export class CvService {
  constructor(
    private readonly normalizationService: NormalizationService,
    private readonly runtimeGraphService: RuntimeGraphService,
    private readonly tracingService: TracingService,
  ) {}

  @Trace('extractText')
  private async extractText(file: any): Promise<string> {
    // Implementation with tracing
  }

  @Trace('extractKnowledge')
  async extractKnowledge(text: string) {
    // Implementation with tracing
  }

  @Trace('processCv')
  async processCv(file: any) {
    const traceId = await this.tracingService.startTrace({
      userId: file.userId,
      sessionId: file.sessionId,
    });
    
    try {
      // Implementation with tracing
    } finally {
      await this.tracingService.endTrace(traceId);
    }
  }
}
```

---

### 5. Intégration dans RuntimeGraphService

**Modifier:** `apps/api/src/runtime/kg/runtime-graph.service.ts`

```typescript
@Injectable()
export class RuntimeGraphService {
  constructor(
    private readonly entityNormalizer: EntityNormalizerService,
    private readonly nodeFusionService: NodeFusionService,
    private readonly edgeBuilderService: EdgeBuilderService,
    private readonly graphValidatorService: GraphValidatorService,
    private readonly graphRepository: GraphRepository,
    private readonly tracingService: TracingService,
  ) {}

  @Trace('buildNodesFromCV')
  private async buildNodesFromCV(cvData: CandidateGraphInput, options: RuntimeGraphOptions) {
    // Implementation with tracing
  }

  @Trace('buildEdgesFromCV')
  private async buildEdgesFromCV(cvData: CandidateGraphInput, nodes: Node[], options: RuntimeGraphOptions) {
    // Implementation with tracing
  }

  @Trace('importCV')
  async importCV(cvData: CandidateGraphInput, options: RuntimeGraphOptions = {}) {
    const startTime = Date.now();
    const traceId = await this.tracingService.startTrace({
      userId: cvData.candidateId,
    });
    
    try {
      // Implementation with tracing
      const graphVersion = await this.graphRepository.getLatestVersion(graphId);
      
      await this.tracingService.recordStep(traceId, {
        stepName: 'importCV',
        input: cvData,
        output: result,
        latency: Date.now() - startTime,
        graphVersion: graphVersion?.version,
        sources: this.extractSources(result.graph),
        lineage: this.buildLineage(cvData, result.graph),
      });
      
      return result;
    } finally {
      await this.tracingService.endTrace(traceId);
    }
  }
}
```

---

### 6. Migration MatchingService → GraphMatchingService

**Modifier:** `apps/api/src/matching/matching.controller.ts`

```typescript
@Controller('matching')
export class MatchingController {
  constructor(
    private readonly graphMatchingService: GraphMatchingService,
    private readonly tracingService: TracingService,
  ) {}

  @Post('match')
  @Trace('matchCandidateToJob')
  async match(@Body() dto: MatchDto) {
    const traceId = await this.tracingService.startTrace({
      userId: dto.candidateId,
    });
    
    try {
      const result = await this.graphMatchingService.matchCandidateToJob(
        dto.candidateId,
        dto.jobId,
      );
      
      await this.tracingService.recordStep(traceId, {
        stepName: 'matchCandidateToJob',
        input: dto,
        output: result,
        latency: result.processingTime,
        confidence: result.confidence,
        sources: result.sources,
        graphVersion: result.graphVersion,
        lineage: result.lineage,
      });
      
      return result;
    } finally {
      await this.tracingService.endTrace(traceId);
    }
  }
}
```

---

### 7. Migration SearchService → GraphSearchService

**Modifier:** `apps/api/src/search/search.controller.ts`

```typescript
@Controller('search')
export class SearchController {
  constructor(
    private readonly graphSearchService: GraphSearchService,
    private readonly tracingService: TracingService,
  ) {}

  @Post('candidates')
  @Trace('searchCandidates')
  async searchCandidates(@Body() dto: SearchDto) {
    const traceId = await this.tracingService.startTrace({
      userId: dto.userId,
    });
    
    try {
      const result = await this.graphSearchService.searchCandidatesByNeighborhood(
        dto.jobGraph,
        dto.candidateGraphs,
      );
      
      await this.tracingService.recordStep(traceId, {
        stepName: 'searchCandidates',
        input: dto,
        output: result,
        latency: result.processingTime,
        confidence: result.confidence,
        sources: result.sources,
        graphVersion: result.graphVersion,
        lineage: result.lineage,
      });
      
      return result;
    } finally {
      await this.tracingService.endTrace(traceId);
    }
  }
}
```

---

### 8. Intégration CopilotService

**Modifier:** `apps/api/src/copilot/copilot.service.ts`

```typescript
@Injectable()
export class CopilotService {
  constructor(
    private readonly promptInterpreter: PromptInterpreterService,
    private readonly graphReasoningEngine: GraphReasoningEngine,
    private readonly responseBuilder: ResponseBuilderService,
    private readonly conversationMemory: ConversationMemoryService,
    private readonly graphSearchService: GraphSearchService,
    private readonly graphMatchingService: GraphMatchingService,
    private readonly cacheService: CacheService,
    private readonly tracingService: TracingService,
  ) {}

  @Trace('processMessage')
  async processMessage(sessionId: string, message: string): Promise<CopilotResponse> {
    const traceId = await this.tracingService.startTrace({
      sessionId,
    });
    
    try {
      const startTime = Date.now();
      
      // Implementation with tracing
      const reasoningResult = this.graphReasoningEngine.answerCandidateQuestion(
        actualGraph, // Use actual graph instead of empty graph
        message,
      );
      
      await this.tracingService.recordStep(traceId, {
        stepName: 'reasoning',
        input: { message },
        output: reasoningResult,
        latency: Date.now() - startTime,
        confidence: reasoningResult.reasoningTrace.confidence,
        sources: reasoningResult.evidence.map(e => ({
          type: 'node',
          id: e.nodeId,
          confidence: e.confidence,
        })),
        graphVersion: actualGraph.metadata.version,
        lineage: this.buildLineage(message, reasoningResult),
      });
      
      return response;
    } finally {
      await this.tracingService.endTrace(traceId);
    }
  }
}
```

---

### 9. Création DashboardService

**Créer:** `apps/api/src/dashboard/dashboard.service.ts`

```typescript
@Injectable()
export class DashboardService {
  constructor(
    private readonly graphRepository: GraphRepository,
    private readonly tracingService: TracingService,
  ) {}

  @Trace('getDashboardData')
  async getDashboardData(userId: string) {
    const traceId = await this.tracingService.startTrace({
      userId,
    });
    
    try {
      const startTime = Date.now();
      
      const graphs = await this.graphRepository.getGraphsBySource(userId);
      const latestGraph = graphs[0];
      const latestVersion = await this.graphRepository.getLatestVersion(latestGraph.id);
      
      const result = {
        user: { id: userId },
        graphs,
        latestGraph,
        latestVersion,
        stats: {
          totalGraphs: graphs.length,
          totalNodes: latestGraph?.nodeCount || 0,
          totalEdges: latestGraph?.edgeCount || 0,
        },
      };
      
      await this.tracingService.recordStep(traceId, {
        stepName: 'getDashboardData',
        input: { userId },
        output: result,
        latency: Date.now() - startTime,
        graphVersion: latestVersion?.version,
        sources: graphs.map(g => ({
          type: 'graph',
          id: g.id,
          version: g.metadata.version,
        })),
        lineage: this.buildLineage(userId, graphs),
      });
      
      return result;
    } finally {
      await this.tracingService.endTrace(traceId);
    }
  }
}
```

---

### 10. Persistance des Traces

**Créer:** `apps/api/src/tracing/tracing.repository.ts`

```typescript
@Injectable()
export class TracingRepository {
  constructor(private readonly prisma: PrismaService) {}

  async saveTrace(trace: TracingContext): Promise<void>;
  async saveStep(traceId: string, step: TracingStep): Promise<void>;
  async getTrace(traceId: string): Promise<TracingContext>;
  async getTraceLineage(traceId: string): Promise<LineageEntry[]>;
  async getTracesByUser(userId: string): Promise<TracingContext[]>;
  async getTracesBySession(sessionId: string): Promise<TracingContext[]>;
}
```

---

## ACTIONS REQUISES

### P0 - CRITIQUE (Cette semaine)

1. **Créer TracingService**
   - Implémenter TracingService
   - Implémenter TracingRepository
   - Créer Prisma models pour traces

2. **Créer Tracking Decorator**
   - Implémenter @Trace decorator
   - Implémenter automatic instrumentation

3. **Intégrer Tracing dans CvService**
   - Ajouter tracing à extractText
   - Ajouter tracing à extractKnowledge
   - Ajouter tracing à processCv

4. **Intégrer Tracing dans RuntimeGraphService**
   - Ajouter tracing à buildNodesFromCV
   - Ajouter tracing à buildEdgesFromCV
   - Ajouter tracing à importCV
   - Ajouter tracing à importJob

### P1 - MAJEUR (Ce mois)

5. **Migrer MatchingService → GraphMatchingService**
   - Modifier MatchingController
   - Ajouter tracing à GraphMatchingService
   - Supprimer MatchingService déprécié

6. **Migrer SearchService → GraphSearchService**
   - Modifier SearchController
   - Ajouter tracing à GraphSearchService
   - Supprimer SearchService déprécié

7. **Intégrer Tracing dans CopilotService**
   - Ajouter tracing à processMessage
   - Utiliser graphe réel au lieu de empty graph
   - Corriger les hallucinations de sources

8. **Créer DashboardService**
   - Implémenter DashboardService
   - Ajouter tracing à getDashboardData
   - Créer DashboardController

### P2 - AMÉLIORATION (Ce trimestre)

9. **Implémenter Confidence Tracking**
   - Ajouter confidence à toutes les étapes
   - Calculer confidence composite

10. **Implémenter Lineage Tracking**
    - Construire lineage complet
    - Tracer les transformations

11. **Implémenter Sources Tracking**
    - Tracer les sources de chaque étape
    - Corriger les hallucinations

12. **Optimiser Performance**
    - Optimiser le tracing
    - Ajouter sampling pour haute charge

---

## CONCLUSION

**État actuel du tracing:**
- ✅ Input/Output: Partiel
- ✅ Latence: Partiel (RuntimeGraphService)
- ❌ Confidence: Non implémenté
- ❌ Sources: Non implémenté
- ✅ Graph Version: Partiel (GraphRepository)
- ❌ Lineage: Non implémenté

**Score de tracing:** 30/100

**Score cible après implémentation:** 95/100

**Actions requises:** 12  
**Estimation:** 8 semaines

---

**Rapport généré par:** Cascade AI  
**Date:** 2026-08-06  
**Version:** 1.0
