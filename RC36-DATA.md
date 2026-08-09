# RC36-DATA.md
## Data Contracts and API Documentation

Generated: 2025-01-08
Repository: Trajectoire-V1
Mission: RC-003.6 User Journey Certification
Status: COMPLETED

---

# API CONTRACTS

## API 1: PUBLIC ANALYZE PREVIEW

**Endpoint:** `POST /api/public/analyze-preview`
**File:** `apps/web/src/app/api/public/analyze-preview/route.ts`

### Input Contract

**Content-Type:** `multipart/form-data`

**Fields:**
- `cv` (File, required)
  - Type: File
  - Validation: validateCVUpload()
  - Constraints: PDF, DOCX, max 10MB
  - Required: Yes

- `jobDescription` (string, optional)
  - Type: string
  - Validation: validateJobDescription()
  - Constraints: max 5000 characters
  - Required: No

### Output Contract

**Success Response (200):**
```json
{
  "previewToken": "string (uuid)",
  "score": "number (0-100)",
  "gapToOptimal": "number",
  "percentile": "number (5-95)",
  "strengths": ["string"],
  "weakness": "string",
  "radarDimensions": {
    "structure": "number (0-100)",
    "keywords": "number (0-100)",
    "impact": "number (0-100)",
    "clarity": "number (0-100)",
    "relevance": "number (0-100)"
  },
  "message": "string"
}
```

**Error Response (400):**
```json
{
  "error": "string (error message)"
}
```

**Error Response (429):**
```json
{
  "error": "Trop de requêtes. Réessayez plus tard."
}
```
Headers:
- `Retry-After`: number (seconds)

**Error Response (500):**
```json
{
  "error": "Erreur lors de l'analyse"
}
```

### Validation

**Client-side:** None observed

**Server-side:**
- `validateCVUpload(cvFile)` - File type, size validation
- `validateJobDescription(jobDescription)` - Length validation
- Rate limiting: 3 requests/hour per IP fingerprint

### DTOs

**Input DTO:** FormData with cv and jobDescription

**Output DTO:**
```typescript
interface PreviewAnalysisResponse {
  previewToken: string;
  score: number;
  gapToOptimal: number;
  percentile: number;
  strengths: string[];
  weakness: string;
  radarDimensions: RadarDimensions;
  message: string;
}

interface RadarDimensions {
  structure: number;
  keywords: number;
  impact: number;
  clarity: number;
  relevance: number;
}
```

---

## API 2: CLAIM PREVIEW

**Endpoint:** `POST /api/auth/claim-preview`
**File:** `apps/web/src/app/api/auth/claim-preview/route.ts`

### Input Contract

**Content-Type:** `application/json`

**Body:**
```json
{
  "previewToken": "string (optional)"
}
```

**Alternative:** previewToken from cookie

### Output Contract

**Success Response (200):**
```json
{
  "success": true,
  "message": "Preview analysis revendiquée avec succès"
}
```

**Error Response (401):**
```json
{
  "error": "Non authentifié"
}
```

**Error Response (400):**
```json
{
  "error": "Preview token manquant"
}
```
or
```json
{
  "error": "Token invalide ou expiré"
}
```

**Error Response (404):**
```json
{
  "error": "Analyse preview non trouvée"
}
```

**Error Response (409):**
```json
{
  "error": "Analyse déjà revendiquée"
}
```

**Error Response (500):**
```json
{
  "error": "Erreur lors de la revendication"
}
```

### Validation

**Client-side:** None observed

**Server-side:**
- Authentication check (Supabase auth.getUser)
- Token presence check
- Service validation (previewAnalysisService.claimPreview)

### DTOs

**Input DTO:**
```typescript
interface ClaimPreviewRequest {
  previewToken?: string;
}
```

**Output DTO:**
```typescript
interface ClaimPreviewResponse {
  success: boolean;
  message: string;
}
```

---

## API 3: STRIPE CHECKOUT

**Endpoint:** `POST /api/stripe/checkout`
**File:** `apps/web/src/app/api/stripe/checkout/route.ts`

### Input Contract

**Content-Type:** `application/json`

**Body:**
```json
{
  "priceId": "string (Stripe Price ID)"
}
```

**Allowed Price IDs:**
- `STRIPE_PRICE_STARTER_MONTHLY`
- `STRIPE_PRO_PRICE_ID`
- `STRIPE_EXPERT_PRICE_ID`
- `STRIPE_PRICE_EARLY`

### Output Contract

**Success Response (200):**
```json
{
  "url": "string (Stripe Checkout URL)"
}
```

**Error Response (401):**
```json
{
  "error": "Non autorisé."
}
```

**Error Response (400):**
```json
{
  "error": "Paramètres invalides.",
  "details": {
    "fieldErrors": {...}
  }
}
```
or
```json
{
  "error": "Vous avez déjà un abonnement actif. Utilisez le portail client pour le modifier."
}
```

