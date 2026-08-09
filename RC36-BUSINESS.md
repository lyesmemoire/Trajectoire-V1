# RC36-BUSINESS.md
## Business Logic Audit

Generated: 2025-01-08
Repository: Trajectoire-V1
Mission: RC-003.6 User Journey Certification
Status: COMPLETED

---

# JOURNEY 1: LANDING → ATS → SIGNUP → CLAIM → WELCOME → DASHBOARD → HISTORY → PREMIUM

## STEP 1: LANDING

**Page:** `/` (`apps/web/src/app/page.tsx`)

**Entry:**
- User navigates to root URL
- No authentication required

**Form:**
- CV upload (CVUploader component)
- Job description input (JobInput component) - optional
- "Analyser" button (AnalyzeButton component)

**Validation:**
- File required (canAnalyze = !!file && !loading)
- No client-side validation observed
- Validation happens server-side

**API Call:**
- Endpoint: `POST /api/public/analyze-preview`
- Body: FormData with 'cv' and 'jobDescription'
- Rate limiting: 3 requests/hour per IP fingerprint

**Response:**
- Success: { previewToken, score, gapToOptimal, percentile, strengths, weakness, radarDimensions, message }
- Error: { error } with 429 (rate limit), 400 (validation), 500 (server error)

**Redirect:**
- Success: `window.location.href = /analyze?preview=${previewToken}`
- Error: Sets loading to false, shows console.error

**Error Handling:**
- Try-catch block (line 45-67)
- Console.error on failure
- No user-facing error message observed

**Loading State:**
- setLoading(true) on submit
- setLoading(false) on error
- Loading state passed to AnalyzeButton component

**Timeout:**
- No client-side timeout observed
- Server-side timeout: 8s in generatePreviewAnalysis

**Cache:**
- No client-side caching observed
- Preview token stored in cookie (httpOnly, secure, sameSite=lax, maxAge=24h)

**Logs:**
- Console.error on analysis failure (line 65)
- Sentry error tracking in API route
- Logger error tracking in API route

**Tracking:**
- No tracking observed in landing page
- Sentry error tracking in API route

**Analytics:**
- No analytics observed in landing page

**Data Lineage:**
- CV file → FormData → API → PreviewAnalysisService → Database (preview_analyses table)
- PreviewToken → Cookie → Session storage

**Authorization:**
- Not required (public endpoint)

**Status:** ✅ OBSERVED - Functional

---

## STEP 2: ANALYSE ATS GRATUITE

**Page:** `/analyze` (`apps/web/src/app/analyze/page.tsx`)

**Entry:**
- From landing with preview token in URL
- Direct navigation (no token)

**Form:**
- CV upload (CVUploader component)
- Job description input (JobInput component) - optional
- "Analyser" button (AnalyzeButton component)

**Validation:**
- File required (canAnalyze = !!file && !loading)
- No client-side validation observed

**API Call:**
- Endpoint: `POST /api/public/analyze-preview`
- Body: FormData with 'cv' and 'jobDescription'
- Rate limiting: 3 requests/hour per IP fingerprint

**Response:**
- Success: { previewToken, score, gapToOptimal, percentile, strengths, weakness, radarDimensions, message }
- Error: { error }

**Output:**
- PremiumATSResult component displays:
  - Score (0-100)
  - Radar dimensions (structure, keywords, impact, clarity, relevance)
  - Strengths array
  - Weakness string
  - Recommendations array

**Conversion Panel:**
- Appears after analysis (showConversion state)
- Component: ConversionPanel
- Shows ATS score and "Continue" button

**Error Handling:**
- Try-catch block (line 30-69)
- setError state for user-facing error message
- Error message displayed in red text (line 92-94)

**Loading State:**
- setLoading(true) on submit
- setLoading(false) in finally block
- Loading state passed to AnalyalyzeButton component

**Timeout:**
- No client-side timeout observed
- Server-side timeout: 8s in generatePreviewAnalysis

**Cache:**
- No client-side caching observed
- Preview token stored in cookie
- Preview saved via usePreviewStorage hook

**Logs:**
- No logging observed in analyze page
- Sentry error tracking in API route

**Tracking:**
- No tracking observed

**Analytics:**
- No analytics observed

**Data Lineage:**
- CV file → FormData → API → PreviewAnalysisService → Database
- Preview saved via savePreview function (line 61)

**Authorization:**
- Not required (public endpoint)

**Status:** ✅ OBSERVED - Functional

---

## STEP 3: SIGNUP

**Page:** `/signup` (`apps/web/src/app/signup/page.tsx`)

**Entry:**
- User navigates to /signup
- From landing/pricing "Choisir" buttons

**Form:**
- Email input (required)
- Password input (required, min 6 characters)
- Confirm password input (required)
- CGU checkbox (required)
- "S'inscrire" button

**Validation:**
- Client-side validation (line 24-39):
  - All fields required
  - Passwords must match
  - Password min 6 characters
  - CGU must be accepted
