# Audit 360° - Phase E : Audit Domaine

## Version

**Version** : 1.0.0  
**Date** : 2024-01-23  
**Auteur** : Distinguished Engineer  
**Statut** : Draft

---

## Concepts Métier

### 1. Interview

**Description**
- Entité centrale représentant une session d'entretien complet
- Gère le cycle de vie de l'entretien avec une machine d'états
- Suit les transitions entre les différents stages

**Propriétés**
- `id` : Identifiant unique
- `userId` : Identifiant de l'utilisateur
- `plan` : Plan d'entretien (InterviewPlan)
- `state` : État actuel (InterviewState)
- `currentStage` : Stage actuel (InterviewStage)
- `currentObjective` : Objectif actuel (StageObjective)
- `startedAt` : Date de début
- `completedAt` : Date de fin
- `transitions` : Historique des transitions
- `version` : Version de l'entretien
- `metadata` : Métadonnées

**États (InterviewState)**
- `CREATED` : Créé
- `INITIALIZED` : Initialisé
- `IN_PROGRESS` : En cours
- `PAUSED` : En pause
- `COMPLETED` : Terminé
- `CANCELLED` : Annulé
- `ERROR` : Erreur

**Stages (InterviewStage)**
- `INTRODUCTION` : Introduction
- `ICE_BREAKER` : Brise-glace
- `PRESENTATION` : Présentation
- `EXPERIENCE` : Expérience
- `LEADERSHIP` : Leadership
- `CONFLICT` : Gestion de conflit
- `ARCHITECTURE` : Architecture
- `SYSTEM_DESIGN` : Design système
- `ALGORITHMS` : Algorithmes
- `BEHAVIORAL` : Comportemental
- `CULTURE_FIT` : Adéquation culturelle
- `CANDIDATE_QUESTIONS` : Questions du candidat
- `CONCLUSION` : Conclusion

**Compétences (Competency)**
- `LEADERSHIP` : Leadership
- `OWNERSHIP` : Propriété
- `COMMUNICATION` : Communication
- `ARCHITECTURE` : Architecture
- `ALGORITHMS` : Algorithmes
- `PROBLEM_SOLVING` : Résolution de problèmes
- `DEBUGGING` : Debugging
- `PRODUCT_SENSE` : Sens produit
- `MENTORING` : Mentorat
- `LEARNING` : Apprentissage
- `CONFLICT` : Conflit
- `INFLUENCE` : Influence
- `DECISION_MAKING` : Prise de décision
- `TECHNICAL_DEPTH` : Profondeur technique
- `BUSINESS_IMPACT` : Impact business

**Qui le possède**
- `libs/domain/src/interview/entities/InterviewSession.ts` : Domain entity

**Qui le modifie**
- `InterviewSession.initialize()` : Initialisation
- `InterviewSession.start()` : Démarrage
- `InterviewSession.transitionTo()` : Transition de stage
- `InterviewSession.pause()` : Pause
- `InterviewSession.resume()` : Reprise
- `InterviewSession.complete()` : Complétion
- `InterviewSession.cancel()` : Annulation
- `InterviewSession.error()` : Erreur

**Qui le lit**
- Gateway : Lecture de l'état actuel
- Frontend : Affichage de l'état
- Analytics : Analyse des transitions

**Fichiers**
- `libs/domain/src/interview/entities/InterviewSession.ts`
- `apps/web/src/domain/interview.contract.ts`
- `apps/realtime-gateway/src/voice-interview/core/state.ts`

---

### 2. Replay

**Description**
- Rejouer une session d'entretien enregistrée
- Permet de revoir les interactions et les réponses
- Utile pour l'analyse et l'amélioration

**Propriétés**
- `sessionId` : Identifiant de la session
- `transcript` : Transcript complet
- `events` : Événements enregistrés
- `audio` : Audio enregistré
- `timestamp` : Timestamp

**Qui le possède**
- `apps/web/src/lib/replay/` : Replay logic

