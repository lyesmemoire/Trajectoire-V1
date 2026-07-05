# Audit Détaillé du Backend - Trajectoire

**Date:** 27 Juin 2026  
**Scope:** Gateway, SIL, Services, Storage Layer  
**Architecture:** Event-Sourcing avec Gateway Pattern

---

## 📋 Executive Summary

### Architecture Globale
- **Pattern:** Gateway → SIL (Event-Sourcing) → Storage
- **Stack:** TypeScript, Express, PostgreSQL, Event-Driven
- **Isolation:** Multi-tenant avec signature cryptographique
- **Sécurité:** JWT + RBAC + Tenant Isolation

### Score Global
| Aspect | Score | Notes |
|--------|-------|-------|
| Architecture | 8/10 | Solide mais complexe |
| Sécurité | 7/10 | Bons mécanismes, gaps observabilité |
| Performance | 6/10 | Pas de caching, batch limité |
| Code Quality | 8/10 | TypeScript strict, bien typé |
| Scalabilité | 7/10 | Sharding présent mais non testé |
| Observabilité | 5/10 | Logging basique, pas de métriques |

---

## 🏗️ Architecture Analysis

### 1. Gateway Layer (`gateway/`)

**Structure:**
```
gateway/
├── app.ts (101 lignes)
├── controllers/
│   ├── session.controller.ts (73 lignes)
│   ├── event.controller.ts (48 lignes)
│   └── report.controller.ts (64 lignes)
├── middlewares/
│   ├── auth-middleware.ts (31 lignes)
│   ├── rbac-middleware.ts (1704 lignes)
│   └── tenant-middleware.ts (758 lignes)
└── services/
    ├── auth.ts
    ├── event-signer.ts
    ├── tenant-resolver.ts
    └── rbac.ts
```

**Points Positifs:**
- ✅ Séparation claire controllers/middlewares/services
- ✅ Support legacy mode (Phase 2-E) et secured mode (Phase 2-H)
- ✅ Overloading TypeScript intelligent pour compatibilité
- ✅ Signature cryptographique sur tous les événements
- ✅ Tenant isolation via middleware

**Problèmes Identifiés:**

#### 1.1 Error Handling Inconsistant
```typescript
// session.controller.ts:36-38
catch (err: any) {
  res.status(500).json({ error: err.message });
}
```
**Issue:** Expose les erreurs internes, pas de logging structuré
**Impact:** Sécurité (information leak), debug difficile
**Recommandation:** 
```typescript
catch (err: any) {
  logger.error({ error: err.message, stack: err.stack }, "Session creation failed");
  res.status(500).json({ error: "INTERNAL_ERROR" });
}
```

#### 1.2 Idempotence Non-Explicite
```typescript
// session.controller.ts:15
const sessionId = `sess_${crypto.randomUUID()}`;
```
**Issue:** UUID généré côté Gateway, pas de garantie idempotence si retry client
**Impact:** Duplication potentielle de sessions
**Recommandation:** Accepter `sessionId` optionnel du client ou utiliser idempotency key

#### 1.3 Validation Payload Manquante
```typescript
// event.controller.ts:14
const payload = req.body.payload;
if (!payload) {
  return res.status(400).json({ error: "Missing payload" });
}
```
**Issue:** Pas de validation schema (Zod/Joi)
**Impact:** Données corrompues peuvent atteindre SIL
**Recommandation:** Ajouter validation Zod avec schémas stricts

#### 1.4 Rate Limiting Absent
**Issue:** Aucun rate limiting sur les endpoints
**Impact:** DoS possible, abuse API
**Recommandation:** Implémenter rate limiting (express-rate-limit)

---

### 2. SIL Layer (`sil/`)

**Structure:**
```
sil/
├── core/
│   ├── runtime-loop.ts (433 lignes)
│   ├── recovery-manager.ts
│   └── failure-controller.ts
├── services/
│   ├── ingestor.ts (142 lignes)
│   ├── event-router.ts
│   ├── store/
│   │   ├── postgres-event-store.ts (142 lignes)
│   │   ├── dual-event-store.ts
│   │   └── batched-event-writer.ts
│   └── postgres/
│       ├── checkpoint-repository.ts
│       ├── report-repository.ts
│       └── session-repository.ts
├── distributed/
│   ├── sharding/
│   ├── failover/
│   └── session-registry.ts
└── contracts/
    └── public-api.ts (89 lignes)
```

