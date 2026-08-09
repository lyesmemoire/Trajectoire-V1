# CODE CLEANUP AUDIT

**Date:** 2026-08-05  
**Objectif:** Audit complet des anciens services encore utilisés  
**Statut:** ✅ AUDIT COMPLÉTÉ

---

## RÉSUMÉ

**Conclusion:** AUCUN service ne peut être supprimé sans casser l'application.

**Raison:** Tous les services dépréciés sont encore activement utilisés par les contrôleurs et les services en production. Le système hybride dépend encore des services anciens.

---

## AUDIT COMPLET DES SERVICES

### 1. MATCHINGSERVICE

**Statut:** ❌ NE PEUT PAS ÊTRE SUPPRIMÉ

**Imports:**
- matching/matching.controller.ts (ligne 2)
- matching/matching.module.ts (ligne 3)
- copilot/copilot.service.ts (ligne 7)

**Appels:**
- matching/matching.controller.ts (lignes 16, 30, 45, 46, 84, 101, 102, 127, 144, 145, 188, 201, 214, 227, 240)
- copilot/copilot.service.ts (handleExplainScore)

**Utilisation Runtime:**
- MatchingController (injection et appels)
- CopilotService (injection et appels)

**Utilisation Tests:**
- Aucune

**Utilisation Frontend:**
- Aucune directe (via API)

**Dépendances:**
- ScoringService
- TransferService
- ExplanationService

**Impact de suppression:** CRITIQUE - Casserait MatchingController et CopilotService

---

### 2. SEARCHSERVICE

**Statut:** ❌ NE PEUT PAS ÊTRE SUPPRIMÉ

**Imports:**
- search/search.controller.ts (ligne 2)
- search/search.module.ts (ligne 3)
- copilot/copilot.service.ts (ligne 6)

**Appels:**
- search/search.controller.ts (lignes 18, 19, 35, 50, 51, 67, 80, 83, 100, 113, 116, 133, 147, 160, 164, 182, 195, 209, 223, 236, 249, 262)
- copilot/copilot.service.ts (lignes 81, 98, 118, 133)

**Utilisation Runtime:**
- SearchController (injection et appels)
- CopilotService (injection et appels)

**Utilisation Tests:**
- Aucune

**Utilisation Frontend:**
- Aucune directe (via API)

**Dépendances:**
- SimilarityService
- RecommendationService
- SemanticRankingService

**Impact de suppression:** CRITIQUE - Casserait SearchController et CopilotService

---

### 3. REASONINGSERVICE

**Statut:** ❌ NE PEUT PAS ÊTRE SUPPRIMÉ

**Imports:**
- copilot/copilot.module.ts (ligne 5)
- copilot/copilot.service.ts (ligne 3)
- reasoning/reasoning.controller.ts (ligne 2)
- reasoning/reasoning.module.ts (ligne 3)

**Appels:**
- copilot/copilot.service.ts (ligne 24)
- reasoning/reasoning.controller.ts (ligne 19)

**Utilisation Runtime:**
- CopilotService (injection et appels)
- ReasoningController (injection et appels)

**Utilisation Tests:**
- Aucune

**Utilisation Frontend:**
- Aucune directe (via API)

**Dépendances:**
- FactCollectorService
- GapAnalyzerService
- ContextAnalyzerService
- DecisionBuilderService
- DoubtDetectorService

**Impact de suppression:** CRITIQUE - Casserait CopilotService et ReasoningController

---

### 4. SIMILARITYSERVICE

**Statut:** ❌ NE PEUT PAS ÊTRE SUPPRIMÉ

**Imports:**
- search/recommendation.service.ts (ligne 2)
- search/search.module.ts (ligne 4)
- search/search.service.ts (ligne 2)
- search/semantic-ranking.service.ts (ligne 2)

**Appels:**
- search/recommendation.service.ts (lignes 45, 179)
- search/search.service.ts (lignes 53, 78)
- search/semantic-ranking.service.ts (injection)

**Utilisation Runtime:**
- RecommendationService (injection et appels)
- SearchService (injection et appels)
- SemanticRankingService (injection)

**Utilisation Tests:**
- Aucune

**Utilisation Frontend:**
- Aucune directe (via API)

**Dépendances:**
- Aucune

**Impact de suppression:** CRITIQUE - Casserait RecommendationService, SearchService, SemanticRankingService

---

### 5. RECOMMENDATIONSERVICE

