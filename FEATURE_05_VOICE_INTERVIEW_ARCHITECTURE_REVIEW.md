# FEATURE_05_VOICE_INTERVIEW_ARCHITECTURE_REVIEW

> Revue d'architecture pour Voice Interview Engine
> Version: 1.0
> Date: 10 juillet 2026
> Type: Documentation uniquement - Aucune implémentation

---

## Résumé Exécutif

**Objectif**: Concevoir l'architecture complète du Voice Interview Engine, le cœur du Career Copilot qui pilotera un entretien vocal complet entre un recruteur IA et un candidat.

**Position dans le pipeline**: Voice Interview Engine est le cœur du système, situé après Interview Preparation Intelligence et avant Live Interview Analysis.

**Responsabilité unique**: Conduire l'entretien, gérer la conversation, poser les questions, écouter le candidat, gérer les tours de parole, adapter le rythme, transmettre le contexte aux intelligences d'analyse.

**Statut**: 📝 ARCHITECTURE REVIEW - Aucune implémentation

---

## Position dans le Pipeline

```
CV
↓
Candidate Intelligence
↓
Job Offer Intelligence
↓
Matching Intelligence
↓
Interview Preparation Intelligence
↓
🎤 Voice Interview Engine
↓
Live Interview Analysis
↓
Live Coaching
↓
Interview Report
↓
Improvement Plan
```

**Relation avec les composants précédents**:
- **CV**: Source de données brute du candidat
- **Candidate Intelligence**: Analyse du candidat
- **Job Offer Intelligence**: Analyse de l'offre
- **Matching Intelligence**: Comparaison candidat/offre
- **Interview Preparation Intelligence**: Plan d'entretien préparé

**Relation avec les composants suivants**:
- **Live Interview Analysis**: Analyse en temps réel des réponses
- **Live Coaching**: Coaching en temps réel
- **Interview Report**: Rapport final de l'entretien
- **Improvement Plan**: Plan d'amélioration post-entretien

---

## Responsabilité Unique

### Ce que Voice Interview Engine fait

✅ **Conduit l'entretien**
- Pilote le déroulement de l'entretien de bout en bout
- Gère les transitions entre les phases
- Assure le respect du plan d'entretien
- Adapte le déroulement en temps réel

✅ **Gère la conversation**
- Gère les tours de parole
- Gère les interruptions
- Gère les silences
- Gère les reformulations

✅ **Pose les questions**
- Sélectionne la prochaine question dans la file
- Pose la question vocalement
- Gère les relances
- Gère les questions de suivi

✅ **Écoute le candidat**
- Capture les réponses vocales
- Transcrit les réponses
- Analyse la fin de parole
- Gère les interruptions

✅ **Gère les tours de parole**
- Détermine quand le candidat parle
- Détermine quand le recruteur IA parle
- Gère les chevauchements
- Gère les interruptions

✅ **Adapte le rythme**
- Adapte la vitesse de parole
- Adapte la durée des pauses
- Adapte le nombre de questions
- Adapte la profondeur des questions

✅ **Transmet le contexte aux intelligences d'analyse**
- Transmet les questions posées
- Transmet les réponses reçues
- Transmet l'état de la conversation
- Transmet les métriques de l'entretien

### Ce que Voice Interview Engine ne fait PAS

❌ **Ne prépare pas les questions**
- Interview Preparation Intelligence prépare les questions
- Voice Interview Engine utilise seulement les questions préparées

❌ **Ne fait pas le matching**
- Matching Intelligence fait le matching
- Voice Interview Engine utilise seulement les résultats du matching

❌ **Ne fait pas de coaching**
- Live Coaching fait le coaching
- Voice Interview Engine transmet seulement le contexte pour le coaching

❌ **Ne produit pas le rapport final**
- Interview Report produit le rapport final
- Voice Interview Engine transmet seulement les données pour le rapport

---

## Composants Logiques

### 1. Conversation State

**Responsabilité**: Maintenir l'état global de la conversation

**Attributs**:
- `currentState`: État actuel de l'entretien
- `previousState`: État précédent
- `stateHistory`: Historique des transitions d'état
- `stateTimestamp`: Timestamp de la transition

**Responsabilités**:
- Gérer les transitions d'état
- Valider les transitions
- Maintenir l'historique
- Fournir l'état actuel aux autres composants

**Interdictions**:
- Ne pas prendre de décisions de transition
- Ne pas modifier l'état sans validation
- Ne pas ignorer les règles de transition

---

### 2. Question Queue

**Responsabilité**: Gérer la file de questions à poser

**Attributs**:
- `currentQueue`: File de questions actuelle
- `priorityQueue`: File de questions priorisées
- `askedQuestions`: Questions déjà posées
- `skippedQuestions`: Questions sautées
- `currentQuestionIndex`: Index de la question actuelle

**Responsabilités**:
- Sélectionner la prochaine question
- Gérer la priorité des questions
- Marquer les questions comme posées
- Gérer les questions sautées

**Interdictions**:
- Ne pas modifier l'ordre sans règle
- Ne pas sauter de question sans justification
- Ne pas répéter une question sans règle

---

### 3. Current Question

**Responsabilité**: Gérer la question en cours

**Attributs**:
- `questionText`: Texte de la question
- `questionType`: Type de la question
- `questionCategory`: Catégorie de la question
- `questionDifficulty`: Difficulté de la question
- `questionObjective`: Objectif de la question
- `askedAt`: Timestamp de la question
- `followUps`: Relances disponibles

**Responsabilités**:
- Maintenir la question en cours
- Gérer les relances
- Gérer les reformulations
- Transmettre la question au composant vocal

**Interdictions**:
- Ne pas modifier la question sans règle
- Ne pas changer de question sans validation
- Ne pas ignorer les relances sans règle

---

### 4. Current Answer

**Responsabilité**: Gérer la réponse en cours

**Attributs**:
- `answerText`: Texte de la réponse
- `answerAudio`: Audio de la réponse
- `answerTranscript`: Transcription de la réponse
- `answerStartTime`: Timestamp de début
- `answerEndTime`: Timestamp de fin
- `answerDuration`: Durée de la réponse
- `answerConfidence`: Confiance de la transcription

**Responsabilités**:
- Capturer la réponse du candidat
- Transcrire la réponse
- Calculer la durée
- Transmettre la réponse aux intelligences d'analyse

**Interdictions**:
- Ne pas modifier la réponse
- Ne pas interpréter la réponse
- Ne pas évaluer la réponse

---

### 5. Conversation Memory

**Responsabilité**: Maintenir la mémoire de la conversation

**Attributs**:
- `questionsAsked`: Questions posées
- `answersReceived`: Réponses reçues
- `conversationHistory`: Historique de la conversation
- `keyPoints`: Points clés identifiés
- `contradictions`: Contradictions détectées
- `promises`: Promesses faites par le candidat

**Responsabilités**:
- Mémoriser les questions posées
- Mémoriser les réponses reçues
- Identifier les points clés
- Identifier les contradictions

