# RC36-UX.md
## User Experience Audit

Generated: 2025-01-08
Repository: Trajectoire-V1
Mission: RC-003.6 User Journey Certification
Status: COMPLETED

---

# SCREEN UX AUDIT

## SCREEN 1: LANDING (/)

**File:** `apps/web/src/app/page.tsx`

### Buttons
- **Analyser button** (line 180-191)
  - Disabled when: !canAnalyze (no file or loading)
  - Loading state: passed to AnalyzeButton component
  - Action: handleAnalyze()
  - Aria-disabled: true when disabled
  - Pointer-events-none when disabled

### Forms
- **CV upload** (line 177)
  - Component: CVUploader
  - State: file (useState)
  - Handler: onFile={setFile}
  - Required: Yes (canAnalyze depends on file)

- **Job description input** (line 178)
  - Component: JobInput
  - State: job (useState)
  - Handler: onChange={setJob}
  - Required: No (optional)

### Validators
- **Client-side:** None observed
- **Server-side:** validateCVUpload, validateJobDescription in API route

### Calls
- **API Call:** POST /api/public/analyze-preview (line 50-53)
  - Trigger: handleAnalyze()
  - Body: FormData with 'cv' and 'jobDescription'
  - Response handling: line 55-63

### Responses
- **Success:** Redirect to `/analyze?preview=${previewToken}`
- **Error:** console.error, setLoading(false)
- **Rate limit:** 429 status with Retry-After header

### Redirects
- **Success:** window.location.href = `/analyze?preview=${previewToken}` (line 62)
- **No error redirect**

### Errors
- **Error state:** None (no error state variable)
- **Error display:** console.error only (line 65)
- **User feedback:** No user-facing error message

### Loading
- **Loading state:** loading (useState)
- **Loading indicator:** Passed to AnalyzeButton component
- **Loading text:** Not observed in landing page (handled in component)

### Skeleton
- **Skeleton state:** None observed

### Empty State
- **Empty state:** None (form always visible)

### Premium State
- **Premium state:** None (public page)

### UX Issues
- ❌ No client-side validation
- ❌ No user-facing error messages
- ❌ No loading indicator on landing page
- ❌ No error recovery mechanism

---

## SCREEN 2: ANALYZE (/analyze)

**File:** `apps/web/src/app/analyze/page.tsx`

### Buttons
- **Analyser button** (line 96-100)
  - Component: AnalyzeButton
  - Disabled when: !canAnalyze (no file or loading)
  - Loading state: loading prop
  - Action: handleAnalyze()

### Forms
- **CV upload** (line 88)
  - Component: CVUploader
  - State: file (useState)
  - Handler: onFile={setFile}
  - Required: Yes

- **Job description input** (line 90)
  - Component: JobInput
  - State: job (useState)
  - Handler: onChange={setJob}
  - Required: No

### Validators
- **Client-side:** None observed
- **Server-side:** validateCVUpload, validateJobDescription in API route

### Calls
- **API Call:** POST /api/public/analyze-preview (line 35-38)
  - Trigger: handleAnalyze()
  - Body: FormData with 'cv' and 'jobDescription'
  - Response handling: line 40-46

### Responses
- **Success:** setPreview(analysisResult), savePreview(), setShowConversion(true)
- **Error:** setError(e.message), setLoading(false)

### Redirects
- **No redirects** (single-page flow)

### Errors
- **Error state:** error (useState)
- **Error display:** Red text error message (line 92-94)
- **Error recovery:** User can retry by uploading again

### Loading
- **Loading state:** loading (useState)
- **Loading indicator:** Passed to AnalyzeButton component
- **Loading text:** Not observed (handled in component)

### Skeleton
- **Skeleton state:** None observed

### Empty State
- **Empty state:** Form always visible before analysis
- **After analysis:** PremiumATSResult component displayed

### Premium State
- **Premium state:** None (public page)
- **Conversion panel:** Appears after analysis (line 117-122)

### UX Issues
- ❌ No client-side validation
- ⚠️ Limited error recovery
- ✅ User-facing error messages
- ✅ Conversion panel for upsell

---

## SCREEN 3: SIGNUP (/signup)

**File:** `apps/web/src/app/signup/page.tsx`

### Buttons
- **S'inscrire button** (line 154-156)
  - Component: Button
  - Disabled when: loading
  - Loading text: "Création en cours..." / "S'inscrire"
  - Action: handleSubmit()

### Forms
- **Email input** (line 107-114)
  - Type: email
  - State: email (useState)
  - Handler: onChange
  - Placeholder: "vous@exemple.com"
  - Required: Yes

