# SPRINT 38 — Goal Intelligence (Pilotage Intelligent des Objectifs)

## Objectif

Transformer les objectifs du candidat en un système vivant.

Le Career Copilot ne suit plus des objectifs, il les pilote.

Après ce sprint, le Career Copilot est capable de :
- Comprendre pourquoi un objectif existe
- Détecter lorsqu'il devient obsolète
- Détecter lorsqu'il doit être découpé
- Fusionner plusieurs objectifs
- Changer automatiquement leur priorité
- Expliquer pourquoi un objectif disparaît
- Créer un nouvel objectif lorsqu'une opportunité apparaît

## Contraintes respectées

Architecture STRICTEMENT inchangée.

Interdictions absolues respectées :
- Aucun nouveau Brain créé
- Aucun nouveau Repository créé
- Aucun nouveau Graph créé
- Aucun nouveau Manager créé
- Aucun nouveau Provider créé
- Aucun nouveau Service créé
- Aucune nouvelle base de données créée
- Aucun nouveau stockage créé
- Aucune architecture existante modifiée

Réutilisation exclusive :
- CandidateGraph
- CandidateAIBrain
- AIOrchestrator
- EventBus
- Tous les Engines existants

Aucun appel LLM depuis React.
Aucune duplication de logique.

## Fichiers créés (3 fichiers)