**Interdictions**:
- Ne pas oublier les questions posées
- Ne pas oublier les réponses reçues
- Ne pas ignorer les contradictions

---

### 6. Interview Timer

**Responsabilité**: Gérer le temps de l'entretien

**Attributs**:
- `totalDuration`: Durée totale de l'entretien
- `remainingDuration`: Durée restante
- `currentPhaseDuration`: Durée de la phase actuelle
- `questionDuration`: Durée de la question actuelle
- `answerDuration`: Durée de la réponse actuelle

**Responsabilités**:
- Mesurer le temps total
- Mesurer le temps par phase
- Mesurer le temps par question
- Mesurer le temps par réponse
- Alerte de timeout

**Interdictions**:
- Ne pas ignorer le timeout
- Ne pas modifier le temps sans règle
- Ne pas ignorer les limites de temps

---

### 7. Turn Manager

**Responsabilité**: Gérer les tours de parole

**Attributs**:
- `currentSpeaker`: Orateur actuel (recruteur/candidat)
- `turnHistory`: Historique des tours
- `turnDuration`: Durée du tour actuel
- `interruptions`: Interruptions détectées
- `overlaps`: Chevauchements détectés

**Responsabilités**:
- Déterminer qui parle
- Gérer les transitions de tour
- Gérer les interruptions
- Gérer les chevauchements

**Interdictions**:
- Ne pas interrompre sans règle
- Ne pas ignorer les interruptions
- Ne pas ignorer les chevauchements

---

### 8. Interruptions

**Responsabilité**: Gérer les interruptions

**Attributs**:
- `interruptionType`: Type d'interruption
- `interruptionTimestamp`: Timestamp de l'interruption
- `interruptionSpeaker`: Orateur qui a interrompu
- `interruptionReason`: Raison de l'interruption
- `interruptionAction`: Action prise

**Responsabilités**:
- Détecter les interruptions
- Classer les interruptions
- Déterminer l'action appropriée
- Gérer la reprise de la conversation

**Interdictions**:
- Ne pas ignorer les interruptions
- Ne pas interrompre sans règle
- Ne pas ignorer les règles de politesse

---

### 9. Silence Detection

**Responsabilité**: Détecter et gérer les silences

**Attributs**:
- `silenceDuration`: Durée du silence
- `silenceThreshold`: Seuil de silence
- `silenceTimestamp`: Timestamp du début du silence
- `silenceAction`: Action à prendre

**Responsabilités**:
- Détecter les silences
- Classer les silences (court, moyen, long)
- Déterminer l'action appropriée
- Gérer les timeouts

**Interdictions**:
- Ne pas ignorer les silences
- Ne pas interpréter les silences sans règle
- Ne pas ignorer les timeouts

---

### 10. Retry Strategy

**Responsabilité**: Gérer les stratégies de réessai

**Attributs**:
- `retryCount`: Nombre de tentatives
- `retryMax`: Nombre maximum de tentatives
- `retryReason`: Raison du réessai
- `retryAction`: Action de réessai

**Responsabilités**:
- Déterminer quand réessayer
- Gérer le nombre de tentatives
- Adapter la stratégie de réessai
- Gérer l'abandon

**Interdictions**:
- Ne pas réessayer sans règle
- Ne pas dépasser le maximum de tentatives
- Ne pas ignorer les échecs

---

### 11. Follow-up Manager

**Responsabilité**: Gérer les relances

**Attributs**:
- `availableFollowUps`: Relances disponibles
- `usedFollowUps`: Relances utilisées
- `followUpTrigger`: Déclencheur de relance
- `followUpStrategy`: Stratégie de relance

**Responsabilités**:
- Sélectionner les relances appropriées
- Gérer le nombre de relances
- Adapter les relances selon la réponse
- Gérer l'abandon des relances

**Interdictions**:
- Ne pas utiliser de relance sans règle
- Ne pas dépasser le maximum de relances
- Ne pas ignorer les relances disponibles

---

### 12. Adaptive Difficulty

**Responsabilité**: Adapter la difficulté en temps réel

**Attributs**:
- `currentDifficulty`: Difficulté actuelle
- `targetDifficulty`: Difficulté cible
- `difficultyHistory`: Historique de difficulté
- `adaptationRules`: Règles d'adaptation

**Responsabilités**:
- Adapter la difficulté selon les réponses
- Adapter la difficulté selon le temps
- Adapter la difficulté selon le progrès
- Maintenir l'équilibre de difficulté

**Interdictions**:
- Ne pas changer la difficulté sans règle
- Ne pas ignorer les règles d'adaptation
- Ne pas rendre l'entretien trop difficile

---

### 13. Interview Context

**Responsabilité**: Maintenir le contexte de l'entretien

**Attributs**:
- `candidateId`: ID du candidat
- `jobOfferId`: ID de l'offre
- `interviewPlan`: Plan d'entretien
- `interviewStrategy`: Stratégie d'entretien
- `interviewObjectives`: Objectifs de l'entretien
- `interviewConstraints`: Contraintes de l'entretien

**Responsabilités**:
- Maintenir le contexte global
- Transmettre le contexte aux intelligences
- Mettre à jour le contexte
- Valider le contexte

**Interdictions**:
- Ne pas modifier le contexte sans règle
- Ne pas ignorer les contraintes
- Ne pas ignorer les objectifs

---

### 14. Conversation History

**Responsabilité**: Maintenir l'historique de la conversation

**Attributs**:
- `turns`: Tours de parole
- `messages`: Messages échangés
- `timestamps`: Timestamps
- `metadata`: Métadonnées

**Responsabilités**:
- Enregistrer chaque tour de parole
- Enregistrer chaque message
- Maintenir l'ordre chronologique
- Fournir l'historique aux intelligences

**Interdictions**:
- Ne pas perdre l'historique
- Ne pas modifier l'historique
- Ne pas ignorer l'ordre chronologique

---

### 15. Session Summary

**Responsabilité**: Générer le résumé de la session

**Attributs**:
- `summaryText`: Texte du résumé
- `keyPoints`: Points clés
- `demonstratedSkills`: Compétences démontrées
- `notDemonstratedSkills`: Compétences non démontrées
- `overallImpression`: Impression globale

**Responsabilités**:
- Générer le résumé à la fin
- Identifier les points clés
- Identifier les compétences démontrées
- Identifier les compétences non démontrées

**Interdictions**:
- Ne pas générer le résumé avant la fin
- Ne pas interpréter les réponses
- Ne pas évaluer le candidat

---

## États de l'Entretien

### 1. Waiting

**Objectif**: Attendre le début de l'entretien

**Entrées**:
- Interview Plan
- Candidat connecté
- Système vocal prêt

**Sorties**:
- État: Introduction
- Message de bienvenue

**Transitions**:
- Vers Introduction: quand le candidat est connecté et le système est prêt

**Conditions**:
- Candidat connecté
- Système vocal prêt
- Interview Plan disponible

---

### 2. Introduction

**Objectif**: Accueillir le candidat et présenter l'entretien

