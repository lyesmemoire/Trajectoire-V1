# 📋 Career Intelligence Registry

> Registre des intelligences du Career Copilot
> Version: 1.0 (après Sprints 53-54)
> Ce document permet de vérifier rapidement si une responsabilité existe déjà

---

## Utilisation

Avant de proposer un nouveau sprint, vérifiez dans ce registre si la responsabilité souhaitée existe déjà. Si elle existe, réutilisez l'intelligence existante au lieu d'en créer une nouvelle.

**Règle**: Une responsabilité = une intelligence. Jamais de duplication.

---

## Registry des Intelligences

### 1. Goal Intelligence
**Nom**: `CareerCopilotGoalIntelligenceEngine`
**Objectif unique**: Définir et suivre les objectifs de carrière du candidat
**Responsabilités**:
- Définition d'objectifs SMART
- Suivi de la progression vers les objectifs
- Alignement des objectifs avec le profil candidat
**Ce qu'elle ne fait pas**:
- Ne décide PAS de la stratégie
- Ne prend PAS de décisions
- Ne planifie PAS l'exécution
**Sources autorisées**:
- CandidateGraph (source principale)
- User input
**Moteurs consommés**:
- Aucun (moteur de base)
**Moteurs qui la consomment**:
- Decision Intelligence
- Planning Intelligence
- Accountability Intelligence
**Événements Timeline produits**:
- `goal_created`, `goal_updated`, `goal_achieved`, `goal_abandoned`
**Contexte ajouté au Digital Twin**:
- `goalContext`
**Widget Dashboard associé**:
- Non spécifique (intégré dans autres widgets)
**Prompt IA utilisé**:
- `career-copilot-goal-intelligence-v1.ts`

---

### 2. Decision Intelligence
**Nom**: `CareerCopilotDecisionIntelligenceEngine`
**Objectif unique**: Prendre des décisions basées sur les objectifs et le contexte
**Responsabilités**:
- Analyse des options disponibles
- Prise de décisions informées
- Évaluation des conséquences
**Ce qu'elle ne fait pas**:
- Ne définit PAS les objectifs
- Ne planifie PAS l'exécution
- N'exécute PAS les décisions
**Sources autorisées**:
- CandidateGraph
- Goal Intelligence
- Market Intelligence
- Constraint Intelligence
**Moteurs consommés**:
- Goal Intelligence
- Market Intelligence
- Constraint Intelligence
**Moteurs qui la consomment**:
- Adaptive Strategy Intelligence
- Planning Intelligence
**Événements Timeline produits**:
- `decision_made`, `decision_revised`, `decision_confirmed`
**Contexte ajouté au Digital Twin**:
- `decisionContext`
**Widget Dashboard associé**:
- Non spécifique (intégré dans autres widgets)
**Prompt IA utilisé**:
- `career-copilot-decision-intelligence-v1.ts`

---

### 3. Adaptive Strategy Intelligence
**Nom**: `CareerCopilotAdaptiveStrategyIntelligenceEngine`
**Objectif unique**: Adapter la stratégie en fonction du contexte évolutif
**Responsabilités**:
- Analyse du contexte actuel
- Adaptation de la stratégie
- Révision des approches
**Ce qu'elle ne fait pas**:
- Ne définit PAS les objectifs
- Ne prend PAS de décisions
- Ne planifie PAS l'exécution
**Sources autorisées**:
- CandidateGraph
- Decision Intelligence
- Market Intelligence
- Opportunity Intelligence
**Moteurs consommés**:
- Decision Intelligence
- Market Intelligence
- Opportunity Intelligence
**Moteurs qui la consomment**:
- Planning Intelligence
- Reflection Intelligence
**Événements Timeline produits**:
- `strategy_adapted`, `strategy_revised`, `strategy_optimized`
**Contexte ajouté au Digital Twin**:
- `strategyContext`
**Widget Dashboard associé**:
- Non spécifique (intégré dans autres widgets)
**Prompt IA utilisé**:
- `career-copilot-adaptive-strategy-intelligence-v1.ts`