- **Password input** (line 119-126)
  - Type: password
  - State: password (useState)
  - Handler: onChange
  - Placeholder: "••••••••"
  - Required: Yes

- **Confirm password input** (line 131-138)
  - Type: password
  - State: confirmPassword (useState)
  - Handler: onChange
  - Placeholder: "••••••••"
  - Required: Yes

- **CGU checkbox** (line 142-152)
  - Type: checkbox
  - State: acceptCGU (useState)
  - Handler: onChange
  - Required: Yes

### Validators
- **Client-side validation (line 24-39):**
  - All fields required
  - Passwords must match
  - Password min 6 characters
  - CGU must be accepted
- **Server-side:** Supabase auth.signUp validation

### Calls
- **API Call:** Supabase auth.signUp (line 45-51)
  - Trigger: handleSubmit()
  - Body: { email, password, options: { emailRedirectTo: `${origin}/dashboard` } }
  - Response handling: line 53-65

### Responses
- **Success:** setSuccess(true), claimPreview() if token exists
- **Error:** setError(err.message), setLoading(false)

### Redirects
- **Success state:** Shows email verification message (line 68-84)
- **Link to login:** "Retour à la connexion" (line 78-80)

### Errors
- **Error state:** error (useState)
- **Error display:** Red box with error message (line 98-102)
- **Error recovery:** User can retry form submission

### Loading
- **Loading state:** loading (useState)
- **Loading indicator:** Button text changes to "Création en cours..."
- **Loading text:** "Création en cours..." / "S'inscrire"

### Skeleton
- **Skeleton state:** None observed

### Empty State
- **Empty state:** None (form always visible)

### Premium State
- **Premium state:** None (signup page)

### UX Issues
- ✅ Client-side validation
- ✅ User-facing error messages
- ✅ Loading state
- ✅ Email confirmation flow
- ✅ Auto-claim preview if token exists

---

## SCREEN 4: WELCOME (/welcome)

**File:** `apps/web/src/app/welcome/page.tsx`

### Buttons
- **Continuer button** (line 122-131)
  - Action: handleContinue()
  - Redirects to: /dashboard
  - Icon: ArrowRight
  - Style: Indigo button with shadow

### Forms
- **None** (display only)

### Validators
- **None** (display only)

### Calls
- **Auth check:** Supabase auth.getUser (line 21-27)
- **Preview check:** PreviewTokenManager.getSessionToken (line 30-34)

### Responses
- **Not authenticated:** Redirect to /signup-conversion
- **No preview token:** Redirect to /dashboard

### Redirects
- **Not authenticated:** router.push('/signup-conversion') (line 25)
- **No preview:** router.push('/dashboard') (line 33)
- **Continue:** router.push('/dashboard') (line 41)

### Errors
- **Error state:** None
- **Error display:** None

### Loading
- **Loading state:** None
- **Loading indicator:** None

### Skeleton
- **Skeleton state:** None

### Empty State
- **Empty state:** None (content always displayed)

### Premium State
- **Premium state:** None (welcome page)

### UX Issues
- ✅ Auth check
- ✅ Preview token check
- ✅ Clear success message
- ✅ Features list
- ✅ Smooth animations

---

## SCREEN 5: DASHBOARD (/dashboard)

**File:** `apps/web/src/app/dashboard/page.tsx`

### Buttons
- **Action buttons** (line 119-152)
  - Analyser un CV → /analyze
  - Nouveau Matching → /matching
  - Copilot RH → /copilot
  - Entretien IA → /interview
  - Icons: FileText, Search, MessageSquare, Mic
  - Colors: bronze, forest, sky, brick

### Forms
- **None** (display only)

### Validators
- **None** (display only)

### Calls
- **Auth check:** Supabase auth.getUser (line 22-26)
- **Onboarding check:** Prisma user.findUnique (line 29-37)
- **Data fetching:**
  - CV analyses (line 40-44)
  - Career profile (line 50-52)
  - Interview sessions (line 55-59)
  - User quota (line 62)
  - Claimed preview (line 65)

### Responses
- **Not authenticated:** Redirect to /login
- **Onboarding not completed:** Redirect to /onboarding

### Redirects
- **Not authenticated:** redirect("/login") (line 25)
- **Onboarding not completed:** redirect("/onboarding") (line 36)

### Errors
- **Error state:** None
- **Error display:** None
- **Error recovery:** None

### Loading
- **Loading state:** None (server-side rendering)
- **Loading indicator:** None

### Skeleton
- **Skeleton state:** None

### Empty State
- **Empty state:** Handled by DashboardWidgets component
- **No analyses:** Shows empty state in DashboardWidgets

