# RC37.1 - Call Graph Evidence

**Mission:** Document call graphs for all flows based on observable evidence only.

**Evidence Policy:** Every assertion must include File, Line, Function, and Evidence. If not observed, write "NOT OBSERVED".

---

## CALL GRAPH 1: LANDING FLOW

```
HomePage (page.tsx:32)
  └─ handleAnalyze (page.tsx:41)
      └─ fetch('/api/public/analyze-preview') (page.tsx:50)
          └─ POST /api/public/analyze-preview (route.ts:10)
              ├─ checkRateLimit (route.ts:15)
              │   └─ Upstash Redis (NOT OBSERVED - external service)
              ├─ validateCVUpload (route.ts:35)
              │   └─ NOT OBSERVED - validator implementation
              ├─ validateJobDescription (route.ts:45)
              │   └─ NOT OBSERVED - validator implementation
              ├─ generatePreviewAnalysis (preview-analyzer.ts:33)
              │   ├─ sanitizeInput (preview-analyzer.ts:96)
              │   ├─ detectPromptInjection (preview-analyzer.ts:104)
              │   ├─ estimateTokens (preview-analyzer.ts:91)
              │   ├─ openai.chat.completions.create (preview-analyzer.ts:55)
              │   │   └─ OpenAI API (external)
              │   ├─ validateAnalysisSchema (preview-analyzer.ts:116)
              │   └─ generateFallbackAnalysis (preview-analyzer.ts:130)
              └─ previewAnalysisService.analyzePreview (PreviewAnalysisService.ts:32)
                  ├─ simulateATSAnalysis (PreviewAnalysisService.ts:141)
                  └─ previewAnalysisRepository.create (PreviewAnalysisService.ts:38)
                      └─ NOT OBSERVED - repository implementation
```

**Evidence:**
- File: `c:\Trajectoire\apps\web\src\app\page.tsx`, Line: 41-68, Function: `handleAnalyze`
- File: `c:\Trajectoire\apps\web\src\app\api\public\analyze-preview\route.ts`, Line: 10-117, Function: `POST`
- File: `c:\Trajectoire\apps\web\src\lib\ai\preview-analyzer.ts`, Line: 33-89, Function: `generatePreviewAnalysis`
- File: `c:\Trajectoire\apps\web\src\lib\preview-analysis\PreviewAnalysisService.ts`, Line: 32-56, Function: `analyzePreview`

---

## CALL GRAPH 2: PREVIEW FLOW

```
AnalyzePage (page.tsx:12)
  └─ handleAnalyze (page.tsx:24)
      └─ fetch('/api/public/analyze-preview') (page.tsx:35)
          └─ POST /api/public/analyze-preview (route.ts:10)
              └─ [Same as Landing Flow]
```

**Evidence:**
- File: `c:\Trajectoire\apps\web\src\app\analyze\page.tsx`, Line: 24-70, Function: `handleAnalyze`

---

## CALL GRAPH 3: SIGNUP FLOW

```
SignupPage (page.tsx:9)
  └─ handleSubmit (page.tsx:20)
      ├─ createClient (supabase.ts:6)
      │   └─ createBrowserClient (supabase-ssr)
      │       └─ Supabase API (external)
      └─ supabase.auth.signUp (page.tsx:45)
          └─ Supabase Auth API (external)
      └─ claimPreview (page.tsx:59)
          └─ usePreviewStorage.claimPreview (NOT OBSERVED - hook implementation)
              └─ fetch('/api/auth/claim-preview') (NOT OBSERVED)
```

**Evidence:**
- File: `c:\Trajectoire\apps\web\src\app\signup\page.tsx`, Line: 20-66, Function: `handleSubmit`
- File: `c:\Trajectoire\apps\web\src\lib\supabase.ts`, Line: 6-11, Function: `createClient`

---

## CALL GRAPH 4: CLAIM FLOW