**Qui le modifie**
- Replay service : Création du replay
- Replay service : Mise à jour du replay

**Qui le lit**
- Frontend : Affichage du replay
- Analytics : Analyse du replay

**Fichiers**
- `apps/web/src/lib/replay/`
- `docs/REPLAY_ADAPTATION_PHASE2.md`

---

### 3. Question

**Description**
- Question posée par l'intervieweur
- Peut être technique, behaviorale ou culturelle
- Associée à une compétence spécifique

**Propriétés**
- `id` : Identifiant unique
- `type` : Type de question (hr, technical, behavioral)
- `question` : Texte de la question
- `difficulty` : Difficulté (easy, medium, hard)
- `competency` : Compétence associée
- `stage` : Stage associé

**Qui le possède**
- `types/database.ts` : Database type
- `apps/realtime-gateway/src/voice-interview/core/question-generator.ts` : Question generator

**Qui le modifie**
- Question generator : Génération de questions
- Question bank : Mise à jour des questions

**Qui le lit**
- Voice orchestrator : Lecture de la question
- Frontend : Affichage de la question

**Fichiers**
- `types/database.ts`
- `apps/realtime-gateway/src/voice-interview/core/question-generator.ts`
- `apps/web/src/lib/interview/question-bank.ts`

---

### 4. Persona

**Description**
- Personnalité de l'intervieweur
- Définit le ton, le style et le comportement
- Influence les questions et les réponses

**Propriétés**
- `id` : Identifiant unique
- `name` : Nom du persona
- `description` : Description
- `warmth` : Chaleur (0-10)
- `pressure` : Pression (0-10)
- `aggressiveness` : Agressivité (0-10)
- `verbosity` : Verbosité (0-10)
- `interruptions` : Interruptions (0-10)
- `thinkingTime` : Temps de réflexion (0-10)
- `tone` : Ton (warm, neutral, direct, incisive)
- `energy` : Énergie (low, moderate, high)
- `followupStrategy` : Stratégie de relance
- `followupDepth` : Profondeur de relance (0-5)
- `technicalFocus` : Focus technique (0-10)
- `humor` : Humour (0-10)
- `curiosity` : Curiosité (0-10)
- `empathy` : Empathie (0-10)
- `maxResponseLength` : Longueur max de réponse
- `minResponseLength` : Longueur min de réponse
- `allowedInterruptions` : Interruptions autorisées
- `interruptionThreshold` : Seuil d'interruption

**Personas prédéfinis**
- `supportive` : Chaleureux et encourageant
- `neutral` : Équilibré, style corporate standard
- `challenging` : Direct et exigeant
- `technical_lead` : Hautement technique
- `engineering_manager` : Équilibré technique et behavior
- `hr` : Focus culture et behavior
- `startup_founder` : Rapide, direct, orienté résultats

**Qui le possède**
- `libs/domain/src/persona/value-objects/PersonaParameters.ts` : Value object
- `apps/web/src/domain/valueObjects/RecruiterPersona.ts` : Value object
- `apps/web/src/lib/interview/personas.ts` : Persona configuration

**Qui le modifie**
- Persona engine : Génération des paramètres
- Persona config : Configuration des personas

**Qui le lit**
- Voice orchestrator : Lecture des paramètres
- Prompt builder : Injection dans le prompt
- Frontend : Affichage du persona

**Fichiers**
- `libs/domain/src/persona/value-objects/PersonaParameters.ts`
- `apps/web/src/domain/valueObjects/RecruiterPersona.ts`
- `apps/web/src/lib/interview/personas.ts`
- `apps/realtime-gateway/src/voice-interview/core/v2/personas.ts`

---

### 5. Session

**Description**
- Session de conversation avec l'utilisateur
- Gère l'état de la conversation en temps réel
- Suit les messages et les métriques

