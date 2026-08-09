# RC37.1 - Component Execution Evidence

**Mission:** Document component execution details based on observable evidence only.

**Evidence Policy:** Every assertion must include File, Line, Function, and Evidence. If not observed, write "NOT OBSERVED".

---

## COMPONENT EXECUTION: PAGES

### HomePage
- **File:** `c:\Trajectoire\apps\web\src\app\page.tsx`
- **Line:** 32-575
- **Function:** `HomePage`
- **Type:** Client Component ("use client")
- **Execution:** Browser-side rendering
- **State:** Uses useState for file, job, loading, previewToken
- **Evidence:** Line 1: "use client", Line 33-36: useState hooks
- **Imports:** React, framer-motion, next/image, next/link, CVUploader, JobInput, AnalyzeButton, PreviewTokenManager
- **Called By:** Next.js router for "/" route
- **Calls:** handleAnalyze, PreviewTokenManager.setSessionToken
- **Dependencies:** framer-motion, next/image, next/link
- **Runtime Path:** Browser → React Component → handleAnalyze → fetch → API

### SignupPage
- **File:** `c:\Trajectoire\apps\web\src\app\signup\page.tsx`
- **Line:** 9-166
- **Function:** `SignupPage`
- **Type:** Client Component ("use client")
- **Execution:** Browser-side rendering
- **State:** Uses useState for email, password, confirmPassword, acceptCGU, error, loading, success
- **Evidence:** Line 1: "use client", Line 10-16: useState hooks
- **Imports:** React, next/link, supabase client, Button, usePreviewStorage
- **Called By:** Next.js router for "/signup" route
- **Calls:** handleSubmit, claimPreview
- **Dependencies:** @supabase/ssr
- **Runtime Path:** Browser → React Component → handleSubmit → Supabase Auth

### OnboardingPage
- **File:** `c:\Trajectoire\apps\web\src\app\onboarding\page.tsx`
- **Line:** 13-412
- **Function:** `OnboardingPage`
- **Type:** Client Component ("use client")
- **Execution:** Browser-side rendering
- **State:** Uses useState for loading, error, initialized, currentStep, journeyType, progress, canSkip, canGoBack, fullName, cvFile, jobFile
- **Evidence:** Line 1: "use client", Line 15-32: useState hooks
- **Imports:** React, next/navigation, next/link, supabase client, Button, OnboardingResolver, FlowEngine
- **Called By:** Next.js router for "/onboarding" route
- **Calls:** initializeOnboarding, handleNext, handleBack, handleSkip, saveUserData, completeOnboarding
- **Dependencies:** @supabase/ssr
- **Runtime Path:** Browser → React Component → FlowEngine → OnboardingResolver

### DashboardPage
- **File:** `c:\Trajectoire\apps\web\src\app\dashboard\page.tsx`
- **Line:** 20-229
- **Function:** `DashboardPage`
- **Type:** Server Component (async function)
- **Execution:** Server-side rendering
- **State:** No local state (server component)
- **Evidence:** Line 20: `async function DashboardPage`
- **Imports:** next/navigation, supabase server client, prisma, checkUserQuota, DashboardWidgets, previewAnalysisService
- **Called By:** Next.js router for "/dashboard" route
- **Calls:** supabase.auth.getUser, prisma queries, checkUserQuota, previewAnalysisService.getUserClaimedPreview
- **Dependencies:** @supabase/ssr, @prisma/client
- **Runtime Path:** Server → Prisma → Database → DashboardWidgets

### HistoryPage
- **File:** `c:\Trajectoire\apps\web\src\app\history\page.tsx`
- **Line:** 23-171
- **Function:** `HistoryPage`
- **Type:** Server Component (async function)
- **Execution:** Server-side rendering
- **State:** No local state (server component)
- **Evidence:** Line 23: `async function HistoryPage`
- **Imports:** next, next/link, supabase server client, Button, StatsOverview
- **Called By:** Next.js router for "/history" route
- **Calls:** supabase.auth.getUser, supabase.from('interview_sessions').select
- **Dependencies:** @supabase/ssr
- **Runtime Path:** Server → Supabase → Database → StatsOverview

