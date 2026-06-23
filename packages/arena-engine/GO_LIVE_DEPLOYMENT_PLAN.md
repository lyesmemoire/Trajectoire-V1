# 🚀 GO LIVE DEPLOYMENT PLAN — INTERVO.IO / SIL SYSTEM

---

# 🧭 0. OBJECTIF DU GO LIVE

Déployer un système :

* event-driven (SIL)
* transactional (Postgres)
* AI-powered (Mistral / OpenAI)
* monetized (Stripe)
* auditable (Merkle Ledger)

👉 sans perte de données
👉 sans double charge utilisateur
👉 sans divergence de replay

---

# 🧱 1. PRE-DEPLOY CHECKLIST (OBLIGATOIRE)

## ✔️ INFRASTRUCTURE

### Backend

* [ ] Postgres production instance ready
* [ ] connection pooling (PgBouncer recommandé)
* [ ] migrations executed (zero pending)
* [ ] indexes verified (events, ledger, sessions)

### Event System

* [ ] Kafka cluster running (or equivalent queue)
* [ ] partitions aligned with `tenantId + sessionId`
* [ ] consumer lag monitoring active

### AI Layer

* [ ] Mistral / OpenAI keys in secret manager
* [ ] rate limits configured
* [ ] fallback behavior defined (retry / degrade)

---

## ✔️ SECURITY

* [ ] `SERVICE_ROLE_KEY` not exposed client-side
* [ ] `/api/admin` fully protected via `requireAdmin()`
* [ ] middleware enforcing auth globally
* [ ] Stripe webhook signature verification active
* [ ] RLS enabled on Supabase tables

---

## ✔️ BILLING (CRITICAL)

* [ ] Stripe webhooks:
  * `payment_intent.succeeded`
  * `checkout.session.completed`
* [ ] idempotency verified (`stripe_events` table unique constraint)
* [ ] credit ledger consistency validated
* [ ] no direct credit mutation without ledger entry

---

## ✔️ DATA SAFETY

* [ ] backups enabled (Postgres daily snapshot)
* [ ] restore procedure tested
* [ ] event store append-only enforced
* [ ] no UPDATE/DELETE on `events` table (except admin repair tools)

---

# ⚙️ 2. DEPLOYMENT ARCHITECTURE

## 🌐 SYSTEM FLOW

```text
Client
  ↓
Next.js API
  ↓
SIL Ingestor
  ↓
Kafka (buffer/order)
  ↓
Postgres EventStore (source of truth)
  ↓
Merkle Ledger (audit layer)
  ↓
Replay Engine (read model)
```

---

# 🧠 3. SCALING MODEL

## 📈 HORIZONTAL SCALING

### SIL Nodes

* stateless workers
* scale by session hash routing
```text
node = hash(tenantId + sessionId) % N
```
👉 allows infinite horizontal scale

---

### API Layer

* stateless Next.js instances
* autoscale via CPU or RPS

---

### Event Processing

* Kafka partitions scale linearly
* consumer groups per tenant shard

---

## 🧱 DATABASE SCALING

### Postgres

* partition by `tenant_id`
* optional future: TimescaleDB extension

Recommended:
```text
events_{tenant_id_hash}
ledger_batches_{date}
```

---

### Read Scaling

* Replay Engine cache layer (Redis optional)
* snapshot table (`session_snapshots`) already in place

---

# 🔥 4. PERFORMANCE TARGETS (SLOs)

## WRITE PATH

| Metric            | Target                |
| ----------------- | --------------------- |
| ingestion latency | < 50ms p95            |
| event write       | < 10ms Postgres batch |
| Kafka ack         | < 30ms                |

---

## READ PATH

| Metric              | Target  |
| ------------------- | ------- |
| replay session      | < 200ms |
| snapshot load       | < 20ms  |
| ledger verification | < 100ms |

---

## AI LAYER

| Metric           | Target  |
| ---------------- | ------- |
| ATS analysis     | < 3s    |
| CV optimization  | < 5–10s |
| fallback timeout | 15s max |

---

# 🧯 5. FAILURE MODES (IMPORTANT)

## 🔴 Kafka outage
* system still works in degraded mode
* Postgres becomes direct queue fallback

## 🔴 Postgres latency spike
* batch writer throttles ingestion
* backpressure to API layer

## 🔴 AI failure
* retry once
* fallback cached response optional
* user not blocked permanently

## 🔴 Node failure (SIL)
* stateless → safe
* replay reconstructs state
* no data loss

---

# 🔐 6. SECURITY & AUDIT MODEL

## ADMIN ACTIONS
Every action must produce:
```text
audit_log {
  actor_id
  action
  target
  diff
  timestamp
  ip
}
```

## STRIPE
* webhook signature validation
* idempotent event processing
* credit ledger immutable

## DATA INTEGRITY
* Merkle root per batch
* replay hash verification
* tamper detection = instant rejection

---

# 📊 7. OBSERVABILITY STACK (MINIMUM REQUIRED)

## METRICS
* ingestion rate
* replay latency
* AI response time
* Stripe conversion rate
* error rate per endpoint

## LOGS
* structured JSON logs
* correlation ID = sessionId

## TRACING (HIGH VALUE)
Flow:
```text
request → event → kafka → postgres → replay → response
```

---

# 🚀 8. DEPLOYMENT STRATEGY

## 🟢 PHASE 1 — CANARY (RECOMMENDED)
* 5% traffic
* only ATS + CV flow
* monitor error rate

## 🟡 PHASE 2 — GRADUAL SCALE
* 25% → 50% → 100%
* enable referral system last

## 🔴 PHASE 3 — FULL PRODUCTION
* all modules enabled
* freeze infra changes
* only patch mode allowed

---

# 🧠 9. POST-LAUNCH RULES

## ❌ FORBIDDEN
* schema changes without migration plan
* modifying SIL core logic
* bypassing ledger
* disabling idempotency

## ✔️ ALLOWED
* UI fixes
* performance tuning
* observability improvements
