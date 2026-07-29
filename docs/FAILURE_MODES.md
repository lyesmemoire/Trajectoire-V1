# Failure Modes

## Version

**Version** : 1.0.0  
**Date** : 2024-01-23  
**Auteur** : Distinguished Engineer  
**Statut** : Draft

---

## Objectif

Ce document définit les modes de défaillance de l'architecture V2 et les fallbacks associés pour assurer la résilience du système.

---

## Matrice des Modes de Défaillance

| Composant | Mode de Défaillance | Impact | Fallback | Monitoring |
|-----------|---------------------|--------|---------|------------|
| **OpenAI** | Indisponible | High | Fallback vers Mistral | Health check |
| **OpenAI** | Rate limit | High | Queue + Retry | Rate limit monitoring |
| **OpenAI** | Timeout | High | Retry avec backoff | Latency monitoring |
| **Redis** | Indisponible | Medium | Replay local | Health check |
| **Redis** | Saturation | Medium | Partition streams | Memory/CPU monitoring |
| **Supabase** | Indisponible | High | Memory cache | Health check |
| **Supabase** | Timeout | Medium | Retry avec backoff | Latency monitoring |
| **WebSocket** | Perte de connexion | High | Auto-reconnect | Connection monitoring |
| **WebSocket** | Timeout | Medium | Resume session | Latency monitoring |
| **Voice** | Timeout | High | Resume session | Latency monitoring |
| **Event Store** | Indisponible | High | Memory buffer | Health check |
| **Snapshot Store** | Indisponible | Low | Reconstitution depuis events | Health check |
| **Secret Manager** | Indisponible | High | Local cache | Health check |
| **Planner** | Deadlock | High | Timeout + Fallback plan | Deadlock monitoring |
| **Director** | Indécision | Medium | Default strategy | Decision monitoring |
| **Context Builder** | Bottleneck | High | Caching + Parallelisation | Latency monitoring |
| **AI Guard** | Timeout | Medium | Validation asynchrone | Latency monitoring |
| **Prompt Orchestrator** | Overflow | High | Truncation intelligente | Token monitoring |

---

## Détail des Modes de Défaillance

### OpenAI Indisponible

**Description** : OpenAI Realtime API est indisponible (outage, maintenance).

**Impact** : High - Impossible de générer des réponses

**Fallback**
1. Fallback vers Mistral API (provider alternatif)
2. Message utilisateur : "Service temporairement indisponible, veuillez réessayer"
3. Mode dégradé : Questions pré-générées

**Monitoring**
- Health check toutes les 30s
- Alert si health check échoue
- Monitoring du taux d'erreur OpenAI

**Récupération**
- Retry avec exponential backoff (1s, 2s, 4s, 8s, 16s)
- Max 5 retries
- Après 5 retries, fallback vers Mistral

---

### OpenAI Rate Limit

**Description** : OpenAI rejette les requêtes pour cause de rate limit.

**Impact** : High - Impossible de générer des réponses

**Fallback**
1. Queue des requêtes avec retry
2. Rate limiting côté client (proactif)
3. Fallback vers Mistral API

**Monitoring**
- Monitoring du rate limit OpenAI
- Alert si rate limit > 1% des requêtes
- Monitoring de la taille de la queue

**Récupération**
- Retry après délai (ex: 60s)
- Si rate limit persiste, fallback vers Mistral

---

### OpenAI Timeout

**Description** : OpenAI ne répond pas dans le temps imparti (timeout).

**Impact** : High - Latence accrue

**Fallback**
1. Retry avec backoff
2. Timeout configurable (ex: 30s)
3. Message utilisateur : "Délai d'attente dépassé"

**Monitoring**
- Monitoring de la latence OpenAI
- Alert si latence P95 > 200ms
- Monitoring du taux de timeout

**Récupération**
- Retry avec exponential backoff (1s, 2s, 4s)
- Max 3 retries
- Après 3 retries, message utilisateur

---

### Redis Indisponible

**Description** : Redis est indisponible (outage, maintenance).

**Impact** : Medium - Dégradation des performances

**Fallback**
1. Replay local (mémoire du process)
2. Mode dégradé sans cache
3. Message utilisateur : "Performance dégradée"

**Monitoring**
- Health check toutes les 30s
- Alert si health check échoue
- Monitoring du taux d'erreur Redis