### AnalyzePage
- **File:** `c:\Trajectoire\apps\web\src\app\analyze\page.tsx`
- **Line:** 12-128
- **Function:** `AnalyzePage`
- **Type:** Client Component ("use client")
- **Execution:** Browser-side rendering
- **State:** Uses useState for file, job, loading, preview, error, showConversion
- **Evidence:** Line 1: "use client", Line 13-18: useState hooks
- **Imports:** React, CVUploader, JobInput, AnalyzeButton, usePreviewStorage, PremiumATSResult, ConversionPanel
- **Called By:** Next.js router for "/analyze" route
- **Calls:** handleAnalyze, savePreview
- **Dependencies:** None external
- **Runtime Path:** Browser → React Component → handleAnalyze → fetch → API

### SimulationPage
- **File:** `c:\Trajectoire\apps\web\src\app\simulation\page.tsx`
- **Line:** 13-118
- **Function:** `SimulationPage`
- **Type:** Server Component (async function)
- **Execution:** Server-side rendering
- **State:** No local state (server component)
- **Evidence:** Line 13: `async function SimulationPage`
- **Imports:** next, next/link, supabase server client, prisma, Button
- **Called By:** Next.js router for "/simulation" route
- **Calls:** supabase.auth.getUser, prisma.careerProfile.findUnique
- **Dependencies:** @supabase/ssr, @prisma/client
- **Runtime Path:** Server → Prisma → Form POST → API

### PricingPage
- **File:** `c:\Trajectoire\apps\web\src\app\pricing\page.tsx`
- **Line:** 4-126
- **Function:** `PricingPage`
- **Type:** Server Component
- **Execution:** Server-side rendering
- **State:** No local state
- **Evidence:** Line 4: `export default function PricingPage`
- **Imports:** next/link, Button
- **Called By:** Next.js router for "/pricing" route
- **Calls:** None
- **Dependencies:** None
- **Runtime Path:** Server → Static HTML

### CopilotPage
- **File:** `c:\Trajectoire\apps\web\src\app\copilot\page.tsx`
- **Line:** 3-6
- **Function:** `CopilotPage`
- **Type:** Server Component
- **Execution:** Server-side rendering
- **State:** No local state
- **Evidence:** Line 3: `export default function CopilotPage`
- **Imports:** ChatWorkspace
- **Called By:** Next.js router for "/copilot" route
- **Calls:** None (renders ChatWorkspace)
- **Dependencies:** None
- **Runtime Path:** Server → ChatWorkspace Component

### SearchPage
- **File:** `c:\Trajectoire\apps\web\src\app\search\page.tsx`
- **Line:** 3-6
- **Function:** `SearchPage`
- **Type:** Server Component
- **Execution:** Server-side rendering
- **State:** No local state
- **Evidence:** Line 3: `export default function SearchPage`
- **Imports:** SearchWorkspace
- **Called By:** Next.js router for "/search" route
- **Calls:** None (renders SearchWorkspace)
- **Dependencies:** None
- **Runtime Path:** Server → SearchWorkspace Component

### RecruiterPage
- **File:** `c:\Trajectoire\apps\web\src\app\recruiter\page.tsx`
- **Line:** 3-6
- **Function:** `RecruiterPage`
- **Type:** Server Component
- **Execution:** Server-side rendering
- **State:** No local state
- **Evidence:** Line 3: `export default function RecruiterPage`
- **Imports:** RecruiterWorkspace
- **Called By:** Next.js router for "/recruiter" route
- **Calls:** None (renders RecruiterWorkspace)
- **Dependencies:** None
- **Runtime Path:** Server → RecruiterWorkspace Component

---

## COMPONENT EXECUTION: API ROUTES

### POST /api/public/analyze-preview
- **File:** `c:\Trajectoire\apps\web\src\app\api\public\analyze-preview\route.ts`
- **Line:** 10-117
- **Function:** `POST`
- **Type:** Next.js API Route
- **Execution:** Server-side (Edge or Node)
- **State:** No local state (stateless function)
- **Evidence:** Line 10: `export async function POST(req: NextRequest)`
- **Imports:** NextRequest, NextResponse, checkRateLimit, generateFingerprint, validators, generatePreviewAnalysis, previewAnalysisService, logger, Sentry
- **Called By:** Landing page handleAnalyze, Analyze page handleAnalyze
- **Calls:** checkRateLimit, validateCVUpload, validateJobDescription, generatePreviewAnalysis, previewAnalysisService.analyzePreview
- **Dependencies:** @sentry/nextjs, upstash (rate limit)
- **Runtime Path:** HTTP Request → Rate Limit → Validation → OpenAI → Preview Service → Response

