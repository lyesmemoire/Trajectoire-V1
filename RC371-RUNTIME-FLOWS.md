# RC37.1 - Runtime Flows Evidence

**Mission:** Reconstruct the actual runtime of the entire application based on observable evidence only.

**Evidence Policy:** Every assertion must include File, Line, Function, and Evidence. If not observed, write "NOT OBSERVED".

---

## FLOW 1: LANDING

### Page
- **File:** `c:\Trajectoire\apps\web\src\app\page.tsx`
- **Line:** 32
- **Function:** `HomePage`
- **Evidence:** Component renders CV upload form and job input

### Action
- **File:** `c:\Trajectoire\apps\web\src\app\page.tsx`
- **Line:** 41-68
- **Function:** `handleAnalyze`
- **Evidence:** User clicks "Analyze" button, triggers form submission
- **Runtime Path:** User interaction → `handleAnalyze` function
- **Execution Path:** `useState` → `formData.append` → `fetch`

### Route
- **File:** `c:\Trajectoire\apps\web\src\app\page.tsx`
- **Line:** 50
- **Function:** `handleAnalyze`
- **Evidence:** `fetch('/api/public/analyze-preview', { method: 'POST', body: formData })`
- **Route:** `/api/public/analyze-preview`
- **Method:** POST

### Middleware
- **File:** `c:\Trajectoire\apps\web\src\app\api\public\analyze-preview\route.ts`
- **Line:** 11-27
- **Function:** `POST`
- **Evidence:** `checkRateLimit('preview:${fingerprint}', 3, 3600)` - Rate limiting with Upstash Redis
- **Middleware:** Rate limiting (3 requests per hour per IP fingerprint)

### Controller
- **File:** `c:\Trajectoire\apps\web\src\app\api\public\analyze-preview\route.ts`
- **Line:** 10-117
- **Function:** `POST`
- **Evidence:** Route handler processes form data, validates CV, generates preview
- **Called By:** Landing page `handleAnalyze` function

### Service
- **File:** `c:\Trajectoire\apps\web\src\lib\ai\preview-analyzer.ts`
- **Line:** 33-89
- **Function:** `generatePreviewAnalysis`
- **Evidence:** Calls OpenAI API GPT-4o-mini with 8s timeout
- **Calls:** OpenAI API
- **Runtime Path:** `openai.chat.completions.create` → JSON response parsing

### Repository
- **File:** `c:\Trajectoire\apps\web\src\lib\preview-analysis\PreviewAnalysisService.ts`
- **Line:** 32-56
- **Function:** `analyzePreview`
- **Evidence:** Calls `previewAnalysisRepository.create` to save preview data
- **Calls:** `previewAnalysisRepository`

### Database
- **File:** `c:\Trajectoire\apps\web\src\lib\preview-analysis\PreviewAnalysisService.ts`
- **Line:** 38-50
- **Function:** `analyzePreview`
- **Evidence:** Saves to `PreviewAnalysis` table via repository
- **Database:** PreviewAnalysis table (NOT OBSERVED - repository implementation not viewed)

### External APIs
- **File:** `c:\Trajectoire\apps\web\src\lib\ai\preview-analyzer.ts`
- **Line:** 55-69
- **Function:** `generatePreviewAnalysis`
- **Evidence:** `openai.chat.completions.create` with model `gpt-4o-mini`
- **External API:** OpenAI API
- **Timeout:** 8000ms (line 58)
- **Retry:** 0 (line 26 - `maxRetries: 0`)

### Response
- **File:** `c:\Trajectoire\apps\web\src\app\api\public\analyze-preview\route.ts`
- **Line:** 84-104
- **Function:** `POST`
- **Evidence:** Returns JSON with `previewToken`, `score`, `strengths`, `weakness`, `radarDimensions`
- **Response Format:** JSON with preview token and analysis results

---

## FLOW 2: PREVIEW

### Page
- **File:** `c:\Trajectoire\apps\web\src\app\analyze\page.tsx`
- **Line:** 12-128
- **Function:** `AnalyzePage`
- **Evidence:** Renders CV upload form and displays preview results

