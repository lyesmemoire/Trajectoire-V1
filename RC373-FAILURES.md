# RC37.3 - Failure Scenarios Analysis

**Mission:** Analyze failure scenarios for all runtime flows based on observable evidence only.

**Evidence Policy:** Every assertion based on RC37.1 and RC37.2 evidence. No assumptions, estimations, or inferences.

---

## FAILURE SCENARIO 1: OPENAI TIMEOUT

### Flow Affected
- Landing → ATS Preview
- File: `c:\Trajectoire\apps\web\src\lib\ai\preview-analyzer.ts`
- Line: 55-69
- Function: `generatePreviewAnalysis`

### Observable Behavior

**Timeout Configuration**
- **Evidence:** RC371-RUNTIME-FLOWS.md
- **File:** preview-analyzer.ts
- **Line:** 58
- **Configuration:** `{ timeout: 8000 }` (8 seconds)

**Retry Configuration**
- **Evidence:** RC371-RUNTIME-FLOWS.md
- **File:** preview-analyzer.ts
- **Line:** 26
- **Configuration:** `maxRetries: 0` (no retry)

**Catch**
- **Evidence:** RC371-RUNTIME-FLOWS.md
- **File:** preview-analyzer.ts
- **Line:** 84-88
- **Implementation:** try/catch block around OpenAI call

**Fallback**
- **Evidence:** RC371-RUNTIME-FLOWS.md
- **File:** preview-analyzer.ts
- **Line:** 86
- **Implementation:** `generateFallbackAnalysis()` on error

**Rollback**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No rollback mechanism

**Cleanup**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No cleanup observed

**Logging**
- **Evidence:** RC371-RUNTIME-FLOWS.md
- **File:** preview-analyzer.ts
- **Line:** 86
- **Implementation:** `logger.error('OpenAI error:', error)`

**Metrics**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No metrics observed

**Trace**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No trace observed

**Retour Utilisateur**
- **Evidence:** RC371-RUNTIME-FLOWS.md
- **File:** preview-analyzer.ts
- **Line:** 86-88
- **Implementation:** Returns fallback analysis instead of error

### Failure Path
```
OpenAI call initiated
  ↓
8 second timeout expires
  ↓
OpenAI SDK throws timeout error
  ↓
catch block catches error
  ↓
logger.error logs error
  ↓
generateFallbackAnalysis called
  ↓
Fallback analysis returned
  ↓
User receives fallback analysis (not error)
```

---

## FAILURE SCENARIO 2: REDIS UNAVAILABLE

### Flow Affected
- Landing → ATS Preview (Rate Limiting)
- File: `c:\Trajectoire\apps\web\src\app\api\public\analyze-preview\route.ts`
- Line: 15
- Function: `POST`

### Observable Behavior

**Rate Limit Implementation**
- **Evidence:** RC371-RUNTIME-FLOWS.md
- **File:** route.ts
- **Line:** 15
- **Implementation:** `checkRateLimit('preview:${fingerprint}', 3, 3600)`

**Catch**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No catch observed for rate limit failure

**Retry**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No retry observed

**Timeout**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No timeout observed

**Fallback**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No fallback observed

**Rollback**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No rollback observed

**Cleanup**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No cleanup observed

**Logging**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No logging observed for rate limit failure

**Metrics**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No metrics observed

**Trace**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No trace observed

**Retour Utilisateur**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** Unknown - rate limit failure behavior not observed

### Failure Path
```
checkRateLimit called
  ↓
Redis connection fails
  ↓
checkRateLimit throws error (NOT OBSERVED)
  ↓
No catch block observed
  ↓
Likely 500 error to user (NOT OBSERVED)
```

---

## FAILURE SCENARIO 3: SUPABASE UNAVAILABLE

### Flow Affected
- Signup
- File: `c:\Trajectoire\apps\web\src\app\signup\page.tsx`
- Line: 44-51
- Function: `handleSubmit`

### Observable Behavior

**Supabase Auth Call**
- **Evidence:** RC371-RUNTIME-FLOWS.md
- **File:** page.tsx
- **Line:** 44
- **Implementation:** `supabase.auth.signUp({ email, password, options })`