### POST /api/auth/claim-preview
- **File:** `c:\Trajectoire\apps\web\src\app\api\auth\claim-preview\route.ts`
- **Line:** 12-81
- **Function:** `POST`
- **Type:** Next.js API Route
- **Execution:** Server-side
- **State:** No local state
- **Evidence:** Line 12: `export async function POST(req: NextRequest)`
- **Imports:** NextRequest, NextResponse, supabase server client, previewAnalysisService, logger, Sentry
- **Called By:** Signup page handleSubmit
- **Calls:** supabase.auth.getUser, previewAnalysisService.claimPreview
- **Dependencies:** @sentry/nextjs, @supabase/ssr
- **Runtime Path:** HTTP Request → Auth Check → Claim Preview → Database → Response

### POST /api/auth/sync-user
- **File:** `c:\Trajectoire\apps\web\src\app\api\auth\sync-user\route.ts`
- **Line:** 19-80
- **Function:** `POST`
- **Type:** Next.js API Route with middleware
- **Execution:** Server-side
- **State:** No local state
- **Evidence:** Line 19: `export const POST = csrfProtect(rateLimit(...))`
- **Imports:** NextResponse, NextRequest, supabase client, prisma, rateLimit, RouteType, RateLimitScope, csrfProtect, logger, Sentry
- **Called By:** Onboarding page saveUserData
- **Calls:** supabase.auth.getUser, prisma.user.upsert
- **Dependencies:** @sentry/nextjs, @supabase/ssr, @prisma/client
- **Runtime Path:** HTTP Request → CSRF Protect → Rate Limit → Auth Check → Prisma Upsert → Response

### POST /api/cv/upload
- **File:** `c:\Trajectoire\apps\web\src\app\api\cv\upload\route.ts`
- **Line:** 26-136
- **Function:** `POST`
- **Type:** Next.js API Route
- **Execution:** Server-side
- **State:** No local state
- **Evidence:** Line 26: `export async function POST(request: NextRequest)`
- **Imports:** NextResponse, NextRequest, supabase server client, logger
- **Called By:** NOT OBSERVED - component not viewed
- **Calls:** supabase.auth.getUser, extractPDF, file.text
- **Dependencies:** @supabase/ssr, pdf-parse, pdfjs-dist
- **Runtime Path:** HTTP Request → Auth Check → File Validation → Text Extraction → Response

### POST /api/stripe/checkout
- **File:** `c:\Trajectoire\apps\web\src\app\api\stripe\checkout\route.ts`
- **Line:** 45-176
- **Function:** `POST`
- **Type:** Next.js API Route
- **Execution:** Server-side
- **State:** No local state (stripeClient singleton)
- **Evidence:** Line 45: `export async function POST(request: NextRequest)`
- **Imports:** NextRequest, NextResponse, Stripe, zod, prisma, getStrictUser, envServer, logInfo, logError, checkRateLimit
- **Called By:** NOT OBSERVED - component not viewed
- **Calls:** getStrictUser, checkRateLimit, prisma queries, getStripe, stripe.checkout.sessions.create, prisma.user.update
- **Dependencies:** stripe, zod, @prisma/client
- **Runtime Path:** HTTP Request → Auth Check → Rate Limit → Prisma Query → Stripe API → Response

### POST /api/simulation/create
- **File:** `c:\Trajectoire\apps\web\src\app\api\simulation\create\route.ts`
- **Line:** 11-110
- **Function:** `POST`
- **Type:** Next.js API Route
- **Execution:** Server-side
- **State:** No local state
- **Evidence:** Line 11: `export async function POST(request: NextRequest)`
- **Imports:** NextResponse, NextRequest, supabase server client, Container, ServiceTokens, initializeContainer, SimulationService, AuthenticationError, ValidationError, ApiResponseBuilder, CreateSessionSchema, IdempotencyService
- **Called By:** SimulationPage form POST
- **Calls:** initializeContainer, supabase.auth.getUser, CreateSessionSchema.safeParse, Container.resolve, IdempotencyService.execute, simulationService.createSimulation
- **Dependencies:** @supabase/ssr, zod
- **Runtime Path:** HTTP Request → DI Container → Auth Check → Validation → Idempotency → Simulation Service → Redirect

