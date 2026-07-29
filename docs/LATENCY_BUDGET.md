# Latency Budget

## Version

**Version** : 1.0.0  
**Date** : 2024-01-23  
**Auteur** : Distinguished Engineer  
**Statut** : Draft

---

## Objectif

Ce document définit le budget de latence par composant pour l'architecture V2, avec une règle stricte : latence bout-en-bout < 300ms pour une expérience utilisateur optimale.

---

## Budget par Composant

| Composant | Latence (ms) | Justification |
|-----------|--------------|---------------|
| **Gateway** | 5 | Traitement des messages WebSocket |
| **Redis** | 3 | Lecture/écriture dans Redis (cache/event bus) |
| **Session Manager** | 8 | Gestion de l'état de session |
| **Planner** | 15 | Planification du tour (compétence, difficulté) |
| **Director** | 12 | Décision du stage suivant |
| **Context Builder** | 18 | Construction et filtrage du contexte |
| **Prompt Orchestrator** | 20 | Orchestration multi-couches des prompts |
| **AI Guard** | 10 | Validation et correction des réponses |
| **OpenAI** | 140 | Génération de la réponse (Realtime API) |
| **Voice Return** | 40 | Retour audio (TTS + streaming) |
| **Total** | **271** | **Respecte le budget** |

---

## Règle de Budget

### Règle Principale

**Latence bout-en-bout < 300ms**