---

### 4. Forecast Intelligence
**Nom**: `CareerCopilotScenarioIntelligenceEngine`
**Objectif unique**: Prédire les scénarios futurs et leurs probabilités
**Responsabilités**:
- Génération de scénarios futurs
- Évaluation des probabilités
- Analyse des trajectoires possibles
**Ce qu'elle ne fait pas**:
- Ne prend PAS de décisions
- Ne planifie PAS l'exécution
- Ne garantit PAS les résultats
**Sources autorisées**:
- CandidateGraph
- Market Intelligence
- Historical Data
**Moteurs consommés**:
- Market Intelligence
**Moteurs qui la consomment**:
- Decision Intelligence
- Planning Intelligence
- Reflection Intelligence
**Événements Timeline produits**:
- `scenario_generated`, `scenario_updated`, `probability_changed`
**Contexte ajouté au Digital Twin**:
- `scenarioContext`
**Widget Dashboard associé**:
- Non spécifique (intégré dans autres widgets)
**Prompt IA utilisé**:
- `career-copilot-scenario-intelligence-v1.ts`

---

### 5. Reflection Intelligence
**Nom**: `CareerCopilotReflectionIntelligenceEngine`
**Objectif unique**: Réfléchir de manière critique sur les recommandations existantes
**Responsabilités**:
- Analyse critique des recommandations
- Détection des hypothèses implicites
- Identification des angles morts
- Détection des contradictions
- Recalibrage de la confiance
**Ce qu'elle ne fait pas**:
- Ne génère PAS de nouvelles recommandations
- Ne décide PAS des objectifs
- Ne planifie PAS l'exécution
**Sources autorisées**:
- CandidateGraph
- Toutes les autres intelligences (pour analyse critique)
**Moteurs consommés**:
- Goal Intelligence
- Decision Intelligence
- Narrative Intelligence
- Market Intelligence
- Opportunity Intelligence
- Constraint Intelligence
- Resource Intelligence
**Moteurs qui la consomment**:
- Planning Intelligence
- Adaptive Strategy Intelligence
**Événements Timeline produits**:
- `reflection_completed`, `recommendation_improved`, `blind_spot_detected`, `alternative_generated`, `confidence_recalibrated`, `evidence_strengthened`, `reflection_updated`
**Contexte ajouté au Digital Twin**:
- `reflectionContext`
**Widget Dashboard associé**:
- `reflection-intelligence.tsx`
**Prompt IA utilisé**:
- `career-copilot-reflection-intelligence-v1.ts`

---

### 6. Planning Intelligence
**Nom**: `CareerCopilotPlanningIntelligenceEngine`
**Objectif unique**: Transformer les recommandations en un plan d'action structuré et pilotable
**Responsabilités**:
- Transformation des recommandations en plan d'action
- Définition de jalons et priorités
- Gestion des dépendances entre actions
- Analyse des risques et plans alternatifs
- Points de contrôle et adaptation automatique
**Ce qu'elle ne fait pas**:
- Ne décide PAS des objectifs
- Ne choisit PAS la stratégie
- Ne génère PAS de nouvelles recommandations
**Sources autorisées**:
- CandidateGraph (source principale)
- Toutes les autres intelligences (pour enrichissement)
**Moteurs consommés**:
- Goal Intelligence
- Decision Intelligence
- Reflection Intelligence
- Forecast Intelligence
- Opportunity Intelligence
- Market Intelligence
- Constraint Intelligence
- Resource Intelligence
- Mission Intelligence
- Narrative Intelligence
- Knowledge Evolution Intelligence
- Scenario Intelligence
- Outcome Intelligence
- Success Intelligence
- Accountability Intelligence
**Moteurs qui la consomment**:
- Execution Intelligence (à venir)
- Coaching Intelligence (à venir)
**Événements Timeline produits**:
- `planning_generated`, `milestone_planning_reached`, `planning_updated`, `priority_changed`, `dependency_resolved`, `checkpoint_completed`, `planning_adapted`
**Contexte ajouté au Digital Twin**:
- `planningContext`
**Widget Dashboard associé**:
- `planning-intelligence.tsx`
**Prompt IA utilisé**:
- `career-copilot-planning-intelligence-v1.ts`