**Points Positifs:**
- ✅ Architecture event-sourcing pure
- ✅ Séparation stricte ingestion/processing/storage
- ✅ Hash chain pour intégrité événements
- ✅ Tenant isolation enforcement à l'ingestion
- ✅ Idempotence check avant écriture
- ✅ Wakeup pattern pour async processing
- ✅ Checkpointing pour recovery

**Problèmes Identifiés:**

#### 2.1 Ingestor: Timestamp Window Validation Manquante
```typescript
// ingestor.ts:69-75
const timeResult = await this.verifier.verifyTimestamp(incomingEvent);
if (!timeResult.isValid) {
  console.error(`[Ingestor] Timestamp invalid...`);
  await this.audit(incomingEvent, `Timestamp invalid: ${timeResult.reason}`);
  return;
}
```
**Issue:** Dépend de `EventVerifier` mais window non configurée
**Impact:** Replay attacks possibles avec vieux événements
**Recommandation:** Configurer window max 5 minutes, clock skew tolerance

#### 2.2 Runtime Loop: State In-Memory Only
```typescript
// runtime-loop.ts:30-31
private states: Map<string, SILState> = new Map();
private wakingSessions: Set<string> = new Set();
```
**Issue:** États en mémoire, pas de persistence inter-process
**Impact:** Perte d'état sur crash/restart, pas de horizontal scaling
**Recommandation:** Externaliser state (Redis) ou utiliser checkpointing actif

#### 2.3 Runtime Loop: No Backpressure
```typescript
// runtime-loop.ts:65-94
while (pendingEvents.length > 0) {
  for (const event of pendingEvents) {
    // Process event
  }
  pendingEvents = await this.store.readAfter(...);
}
```
**Issue:** Boucle infinie si events arrivent plus vite que traitement
**Impact:** Memory exhaustion, cascade failure
**Recommandation:** Ajouter max batch size, backpressure signal

#### 2.4 Postgres Event Store: Type Mapping Incorrect
```typescript
// postgres-event-store.ts:133
type: "UNKNOWN", // In an actual system we'd save type too
```
**Issue:** Type d'événement non persisté, mapping incorrect
**Impact:** Impossible de reconstruire le type depuis DB
**Recommandation:** Ajouter colonne `event_type` dans schema

#### 2.5 Dual Event Store: No Fallback Logic
```typescript
// dual-event-store.ts (non vu mais mentionné)
```
**Issue:** Si primary fail, pas de logique de fallback documentée
**Impact:** Perte de données si primary down
**Recommandation:** Documenter et tester failover scenarios

#### 2.6 Recovery Manager: No Rollback Strategy
**Issue:** Si recovery échoue mi-chemin, pas de rollback
**Impact:** État corrompu irrécupérable
**Recommandation:** Implement transactional recovery avec rollback

---

### 3. Services Layer (`services/`)

**Structure:**
```
services/
├── interview.ts (134 lignes)
├── ats.ts (2470 lignes)
├── credits.ts (3305 lignes)
├── ai.ts (525 lignes)
└── parsing.ts (1610 lignes)
```

**Points Positifs:**
- ✅ Validation stricte des réponses IA
- ✅ Fallback values pour données invalides
- ✅ Hard limits (max 10 questions)
- ✅ Fonctions pures, testables

**Problèmes Identifiés:**

#### 3.1 Interview Service: No Retry Logic
```typescript
// interview.ts:14-41
export function validateQuestions(raw: unknown): InterviewQuestion[] {
  if (!Array.isArray(raw)) {
    throw new Error("INVALID_QUESTIONS: Expected array");
  }
  // ...
}
```
**Issue:** Si IA retourne données invalides, pas de retry
**Impact:** Échec silencieux, mauvaise UX
**Recommandation:** Implement retry avec exponential backoff

#### 3.2 ATS Service: No Caching
**Issue:** Parsing ATS est CPU-intensive, pas de cache
**Impact:** Latence élevée, coût compute élevé
**Recommandation:** Cache Redis avec TTL basé sur CV hash

#### 3.3 Credits Service: No Distributed Lock
**Issue:** Si concurrent requests, race condition sur débit
**Impact:** Over-spending possible
**Recommandation:** Distributed lock (Redis) ou atomic operations

---

### 4. Storage Layer

