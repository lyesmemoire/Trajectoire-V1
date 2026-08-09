# RC37-COMPONENTS.md

**Chaos Engineering Certification - Runtime Resilience Analysis**

**Date:** 2026-08-06  
**Scope:** Trajectoire Gateway and API Runtime Components  
**Objective:** Document all runtime components with observable evidence of error handling patterns

---

## 1. GATEWAY CONTROLLERS

### 1.1 Session Controller
**File:** `c:\Trajectoire\gateway\controllers\session.controller.ts`

| Component | Type | Evidence |
|-----------|------|----------|
| `createSession` | Route Handler | Lines 18-36: try/catch block with 500 error response |
| `startSession` | Route Handler | Lines 40-72: try/catch block with 500 error response |
| Error Handling | try/catch | Lines 22-25, 44-47: Catches errors and returns 500 status |
| Event Publishing | SIL Client | Lines 28, 50: Uses `_SILPublicAPI.publishEvent` |
| Event Signing | EventSigner | Lines 27, 49: Uses `EventSigner.sign` |

**Observable Error Handling:**
- **try/catch:** YES (lines 22-25, 44-47)
- **timeout:** NOT VERIFIED
- **retry:** NOT VERIFIED
- **fallback:** NOT VERIFIED
- **logging:** NOT VERIFIED
- **correlation id:** NOT VERIFIED

---

### 1.2 Event Controller
**File:** `c:\Trajectoire\gateway\controllers\event.controller.ts`

| Component | Type | Evidence |
|-----------|------|----------|
| `postEvent` | Route Handler | Lines 14-47: try/catch block with 400/500 error response |
| Payload Validation | Validation | Lines 18-21: Returns 400 if payload missing |
| Error Handling | try/catch | Lines 23-26, 31-34: Catches errors with 400/500 status |
| Event Signing | EventSigner | Line 27: Uses `EventSigner.sign` |
| Event Publishing | SIL Client | Line 28: Uses `_SILPublicAPI.publishEvent` |

**Observable Error Handling:**
- **try/catch:** YES (lines 23-26, 31-34)
- **timeout:** NOT VERIFIED
- **retry:** NOT VERIFIED
- **fallback:** NOT VERIFIED
- **logging:** NOT VERIFIED
- **correlation id:** NOT VERIFIED

---

### 1.3 Report Controller
**File:** `c:\Trajectoire\gateway\controllers\report.controller.ts`

| Component | Type | Evidence |
|-----------|------|----------|
| `finishSession` | Route Handler | Lines 14-34: try/catch with 404/202/500 responses |
| `getReport` | Route Handler | Lines 38-63: try/catch with 404/202/500 responses |
| Error Handling | try/catch | Lines 18-21, 26-29, 42-45, 50-53, 58-61 |
| Event Publishing | SIL Client | Lines 27, 51: Uses `_SILPublicAPI.publishEvent` |
| Report Query | SIL Client | Lines 32, 56: Uses `silClient.getReport` |

**Observable Error Handling:**
- **try/catch:** YES (lines 18-21, 26-29, 42-45, 50-53, 58-61)
- **timeout:** NOT VERIFIED
- **retry:** NOT VERIFIED
- **fallback:** NOT VERIFIED
- **logging:** NOT VERIFIED
- **correlation id:** NOT VERIFIED

---

## 2. GATEWAY MIDDLEWARE

### 2.1 Authentication Middleware
**File:** `c:\Trajectoire\gateway\middlewares\auth-middleware.ts`

| Component | Type | Evidence |
|-----------|------|----------|
| `use` | Middleware | Lines 15-32: JWT verification with try/catch |
| JWT Verification | CryptoJwtVerifier | Line 20: Calls `verifyToken` |
| Error Handling | try/catch | Lines 22-31: Catches errors and returns 401 |
| Principal Attachment | Request | Line 24: Sets `req.principal` |

**Observable Error Handling:**
- **try/catch:** YES (lines 22-31)
- **timeout:** NOT VERIFIED
- **retry:** NOT VERIFIED
- **fallback:** NOT VERIFIED
- **logging:** NOT VERIFIED
- **correlation id:** NOT VERIFIED

---

### 2.2 RBAC Middleware
**File:** `c:\Trajectoire\gateway\middlewares\rbac-middleware.ts`

| Component | Type | Evidence |
|-----------|------|----------|
| `use` | Middleware | Lines 17-48: Permission check with try/catch |
| Authorization Check | AuthorizationService | Line 25: Calls `authorize` |
| Error Handling | try/catch | Lines 27-34: Catches errors with 401/403 |
| Audit Logging | SecurityAuditStore | Lines 31-33: Logs rejections if available |

**Observable Error Handling:**
- **try/catch:** YES (lines 27-34)
- **timeout:** NOT VERIFIED
- **retry:** NOT VERIFIED
- **fallback:** NOT VERIFIED
- **logging:** YES (lines 31-33, conditional)
- **correlation id:** NOT VERIFIED

---

### 2.3 Tenant Middleware
**File:** `c:\Trajectoire\gateway\middlewares\tenant-middleware.ts`

| Component | Type | Evidence |
|-----------|------|----------|
| `use` | Middleware | Lines 14-29: Tenant resolution with try/catch |
| Tenant Resolution | _TenantResolver | Line 20: Calls `resolveTenantId` |
| Error Handling | try/catch | Lines 22-27: Catches errors with 401/403 |
| Tenant ID Attachment | Request | Line 21: Sets `req.tenantId` |

**Observable Error Handling:**
- **try/catch:** YES (lines 22-27)
- **timeout:** NOT VERIFIED
- **retry:** NOT VERIFIED
- **fallback:** NOT VERIFIED
- **logging:** NOT VERIFIED
- **correlation id:** NOT VERIFIED