### Premium State
- **Premium state:** Not observed in dashboard page
- **Quota check:** checkUserQuota() called

### UX Issues
- ❌ No error handling for data fetching
- ❌ No loading state
- ❌ No skeleton loading
- ✅ Clear action buttons
- ✅ Progress tracking
- ✅ Timeline view

---

## SCREEN 6: HISTORY (/history)

**File:** `apps/web/src/app/history/page.tsx`

### Buttons
- **Commencer ma première simulation** (line 75-77)
  - Shown when: no sessions
  - Links to: /simulation
- **Voir rapport** (line 150-155)
  - Shown when: report exists and session completed
  - Links to: /report/[id]

### Forms
- **None** (display only)

### Validators
- **None** (display only)

### Calls
- **Auth check:** Supabase auth.getUser (line 24-29)
- **Data fetching:** interview_sessions with reports (line 31-42)

### Responses
- **Not authenticated:** Redirect to /login
- **No sessions:** Empty state displayed

### Redirects
- **Not authenticated:** redirect("/login") (line 28)

### Errors
- **Error state:** None
- **Error display:** None
- **Error recovery:** None

### Loading
- **Loading state:** None (server-side rendering)
- **Loading indicator:** None

### Skeleton
- **Skeleton state:** None

### Empty State
- **Empty state:** "Aucune simulation" message (line 70-79)
- **CTA:** "Commencer ma première simulation" button

### Premium State
- **Premium state:** None (history page)

### UX Issues
- ❌ No error handling for data fetching
- ❌ No loading state
- ❌ No skeleton loading
- ✅ Clear empty state
- ✅ Table with all relevant data
- ✅ Status badges

---

## SCREEN 7: PRICING (/pricing)

**File:** `apps/web/src/app/pricing/page.tsx`

### Buttons
- **Choisir Starter** (line 45-49)
  - Links to: /signup
  - Variant: secondary
- **Choisir Pro** (line 91-95)
  - Links to: /signup
  - Variant: premium
  - Badge: "Recommandé"
- **Choisir Expert** (line 112-116)
  - Links to: /signup
  - Variant: secondary (white)

### Forms
- **None** (display only)

### Validators
- **None** (display only)

### Calls
- **None** (display only)

### Responses
- **None** (display only)

### Redirects
- **All buttons:** Link to /signup (no plan selection)

### Errors
- **Error state:** None
- **Error display:** None

### Loading
- **Loading state:** None
- **Loading indicator:** None

### Skeleton
- **Skeleton state:** None

### Empty State
- **Empty state:** None (plans always displayed)

### Premium State
- **Premium state:** Pricing page itself
- **Plan selection:** Not implemented (no plan parameter passed to signup)

### UX Issues
- ❌ No plan selection mechanism
- ❌ No direct Stripe checkout
- ❌ No plan parameter in URL
- ❌ No payment flow integration
- ✅ Clear pricing display
- ✅ Recommended badge on Pro plan
- ✅ Visual hierarchy

---

## SCREEN 8: ONBOARDING (/onboarding)

**File:** `apps/web/src/app/onboarding/page.tsx`

### Buttons
- **Continuer button** (line 390-397)
  - Action: handleNext()
  - Text: "Continuer" / "Terminer"
  - Icon: ChevronRight (when not last step)
  - Disabled when: loading
- **Retour button** (line 385-387)
  - Action: handleBack()
  - Variant: ghost
  - Shown when: canGoBack && progress.current > 1
  - Disabled when: loading
- **Passer cette étape** (line 401-406)
  - Action: handleSkip()
  - Shown when: canSkip && progress.current < progress.total
  - Text link style

### Forms
- **Welcome step - Name input** (line 226-232)
  - Type: text
  - State: fullName (useState)
  - Handler: onChange
  - Placeholder: "Jean Dupont"
  - Required: Yes (validation in handleNext)
- **Upload CV step:** Placeholder button (line 244)
- **Upload Job step:** Placeholder button (line 257)

### Validators
- **Welcome step:** fullName required (line 85-89)
- **Other steps:** All placeholders (no validation)

### Calls
- **Auth check:** Supabase auth.getUser (line 42-47)
- **Flow initialization:** FlowEngine.initializeFlow (line 50)
- **Onboarding resolution:** OnboardingResolver.resolveOnboarding (line 56)
- **Flow context:** FlowEngine.getFlowContext (line 61)
- **Flow actions:** FlowEngine.executeFlowAction (line 96, 135, 156)
- **User data sync:** /api/auth/sync-user (line 170-177)