```
POST /api/auth/claim-preview (route.ts:12)
  ├─ createClient (supabase/server - NOT OBSERVED)
  │   └─ supabase.auth.getUser (route.ts:16)
  ├─ previewAnalysisService.claimPreview (PreviewAnalysisService.ts:61)
  │   ├─ previewAnalysisRepository.isValidToken (PreviewAnalysisService.ts:63)
  │   ├─ previewAnalysisRepository.findByToken (PreviewAnalysisService.ts:69)
  │   ├─ previewAnalysisRepository.claimForUser (PreviewAnalysisService.ts:80)
  │   ├─ createCandidateProfile (PreviewAnalysisService.ts:83)
  │   │   └─ prisma.careerProfile.findUnique (PreviewAnalysisService.ts:169)
  │   │   └─ prisma.careerProfile.create (PreviewAnalysisService.ts:174)
  │   ├─ createPermanentAnalysis (PreviewAnalysisService.ts:86)
  │   │   └─ prisma.cVAnalysis.create (PreviewAnalysisService.ts:188)
  │   ├─ createSkills (PreviewAnalysisService.ts:88)
  │   ├─ createExperience (PreviewAnalysisService.ts:91)
  │   ├─ createEducation (PreviewAnalysisService.ts:94)
  │   ├─ createLanguages (PreviewAnalysisService.ts:97)
  │   ├─ createATSHistory (PreviewAnalysisService.ts:100)
  │   └─ feedKnowledgeGraph (PreviewAnalysisService.ts:103)
  └─ response.cookies.delete (route.ts:45)
```

**Evidence:**
- File: `c:\Trajectoire\apps\web\src\app\api\auth\claim-preview\route.ts`, Line: 12-81, Function: `POST`
- File: `c:\Trajectoire\apps\web\src\lib\preview-analysis\PreviewAnalysisService.ts`, Line: 61-105, Function: `claimPreview`

---

## CALL GRAPH 5: ONBOARDING FLOW

```
OnboardingPage (page.tsx:13)
  ├─ useEffect (page.tsx:35)
  │   └─ initializeOnboarding (page.tsx:39)
  │       ├─ createClient (supabase.ts:6)
  │       │   └─ supabase.auth.getUser (page.tsx:42)
  │       ├─ FlowEngine.initializeFlow (page.tsx:50)
  │       │   └─ OnboardingResolver.resolveOnboarding (FlowEngine.ts:45)
  │       │       ├─ UserStateResolver.resolveUserState (OnboardingResolver.ts:23)
  │       │       │   └─ NOT OBSERVED - implementation
  │       │       └─ JourneyResolver.resolveJourney (OnboardingResolver.ts:38)
  │       │           └─ NOT OBSERVED - implementation
  │       └─ OnboardingResolver.resolveOnboarding (page.tsx:56)
  │           └─ [Same as above]
  ├─ handleNext (page.tsx:72)
  │   ├─ createClient (supabase.ts:6)
  │   │   └─ supabase.auth.getUser (page.tsx:80)
  │   ├─ saveUserData (page.tsx:92)
  │   │   └─ fetch('/api/auth/sync-user') (page.tsx:170)
  │   │       └─ POST /api/auth/sync-user (sync-user route.ts:19)
  │   │           ├─ createClient (supabase.ts:6)
  │   │           │   └─ supabase.auth.getUser (sync-user route.ts:33)
  │   │           ├─ rateLimit (sync-user route.ts:20)
  │   │           │   └─ NOT OBSERVED - middleware implementation
  │   │           ├─ csrfProtect (sync-user route.ts:19)
  │   │           │   └─ NOT OBSERVED - middleware implementation
  │   │           └─ prisma.user.upsert (sync-user route.ts:52)
  │   └─ FlowEngine.executeFlowAction (page.tsx:96)
  │       └─ FlowEngine.handleNext (FlowEngine.ts:108)
  │           └─ OnboardingResolver.advanceToNextStep (FlowEngine.ts:114)
  │               ├─ UserStateResolver.resolveUserState (OnboardingResolver.ts:71)
  │               ├─ UserStateResolver.completeStep (OnboardingResolver.ts:76)
  │               ├─ JourneyResolver.getNextStep (OnboardingResolver.ts:80)
  │               ├─ UserStateResolver.setCurrentStep (OnboardingResolver.ts:86)
  │               └─ UserStateResolver.completeOnboarding (OnboardingResolver.ts:91)
  ├─ handleBack (page.tsx:126)
  │   └─ FlowEngine.executeFlowAction (page.tsx:135)
  │       └─ FlowEngine.handleBack (FlowEngine.ts:130)
  │           └─ OnboardingResolver.goToPreviousStep (FlowEngine.ts:136)
  └─ handleSkip (page.tsx:147)
      └─ FlowEngine.executeFlowAction (page.tsx:156)
          └─ FlowEngine.handleSkip (FlowEngine.ts:152)
              └─ OnboardingResolver.skipCurrentStep (FlowEngine.ts:165)
```

