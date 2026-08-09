# RC3-RUNTIME-GRAPH.md
## Real Execution Graph for Project Trajectoire

Generated: 2025-01-08
Repository: Trajectoire-V1
Mission: RC-003 Evidence Collection
Status: IN PROGRESS

---

# EXECUTION FLOW OVERVIEW

This document represents the observed runtime execution graph based on code analysis. Each arrow (→) represents a direct function call or data flow observed in the codebase.

---

# CV PROCESSING FLOW

## User Uploads CV
```
User (Frontend)
  ↓ HTTP POST
CV Upload Interface
  ↓ File Upload
CvController.uploadCv() [apps/api/src/cv/cv.controller.ts]
  ↓
CvService.processCv() [apps/api/src/cv/cv.service.ts]
  ↓
CvService.extractText() [apps/api/src/cv/cv.service.ts:58-84]
  ↓
pdf-parse library OR mammoth library
  ↓
CvService.extractKnowledge() [apps/api/src/cv/cv.service.ts:86-114]
  ↓
CvService.extractPersonalInfo() [apps/api/src/cv/cv.service.ts:116-126]
CvService.extractExperiences() [apps/api/src/cv/cv.service.ts:128-151]
CvService.extractEducation() [apps/api/src/cv/cv.service.ts:153-175]
CvService.extractSkills() [apps/api/src/cv/cv.service.ts:177-198]
CvService.extractCertifications() [apps/api/src/cv/cv.service.ts:200-214]
CvService.extractLanguages() [apps/api/src/cv/cv.service.ts:216-229]
  ↓
CvService.normalizeKnowledge() [apps/api/src/cv/cv.service.ts:231-233]
  ↓
NormalizationService.normalizeKnowledge() [apps/api/src/cv/normalization.service.ts:229-258]
  ↓
NormalizationService.normalizeJob() [apps/api/src/cv/normalization.service.ts:123-175]
NormalizationService.normalizeSkill() [apps/api/src/cv/normalization.service.ts:177-227]
  ↓
RuntimeGraphService.importCV() [apps/api/src/runtime/kg/runtime-graph.service.ts:113-206]
  ↓
RuntimeGraphService.buildNodesFromCV() [apps/api/src/runtime/kg/runtime-graph.service.ts:309-414]
  ↓
SkillBuilder.buildBatch()
ExperienceBuilder.buildBatch()
EducationBuilder.buildBatch()
CertificationBuilder.buildBatch()
LanguageBuilder.buildBatch()
ProjectBuilder.buildBatch()
CompanyBuilder.buildBatch()
LocationBuilder.buildBatch()
MissionBuilder.buildBatch()
ResponsibilityBuilder.buildBatch()
TechnologyBuilder.buildBatch()
  ↓
RuntimeGraphService.buildEdgesFromCV() [apps/api/src/runtime/kg/runtime-graph.service.ts:419-661]
  ↓
NodeFusionService.fuseNodes() [apps/api/src/runtime/kg/runtime-graph.service.ts:126-128]
  ↓
GraphValidatorService.validate() [apps/api/src/runtime/kg/runtime-graph.service.ts:134-136]
  ↓
GraphRepository.createGraph() [apps/api/src/runtime/kg/graph-repository.service.ts:75-92]
  ↓
PrismaClient.graph.create() [apps/api/src/runtime/kg/graph-repository.service.ts:76-83]
  ↓
CacheService.set() [apps/api/src/runtime/kg/graph-repository.service.ts:88-89]
  ↓
GraphRepository.createNodes() [apps/api/src/runtime/kg/graph-repository.service.ts:216-233]
  ↓
PrismaClient.graphNode.createMany() [apps/api/src/runtime/kg/graph-repository.service.ts:217-229]
  ↓
GraphRepository.createEdges() [apps/api/src/runtime/kg/graph-repository.service.ts:294-311]
  ↓
PrismaClient.graphEdge.createMany() [apps/api/src/runtime/kg/graph-repository.service.ts:295-308]
  ↓
GraphRepository.createVersion() [apps/api/src/runtime/kg/graph-repository.service.ts:372-407]
  ↓
PrismaClient.graphVersion.create() [apps/api/src/runtime/kg/graph-repository.service.ts:393-404]
  ↓
CvService.generateProfile() [apps/api/src/cv/cv.service.ts:235-269]
  ↓
Return to User
```