**Catch**
- **Evidence:** RC371-RUNTIME-FLOWS.md
- **File:** page.tsx
- **Line:** 52-54
- **Implementation:** Error handling with setError

**Retry**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No retry observed

**Timeout**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No timeout observed

**Fallback**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No fallback observed

**Rollback**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No rollback observed

**Cleanup**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No cleanup observed

**Logging**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No logging observed

**Metrics**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No metrics observed

**Trace**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No trace observed

**Retour Utilisateur**
- **Evidence:** RC371-RUNTIME-FLOWS.md
- **File:** page.tsx
- **Line:** 53
- **Implementation:** `setError(error.message)` - Error message displayed to user

### Failure Path
```
supabase.auth.signUp called
  ↓
Supabase unavailable
  ↓
Supabase SDK throws error
  ↓
Error caught at line 52
  ↓
setError called with error message
  ↓
User sees error message
  ↓
Function returns early
```

---

## FAILURE SCENARIO 4: STRIPE UNAVAILABLE

### Flow Affected
- Billing
- File: `c:\Trajectoire\apps\web\src\app\api\stripe\checkout\route.ts`
- Line: 156
- Function: `POST`

### Observable Behavior

**Stripe API Call**
- **Evidence:** RC371-RUNTIME-FLOWS.md
- **File:** route.ts
- **Line:** 156
- **Implementation:** `await getStripe().checkout.sessions.create(sessionParams)`

**Catch**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No catch observed for Stripe API call

**Retry**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No retry observed

**Timeout**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No timeout observed

**Fallback**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No fallback observed

**Rollback**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No rollback observed

**Cleanup**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No cleanup observed

**Logging**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No logging observed

**Metrics**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No metrics observed

**Trace**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No trace observed

**Retour Utilisateur**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** Unknown - Stripe failure behavior not observed

### Failure Path
```
stripe.checkout.sessions.create called
  ↓
Stripe unavailable
  ↓
Stripe SDK throws error (NOT OBSERVED)
  ↓
No catch block observed
  ↓
Likely 500 error to user (NOT OBSERVED)
```

---

## FAILURE SCENARIO 5: PRISMA TIMEOUT

### Flow Affected
- Dashboard
- File: `c:\Trajectoire\apps\web\src\app\dashboard\page.tsx`
- Line: 29, 40, 50, 55
- Function: `DashboardPage`

### Observable Behavior

**Prisma Queries**
- **Evidence:** RC371-RUNTIME-FLOWS.md
- **File:** page.tsx
- **Line:** 29, 40, 50, 55
- **Implementation:** `prisma.user.findUnique`, `prisma.cVAnalysis.findMany`, etc.

**Catch**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No catch observed for Prisma queries

**Retry**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No retry observed

**Timeout**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No timeout observed

**Fallback**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No fallback observed

**Rollback**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No rollback observed

**Cleanup**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No cleanup observed

**Logging**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No logging observed

**Metrics**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No metrics observed

**Trace**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No trace observed

**Retour Utilisateur**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** Unknown - Prisma timeout behavior not observed

### Failure Path
```
prisma.user.findUnique called
  ↓
Prisma timeout
  ↓
Prisma throws timeout error (NOT OBSERVED)
  ↓
No catch block observed
  ↓
Likely 500 error to user (NOT OBSERVED)
```

---

## FAILURE SCENARIO 6: DATABASE DEADLOCK

### Flow Affected
- Claim Preview
- File: `c:\Trajectoire\apps\web\src\lib\preview-analysis\PreviewAnalysisService.ts`
- Line: 83-104
- Function: `claimPreview`

### Observable Behavior

**Database Operations**
- **Evidence:** RC371-RUNTIME-FLOWS.md
- **File:** PreviewAnalysisService.ts
- **Line:** 83-104
- **Implementation:** Multiple Prisma operations (createCandidateProfile, createPermanentAnalysis, etc.)

**Catch**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No catch observed for Prisma operations

