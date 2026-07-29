# Responsibility Matrix (RACI)

## Version

**Version** : 1.0.0  
**Date** : 2024-01-23  
**Auteur** : Distinguished Engineer  
**Statut** : Draft

---

## Objectif

Ce document définit la matrice RACI (Responsible, Accountable, Consulted, Informed) technique pour l'architecture V2, clarifiant les responsabilités de chaque composant pour chaque action.

---

## Légende

- **R (Responsible)** : Exécute l'action
- **A (Accountable)** : Responsable de la décision finale
- **C (Consulted)** : Consulté avant la décision
- **I (Informed)** : Informé après la décision

---

## Composants

- **Gateway** : WebSocket Gateway, gestion des connexions
- **Session Manager** : Gestion des sessions d'entretien
- **Planner** : Planification dynamique des entretiens
- **Director** : Décision de l'étape suivante
- **Context Builder** : Filtrage et optimisation du contexte
- **Prompt Orchestrator** : Orchestration multi-couches des prompts
- **AI Guard** : Validation et correction des réponses LLM
- **OpenAI** : Provider AI (OpenAI Realtime API)
- **Event Store** : Redis Streams pour Event Sourcing
- **Snapshot Store** : Redis pour optimisation
- **Supabase** : Base de données PostgreSQL
- **Event Replayer** : Reconstitution depuis les événements
- **State Reconstructor** : Reconstitution de l'état
- **Evaluation Engine** : Évaluation des compétences
- **Memory Engine** : Mémoire du candidat
- **Redis** : Cache + Event Bus
- **Secret Manager** : Gestion des secrets

---

## Matrice RACI

### Phase 1 : Initialisation de la Session

| Action | Gateway | Session Manager | Planner | Director | Context Builder | Prompt Orchestrator | AI Guard | OpenAI | Event Store | Supabase |
|--------|---------|-----------------|---------|----------|-----------------|---------------------|---------|--------|------------|----------|
| Créer la session | R | A | C | I | I | I | I | I | I | C |
| Initialiser l'état | I | R | C | I | I | I | I | I | C | I |
| Charger le plan d'entretien | I | R | A | C | I | I | I | I | I | C |
| Charger la persona | I | R | C | I | C | C | I | I | I | C |
| Charger le CV | I | R | C | I | C | C | I | I | I | C |

### Phase 2 : Planification du Tour

| Action | Gateway | Session Manager | Planner | Director | Context Builder | Prompt Orchestrator | AI Guard | OpenAI | Event Store | Supabase |
|--------|---------|-----------------|---------|----------|-----------------|---------------------|---------|--------|------------|----------|
| Choisir la prochaine compétence | I | I | R | A | C | I | I | I | I | I |
| Déterminer le niveau de difficulté | I | I | R | C | C | I | I | I | I | I |
| Sélectionner le type de question | I | I | R | C | C | I | I | I | I | I |
| Générer le plan du tour | I | I | R | A | C | I | I | I | I | I |
| Sauvegarder le plan | I | R | I | I | I | I | I | I | C | I |

### Phase 3 : Construction du Contexte

| Action | Gateway | Session Manager | Planner | Director | Context Builder | Prompt Orchestrator | AI Guard | OpenAI | Event Store | Supabase |
|--------|---------|-----------------|---------|----------|-----------------|---------------------|---------|--------|------------|----------|
| Charger la mémoire du candidat | I | I | I | I | R | I | I | I | I | C |
| Charger l'historique de conversation | I | I | I | I | R | I | I | I | C | I |
| Charger les évaluations précédentes | I | I | I | I | R | I | I | I | C | I |
| Charger le CV | I | I | I | I | R | I | I | I | I | C |
| Charger la persona | I | I | I | I | R | I | I | I | I | C |
| Filtrer et prioriser le contexte | I | I | I | I | R | C | I | I | I | I |
| Optimiser la taille du contexte | I | I | I | I | R | C | I | I | I | I |
| Valider le budget de tokens | I | I | I | I | R | A | C | I | I | I |

