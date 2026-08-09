# RC35-RUNTIME-GRAPH.md
## Complete Runtime Execution Graph

Generated: 2025-01-08
Repository: Trajectoire-V1
Mission: RC-003.5 Runtime Certification
Status: COMPLETED

---

# EXECUTION FLOW: LANDING → DASHBOARD → RECRUITER → BILLING → HISTORY → ANALYTICS

## FLOW 1: LANDING → UPLOAD CV

```
User (Frontend)
  ↓ HTTP POST /cv/upload
CvController.uploadCv() [apps/api/src/cv/cv.controller.ts:13]
  ↓ Line 19
CvService.processCv(file) [apps/api/src/cv/cv.service.ts:15]
  ↓ Line 17
CvService.extractText(file) [apps/api/src/cv/cv.service.ts:58]
  ↓ Line 61-63 (file check)
  ↓ Line 65 (fs.readFileSync)
  ↓ Line 69-71 (pdf-parse) OR Line 76-77 (mammoth)
  ↓ Returns: string (extracted text)
  ↓ Line 20
CvService.extractKnowledge(text) [apps/api/src/cv/cv.service.ts:86]
  ↓ Line 88 (extractPersonalInfo)
  ↓ Line 91 (extractExperiences)
  ↓ Line 94 (extractEducation)
  ↓ Line 97 (extractSkills)
  ↓ Line 100 (extractCertifications)
  ↓ Line 103 (extractLanguages)
  ↓ Returns: knowledge object
  ↓ Line 23
CvService.normalizeKnowledge(knowledge) [apps/api/src/cv/cv.service.ts:231]
  ↓ Line 232
NormalizationService.normalizeKnowledge(knowledge) [apps/api/src/cv/normalization.service.ts:229]
  ↓ Line 123-175 (normalizeJob - KP-001)
  ↓ Line 177-227 (normalizeSkill - KP-002)
  ↓ Returns: normalizedKnowledge
  ↓ Line 37
RuntimeGraphService.importCV(graphInput, options) [apps/api/src/runtime/kg/runtime-graph.service.ts:113]
  ↓ Line 309-414 (buildNodesFromCV)
  ↓ Line 419-661 (buildEdgesFromCV)
  ↓ Line 126-128 (NodeFusionService.fuseNodes)
  ↓ Line 134-136 (GraphValidatorService.validate)
  ↓ Line 75-92 (GraphRepository.createGraph)
  ↓ Line 216-233 (GraphRepository.createNodes)
  ↓ Line 294-311 (GraphRepository.createEdges)
  ↓ Line 372-407 (GraphRepository.createVersion)
  ↓ Returns: pipelineResult
  ↓ Line 44
CvService.generateProfile(graph) [apps/api/src/cv/cv.service.ts:235]
  ↓ Line 236-267 (profile generation)
  ↓ Returns: profile
  ↓ Line 46-55
Returns: { originalFile, text, knowledge, normalizedKnowledge, graph, profile, validation, stats }
  ↓ Line 20-23
CvController returns success response
  ↓
Frontend receives CV processing result
```

**Evidence:**
- File: `apps/api/src/cv/cv.controller.ts` Line 13-27
- File: `apps/api/src/cv/cv.service.ts` Line 15-56
- File: `apps/api/src/cv/normalization.service.ts` Line 229-258
- File: `apps/api/src/runtime/kg/runtime-graph.service.ts` Line 113-206
- File: `apps/api/src/runtime/kg/graph-repository.service.ts` Line 75-407

---

## FLOW 2: LANDING → CV ANALYZE (WEB API)

```
User (Frontend)
  ↓ HTTP POST /api/cv/analyze
POST handler [apps/web/src/app/api/cv/analyze/route.ts:89]
  ↓ Line 94
Supabase auth.getUser() [apps/web/src/app/api/cv/analyze/route.ts:95]
  ↓ Line 97-102 (auth check)
  ↓ Line 108 (request.json())
  ↓ Line 116-123 (input validation)
  ↓ Line 125-134 (billing check)
  ↓ Line 136-137 (idempotency setup)
  ↓ Line 140-346
IdempotencyService.execute() [apps/web/src/app/api/cv/analyze/route.ts:140]
  ↓ Line 150-161
BillingService.reserveCredits() [apps/web/src/lib/db/billing.service.ts:72]
  ↓ Line 78-90 (idempotency check)
  ↓ Line 92-97 (Supabase RPC: reserve_credits_atomic)
  ↓ Returns: txId
  ↓ Line 167-185
Mistral AI API call [apps/web/src/app/api/cv/analyze/route.ts:167]
  ↓ Line 168 (new Mistral)
  ↓ Line 171-187 (AbortController with 30s timeout)
  ↓ Line 174-185 (mistral.chat.complete)
  ↓ Line 189 (rawContent extraction)
  ↓ Line 195 (JSON.parse)
  ↓ Line 196 (CvAnalysisSchema.parse)
  ↓ Returns: structured CV analysis
  ↓ Line 231-278
Prisma transaction [apps/web/src/app/api/cv/analyze/route.ts:231]
  ↓ Line 232-241 (prisma.cVAnalysis.create)
  ↓ Line 243-266 (careerDNA merge logic)
  ↓ Line 268-277 (prisma.careerProfile.upsert)
  ↓ Line 289-323
CVHIIOSBridge.initializeFromCV() [apps/web/src/app/api/cv/analyze/route.ts:289]
  ↓ Returns: hiiOSContext
  ↓ Line 326-328
BillingService.commitCredits(txId, 0) [apps/web/src/lib/db/billing.service.ts:122]
  ↓ Line 125-128 (Supabase RPC: commit_credits_atomic)
  ↓ Returns: success
  ↓ Line 330-333
Returns: { resultRef, data: { structured, hiiosContext } }
  ↓ Line 348-352
POST handler returns NextResponse.json()
  ↓
Frontend receives CV analysis result
```

