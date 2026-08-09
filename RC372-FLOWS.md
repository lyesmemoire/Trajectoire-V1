# RC37.2 - Flows Documentation

**Mission:** Document user journey flows based on observable evidence only.

**Evidence Policy:** Every assertion based on RC37.1 evidence. No assumptions, estimations, or inferences.

---

## FLOW 1: LANDING → UPLOAD CV

### Flow Definition
User lands on homepage, uploads CV, optionally adds job description, triggers preview analysis.

### Runtime Chain

```
User navigates to /
  ↓
HomePage renders (page.tsx:32)
  ↓
User selects CV file
  ↓
User optionally enters job description
  ↓
User clicks "Analyser" button
  ↓
handleAnalyze executes (page.tsx:41)
  ↓
FormData prepared (page.tsx:31-33)
  ↓
fetch('/api/public/analyze-preview') (page.tsx:50)
  ↓
POST /api/public/analyze-preview (route.ts:10)
  ↓
checkRateLimit (route.ts:15)
  ↓
validateCVUpload (route.ts:35)
  ↓
validateJobDescription (route.ts:45)
  ↓
Text extraction (route.ts:55-58)
  ↓
generatePreviewAnalysis (route.ts:62)
  ↓
openai.chat.completions.create (preview-analyzer.ts:55)
  ↓
Fallback if error (preview-analyzer.ts:86)
  ↓
previewAnalysisService.analyzePreview (route.ts:70)
  ↓
previewAnalysisRepository.create (PreviewAnalysisService.ts:38)
  ↓
Cookie set (route.ts:80)
  ↓
JSON response (route.ts:84)
  ↓
Redirect to /analyze (page.tsx:52)
```

### Executed Methods
- `HomePage` (page.tsx:32)
- `handleAnalyze` (page.tsx:41)
- `formData.append` (page.tsx:31-33)
- `fetch` (page.tsx:50)
- `POST` (route.ts:10)
- `checkRateLimit` (route.ts:15)
- `validateCVUpload` (route.ts:35)
- `validateJobDescription` (route.ts:45)
- `file.text` or `extractPDF` (route.ts:55-58)
- `generatePreviewAnalysis` (route.ts:62)
- `openai.chat.completions.create` (preview-analyzer.ts:55)
- `generateFallbackAnalysis` (preview-analyzer.ts:130)
- `previewAnalysisService.analyzePreview` (route.ts:70)
- `previewAnalysisRepository.create` (PreviewAnalysisService.ts:38)
- `response.cookies.set` (route.ts:80)

### Dead Code
- `simulateATSAnalysis` (PreviewAnalysisService.ts:141) - TODO comment indicates simulation instead of real ATS

### Unused Branches
- None observed

### Double Calls
- None observed

### Missing Validations
- Client-side: None observed
- Server-side: validateCVUpload, validateJobDescription (route.ts:35, 45)

### Unexpected Exits
- Early return with fallback if input too large (preview-analyzer.ts:49-52)

### Exceptions
- try/catch in handleAnalyze (page.tsx:64-67)
- try/catch in generatePreviewAnalysis (preview-analyzer.ts:84-88)

### Rollback
- None observed

### Errors
- console.error on failure (page.tsx:66)
- Sentry capture on API error (route.ts:106)

---

## FLOW 2: ATS PREVIEW

### Flow Definition
ATS analysis is generated using OpenAI API with fallback mechanism.

### Runtime Chain

```
generatePreviewAnalysis called (preview-analyzer.ts:33)
  ↓
sanitizeInput (preview-analyzer.ts:96)
  ↓
detectPromptInjection (preview-analyzer.ts:104)
  ↓
estimateTokens (preview-analyzer.ts:91)
  ↓
Check if input too large (preview-analyzer.ts:49)
  ↓
If too large: return generateFallbackAnalysis (preview-analyzer.ts:51)
  ↓
openai.chat.completions.create (preview-analyzer.ts:55)
  ↓
Parse JSON response (preview-analyzer.ts:76)
  ↓
validateAnalysisSchema (preview-analyzer.ts:116)
  ↓
If invalid: throw Error (preview-analyzer.ts:80)
  ↓
Return validated data (preview-analyzer.ts:83)
  ↓
If error: return generateFallbackAnalysis (preview-analyzer.ts:86)
```