### Phase 4 : Orchestration du Prompt

| Action | Gateway | Session Manager | Planner | Director | Context Builder | Prompt Orchestrator | AI Guard | OpenAI | Event Store | Supabase |
|--------|---------|-----------------|---------|----------|-----------------|---------------------|---------|--------|------------|----------|
| Construire le prompt système | I | I | I | I | C | R | C | I | I | I |
| Construire le prompt persona | I | I | I | I | C | R | C | I | I | I |
| Construire le prompt contexte | I | I | I | I | R | R | C | I | I | I |
| Construire le prompt instruction | I | I | R | C | I | R | C | I | I | I |
| Assembler le prompt final | I | I | I | I | C | R | A | I | I | I |
| Valider la taille du prompt | I | I | I | I | C | R | A | I | I | I |
| Envoyer à OpenAI | I | I | I | I | I | R | C | A | I | I |

### Phase 5 : Validation AI Guard

| Action | Gateway | Session Manager | Planner | Director | Context Builder | Prompt Orchestrator | AI Guard | OpenAI | Event Store | Supabase |
|--------|---------|-----------------|---------|----------|-----------------|---------------------|---------|--------|------------|----------|
| Recevoir la réponse d'OpenAI | I | I | I | I | I | I | R | A | I | I |
| Valider le contenu | I | I | I | I | I | I | R | I | I | I |
| Vérifier la cohérence | I | I | I | I | I | I | R | I | I | I |
| Corriger si nécessaire | I | I | I | I | I | I | R | I | I | I |
| Valider le budget de tokens | I | I | I | I | I | I | R | I | I | I |
| Approuver ou rejeter | I | I | I | I | I | I | A | I | I | I |

### Phase 6 : Décision du Director

| Action | Gateway | Session Manager | Planner | Director | Context Builder | Prompt Orchestrator | AI Guard | OpenAI | Event Store | Supabase |
|--------|---------|-----------------|---------|----------|-----------------|---------------------|---------|--------|------------|----------|
| Analyser la réponse du candidat | I | I | I | R | C | I | I | I | I | I |
| Évaluer la performance | I | I | I | R | C | I | I | I | I | I |
| Décider du stage suivant | I | I | C | R | C | I | I | I | I | I |
| Adapter la difficulté | I | I | C | R | C | I | I | I | I | I |
| Déclencher une évaluation | I | I | C | R | I | I | I | I | I | C |
| Sauvegarder la décision | I | R | I | A | I | I | I | I | C | I |

### Phase 7 : Persistance des Événements

| Action | Gateway | Session Manager | Planner | Director | Context Builder | Prompt Orchestrator | AI Guard | OpenAI | Event Store | Supabase |
|--------|---------|-----------------|---------|----------|-----------------|---------------------|---------|--------|------------|----------|
| Créer l'événement | I | R | I | I | I | I | I | I | I | I |
| Valider l'événement | I | R | I | I | I | I | I | I | I | I |
| Signer l'événement | I | R | I | I | I | I | I | I | I | I |
| Écrire dans Event Store | I | R | I | I | I | I | I | I | A | I |
| Créer un snapshot | I | R | I | I | I | I | I | I | C | I |
| Écrire dans Snapshot Store | I | R | I | I | I | I | I | I | A | I |

### Phase 8 : Évaluation

| Action | Gateway | Session Manager | Planner | Director | Context Builder | Prompt Orchestrator | AI Guard | OpenAI | Event Store | Supabase |
|--------|---------|-----------------|---------|----------|-----------------|---------------------|---------|--------|------------|----------|
| Charger les événements | I | R | I | I | I | I | I | I | C | I |
| Analyser les réponses | I | I | I | I | I | I | I | I | I | R |
| Évaluer les compétences | I | I | I | I | I | I | I | I | I | R |
| Mettre à jour la mémoire | I | I | I | I | I | I | I | I | I | R |
| Sauvegarder l'évaluation | I | R | I | I | I | I | I | I | C | A |

