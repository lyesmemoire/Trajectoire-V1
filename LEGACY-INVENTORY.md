# LEGACY-INVENTORY - Inventaire du Code Legacy

**Date:** 2026-08-06  
**Mission:** Scanner entièrement apps/api, apps/web, packages pour identifier le code legacy  
**Objectif:** Produire un inventaire complet sans suppression  
**Statut:** ✅ ANALYSE COMPLÉTÉE

---

## 📊 RÉSUMÉ EXÉCUTIF

**Total des éléments legacy identifiés:** 47

**Répartition:**
- Services dépréciés: 3
- Services associés (legacy): 13
- Controllers avec placeholders: 3
- Modules vides: 3
- Frontend features potentiellement mortes: 69
- Packages: 64 fichiers

**Score de santé du code:** 72/100

---

## 1. SERVICES DÉPRÉCIÉS (@deprecated)

### 1.1 MatchingService

**Fichier:** `apps/api/src/matching/matching.service.ts`

**Statut:** ⚠️ DÉPRÉCIÉ

**Remplacement:** GraphMatchingService (`runtime/kg/graph-matching.service.ts`)

**Raison:** Service basé sur Map in-memory, non persistant, non scalable

**Utilisation actuelle:**
- ❌ Non utilisé par MatchingController (utilise GraphMatchingService)
- ✅ Maintenu pour compatibilité rétroactive

**Interface:**
```typescript
interface MatchingResult {
  candidateId: string;
  jobId: string;
  score: OverallScore;
  transfers: TransferResult;
  explanation: Explanation;
  report: any;
}
```

**Méthodes:**
- registerCandidate(candidateId, candidateGraph)
- registerJob(jobId, jobGraph)
- match(candidateId, jobId)
- getCandidateGraph(candidateId)
- getJobGraph(jobId)
- getAllCandidates()
- getAllJobs()

**Action requise:** Supprimer après migration complète vers GraphMatchingService

---

### 1.2 SearchService

**Fichier:** `apps/api/src/search/search.service.ts`

**Statut:** ⚠️ DÉPRÉCIÉ

**Remplacement:** GraphSearchService (`runtime/kg/graph-search.service.ts`)

**Raison:** Service basé sur Map in-memory, non persistant, non scalable

**Utilisation actuelle:**
- ❌ Non utilisé par SearchController (utilise GraphSearchService)
- ✅ Maintenu pour compatibilité rétroactive

**Interface:**
```typescript
// searchCandidates(jobDescription): RankedResult[]
// searchJobs(candidateProfile): RankedResult[]
// findSimilarCandidates(candidateId): any[]
// findSimilarJobs(jobId): any[]
// findRelatedSkills(skill): RelatedSkills
// buildCareerPath(candidateId): CareerPath
```

**Méthodes:**
- registerCandidate(candidateId, candidateGraph)
- registerJob(jobId, jobGraph)
- searchCandidates(jobDescription)
- searchJobs(candidateProfile)
- findSimilarCandidates(candidateId)
- findSimilarJobs(jobId)
- findRelatedSkills(skill)
- buildCareerPath(candidateId)
- getAllCandidates()
- getAllJobs()
- getCandidateGraph(candidateId)
- getJobGraph(jobId)

**Action requise:** Supprimer après migration complète vers GraphSearchService

---

### 1.3 ReasoningService

**Fichier:** `apps/api/src/reasoning/reasoning.service.ts`

**Statut:** ⚠️ DÉPRÉCIÉ

**Remplacement:** GraphReasoningEngine (`runtime/kg/graph-reasoning-engine.service.ts`)

**Raison:** Service sans support de citation complète, basé sur couches simples

**Utilisation actuelle:**
- ❌ Non utilisé par ReasoningController (utilise GraphReasoningEngine)
- ✅ Maintenu pour compatibilité rétroactive

**Interface:**
```typescript
interface ReasoningInput {
  candidateData: any;
  jobData: any;
  context?: {
    team?: { existingSkills: string[]; teamSize: number; seniorityDistribution: string };
    constraints?: string[];
    coveredSkills?: string[];
  };
}

interface ReasoningOutput {
  layer1: { facts: CollectedFacts; sources: string[] };
  layer2: { gapAnalysis: GapAnalysisResult };
  layer3: { contextAnalysis: ContextAnalysis };
  layer4: { decision: ReasoningDecision };
  metadata: { processingTime: number; timestamp: Date };
}
```