### Executed Methods
- `generatePreviewAnalysis` (preview-analyzer.ts:33)
- `sanitizeInput` (preview-analyzer.ts:96)
- `detectPromptInjection` (preview-analyzer.ts:104)
- `estimateTokens` (preview-analyzer.ts:91)
- `openai.chat.completions.create` (preview-analyzer.ts:55)
- `JSON.parse` (preview-analyzer.ts:76)
- `validateAnalysisSchema` (preview-analyzer.ts:116)
- `generateFallbackAnalysis` (preview-analyzer.ts:130)

### Dead Code
- None observed

### Unused Branches
- Early return branch if input too large (preview-analyzer.ts:49-52)

### Double Calls
- None observed

### Missing Validations
- Basic prompt injection detection only (preview-analyzer.ts:104-114)

### Unexpected Exits
- Early return with fallback if input too large (preview-analyzer.ts:49-52)

### Exceptions
- try/catch with fallback (preview-analyzer.ts:84-88)

### Rollback
- None observed

### Errors
- logger.error on AI error (preview-analyzer.ts:86)

---

## FLOW 3: SIGNUP

### Flow Definition
User signs up with email and password, Supabase handles authentication.

### Runtime Chain

```
User navigates to /signup
  ↓
SignupPage renders (page.tsx:9)
  ↓
User enters email, password
  ↓
User accepts CGU checkbox
  ↓
User clicks signup button
  ↓
handleSubmit executes (page.tsx:20)
  ↓
Client validation (page.tsx:26-34)
  ↓
supabase.auth.signUp (page.tsx:44)
  ↓
If preview token exists: claimPreview (page.tsx:59)
  ↓
router.push('/dashboard') (page.tsx:62)
```

### Executed Methods
- `SignupPage` (page.tsx:9)
- `handleSubmit` (page.tsx:20)
- `supabase.auth.signUp` (page.tsx:44)
- `claimPreview` (page.tsx:59)
- `router.push` (page.tsx:62)

### Dead Code
- None observed

### Unused Branches
- Auto-claim branch only if preview token exists (page.tsx:58-60)

### Double Calls
- None observed

### Missing Validations
- Client-side validation only (page.tsx:26-34)
- No server-side validation observed

### Unexpected Exits
- Early return if signup fails (page.tsx:52-54)

### Exceptions
- Error handling with setError (page.tsx:52-54)

### Rollback
- None observed

### Errors
- setError on failure (page.tsx:53)

---

## FLOW 4: CLAIM PREVIEW

### Flow Definition
User claims preview analysis after signup, data is persisted to database.

### Runtime Chain

```
POST /api/auth/claim-preview (route.ts:12)
  ↓
supabase.auth.getUser (route.ts:16)
  ↓
previewAnalysisService.claimPreview (route.ts:28)
  ↓
previewAnalysisRepository.isValidToken (PreviewAnalysisService.ts:63)
  ↓
If invalid: throw Error (PreviewAnalysisService.ts:64-66)
  ↓
previewAnalysisRepository.findByToken (PreviewAnalysisService.ts:69)
  ↓
If not found: throw Error (PreviewAnalysisService.ts:70-72)
  ↓
If already claimed: throw Error (PreviewAnalysisService.ts:75-77)
  ↓
previewAnalysisRepository.claimForUser (PreviewAnalysisService.ts:80)
  ↓
createCandidateProfile (PreviewAnalysisService.ts:83)
  ↓
prisma.careerProfile.findUnique (PreviewAnalysisService.ts:169)
  ↓
If exists: skip (PreviewAnalysisService.ts:173)
  ↓
prisma.careerProfile.create (PreviewAnalysisService.ts:174)
  ↓
createPermanentAnalysis (PreviewAnalysisService.ts:86)
  ↓
prisma.cVAnalysis.create (PreviewAnalysisService.ts:188)
  ↓
createSkills (PreviewAnalysisService.ts:88) - TODO only
  ↓
createExperience (PreviewAnalysisService.ts:91) - TODO only
  ↓
createEducation (PreviewAnalysisService.ts:94) - TODO only
  ↓
createLanguages (PreviewAnalysisService.ts:97) - TODO only
  ↓
feedKnowledgeGraph (PreviewAnalysisService.ts:104) - TODO only
  ↓
response.cookies.delete('preview_token') (route.ts:45)
  ↓
JSON response (route.ts:40)
```

