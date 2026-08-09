# RC36-FLOWS.md
## User Journey Flow Documentation

Generated: 2025-01-08
Repository: Trajectoire-V1
Mission: RC-003.6 User Journey Certification
Status: COMPLETED

---

# JOURNEY 1: LANDING → ATS → SIGNUP → CLAIM → WELCOME → DASHBOARD → HISTORY → PREMIUM

## Flow Diagram

```
┌─────────────┐
│   Landing   │ (/)
└──────┬──────┘
       │
       │ POST /api/public/analyze-preview
       │ FormData: cv, jobDescription
       │
       ▼
┌─────────────┐
│  Analyze    │ (/analyze?preview=token)
└──────┬──────┘
       │
       │ POST /api/public/analyze-preview
       │ savePreview()
       │
       ▼
┌─────────────┐
│   Signup    │ (/signup)
└──────┬──────┘
       │
       │ Supabase auth.signUp()
       │ claimPreview() (if token exists)
       │
       ▼
┌─────────────┐
│  Welcome    │ (/welcome)
└──────┬──────┘
       │
       │ Auth check
       │ Preview token check
       │
       ▼
┌─────────────┐
│  Dashboard  │ (/dashboard)
└──────┬──────┘
       │
       │ Auth check
       │ Onboarding check
       │ Data fetching (analyses, profile, sessions)
       │
       ▼
┌─────────────┐
│   History   │ (/history)
└──────┬──────┘
       │
       │ Auth check
       │ Data fetching (interview sessions)
       │
       ▼
┌─────────────┐
│   Premium   │ (/pricing)
└─────────────┘
       │
       │ Link to /signup (no plan selection)
       │
       ▼
    [BREAK]
```

## Flow Status: ⚠️ PARTIAL (75% functional)
- Break at Premium step (no Stripe integration)

---

# JOURNEY 2: LANDING → SIGNUP → ONBOARDING → UPLOAD CV → MATCHING → COPILOT → PREMIUM

## Flow Diagram

```
┌─────────────┐
│   Landing   │ (/)
└──────┬──────┘
       │
       │ Navigate to /signup
       │
       ▼
┌─────────────┐
│   Signup    │ (/signup)
└──────┬──────┘
       │
       │ Supabase auth.signUp()
       │ Email verification required
       │
       ▼
┌─────────────┐
│  Onboarding │ (/onboarding)
└──────┬──────┘
       │
       │ FlowEngine.initializeFlow()
       │ OnboardingResolver.resolveOnboarding()
       │ Steps: welcome → upload-cv → upload-job → matching → copilot → interview
       │
       ├─────────────────────────────────────────────────────┐
       │                                                     │
       ▼                                                     ▼
┌─────────────┐                                    ┌─────────────┐
│  Welcome    │ (step 1)                            │ Upload CV   │ (step 2)
└──────┬──────┘                                    └──────┬──────┘
       │                                                 │
       │ fullName input                                   │ CV upload
       │ saveUserData()                                   │ (placeholder)
       │                                                 │
       ▼                                                 ▼
┌─────────────┐                                    ┌─────────────┐
│ Upload Job  │ (step 3)                           │  Matching   │ (step 4)
└──────┬──────┘                                    └──────┬──────┘
       │                                                 │
       │ Job upload                                      │ (placeholder)
       │ (placeholder)                                   │
       │                                                 │
       ▼                                                 ▼
┌─────────────┐                                    ┌─────────────┐
│  Copilot    │ (step 5)                           │  Interview  │ (step 6)
└──────┬──────┘                                    └──────┬──────┘
       │                                                 │
       │ (placeholder)                                   │ (placeholder)
       │                                                 │
       ▼                                                 ▼
┌─────────────┐                                    ┌─────────────┐
│  Dashboard  │ (onboarding complete)              │   Premium   │ (/pricing)
└─────────────┘                                    └──────┬──────┘
       │                                                 │
       │ completeOnboarding()                           │ Link to /signup
       │ router.push('/dashboard')                      │ (no plan selection)
       │                                                 │
       ▼                                                 ▼
    [END]                                           [BREAK]
```

## Flow Status: ⚠️ PARTIAL (40% functional)
- Onboarding flow exists but steps are placeholders
- Upload CV, Upload Job, Matching, Copilot, Interview steps not implemented
- Premium step has no Stripe integration