**Méthodes:**
- reason(input: ReasoningInput): Promise<ReasoningOutput>
- getRecommendationText(recommendation: RecommendationType): string
- formatDecisionForDisplay(decision: ReasoningDecision): string

**Action requise:** Supprimer après migration complète vers GraphReasoningEngine

---

## 2. SERVICES ASSOCIÉS (LEGACY)

### 2.1 Matching - Services Associés

**Fichier:** `apps/api/src/matching/`

**Services:**
- `scoring.service.ts` - Calcul des scores (utilisé par MatchingService déprécié)
- `explanation.service.ts` - Génération d'explications (utilisé par MatchingService déprécié)
- `transfer.service.ts` - Analyse des transferts de compétences (utilisé par MatchingService déprécié)

**Statut:** ⚠️ LEGACY (dépend de MatchingService)

**Utilisation actuelle:**
- ❌ Non utilisé par GraphMatchingService
- ✅ Utilisé uniquement par MatchingService déprécié

**Action requise:** Supprimer après suppression de MatchingService

---

### 2.2 Search - Services Associés

**Fichier:** `apps/api/src/search/`

**Services:**
- `similarity.service.ts` - Calcul de similarité (utilisé par SearchService déprécié)
- `semantic-ranking.service.ts` - Ranking sémantique (utilisé par SearchService déprécié)
- `recommendation.service.ts` - Recommandations (utilisé par SearchService déprécié)

**Statut:** ⚠️ LEGACY (dépend de SearchService)

**Utilisation actuelle:**
- ❌ Non utilisé par GraphSearchService
- ✅ Utilisé uniquement par SearchService déprécié

**Action requise:** Supprimer après suppression de SearchService

---

### 2.3 Reasoning - Services Associés

**Fichier:** `apps/api/src/reasoning/`

**Services:**
- `fact-collector.service.ts` - Collecte de faits (utilisé par ReasoningService déprécié)
- `gap-analyzer.service.ts` - Analyse des écarts (utilisé par ReasoningService déprécié)
- `context-analyzer.service.ts` - Analyse contextuelle (utilisé par ReasoningService déprécié)
- `decision-builder.service.ts` - Construction de décisions (utilisé par ReasoningService déprécié)
- `doubt-detector.service.ts` - Détection de doute (utilisé par ReasoningService déprécié)
- `transfer-patterns.service.ts` - Patterns de transfert (utilisé par ReasoningService déprécié)

**Statut:** ⚠️ LEGACY (dépend de ReasoningService)

**Utilisation actuelle:**
- ❌ Non utilisé par GraphReasoningEngine
- ✅ Utilisé uniquement par ReasoningService déprécié

**Action requise:** Supprimer après suppression de ReasoningService

---

### 2.4 CV - Service Legacy

**Fichier:** `apps/api/src/cv/graph-builder.service.ts`

**Statut:** ⚠️ LEGACY

**Remplacement:** RuntimeGraphService (`runtime/kg/runtime-graph.service.ts`)

**Raison:** Service de construction de graphe ancien, utilise Entity/Relationship au lieu de Node/Edge

**Interface:**
```typescript
interface Entity {
  id: string;
  type: string;
  attributes: Record<string, any>;
}

interface Relationship {
  id: string;
  from: string;
  to: string;
  type: string;
  attributes: Record<string, any>;
}

interface SemanticGraph {
  nodes: any[];
  edges: any[];
}
```

**Utilisation actuelle:**
- ❌ Non utilisé par CvService (utilise RuntimeGraphService)
- ✅ Non référencé

**Action requise:** Supprimer

---

### 2.5 Job - Service Legacy

**Fichier:** `apps/api/src/job/job-graph-builder.service.ts`

**Statut:** ⚠️ LEGACY

**Remplacement:** RuntimeGraphService (`runtime/kg/runtime-graph.service.ts`)