**Entrées**:
- État: Waiting
- Candidat connecté

**Sorties**:
- État: Warmup
- Message de bienvenue
- Présentation de l'entretien

**Transitions**:
- Vers Warmup: après l'accueil

**Conditions**:
- Message de bienvenue envoyé
- Candidat a répondu

---

### 3. Warmup

**Objectif**: Mettre le candidat à l'aise avec des questions simples

**Entrées**:
- État: Introduction
- Questions de warmup disponibles

**Sorties**:
- État: Technical
- Réponses aux questions de warmup

**Transitions**:
- Vers Technical: après les questions de warmup

**Conditions**:
- Questions de warmup posées
- Candidat à l'aise

---

### 4. Technical

**Objectif**: Poser les questions techniques

**Entrées**:
- État: Warmup
- Questions techniques disponibles

**Sorties**:
- État: Behavioural
- Réponses aux questions techniques

**Transitions**:
- Vers Behavioural: après les questions techniques
- Vers STAR: si une question STAR est nécessaire

**Conditions**:
- Questions techniques posées
- Réponses reçues

---

### 5. Behavioural

**Objectif**: Poser les questions comportementales

**Entrées**:
- État: Technical
- Questions comportementales disponibles

**Sorties**:
- État: STAR
- Réponses aux questions comportementales

**Transitions**:
- Vers STAR: après les questions comportementales
- Vers Leadership: si des questions de leadership sont nécessaires

**Conditions**:
- Questions comportementales posées
- Réponses reçues

---

### 6. STAR

**Objectif**: Poser les questions STAR

**Entrées**:
- État: Behavioural
- Questions STAR disponibles

**Sorties**:
- État: Leadership
- Réponses aux questions STAR

**Transitions**:
- Vers Leadership: après les questions STAR
- Vers Advanced: si des questions avancées sont nécessaires

**Conditions**:
- Questions STAR posées
- Réponses reçues

---

### 7. Leadership

**Objectif**: Poser les questions de leadership

**Entrées**:
- État: STAR
- Questions de leadership disponibles

**Sorties**:
- État: Advanced
- Réponses aux questions de leadership

**Transitions**:
- Vers Advanced: après les questions de leadership
- Vers Wrap-up: si aucune question avancée n'est nécessaire

**Conditions**:
- Questions de leadership posées
- Réponses reçues

---

### 8. Advanced

**Objectif**: Poser les questions avancées

**Entrées**:
- État: Leadership
- Questions avancées disponibles

**Sorties**:
- État: Wrap-up
- Réponses aux questions avancées

**Transitions**:
- Vers Wrap-up: après les questions avancées

**Conditions**:
- Questions avancées posées
- Réponses reçues

---

### 9. Wrap-up

**Objectif**: Conclure l'entretien

**Entrées**:
- État: Advanced
- Toutes les questions posées

**Sorties**:
- État: Candidate Questions
- Message de conclusion

**Transitions**:
- Vers Candidate Questions: après la conclusion

**Conditions**:
- Toutes les questions posées
- Message de conclusion envoyé

---

### 10. Candidate Questions

**Objectif**: Permettre au candidat de poser des questions

**Entrées**:
- État: Wrap-up
- Candidat a des questions

**Sorties**:
- État: Finished
- Réponses aux questions du candidat

**Transitions**:
- Vers Finished: après les questions du candidat

**Conditions**:
- Questions du candidat posées
- Réponses données

---

### 11. Finished

**Objectif**: Terminer l'entretien

**Entrées**:
- État: Candidate Questions
- Toutes les questions traitées

**Sorties**:
- Session Summary
- Interview Report

**Transitions**:
- Aucune (état final)

**Conditions**:
- Entretien terminé
- Résumé généré

---

### 12. Error

**Objectif**: Gérer les erreurs

**Entrées**:
- Erreur détectée
- État actuel

**Sorties**:
- État: Recovery
- Message d'erreur

**Transitions**:
- Vers Recovery: après détection d'erreur

**Conditions**:
- Erreur détectée
- État sauvegardé

---

### 13. Recovery

**Objectif**: Récupérer après une erreur

**Entrées**:
- État: Error
- État sauvegardé

**Sorties**:
- État précédent
- Message de récupération

**Transitions**:
- Vers l'état précédent: après récupération

**Conditions**:
- Erreur résolue
- État restauré

---

## Événements

### 1. InterviewStarted

**Description**: L'entretien commence

**Données**:
- `interviewId`: ID de l'entretien
- `candidateId`: ID du candidat
- `jobOfferId`: ID de l'offre
- `timestamp`: Timestamp de début

**Déclencheur**: Candidat connecté et système prêt

**Actions**:
- Initialiser l'état de l'entretien
- Démarrer le timer
- Passer à l'état Introduction

---

### 2. QuestionAsked

**Description**: Une question est posée

**Données**:
- `questionId`: ID de la question
- `questionText`: Texte de la question
- `questionType`: Type de la question
- `timestamp`: Timestamp de la question

**Déclencheur**: Sélection d'une question dans la file

**Actions**:
- Poser la question vocalement
- Démarrer le timer de réponse
- Mettre à jour la Conversation Memory

---

### 3. CandidateStartedSpeaking

**Description**: Le candidat commence à parler

**Données**:
- `timestamp`: Timestamp de début
- `expectedDuration`: Durée attendue

**Déclencheur**: Détection de voix du candidat

**Actions**:
- Mettre à jour le Turn Manager
- Arrêter le timer de silence
- Transmettre à Live Interview Analysis

---

### 4. CandidateStoppedSpeaking

**Description**: Le candidat arrête de parler

**Données**:
- `timestamp`: Timestamp de fin
- `duration`: Durée de la réponse
- `transcript`: Transcription de la réponse

**Déclencheur**: Détection de fin de parole

**Actions**:
- Mettre à jour le Turn Manager
- Transcrire la réponse
- Transmettre à Live Interview Analysis
- Déterminer la prochaine action

---

### 5. SilenceDetected

**Description**: Un silence est détecté

**Données**:
- `duration`: Durée du silence
- `threshold`: Seuil dépassé
- `timestamp`: Timestamp du silence

**Déclencheur**: Silence détecté par Silence Detection

**Actions**:
- Évaluer la durée du silence
- Déterminer l'action (relance, répéter, abandonner)
- Mettre à jour le Retry Strategy

---

### 6. QuestionRepeated

**Description**: Une question est répétée

**Données**:
- `questionId`: ID de la question
- `reason`: Raison de la répétition
- `timestamp`: Timestamp de la répétition

**Déclencheur**: Silence trop long ou réponse incomplète

**Actions**:
- Répéter la question
- Incrémenter le compteur de retry
- Mettre à jour la Conversation Memory

---

### 7. FollowUpTriggered

**Description**: Une relance est déclenchée

**Données**:
- `followUpId`: ID de la relance
- `questionId`: ID de la question parente
- `reason`: Raison de la relance
- `timestamp`: Timestamp de la relance

**Déclencheur**: Réponse incomplète ou besoin de clarification

