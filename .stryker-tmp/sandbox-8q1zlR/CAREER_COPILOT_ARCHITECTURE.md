# 🎯 Career Copilot - Architecture & Reference Guide

> Career Intelligence System - Document de référence constitutionnel
> Version: 1.0 (après Sprints 53-54)
> Ce document est la "constitution" du projet Career Copilot. Toute modification architecturale doit respecter ces principes immuables.

---

## Vision du Career Copilot

Le Career Copilot est un système de raisonnement avancé qui accompagne les candidats dans leur développement professionnel. Il ne se contente pas de recommander, mais planifie l'exécution, réfléchit sur ses propres décisions, et s'adapte en permanence aux évolutions du candidat et du marché.

**Vision**: Faire évoluer le Career Copilot d'un système qui "recommande" vers un système qui accompagne l'exécution dans le temps, comme le ferait un conseiller carrière expert.

---

## Contraintes Architecturales Immuables

### 🔴 CONTRAINTES ABSOLUES (JAMAIS VIOLER)

**1. Aucun nouveau composant structurel**
- ❌ JAMAIS créer: Brain, Repository, Provider, Service, Storage, Manager, Graph, Base de données, Table, Pipeline, Cache, Système mémoire, Architecture parallèle
- ✅ Réutiliser exclusivement: AIOrchestrator, CandidateGraph, CandidateAIBrain, EventBus, moteurs existants

**2. CandidateGraph est la source principale**
- ❌ JAMAIS créer de nouvelles sources de données primaires
- ✅ Toutes les données de profil viennent de CandidateGraph
- ✅ Les autres intelligences ne servent qu'à l'enrichissement

**3. Les composants React sont strictement présentationnels**
- ❌ JAMAIS de logique métier dans les composants UI
- ❌ JAMAIS d'appels LLM depuis React
- ✅ Tous les appels AI passent par les moteurs backend

**4. Réutilisation exclusive des composants existants**
- ❌ JAMAIS créer de nouveaux composants du design system
- ✅ Réutiliser les composants existants (Card, Badge, Progress, etc.)

**5. Pipeline d'exécution immuable**
- L'ordre des intelligences dans le pipeline est: Analyse → Décision → Narrative → Réflexion → Planification → Réponse finale
- Toute nouvelle intelligence doit s'intégrer à ce pipeline sans le modifier structurellement

### 🟡 CONTRAINTES FORTEMENT RECOMMANDÉES

**6. Explicabilité obligatoire**
- Chaque conclusion doit être justifiée par des preuves
- Chaque hypothèse doit être explicitée
- Chaque étape de planification doit être expliquée

**7. Adaptabilité continue**
- Le système doit s'adapter automatiquement aux évolutions du contexte
- Les plans doivent être révisables sans intervention manuelle

**8. Réutilisabilité entre intelligences**
- Les méthodes développées doivent pouvoir être réutilisées par d'autres intelligences
- Aucune duplication de logique

---

## Composants Existants et Responsabilités

### 🧠 Core AI Layer

**AIOrchestrator** (`core/ai/AIOrchestrator.ts`)
- Responsabilité: Exécution centralisée des prompts LLM
- Gestion des providers (Anthropic, OpenAI, etc.)
- Gestion des modèles et versions
- Ne contient aucune logique métier

**CandidateAIBrain** (`core/ai/brain/CandidateAIBrain.ts`)
- Responsabilité: Stockage des observations et mémoires
- Alimentation exclusivement via EventBus
- Consultation par les moteurs d'intelligence
- Ne contient aucune logique de raisonnement

**EventBus** (`core/ai/events/EventBus.ts`)
- Responsabilité: Communication asynchrone entre composants
- Publication d'événements par les moteurs
- Abonnement par les composants UI et autres moteurs

### 📊 Profile Layer

**CandidateGraph** (`core/intelligence/profile/`)
- Responsabilité: Représentation structurée du candidat
- Source unique de vérité pour les données de profil
- Construction à partir de données brutes (CV, entretiens, etc.)

**CandidateGraphDataLoader** (`core/intelligence/profile/CandidateGraphDataLoader.ts`)
- Responsabilité: Chargement des données depuis différentes sources
- Normalisation et validation des données

**CandidateGraphBuilder** (`core/intelligence/profile/CandidateGraphBuilder.ts`)
- Responsabilité: Construction du graphe candidat
- Enrichissement avec des calculs et déductions