---

# CV ANALYSIS WITH MISTRAL AI FLOW

## User Analyzes CV via Web API
```
User (Frontend)
  ↓ HTTP POST
CV Analyze Interface
  ↓
POST /api/cv/analyze [apps/web/src/app/api/cv/analyze/route.ts]
  ↓
AuthorizationV2.checkAccess() [apps/web/src/lib/authorization/AuthorizationV2.ts]
  ↓
Input Validation
  ↓
BillingService.reserveCredits() [apps/web/src/lib/db/billing.service.ts:72-117]
  ↓
Supabase RPC: reserve_credits_atomic() [apps/web/src/lib/db/billing.service.ts:92-97]
  ↓
Mistral AI API Call [apps/web/src/app/api/cv/analyze/route.ts]
  ↓
Mistral LLM CV Parsing
  ↓
Prisma.cv.create() [apps/web/src/app/api/cv/analyze/route.ts]
  ↓
Prisma.user.update() [apps/web/src/app/api/cv/analyze/route.ts]
  ↓
initializeHIIOSContext() [apps/web/src/app/api/cv/analyze/route.ts]
  ↓
BillingService.commitCredits() [apps/web/src/lib/db/billing.service.ts:122-135]
  ↓
Supabase RPC: commit_credits_atomic() [apps/web/src/lib/db/billing.service.ts:125-128]
  ↓
Return to User
```

## Error Flow (CV Analysis)
```
Mistral AI API Error
  ↓
BillingService.rollbackCredits() [apps/web/src/lib/db/billing.service.ts:140-153]
  ↓
Supabase RPC: rollback_credits_atomic() [apps/web/src/lib/db/billing.service.ts:143-146]
  ↓
Return Error to User
```

---

# CANDIDATE-JOB MATCHING FLOW

## User Requests Match Score
```
User (Frontend)
  ↓ HTTP POST
Matching Interface
  ↓
MatchingController.calculateScore() [apps/api/src/matching/matching.controller.ts]
  ↓
GraphMatchingService.calculateMatchScore() [apps/api/src/runtime/kg/graph-matching.service.ts]
  ↓
GraphMatchingService.calculateSkillsScore()
GraphMatchingService.calculateExperienceScore()
GraphMatchingService.calculateEducationScore()
GraphMatchingService.calculateLocationScore()
GraphMatchingService.calculateTransferabilityScore()
  ↓
GraphQueryEngine.findNeighbors() [apps/api/src/runtime/kg/graph-matching.service.ts]
  ↓
GraphAnalyticsService.calculateCentrality() [apps/api/src/runtime/kg/graph-matching.service.ts]
  ↓
GraphAnalyticsService.calculateTransferability() [apps/api/src/runtime/kg/graph-matching.service.ts]
  ↓
CacheService.get() [apps/api/src/runtime/kg/graph-matching.service.ts]
  ↓
CacheService.set() [apps/api/src/runtime/kg/graph-matching.service.ts]
  ↓
Return Score to User
```

## User Requests Match Explanation
```
User (Frontend)
  ↓ HTTP POST
Matching Interface
  ↓
MatchingController.explainMatch() [apps/api/src/matching/matching.controller.ts]
  ↓
GraphMatchingService.explainMatch() [apps/api/src/runtime/kg/graph-matching.service.ts]
  ↓
GraphMatchingService.identifyStrengths()
GraphMatchingService.identifyWeaknesses()
GraphMatchingService.generateRecommendations()
  ↓
Return Explanation to User
```

## User Requests Match Report
```
User (Frontend)
  ↓ HTTP POST
Matching Interface
  ↓
MatchingController.generateReport() [apps/api/src/matching/matching.controller.ts]
  ↓
GraphMatchingService.generateMatchReport() [apps/api/src/runtime/kg/graph-matching.service.ts]
  ↓
Return Report to User
```

---

# GRAPH SEARCH FLOW