---

## 3. EXTERNAL INTEGRATIONS (lib/)

### 3.1 OpenAI Client
**File:** `c:\Trajectoire\lib\openai.ts`

| Component | Type | Evidence |
|-----------|------|----------|
| `getClient` | Lazy Loader | Lines 12-21: Lazy initialization with error throw |
| `generateText` | API Call | Lines 23-56: OpenAI API call with cost calculation |
| `generateJSON` | API Call | Lines 58-113: OpenAI API call with JSON parsing |
| Error Handling | throw | Lines 16, 50, 94: Throws errors on missing key or parse failure |

**Observable Error Handling:**
- **try/catch:** NOT VERIFIED
- **timeout:** NOT VERIFIED
- **retry:** NOT VERIFIED
- **fallback:** NOT VERIFIED
- **logging:** NOT VERIFIED
- **correlation id:** NOT VERIFIED

---

### 3.2 OpenAI Circuit Breaker
**File:** `c:\Trajectoire\lib\openai-breaker.ts`

| Component | Type | Evidence |
|-----------|------|----------|
| `isBroken` | Circuit Check | Lines 8-15: Checks failure count and cooldown |
| `recordFailure` | Failure Tracking | Lines 17-21: Increments failure count |
| `recordSuccess` | Success Tracking | Lines 23-27: Resets failure count |
| Circuit Breaker | Pattern | Lines 1-25: Simple circuit breaker implementation |

**Observable Error Handling:**
- **circuit breaker:** YES (lines 8-25)
- **timeout:** NOT VERIFIED
- **retry:** NOT VERIFIED
- **fallback:** NOT VERIFIED
- **logging:** NOT VERIFIED
- **correlation id:** NOT VERIFIED

---

### 3.3 Supabase Client
**File:** `c:\Trajectoire\lib\supabase.ts`

| Component | Type | Evidence |
|-----------|------|----------|
| `createBrowserClient` | Client Factory | Lines 5-12: Creates Supabase browser client |
| Fallback Values | Fallback | Lines 7-10: Uses dummy values in development |

**Observable Error Handling:**
- **try/catch:** NOT VERIFIED
- **timeout:** NOT VERIFIED
- **retry:** NOT VERIFIED
- **fallback:** YES (lines 7-10, development only)
- **logging:** NOT VERIFIED
- **correlation id:** NOT VERIFIED

---

### 3.4 Redis Client
**File:** `c:\Trajectoire\lib\redis.ts`

| Component | Type | Evidence |
|-----------|------|----------|
| `getClient` | Singleton | Lines 8-20: Singleton Redis client with Upstash |
| `getCached` | Cache Get | Lines 22-36: Cache get with try/catch and fallback |
| `setCached` | Cache Set | Lines 38-50: Cache set with try/catch |
| `invalidateCache` | Cache Invalidation | Lines 52-61: Cache invalidation with try/catch |
| Error Handling | try/catch | Lines 27-30, 42-45, 55-58: Catches errors and logs |
| Fallback | Direct Execution | Lines 31-34, 46-49: Falls back to direct execution on error |

**Observable Error Handling:**
- **try/catch:** YES (lines 27-30, 42-45, 55-58)
- **timeout:** NOT VERIFIED
- **retry:** NOT VERIFIED
- **fallback:** YES (lines 31-34, 46-49)
- **logging:** YES (lines 29, 44, 57)
- **correlation id:** NOT VERIFIED

---

### 3.5 Stripe Client
**File:** `c:\Trajectoire\lib\stripe.ts`

| Component | Type | Evidence |
|-----------|------|----------|
| `stripe` | Client | Lines 5-6: Stripe client initialization |
| `PRICE_IDS` | Configuration | Lines 8-12: Price ID constants |
| `createCheckoutSession` | API Call | Lines 14-38: Stripe checkout session creation |

**Observable Error Handling:**
- **try/catch:** NOT VERIFIED
- **timeout:** NOT VERIFIED
- **retry:** NOT VERIFIED
- **fallback:** NOT VERIFIED
- **logging:** NOT VERIFIED
- **correlation id:** NOT VERIFIED

---

## 4. RESILIENCE SERVICES (apps/api/src/resilience/)

### 4.1 Circuit Breaker Service
**File:** `c:\Trajectoire\apps\api\src\resilience\circuit-breaker.service.ts`

| Component | Type | Evidence |
|-----------|------|----------|
| `CircuitBreaker` | Circuit Breaker | Lines 50-159: Full circuit breaker implementation |
| `execute` | Execution Wrapper | Lines 75-97: Executes with timeout and circuit state |
| `onSuccess` | State Transition | Lines 99-108: Handles success and state transitions |
| `onFailure` | State Transition | Lines 110-118: Handles failure and state transitions |
| `createTimeoutPromise` | Timeout | Lines 141-147: Creates timeout promise |
| Error Handling | Circuit Breaker Open Error | Lines 78-80: Throws when circuit is open |
| Logging | Logger | Lines 124, 130, 138: Logs state transitions |

**Observable Error Handling:**
- **circuit breaker:** YES (lines 50-159)
- **timeout:** YES (lines 86-89, 141-147)
- **retry:** NOT VERIFIED
- **fallback:** NOT VERIFIED (circuit open throws error)
- **logging:** YES (lines 124, 130, 138)
- **correlation id:** NOT VERIFIED

---

### 4.2 Rate Limiting Service
**File:** `c:\Trajectoire\apps\api\src\resilience\rate-limiting.service.ts`