**Retry**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No retry observed

**Timeout**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No timeout observed

**Fallback**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No fallback observed

**Rollback**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No rollback observed

**Cleanup**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No cleanup observed

**Logging**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No logging observed

**Metrics**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No metrics observed

**Trace**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No trace observed

**Retour Utilisateur**
- **Evidence:** RC371-RUNTIME-FLOWS.md
- **File:** route.ts
- **Line:** 50-51
- **Implementation:** Sentry capture and error logging

### Failure Path
```
prisma.careerProfile.create called
  ↓
Database deadlock
  ↓
Prisma throws deadlock error (NOT OBSERVED)
  ↓
No catch in PreviewAnalysisService
  ↓
Error propagates to route handler
  ↓
Sentry captures error
  ↓
500 error to user (NOT OBSERVED)
```

---

## FAILURE SCENARIO 7: 429 (RATE LIMIT)

### Flow Affected
- Landing → ATS Preview
- File: `c:\Trajectoire\apps\web\src\app\api\public\analyze-preview\route.ts`
- Line: 15
- Function: `POST`

### Observable Behavior

**Rate Limit Check**
- **Evidence:** RC371-RUNTIME-FLOWS.md
- **File:** route.ts
- **Line:** 15
- **Implementation:** `checkRateLimit('preview:${fingerprint}', 3, 3600)`

**Catch**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No catch observed

**Retry**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No retry observed

**Timeout**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No timeout observed

**Fallback**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No fallback observed

**Rollback**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No rollback observed

**Cleanup**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No cleanup observed

**Logging**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No logging observed

**Metrics**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No metrics observed

**Trace**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No trace observed

**Retour Utilisateur**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** Unknown - rate limit exceeded behavior not observed

### Failure Path
```
checkRateLimit called
  ↓
Rate limit exceeded (429)
  ↓
checkRateLimit throws error (NOT OBSERVED)
  ↓
No catch block observed
  ↓
Likely 429 error to user (NOT OBSERVED)
```

---

## FAILURE SCENARIO 8: 500 (INTERNAL SERVER ERROR)

### Flow Affected
- All Flows
- Multiple Files

### Observable Behavior

**Error Handling**
- **Evidence:** RC371-RUNTIME-FLOWS.md
- **File:** route.ts (analyze-preview)
- **Line:** 106-116
- **Implementation:** Sentry capture and error logging

**Catch**
- **Evidence:** RC371-RUNTIME-FLOWS.md
- **File:** route.ts
- **Line:** 106
- **Implementation:** try/catch around entire route handler

**Retry**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No retry observed

**Timeout**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No timeout observed

**Fallback**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No fallback observed

**Rollback**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No rollback observed

**Cleanup**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No cleanup observed

**Logging**
- **Evidence:** RC371-RUNTIME-FLOWS.md
- **File:** route.ts
- **Line:** 111
- **Implementation:** `logError('analyze-preview error', error)`

**Metrics**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No metrics observed

**Trace**
- **Evidence:** RC371-RUNTIME-FLOWS.md
- **File:** route.ts
- **Line:** 112
- **Implementation:** Sentry.captureException(error)

**Retour Utilisateur**
- **Evidence:** RC371-RUNTIME-FLOWS.md
- **File:** route.ts
- **Line:** 113-116
- **Implementation:** Returns JSON with error message

### Failure Path
```
Route handler executes
  ↓
Internal error occurs
  ↓
Error caught at line 106
  ↓
logError logs error
  ↓
Sentry.captureException
  ↓
JSON response with error message
  ↓
User sees error message
```

---

## FAILURE SCENARIO 9: 502 (BAD GATEWAY)

### Flow Affected
- All API Routes
- Multiple Files

### Observable Behavior

**Error Handling**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No specific 502 handling observed

**Catch**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No specific catch for 502

**Retry**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No retry observed

**Timeout**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No timeout observed

**Fallback**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No fallback observed

**Rollback**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No rollback observed

**Cleanup**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No cleanup observed

**Logging**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No specific logging for 502

**Metrics**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No metrics observed

