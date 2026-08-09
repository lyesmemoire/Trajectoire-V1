# RUNTIME GRAPH V2 - INTEGRATION AUDIT

**Date:** 2026-08-05  
**Objectif:** Supprimer le fonctionnement hybride et migrer vers Runtime Graph v2  
**Statut:** ✅ AUDIT COMPLÉTÉ

---

## RÉSUMÉ DE L'AUDIT

### Services Dépréciés Identifiés

1. **MatchingService** - 6 fichiers
2. **SearchService** - 6 fichiers
3. **ReasoningService** - 4 fichiers
4. **SimilarityService** - 4 fichiers
5. **RecommendationService** - 3 fichiers
6. **SemanticRankingService** - 3 fichiers

**Total:** 26 fichiers à modifier

---

## 1. MATCHINGSERVICE

### Utilisations Identifiées

| Fichier | Ligne | Méthode | Endpoint | Impact |
|---------|-------|---------|----------|--------|
| copilot/copilot.service.ts | 7 | import | - | Import du service déprécié |
| copilot/copilot.service.ts | 17 | constructor | - | Injection du service déprécié |
| copilot/copilot.service.ts | - | handleExplainScore | - | Utilisation dans Copilot |
| matching/matching.controller.ts | 2 | import | - | Import du service déprécié |
| matching/matching.controller.ts | 9 | constructor | - | Injection du service déprécié |
| matching/matching.controller.ts | 16 | registerCandidate | POST /matching/candidate | Enregistrement candidat |
| matching/matching.controller.ts | 30 | registerJob | POST /matching/job | Enregistrement job |
| matching/matching.controller.ts | 44 | getCandidateGraph | - | Récupération graphe candidat |
| matching/matching.controller.ts | 46 | getJobGraph | - | Récupération graphe job |
| matching/matching.controller.ts | 84 | match | POST /matching/calculateScore | Calcul score (fallback) |
| matching/matching.controller.ts | 101 | getCandidateGraph | - | Récupération graphe candidat |
| matching/matching.controller.ts | 102 | getJobGraph | - | Récupération graphe job |
| matching/matching.controller.ts | 127 | match | POST /matching/explain | Explication match (fallback) |
| matching/matching.controller.ts | 144 | getCandidateGraph | - | Récupération graphe candidat |
| matching/matching.controller.ts | 145 | getJobGraph | - | Récupération graphe job |
| matching/matching.controller.ts | 188 | match | POST /matching/report | Rapport match (fallback) |
| matching/matching.controller.ts | 201 | getAllCandidates | GET /matching/candidates | Liste candidats |
| matching/matching.controller.ts | 214 | getAllJobs | GET /matching/jobs | Liste jobs |
| matching/matching.controller.ts | 227 | getCandidateGraph | GET /matching/candidate/:id | Graphe candidat |
| matching/matching.controller.ts | 240 | getJobGraph | GET /matching/job/:id | Graphe job |
| matching/matching.module.ts | 3 | import | - | Import du service déprécié |
| matching/matching.module.ts | 13 | provider | - | Déclaration du provider |
| matching/matching.module.ts | 19 | export | - | Export du service |
| matching/matching.service.ts | 23 | class | - | Définition du service déprécié |
| runtime/kg/graph-matching.service.ts | 61 | class | - | Définition du service graph |
| runtime/kg/index.ts | 13 | export | - | Export du service graph |

**Total:** 25 occurrences

**Impact:** ÉLEVÉ - Service utilisé dans MatchingController et CopilotService

---

## 2. SEARCHSERVICE

### Utilisations Identifiées