| Component | Type | Evidence |
|-----------|------|----------|
| `checkRateLimit` | Rate Limiter | Lines 55-105: Sliding window rate limiting with Redis |
| `checkSlidingWindow` | Algorithm | Lines 110-155: Sliding window implementation |
| Error Handling | try/catch | Lines 64-104: Catches errors and fails open |
| Fallback | Fail Open | Lines 98-103: Allows request if rate limiting fails |
| Logging | Logger | Lines 75-77: Logs rate limit exceeded |

**Observable Error Handling:**
- **try/catch:** YES (lines 64-104)
- **timeout:** NOT VERIFIED
- **retry:** NOT VERIFIED
- **fallback:** YES (lines 98-103, fail open)
- **logging:** YES (lines 75-77)
- **correlation id:** NOT VERIFIED

---

### 4.3 Retry Decorator
**File:** `c:\Trajectoire\apps\api\src\resilience\retry.decorator.ts`

| Component | Type | Evidence |
|-----------|------|----------|
| `RetryService.executeWithRetry` | Retry Logic | Lines 28-64: Retry with exponential backoff |
| Error Handling | try/catch | Lines 44-59: Catches errors and retries |
| Retry | Exponential Backoff | Lines 57-58: Exponential backoff with max delay |
| Retryable Errors | Filter | Lines 49-51: Filters retryable errors |

**Observable Error Handling:**
- **try/catch:** YES (lines 44-59)
- **timeout:** NOT VERIFIED
- **retry:** YES (lines 43-59)
- **fallback:** NOT VERIFIED
- **logging:** NOT VERIFIED
- **correlation id:** NOT VERIFIED

---

### 4.4 Rate Limiting Middleware
**File:** `c:\Trajectoire\apps\api\src\resilience\rate-limiting.middleware.ts`

| Component | Type | Evidence |
|-----------|------|----------|
| `use` | Middleware | Lines 24-79: Rate limiting middleware |
| Error Handling | try/catch | Lines 25-78: Catches errors and continues |
| Fallback | Continue on Error | Lines 76-77: Continues if rate limiting fails |
| Logging | Logger | Lines 55-57, 76: Logs rate limit exceeded and errors |

**Observable Error Handling:**
- **try/catch:** YES (lines 25-78)
- **timeout:** NOT VERIFIED
- **retry:** NOT VERIFIED
- **fallback:** YES (lines 76-77, continue on error)
- **logging:** YES (lines 55-57, 76)
- **correlation id:** NOT VERIFIED

---

## 5. OBSERVABILITY SERVICES (apps/api/src/observability/)

### 5.1 Tracing Service
**File:** `c:\Trajectoire\apps\api\src\observability\tracing.service.ts`

| Component | Type | Evidence |
|-----------|------|----------|
| `TracingService` | OpenTelemetry Tracer | Lines 28-366: OpenTelemetry tracing service |
| `withSpan` | Span Wrapper | Lines 47-65: Executes with span and error recording |
| `startSpan` | Span Creation | Lines 35-42: Creates span with attributes |
| `recordException` | Error Recording | Lines 97-103: Records exception in span |
| `generateCorrelationId` | Correlation ID | Lines 108-110: Generates correlation ID |
| `traceGraphOperation` | Graph Tracing | Lines 196-227: Traces graph operations |
| `traceMatchingOperation` | Matching Tracing | Lines 232-256: Traces matching operations |
| `traceSearchOperation` | Search Tracing | Lines 261-283: Traces search operations |
| `traceCopilotOperation` | Copilot Tracing | Lines 288-310: Traces copilot operations |

**Observable Error Handling:**
- **try/catch:** YES (lines 50-63 in withSpan)
- **timeout:** NOT VERIFIED
- **retry:** NOT VERIFIED
- **fallback:** NOT VERIFIED
- **logging:** NOT VERIFIED (uses OpenTelemetry)
- **correlation id:** YES (lines 108-110, 239, 268, 295, 322, 349)

---

### 5.2 Structured Logging Service
**File:** `c:\Trajectoire\apps\api\src\observability\structured-logging.service.ts`

| Component | Type | Evidence |
|-----------|------|----------|
| `StructuredLoggingService` | Logger | Lines 47-244: Structured logging service |
| `setCorrelationId` | Correlation ID | Lines 61-63: Sets correlation ID |
| `error` | Error Logging | Lines 147-162: Logs errors with stack trace |
| `fatal` | Fatal Logging | Lines 167-182: Logs fatal errors with stack trace |
| `log` | Log Method | Lines 187-208: Internal log method with JSON output |

**Observable Error Handling:**
- **try/catch:** NOT VERIFIED
- **timeout:** NOT VERIFIED
- **retry:** NOT VERIFIED
- **fallback:** NOT VERIFIED
- **logging:** YES (entire service)
- **correlation id:** YES (lines 61-63)

---

### 5.3 Prometheus Metrics Service
**File:** `c:\Trajectoire\apps\api\src\observability\prometheus-metrics.service.ts`

| Component | Type | Evidence |
|-----------|------|----------|
| `PrometheusMetricsService` | Metrics Collector | Lines 10-770: Comprehensive Prometheus metrics |
| `recordHttpLatency` | HTTP Latency | Lines 465-467: Records HTTP request latency |
| `incrementHttpErrors` | HTTP Errors | Lines 497-499: Increments HTTP error counter |
| `recordGraphLatency` | Graph Latency | Lines 469-471: Records graph operation latency |
| `incrementGraphErrors` | Graph Errors | Lines 501-503: Increments graph error counter |
| `recordRedisLatency` | Redis Latency | Lines 485-487: Records Redis operation latency |
| `incrementRedisErrors` | Redis Errors | Lines 517-519: Increments Redis error counter |
| System Metrics | CPU/RAM | Lines 725-765: Collects CPU and RAM metrics |