**Statut:** ❌ NE PEUT PAS ÊTRE SUPPRIMÉ

**Imports:**
- search/search.module.ts (ligne 5)
- search/search.service.ts (ligne 3)

**Appels:**
- search/search.service.ts (lignes 93, 103)

**Utilisation Runtime:**
- SearchService (injection et appels)

**Utilisation Tests:**
- Aucune

**Utilisation Frontend:**
- Aucune directe (via API)

**Dépendances:**
- SimilarityService

**Impact de suppression:** CRITIQUE - Casserait SearchService

---

### 6. SEMANTICRANKINGSERVICE

**Statut:** ❌ NE PEUT PAS ÊTRE SUPPRIMÉ

**Imports:**
- search/search.module.ts (ligne 6)
- search/search.service.ts (ligne 4)

**Appels:**
- search/search.service.ts (lignes 34, 39)

**Utilisation Runtime:**
- SearchService (injection et appels)

**Utilisation Tests:**
- Aucune

**Utilisation Frontend:**
- Aucune directe (via API)

**Dépendances:**
- SimilarityService

**Impact de suppression:** CRITIQUE - Casserait SearchService

---

### 7. SCORINGSERVICE

**Statut:** ❌ NE PEUT PAS ÊTRE SUPPRIMÉ

**Imports:**
- matching/matching.module.ts (ligne 4)
- matching/matching.service.ts (ligne 2)

**Appels:**
- matching/matching.service.ts (ligne 54)

**Utilisation Runtime:**
- MatchingService (injection et appels)

**Utilisation Tests:**
- Aucune

**Utilisation Frontend:**
- Aucune directe (via API)

**Dépendances:**
- Aucune

**Impact de suppression:** CRITIQUE - Casserait MatchingService

---

### 8. TRANSFERSERVICE

**Statut:** ❌ NE PEUT PAS ÊTRE SUPPRIMÉ

**Imports:**
- matching/matching.module.ts (ligne 5)
- matching/matching.service.ts (ligne 3)

**Appels:**
- matching/matching.service.ts (ligne 59)

**Utilisation Runtime:**
- MatchingService (injection et appels)

**Utilisation Tests:**
- Aucune

**Utilisation Frontend:**
- Aucune directe (via API)

**Dépendances:**
- Aucune

**Impact de suppression:** CRITIQUE - Casserait MatchingService

---

### 9. EXPLANATIONSERVICE

**Statut:** ❌ NE PEUT PAS ÊTRE SUPPRIMÉ

**Imports:**
- matching/matching.module.ts (ligne 6)
- matching/matching.service.ts (ligne 4)

**Appels:**
- matching/matching.service.ts (ligne 62)

**Utilisation Runtime:**
- MatchingService (injection et appels)

**Utilisation Tests:**
- Aucune

**Utilisation Frontend:**
- Aucune directe (via API)

**Dépendances:**
- Aucune

**Impact de suppression:** CRITIQUE - Casserait MatchingService

---

### 10. FACTCOLLECTORSERVICE

**Statut:** ❌ NE PEUT PAS ÊTRE SUPPRIMÉ

**Imports:**
- reasoning/reasoning.module.ts (ligne 4)
- reasoning/reasoning.service.ts (ligne 2)

**Appels:**
- reasoning/reasoning.service.ts (ligne 52)

**Utilisation Runtime:**
- ReasoningService (injection et appels)

**Utilisation Tests:**
- Aucune

**Utilisation Frontend:**
- Aucune directe (via API)

**Dépendances:**
- Aucune

**Impact de suppression:** CRITIQUE - Casserait ReasoningService

---

### 11. GAPANALYZERSERVICE

**Statut:** ❌ NE PEUT PAS ÊTRE SUPPRIMÉ

**Imports:**
- reasoning/reasoning.module.ts (ligne 5)
- reasoning/reasoning.service.ts (ligne 3)
- reasoning/gap-analyzer.service.ts (ligne 3)

**Appels:**
- reasoning/reasoning.service.ts (ligne 53)

**Utilisation Runtime:**
- ReasoningService (injection et appels)

**Utilisation Tests:**
- Aucune

**Utilisation Frontend:**
- Aucune directe (via API)

**Dépendances:**
- TransferPatternsService

**Impact de suppression:** CRITIQUE - Casserait ReasoningService

---

### 12. CONTEXTANALYZERSERVICE

**Statut:** ❌ NE PEUT PAS ÊTRE SUPPRIMÉ

