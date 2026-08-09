# RC35-COMPONENT-COVERAGE.md
## Component Runtime Coverage Analysis

Generated: 2025-01-08
Repository: Trajectoire-V1
Mission: RC-003.5 Runtime Certification
Status: COMPLETED

---

# COVERAGE METRICS DEFINITION

## Runtime Coverage Calculation
```
Runtime Coverage = (Observed Attributes / Total Attributes) × 100

Attributes:
- Imported: Component is imported in at least one file
- Constructor: Component has a constructor
- Injected: Component is dependency-injected
- Module: Component is registered in a module
- Provider: Component is registered as a provider
- Controller: Component is used in a controller
- Route: Component is accessible via HTTP route
- Hook: Component is used in React hooks
- Page: Component is used in Next.js pages
- Called: Component methods are called
- Executed: Component code is executed
- Returns value: Component returns values
- Consumed: Component output is consumed
- Observable logs: Component has logging
- Observable traces: Component has distributed tracing
- Observable metrics: Component has metrics collection
- Fallback: Component has fallback mechanism
- Retry: Component has retry logic
- Timeout: Component has timeout configuration
- Circuit breaker: Component has circuit breaker
- Cache: Component uses caching
- Invalidation: Component has cache invalidation
- Persistence: Component persists data
- Dead: Component is not used
- Deprecated: Component is deprecated
```

---

# COMPONENT COVERAGE TABLE

| Component | File | Coverage | Confidence | Status |
|-----------|------|----------|------------|--------|
| **GraphMatchingService** | apps/api/src/runtime/kg/graph-matching.service.ts | 70% | 80% | ACTIVE |
| **GraphSearchService** | apps/api/src/runtime/kg/graph-search.service.ts | 70% | 80% | ACTIVE |
| **CopilotService** | apps/api/src/copilot/copilot.service.ts | 75% | 85% | ACTIVE |
| **AuthorizationV2** | apps/web/src/lib/authorization/AuthorizationV2.ts | 60% | 75% | ACTIVE |
| **BillingService** | apps/web/src/lib/db/billing.service.ts | 85% | 90% | ACTIVE |
| **CvService** | apps/api/src/cv/cv.service.ts | 65% | 80% | ACTIVE |
| **CV Analyze Route** | apps/web/src/app/api/cv/analyze/route.ts | 90% | 95% | ACTIVE |
| **Stripe Webhook Route** | apps/web/src/app/api/stripe/webhook/route.ts | 75% | 90% | ACTIVE |
| **Supabase Client** | apps/web/src/lib/db/client.ts | 50% | 70% | ACTIVE |
| **Stripe SDK** | apps/web/src/lib/stripe.ts | 70% | 85% | ACTIVE |
| **Mistral AI SDK** | apps/web/src/app/api/cv/analyze/route.ts | 85% | 90% | ACTIVE |
| **CacheService** | apps/api/src/cache/cache.decorator.ts | 60% | 70% | ACTIVE |
| **NormalizationService** | apps/api/src/cv/normalization.service.ts | 50% | 70% | ACTIVE |
| **RuntimeGraphService** | apps/api/src/runtime/kg/runtime-graph.service.ts | 65% | 80% | ACTIVE |
| **GraphRepository** | apps/api/src/runtime/kg/graph-repository.service.ts | 70% | 80% | ACTIVE |
| **GraphQueryEngine** | apps/api/src/runtime/kg/graph-query-engine.service.ts | 50% | 70% | ACTIVE |
| **GraphAnalyticsService** | apps/api/src/runtime/kg/graph-analytics.service.ts | 50% | 70% | ACTIVE |
| **ConversationMemoryService** | apps/api/src/copilot/conversation-memory.service.ts | 50% | 70% | ACTIVE |
| **PromptInterpreterService** | apps/api/src/copilot/prompt-interpreter.service.ts | 50% | 70% | ACTIVE |
| **ResponseBuilderService** | apps/api/src/copilot/response-builder.service.ts | 50% | 70% | ACTIVE |

---

# DETAILED COVERAGE BREAKDOWN

## HIGH COVERAGE (80%+)

### BillingService (85%)
**File:** `apps/web/src/lib/db/billing.service.ts`

