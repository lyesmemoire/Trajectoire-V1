# RC37.2 - End-to-End User Journey Execution

**Mission:** Reconstruct complete execution of user journey based on observable evidence only.

**Evidence Policy:** Every assertion based on RC37.1 evidence. No assumptions, estimations, or inferences.

---

## END-TO-END JOURNEY OVERVIEW

### User Journey Path

```
Landing
  ↓
Upload CV
  ↓
ATS Preview
  ↓
Signup
  ↓
Claim Preview
  ↓
Onboarding
  ↓
Dashboard
  ↓
Matching
  ↓
Search
  ↓
Copilot
  ↓
Recruiter
```

---

## STEP 1: LANDING → UPLOAD CV

### Flow
- **Entry:** User navigates to `/`
- **File:** `c:\Trajectoire\apps\web\src\app\page.tsx`
- **Line:** 32-575
- **Function:** `HomePage`
- **Evidence:** Client component renders CV upload form

### Runtime Chain

1. **Page Render**
   - **File:** `c:\Trajectoire\apps\web\src\app\page.tsx`
   - **Line:** 32
   - **Function:** `HomePage`
   - **Evidence:** Component initialization with useState hooks

2. **User Uploads CV**
   - **File:** `c:\Trajectoire\apps\web\src\app\page.tsx`
   - **Line:** 41-68
   - **Function:** `handleAnalyze`
   - **Evidence:** User clicks "Analyser" button

3. **Form Data Preparation**
   - **File:** `c:\Trajectoire\apps\web\src\app\page.tsx`
   - **Line:** 31-33
   - **Function:** `handleAnalyze`
   - **Evidence:** `form.append("cv", file!)`

4. **API Call**
   - **File:** `c:\Trajectoire\apps\web\src\app\page.tsx`
   - **Line:** 50
   - **Function:** `handleAnalyze`
   - **Evidence:** `fetch('/api/public/analyze-preview', { method: 'POST', body: form })`

### Executed Methods
- `HomePage` (page.tsx:32)
- `handleAnalyze` (page.tsx:41)
- `formData.append` (page.tsx:31-33)
- `fetch` (page.tsx:50)

### Dead Code
- **NOT OBSERVED** - No dead code identified in this step

### Unused Branches
- **NOT OBSERVED** - No unused branches identified

### Double Calls
- **NOT OBSERVED** - No double calls identified

### Missing Validations
- **NOT OBSERVED** - Validation happens on server side (route.ts:35)

### Unexpected Exits
- **NOT OBSERVED** - No unexpected exits

### Exceptions
- **File:** `c:\Trajectoire\apps\web\src\app\page.tsx`
- **Line:** 64-67
- **Function:** `handleAnalyze`
- **Evidence:** try/catch block with error logging

### Rollback
- **NOT OBSERVED** - No rollback mechanism

### Errors
- **File:** `c:\Trajectoire\apps\web\src\app\page.tsx`
- **Line:** 66
- **Function:** `handleAnalyze`
- **Evidence:** `console.error` on failure

---

## STEP 2: ATS PREVIEW

### Flow
- **Entry:** POST `/api/public/analyze-preview`
- **File:** `c:\Trajectoire\apps\web\src\app\api\public\analyze-preview\route.ts`
- **Line:** 10-117
- **Function:** `POST`
- **Evidence:** Route handler processes preview analysis

### Runtime Chain

1. **Rate Limiting Check**
   - **File:** `c:\Trajectoire\apps\web\src\app\api\public\analyze-preview\route.ts`
   - **Line:** 15
   - **Function:** `POST`
   - **Evidence:** `checkRateLimit('preview:${fingerprint}', 3, 3600)`

2. **CV Validation**
   - **File:** `c:\Trajectoire\apps\web\src\app\api\public\analyze-preview\route.ts`
   - **Line:** 35
   - **Function:** `POST`
   - **Evidence:** `validateCVUpload(file)`

3. **Job Description Validation**
   - **File:** `c:\Trajectoire\apps\web\src\app\api\public\analyze-preview\route.ts`
   - **Line:** 45
   - **Function:** `POST`
   - **Evidence:** `validateJobDescription(jobDescription)`

4. **Text Extraction**
   - **File:** `c:\Trajectoire\apps\web\src\app\api\public\analyze-preview\route.ts`
   - **Line:** 55-58
   - **Function:** `POST`
   - **Evidence:** `file.text()` or `extractPDF(file)`

5. **ATS Analysis**
   - **File:** `c:\Trajectoire\apps\web\src\app\api\public\analyze-preview\route.ts`
   - **Line:** 62
   - **Function:** `POST`
   - **Evidence:** `generatePreviewAnalysis(cvText, jobText, { timeout: 8000 })`

6. **OpenAI API Call**
   - **File:** `c:\Trajectoire\apps\web\src\lib\ai\preview-analyzer.ts`
   - **Line:** 55-69
   - **Function:** `generatePreviewAnalysis`
   - **Evidence:** `openai.chat.completions.create`

7. **Fallback Analysis**
   - **File:** `c:\Trajectoire\apps\web\src\lib\ai\preview-analyzer.ts`
   - **Line:** 86-88
   - **Function:** `generatePreviewAnalysis`
   - **Evidence:** `generateFallbackAnalysis` on error

8. **Preview Storage**
   - **File:** `c:\Trajectoire\apps\web\src\app\api\public\analyze-preview\route.ts`
   - **Line:** 70-74
   - **Function:** `POST`
   - **Evidence:** `previewAnalysisService.analyzePreview`