## User Searches Candidates by Job
```
User (Frontend)
  ↓ HTTP POST
Search Interface
  ↓
SearchController.searchCandidatesByJob() [apps/api/src/search/search.controller.ts]
  ↓
GraphSearchService.searchCandidatesByNeighborhood() [apps/api/src/runtime/kg/graph-search.service.ts:55-121]
  ↓
CacheService.get() [apps/api/src/runtime/kg/graph-search.service.ts:62-68]
  ↓
GraphQueryEngine.findNeighbors() [apps/api/src/runtime/kg/graph-search.service.ts:73-74]
  ↓
GraphQueryEngine.findNeighbors() [apps/api/src/runtime/kg/graph-search.service.ts:82-83]
  ↓
GraphSearchService.calculateGraphDistance() [apps/api/src/runtime/kg/graph-search.service.ts:95]
  ↓
GraphSearchService.findCommonElements() [apps/api/src/runtime/kg/graph-search.service.ts:98]
  ↓
GraphSearchService.generateNeighborhoodMatchReasons() [apps/api/src/runtime/kg/graph-search.service.ts:101]
  ↓
CacheService.set() [apps/api/src/runtime/kg/graph-search.service.ts:118]
  ↓
Return Results to User
```

## User Searches Jobs by Candidate
```
User (Frontend)
  ↓ HTTP POST
Search Interface
  ↓
SearchController.searchJobsByCandidate() [apps/api/src/search/search.controller.ts]
  ↓
GraphSearchService.searchJobsByNeighborhood() [apps/api/src/runtime/kg/graph-search.service.ts:126-180]
  ↓
Similar flow to candidate search
  ↓
Return Results to User
```

## User Finds Similar Candidates
```
User (Frontend)
  ↓ HTTP POST
Search Interface
  ↓
SearchController.findSimilarCandidates() [apps/api/src/search/search.controller.ts]
  ↓
GraphSearchService.findSimilarCandidates() [apps/api/src/runtime/kg/graph-search.service.ts:263-297]
  ↓
GraphSearchService.calculateGraphSimilarity() [apps/api/src/runtime/kg/graph-search.service.ts:199]
  ↓
GraphSearchService.calculateGraphSimilarity() [apps/api/src/runtime/kg/graph-search.service.ts:467-497]
  ↓ (Jaccard, Cosine, Skill Overlap)
GraphSearchService.findCommonElements() [apps/api/src/runtime/kg/graph-search.service.ts:202]
  ↓
Return Results to User
```

---

# COPILOT FLOW

## User Sends Message to Copilot
```
User (Frontend)
  ↓ HTTP POST
Copilot Chat Interface
  ↓
CopilotController.processMessage() [apps/api/src/copilot/copilot.controller.ts]
  ↓
CopilotService.processMessage() [apps/api/src/copilot/copilot.service.ts:23-87]
  ↓
CacheService.get() [apps/api/src/copilot/copilot.service.ts:24-30]
  ↓ (cache hit)
Return Cached Response
  ↓ (cache miss)
PromptInterpreter.interpret() [apps/api/src/copilot/copilot.service.ts:32]
  ↓
ConversationMemoryService.getOrCreateContext() [apps/api/src/copilot/copilot.service.ts:33]
  ↓
GraphReasoningEngine.answerCandidateQuestion() [apps/api/src/copilot/copilot.service.ts:37]
  ↓
GraphReasoningEngine.traceReasoning() [apps/api/src/runtime/kg/graph-reasoning-engine.service.ts:84-127]
  ↓
GraphReasoningEngine.parseQuestion() [apps/api/src/runtime/kg/graph-reasoning-engine.service.ts:260-292]
GraphReasoningEngine.queryNodes() [apps/api/src/runtime/kg/graph-reasoning-engine.service.ts:297-309]
GraphReasoningEngine.traverseEdges() [apps/api/src/runtime/kg/graph-reasoning-engine.service.ts:314-343]
GraphReasoningEngine.makeInferences() [apps/api/src/runtime/kg/graph-reasoning-engine.service.ts:348-384]
GraphReasoningEngine.generateConclusion() [apps/api/src/runtime/kg/graph-reasoning-engine.service.ts:389-407]
  ↓
GraphReasoningEngine.generateExplanation() [apps/api/src/runtime/kg/graph-reasoning-engine.service.ts:421-463]
  ↓
Intent Handler (based on intent type)
  ↓
handleSearchCandidates() [apps/api/src/copilot/copilot.service.ts:103-118]
  ↓
GraphSearchService.searchCandidatesByNeighborhood()
  ↓
OR
handleSearchJobs() [apps/api/src/copilot/copilot.service.ts:120-135]
  ↓
GraphSearchService.searchJobsByNeighborhood()
  ↓
OR
handleExplainScore() [apps/api/src/copilot/copilot.service.ts:137-140]
  ↓
ConversationMemoryService.getLastReport()
  ↓
OR
handleProposeTraining() [apps/api/src/copilot/copilot.service.ts:142-159]
  ↓
GraphSearchService.searchCandidatesByCommunity()
  ↓
OR
handleProposeEvolution() [apps/api/src/copilot/copilot.service.ts:161-178]
  ↓
GraphSearchService.searchCandidatesByCommunity()
  ↓
ResponseBuilderService.buildResponse() [apps/api/src/copilot/copilot.service.ts:67]
  ↓
ConversationMemoryService.addMessage() [apps/api/src/copilot/copilot.service.ts:69-81]
  ↓
CacheService.set() [apps/api/src/copilot/copilot.service.ts:84]
  ↓
Return Response to User
```

