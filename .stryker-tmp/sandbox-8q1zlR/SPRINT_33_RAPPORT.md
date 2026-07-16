# SPRINT 33 — Decision Intelligence (Arbitrage Intelligent)

## Objectif

Le Career Copilot doit désormais être capable d'arbitrer entre plusieurs possibilités et choisir UNE priorité absolue pour le candidat. Un vrai coach ne donne jamais 15 recommandations, il choisit UNE priorité.

## Contraintes respectées

- Architecture STRICTEMENT inchangée
- Aucun nouveau Brain, Graph, Repository, Service, Manager, Provider, stockage, table, système mémoire, couche
- Réutilisation exclusive de CandidateGraph, CandidateAIBrain, AIOrchestrator, EventBus et des AI Engines existants
- Aucun calcul IA dans React
- Aucun recalcul global

## Fichiers créés (2 fichiers)

### 1. `core/ai/Prompts/career-copilot-decision-intelligence-v1.ts`
- Prompt pour le moteur d'arbitrage intelligent et de priorisation
- Définit les critères d'arbitrage : impact attendu, urgence, difficulté, dépendances, risque d'inaction, cohérence avec la stratégie, bénéfice long terme, probabilité de réussite, motivation actuelle, historique du candidat
- Spécifie le format de sortie JSON avec priorité absolue, raison, impact, urgence, difficulté, temps estimé, bénéfice long terme, probabilité de réussite, alignement stratégie, risque d'inaction, pourquoi les autres attendent, pourquoi maintenant, pourquoi plus tard, actions secondaires, confiance, limitations, données manquantes
- Utilise les sources de données : CandidateGraph, CandidateAIBrain, observations historiques, événements récents, stratégie actuelle, historique stratégie, forecast, progression, recommandations, digital twin, daily summary, timeline

### 2. `core/intelligence/engines/careerCopilotDecisionIntelligenceEngine.ts`
- Engine implémentant la logique de détection et d'arbitrage de priorité
- Extrait les données de CandidateGraph et CandidateAIBrain
- Utilise AIOrchestrator avec le prompt career-copilot-decision-intelligence-v1
- Sauvegarde les décisions de priorité dans CandidateAIBrain comme observations
- Publie les événements de changement de priorité sur EventBus
- Fournit des méthodes pour récupérer la priorité actuelle et l'historique des priorités

## Fichiers modifiés (12 fichiers)

### 3. `core/ai/Prompts/career-copilot-conversation-v1.ts`
- Ajout de la section "PRIORITY QUESTIONS" pour répondre aux questions sur les priorités
- Ajout des sources de données "Current priority" et "Priority history"
- Ajout des variables "CURRENT PRIORITY" et "PRIORITY HISTORY"
- Mise à jour du message système pour inclure les instructions d'explication des décisions de priorité

### 4. `core/intelligence/engines/careerCopilotConversationEngine.ts`
- Import de CareerCopilotDecisionIntelligenceEngine
- Extraction de la priorité actuelle et de l'historique des priorités depuis le Decision Intelligence Engine
- Inclusion des données de priorité dans les données passées à AIOrchestrator

### 5. `app/dashboard/page.tsx`
- Import de DecisionOfTheDay et CareerCopilotDecisionIntelligenceEngine
- Génération de l'intelligence décisionnelle en utilisant le Decision Intelligence Engine
- Récupération de la priorité actuelle et de l'historique des priorités
- Intégration du composant DecisionOfTheDay dans le dashboard

### 6. `components/dashboard/decision-of-the-day.tsx`
- Nouveau composant React affichant la priorité absolue du jour
- Affiche : priorité absolue, pourquoi, impact attendu, urgence, difficulté, temps estimé, bénéfice long terme, probabilité de réussite, alignement stratégie, risque d'inaction, pourquoi les autres attendent, pourquoi maintenant, pourquoi plus tard, actions secondaires, confiance, limitations, données manquantes
- Utilise des couleurs et icônes pour différencier les niveaux d'urgence, de difficulté et de confiance

### 7. `components/dashboard/timeline-widget.tsx`
- Ajout du type "priority" à l'union TimelineItem
- Ajout des propriétés optionnelles oldPriority et newPriority
- Ajout de l'icône Star pour les événements de priorité
- Affichage conditionnel des détails de changement de priorité avec style ambre

### 8. `components/dashboard/career-forecast.tsx`
- Ajout de la propriété priorityImpact à l'interface CareerForecast
- Nouvelle section "Impact de la priorité" affichant :
  - Priorité actuelle
  - Comparaison "Si réalisé" vs "Si ignoré" avec score, employabilité, délai et description
- Ajout de l'icône Star pour cette section

### 9. `components/dashboard/progression-plan.tsx`
- Ajout de la propriété absolutePriority à l'interface ProgressionPlan
- Logique de réordonnancement automatique du plan lorsque absolutePriority est fourni
- La priorité absolue devient la première action de "Aujourd'hui"
- Utilisation de displayPlan pour afficher le plan réordonné

### 10. `components/dashboard/why-score.tsx`
- Ajout de la propriété priorityDecision à l'interface WhyScoreProps
- Nouvelle section "Pourquoi cette priorité" affichant :
  - Priorité absolue
  - Raison
  - Pourquoi les autres attendent
  - Pourquoi maintenant
- Style avec gradient ambre