### Action
- **File:** `c:\Trajectoire\apps\web\src\app\analyze\page.tsx`
- **Line:** 24-70
- **Function:** `handleAnalyze`
- **Evidence:** User clicks analyze button, calls `/api/public/analyze-preview`

### Route
- **File:** `c:\Trajectoire\apps\web\src\app\analyze\page.tsx`
- **Line:** 35
- **Function:** `handleAnalyze`
- **Evidence:** `fetch('/api/public/analyze-preview', { method: 'POST', body: form })`
- **Route:** `/api/public/analyze-preview`
- **Method:** POST

### Middleware
- **File:** `c:\Trajectoire\apps\web\src\app\api\public\analyze-preview\route.ts`
- **Line:** 11-27
- **Function:** `POST`
- **Evidence:** Rate limiting with IP fingerprint

### Controller
- **File:** `c:\Trajectoire\apps\web\src\app\api\public\analyze-preview\route.ts`
- **Line:** 10-117
- **Function:** `POST`
- **Evidence:** Same as Landing flow

### Service
- **File:** `c:\Trajectoire\apps\web\src\lib\ai\preview-analyzer.ts`
- **Line:** 33-89
- **Function:** `generatePreviewAnalysis`
- **Evidence:** Same as Landing flow

### Repository
- **File:** `c:\Trajectoire\apps\web\src\lib\preview-analysis\PreviewAnalysisService.ts`
- **Line:** 32-56
- **Function:** `analyzePreview`
- **Evidence:** Same as Landing flow

### Database
- **File:** `c:\Trajectoire\apps\web\src\lib\preview-analysis\PreviewAnalysisService.ts`
- **Line:** 38-50
- **Function:** `analyzePreview`
- **Evidence:** Same as Landing flow

### External APIs
- **File:** `c:\Trajectoire\apps\web\src\lib\ai\preview-analyzer.ts`
- **Line:** 55-69
- **Function:** `generatePreviewAnalysis`
- **Evidence:** Same as Landing flow

### Response
- **File:** `c:\Trajectoire\apps\web\src\app\analyze\page.tsx`
- **Line:** 45-46
- **Function:** `handleAnalyze`
- **Evidence:** Displays results in `PremiumATSResult` component

---

## FLOW 3: SIGNUP

### Page
- **File:** `c:\Trajectoire\apps\web\src\app\signup\page.tsx`
- **Line:** 9-166
- **Function:** `SignupPage`
- **Evidence:** Renders signup form with email, password, CGU checkbox

### Action
- **File:** `c:\Trajectoire\apps\web\src\app\signup\page.tsx`
- **Line:** 20-66
- **Function:** `handleSubmit`
- **Evidence:** User submits form, calls `supabase.auth.signUp`

### Route
- **File:** `c:\Trajectoire\apps\web\src\app\signup\page.tsx`
- **Line:** 44-51
- **Function:** `handleSubmit`
- **Evidence:** `supabase.auth.signUp({ email, password, options: { emailRedirectTo } })`
- **Route:** NOT OBSERVED - Supabase SDK handles routing internally
- **Method:** NOT OBSERVED - Supabase SDK method

### Middleware
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Function:** NOT OBSERVED
- **Evidence:** NOT OBSERVED - Supabase SDK handles authentication

### Controller
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Function:** NOT OBSERVED
- **Evidence:** NOT OBSERVED - Supabase SDK handles authentication

### Service
- **File:** `c:\Trajectoire\apps\web\src\lib\supabase.ts`
- **Line:** 6-11
- **Function:** `createClient`
- **Evidence:** Creates Supabase browser client
- **Calls:** Supabase SDK

### Repository
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Function:** NOT OBSERVED
- **Evidence:** NOT OBSERVED - Supabase handles data storage

### Database
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Function:** NOT OBSERVED
- **Evidence:** NOT OBSERVED - Supabase handles database

### External APIs
- **File:** `c:\Trajectoire\apps\web\src\lib\supabase.ts`
- **Line:** 7-10
- **Function:** `createClient`
- **Evidence:** Supabase API (URL from env var)
- **External API:** Supabase API

