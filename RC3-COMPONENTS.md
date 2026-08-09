# RC3-COMPONENTS.md
## Complete Component Index with Imports, Calls, and Consumers

Generated: 2025-01-08
Repository: Trajectoire-V1

---

# Table of Contents
1. [API Controllers (NestJS)](#api-controllers-nestjs)
2. [API Services (NestJS)](#api-services-nestjs)
3. [Web API Routes (Next.js)](#web-api-routes-nextjs)
4. [Web Services (Next.js)](#web-services-nextjs)
5. [Graph Runtime Services](#graph-runtime-services)
6. [Authorization & Security](#authorization--security)
7. [Database & Repositories](#database--repositories)

---

# API Controllers (NestJS)

## CvController
**File:** `apps/api/src/cv/cv.controller.ts`
**Type:** NestJS Controller
**Decorators:** `@Controller('cv')`

### Imports
- `@nestjs/common`: Controller, Post, Body, UploadedFile, UseInterceptors, FileInterceptor
- `RateLimitUpload` (custom decorator)
- `RateLimitApi` (custom decorator)
- `CvService`

### Functions/Endpoints
- `uploadCv()` - POST /upload - Upload and process CV file
- `extractKnowledge()` - POST /extract - Extract knowledge from CV text
- `normalizeKnowledge()` - POST /normalize - Normalize knowledge with KP-001/KP-002
- `buildGraph()` - POST /graph - Build knowledge graph from CV
- `generateProfile()` - POST /profile - Generate candidate profile

### Calls
- `CvService.processCv()`
- `CvService.extractKnowledge()`
- `CvService.normalizeKnowledge()`
- `CvService.generateProfile()`

### Consumers
- Frontend CV upload interface
- External API clients

### Dependencies
- `CvService`
- `NormalizationService` (via CvService)
- `RuntimeGraphService` (via CvService)

---

## CopilotController
**File:** `apps/api/src/copilot/copilot.controller.ts`
**Type:** NestJS Controller
**Decorators:** `@Controller('copilot')`

### Imports
- `@nestjs/common`: Controller, Post, Get, Delete, Body, Param
- `RateLimitCopilot` (custom decorator)
- `RateLimitApi` (custom decorator)
- `CopilotService`

### Functions/Endpoints
- `processMessage()` - POST /message - Process copilot chat message
- `getHistory()` - GET /history/:sessionId - Get conversation history
- `clearConversation()` - DELETE /clear/:sessionId - Clear conversation
- `getAllSessions()` - GET /sessions - Get all sessions

### Calls
- `CopilotService.processMessage()`
- `CopilotService.getConversationHistory()`
- `CopilotService.clearConversation()`
- `CopilotService.getAllSessions()`

### Consumers
- Frontend copilot chat interface
- External AI assistant clients

### Dependencies
- `CopilotService`
- `PromptInterpreterService`
- `ResponseBuilderService`
- `ConversationMemoryService`
- `GraphSearchService`
- `GraphMatchingService`
- `GraphReasoningEngine`
- `CacheService`

---

## MatchingController
**File:** `apps/api/src/matching/matching.controller.ts`
**Type:** NestJS Controller
**Decorators:** `@Controller('matching')`

### Imports
- `@nestjs/common`: Controller, Post, Body
- `RateLimitApi` (custom decorator)
- `GraphMatchingService`
- `GraphRepository`

### Functions/Endpoints
- `registerCandidate()` - POST /candidate/register - Register candidate graph
- `registerJob()` - POST /job/register - Register job graph
- `calculateScore()` - POST /score - Calculate matching score
- `explainMatch()` - POST /explain - Explain match reasoning
- `generateReport()` - POST /report - Generate matching report

### Calls
- `GraphMatchingService.calculateMatchScore()`
- `GraphMatchingService.explainMatch()`
- `GraphMatchingService.generateMatchReport()`
- `GraphRepository.createGraph()`
- `GraphRepository.getGraphById()`

### Consumers
- Frontend matching interface
- Recruitment platform clients

### Dependencies
- `GraphMatchingService`
- `GraphRepository`
- `GraphQueryEngine`
- `GraphAnalyticsService`
- `CacheService`

---

## SearchController
**File:** `apps/api/src/search/search.controller.ts`
**Type:** NestJS Controller
**Decorators:** `@Controller('search')`

### Imports
- `@nestjs/common`: Controller, Post, Body
- `RateLimitApi` (custom decorator)
- `GraphSearchService`

### Functions/Endpoints
- `searchCandidatesByJob()` - POST /candidates/job - Search candidates by job
- `searchJobsByCandidate()` - POST /jobs/candidate - Search jobs by candidate
- `findSimilarCandidates()` - POST /candidates/similar - Find similar candidates
- `findSimilarJobs()` - POST /jobs/similar - Find similar jobs
- `buildCareerPath()` - POST /career/path - Build career path

### Calls
- `GraphSearchService.searchCandidatesByNeighborhood()`
- `GraphSearchService.searchJobsByNeighborhood()`
- `GraphSearchService.findSimilarCandidates()`
- `GraphSearchService.findSimilarJobs()`
- `GraphSearchService.searchCandidatesByCommunity()`

### Consumers
- Frontend search interface
- Job board clients

### Dependencies
- `GraphSearchService`
- `GraphQueryEngine`
- `GraphAnalyticsService`
- `CacheService`

---

# API Services (NestJS)

## CvService
**File:** `apps/api/src/cv/cv.service.ts`
**Type:** Injectable Service

### Imports
- `@nestjs/common`: Injectable
- `fs`: File system operations
- `pdf-parse`: PDF parsing
- `mammoth`: Word document parsing
- `NormalizationService`
- `RuntimeGraphService`

### Functions
- `processCv(file)` - Main CV processing pipeline
- `extractText(file)` - Extract text from PDF/Word
- `extractKnowledge(text)` - Extract structured knowledge
- `extractPersonalInfo(text)` - Extract personal information
- `extractExperiences(text)` - Extract work experiences
- `extractEducation(text)` - Extract education
- `extractSkills(text)` - Extract skills
- `extractCertifications(text)` - Extract certifications
- `extractLanguages(text)` - Extract languages
- `normalizeKnowledge(knowledge)` - Normalize with KP-001/KP-002
- `generateProfile(graph)` - Generate candidate profile
- `calculateOverallScore()` - Calculate profile score

### Calls
- `NormalizationService.normalizeKnowledge()`
- `RuntimeGraphService.importCV()`
- `pdf()` - PDF parsing library
- `mammoth.extractRawText()` - Word parsing library

### Consumers
- `CvController`

### Dependencies
- `NormalizationService`
- `RuntimeGraphService`

---

## CopilotService
**File:** `apps/api/src/copilot/copilot.service.ts`
**Type:** Injectable Service

### Imports
- `@nestjs/common`: Injectable
- `PromptInterpreterService`
- `ResponseBuilderService`
- `ConversationMemoryService`
- `GraphSearchService`
- `GraphMatchingService`
- `GraphReasoningEngine`
- `CacheService`
- Graph types

### Functions
- `processMessage(sessionId, message)` - Process chat message with intent handling
- `getConversationHistory(sessionId)` - Get conversation history
- `clearConversation(sessionId)` - Clear conversation
- `getAllSessions()` - Get all sessions
- `handleSearchCandidates(intent, context)` - Handle candidate search intent
- `handleSearchJobs(intent, context)` - Handle job search intent
- `handleExplainScore(intent, context)` - Handle score explanation intent
- `handleProposeTraining(intent, context)` - Handle training proposal intent
- `handleProposeEvolution(intent, context)` - Handle career evolution intent
- `createJobGraphFromIntent(intent)` - Create job graph from intent
- `createCandidateGraphFromIntent(intent)` - Create candidate graph from intent

### Calls
- `PromptInterpreter.interpret()`
- `GraphReasoningEngine.answerCandidateQuestion()`
- `GraphSearchService.searchCandidatesByNeighborhood()`
- `GraphSearchService.searchJobsByNeighborhood()`
- `GraphSearchService.searchCandidatesByCommunity()`
- `ConversationMemoryService.getOrCreateContext()`
- `ConversationMemoryService.addMessage()`
- `ConversationMemoryService.setLastSearchQuery()`
- `ConversationMemoryService.getLastReport()`
- `ResponseBuilderService.buildResponse()`
- `CacheService.get()`, `CacheService.set()`

### Consumers
- `CopilotController`

### Dependencies
- `PromptInterpreterService`
- `ResponseBuilderService`
- `ConversationMemoryService`
- `GraphSearchService`
- `GraphMatchingService`
- `GraphReasoningEngine`
- `CacheService`

---

## NormalizationService
**File:** `apps/api/src/cv/normalization.service.ts`
**Type:** Injectable Service

### Imports
- `@nestjs/common`: Injectable

### Functions
- `normalizeJob(jobTitle)` - Normalize job title using KP-001
- `normalizeSkill(skillName)` - Normalize skill using KP-002
- `normalizeKnowledge(knowledge)` - Normalize entire knowledge object

### Data
- KP-001 (Métiers) - French job titles with synonyms
- KP-002 (Compétences) - French skills with synonyms

### Consumers
- `CvService`

### Dependencies
- None (uses internal data)

---

# Web API Routes (Next.js)

## CV Analyze Route
**File:** `apps/web/src/app/api/cv/analyze/route.ts`
**Type:** Next.js API Route (POST)

### Imports
- `@/lib/db/client` - Supabase client
- `@/lib/authorization/AuthorizationV2` - Authorization
- Mistral AI SDK
- Prisma client
- BillingService

### Functions
- `POST()` - Main handler for CV analysis
  - User authentication via AuthorizationV2
  - Input validation
  - Billing credit check and reservation
  - Mistral LLM CV parsing
  - Prisma data persistence
  - HIIOS context initialization
  - Credit commitment/rollback

### Calls
- `AuthorizationV2.checkAccess()`
- `BillingService.reserveCredits()`
- `BillingService.commitCredits()`
- `BillingService.rollbackCredits()`
- `Mistral AI API` - CV parsing
- `prisma.cv.create()`
- `prisma.user.update()`
- `initializeHIIOSContext()`

### Middleware
- CSRF protection
- Rate limiting
- Authorization check

### Consumers
- Frontend CV analysis interface

### Dependencies
- Supabase client
- Prisma client
- Mistral AI SDK
- AuthorizationV2
- BillingService

---

## Stripe Webhook Route
**File:** `apps/web/src/app/api/stripe/webhook/route.ts`
**Type:** Next.js API Route (POST)

### Imports
- Stripe SDK
- Prisma client
- BillingService

### Functions
- `POST()` - Main webhook handler
  - Signature verification
  - Event type routing
  - Subscription management
  - Credit purchase handling

### Events Handled
- `checkout.session.completed` - Checkout completion
- `customer.subscription.created` - Subscription creation
- `customer.subscription.updated` - Subscription update
- `invoice.payment_succeeded` - Payment success
- `customer.subscription.deleted` - Subscription cancellation
- `invoice.payment_failed` - Payment failure

### Calls
- `stripe.webhooks.constructEvent()`
- `prisma.user.update()`
- `prisma.subscription.create()`
- `prisma.subscription.update()`
- `BillingService.refundCredits()`

### Consumers
- Stripe webhook system

### Dependencies
- Stripe SDK
- Prisma client
- BillingService

---

## Health Route
**File:** `apps/web/src/app/api/health/route.ts`
**Type:** Next.js API Route (GET)

### Imports
- Prisma client
- OpenAI SDK

### Functions
- `GET()` - Health check endpoint

### Checks
- Database connectivity (Prisma)
- OpenAI API key presence
- Redis (skipped)
- Application version
- Uptime
- Memory usage

### Calls
- `prisma.$queryRaw()`
- OpenAI key check

### Consumers
- Monitoring systems
- Load balancers

### Dependencies
- Prisma client
- OpenAI SDK

---

# Web Services (Next.js)

## InterviewService
**File:** `apps/web/src/lib/db/interview.service.ts`
**Type:** Service Object

### Imports
- `@/lib/db/client` - Supabase client
- ML scoring pipeline
- User behavioral memory
- Drift detection

### Functions
- `startSession()` - Start interview session
- `submitAnswer()` - Submit interview answer
- `appendTranscript()` - Append to transcript
- `completeSession()` - Complete session with ML pipeline
  - Feature engineering
  - ML scoring
  - Behavioral memory update
  - Drift detection
  - Decision graph evaluation

### Calls
- Supabase RPC functions
- ML scoring pipeline
- User behavioral memory
- Drift detection system

### Consumers
- Interview interface
- ML evaluation system

### Dependencies
- Supabase client
- ML pipeline
- Behavioral memory system

---

## BillingService
**File:** `apps/web/src/lib/db/billing.service.ts`
**Type:** Service Object

### Imports
- `@/lib/db/client` - Supabase client
- `@/lib/db/user.service` - UserService
- `@/domain/billing.contract` - Billing contracts
- `@/lib/db/validators/billing.validator` - Validators
- `@/lib/logger/Logger` - Logger

### Functions
- `spendCredits(op, dbClient)` - Spend credits atomically
- `reserveCredits(op, dbClient)` - Reserve credits (2PC)
- `commitCredits(txId, tokensUsed, dbClient)` - Commit reserved credits
- `rollbackCredits(txId, reason, dbClient)` - Rollback reserved credits
- `refundCredits(op, dbClient)` - Refund/add credits
- `getBalance(userId, dbClient)` - Get user balance
- `hasEnoughBalance(userId, required, dbClient)` - Check balance
- `getLedger(userId, dbClient)` - Get credit usage audit trail

### Database RPC Calls
- `deduct_credits_atomic()` - Atomic credit deduction
- `reserve_credits_atomic()` - Atomic credit reservation
- `commit_credits_atomic()` - Atomic credit commit
- `rollback_credits_atomic()` - Atomic credit rollback
- `add_credits_atomic()` - Atomic credit addition

### Consumers
- CV Analyze Route
- Stripe Webhook Route
- Any billing-dependent operations

### Dependencies
- Supabase client
- UserService
- Billing validators

---

## BaseRepository
**File:** `apps/web/src/lib/db/base.repository.ts`
**Type:** Generic Repository Class

### Imports
- `@supabase/supabase-js` - SupabaseClient

### Functions
- `findById(id)` - Find by ID
- `findMany(filters)` - Find many with filters
- `insert(payload)` - Insert record
- `update(id, payload)` - Update record
- `delete(id)` - Delete record

### Consumers
- All repository subclasses
- Data access layer

### Dependencies
- Supabase client

---

# Graph Runtime Services

## RuntimeGraphService
**File:** `apps/api/src/runtime/kg/runtime-graph.service.ts`
**Type:** Injectable Service

### Imports
- `EntityNormalizerService`
- `NodeFusionService`
- `EdgeBuilderService`
- Graph builders (SkillBuilder, ExperienceBuilder, etc.)
- `GraphValidatorService`
- `GraphRepository`
- Graph types

### Functions
- `importCV(cvData, options)` - Import CV and build knowledge graph
- `importJob(jobData, options)` - Import job and build knowledge graph
- `buildNodesFromCV(cvData, options)` - Build nodes from CV
- `buildEdgesFromCV(cvData, nodes, options)` - Build edges from CV
- `buildNodesFromJob(jobData, options)` - Build nodes from job
- `buildEdgesFromJob(jobData, nodes, options)` - Build edges from job
- `createCandidateNode(cvData, source)` - Create candidate node
- `createJobNode(jobData, source)` - Create job node

### Calls
- `EntityNormalizerService.normalizeLabel()`
- `NodeFusionService.fuseNodes()`
- `EdgeBuilderService.buildEdges()`
- `GraphValidatorService.validate()`
- `GraphRepository.createGraph()`
- `GraphRepository.updateGraph()`
- `GraphRepository.createNodes()`
- `GraphRepository.createEdges()`
- `GraphRepository.createVersion()`
- All builder classes

### Consumers
- `CvService`
- Job import pipeline

### Dependencies
- `EntityNormalizerService`
- `NodeFusionService`
- `EdgeBuilderService`
- `GraphValidatorService`
- `GraphRepository`
- All builder classes

---

## GraphMatchingService
**File:** `apps/api/src/runtime/kg/graph-matching.service.ts`
**Type:** Injectable Service

### Imports
- `GraphQueryEngine`
- `GraphAnalyticsService`
- `CacheService`
- Graph types

### Functions
- `calculateMatchScore(candidateGraph, jobGraph)` - Calculate matching score
- `explainMatch(candidateGraph, jobGraph)` - Explain match reasoning
- `generateMatchReport(candidateGraph, jobGraph)` - Generate detailed report

### Scoring Components
- Skills score
- Experience score
- Education score
- Location score
- Transferability score
- Overall score

### Insights Generated
- Strengths
- Weaknesses
- Recommendations

### Calls
- `GraphQueryEngine.findNeighbors()`
- `GraphAnalyticsService.calculateCentrality()`
- `GraphAnalyticsService.calculateTransferability()`
- `CacheService.get()`, `CacheService.set()`

### Consumers
- `MatchingController`
- `CopilotService`

### Dependencies
- `GraphQueryEngine`
- `GraphAnalyticsService`
- `CacheService`

---

## GraphSearchService
**File:** `apps/api/src/runtime/kg/graph-search.service.ts`
**Type:** Injectable Service

### Imports
- `GraphQueryEngine`
- `GraphAnalyticsService`
- `CacheService`
- Graph types

### Functions
- `searchCandidatesByNeighborhood(jobGraph, candidateGraphs, options)` - Neighborhood search
- `searchJobsByNeighborhood(candidateGraph, jobGraphs, options)` - Neighborhood search
- `searchCandidatesBySimilarity(jobGraph, candidateGraphs, options)` - Similarity search
- `searchJobsBySimilarity(candidateGraph, jobGraphs, options)` - Similarity search
- `findSimilarCandidates(candidateGraph, candidateGraphs, options)` - Find similar candidates
- `findSimilarJobs(jobGraph, jobGraphs, options)` - Find similar jobs
- `searchCandidatesByCommunity(targetGraph, candidateGraphs, options)` - Community search
- `searchJobsByCommunity(targetGraph, jobGraphs, options)` - Community search

### Search Algorithms
- Neighborhood overlap
- Graph distance
- Jaccard similarity
- Cosine similarity
- Skill overlap
- Community detection

### Calls
- `GraphQueryEngine.findNeighbors()`
- `GraphAnalyticsService.findCommunities()`
- `CacheService.get()`, `CacheService.set()`

### Consumers
- `SearchController`
- `CopilotService`

### Dependencies
- `GraphQueryEngine`
- `GraphAnalyticsService`
- `CacheService`

---

## GraphReasoningEngine
**File:** `apps/api/src/runtime/kg/graph-reasoning-engine.service.ts`
**Type:** Injectable Service

### Imports
- `GraphQueryEngine`
- `GraphAnalyticsService`
- Graph types

### Functions
- `answerCandidateQuestion(graph, question)` - Answer candidate question
- `answerJobQuestion(graph, question)` - Answer job question
- `compareCandidateToJob(candidateGraph, jobGraph)` - Compare candidate to job

### Reasoning Steps
- Parse question and identify node types
- Query graph for relevant nodes
- Traverse edges to find relationships
- Make inferences based on graph structure
- Generate final conclusion with citations

### Output
- Explanation with summary
- Detailed explanation with reasoning trace
- Evidence with supporting nodes and edges
- Confidence scores

### Calls
- `GraphQueryEngine.findNeighbors()`
- `GraphAnalyticsService` (for analytics)

### Consumers
- `CopilotService`

### Dependencies
- `GraphQueryEngine`
- `GraphAnalyticsService`

---

## GraphRepository
**File:** `apps/api/src/runtime/kg/graph-repository.service.ts`
**Type:** Injectable Service

### Imports
- Prisma client
- `CacheService`
- Graph types

### Functions
- `createGraph(input)` - Create new graph
- `getGraphById(id, filter)` - Get graph by ID
- `updateGraph(id, input)` - Update graph
- `softDeleteGraph(id)` - Soft delete graph
- `hardDeleteGraph(id)` - Hard delete graph
- `restoreGraph(id)` - Restore soft-deleted graph
- `listGraphs(filter, skip, take)` - List graphs
- `createNodes(graphId, nodes)` - Create nodes
- `getNodesByGraphId(graphId, filter)` - Get nodes
- `updateNode(id, updates)` - Update node
- `softDeleteNode(id)` - Soft delete node
- `deleteNodesByGraphId(graphId)` - Delete nodes by graph
- `createEdges(graphId, edges)` - Create edges
- `getEdgesByGraphId(graphId, filter)` - Get edges
- `updateEdge(id, updates)` - Update edge
- `softDeleteEdge(id)` - Soft delete edge
- `deleteEdgesByGraphId(graphId)` - Delete edges by graph
- `createVersion(graphId, input)` - Create graph version
- `getVersionsByGraphId(graphId)` - Get versions
- `getVersion(graphId, version)` - Get specific version
- `rollbackToVersion(graphId, version)` - Rollback to version
- `createSnapshot(graphId, input)` - Create snapshot
- `getSnapshotsByGraphId(graphId)` - Get snapshots
- `getSnapshot(snapshotId)` - Get specific snapshot
- `restoreFromSnapshot(snapshotId)` - Restore from snapshot
- `transaction(callback)` - Execute transaction

### Database Tables
- `Graph` - Main graph table
- `GraphNode` - Node table
- `GraphEdge` - Edge table
- `GraphVersion` - Version table
- `GraphSnapshot` - Snapshot table

### Calls
- Prisma CRUD operations
- `CacheService.get()`, `CacheService.set()`, `CacheService.del()`

### Consumers
- `RuntimeGraphService`
- `MatchingController`
- All graph-dependent services

### Dependencies
- Prisma client
- `CacheService`

---

# Authorization & Security

## AuthorizationV2
**File:** `apps/web/src/lib/authorization/AuthorizationV2.ts`
**Type:** Authorization System

### Enums
- `AccessLevel` - PUBLIC, AUTHENTICATED, SUBSCRIBER, PREMIUM, ADMIN
- `UserRole` - USER, RECRUITER, ADMIN
- `SubscriptionPlan` - FREE, BASIC, PRO, ENTERPRISE

### Functions
- `checkAccess(userContext, requiredAccess)` - Check access level
- `checkRouteAccess(routeRule, userContext)` - Check route access
- `defineRouteRule(path, accessLevel, roles, plans)` - Define route rule
- `protectRoute(handler, rule)` - Protect route with authorization

### Decorators
- `@RequireAccess(level)` - Require access level
- `@RequireRole(role)` - Require role
- `@RequireSubscription(plan)` - Require subscription

### Consumers
- All web API routes
- Frontend route guards

### Dependencies
- User context
- Subscription system

---

# Database & Repositories

## Prisma Schema
**File:** `prisma/schema.prisma`
**Type:** Database Schema

### Key Tables
- `User` - User accounts
- `CV` - CV records
- `Subscription` - User subscriptions
- `CreditTransaction` - Credit transactions
- `CreditUsage` - Credit usage audit log
- `Graph` - Knowledge graphs
- `GraphNode` - Graph nodes
- `GraphEdge` - Graph edges
- `GraphVersion` - Graph versions
- `GraphSnapshot` - Graph snapshots
- `InterviewSession` - Interview sessions

### Consumers
- All services
- API routes

---

## Supabase Integration
**File:** `apps/web/src/lib/db/client.ts`
**Type:** Database Client

### Functions
- `getServerDb()` - Get Supabase client for server-side
- `getClientDb()` - Get Supabase client for client-side

### RPC Functions
- `deduct_credits_atomic()` - Atomic credit deduction
- `reserve_credits_atomic()` - Atomic credit reservation
- `commit_credits_atomic()` - Atomic credit commit
- `rollback_credits_atomic()` - Atomic credit rollback
- `add_credits_atomic()` - Atomic credit addition

### Consumers
- All web services
- API routes

---

# Summary Statistics

## Total Components
- **Controllers:** 4 (NestJS)
- **Services:** 10+ (NestJS + Next.js)
- **API Routes:** 3 (Next.js)
- **Graph Services:** 5
- **Authorization:** 1 system
- **Database:** 2 (Prisma + Supabase)

## Key Architectural Patterns
1. **NestJS API** - REST controllers with dependency injection
2. **Next.js Web** - API routes with server-side rendering
3. **Graph Runtime** - Knowledge graph processing and matching
4. **Authorization** - Centralized access control with decorators
5. **Billing** - 2PC credit system with idempotency
6. **Caching** - Redis-based caching for performance
7. **Repository Pattern** - Generic base repository for data access

## Integration Points
- **CV Processing:** CvController → CvService → RuntimeGraphService → GraphRepository
- **Matching:** MatchingController → GraphMatchingService → GraphQueryEngine
- **Search:** SearchController → GraphSearchService → GraphAnalyticsService
- **Copilot:** CopilotController → CopilotService → GraphReasoningEngine
- **Billing:** API routes → BillingService → Supabase RPC
- **Authorization:** All routes → AuthorizationV2 → User context

## External Dependencies
- **Mistral AI** - CV parsing and analysis
- **Stripe** - Payment processing
- **OpenAI** - AI model integration
- **Supabase** - Database and auth
- **Prisma** - ORM for API
- **Redis** - Caching layer

---

*End of RC3-COMPONENTS.md*