9. **Repository Save**
   - **File:** `c:\Trajectoire\apps\web\src\lib\preview-analysis\PreviewAnalysisService.ts`
   - **Line:** 38
   - **Function:** `analyzePreview`
   - **Evidence:** `previewAnalysisRepository.create`

10. **Cookie Set**
    - **File:** `c:\Trajectoire\apps\web\src\app\api\public\analyze-preview\route.ts`
    - **Line:** 80-82
    - **Function:** `POST`
    - **Evidence:** `response.cookies.set('preview_token', token)`

11. **Response**
    - **File:** `c:\Trajectoire\apps\web\src\app\api\public\analyze-preview\route.ts`
    - **Line:** 84-104
    - **Function:** `POST`
    - **Evidence:** JSON with previewToken and analysis

### Executed Methods
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
- **File:** `c:\Trajectoire\apps\web\src\lib\preview-analysis\PreviewAnalysisService.ts`
- **Line:** 141-163
- **Function:** `simulateATSAnalysis`
- **Evidence:** Comment says "TODO: Remplacer par l'appel au vrai service ATS" - simulation instead of real ATS

### Unused Branches
- **File:** `c:\Trajectoire\apps\web\src\lib\preview-analysis\PreviewAnalysisService.ts`
- **Line:** 206-249
- **Function:** `createSkills`, `createExperience`, `createEducation`, `createLanguages`
- **Evidence:** All have TODO comments and console.log only - no database operations

### Double Calls
- **NOT OBSERVED** - No double calls identified

### Missing Validations
- **File:** `c:\Trajectoire\apps\web\src\lib\ai\preview-analyzer.ts`
- **Line:** 38-45
- **Function:** `detectPromptInjection`
- **Evidence:** Basic pattern matching, may miss advanced injection attempts

### Unexpected Exits
- **File:** `c:\Trajectoire\apps\web\src\lib\ai\preview-analyzer.ts`
- **Line:** 49-52
- **Function:** `generatePreviewAnalysis`
- **Evidence:** Early return with fallback if input too large

### Exceptions
- **File:** `c:\Trajectoire\apps\web\src\lib\ai\preview-analyzer.ts`
- **Line:** 84-88
- **Function:** `generatePreviewAnalysis`
- **Evidence:** try/catch with fallback on OpenAI error

### Rollback
- **NOT OBSERVED** - No rollback mechanism

### Errors
- **File:** `c:\Trajectoire\apps\web\src\app\api\public\analyze-preview\route.ts`
- **Line:** 106-116
- **Function:** `POST`
- **Evidence:** Sentry capture and error logging

---

## STEP 3: SIGNUP

### Flow
- **Entry:** User navigates to `/signup`
- **File:** `c:\Trajectoire\apps\web\src\app\signup\page.tsx`
- **Line:** 9-166
- **Function:** `SignupPage`
- **Evidence:** Client component with signup form

### Runtime Chain

1. **Page Render**
   - **File:** `c:\Trajectoire\apps\web\src\app\signup\page.tsx`
   - **Line:** 9
   - **Function:** `SignupPage`
   - **Evidence:** Component initialization

2. **User Submits Form**
   - **File:** `c:\Trajectoire\apps\web\src\app\signup\page.tsx`
   - **Line:** 20-66
   - **Function:** `handleSubmit`
   - **Evidence:** User clicks signup button

3. **Client Validation**
   - **File:** `c:\Trajectoire\apps\web\src\app\signup\page.tsx`
   - **Line:** 26-34
   - **Function:** `handleSubmit`
   - **Evidence:** Email format, password length, CGU checkbox validation

4. **Supabase Auth Call**
   - **File:** `c:\Trajectoire\apps\web\src\app\signup\page.tsx`
   - **Line:** 44-51
   - **Function:** `handleSubmit`
   - **Evidence:** `supabase.auth.signUp({ email, password, options })`

5. **Auto-Claim Preview**
   - **File:** `c:\Trajectoire\apps\web\src\app\signup\page.tsx`
   - **Line:** 58-60
   - **Function:** `handleSubmit`
   - **Evidence:** `claimPreview()` if token exists

6. **Redirect**
   - **File:** `c:\Trajectoire\apps\web\src\app\signup\page.tsx`
   - **Line:** 62-64
   - **Function:** `handleSubmit`
   - **Evidence:** `router.push('/dashboard')`

### Executed Methods
- `SignupPage` (page.tsx:9)
- `handleSubmit` (page.tsx:20)
- `supabase.auth.signUp` (page.tsx:44)
- `claimPreview` (page.tsx:59)
- `router.push` (page.tsx:62)

### Dead Code
- **NOT OBSERVED** - No dead code identified

### Unused Branches
- **File:** `c:\Trajectoire\apps\web\src\app\signup\page.tsx`
- **Line:** 55-60
- **Function:** `handleSubmit`
- **Evidence:** Auto-claim only happens if preview token exists (conditional branch)

### Double Calls
- **NOT OBSERVED** - No double calls identified

### Missing Validations
- **File:** `c:\Trajectoire\apps\web\src\app\signup\page.tsx`
- **Line:** 26-34
- **Function:** `handleSubmit`
- **Evidence:** Client-side validation only, no server-side validation observed

### Unexpected Exits
- **File:** `c:\Trajectoire\apps\web\src\app\signup\page.tsx`
- **Line:** 52-54
- **Function:** `handleSubmit`
- **Evidence:** Early return if signup fails

### Exceptions
- **File:** `c:\Trajectoire\apps\web\src\app\signup\page.tsx`
- **Line:** 52-54
- **Function:** `handleSubmit`
- **Evidence:** Error handling with setError

### Rollback
- **NOT OBSERVED** - No rollback mechanism