**Observable Error Handling:**
- **try/catch:** NOT VERIFIED
- **timeout:** NOT VERIFIED
- **retry:** NOT VERIFIED
- **fallback:** NOT VERIFIED
- **logging:** NOT VERIFIED
- **correlation id:** NOT VERIFIED
- **metrics:** YES (entire service)

---

### 5.4 Correlation ID Middleware
**File:** `c:\Trajectoire\apps\api\src\observability\correlation-id.middleware.ts`

| Component | Type | Evidence |
|-----------|------|----------|
| `CorrelationIdMiddleware` | Middleware | Lines 25-59: Correlation ID middleware |
| `use` | Middleware Handler | Lines 28-58: Injects correlation ID into request |
| Correlation ID Generation | UUID | Lines 30-31: Generates or extracts correlation ID |
| Span ID Generation | UUID | Lines 34: Generates span ID |
| Header Injection | Response Headers | Lines 45-50: Injects IDs into response headers |
| Logging | Logger | Lines 53-55: Logs correlation information |

**Observable Error Handling:**
- **try/catch:** NOT VERIFIED
- **timeout:** NOT VERIFIED
- **retry:** NOT VERIFIED
- **fallback:** NOT VERIFIED
- **logging:** YES (lines 53-55)
- **correlation id:** YES (lines 30-31, 34, 40-42, 45-50)

---

## 6. GRAPH RUNTIME SERVICES

### 6.1 Graph Matching Service
**File:** `c:\Trajectoire\apps\api\src\runtime\kg\graph-matching.service.ts`

| Component | Type | Evidence |
|-----------|------|----------|
| `match` | Matching Algorithm | Lines 1-543: Graph-based matching algorithm |
| Cache | CacheService | Lines 22-26, 540: Caches results for 30 minutes |
| Error Handling | NOT VERIFIED | No try/patch observed in main method |

**Observable Error Handling:**
- **try/catch:** NOT VERIFIED
- **timeout:** NOT VERIFIED
- **retry:** NOT VERIFIED
- **fallback:** NOT VERIFIED
- **logging:** NOT VERIFIED
- **correlation id:** NOT VERIFIED
- **cache:** YES (lines 22-26, 540)

---

### 6.2 Graph Search Service
**File:** `c:\Trajectoire\apps\api\src\runtime\kg\graph-search.service.ts`

| Component | Type | Evidence |
|-----------|------|----------|
| `searchCandidatesByNeighborhood` | Search Algorithm | Lines 1-604: Graph-based search algorithm |
| Cache | CacheService | Lines 22-26, 435: Caches results for 15 minutes |
| Error Handling | NOT VERIFIED | No try/catch observed in main method |

**Observable Error Handling:**
- **try/catch:** NOT VERIFIED
- **timeout:** NOT VERIFIED
- **retry:** NOT VERIFIED
- **fallback:** NOT VERIFIED
- **logging:** NOT VERIFIED
- **correlation id:** NOT VERIFIED
- **cache:** YES (lines 22-26, 435)

---

### 6.3 Runtime Graph Service
**File:** `c:\Trajectoire\apps\api\src\runtime\kg\runtime-graph.service.ts`

| Component | Type | Evidence |
|-----------|------|----------|
| `importCV` | Graph Import | Lines 1-915: CV import pipeline |
| `importJob` | Graph Import | Lines 1-915: Job import pipeline |
| Error Handling | NOT VERIFIED | No try/catch observed in main methods |

**Observable Error Handling:**
- **try/catch:** NOT VERIFIED
- **timeout:** NOT VERIFIED
- **retry:** NOT VERIFIED
- **fallback:** NOT VERIFIED
- **logging:** NOT VERIFIED
- **correlation id:** NOT VERIFIED
- **cache:** NOT VERIFIED

---

### 6.4 Copilot Service
**File:** `c:\Trajectoire\apps\api\src\copilot\copilot.service.ts`

| Component | Type | Evidence |
|-----------|------|----------|
| `processMessage` | Message Processing | Lines 1-225: Copilot message processing |
| Cache | CacheService | Lines 22-26, 220: Caches responses for 5 minutes |
| Error Handling | NOT VERIFIED | No try/catch observed in main method |

**Observable Error Handling:**
- **try/catch:** NOT VERIFIED
- **timeout:** NOT VERIFIED
- **retry:** NOT VERIFIED
- **fallback:** NOT VERIFIED
- **logging:** NOT VERIFIED
- **correlation id:** NOT VERIFIED
- **cache:** YES (lines 22-26, 220)

---

## 7. SESSION MANAGEMENT

### 7.1 Session Manager (API)
**File:** `c:\Trajectoire\apps\api\src\session\session.manager.ts`

| Component | Type | Evidence |
|-----------|------|----------|
| `SessionManager` | Session Manager | Lines 6-59: In-memory session management |
| `idleTimeoutMs` | Timeout | Line 8: 10 minute idle timeout |
| `cleanupInactiveSessions` | Cleanup | Lines 45-52: Periodic cleanup of idle sessions |
| `startCleanupTask` | Background Task | Lines 55-57: Starts periodic cleanup every 60s |
| `delete` | AbortController Cleanup | Lines 38-40: Aborts ASR and TTS on delete |

**Observable Error Handling:**
- **try/catch:** NOT VERIFIED
- **timeout:** YES (line 8, idle timeout)
- **retry:** NOT VERIFIED
- **fallback:** NOT VERIFIED
- **logging:** NOT VERIFIED
- **correlation id:** NOT VERIFIED
- **abort controller:** YES (lines 38-40)

---

### 7.2 Orchestrator Service
**File:** `c:\Trajectoire\apps\api\src\orchestrator\orchestrator.service.ts`