**Propriétés**
- `id` : Identifiant unique
- `userId` : Identifiant de l'utilisateur
- `personalInfo` : Informations personnelles
- `emotionalState` : État émotionnel
- `currentPhase` : Phase actuelle
- `evaluatedCompetencies` : Compétences évaluées
- `startTime` : Date de début
- `endTime` : Date de fin
- `durationMinutes` : Durée en minutes
- `messagesCount` : Nombre de messages
- `lastQuestionId` : Dernière question
- `lastTopic` : Dernier sujet
- `memory` : Mémoire intelligente

**Phases (InterviewPhase)**
- `INTRODUCTION` : Introduction
- `GENERAL_QUESTIONS` : Questions générales
- `COMPETENCIES` : Compétences
- `PROJECTS` : Projets
- `DIFFICULTIES` : Difficultés
- `SITUATIONAL` : Situationnel
- `FINAL_QUESTIONS` : Questions finales
- `CONCLUSION` : Conclusion

**Compétences évaluées**
- `communication` : Communication
- `leadership` : Leadership
- `organization` : Organisation
- `time_management` : Gestion du temps
- `problem_solving` : Résolution de problèmes
- `teamwork` : Travail d'équipe
- `adaptability` : Adaptabilité
- `autonomy` : Autonomie
- `motivation` : Motivation
- `company_culture` : Culture d'entreprise

**Qui le possède**
- `apps/web/src/domain/entities/Session.ts` : Entity
- `apps/web/src/domain/entities/ConversationState.ts` : Entity

**Qui le modifie**
- Conversation service : Mise à jour de l'état
- Voice orchestrator : Mise à jour des métriques

**Qui le lit**
- Frontend : Affichage de l'état
- Analytics : Analyse des métriques

**Fichiers**
- `apps/web/src/domain/entities/Session.ts`
- `apps/web/src/domain/entities/ConversationState.ts`

---

### 6. Career DNA

**Description**
- ADN professionnel du candidat
- Analyse des compétences, expériences et objectifs
- Utilisé pour personnaliser l'entretien

**Propriétés**
- `skills` : Compétences
- `experience` : Expérience
- `achievements` : Réalisations
- `goals` : Objectifs
- `values` : Valeurs
- `strengths` : Forces
- `weaknesses` : Faiblesses

**Qui le possède**
- `apps/web/src/lib/ats/` : ATS logic
- `apps/web/src/lib/career-dna/` : Career DNA logic

**Qui le modifie**
- ATS analyzer : Analyse du CV
- Career DNA analyzer : Analyse de l'ADN professionnel

**Qui le lit**
- Voice orchestrator : Personnalisation de l'entretien
- Frontend : Affichage de l'ADN professionnel

**Fichiers**
- `apps/web/src/lib/ats/`
- `apps/web/src/lib/career-dna/`

---

### 7. Evaluation

**Description**
- Évaluation continue des compétences du candidat
- Score et confiance pour chaque compétence
- Preuves et recommandations

**Propriétés**
- `competency` : Compétence
- `score` : Score (0-100)
- `confidence` : Confiance (0-100)
- `evidence` : Preuves
- `lastUpdated` : Dernière mise à jour
- `trend` : Tendance (increasing, decreasing, stable)
- `weight` : Poids

**Critères d'évaluation**
- `requiredLevel` : Niveau requis
- `weight` : Poids
- `indicators` : Indicateurs
- `redFlags` : Drapeaux rouges

**Qui le possède**
- `libs/domain/src/evaluation/value-objects/CompetencyEvaluation.ts` : Value object
- `apps/web/src/domain/entities/Report.ts` : Entity

**Qui le modifie**
- Evaluation engine : Mise à jour des scores
- Voice orchestrator : Mise à jour en temps réel

**Qui le lit**
- Frontend : Affichage des scores
- Analytics : Analyse des scores

**Fichiers**
- `libs/domain/src/evaluation/value-objects/CompetencyEvaluation.ts`
- `apps/web/src/domain/entities/Report.ts`
- `apps/realtime-gateway/src/voice-interview/core/evaluation.ts`

