# P0.4 — PERSISTENCE & STATE DESIGN

## 1. ARCHITECTURE GLOBALE
```text
             Kafka Event Bus
                    │
        ┌───────────┼────────────┐
        ▼           ▼            ▼
   Redis Cache   PostgreSQL   Object Storage
 (hot state)    (truth DB)     (reports)
```

**Rôles de P0.4 :**
1. Sessions state (live + historical)
2. Idempotency guarantees
3. Replay indexing
4. Materialized views for API reads

---

## 2. REDIS LAYER (HOT STATE / REALTIME)
- **Session active state** : `session:{sessionId}:state` (status, lastEventId, tenantId)
- **Idempotency store** : `idempotency:{eventId}` (processed: true, resultPointer)
- **WebSocket routing** : `ws:session:{sessionId}` (liste des sockets actives)
- **Replay pointer (critical)** : `replay:{sessionId}` (lastKafkaOffset, lastProcessedEventId)

*Règle :* Redis n'est jamais la source de vérité. Tout (sauf replay pointers) a un TTL.

---

## 3. POSTGRESQL (SYSTEM OF RECORD)

### Schéma
- `tenants` (id, name, plan)
- `sessions` (id, tenant_id, status, ended_at, last_event_id)
- `evaluation_results` (session_id, competency_scores, overall_score, version)
- `ranking_snapshots` (tenant_id, snapshot JSONB)
- `audit_index` (session_id, report_hash, replay_pointer)
- `session_replay_index` (session_id, start_offset, end_offset, checksum)

---

## 4. MATERIALIZED VIEWS (API READ LAYER)
L'API Gateway ne lit jamais Kafka ou le state brut. Il lit des vues pré-calculées dans Postgres :
- `session_view`
- `leaderboard_view`
- `evaluation_view`

---

## 5. CONSISTENCY MODEL & DATA PATHS

### Règle absolue
```text
ONLY Kafka can mutate truth
Postgres = projection
Redis = cache
```

### Write Path
```text
User event → Kafka → P6/P7 → Postgres write → Redis update → View refresh
```

### Read Path
```text
API Gateway → Postgres view (or Redis cache if hit) → response
```

---

## 6. REPLAY ALGORITHM (CRITICAL)
1. Get last offset (Postgres)
2. Consume Kafka from offset
3. Rebuild P6 state
4. Recompute P7
5. Validate checksum