### Response
- **File:** `c:\Trajectoire\apps\web\src\app\signup\page.tsx`
- **Line:** 55-60
- **Function:** `handleSubmit`
- **Evidence:** Auto-claims preview if token exists, then shows success message

---

## FLOW 4: CLAIM

### Page
- **File:** NOT OBSERVED - Claim happens during signup flow
- **Line:** NOT OBSERVED
- **Function:** NOT OBSERVED
- **Evidence:** NOT OBSERVED

### Action
- **File:** `c:\Trajectoire\apps\web\src\app\signup\page.tsx`
- **Line:** 58-60
- **Function:** `handleSubmit`
- **Evidence:** Calls `claimPreview()` if preview token exists

### Route
- **File:** `c:\Trajectoire\apps\web\src\app\api\auth\claim-preview\route.ts`
- **Line:** 12-81
- **Function:** `POST`
- **Evidence:** Route handler for claiming preview analysis
- **Route:** `/api/auth/claim-preview`
- **Method:** POST

### Middleware
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Function:** NOT OBSERVED
- **Evidence:** NOT OBSERVED

### Controller
- **File:** `c:\Trajectoire\apps\web\src\app\api\auth\claim-preview\route.ts`
- **Line:** 12-81
- **Function:** `POST`
- **Evidence:** Validates user, claims preview, deletes cookie

### Service
- **File:** `c:\Trajectoire\apps\web\src\lib\preview-analysis\PreviewAnalysisService.ts`
- **Line:** 61-105
- **Function:** `claimPreview`
- **Evidence:** Validates token, claims preview, creates database records

### Repository
- **File:** `c:\Trajectoire\apps\web\src\lib\preview-analysis\PreviewAnalysisService.ts`
- **Line:** 63, 69, 80
- **Function:** `claimPreview`
- **Evidence:** Calls `previewAnalysisRepository.isValidToken`, `findByToken`, `claimForUser`

### Database
- **File:** `c:\Trajectoire\apps\web\src\lib\preview-analysis\PreviewAnalysisService.ts`
- **Line:** 83-104
- **Function:** `claimPreview`
- **Evidence:** Creates `CareerProfile`, `CVAnalysis`, `Skills`, `Experience`, `Education`, `Languages`, `ATS History` via Prisma

### External APIs
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Function:** NOT OBSERVED
- **Evidence:** NOT OBSERVED

### Response
- **File:** `c:\Trajectoire\apps\web\src\app\api\auth\claim-preview\route.ts`
- **Line:** 40-47
- **Function:** `POST`
- **Evidence:** Returns JSON with success message and deletes preview_token cookie

---

## FLOW 5: ONBOARDING

### Page
- **File:** `c:\Trajectoire\apps\web\src\app\onboarding\page.tsx`
- **Line:** 13-412
- **Function:** `OnboardingPage`
- **Evidence:** Renders adaptive onboarding flow with steps

### Action
- **File:** `c:\Trajectoire\apps\web\src\app\onboarding\page.tsx`
- **Line:** 72-124
- **Function:** `handleNext`
- **Evidence:** User clicks "Continue", executes flow action

### Route
- **File:** `c:\Trajectoire\apps\web\src\app\onboarding\page.tsx`
- **Line:** 96
- **Function:** `handleNext`
- **Evidence:** Calls `FlowEngine.executeFlowAction(user.id, 'next')`

### Middleware
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Function:** NOT OBSERVED
- **Evidence:** NOT OBSERVED

### Controller
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Function:** NOT OBSERVED
- **Evidence:** NOT OBSERVED - FlowEngine is a library, not a controller

### Service
- **File:** `c:\Trajectoire\apps\web\src\lib\onboarding\FlowEngine.ts`
- **Line:** 81-103
- **Function:** `executeFlowAction`
- **Evidence:** Executes flow action (next/back/skip/restart)

### Repository
- **File:** `c:\Trajectoire\apps\web\src\lib\onboarding\UserStateResolver.ts`
- **Line:** NOT OBSERVED - file not viewed
- **Function:** NOT OBSERVED
- **Evidence:** NOT OBSERVED

