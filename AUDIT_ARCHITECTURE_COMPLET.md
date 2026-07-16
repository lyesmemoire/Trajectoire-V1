# AUDIT ARCHITECTURE COMPLET

## Objectif

Audit complet des connexions entre tous les composants de l'architecture pour identifier:
- Fonctionnalités réellement utilisées
- Code mort et inutilisé
- Prompts IA jamais appelés
- Engines jamais exécutés
- Événements jamais publiés/écoutés
- Imports morts
- Types morts

---

## 1. CANDIDATEGRAPH

### Fichiers
- `core/intelligence/profile/CandidateGraphDataLoader.ts`
- `core/intelligence/profile/CandidateGraphBuilder.ts`
- `core/intelligence/profile/CandidateIntelligenceGraph.ts`

### Connexions
**Consomme:**
- Supabase tables: User, CareerProfile, CVAnalysis, InterviewSession

**Produit:**
- CandidateGraph (profil candidat complet)

**Utilisé par:**
- `app/dashboard/page.tsx` - Dashboard principal
- `app/dashboard/career-copilot/page.tsx` - Career Copilot
- `app/dashboard/profile/page.tsx` - Page profil

**Objets mis à jour:**
- Aucun (lecture uniquement)

---

## 2. CANDIDATEAIBRAIN

### Fichiers
- `core/ai/brain/CandidateAIBrain.ts`
- `core/ai/brain/BrainMemory.ts`
- `core/ai/brain/BrainEvents.ts`
- `core/ai/brain/BrainHistory.ts`
- `core/ai/brain/BrainTimeline.ts`
- `core/ai/brain/BrainPatterns.ts`

