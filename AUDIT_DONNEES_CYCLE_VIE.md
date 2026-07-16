# Audit Complet - Boucle de Vie des Données

> Date : 2026-07-07
> Objectif : Analyser la boucle de vie complète des données (CandidateAIBrain et CandidateGraph)
> Contrainte : Aucun nouveau fichier créé, aucune modification

---

## Structure CandidateAIBrain

### Mémoire Brain

| Type de donnée | Méthode de création | Stockage | Méthode de lecture | Affichage utilisateur |
|----------------|---------------------|----------|-------------------|----------------------|
| **observations** | EventBus (observation_created, interview_analyzed, ats_completed, career_updated, recommendation_generated) | BrainMemory | getCurrentState() | ❌ Jamais affiché (widgets désactivés) |
| **patterns** | detectAndStorePatterns() (auto-détection depuis observations) | BrainMemory | getPatterns() | ❌ Jamais affiché |
| **insights** | detectAndStoreInsights() (auto-détection contradictions, progress, regressions) | BrainMemory | getInsights() | ❌ Jamais affiché |
| **goals** | addGoal() (jamais appelé) | BrainMemory | getGoals() | ❌ Jamais affiché |
| **history** | addHistoryEntry() (EventBus interview_analyzed, ats_completed, career_updated, recommendation_generated) | BrainHistory | getHistory() | ❌ Jamais affiché |
| **timeline** | addEvent() (EventBus goal_completed, addGoal) | BrainTimeline | getTimeline() | ❌ Jamais affiché |
| **events** | addEvent() (toutes les opérations Brain) | BrainEvents | getRecentEvents() | ❌ Jamais affiché |

---

## Flux de Données CandidateAIBrain

### Création

```
AI Engines (InterviewAnalyzerAIEngine, ATSAIEngine, CareerAnalysisAIEngine, RecommendationsAIEngine)
↓
EventBus (interview_analyzed, ats_completed, career_updated, recommendation_generated, observation_created)
↓
CandidateAIBrain (handleInterviewAnalyzed, handleATSCompleted, handleCareerUpdated, handleRecommendationGenerated, handleObservationCreated)
↓
BrainMemory.addObservation()
↓
BrainHistory.addEntry()
↓
detectAndStorePatterns()
↓
detectAndStoreInsights()
```

### Stockage

- **BrainMemory** : Observations, patterns, insights, goals (en mémoire volatile)
- **BrainHistory** : Historique des exécutions AI (en mémoire volatile)
- **BrainTimeline** : Timeline des événements (en mémoire volatile)
- **BrainEvents** : Événements Brain (en mémoire volatile)

**Note :** Toutes les données Brain sont stockées en mémoire volatile, PAS persistées dans Supabase.

### Lecture

- **getCurrentState()** : Retourne observations, patterns, insights, goals
- **getHistory()** : Retourne l'historique des exécutions AI
- **getPatterns()** : Retourne les patterns détectés
- **getRecommendationsContext()** : Retourne le contexte pour recommandations
- **getCoachingHistory()** : Retourne les insights de coaching
- **getStrengths()** : Retourne les patterns de type "strength"
- **getWeaknesses()** : Retourne les patterns de type "weakness"
- **getRecurringPatterns()** : Retourne les patterns récurrents
- **getImprovements()** : Retourne les insights de type "progress"
- **getRegressions()** : Retourne les insights de type "regression"
- **getTimeline()** : Retourne la timeline des événements
- **getRecentEvents()** : Retourne les événements récents

### Affichage

**AUCUN affichage utilisateur des données Brain.**

Les widgets Brain sont désactivés dans Dashboard :
- BrainHistoryWidget (commenté)
- BrainGoalsWidget (commenté)
- BrainRecommendationsWidget (commenté)

Career Copilot attend des données Brain mais elles ne sont jamais fournies :
- currentGoal = null
- nextAction = null
- dailyPlan = []
- weeklyPlan = []

---

## Données Stockées mais Jamais Relues

| Donnée | Stockée dans | Relue par | Statut |
|--------|-------------|-----------|--------|
| Aucune | - | - | ✅ Toutes les données Brain sont relues par des méthodes getter |