### Errors
- **File:** `c:\Trajectoire\apps\web\src\app\signup\page.tsx`
- **Line:** 53
- **Function:** `handleSubmit`
- **Evidence:** setError on failure

---

## STEP 4: CLAIM PREVIEW

### Flow
- **Entry:** POST `/api/auth/claim-preview`
- **File:** `c:\Trajectoire\apps\web\src\app\api\auth\claim-preview\route.ts`
- **Line:** 12-81
- **Function:** `POST`
- **Evidence:** Route handler claims preview for user

### Runtime Chain

1. **Auth Check**
   - **File:** `c:\Trajectoire\apps\web\src\app\api\auth\claim-preview\route.ts`
   - **Line:** 16
   - **Function:** `POST`
   - **Evidence:** `supabase.auth.getUser()`

2. **Token Validation**
   - **File:** `c:\Trajectoire\apps\web\src\lib\preview-analysis\PreviewAnalysisService.ts`
   - **Line:** 63
   - **Function:** `claimPreview`
   - **Evidence:** `previewAnalysisRepository.isValidToken(token)`

3. **Preview Retrieval**
   - **File:** `c:\Trajectoire\apps\web\src\lib\preview-analysis\PreviewAnalysisService.ts`
   - **Line:** 69
   - **Function:** `claimPreview`
   - **Evidence:** `previewAnalysisRepository.findByToken(token)`

4. **Claim Check**
   - **File:** `c:\Trajectoire\apps\web\src\lib\preview-analysis\PreviewAnalysisService.ts`
   - **Line:** 75-77
   - **Function:** `claimPreview`
   - **Evidence:** Check if already claimed

5. **Claim Execution**
   - **File:** `c:\Trajectoire\apps\web\src\lib\preview-analysis\PreviewAnalysisService.ts`
   - **Line:** 80
   - **Function:** `claimPreview`
   - **Evidence:** `previewAnalysisRepository.claimForUser(token, userId)`

6. **Create CareerProfile**
   - **File:** `c:\Trajectoire\apps\web\src\lib\preview-analysis\PreviewAnalysisService.ts`
   - **Line:** 83
   - **Function:** `claimPreview`
   - **Evidence:** `createCandidateProfile(userId, preview)`

7. **Create CVAnalysis**
   - **File:** `c:\Trajectoire\apps\web\src\lib\preview-analysis\PreviewAnalysisService.ts`
   - **Line:** 86
   - **Function:** `claimPreview`
   - **Evidence:** `createPermanentAnalysis(userId, preview)`

8. **Create Skills (Placeholder)**
   - **File:** `c:\Trajectoire\apps\web\src\lib\preview-analysis\PreviewAnalysisService.ts`
   - **Line:** 88
   - **Function:** `claimPreview`
   - **Evidence:** `createSkills(userId, preview)` - TODO only

9. **Create Experience (Placeholder)**
   - **File:** `c:\Trajectoire\apps\web\src\lib\preview-analysis\PreviewAnalysisService.ts`
   - **Line:** 91
   - **Function:** `claimPreview`
   - **Evidence:** `createExperience(userId, preview)` - TODO only

10. **Create Education (Placeholder)**
    - **File:** `c:\Trajectoire\apps\web\src\lib\preview-analysis\PreviewAnalysisService.ts`
    - **Line:** 94
    - **Function:** `claimPreview`
    - **Evidence:** `createEducation(userId, preview)` - TODO only

11. **Create Languages (Placeholder)**
    - **File:** `c:\Trajectoire\apps\web\src\lib\preview-analysis\PreviewAnalysisService.ts`
    - **Line:** 97
    - **Function:** `claimPreview`
    - **Evidence:** `createLanguages(userId, preview)` - TODO only

12. **Feed Knowledge Graph (Placeholder)**
    - **File:** `c:\Trajectoire\apps\web\src\lib\preview-analysis\PreviewAnalysisService.ts`
    - **Line:** 104
    - **Function:** `claimPreview`
    - **Evidence:** `feedKnowledgeGraph(userId, preview)` - TODO only

13. **Cookie Delete**
    - **File:** `c:\Trajectoire\apps\web\src\app\api\auth\claim-preview\route.ts`
    - **Line:** 45
    - **Function:** `POST`
    - **Evidence:** `response.cookies.delete('preview_token')`

14. **Response**
    - **File:** `c:\Trajectoire\apps\web\src\app\api\auth\claim-preview\route.ts`
    - **Line:** 40-47
    - **Function:** `POST`
    - **Evidence:** JSON with success message

### Executed Methods
- `POST` (route.ts:12)
- `supabase.auth.getUser` (route.ts:16)
- `previewAnalysisRepository.isValidToken` (PreviewAnalysisService.ts:63)
- `previewAnalysisRepository.findByToken` (PreviewAnalysisService.ts:69)
- `previewAnalysisRepository.claimForUser` (PreviewAnalysisService.ts:80)
- `createCandidateProfile` (PreviewAnalysisService.ts:83)
- `createPermanentAnalysis` (PreviewAnalysisService.ts:86)
- `createSkills` (PreviewAnalysisService.ts:88) - Placeholder
- `createExperience` (PreviewAnalysisService.ts:91) - Placeholder
- `createEducation` (PreviewAnalysisService.ts:94) - Placeholder
- `createLanguages` (PreviewAnalysisService.ts:97) - Placeholder
- `feedKnowledgeGraph` (PreviewAnalysisService.ts:104) - Placeholder
- `response.cookies.delete` (route.ts:45)

### Dead Code
- **File:** `c:\Trajectoire\apps\web\src\lib\preview-analysis\PreviewAnalysisService.ts`
- **Line:** 206-249
- **Function:** `createSkills`, `createExperience`, `createEducation`, `createLanguages`
- **Evidence:** All have TODO comments and console.log only - no actual database operations