**Evidence:**
- File: `apps/web/src/app/api/cv/analyze/route.ts` Line 89-383
- File: `apps/web/src/lib/db/billing.service.ts` Line 72-135
- File: `apps/web/src/lib/authorization/AuthorizationV2.ts` Line 163-224 (used in middleware)

---

## FLOW 3: DASHBOARD → MATCHING

```
User (Frontend)
  ↓ HTTP POST /matching/score
MatchingController.calculateScore() [apps/api/src/matching/matching.controller.ts:44]
  ↓ Line 46
GraphMatchingService.match(candidateGraph, jobGraph) [apps/api/src/runtime/kg/graph-matching.service.ts:74]
  ↓ Line 77 (cache key generation)
  ↓ Line 80 (CacheService.get)
  ↓ Line 86-87 (findNodeByType)
  ↓ Line 97 (calculateRelationBasedScore)
  ↓ Line 154 (calculateSkillRelationScore)
  ↓ Line 157 (calculateExperienceRelationScore)
  ↓ Line 160 (calculateEducationRelationScore)
  ↓ Line 163 (calculateLocationRelationScore)
  ↓ Line 166 (calculateTransferabilityScore)
  ↓ Line 100 (findTransferableSkills)
  ↓ Line 103 (analyzeNeighborhood)
  ↓ Line 106 (calculateDistance)
  ↓ Line 109 (calculateCentralityAlignment)
  ↓ Line 112 (analyzeSkillMatch)
  ↓ Line 115-123 (generateInsights)
  ↓ Line 141 (CacheService.set with 30min TTL)
  ↓ Returns: MatchingResult
  ↓ Line 48-57
MatchingController returns score
  ↓
Frontend receives matching score
```

**Evidence:**
- File: `apps/api/src/matching/matching.controller.ts` Line 44-61
- File: `apps/api/src/runtime/kg/graph-matching.service.ts` Line 74-144

---

## FLOW 4: DASHBOARD → SEARCH

```
User (Frontend)
  ↓ HTTP POST /search/candidates
SearchController.searchCandidates() [apps/api/src/search/search.controller.ts:12]
  ↓ Line 20
GraphSearchService.searchCandidatesByNeighborhood(jobGraph, candidateGraphs) [apps/api/src/runtime/kg/graph-search.service.ts:55]
  ↓ Line 62 (cache key generation)
  ↓ Line 65 (CacheService.get)
  ↓ Line 70-71 (findNodeByType)
  ↓ Line 73-74 (GraphQueryEngine.findNeighbors)
  ↓ Line 78-83 (candidate GraphQueryEngine.findNeighbors)
  ↓ Line 86-92 (overlap calculation)
  ↓ Line 95 (calculateGraphDistance)
  ↓ Line 98 (findCommonElements)
  ↓ Line 101 (generateNeighborhoodMatchReasons)
  ↓ Line 118 (CacheService.set with 15min TTL)
  ↓ Returns: NeighborhoodSearchResult[]
  ↓ Line 25-29
SearchController returns formatted results
  ↓
Frontend receives search results
```

**Evidence:**
- File: `apps/api/src/search/search.controller.ts` Line 12-38
- File: `apps/api/src/runtime/kg/graph-search.service.ts` Line 55-121

---

## FLOW 5: DASHBOARD → COPILOT