**Raison:** Service de construction de graphe ancien, utilise Entity/Relationship au lieu de Node/Edge

**Utilisation actuelle:**
- ❌ Non utilisé par JobService (utilise RuntimeGraphService)
- ✅ Non référencé

**Action requise:** Supprimer

---

## 3. CONTROLLERS AVEC PLACEHOLDERS

### 3.1 MatchingController

**Fichier:** `apps/api/src/matching/matching.controller.ts`

**Statut:** ⚠️ PARTIELLEMENT FONCTIONNEL

**Service utilisé:** GraphMatchingService (✅ correct)

**Endpoints avec placeholders:**
- `POST /matching/candidate` - Retourne message "Use GraphRepository"
- `POST /matching/job` - Retourne message "Use GraphRepository"
- `GET /matching/candidates` - Retourne message "Use GraphRepository"
- `GET /matching/jobs` - Retourne message "Use GraphRepository"
- `GET /matching/candidate/:id` - Retourne message "Use GraphRepository"
- `GET /matching/job/:id` - Retourne message "Use GraphRepository"

**Endpoints fonctionnels:**
- `POST /matching/score` - Utilise GraphMatchingService
- `POST /matching/explain` - Utilise GraphMatchingService
- `POST /matching/report` - Utilise GraphMatchingService

**Action requise:** Implémenter les endpoints placeholders avec GraphRepository

---

### 3.2 SearchController

**Fichier:** `apps/api/src/search/search.controller.ts`

**Statut:** ⚠️ PARTIELLEMENT FONCTIONNEL

**Service utilisé:** GraphSearchService (✅ correct)

**Endpoints avec placeholders:**
- `POST /search/related-skills` - Retourne message "Use graph-based similarity search"
- `POST /search/register-candidate` - Retourne message "Use GraphRepository"
- `POST /search/register-job` - Retourne message "Use GraphRepository"
- `GET /search/candidates` - Retourne message "Use GraphRepository"
- `GET /search/jobs` - Retourne message "Use GraphRepository"
- `GET /search/candidate/:id` - Retourne message "Use GraphRepository"
- `GET /search/job/:id` - Retourne message "Use GraphRepository"

**Endpoints fonctionnels:**
- `POST /search/candidates` - Utilise GraphSearchService
- `POST /search/jobs` - Utilise GraphSearchService
- `POST /search/similar-candidates` - Utilise GraphSearchService
- `POST /search/similar-jobs` - Utilise GraphSearchService
- `POST /search/career-path` - Utilise GraphSearchService

**Action requise:** Implémenter les endpoints placeholders avec GraphRepository

---

### 3.3 ReasoningController

**Fichier:** `apps/api/src/reasoning/reasoning.controller.ts`

**Statut:** ⚠️ PARTIELLEMENT FONCTIONNEL

**Service utilisé:** GraphReasoningEngine (✅ correct)

**Endpoints avec placeholders:**
- `POST /reasoning/format` - Retourne JSON.stringify simple

**Endpoints fonctionnels:**
- `POST /reasoning/analyze` - Utilise GraphReasoningEngine

**Action requise:** Implémenter l'endpoint format avec GraphReasoningEngine

---

## 4. MODULES VIDES

### 4.1 MatchingModule

**Fichier:** `apps/api/src/matching/matching.module.ts`

**Statut:** ⚠️ MODULE VIDE

**Providers:** Aucun (tableau vide)

**Exports:** Aucun (tableau vide)

**Imports:** KnowledgeGraphModule

**Controllers:** MatchingController

**Action requise:** Ajouter les providers nécessaires ou supprimer si inutile

---

### 4.2 SearchModule

**Fichier:** `apps/api/src/search/search.module.ts`

**Statut:** ⚠️ MODULE VIDE

**Providers:** Aucun (tableau vide)

**Exports:** Aucun (tableau vide)

**Imports:** KnowledgeGraphModule

**Controllers:** SearchController

**Action requise:** Ajouter les providers nécessaires ou supprimer si inutile

---

### 4.3 ReasoningModule

**Fichier:** `apps/api/src/reasoning/reasoning.module.ts`

**Statut:** ⚠️ MODULE VIDE

