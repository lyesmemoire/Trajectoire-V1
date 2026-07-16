# P0.3 — EVENT BUS DESIGN (Kafka-first)

## 1. POSITIONNEMENT
```text
P0 API Gateway → Event Bus → P6 / P7 / Workers
```
L'Event Bus est :
- **le seul système asynchrone central**
- **source de vérité temporelle**
- **buffer de résilience**
- **mécanisme de replay**

---

## 2. TOPICS DESIGN

### 2.1 Runtime ingestion
- `runtime.command.v1`
- `runtime.event.v1`
- `runtime.trace.v1`

### 2.2 Evaluation pipeline
- `evaluation.job.v1`
- `evaluation.result.v1`

### 2.3 Ranking pipeline
- `ranking.job.v1`
- `ranking.result.v1`

### 2.4 Reporting pipeline
- `report.job.v1`
- `report.generated.v1`

### 2.5 System events
- `session.created.v1`
- `session.closed.v1`
- `tenant.quota.updated.v1`

### 2.6 Dead Letter Queue (DLQ)
- `dlq.runtime.v1`, `dlq.evaluation.v1`, `dlq.report.v1`

---

## 3. PARTITIONING STRATEGY
**ORDERING = SESSION-LEVEL**
```text
partitionKey = sessionId
```
Scaling horizontal par ajout de partitions (ex: 64 minimum en prod).

---

## 4. IDENTITY & IDEMPOTENCY MODEL

### Event Envelope
```ts
{
  eventId: string,        // UUID v7
  sessionId: string,
  tenantId: string,
  type: string,
  version: 1,
  timestamp: number,
  payload: unknown,
  idempotencyKey: string
}
```

### Idempotency Rule
Chaque consumer garantit `IF eventId already processed → ignore`.
Stockage : Redis SET NX (short term), Postgres UNIQUE constraint (long term).

---

## 5. REPLAY SYSTEM (CRITIQUE)
Kafka permet de rewind et rebuild l'état (Full session replay, Partial replay, Deterministic rebuild de RuntimeTrace).

---

## 6. DELIVERY GUARANTEE & FAILURE
- **At-least-once delivery** + Idempotence.
- **DLQ** : 3 retries max avec backoff exponentiel.

---

## 7. MULTI-TENANT ISOLATION
- Single cluster + tenant-aware partition key (L1)
- L'Event Envelope **DOIT** contenir `tenantId`.

---

## 8. CONSISTENCY MODEL
```text
Event Bus = source of truth temporal
Database = materialized view
P7 = derived computation
```