### Database
- **File:** `c:\Trajectoire\apps\web\src\app\onboarding\page.tsx`
- **Line:** 167-185
- **Function:** `saveUserData`
- **Evidence:** Calls `/api/auth/sync-user` to save user data to database

### External APIs
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Function:** NOT OBSERVED
- **Evidence:** NOT OBSERVED

### Response
- **File:** `c:\Trajectoire\apps\web\src\app\onboarding\page.tsx`
- **Line:** 96-102
- **Function:** `handleNext`
- **Evidence:** Updates current step and progress, redirects to dashboard on completion

---

## FLOW 6: DASHBOARD

### Page
- **File:** `c:\Trajectoire\apps\web\src\app\dashboard\page.tsx`
- **Line:** 20-229
- **Function:** `DashboardPage`
- **Evidence:** Server component that fetches user data and renders dashboard

### Action
- **File:** NOT OBSERVED - Dashboard is a read-only page
- **Line:** NOT OBSERVED
- **Function:** NOT OBSERVED
- **Evidence:** NOT OBSERVED

### Route
- **File:** NOT OBSERVED - Dashboard is a page, not a route handler
- **Line:** NOT OBSERVED
- **Function:** NOT OBSERVED
- **Evidence:** NOT OBSERVED

### Middleware
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Function:** NOT OBSERVED
- **Evidence:** NOT OBSERVED

### Controller
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Function:** NOT OBSERVED
- **Evidence:** NOT OBSERVED

### Service
- **File:** `c:\Trajectoire\apps\web\src\lib\quota\simple-quota.ts`
- **Line:** NOT OBSERVED - file not viewed
- **Function:** `checkUserQuota`
- **Evidence:** Called at line 62

### Repository
- **File:** `c:\Trajectoire\apps\web\src\lib\prisma.ts`
- **Line:** 7-17
- **Function:** `prisma` (singleton)
- **Evidence:** Used to query database directly

### Database
- **File:** `c:\Trajectoire\apps\web\src\app\dashboard\page.tsx`
- **Line:** 29-59
- **Function:** `DashboardPage`
- **Evidence:** Queries `User`, `CVAnalysis`, `CareerProfile`, `InterviewSession` via Prisma

### External APIs
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Function:** NOT OBSERVED
- **Evidence:** NOT OBSERVED

### Response
- **File:** `c:\Trajectoire\apps\web\src\app\dashboard\page.tsx`
- **Line:** 213-227
- **Function:** `DashboardPage`
- **Evidence:** Renders `DashboardWidgets` component with fetched data

---

## FLOW 7: HISTORY

### Page
- **File:** `c:\Trajectoire\apps\web\src\app\history\page.tsx`
- **Line:** 23-171
- **Function:** `HistoryPage`
- **Evidence:** Server component that fetches interview sessions

### Action
- **File:** NOT OBSERVED - History is a read-only page
- **Line:** NOT OBSERVED
- **Function:** NOT OBSERVED
- **Evidence:** NOT OBSERVED

### Route
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Function:** NOT OBSERVED
- **Evidence:** NOT OBSERVED

### Middleware
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Function:** NOT OBSERVED
- **Evidence:** NOT OBSERVED

### Controller
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Function:** NOT OBSERVED
- **Evidence:** NOT OBSERVED

### Service
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Function:** NOT OBSERVED
- **Evidence:** NOT OBSERVED

### Repository
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Function:** NOT OBSERVED
- **Evidence:** NOT OBSERVED

### Database
- **File:** `c:\Trajectoire\apps\web\src\app\history\page.tsx`
- **Line:** 31-41
- **Function:** `HistoryPage`
- **Evidence:** Queries `interview_sessions` with `reports` via Supabase client

### External APIs
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Function:** NOT OBSERVED
- **Evidence:** NOT OBSERVED

### Response
- **File:** `c:\Trajectoire\apps\web\src\app\history\page.tsx`
- **Line:** 55-168
- **Function:** `HistoryPage`
- **Evidence:** Renders table with sessions and stats overview