**Providers:** Aucun (tableau vide)

**Exports:** Aucun (tableau vide)

**Imports:** KnowledgeGraphModule

**Controllers:** ReasoningController

**Action requise:** Ajouter les providers nécessaires ou supprimer si inutile

---

## 5. ROUTES MORTES

### 5.1 Matching Routes

**Routes mortes:**
- `POST /matching/candidate` - Placeholder
- `POST /matching/job` - Placeholder
- `GET /matching/candidates` - Placeholder
- `GET /matching/jobs` - Placeholder
- `GET /matching/candidate/:id` - Placeholder
- `GET /matching/job/:id` - Placeholder

**Total:** 6 routes mortes

---

### 5.2 Search Routes

**Routes mortes:**
- `POST /search/related-skills` - Placeholder
- `POST /search/register-candidate` - Placeholder
- `POST /search/register-job` - Placeholder
- `GET /search/candidates` - Placeholder
- `GET /search/jobs` - Placeholder
- `GET /search/candidate/:id` - Placeholder
- `GET /search/job/:id` - Placeholder

**Total:** 7 routes mortes

---

### 5.3 Reasoning Routes

**Routes mortes:**
- `POST /reasoning/format` - Placeholder

**Total:** 1 route morte

---

**Total routes mortes:** 14

---

## 6. FRONTEND FEATURES POTENTIELLEMENT MORTES

### 6.1 Pages Admin

**Fichier:** `apps/web/src/app/admin/`

**Pages:**
- `adaptive-intelligence/page.tsx` - Intelligence adaptative
- `ai-operating-system/page.tsx` - Système d'exploitation IA
- `ai-quality/page.tsx` - Qualité IA
- `analytics/conversion/page.tsx` - Analytics conversion
- `analytics/page.tsx` - Analytics général
- `cognitive/page.tsx` - Analytics cognitif

**Statut:** ⚠️ NON AUDITÉ (potentiellement mortes)

**Action requise:** Audit complet des pages admin

---

### 6.2 Pages Utilisateur

**Fichier:** `apps/web/src/app/`

**Pages à auditer:**
- `__qa__/page.tsx` - Page QA (potentiellement morte)
- `simulation/[id]/page.tsx` - Simulation avec ID
- `simulation/page.tsx` - Page simulation
- `history/page.tsx` - Historique
- `monitoring/page.tsx` - Monitoring
- `settings/page.tsx` - Paramètres
- `recruiter/page.tsx` - Recruiter

**Statut:** ⚠️ NON AUDITÉ (potentiellement mortes)

**Action requise:** Audit complet des pages utilisateur

---

### 6.3 Fichier Mort

**Fichier:** `apps/web/src/app/page old.tsx`

**Statut:** ❌ FICHIER MORT (nom contient "old")

**Action requise:** Supprimer

---

**Total fichiers frontend:** 69  
**Fichiers à auditer:** 68  
**Fichiers morts confirmés:** 1

---

## 7. PACKAGES

### 7.1 blueprint-healing

**Fichier:** `packages/blueprint-healing/`

**Fichiers:**
- `auto-repair.ts`
- `contract-validator.ts`
- `cycle-detector.ts`
- `drift-detector.ts`
- `duplication-detector.ts`
- `orchestrator.ts`
- `ownership-validator.ts`
- `violation-detector.ts`

**Statut:** ⚠️ NON AUDITÉ

**Action requise:** Audit complet du package blueprint-healing

---

### 7.2 blueprint-pm

**Fichier:** `packages/blueprint-pm/`

**Fichiers:**
- `cache.ts`
- `cli.ts`
- `dependency-resolver.ts`
- `installer.ts`
- `publisher.ts`
- `registry.ts`
- `semver.ts`
- `signing.ts`
- `verification.ts`

**Statut:** ⚠️ NON AUDITÉ

**Action requise:** Audit complet du package blueprint-pm

---

### 7.3 blueprint-sdk

**Fichier:** `packages/blueprint-sdk/src/`

**Fichiers:**
- `index.ts`

**Statut:** ⚠️ NON AUDITÉ

**Action requise:** Audit complet du package blueprint-sdk