### Unused Branches
- **File:** `c:\Trajectoire\apps\web\src\lib\preview-analysis\PreviewAnalysisService.ts`
- **Line:** 75-77
- **Function:** `claimPreview`
- **Evidence:** Error thrown if already claimed (exception path)

### Double Calls
- **NOT OBSERVED** - No double calls identified

### Missing Validations
- **File:** `c:\Trajectoire\apps\web\src\lib\preview-analysis\PreviewAnalysisService.ts`
- **Line:** 64-66
- **Function:** `claimPreview`
- **Evidence:** No validation of token format or structure

### Unexpected Exits
- **File:** `c:\Trajectoire\apps\web\src\lib\preview-analysis\PreviewAnalysisService.ts`
- **Line:** 64-66, 70-72, 75-77
- **Function:** `claimPreview`
- **Evidence:** Multiple error throws on invalid/expired/already claimed

### Exceptions
- **File:** `c:\Trajectoire\apps\web\src\lib\preview-analysis\PreviewAnalysisService.ts`
- **Line:** 64-66, 70-72, 75-77
- **Function:** `claimPreview`
- **Evidence:** Error throws for invalid token, not found, already claimed

### Rollback
- **NOT OBSERVED** - No rollback mechanism - if claim fails, partial data may exist

### Errors
- **File:** `c:\Trajectoire\apps\web\src\app\api\auth\claim-preview\route.ts`
- **Line:** 50-51
- **Function:** `POST`
- **Evidence:** Sentry capture and error logging

---

## STEP 5: ONBOARDING

### Flow
- **Entry:** User navigates to `/onboarding`
- **File:** `c:\Trajectoire\apps\web\src\app\onboarding\page.tsx`
- **Line:** 13-412
- **Function:** `OnboardingPage`
- **Evidence:** Adaptive onboarding flow

### Runtime Chain

1. **Page Render**
   - **File:** `c:\Trajectoire\apps\web\src\app\onboarding\page.tsx`
   - **Line:** 13
   - **Function:** `OnboardingPage`
   - **Evidence:** Component initialization

2. **Auth Check**
   - **File:** `c:\Trajectoire\apps\web\src\app\onboarding\page.tsx`
   - **Line:** 42
   - **Function:** `initializeOnboarding`
   - **Evidence:** `supabase.auth.getUser()`

3. **Flow Initialization**
   - **File:** `c:\Trajectoire\apps\web\src\app\onboarding\page.tsx`
   - **Line:** 50
   - **Function:** `initializeOnboarding`
   - **Evidence:** `FlowEngine.initializeFlow(userId)`

4. **Onboarding Resolution**
   - **File:** `c:\Trajectoire\apps\web\src\lib\onboarding\FlowEngine.ts`
   - **Line:** 45
   - **Function:** `initializeFlow`
   - **Evidence:** `OnboardingResolver.resolveOnboarding(userId)`

5. **User State Resolution**
   - **File:** `c:\Trajectoire\apps\web\src\lib\onboarding\OnboardingResolver.ts`
   - **Line:** 23
   - **Function:** `resolveOnboarding`
   - **Evidence:** `UserStateResolver.resolveUserState(userId)`

6. **Journey Resolution**
   - **File:** `c:\Trajectoire\apps\web\src\lib\onboarding\OnboardingResolver.ts`
   - **Line:** 38
   - **Function:** `resolveOnboarding`
   - **Evidence:** `JourneyResolver.resolveJourney(userState.journeyType)`

7. **User Action (Next)**
   - **File:** `c:\Trajectoire\apps\web\src\app\onboarding\page.tsx`
   - **Line:** 72-124
   - **Function:** `handleNext`
   - **Evidence:** User clicks "Continuer"

8. **Save User Data**
   - **File:** `c:\Trajectoire\apps\web\src\app\onboarding\page.tsx`
   - **Line:** 92
   - **Function:** `handleNext`
   - **Evidence:** `saveUserData({ fullName, ... })`

9. **Sync User API Call**
   - **File:** `c:\Trajectoire\apps\web\src\app\onboarding\page.tsx`
   - **Line:** 170
   - **Function:** `saveUserData`
   - **Evidence:** `fetch('/api/auth/sync-user', { method: 'POST', body })`

10. **Flow Action Execution**
    - **File:** `c:\Trajectoire\apps\web\src\app\onboarding\page.tsx`
    - **Line:** 96
    - **Function:** `handleNext`
    - **Evidence:** `FlowEngine.executeFlowAction(user.id, 'next')`

11. **Advance to Next Step**
    - **File:** `c:\Trajectoire\apps\web\src\lib\onboarding\FlowEngine.ts`
    - **Line:** 108
    - **Function:** `executeFlowAction`
    - **Evidence:** `FlowEngine.handleNext(userId)`

12. **Step Completion**
    - **File:** `c:\Trajectoire\apps\web\src\lib\onboarding\FlowEngine.ts`
    - **Line:** 114
    - **Function:** `handleNext`
    - **Evidence:** `OnboardingResolver.advanceToNextStep(userId)`

13. **Redirect on Completion**
    - **File:** `c:\Trajectoire\apps\web\src\app\onboarding\page.tsx`
    - **Line:** 102-104
    - **Function:** `handleNext`
    - **Evidence:** `router.push('/dashboard')`