---

# JOURNEY 3: RECRUITER → UPLOAD JOB → KNOWLEDGE GRAPH → SEARCH → MATCHING → CANDIDATE → INTERVIEW

## Flow Diagram

```
┌─────────────┐
│  Recruiter  │ (/recruiter)
└──────┬──────┘
       │
       │ RecruiterWorkspace component
       │
       ├─────────────────────────────────────────────────────┐
       │                                                     │
       ▼                                                     ▼
┌─────────────┐                                    ┌─────────────┐
│Candidate    │                                    │   Job       │
│Uploader     │                                    │Uploader     │
└──────┬──────┘                                    └──────┬──────┘
       │                                                 │
       │ handleCandidateLoaded()                          │ handleJobLoaded()
       │ matchingService.registerCandidate()               │ matchingService.registerJob()
       │ (service not found in codebase)                   │ (service not found in codebase)
       │                                                 │
       ▼                                                 ▼
┌─────────────┐                                    ┌─────────────┐
│Matching     │                                    │Recommendation│
│Panel        │                                    │Panel        │
└──────┬──────┘                                    └──────┬──────┘
       │                                                 │
       │ (placeholder)                                    │ (placeholder)
       │                                                 │
       ▼                                                 ▼
┌─────────────┐                                    ┌─────────────┐
│GraphViewer  │                                    │   Search    │ (/search)
└─────────────┘                                    └──────┬──────┘
       │                                                 │
       │ (placeholder)                                    │ SearchWorkspace component
       │                                                 │ CandidateSearch, JobSearch
       │                                                 │ (components not found in codebase)
       │                                                 │
       ▼                                                 ▼
    [BREAK]                                         [BREAK]
```

## Flow Status: ❌ NOT FUNCTIONAL (0% functional)
- RecruiterWorkspace component exists but dependencies missing
- matchingService not found in codebase
- CandidateUploader, JobUploader components not found
- MatchingPanel, RecommendationPanel components not found
- GraphViewer component not found
- SearchWorkspace component exists but dependencies missing
- CandidateSearch, JobSearch components not found
- No interview flow observed

---

# JOURNEY 4: ADMIN → DASHBOARD → ANALYTICS → BILLING → USERS → AUDIT

## Flow Diagram

```
┌─────────────┐
│   Admin     │ (/admin)
└──────┬──────┘
       │
       │ (admin page not found)
       │
       ▼
    [BREAK]

┌─────────────┐
│  Dashboard  │ (/admin/analytics)
└──────┬──────┘
       │
       │ AdminAnalyticsPage component
       │ Auth check (mock: isAdmin = true)
       │ Analytics calculation:
       │   - sessionAnalytics.calculateMetrics()
       │   - interviewAnalytics.calculateMetrics()
       │   - retentionAnalytics.calculateMetrics()
       │   - funnelAnalytics.calculateMetrics()
       │   - heatmapEvents.calculateMetrics()
       │   - featureUsage.calculateMetrics()
       │   - userJourney.calculateMetrics()
       │   - feedbackAnalytics.calculateMetrics()
       │ (analytics services not found in codebase)
       │
       ▼
┌─────────────┐
│   Billing   │ (/admin/billing)
└──────┬──────┘
       │
       │ (page not found)
       │
       ▼
    [BREAK]

┌─────────────┐
│    Users    │ (/admin/users)
└──────┬──────┘
       │
       │ (page not found)
       │
       ▼
    [BREAK]

┌─────────────┐
│    Audit    │ (/admin/audit)
└──────┬──────┘
       │
       │ (page not found)
       │
       ▼
    [BREAK]
```

## Flow Status: ⚠️ PARTIAL (20% functional)
- Admin analytics page exists but analytics services not found
- Admin dashboard, billing, users, audit pages not found
- Admin role check is mocked (not implemented)

---

# JOURNEY 5: PREMIUM → STRIPE → WEBHOOK → SUBSCRIPTION → AUTHORIZATION → DASHBOARD

## Flow Diagram