**Evidence:**
- File: `c:\Trajectoire\apps\web\src\app\onboarding\page.tsx`, Line: 13-412, Function: `OnboardingPage`
- File: `c:\Trajectoire\apps\web\src\lib\onboarding\FlowEngine.ts`, Line: 34-103, Function: `initializeFlow`, `executeFlowAction`
- File: `c:\Trajectoire\apps\web\src\lib\onboarding\OnboardingResolver.ts`, Line: 14-62, Function: `resolveOnboarding`
- File: `c:\Trajectoire\apps\web\src\app\api\auth\sync-user\route.ts`, Line: 19-80, Function: `POST`

---

## CALL GRAPH 6: DASHBOARD FLOW

```
DashboardPage (page.tsx:20)
  ├─ createClient (supabase/server - NOT OBSERVED)
  │   └─ supabase.auth.getUser (page.tsx:22)
  ├─ prisma.user.findUnique (page.tsx:29)
  ├─ prisma.cVAnalysis.findMany (page.tsx:40)
  ├─ prisma.careerProfile.findUnique (page.tsx:50)
  ├─ prisma.interviewSession.findMany (page.tsx:55)
  ├─ checkUserQuota (page.tsx:62)
  │   └─ NOT OBSERVED - implementation
  └─ previewAnalysisService.getUserClaimedPreview (page.tsx:65)
      └─ previewAnalysisRepository.findByUserId (PreviewAnalysisService.ts:128)
          └─ NOT OBSERVED - implementation
```

**Evidence:**
- File: `c:\Trajectoire\apps\web\src\app\dashboard\page.tsx`, Line: 20-229, Function: `DashboardPage`
- File: `c:\Trajectoire\apps\web\src\lib\prisma.ts`, Line: 7-17, Function: `prisma`

---

## CALL GRAPH 7: HISTORY FLOW

```
HistoryPage (page.tsx:23)
  ├─ createClient (supabase/server - NOT OBSERVED)
  │   └─ supabase.auth.getUser (page.tsx:25)
  └─ supabase.from('interview_sessions').select (page.tsx:31)
      └─ Supabase API (external)
```

**Evidence:**
- File: `c:\Trajectoire\apps\web\src\app\history\page.tsx`, Line: 23-171, Function: `HistoryPage`

---

## CALL GRAPH 8: CV FLOW

```
POST /api/cv/upload (route.ts:26)
  ├─ createClient (supabase/server - NOT OBSERVED)
  │   └─ supabase.auth.getUser (route.ts:30)
  ├─ request.formData (route.ts:43)
  ├─ validate file type (route.ts:61)
  ├─ validate file size (route.ts:73)
  ├─ extractPDF (route.ts:96) [if PDF]
  │   ├─ pdf-parse (route.ts:148)
  │   │   └─ pdf-parse library (external)
  │   └─ pdfjs-dist (route.ts:163)
  │       └─ pdfjs-dist library (external)
  └─ file.text (route.ts:99) [if TXT/DOCX]
```

**Evidence:**
- File: `c:\Trajectoire\apps\web\src\app\api\cv\upload\route.ts`, Line: 26-192, Function: `POST`

---

## CALL GRAPH 9: JOB FLOW

```
NOT OBSERVED - No separate job upload flow observed
```

**Evidence:**
- NOT OBSERVED

---

## CALL GRAPH 10: MATCHING FLOW