**Schema Analysis:**

#### 4.1 Events Table
```sql
-- Déduit du code
events (
  tenant_id, session_id, event_id, sequence,
  payload, hash, previous_hash, created_at
)
```
**Problèmes:**
- ❌ Pas d'index sur `tenant_id` pour queries multi-tenant
- ❌ Pas de partitioning par tenant (scalabilité)
- ❌ Pas de TTL sur old events (storage growth)
- ❌ Pas de compression sur payload (cost)

**Recommandations:**
```sql
CREATE INDEX idx_events_tenant_session ON events(tenant_id, session_id);
CREATE INDEX idx_events_tenant_created ON events(tenant_id, created_at);
-- Partitioning par tenant_id
-- Compression TOAST
```

#### 4.2 Checkpoints Table
**Issue:** Pas vu dans schema mais utilisé dans code
**Impact:** Potentiellement non créé en prod
**Recommandation:** Vérifier migration scripts

---

## 🔒 Security Analysis

### 1. Authentication
**Score:** 7/10

**Points Positifs:**
- ✅ JWT verification middleware
- ✅ Bearer token standard
- ✅ Principal injection dans request

**Problèmes:**
- ❌ Pas de token rotation
- ❌ Pas de refresh token mechanism
- ❌ Pas de jti (JWT ID) pour revocation
- ❌ Pas de rate limiting sur auth endpoints

**Recommandations:**
```typescript
// Ajouter jti pour revocation
interface JwtPayload {
  sub: string;
  tenantId: string;
  jti: string; // JWT ID
  exp: number;
  iat: number;
}
```

### 2. Authorization (RBAC)
**Score:** 8/10

**Points Positifs:**
- ✅ Permission-based access control
- ✅ Security audit logging
- ✅ Middleware pattern

**Problèmes:**
- ❌ Pas de role hierarchy
- ❌ Pas de permission inheritance
- ❌ Hardcoded permissions dans code

**Recommandations:**
- Externaliser permissions dans DB
- Implement role hierarchy
- Cache permissions pour performance

### 3. Tenant Isolation
**Score:** 9/10

**Points Positifs:**
- ✅ Enforcement à l'ingestion (Ingestor)
- ✅ Session registry mapping
- ✅ Signature cryptographique par tenant
- ✅ Audit trail des violations

**Problèmes:**
- ⚠️ Dépend de EventVerifier correctement configuré
- ⚠️ Pas de tenant-level rate limiting

**Recommandations:**
- Ajouter tenant-level rate limiting
- Monitor tenant isolation violations en prod

### 4. Data Encryption
**Score:** 4/10

**Problèmes:**
- ❌ Pas de encryption at rest
- ❌ Pas de encryption in transit (HTTPS non documenté)
- ❌ Payloads sensibles en clair dans DB

**Recommandations:**
- Enable TDE (Transparent Data Encryption) PostgreSQL
- Force HTTPS avec HSTS
- Encrypt payloads sensibles avec tenant key

---

## ⚡ Performance Analysis

### 1. Database Performance
**Score:** 6/10

**Problèmes:**
- ❌ Pas de connection pooling configuré
- ❌ Pas de prepared statements
- ❌ N+1 queries potentiels
- ❌ Pas de read replicas

**Recommandations:**
```typescript
// Configurer connection pool
const pool = new Pool({
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
```

### 2. Caching Strategy
**Score:** 3/10

**Problèmes:**
- ❌ Aucun cache implementé
- ❌ Chaque request hit DB
- ❌ Pas de cache invalidation strategy

**Recommandations:**
- Implement Redis cache pour:
  - Session states
  - User permissions
  - Reports (TTL 24h)
  - ATS results (TTL 7d)

### 3. Batch Processing
**Score:** 5/10

**Points Positifs:**
- ✅ BatchedEventWriter existe
- ✅ Bulk insert support

**Problèmes:**
- ❌ Batch size non configuré
- ❌ Pas de parallel processing

**Recommandations:**
```typescript
const BATCH_SIZE = 100;
const PARALLEL_WORKERS = 4;
```

---

## 🧪 Testing Analysis

### 1. Test Coverage
**Score:** 4/10

**Observations:**
- Tests présents dans `sil/tests/` (34 fichiers)
- Tests gateway dans `gateway/tests/` (8 fichiers)
- Pas de tests E2E documentés
- Pas de tests de charge