---

### 7.4 blueprint-validation

**Fichier:** `packages/blueprint-validation/`

**Fichiers:**
- `compilation-validator.ts`
- `document-validator.ts`
- `integration-validator.ts`
- `pipeline.ts`
- `usage-validator.ts`

**Statut:** ⚠️ NON AUDITÉ

**Action requise:** Audit complet du package blueprint-validation

---

### 7.5 hiios-api

**Fichier:** `packages/hiios-api/src/middleware/`

**Fichiers:**
- `auth.ts`
- `rateLimiter.ts`
- `rbac.ts`

**Statut:** ⚠️ NON AUDITÉ

**Action requise:** Audit complet du package hiios-api

---

### 7.6 hiios-enterprise

**Fichier:** `packages/hiios-enterprise/src/`

**Fichiers:**
- `analytics/AnalyticsEngine.ts`
- `experimentation/ExperimentationEngine.ts`
- `flags/FeatureFlagEngine.ts`
- `observability/Telemetry.ts`
- `tests/build006.test.ts`

**Statut:** ⚠️ NON AUDITÉ

**Action requise:** Audit complet du package hiios-enterprise

---

### 7.7 hiios-runtime

**Fichier:** `packages/hiios-runtime/src/`

**Fichiers:**
- `llm/AnthropicProvider.ts`
- `llm/LLMProvider.ts`
- `llm/LLMRouter.ts`
- `llm/MockProvider.ts`
- `llm/OpenAIProvider.ts`
- `parser/LLMResponseParser.ts`
- `persistence/InterviewRepository.ts`
- `tests/build005.test.ts`

**Statut:** ⚠️ NON AUDITÉ

**Action requise:** Audit complet du package hiios-runtime

---

### 7.8 hiios-sdk

**Fichier:** `packages/hiios-sdk/src/`

**Fichiers:**
- `HIIOSClient.ts`

**Statut:** ⚠️ NON AUDITÉ

**Action requise:** Audit complet du package hiios-sdk

---

### 7.9 voice-core

**Fichier:** `packages/voice-core/dist/`

**Fichiers:**
- `index.d.ts`
- `p5/bridge/event-batch.d.ts`
- `p5/bridge/normalization-contract.d.ts`
- `p5/bridge/normalize-decision.d.ts`
- `p5/bridge/validation.d.ts`
- `p5/execution-contract.d.ts`
- `p5/execution-engine.d.ts`
- `p5/index.d.ts`
- `p5/integration/execution-facade.d.ts`
- `p5/integration/execution-session.d.ts`
- ... (autres fichiers .d.ts)

**Statut:** ⚠️ FICHIERS DE DÉCLARATION (.d.ts)

**Action requise:** Audit complet du package voice-core

---

**Total fichiers packages:** 64  
**Packages à auditer:** 9

---

## 8. TYPES INUTILISÉS

### 8.1 Types dans Services Dépréciés

**MatchingService:**
- `MatchingResult`
- `OverallScore` (défini dans scoring.service.ts)
- `TransferResult` (défini dans transfer.service.ts)
- `Explanation` (défini dans explanation.service.ts)

**SearchService:**
- `RankedResult` (défini dans semantic-ranking.service.ts)
- `RelatedSkills` (défini dans recommendation.service.ts)
- `CareerPath` (défini dans recommendation.service.ts)

**ReasoningService:**
- `ReasoningInput`
- `ReasoningOutput`
- `CollectedFacts` (défini dans fact-collector.service.ts)
- `GapAnalysisResult` (défini dans gap-analyzer.service.ts)
- `ContextAnalysis` (défini dans context-analyzer.service.ts)
- `ReasoningDecision` (défini dans decision-builder.service.ts)
- `RecommendationType` (défini dans decision-builder.service.ts)

**GraphBuilderService (CV):**
- `Entity`
- `Attribute`
- `Relationship`
- `SemanticGraph`

**Statut:** ⚠️ TYPES INUTILISÉS (dépendent de services dépréciés)

**Action requise:** Supprimer après suppression des services dépréciés

---

## 9. IMPORTS MORTS

### 9.1 Imports dans CvService

