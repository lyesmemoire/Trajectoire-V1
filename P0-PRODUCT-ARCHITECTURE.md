# P0 — Product Layer Architecture

## 🎯 Objectif
P0 n'exécute aucune logique métier. Il fournit uniquement :
* Multi-tenant isolation
* API publique
* Persistance des sessions et artefacts P7.5
* Orchestration runtime (P6)
* Queueing / streaming
* Observabilité production
* Scaling horizontal

Principe fondamental :
```text
P0 = "Infrastructure de distribution"
P4–P7 = "Machine de décision pure"
```

---

## 1. Architecture globale

```
            ┌──────────────────────────────┐
            │        CLIENT APPS           │
            │ (Web / Mobile / API users)   │
            └────────────┬─────────────────┘
                         │ HTTP / WS
                         ▼
        ┌──────────────────────────────────────┐
        │            P0 API GATEWAY            │
        │  (Auth / Routing / Rate Limit / MQ)  │
        └────────────┬─────────────────────────┘
                     │
     ┌───────────────┼────────────────────────────┐
     ▼               ▼                            ▼
┌──────────┐  ┌──────────────┐           ┌────────────────┐
│ Tenant   │  │ Session      │           │ Report Store   │
│ Resolver │  │ Orchestrator │           │ (P7.5 outputs) │
└──────────┘  └──────┬───────┘           └────────────────┘
                     │
                     ▼
        ┌──────────────────────────────┐
        │        P6 Runtime Core       │
        │ (ORCHESTRATOR + COLLECTOR)   │
        └────────────┬─────────────────┘
                     ▼
        ┌──────────────────────────────┐
        │   P7 Evaluation Pipeline     │
        │ (offline / async workers)    │
        └──────────────────────────────┘
```

---

## 2. Composants P0

### 2.1 API Gateway (`p0/api-gateway`)
Responsabilités : Auth JWT / OAuth, Rate limiting, Tenant routing, WebSocket upgrade, Request validation.
❌ Ne connaît pas P7 logique, ne touche pas P5 state, ne contient aucun scoring.

### 2.2 Tenant Isolation Layer (`p0/tenancy`)
Chaque requête est taggée par `TenantContext`. Isolation garantie : sessions par tenant, traces séparées, reports isolés, quotas indépendants.

### 2.3 Session Service (`p0/sessions`)
Création session, mapping websocket → session, lifecycle storage pointer, delegation vers P6.
❌ PAS de logique métier, PAS de scoring, PAS de trace interne P5.

### 2.4 Event Bus (Redis Streams / Kafka / NATS)
Topics : `session.events`, `runtime.commands`, `evaluation.jobs`, `report.generated`.

### 2.5 Storage Layer
1. **Operational DB (PostgreSQL)** : sessions, tenants, metadata.
2. **Trace Storage (immutable)** : RuntimeTrace.
3. **Artifact Storage** : JSON reports, PDF reports, audit packs.

### 2.6 Worker Layer (P7 execution)
Workers isolés (`evaluation-worker`, `ranking-worker`, `report-worker`) exécutant P7 hors du runtime critique.

---

## 3. API Surface (Public)
* Sessions : `POST /v1/sessions`, `GET /v1/sessions/:id`, `DELETE /v1/sessions/:id`
* Runtime : `WS /v1/runtime/:sessionId`
* Reports : `GET /v1/reports/:sessionId`, `GET /v1/reports/:sessionId/pdf`, `GET /v1/reports/:sessionId/audit`
* Evaluation : `GET /v1/evaluations/:sessionId`, `GET /v1/rankings?tenantId=`

---

## 4. Road Map
- **P0.1** — API Gateway implementation
- **P0.2** — Tenant isolation runtime
- **P0.3** — Event bus wiring
- **P0.4** — Session persistence model
- **P0.5** — Worker system (P7 integration)