```
┌─────────────┐
│   Premium   │ (/pricing)
└──────┬──────┘
       │
       │ Buttons link to /signup (no plan selection)
       │ No direct Stripe checkout
       │
       ▼
    [BREAK]

┌─────────────┐
│  Stripe     │ (/api/stripe/checkout)
│  Checkout   │
└──────┬──────┘
       │
       │ POST /api/stripe/checkout
       │ Auth check (getStrictUser)
       │ Rate limiting
       │ Price validation (zod)
       │ Double subscription guard
       │ Stripe session creation
       │ Metadata: user_id, plan
       │ Success URL: /dashboard?checkout=success
       │ Cancel URL: /pricing?checkout=cancelled
       │
       ▼
┌─────────────┐
│   Stripe    │ (external)
│  Payment    │
└──────┬──────┘
       │
       │ User completes payment
       │
       ▼
┌─────────────┐
│   Webhook   │ (/api/stripe/webhook)
└──────┬──────┘
       │
       │ POST /api/stripe/webhook
       │ Signature verification
       │ Event handling:
       │   - checkout.session.completed
       │   - customer.subscription.created
       │   - customer.subscription.updated
       │   - invoice.payment_succeeded
       │   - customer.subscription.deleted
       │   - invoice.payment_failed
       │ Database updates (subscription, user plan)
       │ Credit purchase handling (BillingService)
       │
       ▼
┌─────────────┐
│Subscription │ (database)
│   Update    │
└──────┬──────┘
       │
       │ Prisma subscription.upsert
       │ Prisma user.update
       │
       ▼
┌─────────────┐
│Authorization│ (AuthorizationV2)
│   Check     │
└──────┬──────┘
       │
       │ checkAccess() method
       │ Route rules validation
       │ Subscription plan check
       │
       ▼
┌─────────────┐
│  Dashboard  │ (/dashboard)
└──────┬──────┘
       │
       │ Auth check
       │ Onboarding check
       │ Data fetching
       │
       ▼
    [END]
```

## Flow Status: ⚠️ PARTIAL (60% functional)
- Stripe checkout API exists but not connected to pricing page
- Webhook handling exists and functional
- Authorization system exists
- Dashboard exists
- Break at Premium page (no connection to Stripe checkout)

---

# FLOW SUMMARY

## Overall Flow Status: 39% Functional

| Journey | Status | Functional Steps | Total Steps | Confidence |
|---------|--------|------------------|-------------|------------|
| Journey 1 | ⚠️ Partial | 6/8 | 8 | 75% |
| Journey 2 | ⚠️ Partial | 2/7 | 7 | 40% |
| Journey 3 | ❌ Not Functional | 0/7 | 7 | 0% |
| Journey 4 | ⚠️ Partial | 1/5 | 5 | 20% |
| Journey 5 | ⚠️ Partial | 3/5 | 5 | 60% |

## Critical Flow Breaks

### Journey 1
- **Break:** Premium page has no Stripe integration
- **Impact:** Users cannot purchase premium plans
- **Fix Required:** Connect pricing buttons to Stripe checkout with plan selection

### Journey 2
- **Breaks:** Onboarding steps are placeholders
- **Impact:** Users cannot complete onboarding flow
- **Fix Required:** Implement upload CV, upload job, matching, copilot, interview steps

### Journey 3
- **Breaks:** Recruiter workspace dependencies missing
- **Impact:** Recruiter flow completely non-functional
- **Fix Required:** Implement matching service, uploaders, panels, graph viewer

### Journey 4
- **Breaks:** Admin pages missing (except analytics)
- **Impact:** Admin cannot manage billing, users, audit
- **Fix Required:** Implement admin dashboard, billing, users, audit pages

### Journey 5
- **Break:** Premium page not connected to Stripe checkout
- **Impact:** Users cannot start payment flow from pricing page
- **Fix Required:** Connect pricing buttons to Stripe checkout API

## Missing Flow Components

### Missing Pages
- `/admin` (admin dashboard)
- `/admin/billing` (billing management)
- `/admin/users` (user management)
- `/admin/audit` (audit logs)

### Missing Components
- CandidateUploader
- JobUploader
- MatchingPanel
- RecommendationPanel
- GraphViewer
- CandidateSearch
- JobSearch
- SimilarityView
- CareerPathView

### Missing Services
- matching.service
- sessionAnalytics
- interviewAnalytics
- retentionAnalytics
- funnelAnalytics
- heatmapEvents
- featureUsage
- userJourney
- feedbackAnalytics

### Missing Integrations
- Pricing page → Stripe checkout
- Plan selection in signup flow
- Payment confirmation after signup

---

*End of RC36-FLOWS.md*