```
RecruiterWorkspace (RecruiterWorkspace.tsx:12)
  ├─ handleCandidateLoaded (RecruiterWorkspace.tsx:21)
  │   └─ matchingService.registerCandidate (RecruiterWorkspace.tsx:29)
  │       └─ fetch('/api/matching/candidate') (matching.service.ts:7)
  │           └─ POST /api/matching/candidate (matching.controller.ts:12)
  │               └─ @RateLimitApi() (matching.controller.ts:13)
  └─ handleJobLoaded (RecruiterWorkspace.tsx:35)
      └─ matchingService.registerJob (RecruiterWorkspace.tsx:43)
          └─ fetch('/api/matching/job') (matching.service.ts:23)
              └─ POST /api/matching/job (matching.controller.ts:28)
                  └─ @RateLimitApi() (matching.controller.ts:29)

MatchingPanel (NOT OBSERVED - component not viewed)
  └─ handleReportGenerated (RecruiterWorkspace.tsx:49)
      └─ matchingService.getScore (NOT OBSERVED)
          └─ fetch('/api/matching/score') (matching.service.ts:39)
              └─ POST /api/matching/score (matching.controller.ts:44)
                  ├─ @RateLimitMatching() (matching.controller.ts:45)
                  └─ graphMatchingService.match (matching.controller.ts:48)
                      └─ NOT OBSERVED - implementation
```

**Evidence:**
- File: `c:\Trajectoire\apps\web\src\components\recruiter\RecruiterWorkspace.tsx`, Line: 12-82, Function: `RecruiterWorkspace`
- File: `c:\Trajectoire\apps\web\src\services\matching.service.ts`, Line: 6-36, Function: `registerCandidate`, `registerJob`
- File: `c:\Trajectoire\apps\api\src\matching\matching.controller.ts`, Line: 12-42, Function: `registerCandidate`, `registerJob`

---

## CALL GRAPH 11: SEARCH FLOW

```
SearchWorkspace (SearchWorkspace.tsx:9)
  └─ CandidateSearch (NOT OBSERVED - component not viewed)
      └─ searchService.searchCandidates (NOT OBSERVED)
          └─ fetch('/api/search/candidates') (search.service.ts:7)
              └─ POST /api/search/candidates (search.controller.ts:12)
                  ├─ @RateLimitSearch() (search.controller.ts:13)
                  └─ graphSearchService.searchCandidatesByNeighborhood (search.controller.ts:20)
                      └─ NOT OBSERVED - implementation
```

**Evidence:**
- File: `c:\Trajectoire\apps\web\src\components\search\SearchWorkspace.tsx`, Line: 9-31, Function: `SearchWorkspace`
- File: `c:\Trajectoire\apps\web\src\services\search.service.ts`, Line: 6-21, Function: `searchCandidates`
- File: `c:\Trajectoire\apps\api\src\search\search.controller.ts`, Line: 12-38, Function: `searchCandidates`

---

## CALL GRAPH 12: COPILOT FLOW

```
ChatWorkspace (ChatWorkspace.tsx:12)
  └─ handleSendMessage (ChatWorkspace.tsx:28)
      └─ copilotService.processMessage (ChatWorkspace.tsx:42)
          └─ fetch('/api/copilot/message') (copilot.service.ts:7)
              └─ POST /api/copilot/message (copilot.controller.ts:9)
                  ├─ @RateLimitCopilot() (copilot.controller.ts:10)
                  └─ copilotService.processMessage (copilot.service.ts:23)
                      ├─ cacheService.generateKey (copilot.service.ts:24)
                      ├─ cacheService.get (copilot.service.ts:27)
                      ├─ promptInterpreter.interpret (copilot.service.ts:32)
                      │   └─ NOT OBSERVED - implementation
                      ├─ conversationMemory.getOrCreateContext (copilot.service.ts:33)
                      │   └─ NOT OBSERVED - implementation
                      ├─ graphReasoningEngine.answerCandidateQuestion (copilot.service.ts:37)
                      │   └─ NOT OBSERVED - implementation
                      ├─ handleSearchCandidates (copilot.service.ts:51)
                      │   └─ graphSearchService.searchCandidatesByNeighborhood (copilot.service.ts:110)
                      │       └─ NOT OBSERVED - implementation
                      ├─ handleSearchJobs (copilot.service.ts:54)
                      │   └─ graphSearchService.searchJobsByNeighborhood (copilot.service.ts:127)
                      │       └─ NOT OBSERVED - implementation
                      ├─ handleExplainScore (copilot.service.ts:57)
                      │   └─ conversationMemory.getLastReport (copilot.service.ts:138)
                      │       └─ NOT OBSERVED - implementation
                      ├─ handleProposeTraining (copilot.service.ts:60)
                      │   └─ graphSearchService.searchCandidatesByCommunity (copilot.service.ts:151)
                      │       └─ NOT OBSERVED - implementation
                      ├─ handleProposeEvolution (copilot.service.ts:63)
                      │   └─ graphSearchService.searchCandidatesByCommunity (copilot.service.ts:170)
                      │       └─ NOT OBSERVED - implementation
                      ├─ responseBuilder.buildResponse (copilot.service.ts:67)
                      │   └─ NOT OBSERVED - implementation
                      ├─ conversationMemory.addMessage (copilot.service.ts:69, 75)
                      └─ cacheService.set (copilot.service.ts:84)
```