| Fichier | Ligne | Méthode | Endpoint | Impact |
|---------|-------|---------|----------|--------|
| copilot/copilot.service.ts | 6 | import | - | Import du service déprécié |
| copilot/copilot.service.ts | 16 | constructor | - | Injection du service déprécié |
| copilot/copilot.service.ts | 81 | searchCandidates | - | Recherche candidats |
| copilot/copilot.service.ts | 98 | searchJobs | - | Recherche jobs |
| copilot/copilot.service.ts | 118 | buildCareerPath | - | Construction carrière |
| copilot/copilot.service.ts | 133 | buildCareerPath | - | Construction carrière |
| search/search.controller.ts | 2 | import | - | Import du service déprécié |
| search/search.controller.ts | 9 | constructor | - | Injection du service déprécié |
| search/search.controller.ts | 18 | getAllCandidates | - | Récupération candidats |
| search/search.controller.ts | 19 | getCandidateGraph | - | Récupération graphe candidat |
| search/search.controller.ts | 35 | searchCandidates | POST /search/candidates | Recherche candidats (fallback) |
| search/search.controller.ts | 50 | getAllJobs | - | Récupération jobs |
| search/search.controller.ts | 51 | getJobGraph | - | Récupération graphe job |
| search/search.controller.ts | 67 | searchJobs | POST /search/jobs | Recherche jobs (fallback) |
| search/search.controller.ts | 80 | getCandidateGraph | - | Récupération graphe candidat |
| search/search.controller.ts | 83 | getAllCandidates | - | Récupération candidats |
| search/search.controller.ts | 100 | findSimilarCandidates | POST /search/similar-candidates | Candidats similaires (fallback) |
| search/search.controller.ts | 113 | getJobGraph | - | Récupération graphe job |
| search/search.controller.ts | 116 | getAllJobs | - | Récupération jobs |
| search/search.controller.ts | 133 | findSimilarJobs | POST /search/similar-jobs | Jobs similaires (fallback) |
| search/search.controller.ts | 147 | findRelatedSkills | POST /search/related-skills | Skills liés |
| search/search.controller.ts | 160 | getCandidateGraph | - | Récupération graphe candidat |
| search/search.controller.ts | 164 | getAllJobs | - | Récupération jobs |
| search/search.controller.ts | 182 | buildCareerPath | POST /search/career-path | Carrière (fallback) |
| search/search.controller.ts | 193 | registerCandidate | POST /search/register-candidate | Enregistrement candidat |
| search/search.controller.ts | 201 | registerJob | POST /search/register-job | Enregistrement job |
| search/search.controller.ts | 209 | getAllCandidates | GET /search/candidates | Liste candidats |
| search/search.controller.ts | 218 | getAllJobs | GET /search/jobs | Liste jobs |
| search/search.controller.ts | 227 | getCandidateGraph | GET /search/candidate/:id | Graphe candidat |
| search/search.controller.ts | 236 | getJobGraph | GET /search/job/:id | Graphe job |
| search/search.module.ts | 3 | import | - | Import du service déprécié |
| search/search.module.ts | 13 | provider | - | Déclaration du provider |
| search/search.module.ts | 19 | export | - | Export du service |
| search/search.service.ts | 4 | import | - | Import du service déprécié |
| search/search.service.ts | 21 | constructor | - | Injection du service déprécié |
| runtime/kg/graph-search.service.ts | 38 | class | - | Définition du service graph |
| runtime/kg/index.ts | 15 | export | - | Export du service graph |

**Total:** 38 occurrences

**Impact:** ÉLEVÉ - Service utilisé dans SearchController et CopilotService

---

## 3. REASONINGSERVICE

### Utilisations Identifiées

| Fichier | Ligne | Méthode | Endpoint | Impact |
|---------|-------|---------|----------|--------|
| copilot/copilot.module.ts | 5 | import | - | Import du service déprécié |
| copilot/copilot.module.ts | 17 | provider | - | Déclaration du provider |
| copilot/copilot.module.ts | 24 | export | - | Export du service |
| copilot/copilot.service.ts | 3 | import | - | Import du service déprécié |
| copilot/copilot.service.ts | 13 | constructor | - | Injection du service déprécié |
| copilot/copilot.service.ts | 24 | reason | - | Génération du raisonnement |
| copilot/reasoning.service.ts | 12 | class | - | Définition du service déprécié |
| reasoning/reasoning.controller.ts | 2 | import | - | Import du service déprécié |
| reasoning/reasoning.controller.ts | 10 | constructor | - | Injection du service déprécié |
| reasoning/reasoning.controller.ts | 19 | reason | POST /reasoning/analyze | Analyse raisonnement |
| reasoning/reasoning.controller.ts | 29 | formatDecisionForDisplay | POST /reasoning/format | Formatage décision |
| reasoning/reasoning.module.ts | 3 | import | - | Import du service déprécié |
| reasoning/reasoning.module.ts | 18 | provider | - | Déclaration du provider |
| reasoning/reasoning.module.ts | 27 | export | - | Export du service |
| reasoning/reasoning.service.ts | 50 | class | - | Définition du service déprécié |