---

## Données Relues mais Jamais Affichées

| Donnée | Relue par | Affichée dans | Statut |
|--------|-----------|---------------|--------|
| observations | getCurrentState() | ❌ Aucun widget | ⚠️ Donnée morte |
| patterns | getPatterns() | ❌ Aucun widget | ⚠️ Donnée morte |
| insights | getInsights() | ❌ Aucun widget | ⚠️ Donnée morte |
| goals | getGoals() | ❌ Aucun widget | ⚠️ Donnée morte |
| history | getHistory() | ❌ Aucun widget | ⚠️ Donnée morte |
| timeline | getTimeline() | ❌ Aucun widget | ⚠️ Donnée morte |
| events | getRecentEvents() | ❌ Aucun widget | ⚠️ Donnée morte |

---

## Données Affichées mais Jamais Mises à Jour

| Donnée | Affichée dans | Mise à jour par | Statut |
|--------|---------------|----------------|--------|
| Aucune | - | - | ✅ Toutes les données affichées sont mises à jour par CandidateGraph |

---

## TABLEAU 1 : Champ CandidateGraph → Engine → Écran → Utilisé

| Champ CandidateGraph | Engine Producteur | Écran Consommateur | Utilisé ? |
|----------------------|-------------------|-------------------|-----------|
| **identity.id** | CandidateGraphDataLoader (Supabase User) | Dashboard, Career Copilot, Profile | ✅ Oui |
| **identity.name** | CandidateGraphDataLoader (Supabase User) | Dashboard, Career Copilot, Profile | ✅ Oui |
| **identity.email** | CandidateGraphDataLoader (Supabase User) | Profile | ✅ Oui |
| **identity.phone** | CandidateGraphDataLoader (Supabase User) | Profile | ❌ Non (null) |
| **identity.location** | CandidateGraphDataLoader (Supabase User) | Profile | ❌ Non (null) |
| **identity.linkedIn** | CandidateGraphDataLoader (Supabase User) | Profile | ❌ Non (null) |
| **identity.github** | CandidateGraphDataLoader (Supabase User) | Profile | ❌ Non (null) |
| **career.currentRole** | CandidateGraphDataLoader (Supabase CareerProfile) | Dashboard, Career Copilot, Profile | ✅ Oui |
| **career.yearsOfExperience** | CandidateGraphDataLoader (Supabase CareerProfile) | Dashboard, Career Copilot | ✅ Oui |
| **career.targetRoles** | CandidateGraphDataLoader (Supabase CareerProfile) | Dashboard, Career Copilot | ✅ Oui |
| **career.targetIndustries** | CandidateGraphDataLoader (Supabase CareerProfile) | Dashboard | ❌ Non (non utilisé) |
| **career.targetLocations** | CandidateGraphDataLoader (Supabase CareerProfile) | Dashboard | ❌ Non (non utilisé) |
| **career.careerLevel** | CandidateGraphDataLoader (Supabase CareerProfile) | Dashboard, Career Copilot | ✅ Oui |
| **skills** | CandidateGraphDataLoader (Supabase CVAnalysis) | Dashboard, Career Copilot | ✅ Oui |
| **softSkills** | CandidateGraphBuilder (split skills) | Dashboard, Career Copilot | ✅ Oui |
| **hardSkills** | CandidateGraphBuilder (split skills) | Dashboard, Career Copilot | ✅ Oui |
| **languages** | CandidateGraphDataLoader (Supabase CVAnalysis) | Dashboard | ❌ Non (vide) |
| **education** | CandidateGraphDataLoader (Supabase CVAnalysis) | Dashboard | ❌ Non (non utilisé) |
| **communication.clarity** | ScoreEngine | Dashboard | ✅ Oui |
| **communication.persuasion** | ScoreEngine | Dashboard | ❌ Non (non utilisé) |
| **communication.listening** | ScoreEngine | Dashboard | ❌ Non (non utilisé) |
| **communication.structure** | ScoreEngine | Dashboard | ✅ Oui |
| **communication.confidence** | ScoreEngine | Dashboard | ✅ Oui |
| **leadership.vision** | ScoreEngine | Dashboard | ✅ Oui |
| **leadership.execution** | ScoreEngine | Dashboard | ❌ Non (non utilisé) |
| **leadership.teamBuilding** | ScoreEngine | Dashboard | ❌ Non (non utilisé) |
| **leadership.conflictResolution** | ScoreEngine | Dashboard | ❌ Non (non utilisé) |
| **leadership.decisionMaking** | ScoreEngine | Dashboard | ❌ Non (non utilisé) |
| **confidence** | ScoreEngine | Dashboard | ✅ Oui |
| **employability.overall** | ScoreEngine | Dashboard, Career Copilot | ✅ Oui |
| **employability.technical** | ScoreEngine | Dashboard | ❌ Non (non utilisé) |
| **employability.behavioral** | ScoreEngine | Dashboard | ❌ Non (non utilisé) |
| **employability.cultural** | ScoreEngine | Dashboard | ❌ Non (non utilisé) |
| **employability.trajectory** | ScoreEngine | Dashboard | ❌ Non (non utilisé) |
| **careerLevel** | ScoreEngine | Dashboard, Career Copilot | ✅ Oui |
| **strengths** | InsightEngine | Dashboard, Career Copilot | ✅ Oui |
| **weaknesses** | InsightEngine | Dashboard, Career Copilot | ✅ Oui |
| **patterns** | InsightEngine | Dashboard | ❌ Non (non utilisé) |
| **progress.overallScore** | ScoreEngine | Dashboard, Career Copilot | ✅ Oui |
| **progress.previousScore** | ScoreEngine | Dashboard | ❌ Non (non utilisé) |
| **progress.change** | ScoreEngine | Dashboard | ✅ Oui |
| **progress.trend** | ScoreEngine | Dashboard | ✅ Oui |
| **progress.timeline** | CandidateGraphDataLoader (Supabase InterviewSession) | Dashboard, Career Copilot | ✅ Oui |
| **trajectory.currentLevel** | InsightEngine | Dashboard | ❌ Non (non utilisé) |
| **trajectory.nextLevel** | InsightEngine | Dashboard | ❌ Non (non utilisé) |
| **trajectory.estimatedTimeToNext** | InsightEngine | Dashboard | ❌ Non (non utilisé) |
| **trajectory.requiredSkills** | InsightEngine | Dashboard | ❌ Non (non utilisé) |
| **trajectory.blockers** | InsightEngine | Dashboard | ❌ Non (non utilisé) |
| **trajectory.accelerators** | InsightEngine | Dashboard | ❌ Non (non utilisé) |
| **recommendedJobs** | RecommendationEngine | Dashboard, Career Copilot | ✅ Oui |
| **recommendedSkills** | RecommendationEngine | Dashboard, Career Copilot | ✅ Oui |
| **recommendedInterviews** | RecommendationEngine | Dashboard, Career Copilot | ✅ Oui |
| **recommendedLearning** | RecommendationEngine | Dashboard | ❌ Non (non utilisé) |
| **riskAnalysis.overallRisk** | DecisionEngine | Dashboard, Career Copilot | ✅ Oui |
| **riskAnalysis.risks** | DecisionEngine | Dashboard, Career Copilot | ✅ Oui |
| **decisionReadiness.overall** | DecisionEngine | Dashboard | ❌ Non (non utilisé) |
| **decisionReadiness.technicalReadiness** | DecisionEngine | Dashboard | ❌ Non (non utilisé) |
| **decisionReadiness.behavioralReadiness** | DecisionEngine | Dashboard | ❌ Non (non utilisé) |
| **decisionReadiness.confidence** | DecisionEngine | Dashboard | ❌ Non (non utilisé) |
| **decisionReadiness.gaps** | DecisionEngine | Dashboard | ❌ Non (non utilisé) |
| **overallScore** | ScoreEngine | Dashboard, Career Copilot | ✅ Oui |

