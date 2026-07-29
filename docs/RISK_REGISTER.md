# Risk Register

## Version

**Version** : 1.0.0  
**Date** : 2024-01-23  
**Auteur** : Distinguished Engineer  
**Statut** : Draft

---

## Objectif

Ce document identifie, évalue et propose des mitigations pour les risques associés à la migration de l'architecture V1 vers V2.

---

## Matrice des Risques

| ID | Risque | Impact | Probabilité | Score | Mitigation | Propriétaire | Statut |
|----|--------|--------|-------------|-------|------------|--------------|---------|
| **R001** | OpenAI Realtime API change | High | Medium | High | Provider abstraction | Architecture | Open |
| **R002** | Replay incompatible | High | Low | Medium | Versioned Event Store | Domain | Open |
| **R003** | Latence >300ms | High | Medium | High | Prompt Cache | Performance | Open |
| **R004** | Redis saturation | Medium | Medium | Medium | Partition Streams | Infrastructure | Open |
| **R005** | Context trop gros | High | High | High | Context Builder | AI Guard | Open |
| **R006** | Event Store saturation | High | Medium | High | TTL + Partition | Infrastructure | Open |
| **R007** | Snapshot corruption | Medium | Low | Low | Hash verification | Event Store | Open |
| **R008** | AI Guard false positive | Medium | Medium | Medium | Tuning thresholds | AI Guard | Open |
| **R009** | Planner deadlock | High | Low | Medium | Timeout + Fallback | Planner | Open |
| **R010** | Director indecision | Medium | Medium | Medium | Default strategy | Director | Open |
| **R011** | Prompt Orchestrator overflow | High | Medium | High | Token budget | Prompt Orchestrator | Open |
| **R012** | Secret Manager outage | High | Low | Medium | Local cache fallback | Security | Open |
| **R013** | WebSocket connection loss | High | Medium | High | Auto-reconnect | Gateway | Open |
| **R014** | Supabase outage | High | Low | Medium | Read replica | Data | Open |
| **R015** | OpenAI rate limit | High | High | High | Rate limiting + Queue | AI | Open |
| **R016** | Event versioning conflict | Medium | Low | Low | Migration strategy | Event Store | Open |
| **R017** | Memory leak in Event Replayer | Medium | Medium | Medium | Memory profiling | Event Store | Open |
| **R018** | Context Builder bottleneck | High | Medium | High | Caching | Context Builder | Open |
| **R019** | AI Guard timeout | Medium | Medium | Medium | Async validation | AI Guard | Open |
| **R020** | Director wrong decision | Medium | Medium | Medium | Human override | Director | Open |

---

## Détail des Risques

### R001 : OpenAI Realtime API change

**Description** : L'API OpenAI Realtime peut changer de format ou être dépréciée.

**Impact** : High - L'application entière dépend de cette API

**Probabilité** : Medium - OpenAI évolue rapidement

**Score** : High

**Mitigation**
- Implémenter une abstraction de provider (Provider Pattern)
- Versionner les contrats d'API
- Implémenter des tests d'intégration avec mock
- Monitoring des changements d'API

**Propriétaire** : Architecture

**Statut** : Open

---

### R002 : Replay incompatible

**Description** : Les événements passés ne peuvent plus être rejoués après un changement de format.

**Impact** : High - Perte de données historiques

**Probabilité** : Low - Event Sourcing avec versioning

**Score** : Medium

**Mitigation**
- Versionner tous les événements
- Implémenter des migrations automatiques
- Garder des snapshots réguliers
- Tests de régression sur les événements

**Propriétaire** : Domain

**Statut** : Open

---

### R003 : Latence >300ms

**Description** : La latence bout-en-bout dépasse 300ms, dégradant l'expérience utilisateur.

**Impact** : High - Expérience utilisateur dégradée

**Probabilité** : Medium - Dépend de la charge

**Score** : High

**Mitigation**
- Implémenter un cache de prompts
- Optimiser le Context Builder
- Monitoring de la latence en temps réel
- Alerting si latence > threshold

**Propriétaire** : Performance

**Statut** : Open

---

### R004 : Redis saturation

**Description** : Redis atteint sa limite de mémoire ou de CPU.

**Impact** : Medium - Dégradation des performances

**Probabilité** : Medium - Dépend de la charge

**Score** : Medium

**Mitigation**
- Partitionner les streams par tenant/session
- Implémenter TTL sur les streams
- Monitoring de Redis (mémoire, CPU, connections)
- Scaling horizontal de Redis

**Propriétaire** : Infrastructure

**Statut** : Open

---

### R005 : Context trop gros

**Description** : Le contexte envoyé à OpenAI dépasse la limite de tokens.

**Impact** : High - Échec de la génération

**Probabilité** : High - Context peut croître indéfiniment

**Score** : High

**Mitigation**
- Implémenter Context Builder avec filtrage
- Définir un budget de tokens strict (2500 tokens/tour)
- Priorisation des informations
- Compression du contexte

**Propriétaire** : AI Guard

**Statut** : Open