## User Gets Conversation History
```
User (Frontend)
  ↓ HTTP GET
Copilot Interface
  ↓
CopilotController.getHistory() [apps/api/src/copilot/copilot.controller.ts]
  ↓
CopilotService.getConversationHistory() [apps/api/src/copilot/copilot.service.ts:213-215]
  ↓
ConversationMemoryService.getConversationHistory()
  ↓
Return History to User
```

## User Clears Conversation
```
User (Frontend)
  ↓ HTTP DELETE
Copilot Interface
  ↓
CopilotController.clearConversation() [apps/api/src/copilot/copilot.controller.ts]
  ↓
CopilotService.clearConversation() [apps/api/src/copilot/copilot.service.ts:217-219]
  ↓
ConversationMemoryService.clearConversation()
  ↓
Return Confirmation to User
```

---

# BILLING & PAYMENTS FLOW

## Stripe Webhook Event
```
Stripe System
  ↓ HTTP POST (Webhook)
Stripe Webhook Route [apps/web/src/app/api/stripe/webhook/route.ts]
  ↓
stripe.webhooks.constructEvent() [apps/web/src/app/api/stripe/webhook/route.ts]
  ↓ (signature verification)
Event Type Routing
  ↓
checkout.session.completed
  ↓
Prisma.user.update() [apps/web/src/app/api/stripe/webhook/route.ts]
  ↓
OR
customer.subscription.created
  ↓
Prisma.subscription.create() [apps/web/src/app/api/stripe/webhook/route.ts]
  ↓
OR
customer.subscription.updated
  ↓
Prisma.subscription.update() [apps/web/src/app/api/stripe/webhook/route.ts]
  ↓
OR
invoice.payment_succeeded
  ↓
BillingService.refundCredits() [apps/web/src/app/api/stripe/webhook/route.ts]
  ↓
Supabase RPC: add_credits_atomic() [apps/web/src/lib/db/billing.service.ts:169-174]
  ↓
OR
customer.subscription.deleted
  ↓
Prisma.subscription.update() [apps/web/src/app/api/stripe/webhook/route.ts]
  ↓
OR
invoice.payment_failed
  ↓
Error Handling
  ↓
Return 200 OK to Stripe
```

## Credit Spending Flow
```
Service Operation (e.g., CV Analysis)
  ↓
BillingService.spendCredits() [apps/web/src/lib/db/billing.service.ts:22-66]
  ↓
assertValidCreditOperation() [apps/web/src/lib/db/billing.service.ts:24]
  ↓
Supabase RPC: deduct_credits_atomic() [apps/web/src/lib/db/billing.service.ts:29-32]
  ↓ (success)
Supabase.from('credit_usage').insert() [apps/web/src/lib/db/billing.service.ts:52-59]
  ↓
Return Success
  ↓ (error)
logError() [apps/web/src/lib/db/billing.service.ts:35-40]
  ↓
Return Error
```