**Imports:**
- reasoning/reasoning.module.ts (ligne 6)
- reasoning/reasoning.service.ts (ligne 4)

**Appels:**
- reasoning/reasoning.service.ts (ligne 54)

**Utilisation Runtime:**
- ReasoningService (injection et appels)

**Utilisation Tests:**
- Aucune

**Utilisation Frontend:**
- Aucune directe (via API)

**Dépendances:**
- Aucune

**Impact de suppression:** CRITIQUE - Casserait ReasoningService

---

### 13. DECISIONBUILDERSERVICE

**Statut:** ❌ NE PEUT PAS ÊTRE SUPPRIMÉ

**Imports:**
- reasoning/reasoning.module.ts (ligne 7)
- reasoning/reasoning.service.ts (ligne 5)

**Appels:**
- reasoning/reasoning.service.ts (ligne 55)

**Utilisation Runtime:**
- ReasoningService (injection et appels)

**Utilisation Tests:**
- Aucune

**Utilisation Frontend:**
- Aucune directe (via API)

**Dépendances:**
- Aucune

**Impact de suppression:** CRITIQUE - Casserait ReasoningService

---

### 14. DOUBTDETECTORSERVICE

**Statut:** ❌ NE PEUT PAS ÊTRE SUPPRIMÉ

**Imports:**
- reasoning/reasoning.module.ts (ligne 9)
- reasoning/reasoning.service.ts (ligne 6)

**Appels:**
- reasoning/reasoning.service.ts (ligne 56)

**Utilisation Runtime:**
- ReasoningService (injection et appels)

**Utilisation Tests:**
- Aucune

**Utilisation Frontend:**
- Aucune directe (via API)

**Dépendances:**
- Aucune

**Impact de suppression:** CRITIQUE - Casserait ReasoningService

---

### 15. TRANSFERPATTERNSSERVICE

**Statut:** ❌ NE PEUT PAS ÊTRE SUPPRIMÉ

**Imports:**
- reasoning/reasoning.module.ts (ligne 8)
- reasoning/gap-analyzer.service.ts (ligne 3)

**Appels:**
- reasoning/gap-analyzer.service.ts (ligne 34)

**Utilisation Runtime:**
- GapAnalyzerService (injection)

**Utilisation Tests:**
- Aucune

**Utilisation Frontend:**
- Aucune directe (via API)

**Dépendances:**
- Aucune

**Impact de suppression:** CRITIQUE - Casserait GapAnalyzerService

---

## ANALYSE DES SERVICES DEVENUS INUTILES

### Conclusion

**AUCUN service ne peut être supprimé.**

Tous les services dépréciés sont encore activement utilisés par:

1. **MatchingController** - Utilise MatchingService, ScoringService, TransferService, ExplanationService
2. **SearchController** - Utilise SearchService, SimilarityService, RecommendationService, SemanticRankingService
3. **CopilotService** - Utilise MatchingService, SearchService, ReasoningService
4. **ReasoningController** - Utilise ReasoningService
5. **ReasoningService** - Utilise FactCollectorService, GapAnalyzerService, ContextAnalyzerService, DecisionBuilderService, DoubtDetectorService

### Pourquoi les services ne peuvent pas être supprimés

Le système hybride actuel dépend encore des services anciens pour:

1. **Fallback** - Les contrôleurs utilisent les services anciens comme fallback quand les graphes ne sont pas disponibles
2. **Compatibilité** - Les DTO de réponse sont convertis depuis les services anciens
3. **Copilot** - CopilotService utilise encore les services anciens pour le matching, la recherche et le raisonnement

### Conditions pour supprimer les services

Les services peuvent être supprimés uniquement si:

1. **MatchingController** est entièrement migré vers GraphMatchingService (sans fallback)
2. **SearchController** est entièrement migré vers GraphSearchService (sans fallback)
3. **CopilotService** est entièrement migré vers GraphReasoningEngine, GraphMatchingService, GraphSearchService
4. **ReasoningController** est entièrement migré vers GraphReasoningEngine

---

## RAPPORT FINAL

**Services audités:** 15

**Services pouvant être supprimés:** 0

**Services à conserver:** 15

**Action requise:** AUCUNE - Les services sont encore nécessaires

**Recommandation:** Compléter la migration backend vers Runtime Graph v2 avant de supprimer les services anciens. Voir `RUNTIME-GRAPH-V2-INTEGRATION-AUDIT.md` pour le plan de migration.