### Executed Methods
- `POST` (route.ts:12)
- `supabase.auth.getUser` (route.ts:16)
- `previewAnalysisService.claimPreview` (route.ts:28)
- `previewAnalysisRepository.isValidToken` (PreviewAnalysisService.ts:63)
- `previewAnalysisRepository.findByToken` (PreviewAnalysisService.ts:69)
- `previewAnalysisRepository.claimForUser` (PreviewAnalysisService.ts:80)
- `createCandidateProfile` (PreviewAnalysisService.ts:83)
- `prisma.careerProfile.findUnique` (PreviewAnalysisService.ts:169)
- `prisma.careerProfile.create` (PreviewAnalysisService.ts:174)
- `createPermanentAnalysis` (PreviewAnalysisService.ts:86)
- `prisma.cVAnalysis.create` (PreviewAnalysisService.ts:188)
- `createSkills` (PreviewAnalysisService.ts:88) - Placeholder
- `createExperience` (PreviewAnalysisService.ts:91) - Placeholder
- `createEducation` (PreviewAnalysisService.ts:94) - Placeholder
- `createLanguages` (PreviewAnalysisService.ts:97) - Placeholder
- `feedKnowledgeGraph` (PreviewAnalysisService.ts:104) - Placeholder
- `response.cookies.delete` (route.ts:45)

### Dead Code
- `createSkills` (PreviewAnalysisService.ts:206-213) - TODO only
- `createExperience` (PreviewAnalysisService.ts:218-225) - TODO only
- `createEducation` (PreviewAnalysisService.ts:230-237) - TODO only
- `createLanguages` (PreviewAnalysisService.ts:242-249) - TODO only
- `feedKnowledgeGraph` (PreviewAnalysisService.ts:263-274) - TODO only

### Unused Branches
- Error branches: invalid token, not found, already claimed (PreviewAnalysisService.ts:64-77)

### Double Calls
- None observed

### Missing Validations
- No validation of token format (PreviewAnalysisService.ts:63)

### Unexpected Exits
- Multiple error throws on validation failures (PreviewAnalysisService.ts:64-77)

### Exceptions
- Error throws on validation failures (PreviewAnalysisService.ts:64-77)

### Rollback
- None observed - partial data may exist if claim fails

### Errors
- Sentry capture on error (route.ts:50)

---

## FLOW 5: ONBOARDING

### Flow Definition
User completes adaptive onboarding flow with multiple steps.

### Runtime Chain

```
User navigates to /onboarding
  ↓
OnboardingPage renders (page.tsx:13)
  ↓
initializeOnboarding (page.tsx:39)
  ↓
supabase.auth.getUser (page.tsx:42)
  ↓
FlowEngine.initializeFlow (page.tsx:50)
  ↓
OnboardingResolver.resolveOnboarding (FlowEngine.ts:45)
  ↓
UserStateResolver.resolveUserState (OnboardingResolver.ts:23)
  ↓
JourneyResolver.resolveJourney (OnboardingResolver.ts:38)
  ↓
OnboardingResolver.resolveOnboarding (page.tsx:56) - DOUBLE CALL
  ↓
User clicks "Continuer"
  ↓
handleNext (page.tsx:72)
  ↓
saveUserData (page.tsx:92)
  ↓
fetch('/api/auth/sync-user') (page.tsx:170)
  ↓
POST /api/auth/sync-user (sync-user/route.ts:19)
  ↓
FlowEngine.executeFlowAction (page.tsx:96)
  ↓
OnboardingResolver.advanceToNextStep (FlowEngine.ts:114)
  ↓
UserStateResolver.completeStep (OnboardingResolver.ts:76)
  ↓
JourneyResolver.getNextStep (OnboardingResolver.ts:80)
  ↓
UserStateResolver.setCurrentStep (OnboardingResolver.ts:86)
  ↓
If no next step: UserStateResolver.completeOnboarding (OnboardingResolver.ts:91)
  ↓
router.push('/dashboard') (page.tsx:102)
```