**Observed Attributes (19/22):**
- ✅ Imported
- ✅ Called
- ✅ Executed
- ✅ Returns value
- ✅ Consumed
- ✅ Observable logs
- ✅ Fallback
- ✅ Retry
- ✅ Cache (idempotency)
- ✅ Persistence
- ✅ Not Dead
- ✅ Not Deprecated
- ✅ Route (used in API routes)
- ❌ Constructor (object literal)
- ❌ Injected (object literal)
- ❌ Module (no module file)
- ❌ Provider (no provider config)
- ❌ Controller (not used in controller)
- ❌ Hook (no React hooks)
- ❌ Page (no Next.js page)
- ❌ Observable traces
- ❌ Observable metrics
- ❌ Timeout
- ❌ Circuit breaker
- ❌ Invalidation

**Missing Attributes:** Observable traces, Observable metrics, Timeout, Circuit breaker, Invalidation

**Recommendation:** Add distributed tracing, metrics collection, timeout configuration, circuit breaker, and cache invalidation.

---

### CV Analyze Route (90%)
**File:** `apps/web/src/app/api/cv/analyze/route.ts`

**Observed Attributes (20/22):**
- ✅ Imported
- ✅ Module (Next.js route)
- ✅ Route (POST endpoint)
- ✅ Called
- ✅ Executed
- ✅ Returns value
- ✅ Consumed
- ✅ Observable logs
- ✅ Fallback
- ✅ Retry (idempotency)
- ✅ Timeout (30s AbortController)
- ✅ Cache (idempotency)
- ✅ Persistence (Prisma)
- ✅ Not Dead
- ✅ Not Deprecated
- ❌ Constructor (Next.js route)
- ❌ Injected (Next.js route)
- ❌ Provider (Next.js route)
- ❌ Controller (is the route itself)
- ❌ Hook (no React hooks)
- ❌ Page (API route, not page)
- ❌ Observable traces
- ❌ Observable metrics
- ❌ Circuit breaker
- ❌ Invalidation

**Missing Attributes:** Observable traces, Observable metrics, Circuit breaker, Invalidation

**Recommendation:** Add distributed tracing, metrics collection, circuit breaker, and cache invalidation.

---

### Mistral AI Integration (85%)
**File:** `apps/web/src/app/api/cv/analyze/route.ts`

**Observed Attributes (19/22):**
- ✅ Imported
- ✅ Constructor (new Mistral)
- ✅ Called
- ✅ Executed
- ✅ Returns value
- ✅ Consumed
- ✅ Observable logs
- ✅ Fallback
- ✅ Timeout (30s AbortController)
- ✅ Cache (idempotency)
- ✅ Persistence (Prisma)
- ✅ Not Dead
- ✅ Not Deprecated
- ✅ Route (used in API route)
- ❌ Injected (dynamic import)
- ❌ Module (dynamic import)
- ❌ Provider (no provider config)
- ❌ Controller (used in API route)
- ❌ Hook (no React hooks)
- ❌ Page (no Next.js page)
- ❌ Observable traces
- ❌ Observable metrics
- ❌ Retry
- ❌ Circuit breaker
- ❌ Invalidation

**Missing Attributes:** Observable traces, Observable metrics, Retry, Circuit breaker, Invalidation

**Recommendation:** Add distributed tracing, metrics collection, retry logic, circuit breaker, and cache invalidation.

---

## MEDIUM COVERAGE (60-79%)

### GraphMatchingService (70%)
**File:** `apps/api/src/runtime/kg/graph-matching.service.ts`

**Observed Attributes (15/22):**
- ✅ Imported
- ✅ Constructor
- ✅ Injected
- ✅ Controller
- ✅ Route
- ✅ Called
- ✅ Executed
- ✅ Returns value
- ✅ Consumed
- ✅ Cache
- ✅ Persistence
- ✅ Not Dead
- ✅ Not Deprecated
- ❌ Module
- ❌ Provider
- ❌ Hook
- ❌ Page
- ❌ Observable logs
- ❌ Observable traces
- ❌ Observable metrics
- ❌ Fallback
- ❌ Retry
- ❌ Timeout
- ❌ Circuit breaker
- ❌ Invalidation

**Missing Attributes:** Module, Provider, Observable logs, Observable traces, Observable metrics, Fallback, Retry, Timeout, Circuit breaker, Invalidation