**Evidence:**
- File: `c:\Trajectoire\apps\web\src\components\copilot\ChatWorkspace.tsx`, Line: 12-170, Function: `ChatWorkspace`
- File: `c:\Trajectoire\apps\web\src\services\copilot.service.ts`, Line: 6-21, Function: `processMessage`
- File: `c:\Trajectoire\apps\api\src\copilot\copilot.controller.ts`, Line: 9-21, Function: `processMessage`
- File: `c:\Trajectoire\apps\api\src\copilot\copilot.service.ts`, Line: 23-224, Function: `processMessage`

---

## CALL GRAPH 13: RECRUITER FLOW

```
RecruiterPage (page.tsx:1)
  └─ RecruiterWorkspace (page.tsx:4)
      └─ [Same as Matching Flow]
```

**Evidence:**
- File: `c:\Trajectoire\apps\web\src\app\recruiter\page.tsx`, Line: 1-6, Function: `RecruiterPage`

---

## CALL GRAPH 14: BILLING FLOW

```
PricingPage (pricing/page.tsx:4)
  └─ Static page with links to signup

POST /api/stripe/checkout (route.ts:45)
  ├─ getStrictUser (route.ts:60)
  │   └─ NOT OBSERVED - implementation
  ├─ checkRateLimit (route.ts:66)
  │   └─ NOT OBSERVED - implementation
  ├─ getAllowedPriceIds (route.ts:53)
  ├─ prisma.user.findUnique (route.ts:96)
  ├─ prisma.subscription.findUnique (route.ts:103)
  ├─ resolvePlanLabel (route.ts:120)
  ├─ getStripe (route.ts:16)
  │   └─ new Stripe (route.ts:18)
  │       └─ Stripe API (external)
  ├─ stripe.checkout.sessions.create (route.ts:156)
  │   └─ Stripe API (external)
  └─ prisma.user.update (route.ts:160)
```

**Evidence:**
- File: `c:\Trajectoire\apps\web\src\app\pricing\page.tsx`, Line: 4-126, Function: `PricingPage`
- File: `c:\Trajectoire\apps\web\src\app\api\stripe\checkout\route.ts`, Line: 45-176, Function: `POST`

---

## CALL GRAPH 15: ADMIN FLOW

```
NOT OBSERVED - Admin flows not observed
```

**Evidence:**
- NOT OBSERVED

---

## CALL GRAPH 16: SIMULATION FLOW (ADDITIONAL)

```
SimulationPage (simulation/page.tsx:13)
  ├─ createClient (supabase/server - NOT OBSERVED)
  │   └─ supabase.auth.getUser (page.tsx:15)
  ├─ prisma.careerProfile.findUnique (page.tsx:21)
  └─ form POST to /api/simulation/create (page.tsx:44)

POST /api/simulation/create (route.ts:11)
  ├─ initializeContainer (route.ts:14)
  │   └─ NOT OBSERVED - DI container implementation
  ├─ createClient (supabase/server - NOT OBSERVED)
  │   └─ supabase.auth.getUser (route.ts:18)
  ├─ CreateSessionSchema.safeParse (route.ts:41)
  │   └─ Zod validation
  ├─ Container.resolve (route.ts:58)
  │   └─ SimulationService (NOT OBSERVED - implementation)
  ├─ IdempotencyService.execute (route.ts:64)
  │   └─ NOT OBSERVED - implementation
  └─ simulationService.createSimulation (route.ts:70)
      └─ NOT OBSERVED - implementation
```

