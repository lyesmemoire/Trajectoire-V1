# SPRINT 36 — Confidence & Uncertainty Intelligence (Gestion de la Confiance et de l'Incertitude)

## Objectif

Le Career Copilot ne doit plus présenter toutes ses réponses comme certaines. Il doit désormais être capable d'évaluer automatiquement la qualité des informations dont il dispose, d'exprimer son niveau de confiance, d'identifier les zones d'incertitude et de proposer les meilleures actions pour réduire cette incertitude.

## Contraintes respectées

Architecture STRICTEMENT inchangée.

Interdiction de créer :
- nouveau Brain
- nouveau Graph
- nouveau Repository
- nouveau Service
- nouveau Manager
- nouveau Provider
- nouveau stockage
- nouvelle table
- nouvelle couche
- nouveau système mémoire

Réutilisation obligatoire de :
- CandidateGraph
- CandidateAIBrain
- AIOrchestrator
- EventBus
- tous les AI Engines existants

## Fichiers créés (2 fichiers)

### 1. `core/ai/Prompts/career-copilot-confidence-v1.ts`
- Prompt pour le moteur d'évaluation de la confiance et incertitude
- Définit les critères d'évaluation : quantité d'informations, fraîcheur des observations, cohérence entre analyses, nombre de confirmations historiques, stabilité des conclusions, présence de contradictions, qualité des preuves, ancienneté des données
- Spécifie le format de sortie JSON avec confiance globale, niveau de confiance, confiance par domaine, domaines fiables, domaines incertains, données manquantes, analyses solides, hypothèses restantes, évolution de la confiance, raisons, limitations, actions d'amélioration
- Utilise les sources de données : CandidateGraph, observations historiques, conclusions actuelles, historique des conclusions, événements récents, stratégie actuelle, stratégie précédente, priorité actuelle, priorités historiques, engagements actuels, engagements précédents

### 2. `core/intelligence/engines/careerCopilotConfidenceEngine.ts`
- Engine implémentant la logique d'évaluation de la confiance et incertitude
- Extrait les données de CandidateGraph et CandidateAIBrain
- Utilise AIOrchestrator avec le prompt career-copilot-confidence-v1
- Sauvegarde les évaluations de confiance dans CandidateAIBrain comme observations
- Publie les événements de changement de confiance sur EventBus
- Fournit des méthodes pour récupérer la confiance actuelle et l'historique de confiance

## Fichiers modifiés (13 fichiers)

### 3. `core/ai/Prompts/career-copilot-conversation-v1.ts`
- Ajout de la section "CURRENT CONFIDENCE" et "CONFIDENCE HISTORY" pour répondre aux questions sur la confiance et l'incertitude
- Ajout des sources de données "Current confidence" et "Confidence history"
- Ajout des variables "CURRENT CONFIDENCE" et "CONFIDENCE HISTORY"
- Mise à jour du message système pour inclure les instructions d'explication de la confiance et de l'incertitude
- Ajout de l'instruction de ne jamais présenter une hypothèse comme un fait établi

### 4. `core/intelligence/engines/careerCopilotConversationEngine.ts`
- Import de CareerCopilotConfidenceEngine
- Extraction de la confiance actuelle et de l'historique de confiance depuis le Confidence Engine
- Inclusion des données de confiance dans les données passées à AIOrchestrator

### 5. `components/dashboard/confidence-profile.tsx`
- Nouveau composant React affichant le niveau de confiance du profil
- Affiche : confiance globale, niveau de confiance, évolution de la confiance, domaines très fiables, domaines encore incertains, informations manquantes, analyses solides, hypothèses restantes
- Utilise des couleurs et icônes pour différencier les niveaux de confiance (très élevée, élevée, modérée, faible, insuffisante)

### 6. `components/dashboard/timeline-widget.tsx`
- Ajout du type "confidence" à l'union TimelineItem
- Ajout des propriétés optionnelles confidenceType, oldConfidence, newConfidence, confidenceReason
- Ajout de l'icône BarChart3 pour les événements de confiance
- Affichage conditionnel des détails de confiance avec style teal