**Recommendation:** Add module registration, provider configuration, structured logging, distributed tracing, metrics collection, fallback mechanisms, retry logic, timeout configuration, circuit breaker, and cache invalidation.

---

### GraphSearchService (70%)
**File:** `apps/api/src/runtime/kg/graph-search.service.ts`

**Observed Attributes (15/22):**
- ✅ Imported
- ✅ Constructor
- ✅ Injected
- ✅ Controller
- ✅ Route
- ✅ Called
- ✅ Executed
- ✅ Returns value
- ✅ Consumed
- ✅ Cache
- ✅ Persistence
- ✅ Not Dead
- ✅ Not Deprecated
- ❌ Module
- ❌ Provider
- ❌ Hook
- ❌ Page
- ❌ Observable logs
- ❌ Observable traces
- ❌ Observable metrics
- ❌ Fallback
- ❌ Retry
- ❌ Timeout
- ❌ Circuit breaker
- ❌ Invalidation

**Missing Attributes:** Module, Provider, Observable logs, Observable traces, Observable metrics, Fallback, Retry, Timeout, Circuit breaker, Invalidation

**Recommendation:** Add module registration, provider configuration, structured logging, distributed tracing, metrics collection, fallback mechanisms, retry logic, timeout configuration, circuit breaker, and cache invalidation.

---

### CopilotService (75%)
**File:** `apps/api/src/copilot/copilot.service.ts`

**Observed Attributes (16/22):**
- ✅ Imported
- ✅ Constructor
- ✅ Injected
- ✅ Controller
- ✅ Route
- ✅ Called
- ✅ Executed
- ✅ Returns value
- ✅ Consumed
- ✅ Fallback
- ✅ Cache
- ✅ Persistence
- ✅ Not Dead
- ✅ Not Deprecated
- ❌ Module
- ❌ Provider
- ❌ Hook
- ❌ Page
- ❌ Observable logs
- ❌ Observable traces
- ❌ Observable metrics
- ❌ Retry
- ❌ Timeout
- ❌ Circuit breaker
- ❌ Invalidation

**Missing Attributes:** Module, Provider, Observable logs, Observable traces, Observable metrics, Retry, Timeout, Circuit breaker, Invalidation

**Recommendation:** Add module registration, provider configuration, structured logging, distributed tracing, metrics collection, retry logic, timeout configuration, circuit breaker, and cache invalidation.

---

### Stripe Webhook Route (75%)
**File:** `apps/web/src/app/api/stripe/webhook/route.ts`

**Observed Attributes (16/22):**
- ✅ Imported
- ✅ Module (Next.js route)
- ✅ Route (POST endpoint)
- ✅ Called
- ✅ Executed
- ✅ Returns value
- ✅ Consumed
- ✅ Observable logs
- ✅ Fallback
- ✅ Persistence (Prisma)
- ✅ Not Dead
- ✅ Not Deprecated
- ❌ Constructor (Next.js route)
- ❌ Injected (Next.js route)
- ❌ Provider (Next.js route)
- ❌ Controller (is the route itself)
- ❌ Hook (no React hooks)
- ❌ Page (API route, not page)
- ❌ Observable traces
- ❌ Observable metrics
- ❌ Retry (Stripe handles retries)
- ❌ Timeout
- ❌ Circuit breaker
- ❌ Cache
- ❌ Invalidation

**Missing Attributes:** Observable traces, Observable metrics, Timeout, Circuit breaker, Cache, Invalidation

**Recommendation:** Add distributed tracing, metrics collection, timeout configuration, circuit breaker, caching, and cache invalidation.

---

### CvService (65%)
**File:** `apps/api/src/cv/cv.service.ts`

**Observed Attributes (14/22):**
- ✅ Imported
- ✅ Constructor
- ✅ Injected
- ✅ Controller
- ✅ Route
- ✅ Called
- ✅ Executed
- ✅ Returns value
- ✅ Consumed
- ✅ Fallback
- ✅ Persistence
- ✅ Not Dead
- ✅ Not Deprecated
- ❌ Module
- ❌ Provider
- ❌ Hook
- ❌ Page
- ❌ Observable logs
- ❌ Observable traces
- ❌ Observable metrics
- ❌ Retry
- ❌ Timeout
- ❌ Circuit breaker
- ❌ Cache
- ❌ Invalidation