**Récupération**
- Retry avec exponential backoff (1s, 2s, 4s)
- Max 3 retries
- Après 3 retries, mode dégradé

---

### Redis Saturation

**Description** : Redis atteint sa limite de mémoire ou de CPU.

**Impact** : Medium - Dégradation des performances

**Fallback**
1. Partition des streams par session
2. TTL sur les streams (7 jours)
3. Archivage des vieux événements

**Monitoring**
- Monitoring de la mémoire Redis
- Monitoring du CPU Redis
- Alert si mémoire > 80% ou CPU > 70%

**Récupération**
- Nettoyage automatique des vieux événements
- Partition dynamique des streams

---

### Supabase Indisponible

**Description** : Supabase est indisponible (base de données ou storage).

**Impact** : High - Impossible de créer/sauvegarder des sessions

**Fallback**
1. Read replica pour lecture
2. Cache local pour les données critiques
3. Mode "offline" avec sauvegarde locale

**Monitoring**
- Health check toutes les 30s
- Alert si health check échoue
- Monitoring du taux d'erreur Supabase

**Récupération**
- Retry avec exponential backoff (1s, 2s, 4s)
- Max 3 retries
- Après 3 retries, mode offline

---

### Supabase Timeout

**Description** : Supabase ne répond pas dans le temps imparti (timeout).

**Impact** : Medium - Latence accrue

**Fallback**
1. Retry avec backoff
2. Timeout configurable (ex: 10s)
3. Cache local pour les données critiques

**Monitoring**
- Monitoring de la latence Supabase
- Alert si latence P95 > 100ms
- Monitoring du taux de timeout

**Récupération**
- Retry avec exponential backoff (1s, 2s, 4s)
- Max 3 retries
- Après 3 retries, cache local

---

### WebSocket Perte de Connexion

**Description** : La connexion WebSocket est perdue pendant l'entretien.

**Impact** : High - Session interrompue

**Fallback**
1. Auto-reconnect avec exponential backoff (1s, 2s, 4s, 8s)
2. Reprise de session depuis l'état sauvegardé
3. Heartbeat pour détecter les pertes

**Monitoring**
- Monitoring des connexions WebSocket
- Monitoring des reconnexions
- Alert si taux de reconnexion > 10%

**Récupération**
- Reconnexion automatique
- Reprise de session depuis Event Store
- Message utilisateur : "Reconnexion en cours..."

---

### WebSocket Timeout

**Description** : La connexion WebSocket timeout (pas de réponse).

**Impact** : Medium - Latence accrue

**Fallback**
1. Resume session depuis l'état sauvegardé
2. Timeout configurable (ex: 30s)
3. Message utilisateur : "Timeout, reprise en cours..."

**Monitoring**
- Monitoring de la latence WebSocket
- Alert si latence P95 > 100ms
- Monitoring du taux de timeout

**Récupération**
- Resume session depuis Event Store
- Reconnexion automatique

---

### Voice Timeout

**Description** : Le retour audio timeout (pas de réponse audio).

**Impact** : High - Expérience utilisateur dégradée

**Fallback**
1. Resume session depuis l'état sauvegardé
2. Timeout configurable (ex: 10s)
3. Message utilisateur : "Problème audio, reprise en cours..."

**Monitoring**
- Monitoring de la latence audio
- Alert si latence P95 > 100ms
- Monitoring du taux de timeout

**Récupération**
- Resume session depuis Event Store
- Reconnexion audio

---

### Event Store Indisponible

**Description** : L'Event Store (Redis Streams) est indisponible.

**Impact** : High - Impossible d'enregistrer des événements

**Fallback**
1. Memory buffer (buffer en mémoire du process)
2. Mode dégradé sans persistance
3. Message utilisateur : "Mode dégradé"

**Monitoring**
- Health check toutes les 30s
- Alert si health check échoue
- Monitoring du taux d'erreur Event Store

**Récupération**
- Retry avec exponential backoff (1s, 2s, 4s)
- Max 3 retries
- Après 3 retries, mode dégradé
- Flush du memory buffer quand Event Store revient

---

### Snapshot Store Indisponible

**Description** : Le Snapshot Store (Redis) est indisponible.

**Impact** : Low - Reconstitution plus lente

**Fallback**
1. Reconstitution depuis les événements
2. Pas de snapshot (mode dégradé)

**Monitoring**
- Health check toutes les 30s
- Alert si health check échoue
- Monitoring du taux d'erreur Snapshot Store

