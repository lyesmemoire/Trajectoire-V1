# RC37.7 - Hot Paths Analysis

**Mission:** Analyze hot paths based on observable evidence only.

**Evidence Policy:** Every assertion based on RC37.1, RC37.2, RC37.3, RC37.4, RC37.5, and RC37.6 evidence. No assumptions, estimations, or inferences.

---

## HOT PATH 1: LANDING → ATS PREVIEW

### Path
- **Evidence:** RC371-RUNTIME-FLOWS.md
- **Flow:** Landing → Upload CV → ATS Preview
- **Frequency:** High (user entry point)

### Operations
- **Evidence:** RC371-RUNTIME-FLOWS.md
- **File:** preview-analyzer.ts
- **Line:** 55
- **Operation:** OpenAI API call
- **Cost:** High (LLM API)
- **Latency:** High (8s timeout)

### Optimization
- **Evidence:** RC371-RUNTIME-FLOWS.md
- **File:** preview-analyzer.ts
- **Line:** 58, 86
- **Implementation:** Timeout (8s), fallback to generateFallbackAnalysis

### Hot Path Summary
- **Frequency:** High
- **Cost:** High
- **Latency:** High
- **Optimization:** YES (timeout, fallback)

---

## HOT PATH 2: DASHBOARD LOAD

### Path
- **Evidence:** RC371-RUNTIME-FLOWS.md
- **Flow:** Dashboard page load
- **Frequency:** High (user dashboard access)

### Operations
- **Evidence:** RC371-RUNTIME-FLOWS.md
- **File:** page.tsx (dashboard)
- **Line:** 29, 40, 50, 55
- **Operation:** 4 sequential Prisma queries
- **Cost:** Medium (database queries)
- **Latency:** Medium (4 queries)

### Optimization
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No optimization observed

### Hot Path Summary
- **Frequency:** High
- **Cost:** Medium
- **Latency:** Medium
- **Optimization:** NOT OBSERVED

---

## HOT PATH 3: ONBOARDING

### Path
- **Evidence:** RC371-RUNTIME-FLOWS.md
- **Flow:** Onboarding page load
- **Frequency:** High (new user onboarding)

### Operations
- **Evidence:** RC371-RUNTIME-FLOWS.md
- **File:** page.tsx (onboarding)
- **Line:** 50, 56
- **Operation:** OnboardingResolver called twice
- **Cost:** Medium (duplicate resolver call)
- **Latency:** Medium (duplicate call)

### Optimization
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No optimization observed

### Hot Path Summary
- **Frequency:** High
- **Cost:** Medium
- **Latency:** Medium
- **Optimization:** NOT OBSERVED

---

## HOT PATH 4: MATCHING

### Path
- **Evidence:** RC371-RUNTIME-FLOWS.md
- **Flow:** Recruiter matching
- **Frequency:** Medium (recruiter operations)

### Operations
- **Evidence:** RC371-RUNTIME-FLOWS.md
- **File:** matching.controller.ts
- **Line:** 48
- **Operation:** Graph matching service
- **Cost:** High (graph operations)
- **Latency:** High (graph matching)

### Optimization
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No optimization observed

### Hot Path Summary
- **Frequency:** Medium
- **Cost:** High
- **Latency:** High
- **Optimization:** NOT OBSERVED

---

## HOT PATH 5: SEARCH

### Path
- **Evidence:** RC371-RUNTIME-FLOWS.md
- **Flow:** Search operations
- **Frequency:** Medium (search operations)

### Operations
- **Evidence:** RC371-RUNTIME-FLOWS.md
- **File:** search.controller.ts
- **Line:** 20
- **Operation:** Graph search service
- **Cost:** High (graph operations)
- **Latency:** High (graph search)

### Optimization
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No optimization observed

### Hot Path Summary
- **Frequency:** Medium
- **Cost:** High
- **Latency:** High
- **Optimization:** NOT OBSERVED

---

## HOT PATH 6: COPILOT

### Path
- **Evidence:** RC371-RUNTIME-FLOWS.md
- **Flow:** Copilot reasoning
- **Frequency:** Medium (copilot usage)

### Operations
- **Evidence:** RC371-RUNTIME-FLOWS.md
- **File:** copilot.service.ts
- **Line:** 37
- **Operation:** Graph reasoning engine
- **Cost:** High (graph reasoning)
- **Latency:** High (reasoning)

### Optimization
- **Evidence:** RC371-RUNTIME-FLOWS.md
- **File:** copilot.service.ts
- **Line:** 27, 84
- **Implementation:** Cache service (get/set)

### Hot Path Summary
- **Frequency:** Medium
- **Cost:** High
- **Latency:** High
- **Optimization:** YES (cache service)

---

## HOT PATH 7: CV UPLOAD

### Path
- **Evidence:** RC371-RUNTIME-FLOWS.md
- **Flow:** CV upload
- **Frequency:** Medium (CV uploads)

### Operations
- **Evidence:** RC371-RUNTIME-FLOWS.md
- **File:** cv/upload/route.ts
- **Line:** 26-136
- **Operation:** File upload and text extraction
- **Cost:** High (file processing)
- **Latency:** High (file upload + extraction)

### Optimization
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No optimization observed

### Hot Path Summary
- **Frequency:** Medium
- **Cost:** High
- **Latency:** High
- **Optimization:** NOT OBSERVED

---

## HOT PATH 8: INTERVIEW SESSION

### Path
- **Evidence:** RC371-RUNTIME-FLOWS.md
- **Flow:** Interview session
- **Frequency:** Low (interview sessions)