**Actions**:
- Poser la relance
- Mettre à jour le Follow-up Manager
- Mettre à jour la Conversation Memory

---

### 8. InterviewPaused

**Description**: L'entretien est mis en pause

**Données**:
- `reason`: Raison de la pause
- `timestamp`: Timestamp de la pause

**Déclencheur**: Interruption ou erreur

**Actions**:
- Mettre en pause le timer
- Sauvegarder l'état
- Passer à l'état Error

---

### 9. InterviewResumed

**Description**: L'entretien reprend

**Données**:
- `timestamp`: Timestamp de la reprise

**Déclencheur**: Récupération après erreur

**Actions**:
- Reprendre le timer
- Restaurer l'état
- Passer à l'état Recovery

---

### 10. InterviewFinished

**Description**: L'entretien est terminé

**Données**:
- `timestamp`: Timestamp de fin
- `totalDuration`: Durée totale
- `questionsAsked`: Nombre de questions posées
- `answersReceived`: Nombre de réponses reçues

**Déclencheur**: Toutes les questions traitées

**Actions**:
- Arrêter le timer
- Générer le Session Summary
- Transmettre à Interview Report
- Passer à l'état Finished

---

### 11. TimeoutReached

**Description**: Un timeout est atteint

**Données**:
- `timeoutType`: Type de timeout
- `duration`: Durée du timeout
- `timestamp`: Timestamp du timeout

**Déclencheur**: Durée maximale dépassée

**Actions**:
- Évaluer le type de timeout
- Déterminer l'action (relance, passer à la question suivante, terminer)
- Mettre à jour le Interview Timer

---

### 12. InterruptionDetected

**Description**: Une interruption est détectée

**Données**:
- `interruptionType`: Type d'interruption
- `speaker`: Orateur qui a interrompu
- `timestamp`: Timestamp de l'interruption

**Déclencheur**: Interruption détectée par Turn Manager

**Actions**:
- Classer l'interruption
- Déterminer l'action (autoriser, ignorer, demander de répéter)
- Mettre à jour le Turn Manager

---

### 13. CandidateQuestionAsked

**Description**: Le candidat pose une question

**Données**:
- `questionText`: Texte de la question
- `timestamp`: Timestamp de la question

**Déclencheur**: Candidat pose une question

**Actions**:
- Enregistrer la question
- Transmettre à Live Coaching
- Déterminer la réponse

---

## Gestion de la Conversation

### Comment Choisir la Prochaine Question

**Stratégie**:
1. Vérifier si une question prioritaire est disponible
2. Vérifier si une question de l'état actuel est disponible
3. Vérifier si une question de l'état suivant est disponible
4. Sélectionner la question avec la priorité la plus élevée
5. Valider que la question n'a pas déjà été posée
6. Valider que la question respecte les contraintes de temps

**Règles**:
- Toujours respecter l'ordre défini dans Interview Preparation Intelligence
- Ne pas sauter de question sans justification
- Ne pas répéter une question sans règle
- Adapter la sélection selon les réponses précédentes

**Déterminisme**:
- Même plan d'entretien + mêmes réponses = même prochaine question
- Aucune sélection aléatoire
- Aucune sélection probabiliste

---

### Quand Passer à une Relance

**Conditions**:
- Réponse incomplète (durée < minimum attendu)
- Réponse hors sujet (détection par Live Interview Analysis)
- Réponse confuse (détection par Live Interview Analysis)
- Silence détecté (durée > seuil)
- Candidat demande de clarification

**Règles**:
- Ne pas dépasser le maximum de relances
- Ne pas utiliser de relance si la réponse est complète
- Adapter la relance selon la réponse précédente
- Toujours expliquer pourquoi la relance est utilisée

**Déterminisme**:
- Même réponse = même décision de relance
- Aucune décision aléatoire
- Aucune décision probabiliste

---

### Quand Changer de Sujet

**Conditions**:
- Toutes les questions du sujet actuel posées
- Temps restant insuffisant pour le sujet actuel
- Candidat manifeste de l'intérêt pour un autre sujet
- Live Interview Analysis recommande de changer

**Règles**:
- Toujours respecter l'ordre défini dans Interview Preparation Intelligence
- Ne pas changer de sujet sans justification
- Ne pas ignorer les contraintes de temps
- Toujours expliquer pourquoi le sujet change

**Déterminisme**:
- Même plan d'entretien + mêmes réponses = même changement de sujet
- Aucun changement aléatoire
- Aucun changement probabiliste

---

### Quand Interrompre

**Conditions**:
- Candidat dépasse le temps maximum de réponse
- Candidat s'éloigne du sujet
- Urgence ou erreur système
- Candidat demande d'interrompre

**Règles**:
- Ne pas interrompre sans justification
- Toujours être poli
- Toujours expliquer pourquoi l'interruption
- Permettre au candidat de terminer sa pensée si possible

**Déterminisme**:
- Même conditions = même décision d'interruption
- Aucune interruption aléatoire
- Aucune interruption probabiliste

---

### Quand Répéter

**Conditions**:
- Silence détecté (durée > seuil)
- Candidat demande de répéter
- Candidat n'a pas compris la question
- Transcription de la question incorrecte

**Règles**:
- Ne pas répéter sans justification
- Ne pas dépasser le maximum de répétitions
- Adapter la formulation si nécessaire
- Toujours expliquer pourquoi la répétition

**Déterminisme**:
- Même conditions = même décision de répétition
- Aucune répétition aléatoire
- Aucune répétition probabiliste

---

### Quand Reformuler

**Conditions**:
- Candidat n'a pas compris la question
- Candidat demande de reformuler
- Question trop complexe
- Live Interview Analysis recommande de reformuler

**Règles**:
- Ne pas reformuler sans justification
- Garder le même objectif
- Simplifier si nécessaire
- Toujours expliquer pourquoi la reformulation

**Déterminisme**:
- Même conditions = même décision de reformulation
- Aucune reformulation aléatoire
- Aucune reformulation probabiliste

---

### Quand Accélérer

**Conditions**:
- Temps restant insuffisant
- Candidat répond rapidement
- Questions restantes nombreuses
- Live Interview Analysis recommande d'accélérer

**Règles**:
- Ne pas accélérer sans justification
- Ne pas sacrifier la qualité
- Toujours informer le candidat
- Maintenir la politesse

**Déterminisme**:
- Même conditions = même décision d'accélération
- Aucune accélération aléatoire
- Aucune accélération probabiliste

---

### Quand Ralentir

**Conditions**:
- Candidat a besoin de temps
- Question complexe
- Candidat manifeste de la difficulté
- Live Interview Analysis recommande de ralentir

**Règles**:
- Ne pas ralentir sans justification
- Ne pas dépasser le temps maximum
- Toujours informer le candidat
- Maintenir la politesse

**Déterminisme**:
- Même conditions = même décision de ralentissement
- Aucun ralentissement aléatoire
- Aucun ralentissement probabiliste

---

### Quand Terminer