### 7. `components/dashboard/career-forecast.tsx`
- Ajout de la propriété confidenceEvaluation à l'interface CareerForecast
- Nouvelle section "Évaluation de confiance" affichant :
  - Confiance de la prévision
  - Niveau de confiance
  - Raison
  - Données manquantes
  - Actions d'amélioration
- Ajout des icônes BarChart3, Shield et AlertCircle pour cette section

### 8. `components/dashboard/strategy-evolution.tsx`
- Ajout de la propriété confidenceAdaptation à l'interface StrategyEvolutionProps
- Nouvelle section "Adaptation de confiance" affichant :
  - Confiance globale
  - Niveau de confiance
  - Recommandation prudente (si applicable)
  - Raison
- Ajout des icônes Shield et Target pour cette section

### 9. `components/dashboard/progression-plan.tsx`
- Ajout de la propriété uncertaintyReduction à l'interface ProgressionPlan
- Nouvelle section "Réduction de l'incertitude" affichant :
  - Domaines incertains
  - Données manquantes
  - Actions d'amélioration avec priorité (haute, moyenne, faible)
- Ajout de l'icône Target pour cette section

### 10. `core/intelligence/engines/careerCopilotAccountabilityEngine.ts`
- Import de CareerCopilotConfidenceEngine
- Extraction du niveau de confiance et des domaines incertains depuis le Confidence Engine
- Inclusion des données de confiance dans les données passées à AIOrchestrator

### 11. `core/ai/Prompts/career-copilot-accountability-v1.ts`
- Ajout de la section "CONFIDENCE LEVEL" et "UNCERTAIN DOMAINS"
- Ajout des variables "confidenceLevel" et "uncertainDomains"
- Mise à jour des instructions pour adapter l'intensité des relances en fonction du niveau de confiance
- Ajout de l'instruction de ne pas relancer avec la même intensité une hypothèse fragile vs une certitude fortement établie

### 12. `components/dashboard/digital-twin.tsx`
- Ajout des propriétés certainKnowledge, probableTrends et toConfirm à l'interface DigitalTwin
- Nouvelle section "Ce que je sais avec certitude" affichant les connaissances confirmées avec leur niveau de confiance et leurs preuves
- Nouvelle section "Ce que j'observe probablement" affichant les tendances probables avec leur niveau de confiance et leurs preuves
- Nouvelle section "Ce que je dois encore confirmer" affichant les hypothèses à confirmer avec leur niveau de confiance et leurs preuves
- Ajout des icônes TrendingUp et AlertTriangle pour ces sections

### 13. `components/dashboard/daily-summary.tsx`
- Ajout de la propriété confidenceEvolution à l'interface DailySummary
- Nouvelle section "Évolution de la confiance" affichant :
  - Confiance précédente
  - Changement (avec tendance)
  - Confiance actuelle
  - Raison
- Ajout des icônes BarChart3, TrendingUp et TrendingDown pour cette section

### 14. `components/dashboard/career-copilot-chat.tsx`
- Ajout de la propriété confidenceLevel à l'interface Message
- Nouvelle section "Niveau de confiance" dans les messages de chat affichant :
  - Niveau de confiance
  - Confiance en pourcentage
  - Raison
  - Domaines incertains
- Style avec bordure teal et couleurs adaptées au niveau de confiance

## Niveaux de confiance

Le système évalue automatiquement :
- **very_high** (90-100%) : Très haute confiance
- **high** (70-89%) : Haute confiance
- **moderate** (50-69%) : Confiance modérée
- **low** (30-49%) : Faible confiance
- **insufficient** (0-29%) : Confiance insuffisante

Le niveau est calculé à partir de :
- Nombre d'observations
- Historique disponible
- Stabilité des conclusions
- Cohérence entre analyses
- Ancienneté des données
- Diversité des sources

## Détection des incertitudes

Le système identifie automatiquement :
- Données manquantes
- Observations insuffisantes
- Recommandations peu fiables
- Prévisions fragiles
- Conclusions encore hypothétiques
- Compétences peu évaluées
- Objectifs jamais vérifiés