### Responses
- **Not authenticated:** Redirect to /login
- **Flow action:** Updates currentStep, progress
- **Onboarding complete:** completeOnboarding(), redirect to /dashboard

### Redirects
- **Not authenticated:** router.push('/login') (line 45)
- **Onboarding complete:** router.push('/dashboard') (line 195)

### Errors
- **Error state:** error (useState)
- **Error display:** Red box with error message (line 376-380)
- **Error recovery:** User can retry action

### Loading
- **Loading state:** loading (useState)
- **Loading indicator:** "Chargement..." (line 205)
- **Loading text:** "Création en cours..." / "S'inscrire"

### Skeleton
- **Skeleton state:** "Chargement..." text (line 203-207)

### Empty State
- **Empty state:** None (step content always displayed)

### Premium State
- **Premium state:** None (onboarding page)

### UX Issues
- ⚠️ Most steps are placeholders
- ✅ Progress bar
- ✅ Step navigation (next, back, skip)
- ✅ Adaptive journey types
- ✅ Error handling
- ❌ Upload CV not implemented
- ❌ Upload Job not implemented
- ❌ Matching not implemented
- ❌ Copilot not implemented
- ❌ Interview not implemented

---

## SCREEN 9: RECRUITER (/recruiter)

**File:** `apps/web/src/app/recruiter/page.tsx`

### Buttons
- **None observed** (component delegates to RecruiterWorkspace)

### Forms
- **None observed** (component delegates to RecruiterWorkspace)

### Validators
- **None observed** (component delegates to RecruiterWorkspace)

### Calls
- **None observed** (component delegates to RecruiterWorkspace)

### Responses
- **None observed** (component delegates to RecruiterWorkspace)

### Redirects
- **None observed** (component delegates to RecruiterWorkspace)

### Errors
- **Error state:** None observed
- **Error display:** None observed

### Loading
- **Loading state:** None observed
- **Loading indicator:** None observed

### Skeleton
- **Skeleton state:** None observed

### Empty State
- **Empty state:** None observed

### Premium State
- **Premium state:** None observed

### UX Issues
- ❌ RecruiterWorkspace component exists but dependencies missing
- ❌ CandidateUploader component not found
- ❌ JobUploader component not found
- ❌ MatchingPanel component not found
- ❌ RecommendationPanel component not found
- ❌ GraphViewer component not found
- ❌ matchingService not found

---

## SCREEN 10: COPILOT (/copilot)

**File:** `apps/web/src/app/copilot/page.tsx`

### Buttons
- **None observed** (component delegates to ChatWorkspace)

### Forms
- **None observed** (component delegates to ChatWorkspace)

### Validators
- **None observed** (component delegates to ChatWorkspace)

### Calls
- **None observed** (component delegates to ChatWorkspace)

### Responses
- **None observed** (component delegates to ChatWorkspace)

### Redirects
- **None observed** (component delegates to ChatWorkspace)

### Errors
- **Error state:** None observed
- **Error display:** None observed

### Loading
- **Loading state:** None observed
- **Loading indicator:** None observed

### Skeleton
- **Skeleton state:** None observed

### Empty State
- **Empty state:** None observed

### Premium State
- **Premium state:** None observed

### UX Issues
- ❌ ChatWorkspace component exists but dependencies missing
- ❌ ChatMessage component not found
- ❌ ThinkingIndicator component not found
- ❌ SuggestedQuestions component not found
- ❌ ConversationHistory component not found
- ❌ SourcesPanel component not found
- ❌ copilotService not found

---

## SCREEN 11: SEARCH (/search)

**File:** `apps/web/src/app/search/page.tsx`

### Buttons
- **None observed** (component delegates to SearchWorkspace)

### Forms
- **None observed** (component delegates to SearchWorkspace)

### Validators
- **None observed** (component delegates to SearchWorkspace)

### Calls
- **None observed** (component delegates to SearchWorkspace)

### Responses
- **None observed** (component delegates to SearchWorkspace)

### Redirects
- **None observed** (component delegates to SearchWorkspace)

### Errors
- **Error state:** None observed
- **Error display:** None observed

### Loading
- **Loading state:** None observed
- **Loading indicator:** None observed

### Skeleton
- **Skeleton state:** None observed

### Empty State
- **Empty state:** None observed

### Premium State
- **Premium state:** None observed

### UX Issues
- ❌ SearchWorkspace component exists but dependencies missing
- ❌ CandidateSearch component not found
- ❌ JobSearch component not found
- ❌ SimilarityView component not found
- ❌ CareerPathView component not found

---

## SCREEN 12: ADMIN ANALYTICS (/admin/analytics)

**File:** `apps/web/src/app/admin/analytics/page.tsx`