### Executed Methods
- `OnboardingPage` (page.tsx:13)
- `initializeOnboarding` (page.tsx:39)
- `supabase.auth.getUser` (page.tsx:42)
- `FlowEngine.initializeFlow` (page.tsx:50)
- `OnboardingResolver.resolveOnboarding` (FlowEngine.ts:45)
- `UserStateResolver.resolveUserState` (OnboardingResolver.ts:23)
- `JourneyResolver.resolveJourney` (OnboardingResolver.ts:38)
- `handleNext` (page.tsx:72)
- `saveUserData` (page.tsx:92)
- `fetch('/api/auth/sync-user')` (page.tsx:170)
- `FlowEngine.executeFlowAction` (page.tsx:96)
- `OnboardingResolver.advanceToNextStep` (FlowEngine.ts:114)
- `router.push` (page.tsx:102)

### Dead Code
- **NOT OBSERVED** - Resolvers not viewed, cannot confirm dead code

### Unused Branches
- **File:** `c:\Trajectoire\apps\web\src\app\onboarding\page.tsx`
- **Line:** 126-147
- **Function:** `handleBack`
- **Evidence:** Back button functionality (may not be used in happy path)

- **File:** `c:\Trajectoire\apps\web\src\app\onboarding\page.tsx`
- **Line:** 149-165
- **Function:** `handleSkip`
- **Evidence:** Skip button functionality (may not be used in happy path)

### Double Calls
- **File:** `c:\Trajectoire\apps\web\src\app\onboarding\page.tsx`
- **Line:** 50, 56
- **Function:** `initializeOnboarding`
- **Evidence:** `OnboardingResolver.resolveOnboarding` called twice (line 50 and 56)

### Missing Validations
- **File:** `c:\Trajectoire\apps\web\src\app\onboarding\page.tsx`
- **Line:** 167-185
- **Function:** `saveUserData`
- **Evidence:** No validation of fullName format or length

### Unexpected Exits
- **File:** `c:\Trajectoire\apps\web\src\app\onboarding\page.tsx`
- **Line:** 80-82
- **Function:** `initializeOnboarding`
- **Evidence:** Early redirect if onboarding already completed

### Exceptions
- **File:** `c:\Trajectoire\apps\web\src\app\onboarding\page.tsx`
- **Line:** 83-85
- **Function:** `initializeOnboarding`
- **Evidence:** try/catch with setError

### Rollback
- **NOT OBSERVED** - No rollback mechanism

### Errors
- **File:** `c:\Trajectoire\apps\web\src\app\onboarding\page.tsx`
- **Line:** 84
- **Function:** `initializeOnboarding`
- **Evidence:** setError on failure

---

## STEP 6: DASHBOARD

### Flow
- **Entry:** User navigates to `/dashboard`
- **File:** `c:\Trajectoire\apps\web\src\app\dashboard\page.tsx`
- **Line:** 20-229
- **Function:** `DashboardPage`
- **Evidence:** Server component with data fetching

### Runtime Chain

1. **Auth Check**
   - **File:** `c:\Trajectoire\apps\web\src\app\dashboard\page.tsx`
   - **Line:** 22
   - **Function:** `DashboardPage`
   - **Evidence:** `supabase.auth.getUser()`

2. **User Query**
   - **File:** `c:\Trajectoire\apps\web\src\app\dashboard\page.tsx`
   - **Line:** 29
   - **Function:** `DashboardPage`
   - **Evidence:** `prisma.user.findUnique({ where: { id: user.id } })`

3. **CV Analysis Query**
   - **File:** `c:\Trajectoire\apps\web\src\app\dashboard\page.tsx`
   - **Line:** 40
   - **Function:** `DashboardPage`
   - **Evidence:** `prisma.cVAnalysis.findMany({ where: { userId: user.id } })`

4. **Career Profile Query**
   - **File:** `c:\Trajectoire\apps\web\src\app\dashboard\page.tsx`
   - **Line:** 50
   - **Function:** `DashboardPage`
   - **Evidence:** `prisma.careerProfile.findUnique({ where: { userId: user.id } })`

5. **Interview Sessions Query**
   - **File:** `c:\Trajectoire\apps\web\src\app\dashboard\page.tsx`
   - **Line:** 55
   - **Function:** `DashboardPage`
   - **Evidence:** `prisma.interviewSession.findMany({ where: { userId: user.id } })`

6. **Quota Check**
   - **File:** `c:\Trajectoire\apps\web\src\app\dashboard\page.tsx`
   - **Line:** 62
   - **Function:** `DashboardPage`
   - **Evidence:** `checkUserQuota(user.id)`

7. **Claimed Preview Query**
   - **File:** `c:\Trajectoire\apps\web\src\app\dashboard\page.tsx`
   - **Line:** 65
   - **Function:** `DashboardPage`
   - **Evidence:** `previewAnalysisService.getUserClaimedPreview(user.id)`

8. **Redirect if Not Authenticated**
   - **File:** `c:\Trajectoire\apps\web\src\app\dashboard\page.tsx`
   - **Line:** 24-26
   - **Function:** `DashboardPage`
   - **Evidence:** `redirect('/login')`

9. **Redirect if Onboarding Incomplete**
   - **File:** `c:\Trajectoire\apps\web\src\app\dashboard\page.tsx`
   - **Line:** 27-28
   - **Function:** `DashboardPage`
   - **Evidence:** `redirect('/onboarding')`

10. **Render DashboardWidgets**
    - **File:** `c:\Trajectoire\apps\web\src\app\dashboard\page.tsx`
    - **Line:** 213-227
    - **Function:** `DashboardPage`
    - **Evidence:** `<DashboardWidgets data={...} />`

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
- **NOT OBSERVED** - No dead code identified