### Executed Methods
- `OnboardingPage` (page.tsx:13)
- `initializeOnboarding` (page.tsx:39)
- `supabase.auth.getUser` (page.tsx:42)
- `FlowEngine.initializeFlow` (page.tsx:50)
- `OnboardingResolver.resolveOnboarding` (FlowEngine.ts:45)
- `OnboardingResolver.resolveOnboarding` (page.tsx:56) - DOUBLE CALL
- `UserStateResolver.resolveUserState` (OnboardingResolver.ts:23)
- `JourneyResolver.resolveJourney` (OnboardingResolver.ts:38)
- `handleNext` (page.tsx:72)
- `saveUserData` (page.tsx:92)
- `fetch('/api/auth/sync-user') (page.tsx:170)
- `POST /api/auth/sync-user` (sync-user/route.ts:19)
- `FlowEngine.executeFlowAction` (page.tsx:96)
- `OnboardingResolver.advanceToNextStep` (FlowEngine.ts:114)
- `UserStateResolver.completeStep` (OnboardingResolver.ts:76)
- `JourneyResolver.getNextStep` (OnboardingResolver.ts:80)
- `UserStateResolver.setCurrentStep` (OnboardingResolver.ts:86)
- `UserStateResolver.completeOnboarding` (OnboardingResolver.ts:91)
- `router.push` (page.tsx:102)

### Dead Code
- None observed (resolvers not viewed)

### Unused Branches
- `handleBack` (page.tsx:126-147) - Back button
- `handleSkip` (page.tsx:149-165) - Skip button
- Early redirect if onboarding completed (page.tsx:80-82)

### Double Calls
- `OnboardingResolver.resolveOnboarding` called twice (page.tsx:50, 56)

### Missing Validations
- No validation of fullName (page.tsx:167-185)

### Unexpected Exits
- Early redirect if onboarding completed (page.tsx:80-82)

### Exceptions
- try/catch with setError (page.tsx:83-85)

### Rollback
- None observed

### Errors
- setError on failure (page.tsx:84)

---

## FLOW 6: DASHBOARD

### Flow Definition
User views dashboard with aggregated data from multiple sources.

### Runtime Chain

```
User navigates to /dashboard
  ↓
DashboardPage renders (page.tsx:20)
  ↓
supabase.auth.getUser (page.tsx:22)
  ↓
If not authenticated: redirect('/login') (page.tsx:24)
  ↓
prisma.user.findUnique (page.tsx:29)
  ↓
prisma.cVAnalysis.findMany (page.tsx:40)
  ↓
prisma.careerProfile.findUnique (page.tsx:50)
  ↓
prisma.interviewSession.findMany (page.tsx:55)
  ↓
checkUserQuota (page.tsx:62)
  ↓
previewAnalysisService.getUserClaimedPreview (page.tsx:65)
  ↓
If no careerProfile: redirect('/onboarding') (page.tsx:27)
  ↓
DashboardWidgets renders (page.tsx:213)
```

### Executed Methods
- `DashboardPage` (page.tsx:20)
- `supabase.auth.getUser` (page.tsx:22)
- `prisma.user.findUnique` (page.tsx:29)
- `prisma.cVAnalysis.findMany` (page.tsx:40)
- `prisma.careerProfile.findUnique` (page.tsx:50)
- `prisma.interviewSession.findMany` (page.tsx:55)
- `checkUserQuota` (page.tsx:62)
- `previewAnalysisService.getUserClaimedPreview` (page.tsx:65)
- `redirect` (page.tsx:24, 27)

### Dead Code
- None observed

### Unused Branches
- Redirect branches (page.tsx:24-28)

### Double Calls
- None observed

### Missing Validations
- None observed

### Unexpected Exits
- Early redirects (page.tsx:24-28)

### Exceptions
- None observed

### Rollback
- None observed

### Errors
- None observed

---

## FLOW 7: MATCHING

### Flow Definition
User uploads candidate and job graphs for matching analysis.

### Runtime Chain

```
User navigates to /recruiter
  ↓
RecruiterPage renders (page.tsx:3)
  ↓
RecruiterWorkspace renders (RecruiterWorkspace.tsx:12)
  ↓
User uploads candidate
  ↓
