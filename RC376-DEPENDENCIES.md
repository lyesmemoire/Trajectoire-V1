# RC37.6 - Dependencies Analysis

**Mission:** Analyze dependencies for resilience patterns based on observable evidence only.

**Evidence Policy:** Every assertion based on RC37.1, RC37.2, RC37.3, RC37.4, and RC37.5 evidence. No assumptions, estimations, or inferences.

---

## DEPENDENCY 1: SUPABASE

### Usage
- **Evidence:** RC371-RUNTIME-FLOWS.md
- **File:** page.tsx (signup)
- **Line:** 44
- **Function:** `handleSubmit`
- **Operation:** `supabase.auth.signUp`

### Timeout
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No timeout observed

### Retry
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No retry observed

### Fallback
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No fallback observed

### Circuit Breaker
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No circuit breaker observed

### Cache
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No cache observed

### Abort Controller
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No abort controller observed

### Rate Limit
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No rate limit observed

### Dependency Summary
- **Timeout:** NOT OBSERVED
- **Retry:** NOT OBSERVED
- **Fallback:** NOT OBSERVED
- **Circuit Breaker:** NOT OBSERVED
- **Cache:** NOT OBSERVED
- **Abort Controller:** NOT OBSERVED
- **Rate Limit:** NOT OBSERVED

---

## DEPENDENCY 2: REDIS

### Usage
- **Evidence:** RC371-RUNTIME-FLOWS.md
- **File:** route.ts (analyze-preview)
- **Line:** 15
- **Function:** `POST`
- **Operation:** `checkRateLimit('preview:${fingerprint}', 3, 3600)`

### Timeout
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No timeout observed

### Retry
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No retry observed

### Fallback
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No fallback observed

### Circuit Breaker
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No circuit breaker observed

### Cache
- **Evidence:** RC371-RUNTIME-FLOWS.md
- **File:** route.ts (analyze-preview)
- **Line:** 15
- **Implementation:** Redis used as rate limit cache

### Abort Controller
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No abort controller observed

### Rate Limit
- **Evidence:** RC371-RUNTIME-FLOWS.md
- **File:** route.ts (analyze-preview)
- **Line:** 15
- **Implementation:** `checkRateLimit('preview:${fingerprint}', 3, 3600)`

### Dependency Summary
- **Timeout:** NOT OBSERVED
- **Retry:** NOT OBSERVED
- **Fallback:** NOT OBSERVED
- **Circuit Breaker:** NOT OBSERVED
- **Cache:** YES (rate limit)
- **Abort Controller:** NOT OBSERVED
- **Rate Limit:** YES

---

## DEPENDENCY 3: STRIPE

### Usage
- **Evidence:** RC371-RUNTIME-FLOWS.md
- **File:** stripe/checkout/route.ts
- **Line:** 156
- **Function:** `POST`
- **Operation:** `stripe.checkout.sessions.create`

### Timeout
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No timeout observed

### Retry
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No retry observed

### Fallback
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No fallback observed

### Circuit Breaker
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No circuit breaker observed

### Cache
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No cache observed

### Abort Controller
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No abort controller observed

### Rate Limit
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No rate limit observed

### Dependency Summary
- **Timeout:** NOT OBSERVED
- **Retry:** NOT OBSERVED
- **Fallback:** NOT OBSERVED
- **Circuit Breaker:** NOT OBSERVED
- **Cache:** NOT OBSERVED
- **Abort Controller:** NOT OBSERVED
- **Rate Limit:** NOT OBSERVED

---

## DEPENDENCY 4: OPENAI

### Usage
- **Evidence:** RC371-RUNTIME-FLOWS.md
- **File:** preview-analyzer.ts
- **Line:** 55
- **Function:** `generatePreviewAnalysis`
- **Operation:** `openai.chat.completions.create`

### Timeout
- **Evidence:** RC371-RUNTIME-FLOWS.md
- **File:** preview-analyzer.ts
- **Line:** 58
- **Implementation:** `{ timeout: 8000 }` (8 seconds)

### Retry
- **Evidence:** RC371-RUNTIME-FLOWS.md
- **File:** preview-analyzer.ts
- **Line:** 26
- **Implementation:** `maxRetries: 0` (no retry)

### Fallback
- **Evidence:** RC371-RUNTIME-FLOWS.md
- **File:** preview-analyzer.ts
- **Line:** 86
- **Implementation:** `generateFallbackAnalysis()` on error

### Circuit Breaker
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No circuit breaker observed

### Cache
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No cache observed

### Abort Controller
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No abort controller observed

### Rate Limit
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No rate limit observed

### Dependency Summary
- **Timeout:** YES (8s)
- **Retry:** NO (maxRetries: 0)
- **Fallback:** YES (generateFallbackAnalysis)
- **Circuit Breaker:** NOT OBSERVED
- **Cache:** NOT OBSERVED
- **Abort Controller:** NOT OBSERVED
- **Rate Limit:** NOT OBSERVED

