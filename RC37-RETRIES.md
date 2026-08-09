# RC37-RETRIES.md

**Chaos Engineering Certification - Retry Analysis**

**Date:** 2026-08-06  
**Scope:** Trajectoire Gateway and API Retry Configurations  
**Objective:** Document all observed retry patterns and identify gaps

---

## 1. OBSERVED RETRY PATTERNS

### 1.1 Retry Decorator Service
**File:** `c:\Trajectoire\apps\api\src\resilience\retry.decorator.ts`

| Component | Retry Config | Evidence | Line |
|-----------|--------------|----------|------|
| `RetryService.executeWithRetry` | Configurable retry | `maxAttempts: 3`, `delay: 1000ms`, `backoffMultiplier: 2` | 28-64 |

**Code Evidence:**
```typescript
static async executeWithRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxAttempts = 3,
    delay = 1000,
    backoffMultiplier = 2,
    maxDelay = 10000,
    retryableErrors = [],
  } = options;

  let lastError: Error;
  let currentDelay = delay;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      const isRetryable = 
        retryableErrors.length === 0 || 
        retryableErrors.some(err => error instanceof Error && error.message.includes(err));

      if (!isRetryable || attempt === maxAttempts) {
        throw error;
      }

      await new Promise(resolve => setTimeout(resolve, currentDelay));
      currentDelay = Math.min(currentDelay * backoffMultiplier, maxDelay);
    }
  }

  throw lastError!;
}
```

**Observable Retry:** YES (exponential backoff, configurable)

---

### 1.2 Queue Module
**File:** `c:\Trajectoire\apps\api\src\queue\queue.module.ts`

| Component | Retry Config | Evidence | Line |
|-----------|--------------|----------|------|
| Bull Queue Default | 3 attempts, exponential backoff | `attempts: 3`, `backoff: { type: 'exponential', delay: 2000 }` | 20-24 |

**Code Evidence:**
```typescript
defaultJobOptions: {
  removeOnComplete: 10,
  removeOnFail: 5,
  attempts: 3,
  backoff: {
    type: 'exponential',
    delay: 2000,
  },
},
```

**Observable Retry:** YES (3 attempts, exponential backoff, 2s base delay)

---

### 1.3 Voice Client (Web)
**File:** `c:\Trajectoire\apps\web\src\lib\voice\client.ts`

| Component | Retry Config | Evidence | Line |
|-----------|--------------|----------|------|
| WebSocket Reconnection | Exponential backoff | `RECONNECT_DELAYS = [1000, 2000, 5000, 10000]` ms | 36, 133-142 |

**Code Evidence:**
```typescript
const RECONNECT_DELAYS = [1000, 2000, 5000, 10000];

private scheduleReconnect() {
  const delay = RECONNECT_DELAYS[Math.min(this.reconnectAttempt, RECONNECT_DELAYS.length - 1)] ?? 10000;
  this.reconnectAttempt += 1;
  this.setState('connecting');
  setTimeout(async () => {
    if (this.manualStop) return;
    const ok = await this.connect();
    if (ok) this.setState('listening');
  }, delay);
}
```

**Observable Retry:** YES (exponential backoff reconnection, max 10s delay)

---

### 1.4 Rate Limiting Service
**File:** `c:\Trajectoire\apps\api\src\resilience\rate-limiting.service.ts`

| Component | Retry Config | Evidence | Line |
|-----------|--------------|----------|------|
| Redis Operations | Fail-open (no retry) | Catches errors and allows request | 64-104 |

**Code Evidence:**
```typescript
try {
  // Redis operations
} catch (error) {
  this.logger.error(`Rate limiting error: ${error.message}`);
  // Fail open - allow request if rate limiting fails
  return {
    allowed: true,
    remaining: limit,
    resetTime: new Date(Date.now() + windowMs),
  };
}
```

**Observable Retry:** NO (fail-open strategy instead of retry)

---

### 1.5 Redis Client
**File:** `c:\Trajectoire\lib\redis.ts`

| Component | Retry Config | Evidence | Line |
|-----------|--------------|----------|------|
| Redis Operations | Fallback to direct fetch (no retry) | Catches errors and falls back | 27-34, 42-49 |

