# 📖 PRODUCTION OPERATIONS MANUAL (RUN KIT)

Ce manuel définit les standards d'exploitation (Observability, Auto-scaling, Incident Response, CI/CD) pour le maintien en condition opérationnelle (MCO) du système distribué déterministe.

---

## 1. OBSERVABILITY STACK

**Objectif** : Visibilité temps réel sur la santé, la latence et les erreurs.
**Stack** : Prometheus + Grafana (Metrics), Loki/Datadog (Logs), OpenTelemetry (Tracing).

### Golden Signals (Metrics)
- **SIL / Event System** : `sil_ingest_rps`, `event_store_write_latency_ms`, `kafka_consumer_lag`, `replay_latency_ms`, `ledger_batch_time_ms`.
- **AI Layer** : `ai_request_latency_ms`, `ai_error_rate`, `fallback_trigger_count`.
- **Business** : `stripe_success_rate`, `cv_analysis_success_rate`, `ats_conversion_rate`.

### Logs (Structured JSON)
```json
{ "timestamp": "...", "level": "info|warn|error", "service": "sil|api|ai|stripe", "sessionId": "...", "event": "...", "latency_ms": 0 }
```

### Tracing (End-to-End)
Trace obligatoire : `request → ingest → kafka → postgres → ledger → replay → response`.

---

## 2. AUTO-SCALING MODEL

- **SIL Nodes (Workers)** : Scale via `max(cpu, kafka_lag, ingestion_rps)`. Triggers: CPU > 70%, Kafka lag > 1000 events.
- **API (Next.js)** : Horizontal pur. Triggers: RPS threshold, p95 latency > 300ms.
- **Postgres** : Scale vertical prioritaire → Read replicas → PgBouncer (obligatoire).
- **AI Layer** : Stratégie `Circuit + Queue` (Queue → Retry → Fallback cache si surcharge).

---

## 3. INCIDENT PLAYBOOK (SEV RESPONSE)

### 🔴 SEV-1 (Data Loss / Ledger Issue)
*Symptômes* : Divergence Replay Hash, Ledger mismatch, missing events.
*Actions* :
1. STOP ingestion SIL (Kill Switch).
2. Freeze Kafka consumer.
3. Isolate Postgres writes (Read-only mode).
4. Snapshot DB immédiat.

### 🔴 SEV-2 (Latency Spike)
*Symptômes* : Replay > 500ms, AI > 10s, Kafka lag explose.
*Actions* : Scale SIL nodes, Throttle ingestion, Activer le cache IA, Dégrader l'UX gracieusement.

### 🟡 SEV-3 (UI / Feature Bug)
*Actions* : Hotfix autorisé sans toucher à l'infrastructure.

**RÈGLE ABSOLUE :** Ne jamais toucher au Ledger ou à l'Event Store sans snapshot préalable.

---

## 4. CI/CD PIPELINE (PROD-GRADE)

1. **Lint + Typecheck** : `npm run lint`, `tsc --noEmit`.
2. **Unit Tests** : Focus sur Replay Engine, Ledger integrity, Stripe idempotency.
3. **Build** : `next build`.
4. **Migration Check** : Détection de schema drift.
5. **Staging Deploy**
6. **Synthetic Tests** : Validation des flux critiques (CV, ATS, Stripe sandbox, Replay).
7. **Canary Deploy (5%)**
8. **Full Production Rollout**

**Règles strictes** : Déploiement bloqué si pas de plan de rollback, pas de canary, ou pas de validation de migration.

---

## 5. ALERTING RULES

- **Alertes Immédiates (Paging)** : Ledger mismatch, Stripe webhook failure spike, Kafka lag explosion, Replay divergence.
- **Alertes Warnings (Slack)** : AI latency > 8s, Ingestion drop > 20%, Error rate > 2%.

---

## 6. GOLDEN RULES DE PRODUCTION

- **NEVER** : Bypasser l'Event Store, écrire directement dans les read models, désactiver l'idempotence, toucher au Ledger sans audit log.
- **ALWAYS** : Conserver l'esprit "Append-only" et "Replayable", penser observabilité en premier, assumer que tout composant peut échouer.