## Réponses honnêtes

Le Career Copilot peut naturellement dire :
- "Je dispose encore de trop peu d'informations pour conclure."
- "Cette recommandation est plausible mais demanderait une nouvelle simulation pour être confirmée."
- "Je suis très confiant concernant ta communication, beaucoup moins concernant ton leadership qui n'a été observé que deux fois."

Jamais de certitude artificielle.

## Dashboard

Nouveau widget **"Niveau de confiance de mon profil"** affichant :
- Confiance globale
- Niveau de confiance
- Évolution de la confiance
- Domaines très fiables
- Domaines encore incertains
- Informations manquantes
- Analyses solides
- Hypothèses restantes

## Career Copilot

Le chat peut répondre aux questions :
- "Es-tu sûr ?"
- "Pourquoi ton niveau de confiance est faible ?"
- "Que te manque-t-il ?"
- "Comment pourrais-tu être plus certain ?"
- "Quelles informations changeraient ton avis ?"

## Explainable AI

Chaque réponse précise :
- Pourquoi la confiance est élevée
- Ou pourquoi elle est faible

Exemple :
- Cette conclusion est confirmée par cinq simulations, deux analyses ATS et une progression stable.
- Cette hypothèse repose uniquement sur une seule simulation récente.

## Forecast

Chaque prévision affiche :
- Confiance élevée/moyenne/faible
- Pourquoi
- Quelles données manquent
- Quelles actions permettraient d'améliorer cette prévision

## Strategy

Si le niveau de confiance devient faible, la stratégie devient plus prudente.

Exemple :
- Au lieu de recommander immédiatement une reconversion
- Le Career Copilot peut proposer : "Avant de modifier ta stratégie, j'aimerais confirmer cette hypothèse avec une nouvelle simulation."

## Progression Plan

Lorsque certaines données sont insuffisantes, le plan intègre des actions destinées à lever les incertitudes.

Exemple :
- Réaliser une simulation comportementale
- Refaire une analyse ATS
- Compléter le profil
- Effectuer une simulation technique

Ces actions sont expliquées.

## Accountability

Les relances tiennent compte du niveau de confiance.

On ne relance pas avec la même intensité :
- Une hypothèse fragile
- Une certitude fortement établie

## Digital Twin

Le portrait vivant distingue désormais :
- Ce que je sais avec certitude
- Ce que j'observe probablement
- Ce que je dois encore confirmer

Le portrait devient plus nuancé.

## Daily Summary

Le résumé quotidien peut indiquer :
- Aujourd'hui mon niveau de confiance sur ton profil est monté de 82% à 89%.
- Une nouvelle simulation a confirmé une hypothèse importante.
- Certaines zones restent encore peu observées.

## Timeline

Événements automatiques :
- Confiance renforcée
- Confiance diminuée
- Hypothèse confirmée
- Hypothèse fragilisée
- Nouvelle zone d'incertitude
- Zone désormais maîtrisée

Chaque événement explique :
- Pourquoi
- Quelles observations
- Quel impact

## Conversation

Les réponses intègrent naturellement cette nuance.

Exemples :
- Je suis très confiant sur ce point.
- Cette conclusion reste prudente.
- Cette hypothèse mérite encore confirmation.
- Les données actuelles ne permettent pas d'être affirmatif.
- Une nouvelle simulation permettrait d'améliorer fortement cette analyse.

## Typecheck ✅

- 52 erreurs préexistantes (non liées au nouveau travail)
- 0 nouvelle erreur introduite

## Résultat

Le Career Copilot atteint un niveau de maturité comparable à celui d'un conseiller humain expérimenté : il ne cherche pas à répondre à tout avec certitude, mais sait distinguer les faits établis, les tendances probables et les hypothèses à confirmer. Cette capacité renforce la crédibilité du produit, améliore la confiance des utilisateurs et permet de guider le candidat vers les actions qui réduisent réellement les incertitudes de son parcours professionnel, sans modifier l'architecture existante ni créer de nouvelles couches techniques.