handleCandidateLoaded (RecruiterWorkspace.tsx:21)
  ↓
matchingService.registerCandidate (RecruiterWorkspace.tsx:29)
  ↓
fetch('/api/matching/candidate') (matching.service.ts:7)
  ↓
POST /api/matching/candidate (matching.controller.ts:12)
  ↓
@RateLimitApi() (matching.controller.ts:13)
  ↓
Return placeholder message (matching.controller.ts:18-22)
  ↓
User uploads job
  ↓
handleJobLoaded (RecruiterWorkspace.tsx:35)
  ↓
matchingService.registerJob (RecruiterWorkspace.tsx:43)
  ↓
fetch('/api/matching/job') (matching.service.ts:23)
  ↓
POST /api/matching/job (matching.controller.ts:28)
  ↓
@RateLimitApi() (matching.controller.ts:29)
  ↓
Return placeholder message (matching.controller.ts:34-38)
```

### Executed Methods
- `RecruiterPage` (page.tsx:3)
- `RecruiterWorkspace` (RecruiterWorkspace.tsx:12)
- `handleCandidateLoaded` (RecruiterWorkspace.tsx:21)
- `matchingService.registerCandidate` (RecruiterWorkspace.tsx:29)
- `fetch('/api/matching/candidate') (matching.service.ts:7)
- `POST /api/matching/candidate` (matching.controller.ts:12)
- `handleJobLoaded` (RecruiterWorkspace.tsx:35)
- `matchingService.registerJob` (RecruiterWorkspace.tsx:43)
- `fetch('/api/matching/job') (matching.service.ts:23)
- `POST /api/matching/job` (matching.controller.ts:28)

### Dead Code
- `registerCandidate` (matching.controller.ts:12-26) - Returns placeholder
- `registerJob` (matching.controller.ts:28-42) - Returns placeholder

### Unused Branches
- `handleReportGenerated` (RecruiterWorkspace.tsx:49-51) - Report generation

### Double Calls
- None observed

### Missing Validations
- No validation of graph structure (RecruiterWorkspace.tsx:21-47)

### Unexpected Exits
- None observed

### Exceptions
- try/catch with console.error (RecruiterWorkspace.tsx:30-32, 44-46)

### Rollback
- None observed

### Errors
- console.error on failure (RecruiterWorkspace.tsx:31, 45)

---

## FLOW 8: SEARCH

### Flow Definition
User searches for candidates or jobs using semantic search.

### Runtime Chain

```
User navigates to /search
  ↓
SearchPage renders (page.tsx:3)
  ↓
SearchWorkspace renders (SearchWorkspace.tsx:9)
  ↓
User searches candidates
  ↓
searchService.searchCandidates (search.service.ts:6)
  ↓
fetch('/api/search/candidates') (search.service.ts:7)
  ↓
POST /api/search/candidates (search.controller.ts:12)
  ↓
@RateLimitSearch() (search.controller.ts:13)
  ↓
graphSearchService.searchCandidatesByNeighborhood (search.controller.ts:20)
  ↓
Format results (search.controller.ts:25-34)
  ↓
JSON response (search.controller.ts:31)
```

### Executed Methods
- `SearchPage` (page.tsx:3)
- `SearchWorkspace` (SearchWorkspace.tsx:9)
- `searchCandidates` (search.service.ts:6)
- `fetch('/api/search/candidates') (search.service.ts:7)
- `POST /api/search/candidates` (search.controller.ts:12)
- `graphSearchService.searchCandidatesByNeighborhood` (search.controller.ts:20)

### Dead Code
- GraphSearchService implementation not viewed

### Unused Branches
- `findRelatedSkills` (search.controller.ts:124-138) - Returns placeholder

### Double Calls
- None observed

### Missing Validations
- Basic validation only (search.controller.ts:16-18)

### Unexpected Exits
- None observed

### Exceptions
- try/catch with BadRequestException (search.controller.ts:35-37)

### Rollback
- None observed

### Errors
- throw Error on failure (search.service.ts:15-17)

---

## FLOW 9: COPILOT

### Flow Definition
User interacts with AI copilot for recruitment assistance.

### Runtime Chain