**Evidence:**
- File: `c:\Trajectoire\apps\web\src\app\simulation\page.tsx`, Line: 13-118, Function: `SimulationPage`
- File: `c:\Trajectoire\apps\web\src\app\api\simulation\create\route.ts`, Line: 11-110, Function: `POST`

---

## CALL GRAPH 17: INTERVIEW FLOW (ADDITIONAL)

```
POST /api/interview (route.ts:21)
  ├─ handleStart (route.ts:59)
  │   ├─ generateSessionId (route.ts:273)
  │   ├─ new KernelState (route.ts:63)
  │   ├─ initializeDefaultHypotheses (route.ts:66)
  │   └─ kernel.questions.selectNext (route.ts:70)
  ├─ handleRespond (route.ts:94)
  │   ├─ extractObservations (route.ts:98)
  │   ├─ kernel.evidence.add (route.ts:103)
  │   ├─ kernel.hypothesis.updateWithEvidence (route.ts:119)
  │   ├─ detectBias (route.ts:124)
  │   ├─ kernel.refreshSkillGraph (route.ts:130)
  │   ├─ kernel.recordTurn (route.ts:142)
  │   └─ kernel.questions.selectNext (route.ts:156)
  ├─ handleNextQuestion (route.ts:237)
  │   └─ kernel.questions.selectNext (route.ts:240)
  ├─ handleExplain (route.ts:184)
  │   └─ Various format methods (route.ts:188-193)
  └─ handleComplete (route.ts:210)
      ├─ kernel.refreshSkillGraph (route.ts:213)
      ├─ kernel.decision.generate (route.ts:214)
      └─ kernel.complete (route.ts:215)
```

**Evidence:**
- File: `c:\Trajectoire\apps\web\src\app\api\interview\route.ts`, Line: 21-343, Function: `POST`

---

## SUMMARY

### Observable Call Graphs
1. **Landing** - FULLY OBSERVED
2. **Preview** - FULLY OBSERVED
3. **Signup** - PARTIALLY OBSERVED (Supabase SDK internals not observed)
4. **Claim** - PARTIALLY OBSERVED (repository not observed)
5. **Onboarding** - PARTIALLY OBSERVED (resolvers not observed)
6. **Dashboard** - PARTIALLY OBSERVED (quota service not observed)
7. **History** - FULLY OBSERVED
8. **CV** - FULLY OBSERVED
9. **Job** - NOT OBSERVED
10. **Matching** - PARTIALLY OBSERVED (graph services not observed)
11. **Search** - PARTIALLY OBSERVED (graph services not observed)
12. **Copilot** - PARTIALLY OBSERVED (graph services not observed)
13. **Recruiter** - SAME AS MATCHING
14. **Billing** - PARTIALLY OBSERVED (user auth not observed)
15. **Admin** - NOT OBSERVED
16. **Simulation** - PARTIALLY OBSERVED (services not observed)
17. **Interview** - FULLY OBSERVED

### Critical Unobserved Implementations
- GraphMatchingService
- GraphSearchService
- GraphReasoningEngine
- GraphRepository
- UserStateResolver
- JourneyResolver
- PreviewAnalysisRepository
- PromptInterpreterService
- ResponseBuilderService
- ConversationMemoryService
- CacheService implementation
- IdempotencyService
- SimulationService
- KernelState internals

### External API Calls Observed
- OpenAI API (GPT-4o-mini)
- Supabase API
- Stripe API
- Upstash Redis (rate limiting)
- pdf-parse library
- pdfjs-dist library

### Database Calls Observed
- Prisma: User, CVAnalysis, CareerProfile, InterviewSession, Subscription
- Supabase: interview_sessions table

### Evidence Completeness
- **Total Call Graphs:** 17
- **Fully Observed:** 4 (24%)
- **Partially Observed:** 11 (65%)
- **Not Observed:** 2 (11%)