**Trace**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No trace observed

**Retour Utilisateur**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** Unknown - 502 behavior not observed

### Failure Path
```
API route called
  ↓
Upstream service unavailable (502)
  ↓
No specific handling observed
  ↓
Likely 502 propagated to user (NOT OBSERVED)
```

---

## FAILURE SCENARIO 10: 503 (SERVICE UNAVAILABLE)

### Flow Affected
- All API Routes
- Multiple Files

### Observable Behavior

**Error Handling**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No specific 503 handling observed

**Catch**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No specific catch for 503

**Retry**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No retry observed

**Timeout**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No timeout observed

**Fallback**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No fallback observed

**Rollback**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No rollback observed

**Cleanup**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No cleanup observed

**Logging**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No specific logging for 503

**Metrics**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No metrics observed

**Trace**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No trace observed

**Retour Utilisateur**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** Unknown - 503 behavior not observed

### Failure Path
```
API route called
  ↓
Service unavailable (503)
  ↓
No specific handling observed
  ↓
Likely 503 propagated to user (NOT OBSERVED)
```

---

## FAILURE SCENARIO 11: 504 (GATEWAY TIMEOUT)

### Flow Affected
- All API Routes
- Multiple Files

### Observable Behavior

**Error Handling**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No specific 504 handling observed

**Catch**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No specific catch for 504

**Retry**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No retry observed

**Timeout**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No timeout observed

**Fallback**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No fallback observed

**Rollback**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No rollback observed

**Cleanup**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No cleanup observed

**Logging**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No specific logging for 504

**Metrics**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No metrics observed

**Trace**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No trace observed

**Retour Utilisateur**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** Unknown - 504 behavior not observed

### Failure Path
```
API route called
  ↓
Gateway timeout (504)
  ↓
No specific handling observed
  ↓
Likely 504 propagated to user (NOT OBSERVED)
```

---

## FAILURE SCENARIO 12: MEMORY EXHAUSTION

### Flow Affected
- All Flows
- Multiple Files

### Observable Behavior

**Error Handling**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No specific memory exhaustion handling observed

**Catch**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No specific catch for memory exhaustion

**Retry**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No retry observed

**Timeout**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No timeout observed

**Fallback**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No fallback observed

**Rollback**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No rollback observed

**Cleanup**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No cleanup observed

**Logging**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No specific logging for memory exhaustion

**Metrics**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No metrics observed

**Trace**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No trace observed

**Retour Utilisateur**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** Unknown - memory exhaustion behavior not observed

### Failure Path
```
Function executes
  ↓
Memory exhausted
  ↓
Node.js throws out of memory error (NOT OBSERVED)
  ↓
No specific handling observed
  ↓
Process crashes (NOT OBSERVED)
```

---

## FAILURE SCENARIO 13: CPU SATURATION

### Flow Affected
- All Flows
- Multiple Files

### Observable Behavior

**Error Handling**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No specific CPU saturation handling observed

**Catch**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No specific catch for CPU saturation

**Retry**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No retry observed

**Timeout**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No timeout observed

**Fallback**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No fallback observed

**Rollback**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No rollback observed

**Cleanup**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No cleanup observed

Logging
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No specific logging for CPU saturation

**Metrics**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No metrics observed

**Trace**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No trace observed

**Retour Utilisateur**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** Unknown - CPU saturation behavior not observed

### Failure Path
```
Function executes
  ↓
CPU saturated
  ↓
Request timeout (NOT OBSERVED)
  ↓
No specific handling observed
  ↓
Likely timeout error to user (NOT OBSERVED)
```

---

## FAILURE SCENARIO 14: DISK FULL

### Flow Affected
- CV Upload
- File: `c:\Trajectoire\apps\web\src\app\api\cv\upload\route.ts`
- Line: 26-136
- **Function:** `POST`

### Observable Behavior

**File Upload**
- **Evidence:** RC371-RUNTIME-FLOWS.md
- **File:** route.ts
- **Line:** 26-136
- **Implementation:** File upload and text extraction

**Catch**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No specific catch for disk full