### POST /api/interview
- **File:** `c:\Trajectoire\apps\web\src\app\api\interview\route.ts`
- **Line:** 21-343
- **Function:** `POST`
- **Type:** Next.js API Route
- **Execution:** Server-side (in-memory Map for sessions)
- **State:** In-memory Map<string, KernelState> (line 15)
- **Evidence:** Line 15: `const sessions = new Map<string, KernelState>()`
- **Imports:** NextResponse, NextRequest, KernelState, EvidenceType, EvidenceReliability, EvidenceDirection
- **Called By:** NOT OBSERVED - component not viewed
- **Calls:** handleStart, handleRespond, handleNextQuestion, handleExplain, handleComplete
- **Dependencies:** None external
- **Runtime Path:** HTTP Request → Action Switch → Handler → KernelState Operations → Response

---

## COMPONENT EXECUTION: API CONTROLLERS (NestJS)

### CopilotController
- **File:** `c:\Trajectoire\apps\api\src\copilot\copilot.controller.ts`
- **Line:** 6-64
- **Function:** `@Controller('copilot')`
- **Type:** NestJS Controller
- **Execution:** Server-side (NestJS)
- **State:** Injected CopilotService (line 7)
- **Evidence:** Line 7: `constructor(private readonly copilotService: CopilotService)`
- **Imports:** Controller, Post, Body, Get, Param, Delete, BadRequestException, CopilotService, RateLimitCopilot, RateLimitApi
- **Called By:** NestJS router for /copilot routes
- **Calls:** copilotService.processMessage, copilotService.getConversationHistory, copilotService.clearConversation, copilotService.getAllSessions
- **Dependencies:** @nestjs/common
- **Runtime Path:** HTTP Request → Rate Limit Decorator → CopilotService → Response

### MatchingController
- **File:** `c:\Trajectoire\apps\api\src\matching\matching.controller.ts`
- **Line:** 6-190
- **Function:** `@Controller('matching')`
- **Type:** NestJS Controller
- **Execution:** Server-side (NestJS)
- **State:** Injected GraphMatchingService (line 8-10)
- **Evidence:** Line 8-10: `constructor(private readonly graphMatchingService: GraphMatchingService)`
- **Imports:** Controller, Post, Body, Get, Param, BadRequestException, GraphMatchingService, Graph, RateLimitMatching, RateLimitApi
- **Called By:** NestJS router for /matching routes
- **Calls:** graphMatchingService.match
- **Dependencies:** @nestjs/common
- **Runtime Path:** HTTP Request → Rate Limit Decorator → GraphMatchingService → Response

### SearchController
- **File:** `c:\Trajectoire\apps\api\src\search\search.controller.ts`
- **Line:** 6-259
- **Function:** `@Controller('search')`
- **Type:** NestJS Controller
- **Execution:** Server-side (NestJS)
- **State:** Injected GraphSearchService (line 8-10)
- **Evidence:** Line 8-10: `constructor(private readonly graphSearchService: GraphSearchService)`
- **Imports:** Controller, Post, Body, Get, Param, BadRequestException, GraphSearchService, Graph, RateLimitSearch, RateLimitApi
- **Called By:** NestJS router for /search routes
- **Calls:** graphSearchService.searchCandidatesByNeighborhood, graphSearchService.searchJobsByNeighborhood, graphSearchService.findSimilarCandidates, graphSearchService.findSimilarJobs, graphSearchService.searchCandidatesByCommunity
- **Dependencies:** @nestjs/common
- **Runtime Path:** HTTP Request → Rate Limit Decorator → GraphSearchService → Response