| Component | Type | Evidence |
|-----------|------|----------|
| `OrchestratorService` | FSM Orchestrator | Lines 21-89: FSM-based event orchestration |
| `handleEvent` | Event Handler | Lines 45-88: Handles events with FSM validation |
| Error Handling | try/catch | Lines 74-87: Catches handler errors and resets state |
| Recovery | State Reset | Line 86: Resets session to IDLE on error |
| Logging | Logger | Lines 54-62, 71, 77-84: Logs FSM rejections and errors |

**Observable Error Handling:**
- **try/catch:** YES (lines 74-87)
- **timeout:** NOT VERIFIED
- **retry:** NOT VERIFIED
- **fallback:** YES (line 86, state reset)
- **logging:** YES (lines 54-62, 71, 77-84)
- **correlation id:** NOT VERIFIED

---

### 7.3 Handlers
**File:** `c:\Trajectoire\apps\api\src\orchestrator\handlers.ts`

| Component | Type | Evidence |
|-----------|------|----------|
| `INTERRUPT` Handler | Interrupt Handler | Lines 103-115: Handles interrupt events |
| `DISCONNECT` Handler | Disconnect Handler | Lines 117-128: Handles disconnect events |
| AbortController Cleanup | Abort | Lines 106-107, 120-121: Aborts ASR and TTS streams |
| Queue Cleanup | Clear | Lines 109-110, 122-123: Clears playback queue |

**Observable Error Handling:**
- **try/catch:** NOT VERIFIED
- **timeout:** NOT VERIFIED
- **retry:** NOT VERIFIED
- **fallback:** NOT VERIFIED
- **logging:** YES (lines 32, 50, 60, 81, 89, 101, 114, 126)
- **correlation id:** NOT VERIFIED
- **abort controller:** YES (lines 106-107, 120-121)

---

## 8. VOICE / REALTIME GATEWAY

### 8.1 Deepgram Provider
**File:** `c:\Trajectoire\apps\api\src\voice\providers\asr\deepgram.provider.ts`

| Component | Type | Evidence |
|-----------|------|----------|
| `transcribeStream` | Stream Transcription | Lines 27-84: Async generator for transcription |
| AbortSignal | Cancellation | Lines 29, 51-54: Uses AbortSignal for cancellation |
| Error Handling | try/catch | Lines 58-69: Catches errors in audio streaming |
| Cleanup | Finish | Lines 52-54, 66-67: Cleans up on abort and error |

**Observable Error Handling:**
- **try/catch:** YES (lines 58-69)
- **timeout:** NOT VERIFIED
- **retry:** NOT VERIFIED
- **fallback:** NOT VERIFIED
- **logging:** YES (line 64)
- **correlation id:** NOT VERIFIED
- **abort controller:** YES (lines 29, 51-54)

---

### 8.2 Session Manager (Realtime Gateway)
**File:** `c:\Trajectoire\apps\realtime-gateway\src\session-manager.ts`

| Component | Type | Evidence |
|-----------|------|----------|
| `registerSession` | Session Registration | Lines 34-47: Registers session with TTL |
| `ttlTimer` | Timeout | Lines 18, 41: 45 minute TTL timer |
| `destroySession` | Session Cleanup | Lines 53-78: Cleans up session resources |
| AbortController Cleanup | Abort | Lines 59-61: Aborts LLM/TTS on destroy |
| STT Cleanup | Cleanup | Lines 65-71: Cleans up Deepgram STT stream |
| Error Handling | try/catch | Lines 66-70: Catches STT cleanup errors |

**Observable Error Handling:**
- **try/catch:** YES (lines 66-70)
- **timeout:** YES (line 41, 45 minute TTL)
- **retry:** NOT VERIFIED
- **fallback:** NOT VERIFIED
- **logging:** YES (line 69)
- **correlation id:** NOT VERIFIED
- **abort controller:** YES (lines 59-61)

---

### 8.3 AI Orchestrator
**File:** `c:\Trajectoire\apps\realtime-gateway\src\ai\orchestrator.ts`

| Component | Type | Evidence |
|-----------|------|----------|
| `transcript` Event Handler | Event Handler | Lines 16-86: Handles transcript events |
| AbortController | Cancellation | Lines 34-36, 37-39: Aborts existing streams |
| AbortSignal | Cancellation | Lines 60, 76: Passes AbortSignal to streams |
| Error Handling | try/catch | Lines 49-85: Catches stream errors |
| Abort Error Handling | AbortError Check | Lines 80-81: Handles AbortError specifically |

**Observable Error Handling:**
- **try/catch:** YES (lines 49-85)
- **timeout:** NOT VERIFIED
- **retry:** NOT VERIFIED
- **fallback:** NOT VERIFIED
- **logging:** YES (lines 81, 83, via bus.emit)
- **correlation id:** NOT VERIFIED
- **abort controller:** YES (lines 34-36, 37-39)

---

### 8.4 Voice Client (Web)
**File:** `c:\Trajectoire\apps\web\src\lib\voice\client.ts`

| Component | Type | Evidence |
|-----------|------|----------|
| `VoiceClient` | WebSocket Client | Lines 43-417: Voice WebSocket client |
| `scheduleReconnect` | Reconnection | Lines 133-142: Exponential backoff reconnection |
| `RECONNECT_DELAYS` | Reconnection Config | Line 36: Reconnection delays [1000, 2000, 5000, 10000] |
| `processPremiumAudio` | Stream Processing | Lines 338-398: LLM stream processing |
| AbortController | Cancellation | Lines 65, 199-200, 339: AbortController for streams |
| AbortSignal | Cancellation | Lines 346, 391: Passes AbortSignal to fetch |
| Error Handling | try/catch | Lines 109-114, 145-150, 296-324, 390-397 |
| Abort Error Handling | AbortError Check | Lines 391-393: Handles AbortError specifically |