```
User (Frontend)
  ↓ HTTP POST /copilot/message
CopilotController.processMessage() [apps/api/src/copilot/copilot.controller.ts:9]
  ↓ Line 13
CopilotService.processMessage(sessionId, message) [apps/api/src/copilot/copilot.service.ts:23]
  ↓ Line 24 (cache key generation)
  ↓ Line 27 (CacheService.get with 5min TTL)
  ↓ Line 32 (PromptInterpreter.interpret)
  ↓ Line 33 (ConversationMemoryService.getOrCreateContext)
  ↓ Line 36-37 (createEmptyGraph)
  ↓ Line 37 (GraphReasoningEngine.answerCandidateQuestion)
  ↓ Line 49-65 (intent switch)
  ↓ Line 51 (handleSearchCandidates)
  ↓ Line 103-118
GraphSearchService.searchCandidatesByNeighborhood()
  ↓ Line 107 (ConversationMemoryService.setLastSearchQuery)
  ↓ Returns: data
  ↓ Line 67 (ResponseBuilderService.buildResponse)
  ↓ Line 69-81 (ConversationMemoryService.addMessage)
  ↓ Line 84 (CacheService.set with 5min TTL)
  ↓ Returns: CopilotResponse
  ↓ Line 14-17
CopilotController returns response
  ↓
Frontend receives copilot response
```

**Evidence:**
- File: `apps/api/src/copilot/copilot.controller.ts` Line 9-21
- File: `apps/api/src/copilot/copilot.service.ts` Line 23-87

---

## FLOW 6: RECRUITER → BILLING (STRIPE WEBHOOK)

```
Stripe System
  ↓ HTTP POST /api/stripe/webhook
POST handler [apps/web/src/app/api/stripe/webhook/route.ts:21]
  ↓ Line 24 (req.text())
  ↓ Line 25 (stripe-signature header)
  ↓ Line 33-40 (stripe.webhooks.constructEvent)
  ↓ Line 43-169 (event type switch)
  ↓ Line 46-86 (checkout.session.completed)
  ↓ Line 49-53 (metadata validation)
  ↓ Line 62-76 (credit purchase handling)
  ↓ Line 66
BillingService.refundCredits() [apps/web/src/lib/db/billing.service.ts:159]
  ↓ Line 169-174 (Supabase RPC: add_credits_atomic)
  ↓ Returns: CreditOperationResult
  ↓ Line 82-84 (stripe.subscriptions.retrieve)
  ↓ Line 83
upsertSubscriptionAndPlan() [apps/web/src/app/api/stripe/webhook/route.ts:182]
  ↓ Line 194-219 (Prisma transaction)
  ↓ Line 195-214 (prisma.subscription.upsert)
  ↓ Line 215-218 (prisma.user.update)
  ↓ Line 176
Returns: NextResponse.json({ received: true })
  ↓
Stripe receives 200 OK
```

**Evidence:**
- File: `apps/web/src/app/api/stripe/webhook/route.ts` Line 21-179
- File: `apps/web/src/lib/db/billing.service.ts` Line 159-187

---

## FLOW 7: BILLING → HISTORY (CREDIT LEDGER)

```
User (Frontend)
  ↓ HTTP GET /api/user/credits/ledger
API Route (not observed in search)
  ↓
BillingService.getLedger(userId) [apps/web/src/lib/db/billing.service.ts:216]
  ↓ Line 218 (getServerDb)
  ↓ Line 219-223 (Supabase.from('credit_usage').select)
  ↓ Line 224 (order by created_at descending)
  ↓ Line 230 (validateCreditUsage)
  ↓ Returns: credit_usage array
  ↓
Frontend receives credit ledger
```

**Evidence:**
- File: `apps/web/src/lib/db/billing.service.ts` Line 216-232

---

## FLOW 8: HISTORY → ANALYTICS

```
User (Frontend)
  ↓ HTTP GET /api/analytics (not observed in search)
  ↓
Analytics Service (not observed in search)
  ↓
Returns: analytics data
  ↓
Frontend receives analytics
```

**Evidence:**
- No analytics service observed in codebase search
- Confidence: 0%

---

# MISSING RUNTIME FLOWS

## FLOW: JOB PIPELINE
**Status:** NOT OBSERVED
**Evidence:** No job import pipeline observed in codebase search
**Confidence:** 0%

## FLOW: ANALYTICS
**Status:** NOT OBSERVED
**Evidence:** No analytics service observed in codebase search
**Confidence:** 0%

## FLOW: SIMULATION
**Status:** NOT OBSERVED
**Evidence:** No simulation service observed in codebase search
**Confidence:** 0%

## FLOW: DASHBOARD
**Status:** PARTIALLY OBSERVED
**Evidence:** Dashboard routes defined in AuthorizationV2 but no dashboard page observed
**Confidence:** 30%

---

# RUNTIME DEPENDENCY GRAPH

## Core Services
```
CvService
  ↓ depends on
NormalizationService
RuntimeGraphService
  ↓ depends on
EntityNormalizerService
NodeFusionService
EdgeBuilderService
GraphValidatorService
GraphRepository
  ↓ depends on
PrismaClient
CacheService
```