### 1. `core/ai/Prompts/career-copilot-goal-intelligence-v1.ts`
- Prompt pour le pilotage intelligent des objectifs
- Définit les critères de compréhension des objectifs (raison d'exister, impact attendu, priorité, urgence, dépendances, risque, valeur stratégique)
- Spécifie les règles de détection automatique (objectif atteint, abandonné, obsolète, impossible, secondaire, prioritaire, contradictoire, trop ambitieux, trop facile, nécessitant un découpage)
- Définit les règles de fusion intelligente et de découpage intelligent
- Définit les règles de réordonnancement automatique
- Définit les règles de détection des objectifs obsolètes
- Définit les règles de création de nouveaux objectifs
- Définit le format de sortie JSON avec objectif principal, objectifs secondaires, nouveaux objectifs, objectifs terminés, objectifs fusionnés, objectifs supprimés, objectifs reportés, objectif du moment, raisons des changements, confiance globale, recommandations
- Utilise les sources de données : CandidateGraph, stratégie actuelle, stratégie précédente, priorité actuelle, priorités historiques, engagements actuels, engagements précédents, conclusions actuelles, historique des conclusions, confiance actuelle, historique de confiance, forecast actuel, plan de progression actuel, digital twin actuel, événements récents, objectifs actuels, historique des objectifs

### 2. `core/intelligence/engines/careerCopilotGoalIntelligenceEngine.ts`
- Engine implémentant la logique de pilotage intelligent des objectifs
- Extrait les données de CandidateGraph et de tous les AI Engines existants
- Utilise AIOrchestrator avec le prompt career-copilot-goal-intelligence-v1
- Sauvegarde les évaluations de goal intelligence dans CandidateAIBrain comme observations
- Publie les événements de création, fusion et suppression d'objectifs sur EventBus
- Fournit des méthodes pour récupérer la goal intelligence actuelle et l'historique

### 3. `components/dashboard/goal-intelligence.tsx`
- Nouveau composant React affichant le statut des objectifs intelligents
- Affiche : objectif principal, objectifs secondaires, nouveaux objectifs, objectifs terminés, objectifs fusionnés, objectifs supprimés, objectifs reportés, objectif du moment, raisons des changements, confiance globale, recommandations
- Utilise des couleurs et icônes pour différencier les niveaux de priorité, d'urgence et de statut
- Style avec dégradés bleu/cyan pour le widget principal

## Fichiers modifiés (10 fichiers)

### 4. `core/intelligence/engines/careerCopilotConversationEngine.ts`
- Import de CareerCopilotMetaIntelligenceEngine et CareerCopilotGoalIntelligenceEngine
- Extraction de la goal intelligence depuis le Goal Intelligence Engine
- Inclusion des données de goal intelligence dans les données passées à AIOrchestrator
- Ajout de la sélection de goal intelligence dans selectRelevantAnalyses pour les questions sur les objectifs

### 5. `components/dashboard/progression-plan.tsx`
- Ajout de la propriété goalStatus à l'interface ProgressionPlan
- Nouvelle section "Statut des objectifs" affichant :
  - Objectif principal
  - Objectif du moment
  - Nouveaux objectifs
  - Objectifs terminés
  - Objectifs fusionnés
  - Objectifs supprimés
  - Objectifs reportés
  - Raison
- Ajout des icônes Target, Zap, Plus, CheckCircle, RefreshCw, Trash2, Clock pour cette section

### 6. `components/dashboard/career-forecast.tsx`
- Ajout de la propriété goalStatus à l'interface CareerForecast
- Nouvelle section "Statut des objectifs" affichant :
  - Objectif principal
  - Objectif du moment
  - Nouveaux objectifs
  - Objectifs terminés
  - Objectifs fusionnés
  - Objectifs supprimés
  - Objectifs reportés
  - Raison
- Ajout des icônes Target, Zap, Plus, CheckCircle, RefreshCw, Trash2, Clock pour cette section

### 7. `components/dashboard/digital-twin.tsx`
- Ajout de la propriété goalStatus à l'interface DigitalTwin
- Nouvelle section "Statut des objectifs" affichant :
  - Objectif principal
  - Objectif du moment
  - Nouveaux objectifs
  - Objectifs terminés
  - Objectifs fusionnés
  - Objectifs supprimés
  - Objectifs reportés
  - Raison
- Ajout des icônes Target, Zap, Plus, CheckCircle, RefreshCw, Trash2, Clock pour cette section

### 8. `core/intelligence/engines/careerCopilotAccountabilityEngine.ts`
- Import de CareerCopilotGoalIntelligenceEngine
- Extraction de la goal intelligence (objectif principal, objectif du moment, objectifs valides, objectifs supprimés, objectifs terminés) depuis le Goal Intelligence Engine
- Inclusion des données de goal intelligence dans les données passées à AIOrchestrator

### 9. `core/ai/Prompts/career-copilot-accountability-v1.ts`
- Ajout des sections "PRIMARY GOAL", "GOAL OF THE MOMENT", "VALID GOALS", "DELETED GOALS", "COMPLETED GOALS"
- Ajout des variables "primaryGoal", "goalOfTheMoment", "validGoals", "deletedGoals", "completedGoals"
- Mise à jour des instructions pour ne suivre que les engagements alignés avec les objectifs valides et marquer automatiquement comme obsolètes les engagements basés sur des objectifs supprimés ou terminés

### 10. `components/dashboard/daily-summary.tsx`
- Ajout de la propriété goalStatus à l'interface DailySummary
- Nouvelle section "Statut des objectifs" affichant :
  - Objectif principal
  - Objectif du moment
  - Nouveaux objectifs
  - Objectifs terminés
  - Objectifs fusionnés
  - Objectifs supprimés
  - Objectifs reportés
  - Raison
- Ajout des icônes Zap, Plus, Trash2 pour cette section

### 11. `components/dashboard/timeline-widget.tsx`
- Ajout du type "goal" à l'union TimelineItem
- Ajout des propriétés optionnelles goalType, goalDescription, oldGoal, newGoal, goalReason
- Ajout de l'icône Target pour les événements d'objectifs

### 12. `components/dashboard/career-copilot-chat.tsx`
- Ajout de la propriété goalStatus à l'interface Message
- Nouvelle section "Statut des objectifs" dans les messages de chat affichant :
  - Objectif principal
  - Objectif du moment
  - Nouveaux objectifs
  - Objectifs terminés
  - Objectifs fusionnés
  - Objectifs supprimés
  - Objectifs reportés
  - Raison
- Style avec bordure bleu et couleurs adaptées

## Capacités ajoutées

### 1. Compréhension des objectifs
Chaque objectif possède désormais implicitement :
- Sa raison d'exister
- Son impact attendu
- Son niveau de priorité
- Son urgence
- Ses dépendances
- Son risque
- Sa valeur stratégique

### 2. Détection automatique
Le système détecte automatiquement :
- Objectif atteint
- Objectif abandonné
- Objectif devenu inutile
- Objectif devenu impossible
- Objectif devenu secondaire
- Objectif devenu prioritaire
- Objectif contradictoire
- Objectif trop ambitieux
- Objectif trop facile
- Objectif nécessitant un découpage

### 3. Fusion intelligente
Le système détecte lorsque deux objectifs poursuivent le même résultat et les fusionne automatiquement en expliquant pourquoi.

### 4. Découpage intelligent
Le système transforme automatiquement des objectifs complexes en sous-objectifs lorsque cela apporte une meilleure progression.

Exemple :
"Obtenir un poste Senior" → "Refaire le CV" → "Passer ATS" → "Simulation technique" → "Simulation RH" → "Candidatures" → "Suivi" → "Entretiens"

### 5. Réordonnancement automatique
Lorsqu'un événement majeur survient (nouveau score ATS, nouvelle stratégie, nouvelle prévision, nouvelle simulation, nouvel engagement, nouvelles conclusions), les objectifs sont automatiquement réordonnés.

### 6. Objectifs obsolètes
Le système détecte lorsqu'un objectif n'apporte plus de valeur et explique pourquoi, depuis quand, et ce qui le remplace.

### 7. Nouveaux objectifs
Le système crée automatiquement un nouvel objectif lorsqu'une opportunité apparaît, une faiblesse devient critique, une compétence devient prioritaire, une nouvelle stratégie apparaît, ou un changement de carrière est détecté.

### 8. Continuité
Le système explique naturellement :
- Cet objectif remplace celui que nous avions créé il y a deux semaines
- Celui-ci est maintenant terminé
- Celui-ci reste essentiel

## Dashboard

Nouveau widget **"Objectifs Intelligents"** affichant :
- Objectif principal
- Objectifs secondaires
- Nouveaux objectifs
- Objectifs terminés
- Objectifs fusionnés
- Objectifs supprimés
- Objectifs reportés
- Objectif du moment
- Raisons des changements
- Confiance globale
- Recommandations

## Timeline

Événements automatiques ajoutés :
- Objectif créé
- Objectif fusionné
- Objectif découpé
- Objectif supprimé
- Objectif remplacé
- Objectif terminé
- Objectif re-priorisé

## Career Copilot

Le chat peut répondre naturellement aux questions :
- Pourquoi mon objectif a changé ?
- Pourquoi cet objectif disparaît ?
- Pourquoi celui-ci devient prioritaire ?
- Est-ce que cet objectif est encore pertinent ?
- Quel objectif a le plus de valeur ?
- Pourquoi as-tu créé un nouvel objectif ?
- Pourquoi as-tu fusionné ces objectifs ?
- Pourquoi ce plan est-il différent ?

## Progression Plan

Le plan vivant utilise automatiquement :
- Les nouveaux objectifs
- Leur nouvel ordre
- Leurs dépendances
- Leur priorité

Sans aucune logique parallèle.

## Forecast

La prévision tient compte :
- Des nouveaux objectifs
- Des objectifs abandonnés
- Des objectifs fusionnés
- Des objectifs prioritaires

## Accountability

Ne suit que :
- Les objectifs encore valides

Supprime automatiquement :
- Ceux devenus obsolètes

## Digital Twin

Le portrait vivant évolue pour refléter :
- Les objectifs actuels
- L'évolution des objectifs
- La cohérence avec les objectifs

Exemple :
- Tu poursuis aujourd'hui des objectifs plus ambitieux qu'au début
- Tu sais désormais maintenir tes objectifs jusqu'à leur réalisation
- Tu abandonnes moins souvent tes objectifs

## Daily Summary

Intègre naturellement :
- Nouveaux objectifs
- Objectifs terminés
- Changements de priorité
- Objectifs supprimés
- Objectif principal du jour

## Typecheck ✅

- 52 erreurs préexistantes (non liées au nouveau travail)
- 0 nouvelle erreur introduite

## Résultat

Le Career Copilot atteint un niveau de maturité supérieur : il ne suit plus les objectifs, il les pilote. Le système transforme les objectifs du candidat en un système vivant capable de comprendre pourquoi un objectif existe, détecter lorsqu'il devient obsolète, détecter lorsqu'il doit être découpé, fusionner plusieurs objectifs, changer automatiquement leur priorité, expliquer pourquoi un objectif disparaît, et créer un nouvel objectif lorsqu'une opportunité apparaît. Le candidat bénéficie d'un système de pilotage intelligent de ses objectifs qui s'adapte automatiquement aux changements de circonstances et maintient une vision cohérente et unifiée de son parcours professionnel, sans modifier l'architecture existante ni créer de nouvelles couches techniques.