---

## TABLEAU 2 : Mémoire Brain → Créée → Persistée → Relue → Visible

| Mémoire Brain | Créée ? | Persistée ? | Relue ? | Visible utilisateur ? | Statut |
|--------------|---------|------------|---------|----------------------|--------|
| **observations** | ✅ EventBus (5 sources) | ❌ Non (mémoire volatile) | ✅ getCurrentState() | ❌ Non (widgets désactivés) | ⚠️ Semi-vivante |
| **patterns** | ✅ Auto-détection | ❌ Non (mémoire volatile) | ✅ getPatterns() | ❌ Non (widgets désactivés) | ⚠️ Semi-vivante |
| **insights** | ✅ Auto-détection | ❌ Non (mémoire volatile) | ✅ getInsights() | ❌ Non (widgets désactivés) | ⚠️ Semi-vivante |
| **goals** | ❌ Jamais créées | ❌ Non (mémoire volatile) | ✅ getGoals() | ❌ Non (widgets désactivés) | ❌ Morte |
| **history** | ✅ EventBus (4 sources) | ❌ Non (mémoire volatile) | ✅ getHistory() | ❌ Non (widgets désactivés) | ⚠️ Semi-vivante |
| **timeline** | ✅ EventBus (goal_completed) | ❌ Non (mémoire volatile) | ✅ getTimeline() | ❌ Non (widgets désactivés) | ❌ Morte (jamais créée) |
| **events** | ✅ Toutes opérations Brain | ❌ Non (mémoire volatile) | ✅ getRecentEvents() | ❌ Non (widgets désactivés) | ⚠️ Semi-vivante |