- Error message displayed in red box (line 98-102)

**API Call:**
- Endpoint: Supabase auth.signUp
- Body: { email, password, options: { emailRedirectTo: `${origin}/dashboard` } }

**Response:**
- Success: User created, email verification required
- Error: signUpError from Supabase

**Auto-Claim Preview:**
- If hasToken() returns true (line 58)
- Calls claimPreview() (line 59)
- Claims preview analysis for new user

**Success State:**
- "Vérifiez vos emails" message (line 68-84)
- Shows email address
- Link to login page

**Error Handling:**
- Try-catch block (line 41-65)
- setError state for user-facing error message
- Error message displayed in red box

**Loading State:**
- setLoading(true) on submit
- setLoading(false) in finally block
- Button shows "Création en cours..." when loading

**Timeout:**
- No timeout observed

**Cache:**
- No caching observed

**Logs:**
- No logging observed

**Tracking:**
- No tracking observed

**Analytics:**
- No analytics observed

**Data Lineage:**
- User data → Supabase auth.users table
- Preview token → PreviewAnalysisService.claimPreview → Database (preview_analyses table, user_id updated)

**Authorization:**
- Not required (public page)

**Status:** ✅ OBSERVED - Functional

---

## STEP 4: CLAIM PREVIEW

**API Route:** `/api/auth/claim-preview` (`apps/web/src/app/api/auth/claim-preview/route.ts`)

**Entry:**
- Called from signup page after successful signup
- Called from usePreviewStorage hook

**Input:**
- Authentication required (Supabase auth.getUser)
- previewToken from body or cookie

**Validation:**
- Auth check (line 16-23): Returns 401 if not authenticated
- Token check (line 29-34): Returns 400 if token missing
- Service validation (line 37): previewAnalysisService.claimPreview

**API Call:**
- previewAnalysisService.claimPreview(previewToken, user.id)
- Updates preview_analyses table with user_id
- Marks preview as claimed

**Response:**
- Success: { success: true, message: "Preview analysis revendiquée avec succès" }
- Error: { error } with appropriate status codes:
  - 400: Invalid/expired token
  - 404: Preview not found
  - 409: Already claimed
  - 500: Server error

**Cookie:**
- Deletes preview_token cookie on success (line 45)

**Error Handling:**
- Try-catch block (line 12-80)
- Sentry error tracking (line 50-52)
- Logger error tracking (line 53)
- Specific error messages for different failure scenarios

**Loading State:**
- No loading state observed (server-side)

**Timeout:**
- No timeout observed

**Cache:**
- No caching observed

**Logs:**
- Sentry error tracking
- Logger error tracking

**Tracking:**
- Sentry error tracking

**Analytics:**
- No analytics observed

**Data Lineage:**
- previewToken + userId → PreviewAnalysisService.claimPreview → Database (preview_analyses.user_id updated)

**Authorization:**
- Required (Supabase auth)

**Status:** ✅ OBSERVED - Functional

---

## STEP 5: WELCOME

**Page:** `/welcome` (`apps/web/src/app/welcome/page.tsx`)

**Entry:**
- After email verification (redirect from Supabase)
- Direct navigation

**Auth Check:**
- useEffect checks authentication (line 18-27)
- Redirects to /signup-conversion if not authenticated

**Preview Check:**
- Checks for preview token in session (line 30-34)
- Redirects to /dashboard if no preview token

**Content:**
- Success icon (CheckCircle)
- Title: "Bonne nouvelle !"
- Message: "Nous avons récupéré votre analyse ATS."
- Sub-message: "Votre profil est déjà prêt."
- Features list:
  - Analyse ATS récupérée
  - Profil candidat créé
  - Compétences détectées
  - Historique initialisé
  - Recommandations prêtes
- "Continuer" button

**Button Action:**
- handleContinue() → router.push('/dashboard')

**Error Handling:**
- No error handling observed
- No error state

**Loading State:**
- No loading state observed

**Timeout:**
- No timeout observed

**Cache:**
- No caching observed

**Logs:**
- No logging observed

**Tracking:**
- No tracking observed

**Analytics:**
- No analytics observed

**Data Lineage:**
- No data operations (display only)

**Authorization:**
- Required (redirects if not authenticated)

**Status:** ✅ OBSERVED - Functional

---

## STEP 6: DASHBOARD

**Page:** `/dashboard` (`apps/web/src/app/dashboard/page.tsx`)

**Entry:**
- From welcome page
- Direct navigation
- After onboarding completion

**Auth Check:**
- Server-side auth check (line 22-26)
- Redirects to /login if not authenticated

**Onboarding Check:**
- Checks user.onboardingCompleted (line 29-37)
- Redirects to /onboarding if not completed

**Data Fetching:**
- CV analyses (line 40-44): Last 5 analyses, ordered by date desc
- Career profile (line 50-52)
- Interview sessions (line 55-59): Last 3 sessions
- User quota (line 62)
- Claimed preview (line 65)