---

## DEPENDENCY 5: DEEPGRAM

### Usage
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** Deepgram usage not observed in RC37.1-37.5

### Timeout
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No timeout observed

### Retry
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No retry observed

### Fallback
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No fallback observed

### Circuit Breaker
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No circuit breaker observed

### Cache
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No cache observed

### Abort Controller
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No abort controller observed

### Rate Limit
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No rate limit observed

### Dependency Summary
- **Usage:** NOT OBSERVED
- **Timeout:** NOT OBSERVED
- **Retry:** NOT OBSERVED
- **Fallback:** NOT OBSERVED
- **Circuit Breaker:** NOT OBSERVED
- **Cache:** NOT OBSERVED
- **Abort Controller:** NOT OBSERVED
- **Rate Limit:** NOT OBSERVED

---

## DEPENDENCY 6: PRISMA

### Usage
- **Evidence:** RC371-RUNTIME-FLOWS.md
- **File:** Multiple files
- **Line:** Multiple
- **Function:** Multiple
- **Operation:** Database queries (findUnique, findMany, create, update)

### Timeout
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No timeout observed

### Retry
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No retry observed

### Fallback
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No fallback observed

### Circuit Breaker
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No circuit breaker observed

### Cache
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No cache observed

### Abort Controller
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No abort controller observed

### Rate Limit
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No rate limit observed

### Dependency Summary
- **Timeout:** NOT OBSERVED
- **Retry:** NOT OBSERVED
- **Fallback:** NOT OBSERVED
- **Circuit Breaker:** NOT OBSERVED
- **Cache:** NOT OBSERVED
- **Abort Controller:** NOT OBSERVED
- **Rate Limit:** NOT OBSERVED

---

## DEPENDENCY 7: SMTP

### Usage
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** SMTP usage not observed in RC37.1-37.5

### Timeout
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No timeout observed

### Retry
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No retry observed

### Fallback
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No fallback observed

### Circuit Breaker
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No circuit breaker observed

### Cache
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No cache observed

### Abort Controller
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No abort controller observed

### Rate Limit
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No rate limit observed

### Dependency Summary
- **Usage:** NOT OBSERVED
- **Timeout:** NOT OBSERVED
- **Retry:** NOT OBSERVED
- **Fallback:** NOT OBSERVED
- **Circuit Breaker:** NOT OBSERVED
- **Cache:** NOT OBSERVED
- **Abort Controller:** NOT OBSERVED
- **Rate Limit:** NOT OBSERVED

---

## DEPENDENCY 8: STORAGE

### Usage
- **Evidence:** RC371-RUNTIME-FLOWS.md
- **File:** cv/upload/route.ts
- **Line:** 26-136
- **Function:** `POST`
- **Operation:** File upload and text extraction

### Timeout
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No timeout observed

### Retry
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No retry observed

### Fallback
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No fallback observed

### Circuit Breaker
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No circuit breaker observed

### Cache
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No cache observed

### Abort Controller
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No abort controller observed

### Rate Limit
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No rate limit observed

### Dependency Summary
- **Timeout:** NOT OBSERVED
- **Retry:** NOT OBSERVED
- **Fallback:** NOT OBSERVED
- **Circuit Breaker:** NOT OBSERVED
- **Cache:** NOT OBSERVED
- **Abort Controller:** NOT OBSERVED
- **Rate Limit:** NOT OBSERVED

---

## DEPENDENCY 9: CRON

### Usage
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** Cron usage not observed in RC37.1-37.5

### Timeout
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No timeout observed

### Retry
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No retry observed

### Fallback
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No fallback observed

### Circuit Breaker
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No circuit breaker observed

### Cache
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No cache observed

### Abort Controller
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No abort controller observed

### Rate Limit
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No rate limit observed

### Dependency Summary
- **Usage:** NOT OBSERVED
- **Timeout:** NOT OBSERVED
- **Retry:** NOT OBSERVED
- **Fallback:** NOT OBSERVED
- **Circuit Breaker:** NOT OBSERVED
- **Cache:** NOT OBSERVED
- **Abort Controller:** NOT OBSERVED
- **Rate Limit:** NOT OBSERVED

---

## DEPENDENCY 10: QUEUE

### Usage
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** Queue usage not observed in RC37.1-37.5

### Timeout
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No timeout observed

### Retry
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No retry observed

### Fallback
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No fallback observed

### Circuit Breaker
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No circuit breaker observed

### Cache
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No cache observed

### Abort Controller
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No abort controller observed

### Rate Limit
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No rate limit observed