**Total:** 15 occurrences

**Impact:** ÉLEVÉ - Service utilisé dans CopilotService et ReasoningController

---

## 4. SIMILARITYSERVICE

### Utilisations Identifiées

| Fichier | Ligne | Méthode | Endpoint | Impact |
|---------|-------|---------|----------|--------|
| search/recommendation.service.ts | 2 | import | - | Import du service déprécié |
| search/recommendation.service.ts | 23 | constructor | - | Injection du service déprécié |
| search/recommendation.service.ts | 45 | calculateJobSimilarity | - | Calcul similarité jobs |
| search/recommendation.service.ts | 179 | calculateCandidateSimilarity | - | Calcul similarité candidats |
| search/search.module.ts | 4 | import | - | Import du service déprécié |
| search/search.module.ts | 14 | provider | - | Déclaration du provider |
| search/search.module.ts | 20 | export | - | Export du service |
| search/search.service.ts | 2 | import | - | Import du service déprécié |
| search/search.service.ts | 19 | constructor | - | Injection du service déprécié |
| search/search.service.ts | 53 | calculateCandidateSimilarity | - | Calcul similarité candidats |
| search/search.service.ts | 78 | calculateJobSimilarity | - | Calcul similarité jobs |
| search/semantic-ranking.service.ts | 2 | import | - | Import du service déprécié |
| search/semantic-ranking.service.ts | 14 | constructor | - | Injection du service déprécié |
| search/similarity.service.ts | 16 | class | - | Définition du service déprécié |

**Total:** 14 occurrences

**Impact:** MOYEN - Service utilisé uniquement dans le module search

---

## 5. RECOMMENDATIONSERVICE

### Utilisations Identifiées

| Fichier | Ligne | Méthode | Endpoint | Impact |
|---------|-------|---------|----------|--------|
| search/search.module.ts | 5 | import | - | Import du service déprécié |
| search/search.module.ts | 15 | provider | - | Déclaration du provider |
| search/search.module.ts | 21 | export | - | Export du service |
| search/search.service.ts | 3 | import | - | Import du service déprécié |
| search/search.service.ts | 20 | constructor | - | Injection du service déprécié |
| search/search.service.ts | 93 | findRelatedSkills | - | Recherche skills liés |
| search/search.service.ts | 103 | buildCareerPath | - | Construction carrière |
| search/recommendation.service.ts | 22 | class | - | Définition du service déprécié |

**Total:** 8 occurrences

**Impact:** MOYEN - Service utilisé uniquement dans le module search

---

## 6. SEMANTICRANKINGSERVICE

### Utilisations Identifiées

| Fichier | Ligne | Méthode | Endpoint | Impact |
|---------|-------|---------|----------|--------|
| search/search.module.ts | 6 | import | - | Import du service déprécié |
| search/search.module.ts | 16 | provider | - | Déclaration du provider |
| search/search.module.ts | 22 | export | - | Export du service |
| search/search.service.ts | 4 | import | - | Import du service déprécié |
| search/search.service.ts | 21 | constructor | - | Injection du service déprécié |
| search/search.service.ts | 34 | rankCandidates | - | Classement candidats |
| search/search.service.ts | 39 | rankJobs | - | Classement jobs |
| search/semantic-ranking.service.ts | 13 | class | - | Définition du service déprécié |

**Total:** 8 occurrences

**Impact:** MOYEN - Service utilisé uniquement dans le module search

---

## ANALYSE PAR ENDPOINT

### Matching Endpoints