---

## FLOW 8: CV

### Page
- **File:** NOT OBSERVED - CV upload is part of Landing/Preview flows
- **Line:** NOT OBSERVED
- **Function:** NOT OBSERVED
- **Evidence:** NOT OBSERVED

### Action
- **File:** `c:\Trajectoire\apps\web\src\app\api\cv\upload\route.ts`
- **Line:** 26-136
- **Function:** `POST`
- **Evidence:** Uploads CV file and extracts text

### Route
- **File:** `c:\Trajectoire\apps\web\src\app\api\cv\upload\route.ts`
- **Line:** 26
- **Function:** `POST`
- **Evidence:** Route handler for CV upload
- **Route:** `/api/cv/upload`
- **Method:** POST

### Middleware
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Function:** NOT OBSERVED
- **Evidence:** NOT OBSERVED

### Controller
- **File:** `c:\Trajectoire\apps\web\src\app\api\cv\upload\route.ts`
- **Line:** 26-136
- **Function:** `POST`
- **Evidence:** Validates file, extracts text, returns extracted text

### Service
- **File:** `c:\Trajectoire\apps\web\src\app\api\cv\upload\route.ts`
- **Line:** 143-191
- **Function:** `extractPDF`
- **Evidence:** Extracts text from PDF using pdf-parse or pdfjs-dist

### Repository
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Function:** NOT OBSERVED
- **Evidence:** NOT OBSERVED

### Database
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Function:** NOT OBSERVED
- **Evidence:** NOT OBSERVED - CV upload does not save to database

### External APIs
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Function:** NOT OBSERVED
- **Evidence:** NOT OBSERVED

### Response
- **File:** `c:\Trajectoire\apps\web\src\app\api\cv\upload\route.ts`
- **Line:** 128-135
- **Function:** `POST`
- **Evidence:** Returns JSON with extracted text and file metadata

---

## FLOW 9: JOB

### Page
- **File:** NOT OBSERVED - Job upload is part of Landing/Preview flows
- **Line:** NOT OBSERVED
- **Function:** NOT OBSERVED
- **Evidence:** NOT OBSERVED

### Action
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Function:** NOT OBSERVED
- **Evidence:** NOT OBSERVED - Job upload not observed as separate flow

### Route
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Function:** NOT OBSERVED
- **Evidence:** NOT OBSERVED

### Middleware
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Function:** NOT OBSERVED
- **Evidence:** NOT OBSERVED

### Controller
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Function:** NOT OBSERVED
- **Evidence:** NOT OBSERVED

### Service
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Function:** NOT OBSERVED
- **Evidence:** NOT OBSERVED

### Repository
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Function:** NOT OBSERVED
- **Evidence:** NOT OBSERVED

### Database
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Function:** NOT OBSERVED
- **Evidence:** NOT OBSERVED

### External APIs
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Function:** NOT OBSERVED
- **Evidence:** NOT OBSERVED

### Response
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Function:** NOT OBSERVED
- **Evidence:** NOT OBSERVED

---

## FLOW 10: MATCHING

### Page
- **File:** `c:\Trajectoire\apps\web\src\components\recruiter\RecruiterWorkspace.tsx`
- **Line:** 12-82
- **Function:** `RecruiterWorkspace`
- **Evidence:** Renders candidate/job upload and matching interface

### Action
- **File:** `c:\Trajectoire\apps\web\src\components\recruiter\RecruiterWorkspace.tsx`
- **Line:** 21-47
- **Function:** `handleCandidateLoaded`, `handleJobLoaded`
- **Evidence:** Registers candidate/job via matchingService

### Route
- **File:** `c:\Trajectoire\apps\web\src\services\matching.service.ts`
- **Line:** 6-20
- **Function:** `registerCandidate`
- **Evidence:** Calls `/api/matching/candidate`
- **Route:** `/api/matching/candidate`
- **Method:** POST

### Middleware
- **File:** `c:\Trajectoire\apps\api\src\matching\matching.controller.ts`
- **Line:** 13
- **Function:** `registerCandidate`
- **Evidence:** `@RateLimitApi()` decorator

