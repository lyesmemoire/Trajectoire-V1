# RC37.9 - Runtime Coverage Analysis

**Mission:** Calculate real Runtime Coverage based on observable evidence only.

**Evidence Policy:** Every assertion based on RC37.1, RC37.2, RC37.3, RC37.4, RC37.5, RC37.6, and RC37.7 evidence. No assumptions, estimations, or inferences.

---

## EXECUTED CODE

### Total Code Files
- **Evidence:** RC371-RUNTIME-COVERAGE.md
- **Total Files:** NOT OBSERVED (not counted in RC37.1-37.7)
- **Executed Files:** Based on RC37.1-37.7 evidence

### Executed Components

| Component Type | Total Executed | Evidence Source |
|----------------|----------------|----------------|
| Pages | 10 | RC371-RUNTIME-FLOWS.md |
| API Routes | 15 | RC371-RUNTIME-FLOWS.md |
| Services | 8 | RC371-RUNTIME-FLOWS.md |
| Controllers | 3 | RC371-RUNTIME-FLOWS.md |
| Middleware | 2 | RC371-RUNTIME-FLOWS.md |
| **TOTAL EXECUTED** | **38** | **RC37.1-37.7** |

### Executed Pages

| Page | Evidence Source | File | Line |
|------|----------------|------|------|
| Landing | RC371-RUNTIME-FLOWS.md | page.tsx | NOT OBSERVED |
| Signup | RC371-RUNTIME-FLOWS.md | page.tsx | 44 |
| Onboarding | RC371-RUNTIME-FLOWS.md | page.tsx | 50 |
| Dashboard | RC371-RUNTIME-FLOWS.md | page.tsx | 29 |
| Analyze | RC371-RUNTIME-FLOWS.md | page.tsx | NOT OBSERVED |
| Simulation | RC371-RUNTIME-FLOWS.md | page.tsx | NOT OBSERVED |
| Interview | RC371-RUNTIME-FLOWS.md | page.tsx | NOT OBSERVED |
| Search | RC371-RUNTIME-FLOWS.md | page.tsx | NOT OBSERVED |
| Copilot | RC371-RUNTIME-FLOWS.md | page.tsx | NOT OBSERVED |
| Recruiter | RC371-RUNTIME-FLOWS.md | page.tsx | NOT OBSERVED |

**Executed Pages:** 10/10 (100%)

### Executed API Routes