**Error Response (429):**
```json
{
  "error": "Trop de requêtes. Réessayez plus tard."
}
```

**Error Response (500):**
```json
{
  "error": "Impossible de créer la session de paiement : {message}"
}
```

**Error Response (503):**
```json
{
  "error": "Configuration paiement invalide."
}
```

### Validation

**Client-side:** None observed

**Server-side:**
- Authentication check (getStrictUser)
- Rate limiting (checkRateLimit)
- Price ID validation (zod schema)
- Double subscription guard (subscription table check)

### DTOs

**Input DTO:**
```typescript
interface StripeCheckoutRequest {
  priceId: string;
}
```

**Output DTO:**
```typescript
interface StripeCheckoutResponse {
  url: string;
}
```

---

## API 4: STRIPE WEBHOOK

**Endpoint:** `POST /api/stripe/webhook`
**File:** `apps/web/src/app/api/stripe/webhook/route.ts`

### Input Contract

**Content-Type:** `application/json`

**Headers:**
- `stripe-signature`: string (Stripe webhook signature)

**Body:** Stripe event object (varies by event type)

### Output Contract

**Success Response (200):**
```json
{
  "received": true
}
```

**Error Response (400):**
```json
{
  "error": "Invalid signature"
}
```

**Error Response (500):**
```json
{
  "error": "Webhook processing failed"
}
```

### Validation

**Client-side:** None (server-to-server)

**Server-side:**
- Signature verification (stripe.webhooks.constructEvent)
- Event type validation
- Metadata validation (user_id, plan)

### DTOs

**Input DTO:** Stripe Event (varies by type)

**Output DTO:**
```typescript
interface WebhookResponse {
  received: boolean;
}
```

**Event Types Handled:**
- `checkout.session.completed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `invoice.payment_succeeded`
- `customer.subscription.deleted`
- `invoice.payment_failed`

---

## API 5: CV ANALYZE

**Endpoint:** `POST /api/cv/analyze`
**File:** `apps/web/src/app/api/cv/analyze/route.ts`

### Input Contract

**Content-Type:** `multipart/form-data`

**Fields:**
- `cv` (File, required)
  - Type: File
  - Validation: File type, size
  - Required: Yes

- `jobDescription` (string, optional)
  - Type: string
  - Required: No

### Output Contract

**Success Response (200):**
```json
{
  "resultRef": "string (uuid)",
  "data": {
    "structured": {
      "fullName": "string",
      "email": "string",
      "phone": "string",
      "summary": "string",
      "skills": [
        {
          "name": "string",
          "level": "number",
          "category": "string"
        }
      ],
      "experiences": [...],
      "education": [...],
      "certifications": [...],
      "languages": [...]
    },
    "hiiosContext": {
      "contextId": "string",
      "initialized": true
    }
  }
}
```

**Error Response (400):**
```json
{
  "error": "string (error message)"
}
```

**Error Response (401):**
```json
{
  "error": "Non authentifié"
}
```

**Error Response (402):**
```json
{
  "error": "Crédits insuffisants"
}
```

**Error Response (500):**
```json
{
  "error": "Erreur lors de l'analyse"
}
```

### Validation

**Client-side:** None observed

**Server-side:**
- Authentication check (Supabase auth.getUser)
- Input validation (zod schema)
- Billing check (checkUserQuota)
- Idempotency check (IdempotencyService)

### DTOs

**Input DTO:** FormData with cv and jobDescription

**Output DTO:**
```typescript
interface CVAnalyzeResponse {
  resultRef: string;
  data: {
    structured: CVStructuredData;
    hiiosContext: HIIOSContext;
  };
}

interface CVStructuredData {
  fullName: string;
  email: string;
  phone: string;
  summary: string;
  skills: Skill[];
  experiences: Experience[];
  education: Education[];
  certifications: Certification[];
  languages: Language[];
}

interface Skill {
  name: string;
  level: number;
  category: string;
}