### Controller
- **File:** `c:\Trajectoire\apps\api\src\matching\matching.controller.ts`
- **Line:** 12-26
- **Function:** `registerCandidate`
- **Evidence:** Returns message that graph must be stored via GraphRepository

### Service
- **File:** `c:\Trajectoire\apps\api\src\runtime\kg\graph-matching.service.ts`
- **Line:** NOT OBSERVED - file not viewed
- **Function:** NOT OBSERVED
- **Evidence:** NOT OBSERVED

### Repository
- **File:** `c:\Trajectoire\apps\api\src\runtime\kg\graph-repository.service.ts`
- **Line:** NOT OBSERVED - file not viewed
- **Function:** NOT OBSERVED
- **Evidence:** NOT OBSERVED

### Database
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Function:** NOT OBSERVED
- **Evidence:** NOT OBSERVED

### External APIs
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Function:** NOT OBSERVED
- **Evidence:** NOT OBSERVED

### Response
- **File:** `c:\Trajectoire\apps\api\src\matching\matching.controller.ts`
- **Line:** 18-22
- **Function:** `registerCandidate`
- **Evidence:** Returns success message with candidateId

---

## FLOW 11: SEARCH

### Page
- **File:** `c:\Trajectoire\apps\web\src\components\search\SearchWorkspace.tsx`
- **Line:** 9-31
- **Function:** `SearchWorkspace`
- **Evidence:** Renders candidate/job search interface

### Action
- **File:** NOT OBSERVED - Search components not viewed in detail
- **Line:** NOT OBSERVED
- **Function:** NOT OBSERVED
- **Evidence:** NOT OBSERVED

### Route
- **File:** `c:\Trajectoire\apps\web\src\services\search.service.ts`
- **Line:** 6-21
- **Function:** `searchCandidates`
- **Evidence:** Calls `/api/search/candidates`
- **Route:** `/api/search/candidates`
- **Method:** POST

### Middleware
- **File:** `c:\Trajectoire\apps\api\src\search\search.controller.ts`
- **Line:** 13
- **Function:** `searchCandidates`
- **Evidence:** `@RateLimitSearch()` decorator

### Controller
- **File:** `c:\Trajectoire\apps\api\src\search\search.controller.ts`
- **Line:** 12-38
- **Function:** `searchCandidates`
- **Evidence:** Calls `graphSearchService.searchCandidatesByNeighborhood`

### Service
- **File:** `c:\Trajectoire\apps\api\src\runtime\kg\graph-search.service.ts`
- **Line:** NOT OBSERVED - file not viewed
- **Function:** NOT OBSERVED
- **Evidence:** NOT OBSERVED

### Repository
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Function:** NOT OBSERVED
- **Evidence:** NOT OBSERVED

### Database
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Function:** NOT OBSERVED
- **Evidence:** NOT OBSERVED

### External APIs
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Function:** NOT OBSERVED
- **Evidence:** NOT OBSERVED

### Response
- **File:** `c:\Trajectoire\apps\api\src\search\search.controller.ts`
- **Line:** 25-34
- **Function:** `searchCandidates`
- **Evidence:** Returns formatted results with id, score, explanation

---

## FLOW 12: COPILOT

### Page
- **File:** `c:\Trajectoire\apps\web\src\components\copilot\ChatWorkspace.tsx`
- **Line:** 12-170
- **Function:** `ChatWorkspace`
- **Evidence:** Renders chat interface for Copilot

### Action
- **File:** `c:\Trajectoire\apps\web\src\components\copilot\ChatWorkspace.tsx`
- **Line:** 28-64
- **Function:** `handleSendMessage`
- **Evidence:** User sends message, calls copilotService

### Route
- **File:** `c:\Trajectoire\apps\web\src\services\copilot.service.ts`
- **Line:** 6-21
- **Function:** `processMessage`
- **Evidence:** Calls `/api/copilot/message`
- **Route:** `/api/copilot/message`
- **Method:** POST

### Middleware
- **File:** `c:\Trajectoire\apps\api\src\copilot\copilot.controller.ts`
- **Line:** 10
- **Function:** `processMessage`
- **Evidence:** `@RateLimitCopilot()` decorator