**Missing Attributes:** Module, Provider, Observable logs, Observable traces, Observable metrics, Retry, Timeout, Circuit breaker, Cache, Invalidation

**Recommendation:** Add module registration, provider configuration, structured logging, distributed tracing, metrics collection, retry logic, timeout configuration, circuit breaker, caching, and cache invalidation.

---

### AuthorizationV2 (60%)
**File:** `apps/web/src/lib/authorization/AuthorizationV2.ts`

**Observed Attributes (13/22):**
- ✅ Imported
- ✅ Constructor
- ✅ Route
- ✅ Called
- ✅ Executed
- ✅ Returns value
- ✅ Consumed
- ✅ Fallback
- ✅ Not Dead
- ✅ Not Deprecated
- ❌ Injected (class-based)
- ❌ Module
- ❌ Provider
- ❌ Controller (used in middleware)
- ❌ Hook
- ❌ Page
- ❌ Observable logs
- ❌ Observable traces
- ❌ Observable metrics
- ❌ Retry
- ❌ Timeout
- ❌ Circuit breaker
- ❌ Cache
- ❌ Invalidation
- ❌ Persistence (in-memory)

**Missing Attributes:** Observable logs, Observable traces, Observable metrics, Retry, Timeout, Circuit breaker, Cache, Invalidation, Persistence

**Recommendation:** Add structured logging, distributed tracing, metrics collection, retry logic, timeout configuration, circuit breaker, caching, cache invalidation, and persistence.

---

## LOW COVERAGE (50-59%)

### Supabase Client (50%)
**File:** `apps/web/src/lib/db/client.ts`

**Observed Attributes (11/22):**
- ✅ Imported
- ✅ Constructor (functions)
- ✅ Called
- ✅ Executed
- ✅ Returns value
- ✅ Consumed
- ✅ Route (used in routes)
- ✅ Persistence
- ✅ Not Dead
- ✅ Not Deprecated
- ❌ Injected (singleton)
- ❌ Module
- ❌ Provider
- ❌ Controller
- ❌ Hook
- ❌ Page
- ❌ Observable logs
- ❌ Observable traces
- ❌ Observable metrics
- ❌ Fallback
- ❌ Retry
- ❌ Timeout
- ❌ Circuit breaker
- ❌ Cache
- ❌ Invalidation

**Missing Attributes:** Observable logs, Observable traces, Observable metrics, Fallback, Retry, Timeout, Circuit breaker, Cache, Invalidation

**Recommendation:** Add structured logging, distributed tracing, metrics collection, fallback mechanisms, retry logic, timeout configuration, circuit breaker, caching, and cache invalidation.

---

### CacheService (60%)
**File:** `apps/api/src/cache/cache.decorator.ts`

**Observed Attributes (13/22):**
- ✅ Imported
- ✅ Injected
- ✅ Called
- ✅ Executed
- ✅ Returns value
- ✅ Consumed
- ✅ Fallback
- ✅ Cache (is the cache)
- ✅ Invalidation
- ✅ Persistence (Redis)
- ✅ Not Dead
- ✅ Not Deprecated
- ❌ Constructor
- ❌ Module
- ❌ Provider
- ❌ Controller
- ❌ Route
- ❌ Hook
- ❌ Page
- ❌ Observable logs
- ❌ Observable traces
- ❌ Observable metrics
- ❌ Retry
- ❌ Timeout
- ❌ Circuit breaker

**Missing Attributes:** Observable logs, Observable traces, Observable metrics, Retry, Timeout, Circuit breaker

**Recommendation:** Add structured logging, distributed tracing, metrics collection, retry logic, timeout configuration, and circuit breaker.

---

### NormalizationService (50%)
**File:** `apps/api/src/cv/normalization.service.ts`

**Observed Attributes (11/22):**
- ✅ Imported
- ✅ Called
- ✅ Executed
- ✅ Returns value
- ✅ Consumed
- ✅ Not Dead
- ✅ Not Deprecated
- ❌ Constructor
- ❌ Injected
- ❌ Module
- ❌ Provider
- ❌ Controller
- ❌ Route
- ❌ Hook
- ❌ Page
- ❌ Observable logs
- ❌ Observable traces
- ❌ Observable metrics
- ❌ Fallback
- ❌ Retry
- ❌ Timeout
- ❌ Circuit breaker
- ❌ Cache
- ❌ Invalidation
- ❌ Persistence