**Conditions**:
- Toutes les questions posées
- Temps maximum atteint
- Candidat demande de terminer
- Erreur irrécupérable

**Règles**:
- Toujours respecter le temps maximum
- Toujours permettre au candidat de poser des questions
- Toujours générer le résumé
- Toujours être poli

**Déterminisme**:
- Même conditions = même décision de terminaison
- Aucune terminaison aléatoire
- Aucune terminaison probabiliste

---

## Mémoire de Conversation

### Ce qu'il Faut Mémoriser

#### Questions Déjà Posées
- ID de la question
- Texte de la question
- Type de la question
- Catégorie de la question
- Timestamp de la question
- Réponse du candidat
- Évaluation de la réponse

#### Réponses
- Texte de la réponse
- Transcription de la réponse
- Durée de la réponse
- Timestamp de la réponse
- Confiance de la transcription
- Analyse de la réponse

#### Temps
- Temps total de l'entretien
- Temps par phase
- Temps par question
- Temps par réponse
- Temps de silence

#### Scores
- Scores de compétence (de Live Interview Analysis)
- Scores de comportement (de Live Interview Analysis)
- Scores globaux (de Live Interview Analysis)

#### Indices
- Indices de compétence démontrée
- Indices de compétence non démontrée
- Indices de contradiction
- Indices de promesse

#### Éléments à Approfondir
- Questions à approfondir
- Compétences à approfondir
- Points à clarifier

#### Éléments Confirmés
- Compétences confirmées
- Expériences confirmées
- Points validés

#### Compétences Démontrées
- Liste des compétences démontrées
- Niveau de démonstration
- Preuves de démonstration

#### Compétences Non Démontrées
- Liste des compétences non démontrées
- Raison de non-démonstration
- Opportunités manquées

#### Contradictions
- Contradictions détectées
- Timestamp de la contradiction
- Contexte de la contradiction

#### Promesses
- Promesses faites par le candidat
- Timestamp de la promesse
- Contexte de la promesse

---

## Règles d'Adaptation

### Comment Adapter la Difficulté

**Règles**:
- Si le candidat répond bien à toutes les questions d'un niveau: augmenter la difficulté
- Si le candidat répond mal à plusieurs questions d'un niveau: diminuer la difficulté
- Si le candidat hésite souvent: diminuer la difficulté
- Si le candidat répond rapidement et correctement: augmenter la difficulté

**Déterminisme**:
- Même pattern de réponses = même adaptation de difficulté
- Aucune adaptation aléatoire
- Aucune adaptation probabiliste

**Explainability**:
- Pourquoi la difficulté change
- Quelle règle déclenche le changement
- Quelles réponses justifient le changement

---

### Comment Adapter la Durée

**Règles**:
- Si le temps restant est insuffisant: accélérer
- Si le candidat a besoin de temps: ralentir
- Si le candidat répond rapidement: accélérer
- Si le candidat répond lentement: ralentir

**Déterminisme**:
- Même pattern de temps = même adaptation de durée
- Aucune adaptation aléatoire
- Aucune adaptation probabiliste

**Explainability**:
- Pourquoi la durée change
- Quelle règle déclenche le changement
- Quelles métriques justifient le changement

---

### Comment Adapter les Relances

**Règles**:
- Si la réponse est incomplète: utiliser une relance
- Si la réponse est hors sujet: utiliser une relance de clarification
- Si la réponse est confuse: utiliser une relance de reformulation
- Si le candidat demande de clarifier: utiliser une relance

**Déterminisme**:
- Même type de réponse = même type de relance
- Aucune relance aléatoire
- Aucune relance probabiliste

**Explainability**:
- Pourquoi la relance est utilisée
- Quelle règle déclenche la relance
- Quelle réponse justifie la relance

---

### Comment Adapter les Questions

**Règles**:
- Si le candidat a déjà démontré une compétence: passer à la compétence suivante
- Si le candidat n'a pas démontré une compétence: poser une question de validation
- Si le temps est limité: prioriser les compétences critiques
- Si le candidat manifeste de l'intérêt: adapter les questions

**Déterminisme**:
- Même pattern de démonstration = même adaptation de questions
- Aucune adaptation aléatoire
- Aucune adaptation probabiliste

**Explainability**:
- Pourquoi la question est adaptée
- Quelle règle déclenche l'adaptation
- Quelle démonstration justifie l'adaptation

---

### Comment Adapter l'Ordre

**Règles**:
- Si une compétence critique est non démontrée: prioriser cette compétence
- Si le temps est limité: prioriser les compétences critiques
- Si le candidat manifeste de l'intérêt: adapter l'ordre
- Si Live Interview Analysis recommande: adapter l'ordre

**Déterminisme**:
- Même pattern de priorité = même adaptation d'ordre
- Aucune adaptation aléatoire
- Aucune adaptation probabiliste

**Explainability**:
- Pourquoi l'ordre est adapté
- Quelle règle déclenche l'adaptation
- Quelle priorité justifie l'adaptation

---

### Comment Adapter le Rythme

**Règles**:
- Si le candidat répond rapidement: accélérer le rythme
- Si le candidat répond lentement: ralentir le rythme
- Si le candidat manifeste de la difficulté: ralentir le rythme
- Si le temps est limité: accélérer le rythme

**Déterminisme**:
- Même pattern de vitesse = même adaptation de rythme
- Aucune adaptation aléatoire
- Aucune adaptation probabiliste

**Explainability**:
- Pourquoi le rythme est adapté
- Quelle règle déclenche l'adaptation
- Quelle vitesse justifie l'adaptation

---

### Comment Adapter la Profondeur

**Règles**:
- Si le candidat répond bien: augmenter la profondeur
- Si le candidat répond mal: diminuer la profondeur
- Si le temps est limité: diminuer la profondeur
- Si la compétence est critique: maintenir la profondeur

**Déterminisme**:
- Même pattern de qualité = même adaptation de profondeur
- Aucune adaptation aléatoire
- Aucune adaptation probabiliste

**Explainability**:
- Pourquoi la profondeur est adaptée
- Quelle règle déclenche l'adaptation
- Quelle qualité justifie l'adaptation

---

## Interfaces avec les Futures Intelligences

### 1. Live Interview Analysis

**Responsabilité**: Analyser les réponses en temps réel

**Entrées vers Live Interview Analysis**:
- Question posée
- Réponse du candidat
- Transcription de la réponse
- Timestamp de la réponse
- Contexte de la conversation

**Sorties de Live Interview Analysis**:
- Analyse de la réponse
- Score de compétence
- Détection de contradiction
- Recommandation de relance
- Recommandation de changement de sujet

**Moment d'appel**:
- Après chaque réponse du candidat
- En temps réel pendant la réponse

**Déterminisme**:
- Même question + même réponse = même analyse
- Aucune analyse aléatoire
- Aucune analyse probabiliste

---

### 2. Live Coaching

**Responsabilité**: Fournir du coaching en temps réel

**Entrées vers Live Coaching**:
- Question posée
- Réponse du candidat
- Analyse de la réponse
- Score de compétence
- Contexte de la conversation