---

### 7. Opportunity Intelligence
**Nom**: `CareerCopilotOpportunityIntelligenceEngine`
**Objectif unique**: Identifier les opportunités de carrière pertinentes
**Responsabilités**:
- Analyse des opportunités du marché
- Filtrage selon le profil candidat
- Priorisation des opportunités
**Ce qu'elle ne fait pas**:
- Ne décide PAS des objectifs
- Ne prend PAS de décisions
- Ne planifie PAS l'exécution
**Sources autorisées**:
- CandidateGraph
- Market Intelligence
- External job boards
**Moteurs consommés**:
- Market Intelligence
**Moteurs qui la consomment**:
- Decision Intelligence
- Adaptive Strategy Intelligence
**Événements Timeline produits**:
- `opportunity_identified`, `opportunity_prioritized`, `opportunity_discarded`
**Contexte ajouté au Digital Twin**:
- `opportunityContext`
**Widget Dashboard associé**:
- Non spécifique (intégré dans autres widgets)
**Prompt IA utilisé**:
- `career-copilot-opportunity-intelligence-v1.ts`

---

### 8. Market Intelligence
**Nom**: `CareerCopilotMarketIntelligenceEngine`
**Objectif unique**: Analyser le marché de l'emploi et les tendances
**Responsabilités**:
- Analyse des tendances du marché
- Analyse de la demande par compétence
- Analyse de la concurrence
- Analyse des salaires
**Ce qu'elle ne fait pas**:
- Ne décide PAS des objectifs
- Ne prend PAS de décisions
- Ne planifie PAS l'exécution
**Sources autorisées**:
- CandidateGraph
- External market data
- Industry reports
**Moteurs consommés**:
- Aucun (moteur de base)
**Moteurs qui la consomment**:
- Decision Intelligence
- Adaptive Strategy Intelligence
- Opportunity Intelligence
- Forecast Intelligence
**Événements Timeline produits**:
- `market_analyzed`, `trend_identified`, `demand_changed`
**Contexte ajouté au Digital Twin**:
- `marketContext`
**Widget Dashboard associé**:
- Non spécifique (intégré dans autres widgets)
**Prompt IA utilisé**:
- `career-copilot-market-intelligence-v1.ts`

---

### 9. Constraint Intelligence
**Nom**: `CareerCopilotConstraintIntelligenceEngine`
**Objectif unique**: Identifier et gérer les contraintes du candidat
**Responsabilités**:
- Identification des contraintes (temps, budget, géographie, etc.)
- Évaluation de l'impact des contraintes
- Proposition de solutions pour contourner les contraintes
**Ce qu'elle ne fait pas**:
- Ne décide PAS des objectifs
- Ne prend PAS de décisions
- Ne planifie PAS l'exécution
**Sources autorisées**:
- CandidateGraph
- User input
**Moteurs consommés**:
- Aucun (moteur de base)
**Moteurs qui la consomment**:
- Decision Intelligence
- Adaptive Strategy Intelligence
- Planning Intelligence
**Événements Timeline produits**:
- `constraint_detected`, `constraint_confirmed`, `constraint_lifted`, `constraint_modified`
**Contexte ajouté au Digital Twin**:
- `constraintContext`
**Widget Dashboard associé**:
- Non spécifique (intégré dans autres widgets)
**Prompt IA utilisé**:
- `career-copilot-constraint-intelligence-v1.ts`

---