---

### R006 : Event Store saturation

**Description** : L'Event Store (Redis Streams) atteint sa limite.

**Impact** : High - Impossible d'enregistrer de nouveaux événements

**Probabilité** : Medium - Dépend de la charge

**Score** : High

**Mitigation**
- Implémenter TTL sur les streams (7 jours)
- Partitionner les streams par session
- Archivage des vieux événements
- Monitoring de la taille des streams

**Propriétaire** : Infrastructure

**Statut** : Open

---

### R007 : Snapshot corruption

**Description** : Un snapshot est corrompu et ne peut être chargé.

**Impact** : Medium - Reconstitution plus lente

**Probabilité** : Low - Redondance avec événements

**Score** : Low

**Mitigation**
- Hash verification des snapshots
- Garder plusieurs versions de snapshots
- Fallback vers reconstitution depuis les événements
- Tests d'intégrité

**Propriétaire** : Event Store

**Statut** : Open

---

### R008 : AI Guard false positive

**Description** : L'AI Guard rejette une réponse valide d'OpenAI.

**Impact** : Medium - Expérience utilisateur dégradée

**Probabilité** : Medium - Dépend des thresholds

**Score** : Medium

**Mitigation**
- Tuning des thresholds avec des données réelles
- Mode "permissive" en cas de doute
- Logging des rejets pour analyse
- A/B testing des thresholds

**Propriétaire** : AI Guard

**Statut** : Open

---

### R009 : Planner deadlock

**Description** : Le Planner entre dans un deadlock et ne peut pas progresser.

**Impact** : High - Session bloquée

**Probabilité** : Low - Architecture simple

**Score** : Medium

**Mitigation**
- Timeout sur chaque étape de planification
- Fallback vers un plan par défaut
- Monitoring des deadlocks
- Tests de charge

**Propriétaire** : Planner

**Statut** : Open

---

### R010 : Director indecision

**Description** : Le Director ne peut pas prendre de décision (ex: scores égaux).

**Impact** : Medium - Session bloquée

**Probabilité** : Medium - Cas d'edge

**Score** : Medium

**Mitigation**
- Stratégie par défaut (ex: continuer sur le même stage)
- Randomisation en cas d'égalité
- Logging des indécisions
- Override manuel possible

**Propriétaire** : Director

**Statut** : Open

---

### R011 : Prompt Orchestrator overflow

**Description** : Le prompt généré dépasse la limite de tokens.

**Impact** : High - Échec de la génération

**Probabilité** : Medium - Dépend de la complexité

**Score** : High

**Mitigation**
- Budget de tokens strict par couche
- Truncation intelligente (garder les parties importantes)
- Compression du prompt
- Monitoring de la taille des prompts

**Propriétaire** : Prompt Orchestrator

**Statut** : Open

---

### R012 : Secret Manager outage

**Description** : Le Secret Manager (Vault/AWS) est indisponible.

**Impact** : High - Impossible de démarrer l'application

**Probabilité** : Low - Infrastructure critique

**Score** : Medium

**Mitigation**
- Cache local des secrets avec TTL court
- Fallback vers variables d'environnement
- Multi-region pour haute disponibilité
- Monitoring du Secret Manager

**Propriétaire** : Security

**Statut** : Open

---

### R013 : WebSocket connection loss

**Description** : La connexion WebSocket est perdue pendant l'entretien.

**Impact** : High - Session interrompue

**Probabilité** : Medium - Dépend de la qualité réseau

**Score** : High

**Mitigation**
- Auto-reconnect avec exponential backoff
- Reprise de session depuis l'état sauvegardé
- Heartbeat pour détecter les pertes
- Mode "offline" avec reprise

**Propriétaire** : Gateway

**Statut** : Open

---

### R014 : Supabase outage

**Description** : Supabase est indisponible (base de données ou storage).

**Impact** : High - Impossible de créer/sauvegarder des sessions

**Probabilité** : Low - Infrastructure critique

**Score** : Medium

**Mitigation**
- Read replica pour lecture
- Cache local pour les données critiques
- Mode "offline" avec sauvegarde locale
- Monitoring de Supabase

**Propriétaire** : Data

**Statut** : Open

---

### R015 : OpenAI rate limit

**Description** : OpenAI rejette les requêtes pour cause de rate limit.

**Impact** : High - Impossible de générer des réponses

**Probabilité** : High - Dépend de la charge

**Score** : High

**Mitigation**
- Rate limiting côté client (proactif)
- Queue des requêtes avec retry
- Fallback vers un autre provider (ex: Mistral)
- Monitoring des rate limits

**Propriétaire** : AI

**Statut** : Open

---

### R016 : Event versioning conflict

**Description** : Conflit de version lors de la migration des événements.

**Impact** : Medium - Reconstitution impossible

**Probabilité** : Low - Avec migration automatique

**Score** : Low

**Mitigation**
- Stratégie de migration claire
- Tests de migration sur données de production
- Rollback possible
- Monitoring des migrations

**Propriétaire** : Event Store

**Statut** : Open

---