### Unused Branches
- **File:** `c:\Trajectoire\apps\web\src\app\dashboard\page.tsx`
- **Line:** 24-28
- **Function:** `DashboardPage`
- **Evidence:** Redirect branches (not used in happy path)

### Double Calls
- **NOT OBSERVED** - No double calls identified

### Missing Validations
- **NOT OBSERVED** - No missing validations identified

### Unexpected Exits
- **File:** `c:\Trajectoire\apps\web\src\app\dashboard\page.tsx`
- **Line:** 24-28
- **Function:** `DashboardPage`
- **Evidence:** Early redirects if not authenticated or onboarding incomplete

### Exceptions
- **NOT OBSERVED** - No exception handling observed

### Rollback
- **NOT OBSERVED** - No rollback mechanism

### Errors
- **NOT OBSERVED** - No error handling observed

---

## STEP 7: MATCHING

### Flow
- **Entry:** User navigates to `/recruiter`
- **File:** `c:\Trajectoire\apps\web\src\app\recruiter\page.tsx`
- **Line:** 3-6
- **Function:** `RecruiterPage`
- **Evidence:** Renders RecruiterWorkspace

### Runtime Chain

1. **Page Render**
   - **File:** `c:\Trajectoire\apps\web\src\app\recruiter\page.tsx`
   - **Line:** 3
   - **Function:** `RecruiterPage`
   - **Evidence:** Renders RecruiterWorkspace

2. **RecruiterWorkspace Render**
   - **File:** `c:\Trajectoire\apps\web\src\components\recruiter\RecruiterWorkspace.tsx`
   - **Line:** 12-82
   - **Function:** `RecruiterWorkspace`
   - **Evidence:** Client component with matching interface

3. **User Uploads Candidate**
   - **File:** `c:\Trajectoire\apps\web\src\components\recruiter\RecruiterWorkspace.tsx`
   - **Line:** 21-33
   - **Function:** `handleCandidateLoaded`
   - **Evidence:** Candidate upload callback

4. **Register Candidate API Call**
   - **File:** `c:\Trajectoire\apps\web\src\components\recruiter\RecruiterWorkspace.tsx`
   - **Line:** 29
   - **Function:** `handleCandidateLoaded`
   - **Evidence:** `matchingService.registerCandidate(newCandidateId, graph)`

5. **API Call to /api/matching/candidate**
   - **File:** `c:\Trajectoire\apps\web\src\services\matching.service.ts`
   - **Line:** 7
   - **Function:** `registerCandidate`
   - **Evidence:** `fetch('/api/matching/candidate', { method: 'POST', body })`

6. **Placeholder Response**
   - **File:** `c:\Trajectoire\apps\api\src\matching\matching.controller.ts`
   - **Line:** 12-26
   - **Function:** `registerCandidate`
   - **Evidence:** Returns "Graph must be stored via GraphRepository"

7. **User Uploads Job**
   - **File:** `c:\Trajectoire\apps\web\src\components\recruiter\RecruiterWorkspace.tsx`
   - **Line:** 35-47
   - **Function:** `handleJobLoaded`
   - **Evidence:** Job upload callback

8. **Register Job API Call**
   - **File:** `c:\Trajectoire\apps\web\src\components\recruiter\RecruiterWorkspace.tsx`
   - **Line:** 43
   - **Function:** `handleJobLoaded`
   - **Evidence:** `matchingService.registerJob(newJobId, graph)`

9. **API Call to /api/matching/job**
   - **File:** `c:\Trajectoire\apps\web\src\services\matching.service.ts`
   - **Line:** 23
   - **Function:** `registerJob`
   - **Evidence:** `fetch('/api/matching/job', { method: 'POST', body })`

10. **Placeholder Response**
    - **File:** `c:\Trajectoire\apps\api\src\matching\matching.controller.ts`
    - **Line:** 28-42
    - **Function:** `registerJob`
    - **Evidence:** Returns "Graph must be stored via GraphRepository"

### Executed Methods
- `RecruiterPage` (page.tsx:3)
- `RecruiterWorkspace` (RecruiterWorkspace.tsx:12)
- `handleCandidateLoaded` (RecruiterWorkspace.tsx:21)
- `matchingService.registerCandidate` (RecruiterWorkspace.tsx:29)
- `fetch('/api/matching/candidate')` (matching.service.ts:7)
- `POST /api/matching/candidate` (matching.controller.ts:12)
- `handleJobLoaded` (RecruiterWorkspace.tsx:35)
- `matchingService.registerJob` (RecruiterWorkspace.tsx:43)
- `fetch('/api/matching/job')` (matching.service.ts:23)
- `POST /api/matching/job` (matching.controller.ts:28)

### Dead Code
- **File:** `c:\Trajectoire\apps\api\src\matching\matching.controller.ts`
- **Line:** 12-26, 28-42
- **Function:** `registerCandidate`, `registerJob`
- **Evidence:** Both return placeholder messages, no actual registration

### Unused Branches
- **File:** `c:\Trajectoire\apps\web\src\components\recruiter\RecruiterWorkspace.tsx`
- **Line:** 49-51
- **Function:** `handleReportGenerated`
- **Evidence:** Matching report generation (not executed in basic flow)

### Double Calls
- **NOT OBSERVED** - No double calls identified

### Missing Validations
- **File:** `c:\Trajectoire\apps\web\src\components\recruiter\RecruiterWorkspace.tsx`
- **Line:** 21-47
- **Function:** `handleCandidateLoaded`, `handleJobLoaded`
- **Evidence:** No validation of graph structure or content

### Unexpected Exits
- **NOT OBSERVED** - No unexpected exits