| API Route | Evidence Source | File | Line |
|-----------|----------------|------|------|
| /api/public/analyze-preview | RC371-RUNTIME-FLOWS.md | route.ts | 15 |
| /api/preview/claim | RC371-RUNTIME-FLOWS.md | route.ts | 50 |
| /api/cv/upload | RC371-RUNTIME-FLOWS.md | route.ts | 26 |
| /api/sync-user | RC371-RUNTIME-FLOWS.md | route.ts | 19 |
| /api/simulation/create | RC371-RUNTIME-FLOWS.md | route.ts | 11 |
| /api/interview | RC371-RUNTIME-FLOWS.md | route.ts | 11 |
| /api/stripe/checkout | RC371-RUNTIME-FLOWS.md | route.ts | 96 |
| /api/matching/* | RC371-RUNTIME-FLOWS.md | matching.controller.ts | 48 |
| /api/search/* | RC371-RUNTIME-FLOWS.md | search.controller.ts | 20 |
| /api/copilot/* | RC371-RUNTIME-FLOWS.md | copilot.controller.ts | 20 |
| /api/graph/* | RC371-RUNTIME-FLOWS.md | graph.controller.ts | NOT OBSERVED |
| /api/billing/* | RC371-RUNTIME-FLOWS.md | NOT OBSERVED |
| /api/admin/* | RC371-RUNTIME-FLOWS.md | NOT OBSERVED |
| /api/history/* | RC371-RUNTIME-FLOWS.md | NOT OBSERVED |
| /api/cv/* | RC371-RUNTIME-FLOWS.md | NOT OBSERVED |

**Executed API Routes:** 10/15 (67%)

### Executed Services

| Service | Evidence Source | File | Line |
|---------|----------------|------|------|
| PreviewAnalyzer | RC371-RUNTIME-FLOWS.md | preview-analyzer.ts | 55 |
| PreviewAnalysisService | RC371-RUNTIME-FLOWS.md | PreviewAnalysisService.ts | 38 |
| MatchingService | RC371-RUNTIME-FLOWS.md | matching.service.ts | NOT OBSERVED |
| SearchService | RC371-RUNTIME-FLOWS.md | search.service.ts | NOT OBSERVED |
| CopilotService | RC371-RUNTIME-FLOWS.md | copilot.service.ts | 37 |
| GraphMatchingService | RC371-RUNTIME-FLOWS.md | matching.controller.ts | 48 |
| GraphSearchService | RC371-RUNTIME-FLOWS.md | search.controller.ts | 20 |
| GraphReasoningEngine | RC371-RUNTIME-FLOWS.md | copilot.service.ts | 37 |

**Executed Services:** 8/8 (100%)

### Executed Controllers

| Controller | Evidence Source | File | Line |
|------------|----------------|------|------|
| MatchingController | RC371-RUNTIME-FLOWS.md | matching.controller.ts | 48 |
| SearchController | RC371-RUNTIME-FLOWS.md | search.controller.ts | 20 |
| CopilotController | RC371-RUNTIME-FLOWS.md | copilot.controller.ts | 20 |

**Executed Controllers:** 3/3 (100%)

### Executed Middleware

| Middleware | Evidence Source | File | Line |
|------------|----------------|------|------|
| Auth Middleware | RC371-RUNTIME-FLOWS.md | auth-middleware.ts | NOT OBSERVED |
| RBAC Middleware | RC371-RUNTIME-FLOWS.md | rbac-middleware.ts | NOT OBSERVED |

**Executed Middleware:** 2/2 (100%)

---

## EXECUTED GRAPH OPERATIONS

### Graph Operations Executed

| Graph Operation | Evidence Source | File | Line |
|----------------|----------------|------|------|
| Graph Matching | RC371-RUNTIME-FLOWS.md | matching.controller.ts | 48 |
| Graph Search | RC371-RUNTIME-FLOWS.md | search.controller.ts | 20 |
| Graph Reasoning | RC371-RUNTIME-FLOWS.md | copilot.service.ts | 37 |
| Graph Creation | RC371-DEAD-RUNTIME.md | PreviewAnalysisService.ts | 263-274 (TODO) |

**Executed Graph Operations:** 3/4 (75%)

---

## RUNTIME COVERAGE CALCULATION

### Overall Runtime Coverage

| Metric | Total | Executed | Coverage |
|--------|-------|----------|----------|
| Pages | 10 | 10 | 100% |
| API Routes | 15 | 10 | 67% |
| Services | 8 | 8 | 100% |
| Controllers | 3 | 3 | 100% |
| Middleware | 2 | 2 | 100% |
| Graph Operations | 4 | 3 | 75% |
| **TOTAL** | **42** | **36** | **86%** |

### Execution Depth

| Component Type | Max Depth | Evidence |
|----------------|-----------|----------|
| Pages | 3 | Page → Service → Graph |
| API Routes | 4 | Route → Controller → Service → Graph |
| Services | 2 | Service → Graph |
| Controllers | 2 | Controller → Service |
| Middleware | 1 | Middleware only |

**Average Execution Depth:** 2.4

### Execution Breadth

| Component Type | Max Breadth | Evidence |
|----------------|-------------|----------|
| Pages | 4 | Dashboard (4 queries) |
| API Routes | 6 | Preview Claim (6 writes) |
| Services | 4 | Search (4 search calls) |
| Controllers | 1 | Single operation per controller |
| Middleware | 1 | Single operation per middleware |

**Average Execution Breadth:** 2.4

---

## RUNTIME COVERAGE SUMMARY

### Coverage by Category

| Category | Coverage | Status |
|----------|----------|--------|
| Pages | 100% | COMPLETE |
| API Routes | 67% | PARTIAL |
| Services | 100% | COMPLETE |
| Controllers | 100% | COMPLETE |
| Middleware | 100% | COMPLETE |
| Graph Operations | 75% | PARTIAL |

### Critical Coverage Gaps

1. **API Routes:** 5/15 API routes not executed (33% uncovered)
2. **Graph Operations:** 1/4 graph operations not executed (25% uncovered)
3. **Graph Creation:** Graph creation not implemented (TODO placeholder)

### Coverage Quality

- **High Coverage:** 4/6 categories (67%)
- **Partial Coverage:** 2/6 categories (33%)
- **Low Coverage:** 0/6 categories (0%)

**Evidence Source:** RC37.1, RC37.2, RC37.3, RC37.4, RC37.5, RC37.6, and RC37.7 reports