---

### 8. Difficulty

**Description**
- Niveau de difficulté de l'entretien
- Adapté au niveau du candidat
- Influence les questions et la pression

**Propriétés**
- `level` : Niveau (easy, medium, hard)
- `expectedDepth` : Profondeur attendue
- `questionComplexity` : Complexité des questions
- `pressureLevel` : Niveau de pression

**Qui le possède**
- `apps/web/src/domain/valueObjects/DifficultyLevel.ts` : Value object

**Qui le modifie**
- Difficulty adapter : Adaptation de la difficulté
- Voice orchestrator : Ajustement en temps réel

**Qui le lit**
- Voice orchestrator : Lecture de la difficulté
- Frontend : Affichage de la difficulté

**Fichiers**
- `apps/web/src/domain/valueObjects/DifficultyLevel.ts`
- `apps/web/src/lib/interview/adaptive-pressure.ts`

---

### 9. Stress

**Description**
- Niveau de stress du candidat
- Mesuré en temps réel
- Influence le comportement de l'intervieweur

**Propriétés**
- `baselinePressure` : Pression de base (0-100)
- `pressureTolerance` : Tolérance à la pression (0-100)
- `stressIndicators` : Indicateurs de stress
- `recoveryTime` : Temps de récupération
- `optimalPressure` : Pression optimale (0-100)

**Qui le possède**
- `libs/domain/src/memory/value-objects/CandidateMemory.ts` : Value object
- `apps/web/src/domain/entities/ConversationState.ts` : Entity

**Qui le modifie**
- Stress analyzer : Analyse du stress
- Voice orchestrator : Ajustement de la pression

**Qui le lit**
- Voice orchestrator : Lecture du stress
- Frontend : Affichage du stress

**Fichiers**
- `libs/domain/src/memory/value-objects/CandidateMemory.ts`
- `apps/web/src/domain/entities/ConversationState.ts`
- `apps/web/src/lib/interview/pressure/`

---

### 10. Memory

**Description**
- Mémoire structurée du candidat
- Stocke les informations extraites
- Utilisée pour l'analyse et le suivi

**Propriétés**
- `projects` : Projets
- `companies` : Entreprises
- `skills` : Compétences
- `achievements` : Réalisations
- `failures` : Échecs
- `leadershipExamples` : Exemples de leadership
- `starElements` : Éléments STAR
- `answerQuality` : Qualité des réponses
- `contradictions` : Contradictions
- `pendingTopics` : Sujets en attente
- `communicationProfile` : Profil de communication
- `stressProfile` : Profil de stress
- `confidence` : Confiance

**Qui le possède**
- `libs/domain/src/memory/value-objects/CandidateMemory.ts` : Value object

**Qui le modifie**
- Memory engine : Mise à jour de la mémoire
- Voice orchestrator : Extraction d'informations

**Qui le lit**
- Voice orchestrator : Lecture de la mémoire
- Frontend : Affichage de la mémoire

**Fichiers**
- `libs/domain/src/memory/value-objects/CandidateMemory.ts`
- `apps/web/src/lib/interview/behavioral-memory.ts`

---

### 11. ATS

**Description**
- Applicant Tracking System
- Analyse des CV par rapport aux descriptions de poste
- Score de compatibilité

**Propriétés**
- `score` : Score de compatibilité (0-100)
- `matchedKeywords` : Mots-clés correspondants
- `missingKeywords` : Mots-clés manquants
- `strengths` : Forces
- `weaknesses` : Faiblesses
- `actionableAdvice` : Conseils actionnables

**Qui le possède**
- `apps/web/src/lib/ats/` : ATS logic
- `apps/web/src/lib/prompts.ts` : ATS prompts

**Qui le modifie**
- ATS analyzer : Analyse du CV
- ATS optimizer : Optimisation du CV

**Qui le lit**
- Frontend : Affichage du score ATS
- Voice orchestrator : Personnalisation de l'entretien