### Phase 9 : Replay

| Action | Gateway | Session Manager | Planner | Director | Context Builder | Prompt Orchestrator | AI Guard | OpenAI | Event Store | Supabase |
|--------|---------|-----------------|---------|----------|-----------------|---------------------|---------|--------|------------|----------|
| Charger les événements | I | R | I | I | I | I | I | I | C | I |
| Charger les snapshots | I | R | I | I | I | I | I | I | C | I |
| Reconstituer l'état | I | R | I | I | I | I | I | I | C | I |
| Rejouer les événements | I | R | I | I | I | I | I | I | C | I |
| Valider l'intégrité | I | R | I | I | I | I | I | I | C | I |

### Phase 10 : Monitoring

| Action | Gateway | Session Manager | Planner | Director | Context Builder | Prompt Orchestrator | AI Guard | OpenAI | Event Store | Supabase |
|--------|---------|-----------------|---------|----------|-----------------|---------------------|---------|--------|------------|----------|
| Collecter les métriques | R | I | I | I | I | I | I | I | I | I |
| Envoyer à Sentry | R | I | I | I | I | I | I | I | I | I |
| Envoyer à OpenTelemetry | R | I | I | I | I | I | I | I | I | I |
| Envoyer à Prometheus | R | I | I | I | I | I | I | I | I | I |
| Logger les erreurs | R | I | I | I | I | I | I | I | I | I |

---

## Résumé des Responsabilités

### Gateway

**Responsible (R)**
- Créer la session
- Collecter les métriques
- Envoyer à Sentry
- Envoyer à OpenTelemetry
- Envoyer à Prometheus
- Logger les erreurs

**Accountable (A)**
- Aucune

**Consulted (C)**
- Aucune

**Informed (I)**
- Initialiser l'état
- Charger le plan d'entretien
- Charger la persona
- Charger le CV

### Session Manager

**Responsible (R)**
- Initialiser l'état
- Charger le plan d'entretien
- Charger la persona
- Charger le CV
- Sauvegarder le plan
- Créer l'événement
- Valider l'événement
- Signer l'événement
- Écrire dans Event Store
- Créer un snapshot
- Écrire dans Snapshot Store
- Charger les événements (replay)
- Charger les snapshots (replay)
- Reconstituer l'état (replay)
- Rejouer les événements (replay)
- Valider l'intégrité (replay)

**Accountable (A)**
- Créer la session

**Consulted (C)**
- Aucune

**Informed (I)**
- Sauvegarder le plan
- Sauvegarder la décision

### Planner

**Responsible (R)**
- Choisir la prochaine compétence
- Déterminer le niveau de difficulté
- Sélectionner le type de question
- Générer le plan du tour
- Construire le prompt instruction

**Accountable (A)**
- Générer le plan du tour

**Consulted (C)**
- Créer la session
- Charger le plan d'entretien
- Déterminer le niveau de difficulté
- Sélectionner le type de question
- Décider du stage suivant
- Adapter la difficulté

**Informed (I)**
- Sauvegarder le plan

### Director

**Responsible (R)**
- Analyser la réponse du candidat
- Évaluer la performance
- Décider du stage suivant
- Adapter la difficulté
- Déclencher une évaluation

**Accountable (A)**
- Choisir la prochaine compétence
- Générer le plan du tour
- Décider du stage suivant
- Sauvegarder la décision

**Consulted (C)**
- Charger le plan d'entretien
- Déterminer le niveau de difficulté
- Sélectionner le type de question
- Décider du stage suivant
- Adapter la difficulté

**Informed (I)**
- Créer la session
- Sauvegarder le plan

### Context Builder