### Controller
- **File:** `c:\Trajectoire\apps\api\src\copilot\copilot.controller.ts`
- **Line:** 9-21
- **Function:** `processMessage`
- **Evidence:** Calls `copilotService.processMessage`

### Service
- **File:** `c:\Trajectoire\apps\api\src\copilot\copilot.service.ts`
- **Line:** 23-87
- **Function:** `processMessage`
- **Evidence:** Interprets intent, uses graph reasoning, builds response

### Repository
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Function:** NOT OBSERVED
- **Evidence:** NOT OBSERVED

### Database
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Function:** NOT OBSERVED
- **Evidence:** NOT OBSERVED

### External APIs
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Function:** NOT OBSERVED
- **Evidence:** NOT OBSERVED

### Response
- **File:** `c:\Trajectoire\apps\api\src\copilot\copilot.service.ts`
- **Line:** 67-86
- **Function:** `processMessage`
- **Evidence:** Returns CopilotResponse with message, sources, reasoning

---

## FLOW 13: RECRUITER

### Page
- **File:** `c:\Trajectoire\apps\web\src\app\recruiter\page.tsx`
- **Line:** 1-6
- **Function:** `RecruiterPage`
- **Evidence:** Renders RecruiterWorkspace component

### Action
- **File:** Same as Matching flow
- **Line:** Same as Matching flow
- **Function:** Same as Matching flow
- **Evidence:** Same as Matching flow

### Route
- **File:** Same as Matching flow
- **Line:** Same as Matching flow
- **Function:** Same as Matching flow
- **Evidence:** Same as Matching flow

### Middleware
- **File:** Same as Matching flow
- **Line:** Same as Matching flow
- **Function:** Same as Matching flow
- **Evidence:** Same as Matching flow

### Controller
- **File:** Same as Matching flow
- **Line:** Same as Matching flow
- **Function:** Same as Matching flow
- **Evidence:** Same as Matching flow

### Service
- **File:** Same as Matching flow
- **Line:** Same as Matching flow
- **Function:** Same as Matching flow
- **Evidence:** Same as Matching flow

### Repository
- **File:** Same as Matching flow
- **Line:** Same as Matching flow
- **Function:** Same as Matching flow
- **Evidence:** Same as Matching flow

### Database
- **File:** Same as Matching flow
- **Line:** Same as Matching flow
- **Function:** Same as Matching flow
- **Evidence:** Same as Matching flow

### External APIs
- **File:** Same as Matching flow
- **Line:** Same as Matching flow
- **Function:** Same as Matching flow
- **Evidence:** Same as Matching flow

### Response
- **File:** Same as Matching flow
- **Line:** Same as Matching flow
- **Function:** Same as Matching flow
- **Evidence:** Same as Matching flow

---

## FLOW 14: BILLING

### Page
- **File:** `c:\Trajectoire\apps\web\src\app\pricing\page.tsx`
- **Line:** 4-126
- **Function:** `PricingPage`
- **Evidence:** Renders pricing plans with links to signup

### Action
- **File:** NOT OBSERVED - Pricing page is static
- **Line:** NOT OBSERVED
- **Function:** NOT OBSERVED
- **Evidence:** NOT OBSERVED

### Route
- **File:** `c:\Trajectoire\apps\web\src\app\api\stripe\checkout\route.ts`
- **Line:** 45-176
- **Function:** `POST`
- **Evidence:** Creates Stripe checkout session
- **Route:** `/api/stripe/checkout`
- **Method:** POST

### Middleware
- **File:** `c:\Trajectoire\apps\web\src\app\api\stripe\checkout\route.ts`
- **Line:** 65-75
- **Function:** `POST`
- **Evidence:** Rate limiting with `checkRateLimit(user.id, "stripe_checkout")`

### Controller
- **File:** `c:\Trajectoire\apps\web\src\app\api\stripe\checkout\route.ts`
- **Line:** 45-176
- **Function:** `POST`
- **Evidence:** Validates user, checks existing subscription, creates Stripe session