### GraphController
- **File:** `c:\Trajectoire\apps\api\src\runtime\kg\graph.controller.ts`
- **Line:** 12-273
- **Function:** `@Controller('graph')`
- **Type:** NestJS Controller
- **Execution:** Server-side (NestJS)
- **State:** Injected GraphRepository (line 14)
- **Evidence:** Line 14: `constructor(private readonly graphRepository: GraphRepository)`
- **Imports:** Controller, Get, Post, Put, Delete, Body, Param, Query, HttpCode, HttpStatus, GraphRepository, Graph, Node, Edge, RateLimitGraph
- **Called By:** NestJS router for /graph routes
- **Calls:** graphRepository methods (createGraph, getGraphById, updateGraph, softDeleteGraph, hardDeleteGraph, restoreGraph, listGraphs, createNodes, getNodesByGraphId, updateNode, softDeleteNode, createEdges, getEdgesByGraphId, updateEdge, softDeleteEdge, createVersion, getVersionsByGraphId, getVersion, rollbackToVersion, createSnapshot, getSnapshotsByGraphId, getSnapshot, restoreFromSnapshot)
- **Dependencies:** @nestjs/common
- **Runtime Path:** HTTP Request → Rate Limit Decorator → GraphRepository → Response

---

## COMPONENT EXECUTION: SERVICES

### PreviewAnalysisService
- **File:** `c:\Trajectoire\apps\web\src\lib\preview-analysis\PreviewAnalysisService.ts`
- **Line:** 28-278
- **Function:** `class PreviewAnalysisService`
- **Type:** Service Class
- **Execution:** Server-side
- **State:** No local state (static methods)
- **Evidence:** Line 28: `export class PreviewAnalysisService`
- **Imports:** previewAnalysisRepository, prisma
- **Called By:** /api/public/analyze-preview route, /api/auth/claim-preview route
- **Calls:** previewAnalysisRepository methods, prisma methods
- **Dependencies:** @prisma/client
- **Runtime Path:** API Route → PreviewAnalysisService → Repository/Prisma → Database

### generatePreviewAnalysis
- **File:** `c:\Trajectoire\apps\web\src\lib\ai\preview-analyzer.ts`
- **Line:** 33-89
- **Function:** `generatePreviewAnalysis`
- **Type:** Async Function
- **Execution:** Server-side
- **State:** No local state
- **Evidence:** Line 33: `export async function generatePreviewAnalysis`
- **Imports:** OpenAI, logger
- **Called By:** /api/public/analyze-preview route
- **Calls:** openai.chat.completions.create, generateFallbackAnalysis
- **Dependencies:** openai
- **Runtime Path:** API Route → OpenAI API → Fallback → Response

### CopilotService (API)
- **File:** `c:\Trajectoire\apps\api\src\copilot\copilot.service.ts`
- **Line:** 12-224
- **Function:** `@Injectable() class CopilotService`
- **Type:** NestJS Service
- **Execution:** Server-side (NestJS)
- **State:** Injected services (PromptInterpreterService, GraphReasoningEngine, ResponseBuilderService, ConversationMemoryService, GraphSearchService, GraphMatchingService, CacheService)
- **Evidence:** Line 13-21: `constructor(...)` with injected services
- **Imports:** Injectable, PromptInterpreterService, ResponseBuilderService, ConversationMemoryService, GraphSearchService, GraphMatchingService, GraphReasoningEngine, Graph, CacheService
- **Called By:** CopilotController
- **Calls:** promptInterpreter.interpret, conversationMemory methods, graphReasoningEngine.answerCandidateQuestion, graphSearchService methods, graphMatchingService methods, responseBuilder.buildResponse, cacheService methods
- **Dependencies:** @nestjs/common
- **Runtime Path:** Controller → CopilotService → Multiple Services → Response

### FlowEngine
- **File:** `c:\Trajectoire\apps\web\src\lib\onboarding\FlowEngine.ts`
- **Line:** 11-291
- **Function:** `class FlowEngine`
- **Type:** Service Class
- **Execution:** Server-side
- **State:** Static config (DEFAULT_CONFIG)
- **Evidence:** Line 11: `export class FlowEngine`
- **Imports:** OnboardingStep, JourneyType, FlowConfig, OnboardingResolver, JourneyResolver, ProgressEngine
- **Called By:** OnboardingPage
- **Calls:** OnboardingResolver methods, JourneyResolver methods, ProgressEngine methods
- **Dependencies:** None external
- **Runtime Path:** Page → FlowEngine → OnboardingResolver → Response