**Retry**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No retry observed

**Timeout**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No timeout observed

**Fallback**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No fallback observed

**Rollback**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No rollback observed

**Cleanup**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No cleanup observed

**Logging**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No specific logging for disk full

**Metrics**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No metrics observed

**Trace**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No trace observed

**Retour Utilisateur**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** Unknown - disk full behavior not observed

### Failure Path
```
File upload initiated
  ↓
Disk full
  ↓
File write fails (NOT OBSERVED)
  ↓
No specific handling observed
  ↓
Likely 500 error to user (NOT OBSERVED)
```

---

## FAILURE SCENARIO 15: EXPIRED JWT

### Flow Affected
- Dashboard
- File: `c:\Trajectoire\apps\web\src\app\dashboard\page.tsx`
- Line: 22
- Function: `DashboardPage`

### Observable Behavior

**Auth Check**
- **Evidence:** RC371-RUNTIME-FLOWS.md
- **File:** page.tsx
- **Line:** 22
- **Implementation:** `supabase.auth.getUser()`

**Catch**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No specific catch for expired JWT

**Retry**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No retry observed

**Timeout**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No timeout observed

**Fallback**
- **Evidence:** RC371-RUNTIME-FLOWS.md
- **File:** page.tsx
- **Line:** 24-26
- **Implementation:** `redirect('/login')` if not authenticated

**Rollback**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No rollback observed

**Cleanup**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No cleanup observed

**Logging**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No logging observed

**Metrics**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No metrics observed

**Trace**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No trace observed

**Retour Utilisateur**
- **Evidence:** RC371-RUNTIME-FLOWS.md
- **File:** page.tsx
- **Line:** 24
- **Implementation:** Redirect to login page

### Failure Path
```
supabase.auth.getUser called
  ↓
JWT expired
  ↓
Supabase returns null user
  ↓
Check if (!user) at line 24
  ↓
redirect('/login')
  ↓
User redirected to login page
```

---

## FAILURE SCENARIO 16: CORRUPTED GRAPH

### Flow Affected
- Matching
- File: `c:\Trajectoire\apps\api\src\matching\matching.controller.ts`
- Line: 48
- Function: `calculateScore`

### Observable Behavior

**Graph Matching**
- **Evidence:** RC371-RUNTIME-FLOWS.md
- **File:** matching.controller.ts
- **Line:** 48
- **Implementation:** `graphMatchingService.match(candidateGraph, jobGraph)`

**Catch**
- **Evidence:** RC371-RUNTIME-FLOWS.md
- **File:** matching.controller.ts
- **Line:** 49-52
- **Implementation:** try/catch with BadRequestException

**Retry**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No retry observed

**Timeout**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No timeout observed

**Fallback**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No fallback observed

**Rollback**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No rollback observed

**Cleanup**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No cleanup observed

**Logging**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No logging observed

**Metrics**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No metrics observed

**Trace**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No trace observed

**Retour Utilisateur**
- **Evidence:** RC371-RUNTIME-FLOWS.md
- **File:** matching.controller.ts
- **Line:** 51
- **Implementation:** BadRequestException with error message

### Failure Path
```
graphMatchingService.match called
  ↓
Graph corrupted
  ↓
GraphMatchingService throws error
  ↓
catch block catches error
  ↓
BadRequestException thrown
  ↓
User sees 400 error with message
```

---

## FAILURE SCENARIO 17: MISSING NODE

### Flow Affected
- Search
- File: `c:\Trajectoire\apps\api\src\search\search.controller.ts`
- Line: 20
- Function: `searchCandidates`

### Observable Behavior

**Graph Search**
- **Evidence:** RC371-RUNTIME-FLOWS.md
- **File:** search.controller.ts
- **Line:** 20
- **Implementation:** `graphSearchService.searchCandidatesByNeighborhood`

**Catch**
- **Evidence:** RC371-RUNTIME-FLOWS.md
- **File:** search.controller.ts
- **Line:** 35-37
- **Implementation:** try/catch with BadRequestException

**Retry**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No retry observed

**Timeout**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No timeout observed