### Buttons
- **Retour au tableau de bord** (line 63-68)
  - Links to: /dashboard
  - Style: Text link with arrow

### Forms
- **None** (display only)

### Validators
- **None** (display only)

### Calls
- **Auth check:** Supabase auth.getUser (line 36-41)
- **Admin check:** Mock (isAdmin = true) (line 44-47)
- **Analytics calculations:**
  - sessionAnalytics.calculateMetrics() (line 50)
  - interviewAnalytics.calculateMetrics() (line 51)
  - retentionAnalytics.calculateMetrics() (line 52)
  - funnelAnalytics.calculateMetrics() (line 53)
  - heatmapEvents.calculateMetrics() (line 54)
  - featureUsage.calculateMetrics() (line 55)
  - userJourney.calculateMetrics() (line 56)
  - feedbackAnalytics.calculateMetrics() (line 57)
  - feedbackAnalytics.getNPSSegments() (line 58)

### Responses
- **Not authenticated:** Redirect to /login
- **Not admin:** Redirect to /dashboard (mock check)
- **Analytics data:** Displayed in cards and tables

### Redirects
- **Not authenticated:** redirect("/login") (line 40)
- **Not admin:** redirect("/dashboard") (line 46)

### Errors
- **Error state:** None
- **Error display:** None
- **Error recovery:** None

### Loading
- **Loading state:** None (server-side rendering)
- **Loading indicator:** None

### Skeleton
- **Skeleton state:** None

### Premium State
- **Premium state:** None (admin page)

### UX Issues
- ❌ Admin check is mocked (not implemented)
- ❌ Analytics services not found in codebase
- ❌ No error handling for analytics calculations
- ❌ No loading state
- ✅ Clear metrics display
- ✅ Multiple analytics categories

---

# UX SUMMARY

## UX Completeness by Screen

| Screen | Buttons | Forms | Validators | Calls | Responses | Errors | Loading | Skeleton | Empty | Premium | Status |
|--------|---------|-------|------------|-------|----------|--------|--------|---------|-------|---------|--------|
| Landing | ✅ | ✅ | ❌ | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ | ⚠️ Partial |
| Analyze | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ | ✅ Good |
| Signup | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ Good |
| Welcome | ✅ | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ Good |
| Dashboard | ✅ | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ | ⚠️ Partial |
| History | ✅ | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ | ⚠️ Partial |
| Pricing | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ Poor |
| Onboarding | ✅ | ⚠️ | ⚠️ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ⚠️ Partial |
| Recruiter | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ Missing |
| Copilot | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ Missing |
| Search | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ Missing |
| Admin Analytics | ✅ | ❌ | ❌ | ⚠️ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ⚠️ Partial |

## UX Issues Summary

### Critical Issues
1. **Pricing page has no payment flow** - Buttons link to signup without plan selection
2. **Recruiter workspace missing dependencies** - All components and services missing
3. **Copilot workspace missing dependencies** - All components and services missing
4. **Search workspace missing dependencies** - All components missing
5. **Admin analytics uses mock data** - Analytics services not found

### High Priority Issues
1. **No client-side validation on landing/analyze** - Only server-side validation
2. **No user-facing error messages on landing** - Only console.error
3. **No loading states on dashboard/history** - Server-side rendering only
4. **No skeleton loading states** - No loading indicators
5. **Onboarding steps are placeholders** - Upload CV, Job, Matching, Copilot, Interview not implemented

### Medium Priority Issues
1. **No error handling for data fetching** - Dashboard, history pages
2. **No error recovery mechanisms** - Limited retry options
3. **No premium state handling** - Premium features not gated
4. **Admin check is mocked** - No real admin role verification

### Low Priority Issues
1. **No empty states on some pages** - Landing, signup, welcome
2. **Limited loading indicators** - Only button text changes
3. **No skeleton states** - No visual loading feedback

## UX Recommendations

### Immediate Actions
1. Connect pricing buttons to Stripe checkout with plan selection
2. Implement RecruiterWorkspace dependencies
3. Implement CopilotWorkspace dependencies
4. Implement SearchWorkspace dependencies
5. Implement real analytics services for admin

### Short-term Actions
1. Add client-side validation to landing/analyze forms
2. Add user-facing error messages to landing page
3. Add loading states to dashboard/history pages
4. Add skeleton loading states
5. Implement onboarding steps (upload CV, job, matching, copilot, interview)

### Long-term Actions
1. Add error handling for all data fetching
2. Add error recovery mechanisms
3. Implement premium state gating
4. Implement real admin role verification
5. Add empty states to all pages

---

*End of RC36-UX.md*