## Graph Services
```
GraphMatchingService
  ↓ depends on
GraphQueryEngine
GraphAnalyticsService
CacheService

GraphSearchService
  ↓ depends on
GraphQueryEngine
GraphAnalyticsService
CacheService

GraphReasoningEngine
  ↓ depends on
GraphQueryEngine
GraphAnalyticsService
```

## Copilot Services
```
CopilotService
  ↓ depends on
PromptInterpreterService
ResponseBuilderService
ConversationMemoryService
GraphSearchService
GraphMatchingService
GraphReasoningEngine
CacheService
```

## Billing Services
```
BillingService
  ↓ depends on
Supabase Client
UserService
```

## External Integrations
```
Supabase
  ↓ used by
BillingService
CV Analyze Route
Stripe Webhook Route

Stripe
  ↓ used by
Stripe Webhook Route

Mistral AI
  ↓ used by
CV Analyze Route

Redis (CacheService)
  ↓ used by
GraphMatchingService
GraphSearchService
CopilotService
GraphRepository
```

---

# RUNTIME ENTRY POINTS

## API Controllers (NestJS)
1. **CvController** - `/cv/*` endpoints
   - File: `apps/api/src/cv/cv.controller.ts`
   - Line 6: @Controller('cv')
   - Confidence: 100%

2. **CopilotController** - `/copilot/*` endpoints
   - File: `apps/api/src/copilot/copilot.controller.ts`
   - Line 5: @Controller('copilot')
   - Confidence: 100%

3. **MatchingController** - `/matching/*` endpoints
   - File: `apps/api/src/matching/matching.controller.ts`
   - Line 6: @Controller('matching')
   - Confidence: 100%

4. **SearchController** - `/search/*` endpoints
   - File: `apps/api/src/search/search.controller.ts`
   - Line 6: @Controller('search')
   - Confidence: 100%

## Web API Routes (Next.js)
1. **CV Analyze Route** - `/api/cv/analyze`
   - File: `apps/web/src/app/api/cv/analyze/route.ts`
   - Line 89: export const POST
   - Confidence: 100%

2. **Stripe Webhook Route** - `/api/stripe/webhook`
   - File: `apps/web/src/app/api/stripe/webhook/route.ts`
   - Line 21: export const POST
   - Confidence: 100%

3. **Health Check Route** - `/api/health`
   - File: `apps/web/src/app/api/health/route.ts`
   - Confidence: 100%

---

# CRITICAL RUNTIME PATHS

## Path 1: CV Processing (API)
**Entry:** CvController.uploadCv()
**Exit:** Profile generation
**Components:** CvService → NormalizationService → RuntimeGraphService → GraphRepository
**Confidence:** 90%

## Path 2: CV Analysis (Web)
**Entry:** POST /api/cv/analyze
**Exit:** HIIOS context initialization
**Components:** AuthorizationV2 → BillingService → Mistral AI → Prisma → CVHIIOSBridge
**Confidence:** 95%

## Path 3: Matching
**Entry:** MatchingController.calculateScore()
**Exit:** Matching score
**Components:** GraphMatchingService → GraphQueryEngine → GraphAnalyticsService → CacheService
**Confidence:** 80%

## Path 4: Search
**Entry:** SearchController.searchCandidates()
**Exit:** Search results
**Components:** GraphSearchService → GraphQueryEngine → CacheService
**Confidence:** 80%

## Path 5: Copilot
**Entry:** CopilotController.processMessage()
**Exit:** Copilot response
**Components:** CopilotService → PromptInterpreterService → ConversationMemoryService → GraphSearchService → GraphReasoningEngine → ResponseBuilderService → CacheService
**Confidence:** 85%

## Path 6: Billing
**Entry:** Stripe webhook
**Exit:** Credit update / Subscription update
**Components:** Stripe SDK → BillingService → Supabase → Prisma
**Confidence:** 90%

---

# RUNTIME GAPS

## Missing Components
1. **Job Pipeline** - No job import service observed
2. **Analytics Service** - No analytics service observed
3. **Simulation Service** - No simulation service observed
4. **Dashboard Page** - No dashboard page observed
5. **History Page** - No history page observed

## Missing Observability
1. **Structured Logging** - Limited logging observed
2. **Distributed Tracing** - No tracing observed
3. **Metrics Collection** - No metrics observed
4. **Performance Monitoring** - No performance monitoring observed

## Missing Resilience
1. **Retry Logic** - Limited retry observed
2. **Circuit Breaker** - No circuit breaker observed
3. **Timeout Configuration** - Limited timeout observed
4. **Cache Invalidation** - Limited invalidation observed

---

*End of RC35-RUNTIME-GRAPH.md*