**Fichiers**
- `apps/web/src/lib/ats/`
- `apps/web/src/lib/prompts.ts`

---

### 12. Report

**Description**
- Rapport d'entretien
- Synthèse des scores et des feedbacks
- Généré à la fin de l'entretien

**Propriétés**
- `sessionId` : Identifiant de session
- `overallScore` : Score global
- `competencies` : Scores par compétence
- `strengths` : Forces
- `weaknesses` : Faiblesses
- `recommendations` : Recommandations
- `transcript` : Transcript
- `duration` : Durée

**Qui le possède**
- `apps/web/src/domain/entities/Report.ts` : Entity
- `apps/web/src/application/services/ReportService.ts` : Service

**Qui le modifie**
- Report service : Génération du rapport
- Evaluation engine : Calcul des scores

**Qui le lit**
- Frontend : Affichage du rapport
- Analytics : Analyse des rapports

**Fichiers**
- `apps/web/src/domain/entities/Report.ts`
- `apps/web/src/application/services/ReportService.ts`

---

### 13. User

**Description**
- Utilisateur du système
- Peut être candidat ou recruteur
- Gère les permissions et les abonnements

**Propriétés**
- `id` : Identifiant unique
- `email` : Email
- `name` : Nom
- `role` : Rôle (candidate, recruiter, admin)
- `subscription` : Abonnement
- `quota` : Quota
- `permissions` : Permissions

**Qui le possède**
- `apps/web/src/domain/user.contract.ts` : Contract
- `apps/web/src/domain/billing.contract.ts` : Contract

**Qui le modifie**
- User service : Mise à jour de l'utilisateur
- Auth service : Gestion de l'authentification

**Qui le lit**
- Gateway : Validation de l'utilisateur
- Frontend : Affichage de l'utilisateur

**Fichiers**
- `apps/web/src/domain/user.contract.ts`
- `apps/web/src/domain/billing.contract.ts`

---

### 14. Subscription

**Description**
- Abonnement de l'utilisateur
- Définit les quotas et les fonctionnalités
- Peut être gratuit ou payant

**Propriétés**
- `plan` : Plan (free, premium, enterprise)
- `quota` : Quota
- `features` : Fonctionnalités
- `startDate` : Date de début
- `endDate` : Date de fin
- `autoRenew` : Renouvellement automatique

**Qui le possède**
- `apps/web/src/domain/billing.contract.ts` : Contract
- `apps/web/src/domain/valueObjects/QuotaLimits.ts` : Value object

**Qui le modifie**
- Billing service : Mise à jour de l'abonnement
- Subscription service : Gestion des abonnements

**Qui le lit**
- Gateway : Validation des quotas
- Frontend : Affichage de l'abonnement

**Fichiers**
- `apps/web/src/domain/billing.contract.ts`
- `apps/web/src/domain/valueObjects/QuotaLimits.ts`

---

### 15. Voice

**Description**
- Voix de l'intervieweur
- Définit le timbre et le style
- Utilisée pour la synthèse vocale

**Propriétés**
- `voiceId` : Identifiant de voix
- `provider` : Provider (ElevenLabs, OpenAI)
- `model` : Modèle
- `settings` : Paramètres (stability, similarity_boost, style)

**Qui le possède**
- `apps/realtime-gateway/src/voice-interview/adapters/tts/` : TTS adapters
- `apps/realtime-gateway/src/tts.ts` : TTS wrapper

**Qui le modifie**
- TTS adapter : Configuration de la voix
- Voice settings : Paramètres de la voix

**Qui le lit**
- TTS adapter : Lecture de la voix
- Frontend : Affichage de la voix

**Fichiers**
- `apps/realtime-gateway/src/voice-interview/adapters/tts/`
- `apps/realtime-gateway/src/tts.ts`

---

### 16. Transcript

**Description**
- Transcript de la conversation
- Stocke tous les messages
- Utilisé pour l'analyse et le replay