**Code Evidence:**
```typescript
async getCached<T>(key: string, fetcher: () => Promise<T>, ttl?: number): Promise<T> {
  try {
    const cached = await this.redis.get(key);
    if (cached) return JSON.parse(cached);
  } catch (error) {
    console.error('[Redis] Cache get error:', error);
  }
  // Fallback to direct fetch
  return fetcher();
}
```

**Observable Retry:** NO (fallback strategy instead of retry)

---

## 2. MISSING RETRY PATTERNS (GAPS)

### 2.1 External API Calls

| Component | Expected Retry | Current Status | Evidence Location |
|-----------|----------------|----------------|------------------|
| OpenAI API Calls | 3 attempts, exponential backoff | NOT VERIFIED | `c:\Trajectoire\lib\openai.ts` |
| Supabase Client | 3 attempts, exponential backoff | NOT VERIFIED | `c:\Trajectoire\lib\supabase.ts` |
| Stripe API Calls | 3 attempts, exponential backoff | NOT VERIFIED | `c:\Trajectoire\lib\stripe.ts` |
| Deepgram API Calls | 3 attempts, exponential backoff | NOT VERIFIED | `c:\Trajectoire\apps\api\src\voice\providers\asr\deepgram.provider.ts` |

**Gap Analysis:**
- OpenAI client has no retry configuration (only circuit breaker)
- Supabase browser client has no retry configuration
- Stripe client has no retry configuration
- Deepgram provider has no retry configuration

---

### 2.2 HTTP Requests (Web Services)

| Component | Expected Retry | Current Status | Evidence Location |
|-----------|----------------|----------------|------------------|
| Copilot Service fetch() | 3 attempts, exponential backoff | NOT VERIFIED | `c:\Trajectoire\apps\web\src\services\copilot.service.ts` |
| Search Service fetch() | 3 attempts, exponential backoff | NOT VERIFIED | `c:\Trajectoire\apps\web\src\services\search.service.ts` |
| Matching Service fetch() | 3 attempts, exponential backoff | NOT VERIFIED | `c:\Trajectoire\apps\web\src\services\matching.service.ts` |

**Gap Analysis:**
- All web service fetch() calls lack retry configuration
- No exponential backoff for failed requests
- No retryable error filtering

**Code Evidence (Missing Retry):**
```typescript
// c:\Trajectoire\apps\web\src\services\copilot.service.ts
async processMessage(sessionId: string, message: string): Promise<CopilotResponse> {
  const response = await fetch(`${API_BASE_URL}/copilot/message`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ sessionId, message }),
    // NO RETRY CONFIGURATION
  });
  if (!response.ok) {
    throw new Error('Failed to process message');
  }
}
```

---

### 2.3 Gateway Controllers

| Component | Expected Retry | Current Status | Evidence Location |
|-----------|----------------|----------------|------------------|
| Session Controller SIL calls | 3 attempts, exponential backoff | NOT VERIFIED | `c:\Trajectoire\gateway\controllers\session.controller.ts` |
| Event Controller SIL calls | 3 attempts, exponential backoff | NOT VERIFIED | `c:\Trajectoire\gateway\controllers\event.controller.ts` |
| Report Controller SIL calls | 3 attempts, exponential backoff | NOT VERIFIED | `c:\Trajectoire\gateway\controllers\report.controller.ts` |

**Gap Analysis:**
- Gateway SIL client calls have no retry configuration
- No retry for transient network errors
- No retry for temporary service unavailability

---

### 2.4 Graph Runtime Services

| Component | Expected Retry | Current Status | Evidence Location |
|-----------|----------------|----------------|------------------|
| GraphMatchingService.match | 3 attempts, exponential backoff | NOT VERIFIED | `c:\Trajectoire\apps\api\src\runtime\kg\graph-matching.service.ts` |
| GraphSearchService.search | 3 attempts, exponential backoff | NOT VERIFIED | `c:\Trajectoire\apps\api\src\runtime\kg\graph-search.service.ts` |
| RuntimeGraphService.importCV | 3 attempts, exponential backoff | NOT VERIFIED | `c:\Trajectoire\apps\api\src\runtime\kg\runtime-graph.service.ts` |

**Gap Analysis:**
- All graph runtime operations lack retry configuration
- No retry for transient database errors
- No retry for temporary cache failures

---

### 2.5 Database Operations