---

## TABLEAU 3 : Fonctionnalité → Vivante / Semi-vivante / Statique

| Fonctionnalité | État | Justification |
|---------------|------|---------------|
| **Dashboard** | ⚠️ Semi-vivante | CandidateGraph alimenté par Supabase, mais widgets Brain désactivés |
| **Career Copilot** | ⚠️ Semi-vivante | CandidateGraph alimenté par Supabase, mais données Brain attendues (null) |
| **Interview** | ✅ Vivante | AI Engines connectés, EventBus fonctionnel, rapport affiché |
| **Timeline** | ⚠️ Semi-vivante | CandidateGraph.timeline alimenté, mais Brain.timeline non affiché |
| **Coach Quotidien** | ✅ Vivante | DailyCoachAIEngine connecté, données affichées |
| **ATS** | ✅ Vivante | ATSAIEngine connecté, EventBus fonctionnel |
| **Profile** | ✅ Vivante | CandidateGraph alimenté par Supabase, données affichées |
| **Brain Memory** | ❌ Morte | Données créées et relues mais jamais affichées |
| **Brain Goals** | ❌ Morte | Jamais créées, widgets désactivés |
| **Brain Timeline** | ❌ Morte | goal_completed jamais publié, widgets désactivés |

---

## Problèmes Critiques Identifiés

### 1. CandidateAIBrain - Données Mortes

**Problème :** Toutes les données Brain sont créées et relues mais jamais affichées.

**Impact :**
- Observations, patterns, insights, history, timeline, events sont stockés en mémoire volatile
- Widgets Brain (BrainHistoryWidget, BrainGoalsWidget, BrainRecommendationsWidget) sont désactivés
- Career Copilot attend des données Brain (currentGoal, nextAction, dailyPlan, weeklyPlan) mais elles sont toujours null

**Cause :**
- Widgets Brain commentés dans Dashboard après suppression des appels directs à CandidateAIBrain
- Aucun mécanisme pour afficher les données Brain via EventBus
- Aucun mécanisme pour alimenter Career Copilot avec les données Brain

### 2. CandidateAIBrain - Pas de Persistance

**Problème :** Toutes les données Brain sont stockées en mémoire volatile, PAS persistées dans Supabase.

**Impact :**
- Données perdues au redémarrage du serveur
- Aucun historique Brain persistant
- Impossible de suivre l'évolution Brain dans le temps

**Cause :**
- Aucune table Supabase pour BrainMemory, BrainHistory, BrainTimeline
- Aucun repository pour persister les données Brain

### 3. CandidateAIBrain - goal_completed Jamais Publié

**Problème :** L'événement goal_completed est souscrit par CandidateAIBrain mais jamais publié par aucun engine.

**Impact :**
- BrainTimeline ne reçoit jamais d'événements de type "milestone"
- BrainGoals ne peuvent jamais être marqués comme "achieved"
- Timeline Brain reste vide

