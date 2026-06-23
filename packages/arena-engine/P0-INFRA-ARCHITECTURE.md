# P0 — INFRA PRODUCTION ARCHITECTURE

## 1. ARCHITECTURE GLOBALE (PRODUCTION)

```text
                        ┌──────────────────────┐
                        │      CLIENTS         │
                        │ Web / Mobile / API   │
                        └─────────┬────────────┘
                                  │ HTTPS / WS
                                  ▼
                    ┌────────────────────────────┐
                    │   LOAD BALANCER (L7)       │
                    │  (AWS ALB / Cloud LB)      │
                    └────────────┬───────────────┘
                                 ▼
                ┌────────────────────────────────────┐
                │         P0 API GATEWAY CLUSTER     │
                │   (Fastify / Stateless / Autoscale)│
                └────────────┬───────────────────────┘
                             │
         ┌───────────────────┼───────────────────────┐
         ▼                   ▼                       ▼
┌──────────────┐   ┌──────────────────┐   ┌──────────────────┐
│ AUTH SERVICE │   │ TENANT SERVICE   │   │ SESSION SERVICE  │
│ (JWT/OAuth2) │   │ (Quota/Plans)    │   │ (Lifecycle meta) │
└──────────────┘   └─────────┬────────┘   └─────────┬────────┘
                             │                      │
                             └──────────┬───────────┘
                                        ▼
                           ┌────────────────────────┐
                           │   EVENT BUS LAYER      │
                           │ Kafka / NATS / Redis   │
                           └───────┬────────────────┘
                                   │
        ┌──────────────────────────┼──────────────────────────┐
        ▼                          ▼                          ▼

┌────────────────┐     ┌────────────────────┐     ┌────────────────────┐
│ P6 RUNTIME     │     │ P7 EVALUATION      │     │ P7 REPORT WORKERS  │
│ CLUSTER        │     │ CLUSTER            │     │ (PDF / JSON / API) │
└───────┬────────┘     └─────────┬──────────┘     └─────────┬──────────┘
        │                        │                          │
        ▼                        ▼                          ▼
┌────────────────────────────────────────────────────────────────┐
│                     STORAGE LAYER                              │
├──────────────────────┬───────────────────┬────────────────────┤
│ PostgreSQL (OLTP)    │ Object Storage    │ Trace Storage       │
│ tenants/sessions     │ reports/pdf/json  │ RuntimeTrace logs   │
└──────────────────────┴───────────────────┴────────────────────┘
```

---

## 2. EVENT-DRIVEN FLOW
```text
WS message
   ↓
API Gateway (P0)
   ↓
Kafka topic: runtime.command
   ↓
P6 Runtime Worker
   ↓
RuntimeTrace Collector (INFRA)
   ↓
Kafka: evaluation.job
   ↓
P7 Scoring Workers
   ↓
Kafka: report.generated
   ↓
S3 + DB + API Read Model
```

---

## 3. CLUSTERS (SCALING UNITÉ FONCTIONNELLE)
- **API Gateway Cluster** : Stateless Fastify pods, Autoscaling horizontal (CPU + RPS), WebSocket sticky sessions (ALB / Nginx)
- **P6 Runtime Cluster** : CPU-bound deterministic engine, isolation stricte, no I/O except collector hook, scaling par session density
- **P7 Evaluation Cluster** : async workers, queue-driven, batch possible (ranking P7.3), idempotent execution
- **Report Workers** : PDF generator (CPU + memory heavy), JSON exporter, audit pack builder

---

## 4. STORAGE DESIGN
1. **PostgreSQL (OLTP)** : `tenants`, `users`, `sessions`, `session_state`, `evaluation_index`
2. **Object Storage (S3/GCS)** : `/reports/{tenantId}/{sessionId}.pdf`, `/reports/{sessionId}.json`, `/audit/{sessionId}.zip`
3. **Trace Storage (append-only)** : RuntimeTrace stream → Kafka topic OR ClickHouse OR EventStoreDB (optimisé pour replay audit, P7 reconstruction, forensic analysis)

---

## 5. MULTI-TENANT ISOLATION MODEL
- **L1 — Logical isolation** : tenantId everywhere
- **L2 — Compute isolation** (optional enterprise) : dedicated worker pools
- **L3 — Storage isolation** : S3 prefix / DB schema per tenant
- **L4 — Queue isolation** : Kafka partition per tenant group

---

## 6. FAILURE MODES & RESILIENCE
- **Gateway failure** → stateless restart safe
- **Runtime crash** → replay via RuntimeTrace
- **P7 crash** → retry queue safe (idempotent)
- **Bus failure** → backpressure queue (Redis fallback buffer)

---

## 7. DESIGN PHILOSOPHY
| Layer | Nature |
| ----- | ------ |
| P4–P7 | Mathématique / déterministe (DEDS CORE) |
| P0 | Physique / distribuée (DISTRIBUTION LAYER) |
| Infra | Transport / résilience |