**Observable Error Handling:**
- **try/catch:** YES (lines 109-114, 145-150, 296-324, 390-397)
- **timeout:** NOT VERIFIED
- **retry:** YES (lines 133-142, exponential backoff reconnection)
- **fallback:** NOT VERIFIED
- **logging:** YES (lines 314-318, conditional)
- **correlation id:** NOT VERIFIED
- **abort controller:** YES (lines 65, 199-200, 339)

---

## 9. QUEUE / BACKGROUND JOBS

### 9.1 Queue Module
**File:** `c:\Trajectoire\apps\api\src\queue\queue.module.ts`

| Component | Type | Evidence |
|-----------|------|----------|
| `BullModule` | Queue Configuration | Lines 7-46: Bull queue configuration |
| `attempts` | Retry | Line 20: 3 retry attempts |
| `backoff` | Exponential Backoff | Lines 21-24: Exponential backoff (2s delay, multiplier 2) |
| `timeout` | Timeout | Lines 31, 37, 43: Job timeouts (30s-60s) |
| Queues | Queue Names | Lines 28-45: cv-processing, job-processing, graph-operations |

**Observable Error Handling:**
- **try/catch:** NOT VERIFIED (Bull internal)
- **timeout:** YES (lines 31, 37, 43)
- **retry:** YES (lines 20, 21-24)
- **fallback:** NOT VERIFIED
- **logging:** NOT VERIFIED (Bull internal)
- **correlation id:** NOT VERIFIED

---

## 10. CACHE SERVICES

### 10.1 Cache Service
**File:** `c:\Trajectoire\apps\api\src\cache\cache.decorator.ts`

| Component | Type | Evidence |
|-----------|------|----------|
| `CacheService` | Cache Service | Lines 33-183: Cache service with metrics |
| `get` | Cache Get | Lines 40-53: Cache get with try/catch |
| `set` | Cache Set | Lines 55-61: Cache set with try/catch |
| `del` | Cache Delete | Lines 63-71: Cache delete with try/catch |
| `wrap` | Cache Wrapper | Lines 73-86: Cache wrapper with factory |
| Error Handling | try/catch | Lines 42-52, 56-60, 65-70: Catches cache errors |
| Fallback | Return Undefined | Lines 51, 59: Returns undefined on error |
| Metrics | Cache Metrics | Lines 95-148: Records cache hits/misses and latency |
| Logging | Logger | Lines 50, 59, 69: Logs cache errors |

**Observable Error Handling:**
- **try/catch:** YES (lines 42-52, 56-60, 65-70)
- **timeout:** NOT VERIFIED
- **retry:** NOT VERIFIED
- **fallback:** YES (lines 51, 59, return undefined)
- **logging:** YES (lines 50, 59, 69)
- **correlation id:** NOT VERIFIED
- **metrics:** YES (lines 95-148)

---

## 11. API CONTROLLERS (apps/api)

### 11.1 Search Controller
**File:** `c:\Trajectoire\apps\api\src\search\search.controller.ts`

| Component | Type | Evidence |
|-----------|------|----------|
| `searchCandidates` | Route Handler | Lines 12-38: try/catch with rate limiting |
| `searchJobs` | Route Handler | Lines 40-66: try/catch with rate limiting |
| Error Handling | try/catch | Lines 15-37, 43-65, 71-93, 97-121, 127-137, 143-167 |
| Rate Limiting | Decorator | Lines 13, 41, 69, 97, 141, 171, 186, 201, 216, 231, 246 |

**Observable Error Handling:**
- **try/catch:** YES (multiple methods)
- **timeout:** NOT VERIFIED
- **retry:** NOT VERIFIED
- **fallback:** NOT VERIFIED
- **logging:** NOT VERIFIED
- **correlation id:** NOT VERIFIED
- **rate limiting:** YES (decorators)

---

### 11.2 Copilot Controller
**File:** `c:\Trajectoire\apps\api\src\copilot\copilot.controller.ts`

| Component | Type | Evidence |
|-----------|------|----------|
| `processMessage` | Route Handler | Lines 9-21: try/catch with rate limiting |
| `getConversationHistory` | Route Handler | Lines 23-35: try/catch with rate limiting |
| Error Handling | try/catch | Lines 12-20, 26-34, 39-48, 54-62 |
| Rate Limiting | Decorator | Lines 10, 24, 38, 52 |

**Observable Error Handling:**
- **try/catch:** YES (multiple methods)
- **timeout:** NOT VERIFIED
- **retry:** NOT VERIFIED
- **fallback:** NOT VERIFIED
- **logging:** NOT VERIFIED
- **correlation id:** NOT VERIFIED
- **rate limiting:** YES (decorators)

---

### 11.3 Matching Controller
**File:** `c:\Trajectoire\apps\api\src\matching\matching.controller.ts`

| Component | Type | Evidence |
|-----------|------|----------|
| `calculateScore` | Route Handler | Lines 44-61: try/catch with rate limiting |
| `explainMatch` | Route Handler | Lines 63-85: try/catch with rate limiting |
| `generateReport` | Route Handler | Lines 87-129: try/catch with rate limiting |
| Error Handling | try/catch | Lines 15-25, 31-41, 47-60, 66-84, 90-128, 134-143, 149-158, 164-173, 179-188 |
| Rate Limiting | Decorator | Lines 13, 29, 45, 64, 88, 132, 147, 162, 177 |

**Observable Error Handling:**
- **try/catch:** YES (multiple methods)
- **timeout:** NOT VERIFIED
- **retry:** NOT VERIFIED
- **fallback:** NOT VERIFIED
- **logging:** NOT VERIFIED
- **correlation id:** NOT VERIFIED
- **rate limiting:** YES (decorators)