**Fallback**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No fallback observed

**Rollback**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No rollback observed

**Cleanup**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No cleanup observed

**Logging**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No logging observed

**Metrics**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No metrics observed

**Trace**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No trace observed

**Retour Utilisateur**
- **Evidence:** RC371-RUNTIME-FLOWS.md
- **File:** search.controller.ts
- **Line:** 36
- **Implementation:** BadRequestException with error message

### Failure Path
```
graphSearchService.searchCandidatesByNeighborhood called
  ↓
Node missing
  ↓
GraphSearchService throws error
  ↓
catch block catches error
  ↓
BadRequestException thrown
  ↓
User sees 400 error with message
```

---

## FAILURE SCENARIO 18: MISSING EDGE

### Flow Affected
- Copilot
- File: `c:\Trajectoire\apps\api\src\copilot\copilot.service.ts`
- Line: 37
- Function: `processMessage`

### Observable Behavior

**Graph Reasoning**
- **Evidence:** RC371-RUNTIME-FLOWS.md
- **File:** copilot.service.ts
- **Line:** 37
- **Implementation:** `graphReasoningEngine.answerCandidateQuestion`

**Catch**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No catch observed

**Retry**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No retry observed

**Timeout**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No timeout observed

**Fallback**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No fallback observed

**Rollback**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No rollback observed

**Cleanup**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No cleanup observed

**Logging**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No logging observed

**Metrics**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No metrics observed

**Trace**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No trace observed

**Retour Utilisateur**
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** Unknown - missing edge behavior not observed

### Failure Path
```
graphReasoningEngine.answerCandidateQuestion called
  ↓
Edge missing
  ↓
GraphReasoningEngine throws error (NOT OBSERVED)
  ↓
No catch block observed
  ↓
Likely 500 error to user (NOT OBSERVED)
```

---

## SUMMARY

### Total Failure Scenarios: 18

### By Category

| Category | Count | Scenarios |
|----------|-------|-----------|
| External API Failures | 4 | OpenAI timeout, Redis unavailable, Supabase unavailable, Stripe unavailable |
| Database Failures | 2 | Prisma timeout, Database deadlock |
| HTTP Errors | 4 | 429, 500, 502, 503, 504 |
| Resource Exhaustion | 3 | Memory exhaustion, CPU saturation, Disk full |
| Auth Failures | 1 | Expired JWT |
| Graph Failures | 3 | Corrupted Graph, Missing Node, Missing Edge |

### Observable Mechanisms

| Mechanism | Observed | Count | Scenarios |
|-----------|----------|-------|-----------|
| Catch | YES | 8 | OpenAI timeout, Supabase unavailable, 500, Corrupted Graph, Missing Node, etc. |
| Retry | NO | 0 | None |
| Timeout | YES | 1 | OpenAI timeout (8s) |
| Fallback | YES | 2 | OpenAI timeout (fallback analysis), Expired JWT (redirect) |
| Rollback | NO | 0 | None |
| Cleanup | NO | 0 | None |
| Logging | YES | 3 | OpenAI timeout, 500, Supabase unavailable |
| Metrics | NO | 0 | None |
| Trace | YES | 1 | 500 (Sentry) |

### Critical Gaps

1. **No Retry Mechanism:** No retry observed for any failure scenario
2. **No Rollback Mechanism:** No rollback observed for any failure scenario
3. **No Cleanup Mechanism:** No cleanup observed for any failure scenario
4. **No Metrics:** No metrics observed for any failure scenario
5. **Limited Logging:** Only 3 scenarios have logging
6. **Limited Fallback:** Only 2 scenarios have fallback
7. **No Specific HTTP Error Handling:** No specific handling for 502, 503, 504
8. **No Resource Exhaustion Handling:** No handling for memory, CPU, disk failures

### Evidence Completeness

- **Total Scenarios Analyzed:** 18
- **Fully Observed:** 5 (28%)
- **Partially Observed:** 13 (72%)
- **Not Observed:** 0 (0%)

**Evidence Source:** RC37.1 and RC37.2 reports