### Connexions
**Consomme:**
- EventBus (s'abonne aux événements)

**Produit:**
- État cerveau (observations, patterns, insights, goals)
- Historique IA
- Timeline événements

**Utilisé par:**
- `app/dashboard/page.tsx` - Dashboard (brainState, brainEvents)
- `app/dashboard/career-copilot/page.tsx` - Career Copilot (brainState, brainInsights, brainGoals)

**Informations mémorisées:**
- Observations depuis engines IA
- Patterns détectés
- Insights générés
- Goals créés
- Historique exécutions IA

**Événements EventBus écoutés:**
- `observation_created` - ✅ Écoute
- `interview_analyzed` - ✅ Écoute
- `ats_completed` - ✅ Écoute
- `career_updated` - ✅ Écoute
- `recommendation_generated` - ✅ Écoute
- `goal_completed` - ✅ Écoute

---

## 3. AIORCHESTRATOR

### Fichiers
- `core/ai/AIOrchestrator.ts`
- `core/ai/AIProvider.ts`
- `core/ai/OpenAIProvider.ts`
- `core/ai/AnthropicProvider.ts`
- `core/ai/MockProvider.ts`

### Connexions
**Consomme:**
- Prompt templates
- AI Providers (OpenAI, Anthropic, Mock)

**Produit:**
- Résultats IA structurés
- Métriques (latence, coût, tokens)

**Utilisé par:**
- `core/intelligence/engines/interviewAnalyzerAIEngine.ts`
- `core/intelligence/engines/atsAIEngine.ts`
- `core/intelligence/engines/careerAnalysisAIEngine.ts`
- `core/intelligence/engines/recommendationsAIEngine.ts`
- `core/intelligence/engines/actionPlanAIEngine.ts`
- `core/intelligence/engines/dailyCoachAIEngine.ts`
- `core/intelligence/engines/decisionEstimationAIEngine.ts`
- `core/intelligence/engines/executiveSummaryAIEngine.ts`
- `core/intelligence/engines/recruiterNotesAIEngine.ts`
- `core/intelligence/engines/recruiterQuestionAIEngine.ts`

**Providers AI:**
- OpenAI - ✅ Disponible
- Anthropic - ✅ Disponible
- Mock - ✅ Disponible

---

## 4. EVENTBUS

### Fichiers
- `core/ai/events/EventBus.ts`
- `core/ai/events/BrainEvents.ts`

### Connexions
**Événements publiés (par engines):**
- `ats_completed` - ✅ Publié par atsAIEngine
- `career_updated` - ✅ Publié par careerAnalysisAIEngine
- `interview_analyzed` - ✅ Publié par interviewAnalyzerAIEngine
- `recommendation_generated` - ✅ Publié par recommendationsAIEngine

**Événements écoutés (par CandidateAIBrain):**
- `observation_created` - ✅ Écoute
- `interview_analyzed` - ✅ Écoute
- `ats_completed` - ✅ Écoute
- `career_updated` - ✅ Écoute
- `recommendation_generated` - ✅ Écoute
- `goal_completed` - ✅ Écoute

**Événements jamais publiés:**
- `observation_created` - ❌ Jamais publié
- `goal_completed` - ❌ Jamais publié

---

## 5. INTELLIGENCE ENGINES

### Prompts IA (12 fichiers)

**Utilisés:**
1. `interview-analysis-v1.ts` - ✅ interviewAnalyzerAIEngine
2. `communication-analysis-v1.ts` - ✅ interviewAnalyzerAIEngine
3. `leadership-analysis-v1.ts` - ✅ interviewAnalyzerAIEngine
4. `daily-coach-v1.ts` - ✅ dailyCoachAIEngine
5. `recruiter-question-v1.ts` - ✅ recruiterQuestionAIEngine

**Inutilisés:**
1. `action-plan-v1.ts` - ❌ actionPlanAIEngine jamais appelé
2. `ats-analysis-v1.ts` - ❌ atsAIEngine jamais appelé
3. `career-analysis-v1.ts` - ❌ careerAnalysisAIEngine jamais appelé
4. `decision-estimation-v1.ts` - ❌ decisionEstimationAIEngine jamais appelé
5. `executive-summary-v1.ts` - ❌ executiveSummaryAIEngine jamais appelé
6. `recommendations-v1.ts` - ❌ recommendationsAIEngine jamais appelé
7. `recruiter-notes-v1.ts` - ❌ recruiterNotesAIEngine jamais appelé

### Engines AI (23 fichiers)

**Utilisés dans app/:**
1. `dailyCoachAIEngine.ts` - ✅ dashboard/page.tsx
2. `recruiterQuestionAIEngine.ts` - ✅ interview-simulation/hooks/useInterviewConversation.ts

**Utilisés dans hooks (ancien système):**
1. `insightEngine.ts` - ✅ useInterviewReport.ts
2. `decisionEngine.ts` - ✅ useInterviewReport.ts
3. `scoreEngine.ts` - ✅ useInterviewReport.ts, useInterviewEvaluation.ts
4. `interviewAnalyzerEngine.ts` - ✅ useInterviewReport.ts
5. `coachEngine.ts` - ✅ useInterviewReport.ts
6. `recommendationEngine.ts` - ✅ useInterviewReport.ts

**Jamais utilisés:**
1. `actionPlanAIEngine.ts` - ❌ Jamais appelé
2. `atsAIEngine.ts` - ❌ Jamais appelé
3. `candidateProfile.ts` - ❌ Jamais appelé
4. `careerAnalysisAIEngine.ts` - ❌ Jamais appelé
5. `careerEngine.ts` - ❌ Jamais appelé
6. `decisionEstimationAIEngine.ts` - ❌ Jamais appelé
7. `executiveSummaryAIEngine.ts` - ❌ Jamais appelé
8. `jobAnalyzer.ts` - ❌ Jamais appelé
9. `memoryEngine.ts` - ❌ Jamais appelé
10. `progressEngine.ts` - ❌ Jamais appelé
11. `recruiterNotesAIEngine.ts` - ❌ Jamais appelé
12. `index.ts` - Export file

**Note:** Les engines "ancien système" (insightEngine, decisionEngine, scoreEngine, etc.) sont utilisés dans useInterviewReport.ts mais ne sont PAS migrés vers AIOrchestrator. Ils utilisent des calculs statiques et pas d'IA réelle.

---

## 6. DASHBOARD

### Widgets (22 fichiers)

**Utilisés dans dashboard/page.tsx:**
1. `stats-grid.tsx` - ✅ Utilisé
2. `progress-widget.tsx` - ✅ Utilisé
3. `timeline-widget.tsx` - ✅ Utilisé
4. `quick-actions.tsx` - ✅ Utilisé
5. `live-scores-widget.tsx` - ✅ Utilisé
6. `brain-history-widget.tsx` - ✅ Utilisé
7. `brain-goals-widget.tsx` - ✅ Utilisé
8. `brain-recommendations-widget.tsx` - ✅ Utilisé
9. `strengths-weaknesses-widget.tsx` - ✅ Utilisé
10. `daily-coach-widget.tsx` - ✅ Utilisé
11. `career-timeline-widget.tsx` - ✅ Utilisé

**Jamais utilisés:**
1. `career-score-card.tsx` - ❌ Jamais importé
2. `dashboard-empty.tsx` - ❌ Jamais importé
3. `dashboard-error.tsx` - ❌ Jamais importé
4. `dashboard-skeleton.tsx` - ❌ Jamais importé
5. `goals-widget.tsx` - ❌ Jamais importé
6. `motivation-block.tsx` - ❌ Jamais importé
7. `progress-chart.tsx` - ❌ Jamais importé
8. `skill-radar.tsx` - ❌ Jamais importé

**Utilisés ailleurs:**
1. `dashboard-layout.tsx` - ✅ dashboard/layout.tsx
2. `sidebar.tsx` - ✅ dashboard-layout.tsx
3. `topbar.tsx` - ✅ dashboard-layout.tsx

### Données consommées
- CandidateGraph (profil, progression, scores, forces/faiblesses, recommandations)
- CandidateAIBrain (brainState, brainEvents)
- DailyCoachAIEngine (coach IA quotidien)

### Données produites
- Aucune (lecture uniquement)

---

## 7. INTERVIEW SIMULATION

### Fichiers
- `app/dashboard/interview-simulation/page.tsx`
- `app/dashboard/interview-simulation/hooks/useInterviewConversation.ts`
- `app/dashboard/interview-simulation/hooks/useInterviewReport.ts`
- `app/dashboard/interview-simulation/hooks/useInterviewEvaluation.ts`

### Connexions
**Consomme:**
- RecruiterQuestionAIEngine - ✅ Questions dynamiques
- InsightEngine - ❌ Ancien système (calculs statiques)
- DecisionEngine - ❌ Ancien système (calculs statiques)
- ScoreEngine - ❌ Ancien système (calculs statiques)
- InterviewAnalyzerEngine - ❌ Ancien système (calculs statiques)
- CoachEngine - ❌ Ancien système (calculs statiques)
- RecommendationEngine - ❌ Ancien système (calculs statiques)

**Produit:**
- Rapport entretien (calculs statiques, pas d'IA réelle)
- Questions recruteur (IA réelle via RecruiterQuestionAIEngine)

**Objets CandidateGraph mis à jour:**
- Aucun (pas d'intégration avec CandidateGraph)

**Informations CandidateAIBrain mémorisées:**
- Aucune (pas d'intégration avec CandidateAIBrain)

**Événements EventBus publiés:**
- Aucun (pas d'intégration avec EventBus)

**Prompts IA utilisés:**
- `recruiter-question-v1.ts` - ✅ RecruiterQuestionAIEngine

**Prompts IA non utilisés:**
- `interview-analysis-v1.ts` - ❌ Pas utilisé (ancien système utilise calculs statiques)
- `communication-analysis-v1.ts` - ❌ Pas utilisé
- `leadership-analysis-v1.ts` - ❌ Pas utilisé

---

## 8. CAREER COPILOT

### Fichiers
- `app/dashboard/career-copilot/page.tsx`

### Connexions
**Consomme:**
- CandidateGraph (profil, progression, forces/faiblesses, risques, recommandations)
- CandidateAIBrain (brainState, brainInsights, brainGoals)

**Produit:**
- Aucune (lecture uniquement)

**Objets CandidateGraph mis à jour:**
- Aucun (lecture uniquement)

**Informations CandidateAIBrain mémorisées:**
- Aucune (lecture uniquement)

**Événements EventBus publiés:**
- Aucun

**Prompts IA utilisés:**
- Aucun (lecture uniquement)

---

## 9. ATS

### Fichiers
- `core/intelligence/engines/atsAIEngine.ts`
- `core/ai/Prompts/ats-analysis-v1.ts`

### Connexions
**Consomme:**
- AIOrchestrator
- Prompt ats-analysis-v1

**Produit:**
- Analyse ATS
- Événement `ats_completed` (EventBus)

**Utilisé par:**
- ❌ Aucun (jamais appelé)

**Événements EventBus publiés:**
- `ats_completed` - ✅ Publié mais jamais écouté (car jamais appelé)

**Prompts IA utilisés:**
- `ats-analysis-v1.ts` - ✅ Défini mais jamais appelé

---

## 10. TIMELINE

### Fichiers
- `components/dashboard/career-timeline-widget.tsx`
- `components/dashboard/timeline-widget.tsx`

### Connexions
**Consomme:**
- CandidateGraph (progress.timeline)
- CandidateAIBrain (brainState.goals, brainEvents)

**Produit:**
- Aucune (lecture uniquement)

**Utilisé par:**
- `app/dashboard/page.tsx` - ✅ CareerTimelineWidget
- `app/dashboard/page.tsx` - ✅ TimelineWidget

---

## 11. COACH QUOTIDIEN

### Fichiers
- `core/intelligence/engines/dailyCoachAIEngine.ts`
- `core/ai/Prompts/daily-coach-v1.ts`
- `components/dashboard/daily-coach-widget.tsx`

### Connexions
**Consomme:**
- AIOrchestrator
- Prompt daily-coach-v1
- CandidateGraph (profil, progression, scores, recommandations)
- CandidateAIBrain (brainState, brainEvents)

**Produit:**
- Coach IA quotidien
- Aucun événement EventBus

**Utilisé par:**
- `app/dashboard/page.tsx` - ✅ DailyCoachAIEngine, DailyCoachWidget

**Objets CandidateGraph mis à jour:**
- Aucun (lecture uniquement)

**Informations CandidateAIBrain mémorisées:**
- Aucune (lecture uniquement)

**Événements EventBus publiés:**
- Aucun

**Prompts IA utilisés:**
- `daily-coach-v1.ts` - ✅ Utilisé

---

## MATRICE DÉPENDANCES

### Fonctionnalités vs Composants

| Fonctionnalité | CandidateGraph | CandidateAIBrain | AIOrchestrator | EventBus | Dashboard | Interview Sim | Career Copilot | ATS | Timeline | Coach |
|---|---|---|---|---|---|---|---|---|---|---|
| Dashboard | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ | ✅ |
| Career Copilot | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Interview Sim | ❌ | ❌ | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| ATS | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Timeline | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ |
| Coach Quotidien | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ |

### Prompts IA vs Utilisation

| Prompt | Engine | Utilisé | Où |
|---|---|---|---|
| interview-analysis-v1 | interviewAnalyzerAIEngine | ❌ | Jamais appelé |
| communication-analysis-v1 | interviewAnalyzerAIEngine | ❌ | Jamais appelé |
| leadership-analysis-v1 | interviewAnalyzerAIEngine | ❌ | Jamais appelé |
| daily-coach-v1 | dailyCoachAIEngine | ✅ | dashboard/page.tsx |
| recruiter-question-v1 | recruiterQuestionAIEngine | ✅ | interview-simulation/hooks |
| action-plan-v1 | actionPlanAIEngine | ❌ | Jamais appelé |
| ats-analysis-v1 | atsAIEngine | ❌ | Jamais appelé |
| career-analysis-v1 | careerAnalysisAIEngine | ❌ | Jamais appelé |
| decision-estimation-v1 | decisionEstimationAIEngine | ❌ | Jamais appelé |
| executive-summary-v1 | executiveSummaryAIEngine | ❌ | Jamais appelé |
| recommendations-v1 | recommendationsAIEngine | ❌ | Jamais appelé |
| recruiter-notes-v1 | recruiterNotesAIEngine | ❌ | Jamais appelé |

### Engines AI vs Utilisation

| Engine | Utilisé | Où |
|---|---|---|
| dailyCoachAIEngine | ✅ | dashboard/page.tsx |
| recruiterQuestionAIEngine | ✅ | interview-simulation/hooks |
| insightEngine | ✅ | useInterviewReport.ts (ancien système) |
| decisionEngine | ✅ | useInterviewReport.ts (ancien système) |
| scoreEngine | ✅ | useInterviewReport.ts, useInterviewEvaluation.ts (ancien système) |
| interviewAnalyzerEngine | ✅ | useInterviewReport.ts (ancien système) |
| coachEngine | ✅ | useInterviewReport.ts (ancien système) |
| recommendationEngine | ✅ | useInterviewReport.ts (ancien système) |
| actionPlanAIEngine | ❌ | Jamais appelé |
| atsAIEngine | ❌ | Jamais appelé |
| candidateProfile | ❌ | Jamais appelé |
| careerAnalysisAIEngine | ❌ | Jamais appelé |
| careerEngine | ❌ | Jamais appelé |
| decisionEstimationAIEngine | ❌ | Jamais appelé |
| executiveSummaryAIEngine | ❌ | Jamais appelé |
| jobAnalyzer | ❌ | Jamais appelé |
| memoryEngine | ❌ | Jamais appelé |
| progressEngine | ❌ | Jamais appelé |
| recruiterNotesAIEngine | ❌ | Jamais appelé |

### Événements EventBus

| Événement | Publié par | Écouté par | Statut |
|---|---|---|---|
| observation_created | ❌ Jamais | CandidateAIBrain | ❌ Jamais publié |
| interview_analyzed | interviewAnalyzerAIEngine | CandidateAIBrain | ❌ Engine jamais appelé |
| ats_completed | atsAIEngine | CandidateAIBrain | ❌ Engine jamais appelé |
| career_updated | careerAnalysisAIEngine | CandidateAIBrain | ❌ Engine jamais appelé |
| recommendation_generated | recommendationsAIEngine | CandidateAIBrain | ❌ Engine jamais appelé |
| goal_completed | ❌ Jamais | CandidateAIBrain | ❌ Jamais publié |

---

## CODE MORT ET INUTILISÉ

### Prompts IA morts (7)
1. `action-plan-v1.ts` - Jamais appelé
2. `ats-analysis-v1.ts` - Jamais appelé
3. `career-analysis-v1.ts` - Jamais appelé
4. `decision-estimation-v1.ts` - Jamais appelé
5. `executive-summary-v1.ts` - Jamais appelé
6. `recommendations-v1.ts` - Jamais appelé
7. `recruiter-notes-v1.ts` - Jamais appelé

### Engines AI morts (12)
1. `actionPlanAIEngine.ts` - Jamais appelé
2. `atsAIEngine.ts` - Jamais appelé
3. `candidateProfile.ts` - Jamais appelé
4. `careerAnalysisAIEngine.ts` - Jamais appelé
5. `careerEngine.ts` - Jamais appelé
6. `decisionEstimationAIEngine.ts` - Jamais appelé
7. `executiveSummaryAIEngine.ts` - Jamais appelé
8. `jobAnalyzer.ts` - Jamais appelé
9. `memoryEngine.ts` - Jamais appelé
10. `progressEngine.ts` - Jamais appelé
11. `recruiterNotesAIEngine.ts` - Jamais appelé
12. `index.ts` - Export file

### Widgets Dashboard morts (8)
1. `career-score-card.tsx` - Jamais importé
2. `dashboard-empty.tsx` - Jamais importé
3. `dashboard-error.tsx` - Jamais importé
4. `dashboard-skeleton.tsx` - Jamais importé
5. `goals-widget.tsx` - Jamais importé
6. `motivation-block.tsx` - Jamais importé
7. `progress-chart.tsx` - Jamais importé
8. `skill-radar.tsx` - Jamais importé

### Événements EventBus jamais publiés (2)
1. `observation_created` - Jamais publié
2. `goal_completed` - Jamais publié

### Événements EventBus jamais écoutés (0)
Tous les événements publiés sont écoutés par CandidateAIBrain.

---

## PROBLÈMES IDENTIFIÉS

### 1. Interview Simulation utilise ancien système
- **Problème:** useInterviewReport.ts utilise des engines statiques (insightEngine, decisionEngine, scoreEngine) au lieu de AIOrchestrator
- **Impact:** Pas d'IA réelle pour l'analyse d'entretien, calculs statiques seulement
- **Solution:** Migrer vers interviewAnalyzerAIEngine avec AIOrchestrator

### 2. Engines AI jamais appelés
- **Problème:** 12 engines AI créés mais jamais utilisés
- **Impact:** Code mort, prompts inutilisés, événements jamais publiés
- **Solution:** Intégrer ces engines dans les fonctionnalités correspondantes

### 3. EventBus déconnecté
- **Problème:** CandidateAIBrain écoute des événements qui ne sont jamais publiés
- **Impact:** Brain ne reçoit jamais d'observations depuis engines IA
- **Solution:** Publier les événements depuis les engines utilisés

### 4. Interview Simulation déconnectée de l'architecture
- **Problème:** Interview Simulation ne met pas à jour CandidateGraph ni CandidateAIBrain
- **Impact:** Pas de persistance des résultats d'entretien
- **Solution:** Intégrer avec CandidateGraph et CandidateAIBrain via EventBus

### 5. Widgets Dashboard morts
- **Problème:** 8 widgets créés mais jamais utilisés
- **Impact:** Code mort
- **Solution:** Supprimer ou intégrer

---

## SYNTHÈSE

### Fonctionnalités réellement actives
1. **Dashboard** - ✅ Actif (CandidateGraph + CandidateAIBrain + DailyCoachAIEngine)
2. **Career Copilot** - ✅ Actif (CandidateGraph + CandidateAIBrain)
3. **Interview Simulation** - ⚠️ Partiel (RecruiterQuestionAIEngine actif, analyse statique)
4. **Timeline** - ✅ Actif (CandidateGraph + CandidateAIBrain)
5. **Coach Quotidien** - ✅ Actif (DailyCoachAIEngine)

### Fonctionnalités inactives
1. **ATS** - ❌ Inactif (atsAIEngine jamais appelé)
2. **Career Analysis** - ❌ Inactive (careerAnalysisAIEngine jamais appelé)
3. **Recommendations** - ❌ Inactive (recommendationsAIEngine jamais appelé)
4. **Action Plan** - ❌ Inactive (actionPlanAIEngine jamais appelé)
5. **Executive Summary** - ❌ Inactive (executiveSummaryAIEngine jamais appelé)

### Architecture globale
- **CandidateGraph:** ✅ Actif et utilisé
- **CandidateAIBrain:** ✅ Actif mais déconnecté (pas d'événements reçus)
- **AIOrchestrator:** ✅ Actif mais sous-utilisé (2 engines seulement)
- **EventBus:** ⚠️ Partiel (écoute mais pas de publications)
- **Dashboard:** ✅ Actif
- **Interview Simulation:** ⚠️ Partiel (questions IA actives, analyse statique)
- **Career Copilot:** ✅ Actif
- **Timeline:** ✅ Actif
- **Coach Quotidien:** ✅ Actif