**Propriétés**
- `sessionId` : Identifiant de session
- `messages` : Messages
- `timestamp` : Timestamp
- `speaker` : Speaker (user, ai)

**Qui le possède**
- `apps/web/src/domain/entities/Message.ts` : Entity
- `apps/web/src/domain/interview.contract.ts` : Contract

**Qui le modifie**
- Conversation service : Ajout de messages
- Voice orchestrator : Ajout de messages

**Qui le lit**
- Frontend : Affichage du transcript
- Replay : Rejouer le transcript
- Analytics : Analyse du transcript

**Fichiers**
- `apps/web/src/domain/entities/Message.ts`
- `apps/web/src/domain/interview.contract.ts`

---

### 17. Stage

**Description**
- Stage de l'entretien
- Définit les objectifs et les conditions de sortie
- Suit les transitions entre les stages

**Propriétés**
- `id` : Identifiant unique
- `stage` : Stage (InterviewStage)
- `description` : Description
- `requiredCompetencies` : Compétences requises
- `exitConditions` : Conditions de sortie
- `minDuration` : Durée minimale
- `maxDuration` : Durée maximale
- `successCriteria` : Critères de succès

**Qui le possède**
- `libs/domain/src/interview/entities/InterviewSession.ts` : Entity
- `libs/domain/src/planner/value-objects/InterviewPlan.ts` : Value object

**Qui le modifie**
- InterviewSession : Transition de stage
- Planner : Planification des stages

**Qui le lit**
- Voice orchestrator : Lecture du stage actuel
- Frontend : Affichage du stage

**Fichiers**
- `libs/domain/src/interview/entities/InterviewSession.ts`
- `libs/domain/src/planner/value-objects/InterviewPlan.ts`

---

### 18. Scenario

**Description**
- Scénario d'entretien
- Définit le déroulement de l'entretien
- Peut être personnalisé

**Propriétés**
- `id` : Identifiant unique
- `name` : Nom
- `description` : Description
- `stages` : Stages
- `questions` : Questions
- `personas` : Personas
- `difficulty` : Difficulté

**Qui le possède**
- `libs/domain/src/planner/` : Planner logic
- `apps/realtime-gateway/src/voice-interview/core/v2/interview-plan-builder.ts` : Plan builder

**Qui le modifie**
- Planner : Création du scénario
- Plan builder : Construction du plan

**Qui le lit**
- Voice orchestrator : Lecture du scénario
- Frontend : Affichage du scénario

**Fichiers**
- `libs/domain/src/planner/`
- `apps/realtime-gateway/src/voice-interview/core/v2/interview-plan-builder.ts`

---

## Conclusion

### Points forts

1. **Domain bien structuré** : Entités et Value Objects clairement définis
2. **DDD appliqué** : Séparation entre entités et value objects
3. **Validation Zod** : Schémas de validation pour tous les concepts
4. **Versioning** : Versioning des entités et des transitions
5. **Domain events** : Événements de domaine pour les transitions

### Points faibles

1. **Pas de Career DNA explicite** : Concept mentionné mais pas implémenté comme entité
2. **Pas de Difficulty explicite** : Concept mentionné mais pas centralisé
3. **Pas de Stress explicite** : Concept mentionné mais pas centralisé
4. **Duplication des concepts** : Certains concepts sont dupliqués entre libs/domain et apps/web/src/domain
5. **Pas de mapping clair** : Pas de mapping clair entre les concepts et leur implémentation

### Recommandations

1. **Centraliser les concepts** : Déplacer tous les concepts dans libs/domain
2. **Implémenter Career DNA** : Créer une entité Career DNA explicite
3. **Implémenter Difficulty** : Créer une entité Difficulty explicite
4. **Implémenter Stress** : Créer une entité Stress explicite
5. **Créer un mapping** : Créer un mapping clair entre les concepts et leur implémentation

**Prochaine phase** : Audit Événements