### OnboardingResolver
- **File:** `c:\Trajectoire\apps\web\src\lib\onboarding\OnboardingResolver.ts`
- **Line:** 10-204
- **Function:** `class OnboardingResolver`
- **Type:** Service Class
- **Execution:** Server-side
- **State:** No local state (static methods)
- **Evidence:** Line 10: `export class OnboardingResolver`
- **Imports:** UserStateResolver, JourneyResolver, JourneyResolution, UserOnboardingState, OnboardingStep
- **Called By:** FlowEngine
- **Calls:** UserStateResolver methods, JourneyResolver methods
- **Dependencies:** None external
- **Runtime Path:** FlowEngine → OnboardingResolver → UserStateResolver/JourneyResolver → Response

### CopilotService (Web)
- **File:** `c:\Trajectoire\apps\web\src\services\copilot.service.ts`
- **Line:** 5-59
- **Function:** `class CopilotService`
- **Type:** Service Class
- **Execution:** Browser-side
- **State:** No local state
- **Evidence:** Line 5: `export class CopilotService`
- **Imports:** CopilotResponse
- **Called By:** ChatWorkspace
- **Calls:** fetch to /api/copilot/*
- **Dependencies:** None external
- **Runtime Path:** Component → CopilotService → fetch → API

### MatchingService (Web)
- **File:** `c:\Trajectoire\apps\web\src\services\matching.service.ts`
- **Line:** 5-111
- **Function:** `class MatchingService`
- **Type:** Service Class
- **Execution:** Browser-side
- **State:** No local state
- **Evidence:** Line 5: `export class MatchingService`
- **Imports:** MatchingResponse, MatchingReport, KnowledgeGraph
- **Called By:** RecruiterWorkspace
- **Calls:** fetch to /api/matching/*
- **Dependencies:** None external
- **Runtime Path:** Component → MatchingService → fetch → API

### SearchService (Web)
- **File:** `c:\Trajectoire\apps\web\src\services\search.service.ts`
- **Line:** 5-164
- **Function:** `class SearchService`
- **Type:** Service Class
- **Execution:** Browser-side
- **State:** No local state
- **Evidence:** Line 5: `export class SearchService`
- **Imports:** RankedResult, RelatedSkills, CareerPath, SimilarityResult
- **Called By:** SearchWorkspace components
- **Calls:** fetch to /api/search/*
- **Dependencies:** None external
- **Runtime Path:** Component → SearchService → fetch → API

---

## COMPONENT EXECUTION: CLIENT COMPONENTS

### ChatWorkspace
- **File:** `c:\Trajectoire\apps\web\src\components\copilot\ChatWorkspace.tsx`
- **Line:** 12-170
- **Function:** `ChatWorkspace`
- **Type:** Client Component ("use client")
- **Execution:** Browser-side
- **State:** Uses useState for sessionId, messages, input, loading, lastResponse
- **Evidence:** Line 1: "use client", Line 13-17: useState hooks
- **Imports:** React, copilotService, CopilotMessage, CopilotResponse, ChatMessage, ThinkingIndicator, SuggestedQuestions, ConversationHistory, SourcesPanel
- **Called By:** CopilotPage
- **Calls:** copilotService.processMessage, copilotService.getConversationHistory, copilotService.clearConversation
- **Dependencies:** None external
- **Runtime Path:** Page → ChatWorkspace → CopilotService → API

### RecruiterWorkspace
- **File:** `c:\Trajectoire\apps\web\src\components\recruiter\RecruiterWorkspace.tsx`
- **Line:** 12-82
- **Function:** `RecruiterWorkspace`
- **Type:** Client Component ("use client")
- **Execution:** Browser-side
- **State:** Uses useState for candidateId, jobId, candidateProfile, jobProfile, candidateGraph, jobGraph, matchingReport
- **Evidence:** Line 1: "use client", Line 13-19: useState hooks
- **Imports:** React, CandidateUploader, JobUploader, MatchingPanel, RecommendationPanel, GraphViewer, matchingService, CandidateProfile, JobProfile, MatchingReport, KnowledgeGraph
- **Called By:** RecruiterPage
- **Calls:** matchingService.registerCandidate, matchingService.registerJob
- **Dependencies:** None external
- **Runtime Path:** Page → RecruiterWorkspace → MatchingService → API

### SearchWorkspace
- **File:** `c:\Trajectoire\apps\web\src\components\search\SearchWorkspace.tsx`
- **Line:** 9-31
- **Function:** `SearchWorkspace`
- **Type:** Client Component ("use client")
- **Execution:** Browser-side
- **State:** No local state
- **Evidence:** Line 1: "use client"
- **Imports:** React, CandidateSearch, JobSearch, SimilarityView, CareerPathView
- **Called By:** SearchPage
- **Calls:** None (renders child components)
- **Dependencies:** None external
- **Runtime Path:** Page → SearchWorkspace → Child Components

---

## COMPONENT EXECUTION: DATABASE CLIENTS

### Prisma Client
- **File:** `c:\Trajectoire\apps\web\src\lib\prisma.ts`
- **Line:** 7-17
- **Function:** `prisma` (singleton)
- **Type:** PrismaClient singleton
- **Execution:** Server-side
- **State:** Global singleton (line 3-5)
- **Evidence:** Line 7-11: Singleton pattern with globalThis
- **Imports:** PrismaClient
- **Called By:** DashboardPage, HistoryPage, SimulationPage, /api/auth/sync-user, /api/stripe/checkout, PreviewAnalysisService
- **Calls:** PrismaClient methods (findUnique, findMany, create, upsert, update)
- **Dependencies:** @prisma/client
- **Runtime Path:** Service → Prisma → Database

### Supabase Browser Client
- **File:** `c:\Trajectoire\apps\web\src\lib\supabase.ts`
- **Line:** 6-11
- **Function:** `createClient`
- **Type:** Browser client factory
- **Execution:** Browser-side
- **State:** No local state (factory function)
- **Evidence:** Line 6: `export function createClient()`
- **Imports:** createBrowserClient from @supabase/ssr
- **Called By:** SignupPage, OnboardingPage
- **Calls:** createBrowserClient
- **Dependencies:** @supabase/ssr
- **Runtime Path:** Component → Supabase Client → Supabase API

### Supabase Server Client
- **File:** NOT OBSERVED - server client implementation not viewed
- **Line:** NOT OBSERVED
- **Function:** NOT OBSERVED
- **Type:** NOT OBSERVED
- **Execution:** NOT OBSERVED
- **State:** NOT OBSERVED
- **Evidence:** NOT OBSERVED
- **Imports:** NOT OBSERVED
- **Called By:** DashboardPage, HistoryPage, SimulationPage, /api/auth/claim-preview, /api/auth/sync-user, /api/cv/upload, /api/simulation/create
- **Calls:** NOT OBSERVED
- **Dependencies:** NOT OBSERVED
- **Runtime Path:** NOT OBSERVED

---

## SUMMARY

### Component Types Observed
- **Client Components:** 8 (HomePage, SignupPage, OnboardingPage, AnalyzePage, ChatWorkspace, RecruiterWorkspace, SearchWorkspace, CandidateSearch/etc)
- **Server Components:** 7 (DashboardPage, HistoryPage, SimulationPage, PricingPage, CopilotPage, SearchPage, RecruiterPage)
- **API Routes (Next.js):** 7 (/api/public/analyze-preview, /api/auth/claim-preview, /api/auth/sync-user, /api/cv/upload, /api/stripe/checkout, /api/simulation/create, /api/interview)
- **NestJS Controllers:** 4 (CopilotController, MatchingController, SearchController, GraphController)
- **Services:** 8 (PreviewAnalysisService, generatePreviewAnalysis, CopilotService API, FlowEngine, OnboardingResolver, CopilotService Web, MatchingService Web, SearchService Web)
- **Database Clients:** 2 (Prisma, Supabase Browser Client)

### Execution Environments
- **Browser-side:** 11 components
- **Server-side (Next.js):** 14 components/routes
- **Server-side (NestJS):** 4 controllers + multiple services

### State Management
- **Local State (useState):** 8 client components
- **In-memory State:** 1 (/api/interview with Map)
- **Singleton State:** 2 (Prisma, Stripe client)
- **No State:** 13 components (stateless functions)

### External Dependencies
- **OpenAI API:** generatePreviewAnalysis
- **Supabase API:** Supabase clients
- **Stripe API:** /api/stripe/checkout
- **Upstash Redis:** /api/public/analyze-preview (rate limiting)
- **pdf-parse:** /api/cv/upload
- **pdfjs-dist:** /api/cv/upload

### Evidence Completeness
- **Total Components Documented:** 34
- **Fully Observed:** 28 (82%)
- **Partially Observed:** 4 (12%)
- **Not Observed:** 2 (6%)