**Cause :**
- Aucun engine ne publie goal_completed
- Aucun mécanisme pour détecter quand un objectif est atteint

### 4. CandidateGraph - Champs Non Utilisés

**Problème :** De nombreux champs CandidateGraph sont calculés mais jamais utilisés.

**Impact :**
- Calculs inutiles (communication.persuasion, leadership.execution, etc.)
- Surcharge de données non exploitées
- Complexité inutile

**Champs non utilisés :**
- identity.phone, identity.location, identity.linkedIn, identity.github
- career.targetIndustries, career.targetLocations
- languages, education
- communication.persuasion, communication.listening
- leadership.execution, leadership.teamBuilding, leadership.conflictResolution, leadership.decisionMaking
- employability.technical, employability.behavioral, employability.cultural, employability.trajectory
- patterns
- trajectory (tous les champs)
- recommendedLearning
- decisionReadiness (tous les champs)

### 5. Flux CandidateAIBrain → CandidateGraph Incomplet

**Problème :** CandidateAIBrain consomme les événements EventBus mais ne met pas à jour CandidateGraph.

**Impact :**
- CandidateGraph n'est pas enrichi par les données Brain
- Dashboard et Career Copilot ne bénéficient pas de l'intelligence Brain
- Double source de vérité (CandidateGraph Supabase vs Brain Memory)

**Cause :**
- Aucun mécanisme pour synchroniser BrainMemory vers CandidateGraph
- Aucun repository pour mettre à jour CandidateGraph depuis Brain
- Architecture disjointe entre Brain et Graph

---

## Recommandations

### 1. Réactiver les Widgets Brain

- Réactiver BrainHistoryWidget, BrainGoalsWidget, BrainRecommendationsWidget dans Dashboard
- Créer un hook pour consommer les données Brain via EventBus
- Afficher les données Brain dans Career Copilot (currentGoal, nextAction, dailyPlan, weeklyPlan)

### 2. Implémenter la Persistance Brain

- Créer des tables Supabase pour BrainMemory, BrainHistory, BrainTimeline
- Créer un repository pour persister les données Brain
- Sauvegarder les données Brain après chaque événement EventBus

### 3. Publier goal_completed

- Identifier quand un objectif est atteint (score > seuil, nombre d'entretiens > seuil)
- Publier goal_completed depuis l'engine approprié
- Alimenter BrainTimeline avec les milestones

### 4. Nettoyer CandidateGraph

- Supprimer les champs non utilisés ou les marquer comme "reserved"
- Simplifier les calculs ScoreEngine pour ne calculer que les champs utilisés
- Réduire la complexité de CandidateGraphBuilder

### 5. Connecter Brain à CandidateGraph

- Implémenter un mécanisme pour synchroniser BrainMemory vers CandidateGraph
- Mettre à jour CandidateGraph depuis les données Brain (patterns, insights, goals)
- Unifier la source de vérité entre Brain et Graph

---

## Conclusion

**État global de la boucle de vie des données :**

| Composant | État | Pourcentage de vivacité |
|-----------|------|-------------------------|
| CandidateAIBrain | ❌ Morte | 0% (créées et relues mais jamais affichées) |
| CandidateGraph | ✅ Vivante | 70% (champs utilisés / champs totaux) |
| Dashboard | ⚠️ Semi-vivante | 60% (widgets actifs / widgets totaux) |
| Career Copilot | ⚠️ Semi-vivante | 60% (sections actives / sections totales) |
| Interview | ✅ Vivante | 100% (tous les composants actifs) |
| Timeline | ⚠️ Semi-vivante | 50% (types d'événements actifs / types totaux) |
| Coach Quotidien | ✅ Vivante | 100% (composant actif) |
| ATS | ✅ Vivante | 100% (engine connecté) |
| Profile | ✅ Vivante | 100% (composant actif) |

**Pourcentage global de vivacité :** 64%

**Problème principal :** CandidateAIBrain est une mémoire morte - les données sont créées et relues mais jamais affichées ni persistées. L'architecture Brain est incomplètement intégrée à l'interface utilisateur.