**Récupération**
- Retry avec exponential backoff (1s, 2s, 4s)
- Max 3 retries
- Après 3 retries, reconstitution depuis events

---

### Secret Manager Indisponible

**Description** : Le Secret Manager (Vault/AWS) est indisponible.

**Impact** : High - Impossible de démarrer l'application

**Fallback**
1. Cache local des secrets avec TTL court (ex: 5min)
2. Fallback vers variables d'environnement
3. Message admin : "Secret Manager indisponible, utilisation du cache"

**Monitoring**
- Health check toutes les 30s
- Alert si health check échoue
- Monitoring du taux d'erreur Secret Manager

**Récupération**
- Retry avec exponential backoff (1s, 2s, 4s)
- Max 3 retries
- Après 3 retries, cache local

---

### Planner Deadlock

**Description** : Le Planner entre dans un deadlock et ne peut pas progresser.

**Impact** : High - Session bloquée

**Fallback**
1. Timeout sur chaque étape de planification (ex: 10s)
2. Fallback vers un plan par défaut
3. Message admin : "Planner deadlock, fallback vers plan par défaut"

**Monitoring**
- Monitoring des deadlocks
- Alert si deadlock détecté
- Monitoring du temps de planification

**Récupération**
- Timeout automatique
- Fallback vers plan par défaut
- Logging du deadlock pour analyse

---

### Director Indécision

**Description** : Le Director ne peut pas prendre de décision (ex: scores égaux).

**Impact** : Medium - Session bloquée

**Fallback**
1. Stratégie par défaut (ex: continuer sur le même stage)
2. Randomisation en cas d'égalité
3. Message admin : "Director indecision, stratégie par défaut"

**Monitoring**
- Monitoring des indécisions
- Alert si taux d'indécision > 5%
- Logging des indécisions

**Récupération**
- Stratégie par défaut automatique
- Logging de l'indécision

---

### Context Builder Bottleneck

**Description** : Le Context Builder devient un goulot d'étranglement.

**Impact** : High - Latence accrue

**Fallback**
1. Caching des contextes
2. Parallelisation des opérations
3. Compression du contexte

**Monitoring**
- Monitoring du temps de construction
- Alert si temps P95 > 50ms
- Monitoring de la taille du contexte

**Récupération**
- Activation du caching
- Parallelisation automatique
- Compression automatique

---

### AI Guard Timeout

**Description** : L'AI Guard timeout lors de la validation.

**Impact** : Medium - Réponse non validée

**Fallback**
1. Validation asynchrone (fire-and-forget)
2. Timeout configurable (ex: 5s)
3. Fallback vers validation minimale

**Monitoring**
- Monitoring du temps de validation
- Alert si temps P95 > 10ms
- Monitoring du taux de timeout

**Récupération**
- Validation asynchrone
- Fallback vers validation minimale
- Logging du timeout

---

### Prompt Orchestrator Overflow

**Description** : Le prompt généré dépasse la limite de tokens.

**Impact** : High - Échec de la génération

**Fallback**
1. Truncation intelligente (garder les parties importantes)
2. Compression du prompt
3. Message admin : "Prompt overflow, truncation appliquée"

**Monitoring**
- Monitoring de la taille des prompts
- Alert si taille > 2000 tokens
- Monitoring du taux d'overflow

**Récupération**
- Truncation automatique
- Compression automatique
- Logging de l'overflow

---

## Stratégie de Retry

### Exponential Backoff

```
Retry 1 : 1s
Retry 2 : 2s
Retry 3 : 4s
Retry 4 : 8s
Retry 5 : 16s
```

### Max Retries

- **Critique** (OpenAI, Supabase, Secret Manager) : 5 retries
- **Moyen** (Redis, WebSocket) : 3 retries
- **Faible** (Snapshot Store) : 2 retries

### Circuit Breaker

- **Open** : Requêtes normales
- **Half-Open** : Test de récupération
- **Closed** : Fallback activé

**Thresholds**
- Open → Closed : 5 échecs consécutifs
- Closed → Half-Open : 30s
- Half-Open → Open : 3 succès consécutifs
- Half-Open → Closed : 1 échec

---

## Monitoring des Défaillances

### KPIs