---

### 11.4 CV Controller
**File:** `c:\Trajectoire\apps\api\src\cv\cv.controller.ts`

| Component | Type | Evidence |
|-----------|------|----------|
| `uploadCv` | Route Handler | Lines 10-27: try/catch with rate limiting |
| `extractKnowledge` | Route Handler | Lines 29-41: try/catch with rate limiting |
| Error Handling | try/catch | Lines 18-26, 32-40, 46-54, 60-68, 74-82 |
| Rate Limiting | Decorator | Lines 12, 30, 44, 58, 72 |

**Observable Error Handling:**
- **try/catch:** YES (multiple methods)
- **timeout:** NOT VERIFIED
- **retry:** NOT VERIFIED
- **fallback:** NOT VERIFIED
- **logging:** NOT VERIFIED
- **correlation id:** NOT VERIFIED
- **rate limiting:** YES (decorators)

---

### 11.5 Job Controller
**File:** `c:\Trajectoire\apps\api\src\job\job.controller.ts`

| Component | Type | Evidence |
|-----------|------|----------|
| `uploadJob` | Route Handler | Lines 10-27: try/catch with rate limiting |
| `extractKnowledge` | Route Handler | Lines 29-41: try/catch with rate limiting |
| Error Handling | try/catch | Lines 18-26, 32-40, 46-54, 60-68, 74-82 |
| Rate Limiting | Decorator | Lines 12, 30, 44, 58, 72 |

**Observable Error Handling:**
- **try/catch:** YES (multiple methods)
- **timeout:** NOT VERIFIED
- **retry:** NOT VERIFIED
- **fallback:** NOT VERIFIED
- **logging:** NOT VERIFIED
- **correlation id:** NOT VERIFIED
- **rate limiting:** YES (decorators)

---

### 11.6 Health Controller
**File:** `c:\Trajectoire\apps\api\src\health\health.controller.ts`

| Component | Type | Evidence |
|-----------|------|----------|
| `check` | Health Check | Lines 21-31: Database, Redis, memory, disk checks |
| `liveness` | Liveness Check | Lines 33-40: Database and Redis checks |
| `readiness` | Readiness Check | Lines 42-50: Database, Redis, memory checks |
| Health Checks | Terminus | Lines 24-30, 36-39, 45-49: Uses NestJS Terminus |

**Observable Error Handling:**
- **try/catch:** NOT VERIFIED (Terminus internal)
- **timeout:** NOT VERIFIED
- **retry:** NOT VERIFIED
- **fallback:** NOT VERIFIED
- **logging:** NOT VERIFIED (Terminus internal)
- **correlation id:** NOT VERIFIED

---

## 12. WEB SERVICES

### 12.1 Copilot Service (Web)
**File:** `c:\Trajectoire\apps\web\src\services\copilot.service.ts`

| Component | Type | Evidence |
|-----------|------|----------|
| `processMessage` | API Call | Lines 6-21: fetch() call to copilot API |
| `getConversationHistory` | API Call | Lines 23-32: fetch() call to copilot API |
| Error Handling | Response Check | Lines 15-17, 26-28: Checks response.ok |
| Error Throwing | throw | Lines 16, 27, 40, 50: Throws errors on failure |

**Observable Error Handling:**
- **try/catch:** NOT VERIFIED
- **timeout:** NOT VERIFIED
- **retry:** NOT VERIFIED
- **fallback:** NOT VERIFIED
- **logging:** NOT VERIFIED
- **correlation id:** NOT VERIFIED

---

### 12.2 Search Service (Web)
**File:** `c:\Trajectoire\apps\web\src\services\search.service.ts`

| Component | Type | Evidence |
|-----------|------|----------|
| `searchCandidates` | API Call | Lines 6-21: fetch() call to search API |
| `searchJobs` | API Call | Lines 23-38: fetch() call to search API |
| Error Handling | Response Check | Lines 15-17, 32-34: Checks response.ok |
| Error Throwing | throw | Lines 16, 33, 50, 67, 84, 101, 118, 135, 144, 155: Throws errors on failure |

**Observable Error Handling:**
- **try/catch:** NOT VERIFIED
- **timeout:** NOT VERIFIED
- **retry:** NOT VERIFIED
- **fallback:** NOT VERIFIED
- **logging:** NOT VERIFIED
- **correlation id:** NOT VERIFIED

---

### 12.3 Matching Service (Web)
**File:** `c:\Trajectoire\apps\web\src\services\matching.service.ts`

| Component | Type | Evidence |
|-----------|------|----------|
| `registerCandidate` | API Call | Lines 6-20: fetch() call to matching API |
| `registerJob` | API Call | Lines 22-36: fetch() call to matching API |
| Error Handling | Response Check | Lines 15-17, 31-33: Checks response.ok |
| Error Throwing | throw | Lines 16, 32, 48, 64, 80, 91, 102: Throws errors on failure |

**Observable Error Handling:**
- **try/catch:** NOT VERIFIED
- **timeout:** NOT VERIFIED
- **retry:** NOT VERIFIED
- **fallback:** NOT VERIFIED
- **logging:** NOT VERIFIED
- **correlation id:** NOT VERIFIED

---

## 13. DATABASE SERVICES

### 13.1 Prisma Service
**File:** `c:\Trajectoire\apps\api\src\runtime\kg\prisma.service.ts`

| Component | Type | Evidence |
|-----------|------|----------|
| `PrismaService` | Prisma Client | Lines 5-13: Prisma client wrapper |
| `onModuleInit` | Lifecycle Hook | Lines 6-8: Connects to database |
| `onModuleDestroy` | Lifecycle Hook | Lines 10-12: Disconnects from database |

