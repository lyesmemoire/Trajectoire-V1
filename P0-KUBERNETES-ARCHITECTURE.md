# P0.5 — KUBERNETES & DISTRIBUTED ORCHESTRATION DESIGN

## 1. ARCHITECTURE GLOBALE K8S
```text
                 ┌─────────────────────┐
                 │   Ingress (NGINX)   │
                 └─────────┬───────────┘
                           │
        ┌──────────────────┼──────────────────┐
        ▼                  ▼                  ▼
┌──────────────┐  ┌──────────────┐  ┌────────────────┐
│ API Gateway   │  │ WS Gateway    │  │ Auth Service   │
│ (Fastify)     │  │ (Realtime)    │  │ (JWT/OAuth)    │
└──────┬────────┘  └──────┬───────┘  └────────────────┘
       │                 │
       ▼                 ▼
┌──────────────────────────────────────────────┐
│             Kafka Cluster                    │
│   runtime | evaluation | ranking | report    │
└──────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────┐
│            Worker Pool Layer                 │
│  P6 Runtime Workers                         │
│  P7 Evaluation Workers                      │
│  Ranking Workers                            │
│  Report Workers                             │
└──────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────┐
│   Storage Layer (Postgres + Redis + S3)     │
└──────────────────────────────────────────────┘
```

---

## 2. CORE DEPLOYMENT UNITS

### 2.1 API Gateway Deployment
- Replicas: 3 (min), autoscale on RPS + latency p95 < 200ms
- Strategy: RollingUpdate
- Resources: 500m CPU, 512Mi memory per pod

### 2.2 WS Gateway (Real-time P6)
- Autoscale: > 70% CPU OR > 1000 WS connections per pod
- Sticky sessions via ALB/NGINX

### 2.3 Kafka Consumer Workers
Séparés par responsabilité :
- `runtime-worker` (P6 execution)
- `evaluation-worker` (P7 scoring)
- `ranking-worker` (P7.3 cross-session)
- `report-worker` (P7.5 compilation)

Scaling basé sur **Kafka consumer lag** (target: lag < 1000 events).

---

## 3. NETWORK POLICY (CRITICAL)

### Règle absolue
```text
ONLY Gateway can be public
EVERYTHING else is internal
```

| Source | Destination | Allowed |
|--------|------------|---------|
| Gateway | Kafka | ✅ |
| Workers | Kafka | ✅ |
| Gateway | Postgres (read-only views) | ✅ |
| Gateway | Redis (cache) | ✅ |
| External | Kafka/Postgres/Redis | ❌ |

---

## 4. CHAOS RESILIENCE MODEL

| Failure | Recovery |
|---------|----------|
| Pod failure | K8s restart + Kafka replay |
| Node failure | Reschedule pods, no state loss (externalized) |
| Kafka failure | Degraded mode, Redis buffers + retry queue |
| Postgres failure | Compute continues, reads fallback to Redis cache |

---

## 5. OBSERVABILITY STACK

### OpenTelemetry Tracing
```text
API → Kafka → P6 → P7 → Postgres → Response
```

### Prometheus Metrics
- Kafka lag
- P6 execution time
- P7 scoring time
- API latency p95/p99

### Log Centralization
Loki or ELK stack

---

## 6. ZERO-DOWNTIME DEPLOYMENT
- Rolling update: deploy new → dual-run consumers → drain old → switch traffic
- P4–P7 is immutable → no runtime change allowed
- P0 evolves independently

---

## 7. CLUSTER TOPOLOGY FINAL
```text
          USERS
            │
        [INGRESS]
            │
     ┌──────┼──────┐
     ▼      ▼      ▼
 Gateway   WS    Auth
     │
     ▼
   Kafka (TIME LAYER)
     │
 ┌───┼──────────────┐
 ▼   ▼              ▼
P6  P7 Workers   Ranking/Report
 │
 ▼
Postgres + Redis + S3
```

---

## 8. FOUR-LAYER SEPARATION
```text
P4–P7  = intelligence (math)
Kafka  = time (event spine)
P0     = infrastructure (data + runtime)
P0.5   = physics (Kubernetes cluster)
```