### 🤖 Intelligence Engines Layer

Chaque moteur d'intelligence a une responsabilité unique et bien définie:

**Goal Intelligence** (`careerCopilotGoalIntelligenceEngine.ts`)
- Responsabilité: Définition et suivi des objectifs de carrière
- Ne décide PAS de la stratégie, seulement des objectifs

**Decision Intelligence** (`careerCopilotDecisionIntelligenceEngine.ts`)
- Responsabilité: Prise de décisions basées sur les objectifs
- Ne définit PAS les objectifs, seulement les décisions

**Adaptive Strategy Intelligence** (`careerCopilotAdaptiveStrategyIntelligenceEngine.ts`)
- Responsabilité: Adaptation de la stratégie en fonction du contexte
- Ne décide PAS des objectifs, seulement la stratégie

**Forecast Intelligence** (`careerCopilotScenarioIntelligenceEngine.ts`)
- Responsabilité: Prédiction des scénarios futurs
- Ne prend PAS de décisions, seulement des prédictions

**Reflection Intelligence** (`careerCopilotReflectionIntelligenceEngine.ts`)
- Responsabilité: Réflexion critique sur les recommandations
- Ne génère PAS de recommandations, seulement les analyse

**Planning Intelligence** (`careerCopilotPlanningIntelligenceEngine.ts`)
- Responsabilité: Transformation des recommandations en plan d'action
- Ne décide PAS des objectifs ni de la stratégie, seulement planifie l'exécution

**Opportunity Intelligence** (`careerCopilotOpportunityIntelligenceEngine.ts`)
- Responsabilité: Identification des opportunités de carrière
- Ne décide PAS des objectifs, seulement identifie les opportunités

**Market Intelligence** (`careerCopilotMarketIntelligenceEngine.ts`)
- Responsabilité: Analyse du marché de l'emploi
- Ne décide PAS des objectifs, seulement informe sur le marché

**Constraint Intelligence** (`careerCopilotConstraintIntelligenceEngine.ts`)
- Responsabilité: Identification et gestion des contraintes
- Ne décide PAS des objectifs, seulement identifie les contraintes

**Resource Intelligence** (`careerCopilotResourceIntelligenceEngine.ts`)
- Responsabilité: Analyse des ressources disponibles
- Ne décide PAS des objectifs, seulement identifie les ressources

**Narrative Intelligence** (`careerCopilotCareerNarrativeIntelligenceEngine.ts`)
- Responsabilité: Construction de la narrative de carrière
- Ne décide PAS des objectifs, seulement raconte l'histoire

**Mission Intelligence** (`careerCopilotMissionIntelligenceEngine.ts`)
- Responsabilité: Définition et suivi des missions
- Ne décide PAS des objectifs, seulement les missions

**Knowledge Evolution Intelligence** (`careerCopilotKnowledgeEvolutionEngine.ts`)
- Responsabilité: Évolution et validation des connaissances
- Ne décide PAS des objectifs, seulement valide les connaissances

**Scenario Intelligence** (`careerCopilotScenarioIntelligenceEngine.ts`)
- Responsabilité: Génération et analyse de scénarios
- Ne décide PAS des objectifs, seulement génère des scénarios

**Outcome Intelligence** (`careerCopilotOutcomeIntelligenceEngine.ts`)
- Responsabilité: Analyse des résultats et outcomes
- Ne décide PAS des objectifs, seulement analyse les résultats

**Success Intelligence** (`careerCopilotSuccessIntelligenceEngine.ts`)
- Responsabilité: Identification des facteurs de succès
- Ne décide PAS des objectifs, seulement identifie les facteurs de succès

**Accountability Intelligence** (`careerCopilotAccountabilityIntelligenceEngine.ts`)
- Responsabilité: Suivi des engagements et responsabilisation
- Ne décide PAS des objectifs, seulement suit les engagements

### 🎨 UI Layer

**Dashboard** (`app/dashboard/career-copilot/page.tsx`)
- Responsabilité: Page principale du Career Copilot
- Strictement présentationnel
- Appelle les moteurs backend pour récupérer les données

**Digital Twin** (`components/dashboard/digital-twin.tsx`)
- Responsabilité: Représentation visuelle du candidat
- Enrichissement de contexte existant (pas de nouveau contexte)

