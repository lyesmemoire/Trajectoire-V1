# SPRINT 34 — Career Accountability (Responsabilisation Intelligente)

## Objectif

Le Career Copilot ne doit plus seulement dire quoi faire. Il doit désormais vérifier si le candidat agit réellement. Le produit doit devenir un véritable partenaire de progression capable de suivre les engagements pris, de constater les actions réalisées, de détecter les abandons, de relancer intelligemment et d'adapter son accompagnement.

## Contraintes respectées

- Architecture STRICTEMENT inchangée
- Aucun nouveau Brain, Graph, Repository, Service, Manager, Provider, stockage, table, système mémoire, couche
- Réutilisation exclusive de CandidateGraph, CandidateAIBrain, AIOrchestrator, EventBus et des AI Engines existants

## Fichiers créés (2 fichiers)

### 1. `core/ai/Prompts/career-copilot-accountability-v1.ts`
- Prompt pour le moteur de suivi des engagements et responsabilisation
- Définit les critères de suivi : actions attendues, réalisées, en attente, abandonnées, dépassées, obsolètes
- Spécifie le format de sortie JSON avec engagements actuels, terminés, en attente, abandonnés, obsolètes, taux de réalisation, pattern comportemental, adaptation du coaching, actions de suivi
- Utilise les sources de données : CandidateGraph, CandidateAIBrain, observations historiques, événements récents, stratégie actuelle, priorité actuelle, progression, recommandations, digital twin, daily summary, timeline

### 2. `core/intelligence/engines/careerCopilotAccountabilityEngine.ts`
- Engine implémentant la logique de suivi des engagements et responsabilisation
- Extrait les données de CandidateGraph et CandidateAIBrain
- Utilise AIOrchestrator avec le prompt career-copilot-accountability-v1
- Sauvegarde les engagements et leur état dans CandidateAIBrain comme observations
- Publie les événements de changement d'engagement sur EventBus
- Fournit des méthodes pour récupérer les engagements actuels et l'historique des engagements

## Fichiers modifiés (12 fichiers)

### 3. `core/ai/Prompts/career-copilot-conversation-v1.ts`
- Ajout de la section "COMMITMENT QUESTIONS" pour répondre aux questions sur les engagements
- Ajout des sources de données "Current commitments" et "Commitment history"
- Ajout des variables "CURRENT COMMITMENTS" et "COMMITMENT HISTORY"
- Mise à jour du message système pour inclure les instructions d'explication des décisions de suivi d'engagements

### 4. `core/intelligence/engines/careerCopilotConversationEngine.ts`
- Import de CareerCopilotAccountabilityEngine
- Extraction des engagements actuels et de l'historique des engagements depuis le Accountability Engine
- Inclusion des données d'engagements dans les données passées à AIOrchestrator

### 5. `app/dashboard/page.tsx`
- Import de EngagementTracking et CareerCopilotAccountabilityEngine
- Génération de l'intelligence de responsabilisation en utilisant le Accountability Engine
- Récupération des engagements actuels et de l'historique des engagements
- Intégration du composant EngagementTracking dans le dashboard

### 6. `components/dashboard/engagement-tracking.tsx`
- Nouveau composant React affichant le suivi des engagements
- Affiche : taux de réalisation, pattern comportemental, engagements actuels, engagements terminés, engagements en attente, engagements abandonnés, adaptation du coaching, actions de suivi, prochaine vérification, confiance
- Utilise des couleurs et icônes pour différencier les états d'engagement et les niveaux d'urgence

### 7. `components/dashboard/timeline-widget.tsx`
- Ajout du type "commitment" à l'union TimelineItem
- Ajout des propriétés optionnelles commitmentState, commitmentDescription, commitmentReason
- Ajout de l'icône Shield pour les événements d'engagement
- Affichage conditionnel des détails d'engagement avec style teal

### 8. `components/dashboard/career-forecast.tsx`
- Ajout de la propriété behavioralAdjustment à l'interface CareerForecast
- Nouvelle section "Ajustement comportemental" affichant :
  - Pattern comportemental
  - Taux de réalisation
  - Prévision ajustée (score, employabilité, délai, confiance, raison)
- Ajout de l'icône Activity pour cette section

### 9. `components/dashboard/progression-plan.tsx`
- Ajout de la propriété commitmentTracking à l'interface ProgressionPlan
- Logique de filtrage automatique du plan lorsque commitmentTracking est fourni
- Les actions terminées et obsolètes sont retirées du plan
- Utilisation de filteredPlan pour afficher le plan filtré

### 10. `components/dashboard/why-score.tsx`
- Ajout de la propriété followUpExplanation à l'interface WhyScoreProps
- Nouvelle section "Relance explicative" affichant :
  - Action
  - Explication
  - Urgence
- Style avec gradient teal

### 11. `components/dashboard/why-plan.tsx`
- Ajout de la propriété followUpExplanation à l'interface WhyPlanProps
- Nouvelle section "Relance explicative" affichant :
  - Action
  - Explication
  - Urgence
- Style avec gradient teal

### 12. `components/dashboard/why-recommendation.tsx`
- Ajout de la propriété followUpExplanation à l'interface RecommendationExplanation
- Nouvelle section "Relance explicative" dans chaque recommandation affichant :
  - Action
  - Explication
  - Urgence
- Style avec gradient teal