Cette règle s'applique à :
- Latence totale de bout-en-bout (de l'input utilisateur à la réponse audio)
- Latence P95 (95e percentile)
- Latence P99 (99e percentile)

### Exceptions

**Phase d'initialisation** (premier tour)
- Budget étendu à 500ms
- Justification : Initialisation du contexte complet
- Une seule fois par session

**Phase d'évaluation** (tour final)
- Budget étendu à 400ms
- Justification : Synthèse complète de l'entretien
- Une seule fois par session

---

## Détail par Composant

### Gateway (5ms)

**Responsabilités**
- Réception des messages WebSocket
- Parsing des messages
- Routing vers le bon handler
- Sérialisation des réponses

**Optimisation**
- Utiliser des buffers réutilisables
- Éviter les allocations inutiles
- Parser binaire si possible

**Monitoring**
- Mesurer le temps de traitement par message
- Alert si > 10ms P95

---

### Redis (3ms)

**Responsabilités**
- Lecture/écriture dans Redis (cache/event bus)
- Opérations sur Redis Streams
- Opérations sur Redis (cache)

**Optimisation**
- Utiliser pipelining pour les opérations multiples
- Utiliser des connexions persistantes
- Partitionner les streams par session

**Monitoring**
- Mesurer le temps de lecture/écriture
- Alert si > 10ms P95

---

### Session Manager (8ms)

**Responsabilités**
- Gestion de l'état de session
- Création des événements
- Signature des événements
- Écriture dans Event Store

**Optimisation**
- Utiliser des snapshots pour éviter la reconstitution complète
- Écrire les événements en asynchrone
- Utiliser des buffers pour les événements

**Monitoring**
- Mesurer le temps de gestion d'état
- Alert si > 20ms P95

---

### Planner (15ms)

**Responsabilités**
- Sélection de la compétence
- Détermination de la difficulté
- Sélection du type de question
- Génération du plan du tour

**Optimisation**
- Utiliser des règles pré-calculées
- Cacher les plans récurrents
- Utiliser des heuristiques simples

**Monitoring**
- Mesurer le temps de planification
- Alert si > 30ms P95

---

### Director (12ms)

**Responsabilités**
- Analyse de la réponse du candidat
- Évaluation de la performance
- Décision du stage suivant
- Adaptation de la difficulté

**Optimisation**
- Utiliser des règles simples
- Cacher les décisions récurrentes
- Utiliser des heuristiques

**Monitoring**
- Mesurer le temps de décision
- Alert si > 25ms P95

---

### Context Builder (18ms)

**Responsabilités**
- Chargement de la mémoire
- Chargement de l'historique
- Chargement des évaluations
- Filtrage et priorisation
- Optimisation de la taille

**Optimisation**
- Cacher les contextes récurrents
- Utiliser des filtres pré-calculés
- Paralleliser les chargements

**Monitoring**
- Mesurer le temps de construction
- Alert si > 40ms P95

---

### Prompt Orchestrator (20ms)

**Responsabilités**
- Construction du prompt système
- Construction du prompt persona
- Construction du prompt contexte
- Construction du prompt instruction
- Assemblage du prompt final

**Optimisation**
- Utiliser des templates pré-compilés
- Cacher les prompts récurrents
- Utiliser des chaînes de caractères optimisées

**Monitoring**
- Mesurer le temps d'orchestration
- Alert si > 50ms P95

---

### AI Guard (10ms)

**Responsabilités**
- Réception de la réponse OpenAI
- Validation du contenu
- Vérification de la cohérence
- Correction si nécessaire

**Optimisation**
- Utiliser des règles simples
- Validation asynchrone (fire-and-forget)
- Cacher les validations récurrentes

**Monitoring**
- Mesurer le temps de validation
- Alert si > 25ms P95

---

### OpenAI (140ms)

**Responsabilités**
- Envoi du prompt à OpenAI Realtime API
- Génération de la réponse
- Réception de la réponse

**Optimisation**
- Utiliser OpenAI Realtime API (plus rapide que REST)
- Utiliser des prompts optimisés (budget tokens)
- Utiliser le streaming

**Monitoring**
- Mesurer le temps de génération
- Alert si > 200ms P95

---

### Voice Return (40ms)

**Responsabilités**
- TTS (Text-to-Speech)
- Streaming audio
- Lecture audio

**Optimisation**
- Utiliser OpenAI Realtime API (TTS intégré)
- Utiliser des buffers audio
- Précharger les voix

**Monitoring**
- Mesurer le temps de retour audio
- Alert si > 80ms P95

---

## Monitoring du Budget

### KPIs

- **Latence moyenne** : Moyenne de la latence bout-en-bout
- **Latence P95** : 95e percentile de la latence bout-en-bout
- **Latence P99** : 99e percentile de la latence bout-en-bout
- **Budget respecté** : Pourcentage de tours qui respectent le budget (< 300ms)
- **Budget dépassé** : Pourcentage de tours qui dépassent le budget (> 300ms)

### Alertes

- **Alerte warning** : Si latence P95 > 250ms
- **Alerte critical** : Si latence P95 > 300ms
- **Alerte emergency** : Si latence P95 > 400ms

### Logging

- Loguer chaque tour avec :
  - Latence par composant
  - Latence totale
  - Budget respecté (oui/non)
  - Composants lents

---

## Scénarios de Latence

### Scénario 1 : Tour Normal

**Latence par composant**
- Gateway : 5ms
- Redis : 3ms
- Session Manager : 8ms
- Planner : 15ms
- Director : 12ms
- Context Builder : 18ms
- Prompt Orchestrator : 20ms
- AI Guard : 10ms
- OpenAI : 140ms
- Voice Return : 40ms

**Total** : 271ms

**Résultat** : Budget respecté (271 < 300ms)

---

### Scénario 2 : Tour avec Context Builder Lent

**Latence par composant**
- Gateway : 5ms
- Redis : 3ms
- Session Manager : 8ms
- Planner : 15ms
- Director : 12ms
- Context Builder : 50ms (excess 32ms)
- Prompt Orchestrator : 20ms
- AI Guard : 10ms
- OpenAI : 140ms
- Voice Return : 40ms

**Total** : 303ms

**Résultat** : Budget dépassé (303 > 300ms)

**Mitigation**
- Optimiser le Context Builder (caching, parallelisation)
- Réduire la taille du contexte
- Utiliser des filtres pré-calculés

---

### Scénario 3 : Tour avec OpenAI Lent

**Latence par composant**
- Gateway : 5ms
- Redis : 3ms
- Session Manager : 8ms
- Planner : 15ms
- Director : 12ms
- Context Builder : 18ms
- Prompt Orchestrator : 20ms
- AI Guard : 10ms
- OpenAI : 200ms (excess 60ms)
- Voice Return : 40ms

**Total** : 331ms

**Résultat** : Budget dépassé (331 > 300ms)

**Mitigation**
- Optimiser le prompt (réduire les tokens)
- Utiliser un modèle plus rapide
- Utiliser le streaming

---

### Scénario 4 : Tour d'Initialisation

**Latence par composant**
- Gateway : 5ms
- Redis : 3ms
- Session Manager : 8ms
- Planner : 15ms
- Director : 12ms
- Context Builder : 18ms
- Prompt Orchestrator : 20ms
- AI Guard : 10ms
- OpenAI : 140ms
- Voice Return : 40ms

**Total** : 271ms

**Résultat** : Budget respecté (271 < 500ms, exception init)

---

### Scénario 5 : Tour d'Évaluation

**Latence par composant**
- Gateway : 5ms
- Redis : 3ms
- Session Manager : 8ms
- Planner : 15ms
- Director : 12ms
- Context Builder : 30ms (context plus gros)
- Prompt Orchestrator : 25ms (prompt plus gros)
- AI Guard : 10ms
- OpenAI : 180ms (synthèse complète)
- Voice Return : 40ms

**Total** : 328ms

**Résultat** : Budget respecté (328 < 400ms, exception évaluation)

---

## Recommandations

### Implémentation

1. **Monitoring** : Implémenter le monitoring de la latence par composant
2. **Alerting** : Implémenter les alertes (warning, critical, emergency)
3. **Logging** : Implémenter le logging de la latence par tour

### Optimisation

1. **Gateway** : Optimiser le parsing et la sérialisation
2. **Redis** : Utiliser le pipelining et les connexions persistantes
3. **Session Manager** : Utiliser des snapshots et l'écriture asynchrone
4. **Planner** : Utiliser des règles pré-calculées et du caching
5. **Director** : Utiliser des règles simples et du caching
6. **Context Builder** : Utiliser du caching et de la parallelisation
7. **Prompt Orchestrator** : Utiliser des templates pré-compilés et du caching
8. **AI Guard** : Utiliser la validation asynchrone et du caching
9. **OpenAI** : Utiliser OpenAI Realtime API et le streaming
10. **Voice Return** : Utiliser OpenAI Realtime API et des buffers audio

### Validation

1. **Unit tests** : Tester la latence de chaque composant
2. **Integration tests** : Tester la latence bout-en-bout
3. **Load tests** : Tester la latence sous charge

---

## Conclusion

Le budget de latence est défini à 300ms bout-en-bout, avec des exceptions pour l'initialisation (500ms) et l'évaluation (400ms). Le budget respecte cette règle avec 271ms.

Le monitoring de la latence est essentiel pour assurer le respect de la règle et détecter les composants lents. Des optimisations sont proposées pour chaque composant.

Les scénarios de latence montrent que le budget peut être dépassé dans certains cas (Context Builder lent, OpenAI lent), mais des mitigations sont proposées pour chaque cas.