**Recommandations:**
- Ajouter tests E2E avec Playwright
- Implement load tests avec k6
- Target 80% coverage minimum

### 2. Test Quality
**Score:** 6/10

**Points Positifs:**
- ✅ Tests unitaires présents
- ✅ Mocking utilisé

**Problèmes:**
- ❌ Pas de tests d'intégration DB
- ❌ Pas de tests de scénarios de failure
- ❌ Pas de tests de recovery

---

## 📊 Observability Analysis

### 1. Logging
**Score:** 5/10

**Points Positifs:**
- ✅ StructuredLogger contract existe
- ✅ Logging dans RuntimeLoop

**Problèmes:**
- ❌ Pas de correlation ID entre services
- ❌ Pas de log aggregation (ELK non mentionné)
- ❌ Console.error utilisé en fallback

**Recommandations:**
```typescript
// Ajouter correlation ID
interface LogContext {
  traceId: string;
  spanId: string;
  tenantId: string;
  sessionId: string;
}
```

### 2. Metrics
**Score:** 2/10

**Problèmes:**
- ❌ Aucun système de métriques
- ❌ Pas de Prometheus/Grafana
- ❌ Pas de business metrics (sessions/s, errors/s)

**Recommandations:**
- Implement Prometheus client
- Track: request duration, error rate, queue depth
- Business metrics: active sessions, completion rate

### 3. Tracing
**Score:** 6/10

**Points Positifs:**
- ✅ TraceProvider contract existe
- ✅ TraceGraphBuilder pour observability

**Problèmes:**
- ❌ Pas de distributed tracing (OpenTelemetry)
- ❌ Pas de span propagation entre services

**Recommandations:**
- Implement OpenTelemetry
- Intégrer Jaeger/Tempo

---

## 🚀 Deployment & DevOps

### 1. Containerization
**Score:** 7/10

**Points Positifs:**
- ✅ Dockerfile.gateway existe
- ✅ Docker compose probable

**Problèmes:**
- ❌ Pas de multi-stage build optimisé
- ❌ Pas de security scanning
- ❌ Image size non optimisé

### 2. CI/CD
**Score:** Non évalué (pas accès)

**Recommandations:**
- GitHub Actions avec:
  - Linting (ESLint)
  - Type checking (tsc)
  - Unit tests
  - Security scanning (Snyk)
  - Container scanning (Trivy)

---

## 📝 Recommendations Prioritaires

### P0 (Critical - Do Now)
1. **Fix Postgres Event Store Type Mapping**
   - Ajouter colonne `event_type`
   - Migration script required

2. **Add Error Handling Structuré**
   - Remplacer tous `console.error` par logger
   - Implement error classification

3. **Implement Rate Limiting**
   - Gateway level
   - Tenant level

4. **Add Database Indexes**
   - `tenant_id`, `session_id`, `created_at`
   - Monitor query performance

### P1 (High - Next Sprint)
1. **Implement Caching Layer**
   - Redis pour session states
   - Cache invalidation strategy

2. **Add Observability**
   - Prometheus metrics
   - Structured logging avec correlation ID
   - OpenTelemetry tracing

3. **Improve Security**
   - Token rotation
   - Encryption at rest
   - Security audit logging

4. **Add Backpressure**
   - Runtime loop max batch size
   - Queue depth monitoring

### P2 (Medium - Future)
1. **Implement Distributed Lock**
   - Credits service
   - Prevent race conditions

2. **Add E2E Tests**
   - Playwright
   - Load testing

3. **Optimize Database**
   - Connection pooling
   - Read replicas
   - Partitioning

4. **Improve Recovery**
   - Transactional recovery
   - Rollback strategy

---

## 🎯 Conclusion

L'architecture backend de Trajectoire est **solide et bien pensée** avec un pattern event-sourcing moderne. La séparation Gateway/SIL/Storage est excellente pour la scalabilité et la maintenabilité.

**Points Forts:**
- Architecture event-sourcing pure
- Tenant isolation robuste
- TypeScript strict
- Code bien structuré

**Points Faibles:**
- Observabilité limitée
- Pas de caching
- Error handling basique
- Security gaps (encryption, rate limiting)

**Score Global:** 6.5/10

Avec les recommandations P0 implémentées, le score pourrait atteindre 8/10. L'architecture est prête pour la production mais nécessite des hardening avant go-live.