**Sorties de Live Coaching**:
- Recommandation de coaching
- Suggestion d'amélioration
- Point à corriger
- Point à renforcer

**Moment d'appel**:
- Après chaque analyse de réponse
- En temps réel pendant la réponse

**Déterminisme**:
- Même analyse + même contexte = même coaching
- Aucun coaching aléatoire
- Aucun coaching probabiliste

---

### 3. Interview Report

**Responsabilité**: Générer le rapport final de l'entretien

**Entrées vers Interview Report**:
- Session Summary
- Conversation History
- Scores de compétence
- Analyses de réponse
- Contexte de l'entretien

**Sorties de Interview Report**:
- Rapport final
- Évaluation globale
- Recommandations
- Points forts
- Points faibles

**Moment d'appel**:
- À la fin de l'entretien

**Déterminisme**:
- Même session = même rapport
- Aucun rapport aléatoire
- Aucun rapport probabiliste

---

### 4. Learning Engine

**Responsabilité**: Apprendre des entretiens passés

**Entrées vers Learning Engine**:
- Session Summary
- Conversation History
- Scores de compétence
- Analyses de réponse
- Contexte de l'entretien

**Sorties de Learning Engine**:
- Modèles améliorés
- Règles d'adaptation améliorées
- Questions améliorées
- Stratégies améliorées

**Moment d'appel**:
- Après chaque entretien
- Périodiquement pour l'entraînement

**Déterminisme**:
- Même données d'entraînement = même apprentissage
- Aucun apprentissage aléatoire
- Aucun apprentissage probabiliste

---

### 5. Voice Analytics

**Responsabilité**: Analyser les données vocales

**Entrées vers Voice Analytics**:
- Audio des réponses
- Transcription des réponses
- Métriques vocales
- Timestamps

**Sorties de Voice Analytics**:
- Analyse vocale
- Détection d'émotion
- Détection de stress
- Détection de confiance

**Moment d'appel**:
- En temps réel pendant la réponse
- Après chaque réponse

**Déterminisme**:
- Même audio = même analyse
- Aucune analyse aléatoire
- Aucune analyse probabiliste

---

### 6. Conversation Analytics

**Responsabilité**: Analyser les données de conversation

**Entrées vers Conversation Analytics**:
- Conversation History
- Tours de parole
- Timestamps
- Métriques de conversation

**Sorties de Conversation Analytics**:
- Analyse de conversation
- Détection de patterns
- Détection d'anomalies
- Recommandations

**Moment d'appel**:
- En temps réel pendant la conversation
- À la fin de l'entretien

**Déterminisme**:
- Même conversation = même analyse
- Aucune analyse aléatoire
- Aucune analyse probabiliste

---

## Déterminisme

### Garanties de Déterminisme

✅ **Même préparation + mêmes réponses = même déroulement**
- Même Interview Preparation Intelligence = même plan d'entretien
- Même réponses du candidat = même déroulement
- Aucune variation aléatoire

✅ **Aucune décision aléatoire**
- Aucun `Math.random()`
- Aucun UUID aléatoire
- Aucune génération probabiliste

✅ **Aucune sélection aléatoire**
- Sélection des questions basée sur des règles explicites
- Sélection des relances basée sur des règles explicites
- Sélection des adaptations basée sur des règles explicites

✅ **Aucune adaptation aléatoire**
- Adaptation de difficulté basée sur des règles explicites
- Adaptation de durée basée sur des règles explicites
- Adaptation de rythme basée sur des règles explicites

✅ **Timestamps déterministes**
- Utilisation de timestamps réels pour le logging
- Utilisation de timestamps fixes pour le déterminisme des décisions

✅ **Règles explicites**
- Toutes les décisions basées sur des règles explicites
- Toutes les règles documentées
- Toutes les règles testables

---

## Explainability

### Chaque Décision Doit Être Explicable

#### Pourquoi Cette Question ?

**Explication**:
- Source: Interview Preparation Intelligence
- Preuve: Question sélectionnée selon la priorité et l'état
- Confiance: 100%
- Raison: Question correspond à l'état actuel et à la priorité la plus élevée
- Consulted: Interview Preparation Intelligence, Conversation State
- Limitations: Question peut être adaptée selon les réponses

---

#### Pourquoi Cette Relance ?

**Explication**:
- Source: Live Interview Analysis
- Preuve: Réponse incomplète détectée (durée < minimum attendu)
- Confiance: 90%
- Raison: Relance nécessaire pour obtenir une réponse complète
- Consulted: Live Interview Analysis, Silence Detection
- Limitations: Relance peut ne pas résoudre le problème

---

#### Pourquoi Ce Changement de Sujet ?

**Explication**:
- Source: Interview Preparation Intelligence
- Preuve: Toutes les questions du sujet actuel posées
- Confiance: 100%
- Raison: Sujet épuisé, passage au sujet suivant
- Consulted: Interview Preparation Intelligence, Question Queue
- Limitations: Changement peut être adapté selon le temps

---

#### Pourquoi Cette Difficulté ?

**Explication**:
- Source: Adaptive Difficulty
- Preuve: Candidat répond bien aux questions de niveau moyen
- Confiance: 85%
- Raison: Augmentation de difficulté pour tester le candidat
- Consulted: Live Interview Analysis, Adaptive Difficulty
- Limitations: Difficulté peut être réduite si le candidat échoue

---

#### Pourquoi Terminer ?

**Explication**:
- Source: Interview Timer
- Preuve: Temps maximum atteint (60 minutes)
- Confiance: 100%
- Raison: Temps maximum dépassé, terminaison de l'entretien
- Consulted: Interview Timer, Conversation State
- Limitations: Aucune

---

## Boundary Validation

### Comparaison avec Interview Preparation Intelligence

**Interview Preparation Intelligence fait**:
- Prépare l'entretien
- Détermine les questions à poser
- Définit la stratégie d'entretien
- Fournit le plan d'entretien

**Interview Preparation Intelligence ne fait PAS**:
- Ne conduit pas l'entretien
- Ne pose pas les questions
- N'analyse pas les réponses
- N'adapte pas l'entretien en temps réel

**Voice Interview Engine fait**:
- Conduit l'entretien
- Pose les questions
- Analyse les réponses (via Live Interview Analysis)
- Adapte l'entretien en temps réel

**Voice Interview Engine ne fait PAS**:
- Ne prépare pas l'entretien
- Ne détermine pas les questions à poser
- Ne définit pas la stratégie d'entretien

**Relation**: Interview Preparation Intelligence prépare l'entretien, Voice Interview Engine le conduit. Interview Preparation Intelligence fournit le plan, Voice Interview Engine exécute le plan.

---

### Comparaison avec Matching Intelligence

**Matching Intelligence fait**:
- Compare les compétences du candidat avec l'offre
- Identifie les compétences matchées et manquantes
- Compare l'expérience et la formation
- Fournit un contexte de matching