### 10. Resource Intelligence
**Nom**: `CareerCopilotResourceIntelligenceEngine`
**Objectif unique**: Analyser les ressources disponibles du candidat
**Responsabilités**:
- Identification des ressources (temps, budget, compétences, réseau)
- Évaluation de la disponibilité des ressources
- Optimisation de l'utilisation des ressources
**Ce qu'elle ne fait pas**:
- Ne décide PAS des objectifs
- Ne prend PAS de décisions
- Ne planifie PAS l'exécution
**Sources autorisées**:
- CandidateGraph
- User input
**Moteurs consommés**:
- Aucun (moteur de base)
**Moteurs qui la consomment**:
- Decision Intelligence
- Planning Intelligence
**Événements Timeline produits**:
- `resource_added`, `resource_lost`, `resource_critical`, `resource_optimized`, `resource_available`, `resource_exhausted`, `resource_invested`, `resource_saved`, `resource_reallocated`
**Contexte ajouté au Digital Twin**:
- `resourceContext`
**Widget Dashboard associé**:
- Non spécifique (intégré dans autres widgets)
**Prompt IA utilisé**:
- `career-copilot-resource-intelligence-v1.ts`

---

### 11. Narrative Intelligence
**Nom**: `CareerCopilotCareerNarrativeIntelligenceEngine`
**Objectif unique**: Construire la narrative de carrière du candidat
**Responsabilités**:
- Construction de l'identité de carrière
- Création de l'histoire de carrière
- Explication des transitions de carrière
- Validation de la cohérence narrative
**Ce qu'elle ne fait pas**:
- Ne décide PAS des objectifs
- Ne prend PAS de décisions
- Ne planifie PAS l'exécution
**Sources autorisées**:
- CandidateGraph (source principale)
- Knowledge Evolution Intelligence
**Moteurs consommés**:
- Knowledge Evolution Intelligence
**Moteurs qui la consomment**:
- Reflection Intelligence
- Planning Intelligence
**Événements Timeline produits**:
- `career_story_updated`, `narrative_improved`, `career_identity_updated`, `career_transition_explained`, `narrative_confidence_updated`, `narrative_fingerprint_updated`, `narrative_consistency_updated`, `narrative_evolution_detected`, `narrative_evidence_updated`
**Contexte ajouté au Digital Twin**:
- `careerNarrativeContext`
**Widget Dashboard associé**:
- `career-narrative-intelligence.tsx`
**Prompt IA utilisé**:
- `career-copilot-career-narrative-intelligence-v1.ts`

---

### 12. Mission Intelligence
**Nom**: `CareerCopilotMissionIntelligenceEngine`
**Objectif unique**: Définir et suivre les missions de carrière
**Responsabilités**:
- Définition de missions basées sur les objectifs
- Suivi de la progression des missions
- Adaptation des missions au contexte
**Ce qu'elle ne fait pas**:
- Ne définit PAS les objectifs (utilise Goal Intelligence)
- Ne planifie PAS l'exécution
**Sources autorisées**:
- CandidateGraph
- Goal Intelligence
**Moteurs consommés**:
- Goal Intelligence
**Moteurs qui la consomment**:
- Planning Intelligence
- Accountability Intelligence
**Événements Timeline produits**:
- `mission_created`, `mission_revised`, `milestone_reached`, `phase_completed`, `new_phase`, `deviation_detected`, `mission_accelerated`, `mission_delayed`, `mission_completed`
**Contexte ajouté au Digital Twin**:
- `missionContext`
**Widget Dashboard associé**:
- Non spécifique (intégré dans autres widgets)
**Prompt IA utilisé**:
- `career-copilot-mission-intelligence-v1.ts`

---