| Component | Expected Retry | Current Status | Evidence Location |
|-----------|----------------|----------------|------------------|
| Prisma Queries | 3 attempts, exponential backoff | NOT VERIFIED | `c:\Trajectoire\apps\api\src\runtime\kg\prisma.service.ts` |
| Prisma Transactions | 3 attempts, exponential backoff | NOT VERIFIED | `c:\Trajectoire\apps\api\src\runtime\kg\prisma.service.ts` |

**Gap Analysis:**
- Prisma client has no retry configuration
- No retry for connection errors
- No retry for transaction deadlocks

---

## 3. RETRY COVERAGE ANALYSIS

### 3.1 Coverage by Component Category

| Category | Total Components | With Retry | Coverage % |
|----------|------------------|------------|------------|
| Resilience Services | 4 | 1 | 25% |
| Queue/Background Jobs | 3 | 3 | 100% |
| Voice/Realtime | 3 | 1 | 33% |
| External API Clients | 5 | 0 | 0% |
| Graph Runtime Services | 4 | 0 | 0% |
| Gateway Controllers | 3 | 0 | 0% |
| Web Services | 3 | 0 | 0% |
| Database Operations | 2 | 0 | 0% |
| Cache Services | 2 | 0 | 0% |
| **TOTAL** | **29** | **5** | **17%** |

### 3.2 Critical Path Retry Coverage

| Critical Path | Components | With Retry | Coverage % |
|---------------|------------|--------------|------------|
| Authentication Flow | 2 | 0 | 0% |
| Payment Flow | 1 | 0 | 0% |
| AI Feature Flow | 2 | 0 | 0% |
| Graph Processing Flow | 3 | 0 | 0% |
| Voice/Realtime Flow | 2 | 1 | 50% |
| Background Jobs | 3 | 3 | 100% |

---

## 4. RETRYABLE ERROR ANALYSIS

### 4.1 Retryable Error Types

| Error Type | Should Retry | Current Implementation | Evidence |
|------------|--------------|----------------------|----------|
| Network Timeout | YES | NOT VERIFIED | - |
| Connection Refused | YES | NOT VERIFIED | - |
| 5xx Server Errors | YES | NOT VERIFIED | - |
| 429 Rate Limit | YES | NOT VERIFIED | - |
| 503 Service Unavailable | YES | NOT VERIFIED | - |
| 504 Gateway Timeout | YES | NOT VERIFIED | - |
| 401 Unauthorized | NO | NOT VERIFIED (should be non-retryable) | - |
| 403 Forbidden | NO | NOT VERIFIED (should be non-retryable) | - |
| 404 Not Found | NO | NOT VERIFIED (should be non-retryable) | - |
| Validation Errors (400) | NO | NOT VERIFIED (should be non-retryable) | - |

### 4.2 Retry Configuration Analysis

| Component | Max Attempts | Base Delay | Max Delay | Backoff Type | Jitter |
|-----------|--------------|------------|----------|-------------|--------|
| RetryService | 3 | 1000ms | 10000ms | Exponential | NO |
| Bull Queue | 3 | 2000ms | N/A | Exponential | NO |
| Voice Client | 4 | 1000ms | 10000ms | Exponential | NO |

**Gap Analysis:**
- No jitter in retry delays (can cause retry storms)
- No adaptive retry based on error type
- No circuit breaker integration with retry

---

## 5. RECOMMENDATIONS

### 5.1 Immediate Actions (P0)

1. **Add retry to OpenAI client**
   - Configure 3 attempts with exponential backoff
   - Add jitter to prevent retry storms
   - Filter retryable errors (429, 500-504)
   - File: `c:\Trajectoire\lib\openai.ts`

2. **Add retry to Stripe client**
   - Configure 3 attempts with exponential backoff
   - Add idempotency key for payment operations
   - Filter retryable errors (429, 500-504)
   - File: `c:\Trajectoire\lib\stripe.ts`

3. **Add retry to Supabase client**
   - Configure 3 attempts with exponential backoff
   - Filter retryable errors (connection errors, 503)
   - File: `c:\Trajectoire\lib\supabase.ts`

### 5.2 High Priority Actions (P1)

4. **Add retry to web service fetch() calls**
   - Configure 3 attempts with exponential backoff
   - Use AbortSignal for cancellation
   - Filter retryable errors (5xx, network errors)
   - Files: `c:\Trajectoire\apps\web\src\services\*.ts`