**Matching Intelligence ne fait PAS**:
- Ne conduit pas l'entretien
- Ne pose pas les questions
- N'analyse pas les réponses

**Voice Interview Engine fait**:
- Conduit l'entretien
- Pose les questions
- Analyse les réponses (via Live Interview Analysis)

**Voice Interview Engine ne fait PAS**:
- Ne compare pas les compétences
- N'identifie pas les compétences matchées et manquantes
- Ne compare pas l'expérience et la formation

**Relation**: Voice Interview Engine consomme les résultats de Matching Intelligence pour adapter l'entretien. Matching Intelligence compare les compétences, Voice Interview Engine utilise ces comparaisons pour adapter les questions.

---

### Comparaison avec Gap Intelligence

**Gap Intelligence fait**:
- Identifie les écarts entre le candidat et l'offre
- Qualifie les écarts (gravité, bloquant, compensable)
- Explique pourquoi les écarts existent
- Estime le temps d'apprentissage

**Gap Intelligence ne fait PAS**:
- Ne conduit pas l'entretien
- Ne pose pas les questions
- N'analyse pas les réponses

**Voice Interview Engine fait**:
- Conduit l'entretien
- Pose les questions
- Analyse les réponses (via Live Interview Analysis)

**Voice Interview Engine ne fait PAS**:
- N'identifie pas les écarts
- Ne qualifie pas les écarts
- N'explique pas pourquoi les écarts existent

**Relation**: Voice Interview Engine consomme les résultats de Gap Intelligence pour adapter l'entretien. Gap Intelligence identifie les écarts, Voice Interview Engine utilise ces écarts pour adapter les questions.

---

### Comparaison avec Execution Intelligence

**Execution Intelligence fait**:
- Exécute les plans d'action
- Suit les progrès
- Identifie les obstacles
- Adapte le plan

**Execution Intelligence ne fait PAS**:
- Ne conduit pas l'entretien
- Ne pose pas les questions
- N'analyse pas les réponses

**Voice Interview Engine fait**:
- Conduit l'entretien
- Pose les questions
- Analyse les réponses (via Live Interview Analysis)

**Voice Interview Engine ne fait PAS**:
- N'exécute pas les plans d'action
- Ne suit pas les progrès
- N'identifie pas les obstacles

**Relation**: Execution Intelligence et Voice Interview Engine sont indépendants. Execution Intelligence se concentre sur l'exécution du plan de développement, Voice Interview Engine se concentre sur l'entretien.

---

### Comparaison avec Planning Intelligence

**Planning Intelligence fait**:
- Transforme les recommandations en plan d'action
- Définit les étapes pour combler les écarts
- Priorise les actions
- Suit l'exécution du plan

**Planning Intelligence ne fait PAS**:
- Ne conduit pas l'entretien
- Ne pose pas les questions
- N'analyse pas les réponses

**Voice Interview Engine fait**:
- Conduit l'entretien
- Pose les questions
- Analyse les réponses (via Live Interview Analysis)

**Voice Interview Engine ne fait PAS**:
- Ne transforme pas les recommandations en plan d'action
- Ne définit pas les étapes pour combler les écarts
- Ne suit pas l'exécution du plan

**Relation**: Planning Intelligence et Voice Interview Engine sont indépendants. Planning Intelligence se concentre sur le développement du candidat, Voice Interview Engine se concentre sur l'entretien.

---

### Comparaison avec Coaching Intelligence

**Coaching Intelligence fait**:
- Fournit du coaching personnalisé
- Identifie les points à améliorer
- Suggère des améliorations
- Suit les progrès du coaching

**Coaching Intelligence ne fait PAS**:
- Ne conduit pas l'entretien
- Ne pose pas les questions
- N'analyse pas les réponses

**Voice Interview Engine fait**:
- Conduit l'entretien
- Pose les questions
- Analyse les réponses (via Live Interview Analysis)

**Voice Interview Engine ne fait PAS**:
- Ne fournit pas de coaching personnalisé
- N'identifie pas les points à améliorer
- Ne suggère pas d'améliorations

**Relation**: Voice Interview Engine transmet le contexte à Live Coaching pour le coaching en temps réel. Coaching Intelligence fournit du coaching hors entretien, Voice Interview Engine facilite le coaching en temps réel.

---

### Comparaison avec Interview Report

**Interview Report fait**:
- Compile les résultats de l'entretien
- Analyse les réponses du candidat
- Fournit une évaluation finale
- Génère le rapport d'entretien

**Interview Report ne fait PAS**:
- Ne conduit pas l'entretien
- Ne pose pas les questions
- N'adapte pas l'entretien en temps réel

**Voice Interview Engine fait**:
- Conduit l'entretien
- Pose les questions
- Adapte l'entretien en temps réel

**Voice Interview Engine ne fait PAS**:
- Ne compile pas les résultats de l'entretien
- N'analyse pas les réponses du candidat
- Ne fournit pas d'évaluation finale

**Relation**: Voice Interview Engine fournit les données à Interview Report. Voice Interview Engine conduit l'entretien, Interview Report compile les résultats.

---

### Comparaison avec Learning Engine

**Learning Engine fait**:
- Apprend des entretiens passés
- Améliore les modèles
- Améliore les règles d'adaptation
- Améliore les questions

**Learning Engine ne fait PAS**:
- Ne conduit pas l'entretien
- Ne pose pas les questions
- N'adapte pas l'entretien en temps réel

**Voice Interview Engine fait**:
- Conduit l'entretien
- Pose les questions
- Adapte l'entretien en temps réel

**Voice Interview Engine ne fait PAS**:
- N'apprend pas des entretiens passés
- N'améliore pas les modèles
- N'améliore pas les règles d'adaptation

**Relation**: Voice Interview Engine fournit les données à Learning Engine. Voice Interview Engine conduit l'entretien, Learning Engine apprend des données.

---

### Conclusion Boundary Validation

✅ **VALIDATED**: Voice Interview Engine ne partage aucune responsabilité avec les intelligences existantes et futures. Son rôle est strictement limité à la conduite de l'entretien.

**Responsabilités uniques**:
- Conduite de l'entretien
- Gestion de la conversation
- Pose des questions
- Écoute du candidat
- Gestion des tours de parole
- Adaptation du rythme
- Transmission du contexte aux intelligences d'analyse

**Responsabilités non partagées**:
- Préparation de l'entretien (Interview Preparation Intelligence)
- Matching (Matching Intelligence)
- Identification des écarts (Gap Intelligence)
- Exécution (Execution Intelligence)
- Planification (Planning Intelligence)
- Coaching (Coaching Intelligence)
- Rapport final (Interview Report)
- Apprentissage (Learning Engine)

---

## Performance

### Ordre d'Exécution

**Pipeline d'exécution en temps réel**:

1. **Interview Preparation Intelligence** (avant l'entretien)
   - Prépare le plan d'entretien
   - Fournit la file de questions

2. **Voice Interview Engine** (pendant l'entretien)
   - Conduit l'entretien
   - Gère la conversation
   - Pose les questions
   - Écoute les réponses

3. **Live Interview Analysis** (pendant l'entretien)
   - Analyse les réponses en temps réel
   - Fournit des recommandations

4. **Live Coaching** (pendant l'entretien)
   - Fournit du coaching en temps réel
   - Suggère des améliorations

5. **Interview Report** (après l'entretien)
   - Compile les résultats
   - Génère le rapport

6. **Learning Engine** (après l'entretien)
   - Apprend des données
   - Améliore les modèles

### Pipeline

**Pipeline temps réel**:
- Voice Interview Engine orchestre le pipeline
- Live Interview Analysis est appelé après chaque réponse
- Live Coaching est appelé après chaque analyse
- Interview Report est appelé à la fin
- Learning Engine est appelé périodiquement

### Réutilisation Maximale

**Réutilisation de Interview Preparation Intelligence**:
- Utilise le plan d'entretien
- Utilise la file de questions
- Utilise la stratégie d'entretien
- Utilise les règles d'adaptation

**Réutilisation de Matching Intelligence**:
- Utilise les compétences matchées
- Utilise les compétences manquantes
- Utilise la comparaison d'expérience

**Réutilisation de Gap Intelligence**:
- Utilise les écarts identifiés
- Utilise la gravité des écarts
- Utilise les écarts bloquants

### Aucun Recalcul

**Pas de re-calcul de matching**:
- Le matching est déjà fait par Matching Intelligence
- Aucun recalcul nécessaire

**Pas de re-calcul d'écarts**:
- Les écarts sont déjà calculés par Gap Intelligence
- Aucun recalcul nécessaire

**Pas de re-calcul de plan d'entretien**:
- Le plan d'entretien est déjà préparé par Interview Preparation Intelligence
- Aucun recalcul nécessaire

### Temps Réel

**Latence minimale**:
- Détection de parole: < 100ms
- Transcription: < 500ms
- Analyse de réponse: < 1s
- Adaptation: < 100ms
- Total: < 2s

**Optimisations**:
- Streaming de l'audio
- Analyse en temps réel
- Mise en cache des modèles
- Préchargement des questions

---

## Préparer les Futures Intégrations

### Dashboard

**Intégration**:
- Afficher l'état de l'entretien en temps réel
- Afficher les questions posées
- Afficher les réponses reçues
- Afficher les scores en temps réel

**Données transmises**:
- Conversation State
- Current Question
- Current Answer
- Interview Timer
- Session Summary

---

### Digital Twin

**Intégration**:
- Ajouter `interviewContext` au Digital Twin
- Stocker les résultats de l'entretien
- Stocker les scores de compétence

**Données transmises**:
- Interview Plan
- Conversation History
- Scores de compétence
- Session Summary

---

### Timeline

**Intégration**:
- Publier des événements Timeline
- InterviewStarted, QuestionAsked, CandidateStartedSpeaking, CandidateStoppedSpeaking, InterviewFinished

**Événements**:
- InterviewStarted
- QuestionAsked
- CandidateStartedSpeaking
- CandidateStoppedSpeaking
- SilenceDetected
- QuestionRepeated
- FollowUpTriggered
- InterviewPaused
- InterviewResumed
- InterviewFinished

---

### Career Chat

**Intégration**:
- Ajouter `interviewContext` au contexte du Chat
- Permettre au Chat de répondre aux questions sur l'entretien

**Données transmises**:
- Interview Plan
- Conversation History
- Scores de compétence
- Session Summary

---

### Voice Analytics

**Intégration**:
- Transmettre l'audio des réponses
- Transcrire les réponses
- Analyser les métriques vocales

**Données transmises**:
- Audio des réponses
- Transcription des réponses
- Métriques vocales
- Timestamps

---

### Final Report

**Intégration**:
- Transmettre les données de l'entretien
- Générer le rapport final

**Données transmises**:
- Session Summary
- Conversation History
- Scores de compétence
- Analyses de réponse

---

### Learning

**Intégration**:
- Transmettre les données de l'entretien
- Améliorer les modèles

**Données transmises**:
- Session Summary
- Conversation History
- Scores de compétence
- Analyses de réponse

---

## Livrable Attendu

### Document Unique

**FEATURE_05_VOICE_INTERVIEW_ARCHITECTURE_REVIEW.md**

Ce document est la référence unique pour toute l'implémentation du moteur vocal.

**Contenu du document**:
- Résumé exécutif
- Position dans le pipeline
- Responsabilité unique
- Composants logiques (15 composants)
- États de l'entretien (13 états)
- Événements (13 événements)
- Gestion de la conversation
- Mémoire de conversation
- Règles d'adaptation
- Interfaces avec les futures intelligences (6 intelligences)
- Déterminisme
- Explainability
- Boundary Validation
- Performance
- Futures intégrations (7 intégrations)

**Utilisation du document**:
- Référence pour l'implémentation de Voice Interview Engine
- Référence pour l'implémentation de Live Interview Analysis
- Référence pour l'implémentation de Live Coaching
- Référence pour l'intégration dans le pipeline
- Référence pour les tests et validations

---

## Contraintes Absolues Respectées

✅ **Aucun fichier source modifié**
- Aucun fichier TypeScript modifié
- Aucun fichier React modifié
- Aucun fichier de configuration modifié

✅ **Aucun moteur créé**
- Aucun moteur d'intelligence créé
- Aucun moteur de traitement créé
- Aucun moteur d'analyse créé

✅ **Aucun Prompt IA créé**
- Aucun prompt IA créé
- Aucun template créé
- Aucune configuration IA créée

✅ **Aucun composant React créé**
- Aucun composant React créé
- Aucun widget créé
- Aucun hook créé

✅ **Aucune logique métier ajoutée**
- Aucune logique métier implémentée
- Aucune règle métier implémentée
- Aucun algorithme implémenté

✅ **Aucune architecture modifiée**
- Aucun nouveau composant architectural
- Aucune modification de composant existant
- Aucune nouvelle dépendance

---

## Conclusion

**Statut**: 📝 ARCHITECTURE REVIEW COMPLETED

**Document créé**: FEATURE_05_VOICE_INTERVIEW_ARCHITECTURE_REVIEW.md

**Validations**:
- ✅ Aucun fichier source modifié
- ✅ Aucun moteur créé
- ✅ Aucun composant React créé
- ✅ Aucun Prompt IA créé
- ✅ Aucune logique métier ajoutée
- ✅ Aucune architecture modifiée
- ✅ Documentation complète
- ✅ Boundary Validation effectuée
- ✅ Performance décrite
- ✅ Déterminisme garanti
- ✅ Explainability définie

**Prochaines étapes**:
- Implémentation de Voice Interview Engine (future)
- Implémentation de Live Interview Analysis (future)
- Implémentation de Live Coaching (future)
- Intégration dans le pipeline (future)

---

**Document maintenu par**: Devin.ai
**Date de création**: 10 juillet 2026
**Version**: 1.0
**Statut**: ARCHITECTURE REVIEW COMPLETED
**Type**: Documentation uniquement - Aucune implémentation