**Responsible (R)**
- Charger la mémoire du candidat
- Charger l'historique de conversation
- Charger les évaluations précédentes
- Charger le CV
- Charger la persona
- Filtrer et prioriser le contexte
- Optimiser la taille du contexte
- Valider le budget de tokens

**Accountable (A)**
- Aucune

**Consulted (C)**
- Charger la persona
- Charger le CV
- Déterminer le niveau de difficulté
- Sélectionner le type de question
- Analyser la réponse du candidat
- Évaluer la performance
- Décider du stage suivant
- Adapter la difficulté

**Informed (I)**
- Créer la session
- Initialiser l'état
- Charger le plan d'entretien

### Prompt Orchestrator

**Responsible (R)**
- Construire le prompt système
- Construire le prompt persona
- Construire le prompt contexte
- Construire le prompt instruction
- Assembler le prompt final
- Valider la taille du prompt
- Envoyer à OpenAI

**Accountable (A)**
- Assembler le prompt final
- Valider la taille du prompt

**Consulted (C)**
- Filtrer et prioriser le contexte
- Optimiser la taille du contexte
- Valider le budget de tokens
- Construire le prompt système
- Construire le prompt persona
- Construire le prompt contexte

**Informed (I)**
- Aucune

### AI Guard

**Responsible (R)**
- Recevoir la réponse d'OpenAI
- Valider le contenu
- Vérifier la cohérence
- Corriger si nécessaire
- Valider le budget de tokens
- Approuver ou rejeter

**Accountable (A)**
- Approuver ou rejeter

**Consulted (C)**
- Valider le budget de tokens
- Construire le prompt système
- Construire le prompt persona
- Construire le prompt contexte
- Construire le prompt instruction

**Informed (I)**
- Aucune

### OpenAI

**Responsible (R)**
- Aucune

**Accountable (A)**
- Envoyer à OpenAI
- Recevoir la réponse d'OpenAI

**Consulted (C)**
- Aucune

**Informed (I)**
- Aucune

### Event Store

**Responsible (R)**
- Aucune

**Accountable (A)**
- Écrire dans Event Store

**Consulted (C)**
- Initialiser l'état
- Sauvegarder le plan
- Sauvegarder la décision
- Charger les événements
- Charger les événements (replay)
- Charger les snapshots (replay)
- Reconstituer l'état (replay)
- Rejouer les événements (replay)
- Valider l'intégrité (replay)

**Informed (I)**
- Aucune

### Supabase

**Responsible (R)**
- Analyser les réponses
- Évaluer les compétences
- Mettre à jour la mémoire
- Sauvegarder l'évaluation

**Accountable (A)**
- Sauvegarder l'évaluation

**Consulted (C)**
- Créer la session
- Charger le plan d'entretien
- Charger la persona
- Charger le CV
- Charger la mémoire du candidat
- Charger le CV
- Charger la persona
- Déclencher une évaluation

**Informed (I)**
- Initialiser l'état
- Charger l'historique de conversation
- Charger les évaluations précédentes
- Sauvegarder le plan
- Sauvegarder la décision

---

## Conclusion

La matrice RACI technique clarifie les responsabilités de chaque composant pour chaque action de l'architecture V2. Les points clés sont :

1. **Gateway** : Responsable du monitoring et de la création de session
2. **Session Manager** : Responsable de la persistance (Event Store, Snapshot Store)
3. **Planner** : Responsable de la planification des tours
4. **Director** : Responsable de la décision de stage
5. **Context Builder** : Responsable de la construction du contexte
6. **Prompt Orchestrator** : Responsable de l'orchestration des prompts
7. **AI Guard** : Responsable de la validation des réponses
8. **Event Store** : Accountable de l'écriture des événements
9. **Supabase** : Responsable de l'évaluation et de la mémoire

Cette matrice évite les dérives en clarifiant qui fait quoi, qui décide, qui est consulté et qui est informé.