### 13. Knowledge Evolution Intelligence
**Nom**: `CareerCopilotKnowledgeEvolutionEngine`
**Objectif unique**: Évoluer et valider les connaissances sur le candidat
**Responsabilités**:
- Validation des connaissances
- Évolution des connaissances (confirmation, renforcement, obsolescence)
- Identification des connaissances incertaines
**Ce qu'elle ne fait pas**:
- Ne décide PAS des objectifs
- Ne prend PAS de décisions
- Ne planifie PAS l'exécution
**Sources autorisées**:
- CandidateGraph
- EventBus (observations)
**Moteurs consommés**:
- Aucun (moteur de base)
**Moteurs qui la consomment**:
- Narrative Intelligence
- Reflection Intelligence
- Planning Intelligence
**Événements Timeline produits**:
- `knowledge_confirmed`, `knowledge_strengthened`, `knowledge_weakened`, `knowledge_obsolete`, `knowledge_replaced`, `knowledge_created`, `knowledge_unused`, `knowledge_critical`, `knowledge_refreshed`, `knowledge_reviewed`
**Contexte ajouté au Digital Twin**:
- `knowledgeEvolutionContext`
**Widget Dashboard associé**:
- `knowledge-evolution.tsx`
**Prompt IA utilisé**:
- `career-copilot-knowledge-evolution-v1.ts`

---

### 14. Scenario Intelligence
**Nom**: `CareerCopilotScenarioIntelligenceEngine`
**Objectif unique**: Générer et analyser des scénarios de carrière
**Responsabilités**:
- Génération de scénarios alternatifs
- Analyse des probabilités de scénarios
- Évaluation des impacts de scénarios
**Ce qu'elle ne fait pas**:
- Ne prend PAS de décisions
- Ne planifie PAS l'exécution
- Ne garantit PAS les résultats
**Sources autorisées**:
- CandidateGraph
- Market Intelligence
- Forecast Intelligence
**Moteurs consommés**:
- Market Intelligence
- Forecast Intelligence
**Moteurs qui la consomment**:
- Decision Intelligence
- Planning Intelligence
- Reflection Intelligence
**Événements Timeline produits**:
- `scenario_generated`, `scenario_updated`, `probability_changed`
**Contexte ajouté au Digital Twin**:
- `scenarioContext`
**Widget Dashboard associé**:
- Non spécifique (intégré dans autres widgets)
**Prompt IA utilisé**:
- `career-copilot-scenario-intelligence-v1.ts`

---

### 15. Outcome Intelligence
**Nom**: `CareerCopilotOutcomeIntelligenceEngine`
**Objectif unique**: Analyser les résultats et outcomes des actions
**Responsabilités**:
- Analyse des résultats des actions
- Identification des patterns de succès/échec
- Calcul du taux de succès
**Ce qu'elle ne fait pas**:
- Ne décide PAS des objectifs
- Ne prend PAS de décisions
- Ne planifie PAS l'exécution
**Sources autorisées**:
- CandidateGraph
- EventBus (observations)
**Moteurs consommés**:
- Aucun (moteur de base)
**Moteurs qui la consomment**:
- Reflection Intelligence
- Planning Intelligence
- Success Intelligence
**Événements Timeline produits**:
- `outcome_analyzed`, `success_identified`, `failure_identified`, `pattern_detected`
**Contexte ajouté au Digital Twin**:
- `outcomeContext`
**Widget Dashboard associé**:
- Non spécifique (intégré dans autres widgets)
**Prompt IA utilisé**:
- `career-copilot-outcome-intelligence-v1.ts`

---

### 16. Success Intelligence
**Nom**: `CareerCopilotSuccessIntelligenceEngine`
**Objectif unique**: Identifier les facteurs de succès
**Responsabilités**:
- Identification des facteurs de succès
- Analyse des patterns de succès
- Prédiction des facteurs de succès futurs
**Ce qu'elle ne fait pas**:
- Ne décide PAS des objectifs
- Ne prend PAS de décisions
- Ne planifie PAS l'exécution
**Sources autorisées**:
- CandidateGraph
- Outcome Intelligence
**Moteurs consommés**:
- Outcome Intelligence
**Moteurs qui la consomment**:
- Decision Intelligence
- Planning Intelligence
**Événements Timeline produits**:
- `success_factor_identified`, `success_pattern_detected`, `success_predictor_identified`
**Contexte ajouté au Digital Twin**:
- `successContext`
**Widget Dashboard associé**:
- Non spécifique (intégré dans autres widgets)
**Prompt IA utilisé**:
- `career-copilot-success-intelligence-v1.ts`