**Data Transformation:**
- userData: Name, firstName, avatar
- score: Current score, previous score, progress percentage, trend
- skills: Top 6 skills with level, category, trend
- career: Current level, next level, progress, evolution
- recommendations: Top 4 improvements
- history: Analysis history
- actions: Quick actions (analyze, matching, copilot, interview)
- progress: Onboarding progress (5 steps)
- insights: Strengths, opportunities, achievements, weaknesses
- timeline: Analysis and interview timeline

**Component:**
- DashboardWidgets component displays all data

**Error Handling:**
- No error handling observed
- No data fetching error state

**Loading State:**
- No loading state observed (server-side rendering)

**Timeout:**
- No timeout observed

**Cache:**
- No caching observed

**Logs:**
- No logging observed

**Tracking:**
- No tracking observed

**Analytics:**
- No analytics observed

**Data Lineage:**
- Database queries → Data transformation → DashboardWidgets component

**Authorization:**
- Required (redirects if not authenticated)
- Onboarding required (redirects if not completed)

**Status:** ✅ OBSERVED - Functional

---

## STEP 7: HISTORY

**Page:** `/history` (`apps/web/src/app/history/page.tsx`)

**Entry:**
- From dashboard
- Direct navigation

**Auth Check:**
- Server-side auth check (line 24-29)
- Redirects to /login if not authenticated

**Data Fetching:**
- Interview sessions with reports (line 31-42)
- Ordered by created_at desc

**Data Calculation:**
- totalSimulations: sessions.length
- totalDuration: Sum of duration_seconds
- averageScore: Average of report.overall_score
- bestScore: Max of report.overall_score
- confidenceScore: averageScore / 100
- currentStreak: 0 (hardcoded)

**Empty State:**
- "Aucune simulation" message (line 70-79)
- "Commencer ma première simulation" button
- Links to /simulation

**Table Display:**
- Date
- Poste (job_title)
- Niveau (level)
- Type (interview_type)
- Durée (duration_seconds)
- Score (report.overall_score)
- Statut (completed/in-progress)
- Action (Voir rapport link to /report/[id])

**Error Handling:**
- No error handling observed
- No data fetching error state

**Loading State:**
- No loading state observed (server-side rendering)

**Timeout:**
- No timeout observed

**Cache:**
- No caching observed

**Logs:**
- No logging observed

**Tracking:**
- No tracking observed

**Analytics:**
- No analytics observed

**Data Lineage:**
- Database query (interview_sessions with reports) → StatsOverview component

**Authorization:**
- Required (redirects if not authenticated)

**Status:** ✅ OBSERVED - Functional

---

## STEP 8: PREMIUM

**Page:** `/pricing` (`apps/web/src/app/pricing/page.tsx`)

**Entry:**
- User navigates to /pricing
- From dashboard or other pages

**Content:**
- Title: "Un investissement structuré."
- Subtitle: "Pour une progression mesurable."

**Plans Display:**
1. **Starter** (29€/mois)
   - "Pour commencer."
   - Button: "Choisir Starter" → /signup

2. **Pro** (59€/mois) - Recommended
   - "Pour performer."
   - Badge: "Recommandé"
   - Button: "Choisir Pro" → /signup

3. **Expert** (99€/mois)
   - "Pour dominer."
   - Button: "Choisir Expert" → /signup

**Buttons:**
- All buttons link to /signup
- No direct Stripe checkout integration observed
- No plan selection parameter in URL

**Form:**
- No form observed
- No plan selection mechanism

**Validation:**
- No validation observed

**API Call:**
- No API call observed

**Response:**
- No response handling observed

**Error Handling:**
- No error handling observed

**Loading State:**
- No loading state observed

**Timeout:**
- No timeout observed

**Cache:**
- No caching observed

**Logs:**
- No logging observed

**Tracking:**
- No tracking observed

**Analytics:**
- No analytics observed

**Data Lineage:**
- No data operations (display only)

**Authorization:**
- Not required (public page)

**Status:** ⚠️ PARTIAL - No Stripe integration, buttons link to signup without plan selection

---

# JOURNEY 1 SUMMARY

## Functional Steps: 6/8
1. ✅ Landing - Functional
2. ✅ Analyse ATS - Functional
3. ✅ Signup - Functional
4. ✅ Claim Preview - Functional
5. ✅ Welcome - Functional
6. ✅ Dashboard - Functional
7. ✅ History - Functional
8. ⚠️ Premium - Partial (no Stripe integration)

## Critical Gaps
- Premium page has no Stripe checkout integration
- Pricing buttons link to signup without plan selection
- No plan selection mechanism observed
- No payment flow from pricing page

## Missing Features
- Plan selection on pricing page
- Direct Stripe checkout from pricing page
- Plan parameter in signup flow
- Payment confirmation after signup

## Confidence: 75%
- Core journey functional
- Premium/payment flow incomplete

---

*End of RC36-BUSINESS.md*