### R017 : Memory leak in Event Replayer

**Description** : L'Event Replayer fuit de la mémoire lors de la reconstitution.

**Impact** : Medium - Crash du serveur

**Probabilité** : Medium - Dépend de la charge

**Score** : Medium

**Mitigation**
- Memory profiling
- Limitation du nombre d'événements reconstitués
- Garbage collection explicite
- Monitoring de la mémoire

**Propriétaire** : Event Store

**Statut** : Open

---

### R018 : Context Builder bottleneck

**Description** : Le Context Builder devient un goulot d'étranglement.

**Impact** : High - Latence accrue

**Probabilité** : Medium - Dépend de la charge

**Score** : High

**Mitigation**
- Caching des contextes
- Parallelisation des opérations
- Optimisation des algorithmes
- Monitoring du temps de construction

**Propriétaire** : Context Builder

**Statut** : Open

---

### R019 : AI Guard timeout

**Description** : L'AI Guard timeout lors de la validation.

**Impact** : Medium - Réponse non validée

**Probabilité** : Medium - Dépend de la charge

**Score** : Medium

**Mitigation**
- Validation asynchrone (fire-and-forget)
- Timeout configurable
- Logging des timeouts
- Fallback vers validation minimale

**Propriétaire** : AI Guard

**Statut** : Open

---

### R020 : Director wrong decision

**Description** : Le Director prend une mauvaise décision (ex: passer au mauvais stage).

**Impact** : Medium - Expérience utilisateur dégradée

**Probabilité** : Medium - Dépend de la qualité du modèle

**Score** : Medium

**Mitigation**
- Override manuel possible
- Logging des décisions
- A/B testing des stratégies
- Feedback loop pour améliorer le modèle

**Propriétaire** : Director

**Statut** : Open

---

## Matrice Impact x Probabilité

```
Probabilité
    |
High | R005 R011 R015
    | R001 R003 R006 R013 R018
    |
Med | R004 R008 R010 R011 R017 R019 R020
    | R002 R007 R012 R014 R016
    |
Low | R009
    |
    +-------------------------
      Low  Med  High  Impact
```

**Risques critiques (High x High)** : R005, R011, R015, R018

---

## Plan de Mitigation Prioritaire

### Phase 1 : Immédiat (Week 1-2)

1. **R005** : Context Builder - Implémenter le budget de tokens
2. **R011** : Prompt Orchestrator - Implémenter le budget de tokens
3. **R015** : OpenAI rate limit - Implémenter rate limiting côté client

### Phase 2 : Court terme (Week 3-4)

1. **R003** : Latence >300ms - Implémenter prompt cache
2. **R006** : Event Store saturation - Implémenter TTL et partition
3. **R013** : WebSocket connection loss - Implémenter auto-reconnect
4. **R018** : Context Builder bottleneck - Implémenter caching

### Phase 3 : Moyen terme (Week 5-8)

1. **R001** : OpenAI Realtime API change - Implémenter provider abstraction
2. **R002** : Replay incompatible - Implémenter versioned events
3. **R004** : Redis saturation - Implémenter partition
4. **R012** : Secret Manager outage - Implémenter cache local

### Phase 4 : Long terme (Week 9-12)

1. **R007** : Snapshot corruption - Implémenter hash verification
2. **R008** : AI Guard false positive - Tuning des thresholds
3. **R009** : Planner deadlock - Implémenter timeout
4. **R010** : Director indecision - Implémenter default strategy
5. **R016** : Event versioning conflict - Implémenter migration strategy
6. **R017** : Memory leak - Memory profiling
7. **R019** : AI Guard timeout - Validation asynchrone
8. **R020** : Director wrong decision - Override manuel

---

## Monitoring des Risques

### KPIs

- **R003** : Latence P95 < 300ms
- **R004** : Redis CPU < 70%, Memory < 80%
- **R005** : Context size < 2500 tokens
- **R006** : Event Store size < 10GB
- **R011** : Prompt size < 2500 tokens
- **R015** : OpenAI rate limit < 1% des requêtes
- **R018** : Context Builder time < 50ms P95

### Alertes

- **R003** : Alert si latence P95 > 300ms
- **R004** : Alert si Redis CPU > 80% ou Memory > 90%
- **R005** : Alert si context size > 2000 tokens
- **R006** : Alert si Event Store size > 8GB
- **R011** : Alert si prompt size > 2000 tokens
- **R015** : Alert si OpenAI rate limit > 0.5%
- **R018** : Alert si Context Builder time > 100ms

---

## Conclusion

Le registre des risques identifie 20 risques majeurs associés à la migration V1 → V2. Les risques critiques (High x High) sont :

1. **R005** : Context trop gros
2. **R011** : Prompt Orchestrator overflow
3. **R015** : OpenAI rate limit
4. **R018** : Context Builder bottleneck

Ces risques doivent être mitigés en priorité (Phase 1-2) pour assurer le succès de la migration.

Un plan de mitigation en 4 phases est proposé, avec des KPIs et des alertes pour monitoring continu.