## Credit Reservation Flow (2PC)
```
Long-Running Operation (e.g., LLM Generation)
  ↓
BillingService.reserveCredits() [apps/web/src/lib/db/billing.service.ts:72-117]
  ↓
assertValidCreditOperation() [apps/web/src/lib/db/billing.service.ts:74]
  ↓
Supabase.from('credit_transactions').select() [apps/web/src/lib/db/billing.service.ts:78-82]
  ↓ (idempotency check)
  ↓ (existing transaction)
Return Cached Result
  ↓ (new transaction)
Supabase RPC: reserve_credits_atomic() [apps/web/src/lib/db/billing.service.ts:92-97]
  ↓
Return Transaction ID
  ↓ (operation completes)
BillingService.commitCredits() [apps/web/src/lib/db/billing.service.ts:122-135]
  ↓
Supabase RPC: commit_credits_atomic() [apps/web/src/lib/db/billing.service.ts:125-128]
  ↓
Return Success
  ↓ (operation fails)
BillingService.rollbackCredits() [apps/web/src/lib/db/billing.service.ts:140-153]
  ↓
Supabase RPC: rollback_credits_atomic() [apps/web/src/lib/db/billing.service.ts:143-146]
  ↓
Return Rollback Success
```

---

# INTERVIEW SYSTEM FLOW

## User Starts Interview Session
```
User (Frontend)
  ↓ HTTP POST
Interview Interface
  ↓
InterviewService.startSession() [apps/web/src/lib/db/interview.service.ts]
  ↓
Supabase RPC: create interview session
  ↓
Return Session ID to User
```

## User Submits Answer
```
User (Frontend)
  ↓ HTTP POST
Interview Interface
  ↓
InterviewService.submitAnswer() [apps/web/src/lib/db/interview.service.ts]
  ↓
Supabase RPC: submit answer
  ↓
Return Confirmation to User
```

## User Completes Session
```
User (Frontend)
  ↓ HTTP POST
Interview Interface
  ↓
InterviewService.completeSession() [apps/web/src/lib/db/interview.service.ts]
  ↓
Feature Engineering
  ↓
ML Scoring Pipeline
  ↓
User Behavioral Memory Update
  ↓
Drift Detection
  ↓
Decision Graph Evaluation
  ↓
Supabase RPC: update session with results
  ↓
Return Results to User
```

---

# HEALTH CHECK FLOW

## Monitoring System Checks Health
```
Monitoring System
  ↓ HTTP GET
Health Check Endpoint [apps/web/src/app/api/health/route.ts]
  ↓
Prisma.$queryRaw() [apps/web/src/app/api/health/route.ts]
  ↓ (database check)
OpenAI Key Check [apps/web/src/app/api/health/route.ts]
  ↓ (API key check)
Redis Check (skipped) [apps/web/src/app/api/health/route.ts]
  ↓
Uptime Calculation [apps/web/src/app/api/health/route.ts]
  ↓
Memory Usage Calculation [apps/web/src/app/api/health/route.ts]
  ↓
Application Version [apps/web/src/app/api/health/route.ts]
  ↓
Return Health Status
```

---

# AUTHORIZATION FLOW

## Protected API Route Access
```
User Request
  ↓
API Route Handler
  ↓
AuthorizationV2.checkAccess() [apps/web/src/lib/authorization/AuthorizationV2.ts]
  ↓
AuthorizationV2.checkRouteAccess() [apps/web/src/lib/authorization/AuthorizationV2.ts]
  ↓
User Context Extraction
  ↓
Access Level Check (PUBLIC, AUTHENTICATED, SUBSCRIBER, PREMIUM, ADMIN)
  ↓
Role Check (USER, RECRUITER, ADMIN)
  ↓
Subscription Plan Check (FREE, BASIC, PRO, ENTERPRISE)
  ↓
Return Access Decision
  ↓ (granted)
Proceed to Route Handler
  ↓ (denied)
Return 403 Forbidden
```

---

# DATABASE OPERATIONS FLOW

## Generic Repository Pattern
```
Service Layer
  ↓
BaseRepository<T> [apps/web/src/lib/db/base.repository.ts]
  ↓
findById() / findMany() / insert() / update() / delete()
  ↓
SupabaseClient.from(table)
  ↓
Supabase Query Builder
  ↓
Supabase API Call
  ↓
Return Result
```