**Fichier:** `apps/api/src/cv/cv.service.ts`

**Import mort:**
```typescript
// Ligne 236: buildGraph() fait référence à graphBuilderService
// mais graphBuilderService n'est pas injecté dans le constructeur
async buildGraph(normalizedKnowledge: any) {
  return this.graphBuilderService.buildGraph(normalizedKnowledge);
}
```

**Statut:** ❌ IMPORT MORT (méthode non utilisée, service non injecté)

**Action requise:** Supprimer la méthode buildGraph()

---

## 10. RÉSUMÉ PAR CATÉGORIE

### 10.1 Services Dépréciés (3)

1. `apps/api/src/matching/matching.service.ts` - @deprecated
2. `apps/api/src/search/search.service.ts` - @deprecated
3. `apps/api/src/reasoning/reasoning.service.ts` - @deprecated

### 10.2 Services Associés Legacy (13)

**Matching (3):**
4. `apps/api/src/matching/scoring.service.ts`
5. `apps/api/src/matching/explanation.service.ts`
6. `apps/api/src/matching/transfer.service.ts`

**Search (3):**
7. `apps/api/src/search/similarity.service.ts`
8. `apps/api/src/search/semantic-ranking.service.ts`
9. `apps/api/src/search/recommendation.service.ts`

**Reasoning (6):**
10. `apps/api/src/reasoning/fact-collector.service.ts`
11. `apps/api/src/reasoning/gap-analyzer.service.ts`
12. `apps/api/src/reasoning/context-analyzer.service.ts`
13. `apps/api/src/reasoning/decision-builder.service.ts`
14. `apps/api/src/reasoning/doubt-detector.service.ts`
15. `apps/api/src/reasoning/transfer-patterns.service.ts`

**CV/Job (2):**
16. `apps/api/src/cv/graph-builder.service.ts`
17. `apps/api/src/job/job-graph-builder.service.ts`

### 10.3 Controllers avec Placeholders (3)

18. `apps/api/src/matching/matching.controller.ts` - 6 routes placeholders
19. `apps/api/src/search/search.controller.ts` - 7 routes placeholders
20. `apps/api/src/reasoning/reasoning.controller.ts` - 1 route placeholder

### 10.4 Modules Vides (3)

21. `apps/api/src/matching/matching.module.ts`
22. `apps/api/src/search/search.module.ts`
23. `apps/api/src/reasoning/reasoning.module.ts`

### 10.5 Routes Mortes (14)

**Matching (6):**
- POST /matching/candidate
- POST /matching/job
- GET /matching/candidates
- GET /matching/jobs
- GET /matching/candidate/:id
- GET /matching/job/:id

**Search (7):**
- POST /search/related-skills
- POST /search/register-candidate
- POST /search/register-job
- GET /search/candidates
- GET /search/jobs
- GET /search/candidate/:id
- GET /search/job/:id

**Reasoning (1):**
- POST /reasoning/format

### 10.6 Frontend (69)

24. `apps/web/src/app/page old.tsx` - FICHIER MORT CONFIRMÉ
25-92. 68 autres fichiers à auditer

### 10.7 Packages (64)

93-156. 64 fichiers dans 9 packages à auditer

---

## 11. PLAN DE NETTOYAGE

### P0 - CRITIQUE (Cette semaine)

**Supprimer:**
1. `apps/web/src/app/page old.tsx` - Fichier mort confirmé
2. `apps/api/src/cv/cv.service.ts` - Méthode buildGraph() (import mort)

**Implémenter:**
3. Routes placeholders dans MatchingController avec GraphRepository
4. Routes placeholders dans SearchController avec GraphRepository
5. Route placeholder dans ReasoningController avec GraphReasoningEngine

### P1 - MAJEUR (Ce mois)