```
User navigates to /copilot
  ↓
CopilotPage renders (page.tsx:3)
  ↓
ChatWorkspace renders (ChatWorkspace.tsx:12)
  ↓
User sends message
  ↓
handleSendMessage (ChatWorkspace.tsx:28)
  ↓
copilotService.processMessage (ChatWorkspace.tsx:42)
  ↓
fetch('/api/copilot/message') (copilot.service.ts:7)
  ↓
POST /api/copilot/message (copilot.controller.ts:9)
  ↓
@RateLimitCopilot() (copilot.controller.ts:10)
  ↓
copilotService.processMessage (copilot.service.ts:23)
  ↓
cacheService.generateKey (copilot.service.ts:24)
  ↓
cacheService.get (copilot.service.ts:27)
  ↓
If cached: return cached (copilot.service.ts:28-30)
  ↓
promptInterpreter.interpret (copilot.service.ts:32)
  ↓
conversationMemory.getOrCreateContext (copilot.service.ts:33)
  ↓
graphReasoningEngine.answerCandidateQuestion (copilot.service.ts:37)
  ↓
responseBuilder.buildResponse (copilot.service.ts:67)
  ↓
conversationMemory.addMessage (copilot.service.ts:69, 75)
  ↓
cacheService.set (copilot.service.ts:84)
  ↓
JSON response (copilot.controller.ts:14)
```

### Executed Methods
- `CopilotPage` (page.tsx:3)
- `ChatWorkspace` (ChatWorkspace.tsx:12)
- `handleSendMessage` (ChatWorkspace.tsx:28)
- `copilotService.processMessage` (ChatWorkspace.tsx:42)
- `fetch('/api/copilot/message') (copilot.service.ts:7)
- `POST /api/copilot/message` (copilot.controller.ts:9)
- `copilotService.processMessage` (copilot.service.ts:23)
- `cacheService.generateKey` (copilot.service.ts:24)
- `cacheService.get` (copilot.service.ts:27)
- `promptInterpreter.interpret` (copilot.service.ts:32)
- `conversationMemory.getOrCreateContext` (copilot.service.ts:33)
- `graphReasoningEngine.answerCandidateQuestion` (copilot.service.ts:37)
- `responseBuilder.buildResponse` (copilot.service.ts:67)
- `conversationMemory.addMessage` (copilot.service.ts:69, 75)
- `cacheService.set` (copilot.service.ts:84)

### Dead Code
- Graph services not viewed

### Unused Branches
- Switch statement for different intents (copilot.service.ts:49-65)

### Double Calls
- None observed

### Missing Validations
- No validation of message content (ChatWorkspace.tsx:29)

### Unexpected Exits
- Early return if input empty (ChatWorkspace.tsx:29)

### Exceptions
- try/catch with error message (ChatWorkspace.tsx:54-60)

### Rollback
- None observed

### Errors
- Error message on failure (ChatWorkspace.tsx:55-58)

---

## FLOW 10: RECRUITER

### Flow Definition
User accesses recruiter workspace for matching and candidate management.

### Runtime Chain
- **Same as Flow 7 (Matching)** - RecruiterPage just renders RecruiterWorkspace

### Executed Methods
- **Same as Flow 7 (Matching)**

### Dead Code
- **Same as Flow 7 (Matching)**

### Unused Branches
- **Same as Flow 7 (Matching)**

### Double Calls
- **Same as Flow 7 (Matching)**

### Missing Validations
- **Same as Flow 7 (Matching)**

### Unexpected Exits
- **Same as Flow 7 (Matching)**

### Exceptions
- **Same as Flow 7 (Matching)**

### Rollback
- **Same as Flow 7 (Matching)**

### Errors
- **Same as Flow 7 (Matching)**

---

## SUMMARY

### Total Flows: 10
### Total Executed Methods: 80+
### Total Dead Code: 8
### Total Unused Branches: 12
### Total Double Calls: 1
### Total Missing Validations: 5
### Total Unexpected Exits: 5
### Total Exceptions: 8
### Total Rollback: 0
### Total Errors: 8

### Flow Coverage
- **Fully Observed:** 8/10 (80%)
- **Partially Observed:** 2/10 (20%)
- **Not Observed:** 0/10 (0%)

**Evidence Source:** RC37.1 runtime reconstruction reports