**Observable Error Handling:**
- **try/catch:** NOT VERIFIED
- **timeout:** NOT VERIFIED
- **retry:** NOT VERIFIED
- **fallback:** NOT VERIFIED
- **logging:** NOT VERIFIED
- **correlation id:** NOT VERIFIED

---

### 13.2 Prisma Analyzer
**File:** `c:\Trajectoire\apps\api\src\database\prisma-analyzer.ts`

| Component | Type | Evidence |
|-----------|------|----------|
| `PrismaAnalyzer` | Query Analyzer | Lines 25-235: Prisma query analysis |
| `enableQueryLogging` | Query Logging | Lines 132-155: Enables query logging |
| `detectNPlusOne` | N+1 Detection | Lines 160-165: Detects N+1 patterns |
| `generateSuggestions` | Suggestions | Lines 170-190: Generates optimization suggestions |
| Logging | Console | Lines 150, 214-233: Logs slow queries and analysis |

**Observable Error Handling:**
- **try/catch:** NOT VERIFIED
- **timeout:** NOT VERIFIED
- **retry:** NOT VERIFIED
- **fallback:** NOT VERIFIED
- **logging:** YES (lines 150, 214-233)
- **correlation id:** NOT VERIFIED

---

### 13.3 Data Lineage Repository
**File:** `c:\Trajectoire\apps\api\src\data-lineage\data-lineage.repository.ts`

| Component | Type | Evidence |
|-----------|------|----------|
| `DataLineageRepository` | Repository | Lines 22-286: In-memory data lineage repository |
| `createEntry` | CRUD Operation | Lines 30-33: Creates entry |
| `queryEntries` | Query Operation | Lines 52-70: Queries entries |
| Error Handling | NOT VERIFIED | No try/catch observed |

**Observable Error Handling:**
- **try/catch:** NOT VERIFIED
- **timeout:** NOT VERIFIED
- **retry:** NOT VERIFIED
- **fallback:** NOT VERIFIED
- **logging:** NOT VERIFIED
- **correlation id:** NOT VERIFIED
- **transaction:** NOT VERIFIED
- **rollback:** NOT VERIFIED

---

## 14. ADDITIONAL SERVICES

### 14.1 Playback Queue
**File:** `c:\Trajectoire\apps\api\src\common\playback-queue.ts`

| Component | Type | Evidence |
|-----------|------|----------|
| `PlaybackQueue` | Queue | Lines 1-16: Simple in-memory playback queue |
| `enqueue` | Queue Operation | Lines 3-5: Enqueues audio chunks |
| `drain` | Queue Operation | Lines 6-11: Drains queue |
| `clear` | Queue Operation | Lines 12-14: Clears queue |

**Observable Error Handling:**
- **try/catch:** NOT VERIFIED
- **timeout:** NOT VERIFIED
- **retry:** NOT VERIFIED
- **fallback:** NOT VERIFIED
- **logging:** NOT VERIFIED
- **correlation id:** NOT VERIFIED

---

### 14.2 Conversation Memory Service
**File:** `c:\Trajectoire\apps\api\src\copilot\conversation-memory.service.ts`

| Component | Type | Evidence |
|-----------|------|----------|
| `ConversationMemoryService` | Memory Service | Lines 21-89: In-memory conversation context |
| `getOrCreateContext` | Context Management | Lines 24-31: Gets or creates context |
| Error Handling | NOT VERIFIED | No try/catch observed |

**Observable Error Handling:**
- **try/catch:** NOT VERIFIED
- **timeout:** NOT VERIFIED
- **retry:** NOT VERIFIED
- **fallback:** NOT VERIFIED
- **logging:** NOT VERIFIED
- **correlation id:** NOT VERIFIED

---

### 14.3 Response Builder Service
**File:** `c:\Trajectoire\apps\api\src\copilot\response-builder.service.ts`

| Component | Type | Evidence |
|-----------|------|----------|
| `ResponseBuilderService` | Response Builder | Lines 14-175: Builds copilot responses |
| `buildResponse` | Response Building | Lines 15-77: Main response building logic |
| Error Handling | NOT VERIFIED | No try/catch observed |

**Observable Error Handling:**
- **try/catch:** NOT VERIFIED
- **timeout:** NOT VERIFIED
- **retry:** NOT VERIFIED
- **fallback:** NOT VERIFIED
- **logging:** NOT VERIFIED
- **correlation id:** NOT VERIFIED

---

### 14.4 Reasoning Service
**File:** `c:\Trajectoire\apps\api\src\copilot\reasoning.service.ts`

| Component | Type | Evidence |
|-----------|------|----------|
| `ReasoningService` | Reasoning Engine | Lines 12-200: Copilot reasoning service |
| `reason` | Reasoning Logic | Lines 13-37: Main reasoning logic |
| Error Handling | NOT VERIFIED | No try/catch observed |

**Observable Error Handling:**
- **try/catch:** NOT VERIFIED
- **timeout:** NOT VERIFIED
- **retry:** NOT VERIFIED
- **fallback:** NOT VERIFIED
- **logging:** NOT VERIFIED
- **correlation id:** NOT VERIFIED

---

## SUMMARY

**Total Components Analyzed:** 50+  
**Components with try/catch:** 15  
**Components with timeout:** 5  
**Components with retry:** 3  
**Components with circuit breaker:** 2  
**Components with fallback:** 4  
**Components with logging:** 10  
**Components with correlation id:** 3  
**Components with cache:** 4  
**Components with abort controller:** 5  
**Components with rate limiting:** 8  
**Components with queue:** 1  
**Components with metrics:** 2  
**Components with tracing:** 1

---

**END OF RC37-COMPONENTS.md**