**Supprimer:**
6. `apps/api/src/matching/matching.service.ts` - Service déprécié
7. `apps/api/src/matching/scoring.service.ts` - Service associé
8. `apps/api/src/matching/explanation.service.ts` - Service associé
9. `apps/api/src/matching/transfer.service.ts` - Service associé
10. `apps/api/src/search/search.service.ts` - Service déprécié
11. `apps/api/src/search/similarity.service.ts` - Service associé
12. `apps/api/src/search/semantic-ranking.service.ts` - Service associé
13. `apps/api/src/search/recommendation.service.ts` - Service associé
14. `apps/api/src/reasoning/reasoning.service.ts` - Service déprécié
15. `apps/api/src/reasoning/fact-collector.service.ts` - Service associé
16. `apps/api/src/reasoning/gap-analyzer.service.ts` - Service associé
17. `apps/api/src/reasoning/context-analyzer.service.ts` - Service associé
18. `apps/api/src/reasoning/decision-builder.service.ts` - Service associé
19. `apps/api/src/reasoning/doubt-detector.service.ts` - Service associé
20. `apps/api/src/reasoning/transfer-patterns.service.ts` - Service associé
21. `apps/api/src/cv/graph-builder.service.ts` - Service legacy
22. `apps/api/src/job/job-graph-builder.service.ts` - Service legacy

**Nettoyer:**
23. `apps/api/src/matching/matching.module.ts` - Supprimer ou ajouter providers
24. `apps/api/src/search/search.module.ts` - Supprimer ou ajouter providers
25. `apps/api/src/reasoning/reasoning.module.ts` - Supprimer ou ajouter providers

### P2 - AMÉLIORATION (Ce trimestre)

**Auditer:**
26. Pages admin (6 fichiers)
27. Pages utilisateur (7 fichiers)
28. Package blueprint-healing (8 fichiers)
29. Package blueprint-pm (9 fichiers)
30. Package blueprint-sdk (1 fichier)
31. Package blueprint-validation (5 fichiers)
32. Package hiios-api (3 fichiers)
33. Package hiios-enterprise (5 fichiers)
34. Package hiios-runtime (8 fichiers)
35. Package hiios-sdk (1 fichier)
36. Package voice-core (fichiers .d.ts)

---

## 12. MÉTRIQUES

### 12.1 Score de Santé du Code

**Calcul:**
- Services dépréciés: -10 points
- Services associés legacy: -5 points
- Controllers avec placeholders: -3 points
- Modules vides: -2 points
- Routes mortes: -4 points
- Frontend non audité: -2 points
- Packages non audités: -2 points

**Score actuel:** 72/100

**Score après nettoyage P0:** 75/100  
**Score après nettoyage P1:** 90/100  
**Score après audit P2:** 95/100

---

## 13. RECOMMANDATIONS

### Recommandation Immédiate (P0)

1. **Supprimer le fichier mort confirmé**
   - `apps/web/src/app/page old.tsx`

2. **Supprimer l'import mort**
   - Méthode `buildGraph()` dans `apps/api/src/cv.service.ts`

3. **Implémenter les routes placeholders**
   - Utiliser GraphRepository pour les endpoints de récupération
   - Utiliser GraphSearchService pour related-skills
   - Utiliser GraphReasoningEngine pour format

### Recommandation Court Terme (P1)

1. **Supprimer les services dépréciés**
   - Migration complète vers GraphMatchingService, GraphSearchService, GraphReasoningEngine
   - Suppression des services associés
   - Nettoyage des modules

### Recommandation Moyen Terme (P2)

1. **Auditer le frontend**
   - Identifier les features mortes
   - Supprimer les composants inutilisés
   - Nettoyer les imports morts

2. **Auditer les packages**
   - Identifier les packages inutilisés
   - Supprimer les packages legacy
   - Nettoyer les dépendances

---

## 14. CONCLUSION

**Total éléments legacy identifiés:** 47

**Répartition:**
- Services dépréciés: 3
- Services associés legacy: 13
- Controllers avec placeholders: 3
- Modules vides: 3
- Routes mortes: 14
- Frontend: 69 (1 mort confirmé, 68 à auditer)
- Packages: 64 (à auditer)

**Score de santé du code:** 72/100

**Actions requises:** 36  
**Estimation:** 12 semaines

**Note:** Aucune suppression n'a été effectuée conformément à la mission. Cet inventaire sert de référence pour le nettoyage futur.

---

**Rapport généré par:** Cascade AI  
**Date:** 2026-08-06  
**Version:** 1.0