---

### 17. Accountability Intelligence
**Nom**: `CareerCopilotAccountabilityIntelligenceEngine`
**Objectif unique**: Suivre les engagements et la responsabilisation
**Responsabilités**:
- Suivi des engagements
- Mesure de la responsabilisation
- Analyse de la progression vers les engagements
**Ce qu'elle ne fait pas**:
- Ne décide PAS des objectifs
- Ne prend PAS de décisions
- Ne planifie PAS l'exécution
**Sources autorisées**:
- CandidateGraph
- Goal Intelligence
- Mission Intelligence
**Moteurs consommés**:
- Goal Intelligence
- Mission Intelligence
**Moteurs qui la consomment**:
- Planning Intelligence
- Execution Intelligence (à venir)
**Événements Timeline produits**:
- `commitment_made`, `commitment_kept`, `commitment_broken`, `accountability_score_updated`
**Contexte ajouté au Digital Twin**:
- `accountabilityContext`
**Widget Dashboard associé**:
- Non spécifique (intégré dans autres widgets)
**Prompt IA utilisé**:
- `career-copilot-accountability-intelligence-v1.ts`

---

## Résumé des Intelligences

### Par Phase de la Roadmap

**Phase 1: Fondations**
- Aucune intelligence (infrastructure uniquement)

**Phase 2: Analyses**
- Market Intelligence
- Constraint Intelligence
- Resource Intelligence
- Opportunity Intelligence

**Phase 3: Raisonnement**
- Goal Intelligence
- Decision Intelligence
- Adaptive Strategy Intelligence
- Forecast Intelligence (Scenario Intelligence)

**Phase 4: Métacognition**
- Reflection Intelligence

**Phase 5: Planification**
- Planning Intelligence

**Phase 6: Exécution**
- Outcome Intelligence
- Success Intelligence
- Accountability Intelligence

**Phase 7: Coaching Continu**
- À venir

**Phase 8: Autonomie**
- À venir

### Par Responsabilité

**Définition d'objectifs**: Goal Intelligence, Mission Intelligence
**Prise de décisions**: Decision Intelligence, Adaptive Strategy Intelligence
**Analyse du marché**: Market Intelligence, Opportunity Intelligence
**Gestion des contraintes**: Constraint Intelligence, Resource Intelligence
**Narrative**: Narrative Intelligence, Knowledge Evolution Intelligence
**Prédiction**: Forecast Intelligence, Scenario Intelligence
**Réflexion**: Reflection Intelligence
**Planification**: Planning Intelligence
**Suivi**: Outcome Intelligence, Success Intelligence, Accountability Intelligence

---

## Règles de Création de Nouvelles Intelligences

1. **Vérifier la duplication**: Avant de créer une nouvelle intelligence, vérifier si la responsabilité existe déjà dans ce registre
2. **Respecter la roadmap**: La nouvelle intelligence doit s'inscrire dans la phase actuelle de la roadmap
3. **Respecter l'architecture**: La nouvelle intelligence doit respecter les contraintes architecturales immuables
4. **Documenter complètement**: Ajouter l'intelligence à ce registre avec tous les champs requis
5. **Intégrer correctement**: Intégrer l'intelligence dans le pipeline, Dashboard, Timeline, Digital Twin, et Chat

---

**Document maintenu par**: Devin.ai
**Dernière mise à jour**: Après Sprint 54
**Version**: 1.0
**Total d'intelligences**: 17