**Timeline** (`components/dashboard/timeline-widget.tsx`)
- Responsabilité: Affichage chronologique des événements
- Réception des événements via EventBus

**Career Copilot Chat** (`components/dashboard/career-copilot-chat.tsx`)
- Responsabilité: Interface conversationnelle
- Extraction de contexte depuis les moteurs pour des réponses enrichies

**Intelligence Widgets** (`components/dashboard/*-intelligence.tsx`)
- Responsabilité: Affichage des résultats de chaque intelligence
- Strictement présentationnel
- Reçoivent les données en props, aucun appel backend

---

## Pipeline Global du Raisonnement

### Ordre d'exécution immuable

```
1. OBSERVATION
   ↓
2. ANALYSE (Goal, Decision, Market, Opportunity, Constraint, Resource)
   ↓
3. NARRATIVE (Mission, Narrative, Knowledge Evolution)
   ↓
4. RÉFLEXION (Reflection Intelligence)
   ↓
5. PLANIFICATION (Planning Intelligence)
   ↓
6. RÉPONSE FINALE (Conversation Engine)
   ↓
7. SUIVI (Accountability, Outcome, Success)
   ↓
8. APPRENTISSAGE (Knowledge Evolution, Scenario)
```

### Description détaillée

**1. OBSERVATION**
- Collecte des données depuis CandidateGraph
- Alimentation de CandidateAIBrain via EventBus
- Aucun raisonnement à ce stade

**2. ANALYSE**
- Goal Intelligence: Définition des objectifs
- Decision Intelligence: Prise de décisions
- Market Intelligence: Analyse du marché
- Opportunity Intelligence: Identification des opportunités
- Constraint Intelligence: Identification des contraintes
- Resource Intelligence: Analyse des ressources

**3. NARRATIVE**
- Mission Intelligence: Définition des missions
- Narrative Intelligence: Construction de la narrative
- Knowledge Evolution Intelligence: Validation des connaissances

**4. RÉFLEXION**
- Reflection Intelligence: Analyse critique des recommandations
- Questionnement des hypothèses
- Détection des angles morts
- Identification des contradictions

**5. PLANIFICATION**
- Planning Intelligence: Transformation en plan d'action
- Définition des jalons
- Priorisation des actions
- Gestion des dépendances

**6. RÉPONSE FINALE**
- Conversation Engine: Génération de la réponse
- Intégration de tous les contextes disponibles
- Explicabilité des décisions

**7. SUIVI**
- Accountability Intelligence: Suivi des engagements
- Outcome Intelligence: Analyse des résultats
- Success Intelligence: Identification des facteurs de succès

**8. APPRENTISSAGE**
- Knowledge Evolution Intelligence: Mise à jour des connaissances
- Scenario Intelligence: Génération de nouveaux scénarios

---

## Conventions de Développement

### 📁 Structure des fichiers

**Prompts**: `core/ai/Prompts/[nom]-v1.ts`
- Format: PromptTemplate avec system, user, variables
- Versionning: v1, v2, etc. pour les évolutions

**Engines**: `core/intelligence/engines/[nom]Engine.ts`
- Classe statique avec méthodes publiques
- Interface d'entrée/sortie TypeScript explicite
- Intégration avec AIOrchestrator et CandidateAIBrain

**Composants UI**: `components/dashboard/[nom].tsx`
- "use client" pour les composants interactifs
- Props typées avec interfaces TypeScript
- Aucune logique métier, uniquement présentation

**Pages**: `app/dashboard/[nom]/page.tsx`
- Server components par défaut
- Appel aux moteurs backend
- Transmission des données aux composants UI

### 🔧 Conventions de code

**TypeScript strict**
- Typage explicite pour toutes les interfaces
- Éviter `any` autant que possible
- Utiliser des types union pour les énumérations

**Gestion des erreurs**
- Try-catch autour des appels aux moteurs
- Logging des erreurs pour le debugging
- Messages d'erreur utilisateur-friendly

**Performance**
- Réutilisation des résultats des intelligences (pas de recalcul)
- Mise en cache des observations dans CandidateAIBrain
- Lazy loading des composants UI

**Tests**
- Tests unitaires pour les moteurs d'intelligence
- Tests d'intégration pour le pipeline
- Tests E2E pour les flux utilisateur critiques

### 🚀 Conventions d'intégration des Sprints