### Operations
- **Evidence:** RC371-RUNTIME-FLOWS.md
- **File:** interview/route.ts
- **Line:** 11-343
- **Operation:** Interview session state in memory
- **Cost:** Medium (session state)
- **Latency:** Medium (session operations)

### Optimization
- **Evidence:** RC371-RUNTIME-FLOWS.md
- **File:** interview/route.ts
- **Line:** 12
- **Implementation:** Comment: "stored in memory (to be replaced by Redis/DB)"

### Hot Path Summary
- **Frequency:** Low
- **Cost:** Medium
- **Latency:** Medium
- **Optimization:** NOT OBSERVED (in-memory only)

---

## HOT PATH 9: STRIPE CHECKOUT

### Path
- **Evidence:** RC371-RUNTIME-FLOWS.md
- **Flow:** Stripe checkout
- **Frequency:** Low (billing operations)

### Operations
- **Evidence:** RC371-RUNTIME-FLOWS.md
- **File:** stripe/checkout/route.ts
- **Line:** 156
- **Operation:** Stripe checkout session creation
- **Cost:** High (Stripe API)
- **Latency:** High (external API)

### Optimization
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No optimization observed

### Hot Path Summary
- **Frequency:** Low
- **Cost:** High
- **Latency:** High
- **Optimization:** NOT OBSERVED

---

## HOT PATH 10: PREVIEW CLAIM

### Path
- **Evidence:** RC371-RUNTIME-FLOWS.md
- **Flow:** Preview claim
- **Frequency:** Medium (user claims preview)

### Operations
- **Evidence:** RC375-DATABASE.md
- **File:** PreviewAnalysisService.ts
- **Line:** 83-104
- **Operation:** 6 sequential Prisma writes
- **Cost:** High (multiple writes)
- **Latency:** High (6 writes without transaction)

### Optimization
- **Evidence:** NOT OBSERVED
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Implementation:** No optimization observed

### Hot Path Summary
- **Frequency:** Medium
- **Cost:** High
- **Latency:** High
- **Optimization:** NOT OBSERVED

---

## SUMMARY

### Total Hot Paths: 10

### Hot Path Frequency Distribution

| Frequency | Count | Percentage |
|-----------|-------|------------|
| High Frequency | 3 | 30% |
| Medium Frequency | 5 | 50% |
| Low Frequency | 2 | 20% |

### Hot Path Cost Distribution

| Cost | Count | Percentage |
|------|-------|------------|
| High Cost | 6 | 60% |
| Medium Cost | 4 | 40% |
| Low Cost | 0 | 0% |

### Hot Path Latency Distribution

| Latency | Count | Percentage |
|---------|-------|------------|
| High Latency | 6 | 60% |
| Medium Latency | 4 | 40% |
| Low Latency | 0 | 0% |

### Hot Path Optimization Coverage

| Metric | Count | Percentage |
|--------|-------|------------|
| Hot Paths with Optimization | 2 | 20% |
| Hot Paths without Optimization | 8 | 80% |
| **TOTAL OPTIMIZATION COVERAGE** | **2** | **20%** |

### Critical Hot Paths

| Priority | Path | Frequency | Cost | Latency | Optimization |
|----------|------|-----------|------|---------|--------------|
| P0 | Landing → ATS Preview | High | High | High | YES |
| P0 | Dashboard Load | High | Medium | Medium | NO |
| P1 | Onboarding | High | Medium | Medium | NO |
| P1 | Preview Claim | Medium | High | High | NO |
| P2 | Matching | Medium | High | High | NO |
| P2 | Search | Medium | High | High | NO |
| P2 | Copilot | Medium | High | High | YES |
| P3 | CV Upload | Medium | High | High | NO |
| P3 | Stripe Checkout | Low | High | High | NO |
| P3 | Interview Session | Low | Medium | Medium | NO |

### Critical Gaps

1. **No Dashboard Optimization:** High frequency path with no optimization
2. **No Onboarding Optimization:** High frequency path with duplicate call
3. **No Preview Claim Optimization:** Medium frequency path with 6 writes without transaction
4. **No Matching Optimization:** High cost path with no optimization
5. **No Search Optimization:** High cost path with no optimization
6. **No CV Upload Optimization:** High cost path with no streaming
7. **No Stripe Optimization:** High cost path with no optimization
8. **No Interview Session Optimization:** In-memory state not persisted

### Observable Hot Path Patterns

- **High Frequency + High Cost:** 1/10 paths (10%)
- **High Frequency + Medium Cost:** 2/10 paths (20%)
- **Medium Frequency + High Cost:** 4/10 paths (40%)
- **No Optimization:** 8/10 paths (80%)
- **With Optimization:** 2/10 paths (20%)

### Hot Path Risks

| Risk Level | Count | Paths |
|------------|-------|-------|
| High Risk | 5 | Landing → ATS Preview, Dashboard Load, Preview Claim, Matching, Search |
| Medium Risk | 3 | Onboarding, Copilot, CV Upload |
| Low Risk | 2 | Stripe Checkout, Interview Session |

### Evidence Completeness

- **Total Hot Paths Analyzed:** 10
- **With Optimization:** 2 (20%)
- **Without Optimization:** 8 (80%)
- **Fully Observed:** 10 (100%)
- **Partially Observed:** 0 (0%)
- **Not Observed:** 0 (0%)

**Evidence Source:** RC37.1, RC37.2, RC37.3, RC37.4, RC37.5, and RC37.6 reports