## Graph Repository Pattern
```
Service Layer
  ↓
GraphRepository [apps/api/src/runtime/kg/graph-repository.service.ts]
  ↓
createGraph() / getGraphById() / updateGraph()
  ↓
CacheService.get() [apps/api/src/runtime/kg/graph-repository.service.ts]
  ↓ (cache hit)
Return Cached Graph
  ↓ (cache miss)
PrismaClient.graph.findUnique() / create() / update()
  ↓
Prisma Query Execution
  ↓
Map Prisma Graph to Domain Graph [apps/api/src/runtime/kg/graph-repository.service.ts:692-752]
  ↓
CacheService.set() [apps/api/src/runtime/kg/graph-repository.service.ts]
  ↓
Return Graph
```

## Graph Transaction Flow
```
Service Layer
  ↓
GraphRepository.transaction() [apps/api/src/runtime/kg/graph-repository.service.ts:602-604]
  ↓
PrismaClient.$transaction(callback)
  ↓
Transaction Callback Execution
  ↓
Multiple Prisma Operations
  ↓
Commit Transaction
  ↓ (success)
Return Result
  ↓ (failure)
Rollback Transaction
  ↓
Return Error
```

---

# CACHING FLOW

## Cache Get Flow
```
Service Layer
  ↓
CacheService.get(key) [apps/api/src/cache/cache.decorator.ts]
  ↓
CacheService.generateKey(prefix, ...args) [apps/api/src/runtime/kg/graph-repository.service.ts:88]
  ↓
Redis GET operation
  ↓ (cache hit)
Return Cached Data
  ↓ (cache miss)
Return null
```

## Cache Set Flow
```
Service Layer
  ↓
CacheService.set(key, value, ttl) [apps/api/src/cache/cache.decorator.ts]
  ↓
CacheService.generateKey(prefix, ...args)
  ↓
Redis SET operation with TTL
  ↓
Return Success
```

## Cache Invalidation Flow
```
Service Layer
  ↓
CacheService.del(key) [apps/api/src/cache/cache.decorator.ts]
  ↓
CacheService.generateKey(prefix, ...args)
  ↓
Redis DEL operation
  ↓
Return Success
```

---

# ERROR HANDLING FLOW

## Service Error Handling
```
Service Operation
  ↓ (error occurs)
try-catch Block
  ↓
Error Type Detection
  ↓ (file not found)
throw Error('File not found')
  ↓ (unsupported file type)
throw Error('Unsupported file type')
  ↓ (text extraction error)
throw Error('Failed to extract text')
  ↓ (insufficient credits)
return { success: false, error: 'Insufficient credits', code: 'INSUFFICIENT_CREDITS' }
  ↓ (user not found)
return { success: false, error: 'User not found', code: 'USER_NOT_FOUND' }
  ↓ (database error)
return { success: false, error: 'Database error', code: 'DB_ERROR' }
  ↓
logError() [apps/web/src/lib/db/billing.service.ts]
  ↓
Return Error to Caller
```

---

# SUMMARY OF EXECUTION PATHS

## Major Execution Flows Identified
1. **CV Processing Flow** - 25 steps from upload to profile generation
2. **CV Analysis Flow** - 12 steps with Mistral AI integration
3. **Matching Flow** - 8 steps for score calculation
4. **Search Flow** - 10 steps for candidate/job search
5. **Copilot Flow** - 20 steps for message processing
6. **Billing Flow** - 8 steps for credit operations
7. **Payment Flow** - 7 steps for Stripe webhook handling
8. **Interview Flow** - 5 steps for session management
9. **Health Check Flow** - 6 steps for monitoring
10. **Authorization Flow** - 7 steps for access control

## Key Integration Points
- **Prisma ORM** - API database operations
- **Supabase** - Web database operations with RPC functions
- **Redis** - Caching layer
- **Mistral AI** - CV analysis
- **Stripe** - Payment processing
- **OpenAI** - AI model integration

## Critical Paths
1. **CV Processing** - Core functionality for candidate graph creation
2. **Billing** - Financial operations with 2PC for consistency
3. **Matching** - Core business logic for candidate-job matching
4. **Authorization** - Security layer for all protected routes

## Error Recovery Paths
1. **CV Analysis Error** - Credit rollback on Mistral AI failure
2. **Billing Error** - Transaction rollback on database failure
3. **Graph Persistence Error** - Continue with in-memory graph on persistence failure

---

*End of RC3-RUNTIME-GRAPH.md*