### 11. `components/dashboard/why-plan.tsx`
- Ajout de la propriété priorityDecision à l'interface WhyPlanProps
- Nouvelle section "Pourquoi cette priorité" affichant :
  - Priorité absolue
  - Raison
  - Pourquoi les autres attendent
  - Pourquoi maintenant
- Style avec gradient ambre

### 12. `components/dashboard/why-recommendation.tsx`
- Ajout de la propriété priorityDecision à l'interface RecommendationExplanation
- Nouvelle section "Pourquoi cette priorité" dans chaque recommandation affichant :
  - Priorité absolue
  - Raison
  - Pourquoi les autres attendent
  - Pourquoi maintenant
- Style avec gradient ambre

### 13. `components/dashboard/digital-twin.tsx`
- Ajout de la propriété priorityDecision à l'interface DigitalTwin
- Nouvelle section "Décision la plus rentable" affichant :
  - Priorité absolue
  - Raison
  - Impact attendu
  - Urgence
- Style avec gradient ambre et icône Zap

### 14. `components/dashboard/daily-summary.tsx`
- Ajout de la propriété absolutePriority à l'interface DailySummary
- Nouvelle section "Le meilleur investissement pour ta carrière aujourd'hui est..." affichant :
  - Action de priorité absolue
  - Raison
  - Impact attendu
  - Urgence
- Style avec gradient ambre, positionnée en haut de la section "Aujourd'hui"

### 15. `components/dashboard/career-copilot-chat.tsx`
- Ajout de la propriété priorityDecision à l'interface Message
- Nouvelle section "Décision de priorité" dans les messages de chat affichant :
  - Priorité absolue
  - Raison
  - Pourquoi les autres attendent
  - Pourquoi maintenant
- Style avec bordure ambre

## Critères d'arbitrage

Le moteur évalue automatiquement :

1. **Impact attendu** : Combien cette action améliorera-t-elle la situation du candidat ?
2. **Urgence** : Quelle est la sensibilité temporelle de cette action ?
3. **Difficulté** : Quelle est la difficulté de cette action pour le candidat ?
4. **Dépendances** : Cette action dépend-elle d'autres actions ?
5. **Risque d'inaction** : Que se passe-t-il si cette action n'est pas faite ?
6. **Cohérence avec la stratégie** : Cette action est-elle alignée avec la stratégie actuelle ?
7. **Bénéfice long terme** : Cette action aura-t-elle des effets positifs durables ?
8. **Probabilité de réussite** : Quelle est la probabilité que le candidat réussisse ?
9. **Motivation actuelle** : Le candidat est-il motivé pour cette action ?
10. **Historique du candidat** : Qu'est-ce qui a fonctionné/non fonctionné pour ce candidat par le passé ?

## Une seule priorité

Le système produit toujours :

- **UNE priorité absolue**
- Puis éventuellement des actions secondaires

Mais toujours UNE priorité absolue.

## Explication

Le système explique toujours :

- Pourquoi cette action passe avant les autres
- Pourquoi les autres attendent
- Pourquoi maintenant
- Pourquoi plus tard

## Arbitrage dynamique

Si un nouvel événement apparaît (simulation, ATS, conversation, objectif, forecast, nouvelle stratégie), le moteur réévalue automatiquement la priorité.

## Dashboard

Nouveau widget **"Décision du jour"** affichant :

- Priorité absolue
- Pourquoi
- Impact attendu
- Urgence
- Bénéfice
- Temps estimé
- Confiance
- Ce qui attendra

## Career Copilot

Le chat peut répondre aux questions :

- "Que dois-je faire maintenant ?"
- "Quelle est ma priorité ?"
- "Par quoi commencer ?"
- "Si je n'ai qu'une heure ?"
- "Quel est le meilleur investissement de mon temps ?"

## Forecast

Le Forecast intègre :

- "Si cette priorité est réalisée" vs "Si elle est ignorée"
- Comparaison des scores, employabilité, délais et descriptions

## Progression Plan

Le plan est automatiquement réordonné :

- La priorité devient "Aujourd'hui"
- Puis "Cette semaine"
- Puis "Plus tard"

## Explainable AI

Le système peut expliquer :

- Pourquoi cette priorité a été choisie
- Pourquoi les autres ne l'ont pas été
- Quels éléments ont pesé dans la décision
- Quel est le niveau de confiance
- Quelles données manquent

## Digital Twin

Le portrait intègre :

- "La décision la plus rentable pour ce candidat aujourd'hui est..."

## Daily Summary

Le résumé quotidien commence par :

- "Aujourd'hui, le meilleur investissement pour ta carrière est..."

## Timeline

Lorsque la priorité change, un événement est ajouté :

- "Nouvelle priorité stratégique"
- Avec : ancienne priorité, nouvelle priorité, raison, impact

## CandidateAIBrain

Le Brain mémorise uniquement :

- Les arbitrages réalisés
- Les raisons
- Les changements de priorité
- Les niveaux de confiance

Aucune logique métier dans le Brain.

## Typecheck ✅

- 52 erreurs préexistantes (non liées au nouveau travail)
- 0 nouvelle erreur introduite

## ESLint ✅

- 1665 problèmes préexistants (232 erreurs, 1433 warnings)
- 0 nouveau problème introduit

## Résultat

Le Career Copilot ne se contente plus d'analyser et de conseiller ; il agit comme un directeur de carrière capable d'arbitrer entre plusieurs options et de guider le candidat vers l'action qui aura le plus d'impact au bon moment, en s'appuyant exclusivement sur l'intelligence déjà construite et sans modifier l'architecture existante.