### Dependency Summary
- **Usage:** NOT OBSERVED
- **Timeout:** NOT OBSERVED
- **Retry:** NOT OBSERVED
- **Fallback:** NOT OBSERVED
- **Circuit Breaker:** NOT OBSERVED
- **Cache:** NOT OBSERVED
- **Abort Controller:** NOT OBSERVED
- **Rate Limit:** NOT OBSERVED

---

## DEPENDENCY 11: WEBHOOKS

### Usage
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** Webhook usage not observed in RC37.1-37.5

### Timeout
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No timeout observed

### Retry
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No retry observed

### Fallback
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No fallback observed

### Circuit Breaker
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No circuit breaker observed

### Cache
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No cache observed

### Abort Controller
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No abort controller observed

### Rate Limit
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No rate limit observed

### Dependency Summary
- **Usage:** NOT OBSERVED
- **Timeout:** NOT OBSERVED
- **Retry:** NOT OBSERVED
- **Fallback:** NOT OBSERVED
- **Circuit Breaker:** NOT OBSERVED
- **Cache:** NOT OBSERVED
- **Abort Controller:** NOT OBSERVED
- **Rate Limit:** NOT OBSERVED

---

## SUMMARY

### Total Dependencies: 11

### Dependency Usage

| Dependency | Usage | Evidence |
|------------|-------|----------|
| Supabase | YES | RC371-RUNTIME-FLOWS.md |
| Redis | YES | RC371-RUNTIME-FLOWS.md |
| Stripe | YES | RC371-RUNTIME-FLOWS.md |
| OpenAI | YES | RC371-RUNTIME-FLOWS.md |
| Deepgram | NOT OBSERVED | NOT OBSERVED |
| Prisma | YES | RC371-RUNTIME-FLOWS.md |
| SMTP | NOT OBSERVED | NOT OBSERVED |
| Storage | YES | RC371-RUNTIME-FLOWS.md |
| Cron | NOT OBSERVED | NOT OBSERVED |
| Queue | NOT OBSERVED | NOT OBSERVED |
| Webhooks | NOT OBSERVED | NOT OBSERVED |

**Usage Coverage:** 6/11 (55%)

### Timeout Coverage

| Metric | Count | Percentage |
|--------|-------|------------|
| Dependencies with Timeout | 1 | 9% |
| Dependencies without Timeout | 10 | 91% |

### Retry Coverage

| Metric | Count | Percentage |
|--------|-------|------------|
| Dependencies with Retry | 0 | 0% |
| Dependencies without Retry | 11 | 100% |

### Fallback Coverage

| Metric | Count | Percentage |
|--------|-------|------------|
| Dependencies with Fallback | 1 | 9% |
| Dependencies without Fallback | 10 | 91% |

### Circuit Breaker Coverage

| Metric | Count | Percentage |
|--------|-------|------------|
| Dependencies with Circuit Breaker | 0 | 0% |
| Dependencies without Circuit Breaker | 11 | 100% |

### Cache Coverage

| Metric | Count | Percentage |
|--------|-------|------------|
| Dependencies with Cache | 1 | 9% |
| Dependencies without Cache | 10 | 91% |

### Abort Controller Coverage

| Metric | Count | Percentage |
|--------|-------|------------|
| Dependencies with Abort Controller | 0 | 0% |
| Dependencies without Abort Controller | 11 | 100% |

### Rate Limit Coverage

| Metric | Count | Percentage |
|--------|-------|------------|
| Dependencies with Rate Limit | 1 | 9% |
| Dependencies without Rate Limit | 10 | 91% |

### Critical Gaps

1. **No Retry:** No retry observed for any dependency (0/11)
2. **No Circuit Breaker:** No circuit breaker observed for any dependency (0/11)
3. **No Abort Controller:** No abort controller observed for any dependency (0/11)
4. **Limited Timeout:** Only 1 dependency has timeout (1/11)
5. **Limited Fallback:** Only 1 dependency has fallback (1/11)
6. **Limited Cache:** Only 1 dependency has cache (1/11)
7. **Limited Rate Limit:** Only 1 dependency has rate limit (1/11)
8. **No Usage:** 5 dependencies not observed in RC37.1-37.5

### Observable Dependency Patterns

- **No Timeout:** 10/11 dependencies (91%)
- **No Retry:** 11/11 dependencies (100%)
- **No Fallback:** 10/11 dependencies (91%)
- **No Circuit Breaker:** 11/11 dependencies (100%)
- **No Abort Controller:** 11/11 dependencies (100%)

### Evidence Completeness

- **Total Dependencies Analyzed:** 11
- **With Usage:** 6 (55%)
- **Without Usage:** 5 (45%)
- **Fully Observed:** 11 (100%)
- **Partially Observed:** 0 (0%)
- **Not Observed:** 0 (0%)

**Evidence Source:** RC37.1, RC37.2, RC37.3, RC37.4, and RC37.5 reports