interface HIIOSContext {
  contextId: string;
  initialized: boolean;
}
```

---

## API 6: AUTH SYNC USER

**Endpoint:** `POST /api/auth/sync-user`
**File:** `apps/web/src/app/api/auth/sync-user/route.ts` (referenced in onboarding)

### Input Contract

**Content-Type:** `application/json`

**Headers:**
- `Authorization`: `Bearer {access_token}`

**Body:**
```json
{
  "fullName": "string (optional)",
  "onboardingCompleted": "boolean (optional)"
}
```

### Output Contract

**Success Response (200):**
```json
{
  "success": true
}
```

**Error Response (401):**
```json
{
  "error": "Non authentifié"
}
```

**Error Response (500):**
```json
{
  "error": "Erreur lors de la synchronisation"
}
```

### Validation

**Client-side:** None observed

**Server-side:**
- Authentication check (Bearer token)

### DTOs

**Input DTO:**
```typescript
interface SyncUserRequest {
  fullName?: string;
  onboardingCompleted?: boolean;
}
```

**Output DTO:**
```typescript
interface SyncUserResponse {
  success: boolean;
}
```

---

# DATA MODELS

## User Model

**Table:** `users` (Prisma)

**Fields:**
- `id`: string (uuid, primary key)
- `email`: string (unique)
- `name`: string (optional)
- `plan`: string (default: "FREE")
- `stripeCustomerId`: string (optional)
- `onboardingCompleted`: boolean (default: false)
- `createdAt`: datetime
- `updatedAt`: datetime

---

## CV Analysis Model

**Table:** `cVAnalysis` (Prisma)

**Fields:**
- `id`: string (uuid, primary key)
- `userId`: string (foreign key)
- `fileName`: string
- `atsScoreBefore`: number
- `atsScoreAfter`: number
- `cvData`: json
- `targetJob`: string (optional)
- `createdAt`: datetime
- `updatedAt`: datetime

---

## Interview Session Model

**Table:** `interviewSession` (Supabase)

**Fields:**
- `id`: string (uuid, primary key)
- `user_id`: string (foreign key)
- `job_title`: string
- `level`: string
- `interview_type`: string
- `status`: string (in_progress, completed)
- `duration_seconds`: number (optional)
- `score`: number (optional)
- `created_at`: datetime
- `completed_at`: datetime (optional)

---

## Subscription Model

**Table:** `subscription` (Prisma)

**Fields:**
- `id`: string (uuid, primary key)
- `userId`: string (foreign key)
- `stripeSubId`: string (unique)
- `status`: string (active, cancelled, past_due)
- `plan`: string (STARTER, PRO, EXPERT)
- `createdAt`: datetime
- `updatedAt`: datetime

---

## Preview Analysis Model

**Table:** `preview_analyses` (Prisma)

**Fields:**
- `id`: string (uuid, primary key)
- `previewToken`: string (unique)
- `userId`: string (foreign key, optional)
- `cvText`: text
- `jobText`: text (optional)
- `atsScore`: number
- `ipHash`: string
- `fingerprint`: string
- `claimedAt`: datetime (optional)
- `createdAt`: datetime
- `expiresAt`: datetime

---

# DATA LINEAGE

## Journey 1 Data Flow

```
CV File (user upload)
  ↓
FormData (multipart/form-data)
  ↓
/api/public/analyze-preview
  ↓
PreviewAnalysisService.analyzePreview()
  ↓
preview_analyses table (database)
  ↓
previewToken (response + cookie)
  ↓
/analyze?preview=token
  ↓
PreviewAnalysisService.claimPreview()
  ↓
preview_analyses.userId updated
  ↓
/dashboard
  ↓
cVAnalysis table (database)
  ↓
Dashboard display
```

## Journey 5 Data Flow

```
Pricing page (user selects plan)
  ↓
/api/stripe/checkout
  ↓
Stripe session creation
  ↓
Stripe Checkout URL (response)
  ↓
Stripe payment (external)
  ↓
Stripe webhook event
  ↓
/api/stripe/webhook
  ↓
subscription table (Prisma)
  ↓
user table (plan updated)
  ↓
AuthorizationV2.checkAccess()
  ↓
Dashboard access
```

---

# DATA VALIDATION SUMMARY

## Validation Layers

### Layer 1: Client-side
- **Status:** Limited
- **Coverage:** Signup form only
- **Gaps:** Landing, analyze, pricing pages lack client-side validation

### Layer 2: Server-side API
- **Status:** Good
- **Coverage:** All API routes have validation
- **Methods:** Zod schemas, custom validators, rate limiting

### Layer 3: Database
- **Status:** Good
- **Coverage:** Prisma schema validation
- **Methods:** Schema constraints, foreign keys, unique constraints

### Layer 4: Business Logic
- **Status:** Partial
- **Coverage:** Billing, authorization, onboarding
- **Gaps:** Recruiter, copilot, search flows missing

---

# DATA CONTRACTS SUMMARY

| API | Input Validation | Output Validation | DTOs | Status |
|-----|-----------------|------------------|------|--------|
| /api/public/analyze-preview | ✅ | ✅ | ✅ | ✅ Complete |
| /api/auth/claim-preview | ✅ | ✅ | ✅ | ✅ Complete |
| /api/stripe/checkout | ✅ | ✅ | ✅ | ✅ Complete |
| /api/stripe/webhook | ✅ | ✅ | ✅ | ✅ Complete |
| /api/cv/analyze | ✅ | ✅ | ✅ | ✅ Complete |
| /api/auth/sync-user | ⚠️ | ✅ | ✅ | ⚠️ Partial |

## Missing Data Contracts

### Recruiter Flow
- Candidate upload API
- Job upload API
- Matching API
- Graph API

### Copilot Flow
- Message API
- Conversation API
- Sources API

### Search Flow
- Candidate search API
- Job search API
- Similarity API
- Career path API

### Admin Flow
- Billing API
- Users API
- Audit API

---

*End of RC36-DATA.md*