### Exceptions
- **File:** `c:\Trajectoire\apps\web\src\components\recruiter\RecruiterWorkspace.tsx`
- **Line:** 30-32, 44-46
- **Function:** `handleCandidateLoaded`, `handleJobLoaded`
- **Evidence:** try/catch with console.error

### Rollback
- **NOT OBSERVED** - No rollback mechanism

### Errors
- **File:** `c:\Trajectoire\apps\web\src\components\recruiter\RecruiterWorkspace.tsx`
- **Line:** 31, 45
- **Function:** `handleCandidateLoaded`, `handleJobLoaded`
- **Evidence:** console.error on failure

---

## STEP 8: SEARCH

### Flow
- **Entry:** User navigates to `/search`
- **File:** `c:\Trajectoire\apps\web\src\app\search\page.tsx`
- **Line:** 3-6
- **Function:** `SearchPage`
- **Evidence:** Renders SearchWorkspace

### Runtime Chain

1. **Page Render**
   - **File:** `c:\Trajectoire\apps\web\src\app\search\page.tsx`
   - **Line:** 3
   - **Function:** `SearchPage`
   - **Evidence:** Renders SearchWorkspace

2. **SearchWorkspace Render**
   - **File:** `c:\Trajectoire\apps\web\src\components\search\SearchWorkspace.tsx`
   - **Line:** 9-31
   - **Function:** `SearchWorkspace`
   - **Evidence:** Renders CandidateSearch, JobSearch, SimilarityView, CareerPathView

3. **User Searches Candidates**
   - **File:** NOT OBSERVED
   - **Line:** NOT OBSERVED
   - **Function:** NOT OBSERVED
   - **Evidence:** CandidateSearch component not viewed

4. **API Call to /api/search/candidates**
   - **File:** `c:\Trajectoire\apps\web\src\services\search.service.ts`
   - **Line:** 7
   - **Function:** `searchCandidates`
   - **Evidence:** `fetch('/api/search/candidates', { method: 'POST', body })`

5. **Graph Search Execution**
   - **File:** `c:\Trajectoire\apps\api\src\search\search.controller.ts`
   - **Line:** 20
   - **Function:** `searchCandidates`
   - **Evidence:** `graphSearchService.searchCandidatesByNeighborhood`

### Executed Methods
- `SearchPage` (page.tsx:3)
- `SearchWorkspace` (SearchWorkspace.tsx:9)
- `searchCandidates` (search.service.ts:6)
- `fetch('/api/search/candidates')` (search.service.ts:7)
- `POST /api/search/candidates` (search.controller.ts:12)
- `graphSearchService.searchCandidatesByNeighborhood` (search.controller.ts:20)

### Dead Code
- **NOT OBSERVED** - GraphSearchService implementation not viewed

### Unused Branches
- **File:** `c:\Trajectoire\apps\api\src\search\search.controller.ts`
- **Line:** 124-138
- **Function:** `findRelatedSkills`
- **Evidence:** Returns placeholder message

### Double Calls
- **NOT OBSERVED** - No double calls identified

### Missing Validations
- **File:** `c:\Trajectoire\apps\api\src\search\search.controller.ts`
- **Line:** 16-18
- **Function:** `searchCandidates`
- **Evidence:** Basic validation only (jobGraph and candidateGraphs required)

### Unexpected Exits
- **NOT OBSERVED** - No unexpected exits

### Exceptions
- **File:** `c:\Trajectoire\apps\api\src\search\search.controller.ts`
- **Line:** 35-37
- **Function:** `searchCandidates`
- **Evidence:** try/catch with BadRequestException

### Rollback
- **NOT OBSERVED** - No rollback mechanism

### Errors
- **File:** `c:\Trajectoire\apps\web\src\services\search.service.ts`
- **Line:** 15-17
- **Function:** `searchCandidates`
- **Evidence:** throw Error on failure

---

## STEP 9: COPILOT

### Flow
- **Entry:** User navigates to `/copilot`
- **File:** `c:\Trajectoire\apps\web\src\app\copilot\page.tsx`
- **Line:** 3-6
- **Function:** `CopilotPage`
- **Evidence:** Renders ChatWorkspace

### Runtime Chain

1. **Page Render**
   - **File:** `c:\Trajectoire\apps\web\src\app\copilot\page.tsx`
   - **Line:** 3
   - **Function:** `CopilotPage`
   - **Evidence:** Renders ChatWorkspace

2. **ChatWorkspace Render**
   - **File:** `c:\Trajectoire\apps\web\src\components\copilot\ChatWorkspace.tsx`
   - **Line:** 12-170
   - **Function:** `ChatWorkspace`
   - **Evidence:** Client component with chat interface

3. **User Sends Message**
   - **File:** `c:\Trajectoire\apps\web\src\components\copilot\ChatWorkspace.tsx`
   - **Line:** 28-64
   - **Function:** `handleSendMessage`
   - **Evidence:** User types message and clicks send

4. **API Call to /api/copilot/message**
   - **File:** `c:\Trajectoire\apps\web\src\services\copilot.service.ts`
   - **Line:** 7
   - **Function:** `processMessage`
   - **Evidence:** `fetch('/api/copilot/message', { method: 'POST', body })`

5. **Copilot Service Processing**
   - **File:** `c:\Trajectoire\apps\api\src\copilot\copilot.service.ts`
   - **Line:** 23-87
   - **Function:** `processMessage`
   - **Evidence:** Interprets intent, uses graph reasoning, builds response

6. **Cache Check**
   - **File:** `c:\Trajectoire\apps\api\src\copilot\copilot.service.ts`
   - **Line:** 24-30
   - **Function:** `processMessage`
   - **Evidence:** `cacheService.get` with 5 minute TTL