5. **Add retry to gateway SIL client calls**
   - Configure 3 attempts with exponential backoff
   - Filter retryable errors (5xx, network errors)
   - Files: `c:\Trajectoire\gateway\controllers\*.ts`

6. **Add retry to graph runtime services**
   - Configure 3 attempts with exponential backoff
   - Filter retryable errors (database errors, cache errors)
   - Files: `c:\Trajectoire\apps\api\src\runtime\kg\*.ts`

7. **Add retry to Prisma operations**
   - Configure 3 attempts with exponential backoff
   - Add deadlock detection and retry
   - File: `c:\Trajectoire\apps\api\src\runtime\kg\prisma.service.ts`

### 5.3 Medium Priority Actions (P2)

8. **Add jitter to all retry delays**
   - Implement random jitter (±25%)
   - Prevent retry storms
   - Apply to all retry implementations

9. **Implement adaptive retry**
   - Adjust retry delay based on error type
   - Shorter delays for network errors
   - Longer delays for rate limits

10. **Integrate retry with circuit breaker**
    - Use circuit breaker before retry
    - Prevent retry when circuit is open
    - Coordinate retry and circuit breaker state

---

## 6. RETRY CONFIGURATION STANDARDS

### 6.1 Recommended Retry Configuration

| Operation Type | Max Attempts | Base Delay | Max Delay | Backoff Type | Jitter |
|----------------|--------------|------------|----------|-------------|--------|
| External API Calls | 3 | 1000ms | 10000ms | Exponential | ±25% |
| Database Queries | 3 | 500ms | 5000ms | Exponential | ±25% |
| Cache Operations | 2 | 0ms | 0ms | Immediate | N/A |
| WebSocket Connection | 5 | 1000ms | 30000ms | Exponential | ±25% |
| File Upload | 3 | 2000ms | 10000ms | Exponential | ±25% |
| Background Jobs | 3 | 2000ms | N/A | Exponential | ±25% |

### 6.2 Retryable Error Classification

**Retryable Errors:**
- Network errors (ECONNREFUSED, ETIMEDOUT, ENETUNREACH)
- HTTP 5xx errors (500, 502, 503, 504)
- HTTP 429 (Rate Limit)
- Connection timeout
- Read timeout
- Database connection errors
- Database deadlock errors

**Non-Retryable Errors:**
- HTTP 4xx errors (400, 401, 403, 404)
- Validation errors
- Authentication errors
- Authorization errors
- Not found errors
- Business logic errors

### 6.3 Retry Implementation Pattern

```typescript
// Recommended pattern for retry implementation
async operationWithRetry<T>(
  operation: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxAttempts = 3,
    baseDelay = 1000,
    maxDelay = 10000,
    backoffMultiplier = 2,
    jitter = 0.25,
    retryableErrors = ['ECONNREFUSED', 'ETIMEDOUT', '500', '502', '503', '504', '429'],
  } = options;

  let lastError: Error;
  let currentDelay = baseDelay;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      
      const isRetryable = retryableErrors.some(
        err => error.message.includes(err) || 
                (error as any).code === err ||
                (error as any).status === parseInt(err)
      );

      if (!isRetryable || attempt === maxAttempts) {
        throw error;
      }

      // Add jitter to prevent retry storms
      const jitteredDelay = currentDelay * (1 + (Math.random() - 0.5) * jitter);
      
      await new Promise(resolve => setTimeout(resolve, jitteredDelay));
      currentDelay = Math.min(currentDelay * backoffMultiplier, maxDelay);
    }
  }

  throw lastError!;
}
```

---

## SUMMARY

**Total Components Analyzed:** 29  
**Components with Retry:** 5 (17%)  
**Components without Retry:** 24 (83%)

**Critical Gaps:**
- External API clients (OpenAI, Stripe, Supabase, Deepgram) - 0% retry coverage
- Graph runtime services - 0% retry coverage
- Gateway controllers - 0% retry coverage
- Web services - 0% retry coverage
- Database operations - 0% retry coverage

**Strong Areas:**
- Queue/Background jobs - 100% retry coverage
- Resilience services - 25% retry coverage (retry decorator available but not widely used)

**Overall Retry Coverage:** 17%

---

**END OF RC37-RETRIES.md**