| Endpoint | Service Actuel | Service Cible | Impact |
|----------|----------------|---------------|--------|
| POST /matching/candidate | MatchingService | GraphMatchingService | MOYEN |
| POST /matching/job | MatchingService | GraphMatchingService | MOYEN |
| POST /matching/calculateScore | MatchingService (fallback) | GraphMatchingService | ÉLEVÉ |
| POST /matching/explain | MatchingService (fallback) | GraphMatchingService | ÉLEVÉ |
| POST /matching/report | MatchingService (fallback) | GraphMatchingService | ÉLEVÉ |
| GET /matching/candidates | MatchingService | GraphMatchingService | FAIBLE |
| GET /matching/jobs | MatchingService | GraphMatchingService | FAIBLE |
| GET /matching/candidate/:id | MatchingService | GraphMatchingService | FAIBLE |
| GET /matching/job/:id | MatchingService | GraphMatchingService | FAIBLE |

### Search Endpoints

| Endpoint | Service Actuel | Service Cible | Impact |
|----------|----------------|---------------|--------|
| POST /search/candidates | SearchService (fallback) | GraphSearchService | ÉLEVÉ |
| POST /search/jobs | SearchService (fallback) | GraphSearchService | ÉLEVÉ |
| POST /search/similar-candidates | SearchService (fallback) | GraphSearchService | ÉLEVÉ |
| POST /search/similar-jobs | SearchService (fallback) | GraphSearchService | ÉLEVÉ |
| POST /search/related-skills | SearchService | GraphSearchService | MOYEN |
| POST /search/career-path | SearchService (fallback) | GraphSearchService | ÉLEVÉ |
| POST /search/register-candidate | SearchService | GraphMatchingService | MOYEN |
| POST /search/register-job | SearchService | GraphMatchingService | MOYEN |
| GET /search/candidates | SearchService | GraphMatchingService | FAIBLE |
| GET /search/jobs | SearchService | GraphMatchingService | FAIBLE |
| GET /search/candidate/:id | SearchService | GraphMatchingService | FAIBLE |
| GET /search/job/:id | SearchService | GraphMatchingService | FAIBLE |

### Reasoning Endpoints

| Endpoint | Service Actuel | Service Cible | Impact |
|----------|----------------|---------------|--------|
| POST /reasoning/analyze | ReasoningService | GraphReasoningEngine | ÉLEVÉ |
| POST /reasoning/format | ReasoningService | GraphReasoningEngine | FAIBLE |

### Copilot Endpoints

| Endpoint | Service Actuel | Service Cible | Impact |
|----------|----------------|---------------|--------|
| POST /copilot/message | CopilotService (ReasoningService, SearchService, MatchingService) | CopilotService (GraphReasoningEngine, GraphSearchService, GraphMatchingService) | ÉLEVÉ |

---

## PLAN D'INTÉGRATION

### Phase 1: MatchingController → GraphMatchingService

**Fichiers à modifier:**
1. matching/matching.controller.ts
2. matching/matching.module.ts

**Impact:**
- 9 endpoints
- 25 occurrences de MatchingService

**Risques:**
- DTO compatibility
- Test failures

---

### Phase 2: SearchController → GraphSearchService

**Fichiers à modifier:**
1. search/search.controller.ts
2. search/search.module.ts

**Impact:**
- 12 endpoints
- 38 occurrences de SearchService

**Risques:**
- DTO compatibility
- Test failures
- relatedSkills et careerPath non implémentés dans GraphSearchService

---

### Phase 3: Copilot → GraphReasoningEngine

**Fichiers à modifier:**
1. copilot/copilot.service.ts
2. copilot/copilot.module.ts

**Impact:**
- 1 endpoint
- 15 occurrences de ReasoningService
- 6 occurrences de SearchService
- 3 occurrences de MatchingService

**Risques:**
- DTO compatibility
- Test failures
- Hallucinations de sources

---

### Phase 4: Analytics → GraphAnalyticsService

**Fichiers à modifier:**
1. (À déterminer - pas d'AnalyticsController identifié)

**Impact:**
- À déterminer

**Risques:**
- À déterminer

---

## CONCLUSION DE L'AUDIT

**Total de fichiers à modifier:** 26

**Total d'occurrences:** 108

**Impact global:** ÉLEVÉ

**Risques identifiés:**
1. DTO compatibility
2. Test failures
3. relatedSkills non implémenté dans GraphSearchService
4. careerPath non implémenté dans GraphSearchService
5. Hallucinations de sources dans Copilot

**Recommandation:** Procéder par phases avec tests après chaque phase.