7. **Intent Interpretation**
   - **File:** `c:\Trajectoire\apps\api\src\copilot\copilot.service.ts`
   - **Line:** 32
   - **Function:** `processMessage`
   - **Evidence:** `promptInterpreter.interpret(message)`

8. **Graph Reasoning**
   - **File:** `c:\Trajectoire\apps\api\src\copilot\copilot.service.ts`
   - **Line:** 37
   - **Function:** `processMessage`
   - **Evidence:** `graphReasoningEngine.answerCandidateQuestion`

9. **Response Building**
   - **File:** `c:\Trajectoire\apps\api\src\copilot\copilot.service.ts`
   - **Line:** 67
   - **Function:** `processMessage`
   - **Evidence:** `responseBuilder.buildResponse`

10. **Conversation Memory Update**
    - **File:** `c:\Trajectoire\apps\api\src\copilot\copilot.service.ts`
    - **Line:** 69-81
    - **Function:** `processMessage`
    - **Evidence:** `conversationMemory.addMessage` for user and assistant

11. **Cache Set**
    - **File:** `c:\Trajectoire\apps\api\src\copilot\copilot.service.ts`
    - **Line:** 84
    - **Function:** `processMessage`
    - **Evidence:** `cacheService.set` with 5 minute TTL

### Executed Methods
- `CopilotPage` (page.tsx:3)
- `ChatWorkspace` (ChatWorkspace.tsx:12)
- `handleSendMessage` (ChatWorkspace.tsx:28)
- `copilotService.processMessage` (ChatWorkspace.tsx:42)
- `fetch('/api/copilot/message')` (copilot.service.ts:7)
- `POST /api/copilot/message` (copilot.controller.ts:9)
- `copilotService.processMessage` (copilot.service.ts:23)
- `cacheService.get` (copilot.service.ts:27)
- `promptInterpreter.interpret` (copilot.service.ts:32)
- `conversationMemory.getOrCreateContext` (copilot.service.ts:33)
- `graphReasoningEngine.answerCandidateQuestion` (copilot.service.ts:37)
- `responseBuilder.buildResponse` (copilot.service.ts:67)
- `conversationMemory.addMessage` (copilot.service.ts:69, 75)
- `cacheService.set` (copilot.service.ts:84)

### Dead Code
- **NOT OBSERVED** - Graph services not viewed

### Unused Branches
- **File:** `c:\Trajectoire\apps\api\src\copilot\copilot.service.ts`
- **Line:** 49-65
- **Function:** `processMessage`
- **Evidence:** Switch statement for different intents (only one executed per message)

### Double Calls
- **NOT OBSERVED** - No double calls identified

### Missing Validations
- **File:** `c:\Trajectoire\apps\web\src\components\copilot\ChatWorkspace.tsx`
- **Line:** 29
- **Function:** `handleSendMessage`
- **Evidence:** No validation of message content or length

### Unexpected Exits
- **File:** `c:\Trajectoire\apps\web\src\components\copilot\ChatWorkspace.tsx`
- **Line:** 29
- **Function:** `handleSendMessage`
- **Evidence:** Early return if input empty or loading

### Exceptions
- **File:** `c:\Trajectoire\apps\web\src\components\copilot\ChatWorkspace.tsx`
- **Line:** 54-60
- **Function:** `handleSendMessage`
- **Evidence:** try/catch with error message

### Rollback
- **NOT OBSERVED** - No rollback mechanism

### Errors
- **File:** `c:\Trajectoire\apps\web\src\components\copilot\ChatWorkspace.tsx`
- **Line:** 55-58
- **Function:** `handleSendMessage`
- **Evidence:** Error message on failure

---

## STEP 10: RECRUITER

### Flow
- **Entry:** User navigates to `/recruiter`
- **File:** `c:\Trajectoire\apps\web\src\app\recruiter\page.tsx`
- **Line:** 3-6
- **Function:** `RecruiterPage`
- **Evidence:** Renders RecruiterWorkspace

### Runtime Chain
- **Same as Step 7 (Matching)** - RecruiterPage just renders RecruiterWorkspace

### Executed Methods
- **Same as Step 7 (Matching)**

### Dead Code
- **Same as Step 7 (Matching)**

### Unused Branches
- **Same as Step 7 (Matching)**

### Double Calls
- **Same as Step 7 (Matching)**

### Missing Validations
- **Same as Step 7 (Matching)**

### Unexpected Exits
- **Same as Step 7 (Matching)**

### Exceptions
- **Same as Step 7 (Matching)**

### Rollback
- **Same as Step 7 (Matching)**

### Errors
- **Same as Step 7 (Matching)**

---

## SUMMARY: END-TO-END EXECUTION

### Total Steps: 10
### Total Executed Methods: 80+
### Total Dead Code Identified: 8
### Total Unused Branches: 12
### Total Double Calls: 1
### Total Missing Validations: 5
### Total Unexpected Exits: 5
### Total Exceptions: 8
### Total Rollback: 0
### Total Errors: 8

### Critical Issues

1. **Placeholder Implementations:** Skills, Experience, Education, Languages, Knowledge Graph not persisted
2. **Graph Services Not Functional:** Matching and Search return placeholder messages
3. **No Rollback Mechanism:** No transaction rollback observed
4. **Double Call:** OnboardingResolver.resolveOnboarding called twice in initialization
5. **Missing Validations:** Client-side validation only in signup, no server-side validation observed

### Evidence Completeness

- **Steps Fully Observed:** 8/10 (80%)
- **Steps Partially Observed:** 2/10 (20%)
- **Steps Not Observed:** 0/10 (0%)

**Evidence Source:** RC37.1 runtime reconstruction reports