- **Taux de disponibilité** : Pourcentage de temps où le système est disponible
- **Taux d'erreur** : Pourcentage de requêtes qui échouent
- **Taux de retry** : Pourcentage de requêtes qui nécessitent un retry
- **Taux de fallback** : Pourcentage de requêtes qui utilisent un fallback
- **Temps de récupération** : Temps moyen pour récupérer d'une défaillance

### Alertes

- **Alerte warning** : Si taux d'erreur > 1%
- **Alerte critical** : Si taux d'erreur > 5%
- **Alerte emergency** : Si taux d'erreur > 10%

### Logging

- Loguer chaque défaillance avec :
  - Composant
  - Type de défaillance
  - Timestamp
  - Fallback utilisé
  - Temps de récupération

---

## Scénarios de Défaillance

### Scénario 1 : OpenAI Indisponible

**Événement** : OpenAI Realtime API outage

**Impact** : High - Impossible de générer des réponses

**Fallback**
1. Retry avec exponential backoff (5 retries)
2. Fallback vers Mistral API
3. Message utilisateur : "Service temporairement indisponible"

**Récupération**
- Monitoring du health check OpenAI
- Quand OpenAI revient, arrêter le fallback
- Message utilisateur : "Service rétabli"

---

### Scénario 2 : Redis Indisponible

**Événement** : Redis outage

**Impact** : Medium - Dégradation des performances

**Fallback**
1. Retry avec exponential backoff (3 retries)
2. Replay local (mémoire du process)
3. Message utilisateur : "Performance dégradée"

**Récupération**
- Monitoring du health check Redis
- Quand Redis revient, flush du memory buffer
- Message utilisateur : "Performance rétablie"

---

### Scénario 3 : Supabase Indisponible

**Événement** : Supabase outage

**Impact** : High - Impossible de créer/sauvegarder des sessions

**Fallback**
1. Retry avec exponential backoff (3 retries)
2. Mode "offline" avec sauvegarde locale
3. Message utilisateur : "Mode offline"

**Récupération**
- Monitoring du health check Supabase
- Quand Supabase revient, flush de la sauvegarde locale
- Message utilisateur : "Mode online"

---

### Scénario 4 : WebSocket Perte de Connexion

**Événement** : Perte de connexion WebSocket

**Impact** : High - Session interrompue

**Fallback**
1. Auto-reconnect avec exponential backoff (4 retries)
2. Reprise de session depuis l'état sauvegardé
3. Message utilisateur : "Reconnexion en cours..."

**Récupération**
- Reconnexion automatique
- Reprise de session depuis Event Store
- Message utilisateur : "Reconnecté"

---

### Scénario 5 : Secret Manager Indisponible

**Événement** : Secret Manager outage

**Impact** : High - Impossible de démarrer l'application

**Fallback**
1. Retry avec exponential backoff (3 retries)
2. Cache local des secrets (TTL 5min)
3. Message admin : "Secret Manager indisponible, utilisation du cache"

**Récupération**
- Monitoring du health check Secret Manager
- Quand Secret Manager revient, rafraîchir le cache
- Message admin : "Secret Manager rétabli"

---

## Recommandations

### Implémentation

1. **Retry** : Implémenter exponential backoff pour tous les composants
2. **Circuit Breaker** : Implémenter circuit breaker pour les composants critiques
3. **Fallback** : Implémenter des fallbacks pour tous les modes de défaillance
4. **Monitoring** : Implémenter le monitoring des défaillances (KPIs, alertes, logging)

### Tests

1. **Chaos Engineering** : Tester les modes de défaillance avec des outils comme Chaos Monkey
2. **Load Tests** : Tester la résilience sous charge
3. **Failover Tests** : Tester les basculements automatiques

### Documentation

1. **Runbooks** : Créer des runbooks pour chaque mode de défaillance
2. **Escalation** : Définir les procédures d'escalation
3. **Communication** : Définir les templates de communication utilisateur

---

## Conclusion

Le document des modes de défaillance identifie 18 modes de défaillance majeurs avec des fallbacks associés. Les points clés sont :

1. **OpenAI** : Fallback vers Mistral, retry avec backoff
2. **Redis** : Replay local, partition des streams
3. **Supabase** : Cache local, mode offline
4. **WebSocket** : Auto-reconnect, reprise de session
5. **Secret Manager** : Cache local, fallback vers variables d'environnement

Une stratégie de retry avec exponential backoff est définie, ainsi qu'un circuit breaker pour les composants critiques.

Le monitoring des défaillances est essentiel pour assurer la résilience du système.