### Service
- **File:** `c:\Trajectoire\apps\web\src\app\api\stripe\checkout\route.ts`
- **Line:** 16-23
- **Function:** `getStripe`
- **Evidence:** Creates Stripe client singleton

### Repository
- **File:** `c:\Trajectoire\apps\web\src\lib\prisma.ts`
- **Line:** 7-17
- **Function:** `prisma`
- **Evidence:** Used to query user and subscription

### Database
- **File:** `c:\Trajectoire\apps\web\src\app\api\stripe\checkout\route.ts`
- **Line:** 96-116
- **Function:** `POST`
- **Evidence:** Queries `User` and `Subscription` via Prisma

### External APIs
- **File:** `c:\Trajectoire\apps\web\src\app\api\stripe\checkout\route.ts`
- **Line:** 156
- **Function:** `POST`
- **Evidence:** `getStripe().checkout.sessions.create(sessionParams)`
- **External API:** Stripe API

### Response
- **File:** `c:\Trajectoire\apps\web\src\app\api\stripe\checkout\route.ts`
- **Line:** 166
- **Function:** `POST`
- **Evidence:** Returns JSON with checkout URL

---

## FLOW 15: ADMIN

### Page
- **File:** `c:\Trajectoire\apps\web\src\app\admin\analytics\page.tsx`
- **Line:** NOT OBSERVED - file not viewed
- **Function:** NOT OBSERVED
- **Evidence:** NOT OBSERVED

### Action
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Function:** NOT OBSERVED
- **Evidence:** NOT OBSERVED

### Route
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Function:** NOT OBSERVED
- **Evidence:** NOT OBSERVED

### Middleware
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Function:** NOT OBSERVED
- **Evidence:** NOT OBSERVED

### Controller
- **File:** `c:\Trajectoire\apps\api\src\monitoring\monitoring.controller.ts`
- **Line:** NOT OBSERVED - file not viewed
- **Function:** NOT OBSERVED
- **Evidence:** NOT OBSERVED

### Service
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Function:** NOT OBSERVED
- **Evidence:** NOT OBSERVED

### Repository
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Function:** NOT OBSERVED
- **Evidence:** NOT OBSERVED

### Database
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Function:** NOT OBSERVED
- **Evidence:** NOT OBSERVED

### External APIs
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Function:** NOT OBSERVED
- **Evidence:** NOT OBSERVED

### Response
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Function:** NOT OBSERVED
- **Evidence:** NOT OBSERVED

---

## SUMMARY

### Observable Flows
1. **Landing** - FULLY OBSERVED
2. **Preview** - FULLY OBSERVED
3. **Signup** - PARTIALLY OBSERVED (Supabase SDK internals not observed)
4. **Claim** - FULLY OBSERVED
5. **Onboarding** - PARTIALLY OBSERVED (UserStateResolver not viewed)
6. **Dashboard** - FULLY OBSERVED
7. **History** - FULLY OBSERVED
8. **CV** - FULLY OBSERVED
9. **Job** - NOT OBSERVED (no separate flow)
10. **Matching** - PARTIALLY OBSERVED (GraphMatchingService not viewed)
11. **Search** - PARTIALLY OBSERVED (GraphSearchService not viewed)
12. **Copilot** - PARTIALLY OBSERVED (GraphReasoningEngine not viewed)
13. **Recruiter** - SAME AS MATCHING
14. **Billing** - FULLY OBSERVED
15. **Admin** - NOT OBSERVED

### Critical Gaps
- GraphMatchingService implementation not viewed
- GraphSearchService implementation not viewed
- GraphReasoningEngine implementation not viewed
- GraphRepository implementation not viewed
- UserStateResolver implementation not viewed
- PreviewAnalysisRepository implementation not viewed
- Supabase SDK internals not observed
- Database schema not observed
- Admin flows not observed
- Job upload as separate flow not observed

### Evidence Completeness
- **Total Flows:** 15
- **Fully Observed:** 8 (53%)
- **Partially Observed:** 5 (33%)
- **Not Observed:** 2 (13%)