**1. Analyse du besoin**
- Identifier la responsabilité de la nouvelle intelligence
- Vérifier qu'elle ne duplique pas une intelligence existante
- Confirmer qu'elle respecte les contraintes architecturales

**2. Création du Prompt**
- Définir le rôle et les responsabilités clairement
- Spécifier les contraintes et invariants
- Définir la structure de sortie attendue

**3. Création du Engine**
- Implémenter la méthode principale d'exécution
- Intégrer avec AIOrchestrator
- Publier les événements via EventBus
- Stocker les observations dans CandidateAIBrain

**4. Création du Composant UI**
- Composant strictement présentationnel
- Utilisation des composants existants du design system
- Affichage conditionnel basé sur la disponibilité des données

**5. Intégrations**
- Dashboard: Ajout du composant avec animation
- Timeline: Ajout des nouveaux types d'événements
- Digital Twin: Enrichissement du contexte existant
- Chat: Extraction du contexte pour les réponses

**6. Vérifications**
- TypeScript: `npm run typecheck`
- ESLint: `npm run lint`
- Tests: `npm run test`
- Aucune nouvelle erreur introduite

**7. Documentation**
- Rapport de sprint (SPRINT_XX_REPORT.md)
- Mise à jour de ce document si nécessaire

---

## Intelligences Implémentées (État actuel)

### ✅ Sprints complétés

**Sprint 53**: Reflection Intelligence
- Fichiers: `career-copilot-reflection-intelligence-v1.ts`, `careerCopilotReflectionIntelligenceEngine.ts`, `reflection-intelligence.tsx`
- Responsabilité: Réflexion critique sur les recommandations
- Intégrations: Dashboard, Timeline, Digital Twin, Chat

**Sprint 54**: Planning Intelligence
- Fichiers: `career-copilot-planning-intelligence-v1.ts`, `careerCopilotPlanningIntelligenceEngine.ts`, `planning-intelligence.tsx`
- Responsabilité: Transformation des recommandations en plan d'action
- Intégrations: Dashboard, Timeline, Digital Twin, Chat

### 📋 Intelligences existantes (avant Sprints 53-54)

- Goal Intelligence
- Decision Intelligence
- Adaptive Strategy Intelligence
- Forecast Intelligence
- Opportunity Intelligence
- Market Intelligence
- Constraint Intelligence
- Resource Intelligence
- Narrative Intelligence
- Mission Intelligence
- Knowledge Evolution Intelligence
- Scenario Intelligence
- Outcome Intelligence
- Success Intelligence
- Accountability Intelligence

---

## Métriques de Santé

### Qualité du code
- TypeScript strict activé
- ESLint configuré
- Tests unitaires pour les moteurs critiques
- Ratio test/code à maintenir > 0.5

### Performance
- Temps de réponse < 3s pour les intelligences principales
- Mise en cache des observations
- Lazy loading des composants UI

### Maintenabilité
- Documentation à jour (ce document + rapports de sprint)
- Conventions de code respectées
- Architecture stable (pas de changements structurels)

---

## Checklist pour les futurs Sprints

Avant de commencer un nouveau sprint:

- [ ] La nouvelle intelligence ne duplique pas une responsabilité existante
- [ ] La nouvelle intelligence respecte les contraintes architecturales immuables
- [ ] CandidateGraph reste la source principale
- [ ] Les composants React restent strictement présentationnels
- [ ] Aucun nouveau composant structurel n'est créé
- [ ] L'intégration respecte le pipeline d'exécution immuable
- [ ] L'explicabilité est garantie pour toutes les conclusions
- [ ] La réutilisabilité entre intelligences est assurée
- [ ] Les vérifications TypeScript et ESLint passent
- [ ] Le rapport de sprint est créé

---

## Conclusion

Ce document est la constitution du projet Career Copilot. Toute modification architecturale doit respecter ces principes immuables. L'objectif est de maintenir une architecture stable, cohérente et évolutive tout en ajoutant de nouvelles capacités de raisonnement.

**Règle d'or**: Si une modification nécessite de violer une contrainte architecturale immuable, elle ne doit pas être faite. Trouvez une alternative qui respecte l'architecture existante.

---

**Document maintenu par**: Devin.ai
**Dernière mise à jour**: Après Sprint 54 (Planning Intelligence)
**Version**: 1.0