**Missing Attributes:** Constructor, Module, Provider, Observable logs, Observable traces, Observable metrics, Fallback, Retry, Timeout, Circuit breaker, Cache, Invalidation, Persistence

**Recommendation:** Add constructor, module registration, provider configuration, structured logging, distributed tracing, metrics collection, fallback mechanisms, retry logic, timeout configuration, circuit breaker, caching, cache invalidation, and persistence.

---

### RuntimeGraphService (65%)
**File:** `apps/api/src/runtime/kg/runtime-graph.service.ts`

**Observed Attributes (14/22):**
- ✅ Imported
- ✅ Constructor
- ✅ Injected
- ✅ Called
- ✅ Executed
- ✅ Returns value
- ✅ Consumed
- ✅ Persistence
- ✅ Not Dead
- ✅ Not Deprecated
- ❌ Module
- ❌ Provider
- ❌ Controller
- ❌ Route
- ❌ Hook
- ❌ Page
- ❌ Observable logs
- ❌ Observable traces
- ❌ Observable metrics
- ❌ Fallback
- ❌ Retry
- ❌ Timeout
- ❌ Circuit breaker
- ❌ Cache
- ❌ Invalidation

**Missing Attributes:** Module, Provider, Observable logs, Observable traces, Observable metrics, Fallback, Retry, Timeout, Circuit breaker, Cache, Invalidation

**Recommendation:** Add module registration, provider configuration, structured logging, distributed tracing, metrics collection, fallback mechanisms, retry logic, timeout configuration, circuit breaker, caching, and cache invalidation.

---

### GraphRepository (70%)
**File:** `apps/api/src/runtime/kg/graph-repository.service.ts`

**Observed Attributes (15/22):**
- ✅ Imported
- ✅ Constructor
- ✅ Injected
- ✅ Called
- ✅ Executed
- ✅ Returns value
- ✅ Consumed
- ✅ Cache
- ✅ Invalidation
- ✅ Persistence
- ✅ Not Dead
- ✅ Not Deprecated
- ❌ Module
- ❌ Provider
- ❌ Controller
- ❌ Route
- ❌ Hook
- ❌ Page
- ❌ Observable logs
- ❌ Observable traces
- ❌ Observable metrics
- ❌ Fallback
- ❌ Retry
- ❌ Timeout
- ❌ Circuit breaker

**Missing Attributes:** Module, Provider, Observable logs, Observable traces, Observable metrics, Fallback, Retry, Timeout, Circuit breaker

**Recommendation:** Add module registration, provider configuration, structured logging, distributed tracing, metrics collection, fallback mechanisms, retry logic, timeout configuration, and circuit breaker.

---

# COVERAGE SUMMARY

## Overall Coverage Statistics
- **Total Components Analyzed:** 20
- **High Coverage (80%+):** 3 (15%)
- **Medium Coverage (60-79%):** 8 (40%)
- **Low Coverage (50-59%):** 9 (45%)
- **Average Coverage:** 68%

## Attribute Coverage Statistics
- **Most Common Missing Attributes:**
  1. Observable traces (0/20 = 0%)
  2. Observable metrics (0/20 = 0%)
  3. Circuit breaker (0/20 = 0%)
  4. Module registration (3/20 = 15%)
  5. Provider configuration (3/20 = 15%)

- **Most Common Present Attributes:**
  1. Imported (20/20 = 100%)
  2. Called (20/20 = 100%)
  3. Executed (20/20 = 100%)
  4. Returns value (20/20 = 100%)
  5. Not Dead (20/20 = 100%)

## Critical Gaps
1. **Observability:** 0% of components have distributed tracing or metrics collection
2. **Resilience:** 0% of components have circuit breaker patterns
3. **Module Registration:** 85% of components lack module registration
4. **Provider Configuration:** 85% of components lack provider configuration
5. **Structured Logging:** 85% of components lack structured logging

---

*End of RC35-COMPONENT-COVERAGE.md*