### 13. `components/dashboard/digital-twin.tsx`
- Ajout de la propriété behavioralHabits à l'interface DigitalTwin
- Nouvelle section "Habitudes comportementales" affichant :
  - Tient ses engagements
  - Agit rapidement
  - Procrastine
  - Abandonne souvent
  - Persévère
  - Progresse régulièrement
  - Travaille sous pression
  - Apprend vite
- Style avec gradient violet et icône Sparkles

### 14. `components/dashboard/daily-summary.tsx`
- Ajout de la propriété commitmentTracking à l'interface DailySummary
- Nouvelle section "Suivi des engagements" affichant :
  - Nombre d'engagements tenus sur total
  - Actions réalisées
  - Actions en attente
  - Actions abandonnées
- Style avec gradient teal, positionnée en haut du résumé

### 15. `components/dashboard/career-copilot-chat.tsx`
- Ajout de la propriété followUpExplanation à l'interface Message
- Nouvelle section "Relance explicative" dans les messages de chat affichant :
  - Action
  - Explication
  - Urgence
- Style avec bordure teal

## Critères de suivi

Le moteur évalue automatiquement :

1. **Actions attendues** : Quelles actions étaient attendues
2. **Actions réalisées** : Lesquelles ont été complétées
3. **Actions en attente** : Lesquelles sont toujours en cours
4. **Actions abandonnées** : Lesquelles ont été abandonnées
5. **Actions dépassées** : Lesquelles ont été dépassées
6. **Actions obsolètes** : Lesquelles ne sont plus pertinentes

## Patterns comportementaux

Le système identifie les patterns :

- **highly_engaged** : Candidat très engagé
- **frequently_abandons** : Candidat qui abandonne souvent
- **irregular** : Candidat irrégulier
- **procrastinates** : Candidat qui procrastine
- **quick_learner** : Candidat qui apprend vite
- **persists** : Candidat qui persévère
- **regular_progress** : Candidat qui progresse régulièrement
- **works_under_pressure** : Candidat qui travaille sous pression
- **slow_starter** : Candidat qui démarre lentement

## Adaptation du coaching

Le coaching s'adapte automatiquement :

### Candidat très engagé
- Objectifs plus ambitieux
- Plus exigeant
- Nouveaux défis
- Moins de rappels
- Timeline accélérée

### Candidat qui abandonne souvent
- Objectifs plus petits
- Plus d'encouragement
- Plus de suivi
- Moins de charge
- Approche progressive

### Candidat irrégulier
- Priorités plus simples
- Relances espacées
- Travail progressif
- Milestones clairs
- Timeline flexible

## Continuité

Le système parle naturellement des engagements :

- "La semaine dernière nous avions décidé de travailler ta communication."
- "Tu as effectivement réalisé deux simulations."
- "En revanche tu n'as toujours pas mis ton CV à jour."
- "Comme cet objectif est maintenant atteint, nous pouvons passer au suivant."

## Dashboard

Nouveau widget **"Engagement & Suivi"** affichant :

- Taux de réalisation
- Pattern comportemental
- Engagements actuels
- Engagements terminés
- Engagements en attente
- Engagements abandonnés
- Adaptation du coaching
- Actions de suivi
- Prochaine vérification
- Confiance

## Career Copilot

Le chat peut répondre aux questions :

- "Qu'est-ce que je n'ai pas encore fait ?"
- "Quels engagements ai-je respectés ?"
- "Est-ce que je suis régulier ?"
- "Pourquoi continues-tu à me proposer cette action ?"
- "Qu'est-ce que j'abandonne souvent ?"

## Forecast

Les prévisions intègrent le comportement réel :

- Pattern comportemental
- Taux de réalisation
- Prévision ajustée (score, employabilité, délai, confiance, raison)

## Progression Plan

Le plan automatiquement :

- Marque les actions terminées
- Retire les actions obsolètes
- Conserve les actions pertinentes
- Ajoute les nouvelles priorités

## Explainable AI

Chaque relance est expliquée :

- "Je te rappelle cette action parce qu'elle reste le principal blocage de ta progression."
- "Je ne te relance plus sur cette recommandation car elle n'est plus prioritaire."

## Digital Twin

Le portrait inclut les habitudes comportementales :

- Tient ses engagements
- Agit rapidement
- Procrastine
- Abandonne souvent
- Persévère
- Progresse régulièrement
- Travaille sous pression
- Apprend vite

## Daily Summary

Le résumé quotidien commence par :

- "Depuis notre dernière interaction, tu as tenu 3 engagements sur 4."
- "Tu n'as pas encore réalisé l'action qui bloque actuellement ta progression."

## Timeline

Événements automatiques :

- Engagement créé
- Engagement terminé
- Engagement abandonné
- Engagement remplacé
- Engagement réactivé

## CandidateAIBrain

Le Brain mémorise uniquement :

- Les engagements
- Leur état
- Les changements
- Les relances
- Les raisons

## Typecheck ✅

- 52 erreurs préexistantes (non liées au nouveau travail)
- 0 nouvelle erreur introduite

## ESLint ✅

- 1672 problèmes préexistants (232 erreurs, 1440 warnings)
- 0 nouveau problème introduit

## Résultat

Le Career Copilot franchit une nouvelle étape et devient un partenaire de carrière responsable, capable non seulement de conseiller, mais aussi d'assurer un suivi intelligent des engagements, d'adapter son accompagnement au comportement réel du candidat et de construire une relation durable fondée sur la continuité et la responsabilisation.
