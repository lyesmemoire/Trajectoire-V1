# Audit Backend Complet - Trajectoire

**Date:** 27 Juin 2026  
**Scope:** Gateway, SIL, Services, Storage Layer, Next.js, Sécurité Web, Base de Données, IA Resilience  
**Architecture:** Event-Sourcing avec Gateway Pattern

---

## 📋 Executive Summary

### Architecture Globale
- **Pattern:** Gateway → SIL (Event-Sourcing) → Storage
- **Stack:** TypeScript, Express, PostgreSQL, Event-Driven, Next.js 14, Supabase
- **Isolation:** Multi-tenant avec signature cryptographique
- **Sécurité:** JWT + RBAC + Tenant Isolation + RLS Supabase

### Score Global
| Aspect | Score | Notes |
|--------|-------|-------|
| Architecture | 8/10 | Solide mais complexe |
| Sécurité Web | 5/10 | Gaps XSS, CSRF, CSP |
| Sécurité Backend | 7/10 | Bons mécanismes, gaps observabilité |
| Performance | 6/10 | Pas de caching, batch limité |
| Code Quality | 8/10 | TypeScript strict, bien typé |
| Scalabilité | 7/10 | Sharding présent mais non testé |
| Observabilité | 5/10 | Logging basique, pas de métriques |
| IA Resilience | 7/10 | Circuit breaker présent, gaps fallback |
| Database | 6/10 | RLS OK, gaps indexes, N+1 potentiels |
| Next.js | 6/10 | Pas de Server Actions, gaps cache/ISR |

---

## 🔒 Sécurité Web

### 1. SQL Injection
**Score:** 8/10

**Analyse:**
- ✅ Supabase client utilisé (paramétré)
- ✅ Pas de concaténation SQL directe
- ✅ Prepared statements par défaut

**Vérification:**
```typescript
// api/interviews/[id]/report/route.ts:51-55
const { data: interview, error: fetchError } = await (supabase as any)
  .from("interviews")
  .select("session_id, user_id, score")
  .eq("session_id", resolvedParams.id)
  .single();
```
**Verdict:** ✅ Sécurisé via Supabase client

**Recommandation:** Ajouter validation Zod sur `resolvedParams.id`

---

### 2. XSS (Cross-Site Scripting)
**Score:** 3/10

**Problème Critique:**
```typescript
// app/dashboard/rapport/page.tsx:211
<style dangerouslySetInnerHTML={{ __html: PRINT_CSS }} />
```
**Issue:** Injection directe de CSS non-sanitized
**Impact:** XSS via CSS injection possible
**Risque:** Élevé

**Autres occurrences:**
- `app/pricing/page.tsx` (non analysé)

**Recommandations:**
```typescript
// 1. Sanitizer CSS
import DOMPurify from 'dompurify';
const sanitizedCSS = DOMPurify.sanitize(PRINT_CSS, { ALLOWED_TAGS: ['style'] });

// 2. Ou utiliser next/head
import Head from 'next/head';
<Head>
  <style>{PRINT_CSS}</style>
</Head>
```

**Autres points:**
- ⚠️ Pas de sanitization sur user-generated content
- ⚠️ Pas de CSP pour mitigations secondaires

---

### 3. CSRF (Cross-Site Request Forgery)
**Score:** 2/10

**Analyse:**
- ❌ Pas de tokens CSRF
- ❌ Pas de SameSite cookie configuration
- ❌ Pas de Origin header validation

**Vérification:**
```bash
# Pas de middleware CSRF trouvé
grep -r "csrf" apps/web/src/
# Résultat: 0 matches
```

**Impact:** Élevé - Actions malveillantes possibles

**Recommandations:**
```typescript
// 1. Ajouter CSRF tokens
import { createCsrfProtection } from 'csrf-crypto';

// 2. Configurer cookies SameSite
// next.config.mjs
cookies: {
  sameSite: 'strict',
  secure: process.env.NODE_ENV === 'production',
}
```

---

### 4. Validation Zod
**Score:** 6/10

**Analyse:**
- ✅ `env-validation.ts` utilise Zod pour env vars
- ⚠️ Pas de validation sur API routes
- ⚠️ Pas de validation sur user input

**Exemple existant:**
```typescript
// lib/env-validation.ts:24-47
const EnvSchema = z.object({
  DATABASE_URL: z.string().url(),
  OPENAI_API_KEY: z.string().min(1),
  // ...
});
```

**Gaps:**
```typescript
// api/interviews/[id]/report/route.ts:37
const resolvedParams = await params;
// Pas de validation sur params.id
```

**Recommandations:**
```typescript
// Ajouter validation sur tous les inputs
const ReportParamsSchema = z.object({
  id: z.string().uuid("Invalid session ID"),
});

const validatedParams = ReportParamsSchema.parse(await params);
```

---

### 5. JWT (JSON Web Tokens)
**Score:** 7/10

**Analyse:**
- ✅ Supabase gère JWT nativement
- ✅ Middleware auth présent
- ⚠️ Pas de token rotation
- ⚠️ Pas de refresh token explicite
- ⚠️ Pas de jti (JWT ID) pour revocation

**Vérification:**
```typescript
// middleware.ts:8-14
export async function middleware(request: NextRequest) {
  const requestId = getOrCreateRequestId(request);
  const response = (await updateSession(request)) as NextResponse;
  // updateSession gère JWT Supabase
}
```

**Recommandations:**
```typescript
// 1. Implement token rotation
// 2. Ajouter jti pour revocation list
// 3. Shorter token expiration (15 min)
// 4. Refresh token mechanism
```

---

### 6. RLS Supabase (Row Level Security)
**Score:** 9/10

**Analyse:**
- ✅ RLS activé sur toutes les tables
- ✅ Policies restrictives (auth.uid() = id)
- ✅ Cascade delete correct

**Vérification schema:**
```sql
-- supabase_schema.sql:35-43
alter table profiles enable row level security;

create policy "Users read own profile"
  on profiles for select
  using (auth.uid() = id);
```

**Verdict:** ✅ Excellent - Isolation tenant correcte

**Recommandation mineure:**
- Ajouter policies pour admin roles (si nécessaire)

---

### 7. Secrets Management
**Score:** 5/10

**Analyse:**
- ✅ Variables d'environnement validées
- ⚠️ Pas de secret rotation
- ⚠️ Pas de secret scanning en CI/CD
- ⚠️ `.env` dans git (possible leak)

**Vérification:**
```typescript
// lib/env-validation.ts:24-47
const EnvSchema = z.object({
  OPENAI_API_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  // ...
});
```

**Recommandations:**
```bash
# 1. Ajouter .env à .gitignore (vérifier)
# 2. Secret scanning (Snyk, TruffleHog)
# 3. Secret rotation (Vault, AWS Secrets Manager)
# 4. Pas de secrets dans code client
```

---

### 8. CSP (Content Security Policy)
**Score:** 1/10

**Analyse:**
- ❌ Pas de CSP configuré
- ❌ Pas de nonce/hash pour inline scripts
- ⚠️ `dangerouslySetInnerHTML` utilisé sans CSP

**Impact:** XSS mitigations absentes

**Recommandations:**
```typescript
// next.config.mjs
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'nonce-{random}';
  style-src 'self' 'nonce-{random}';
  img-src 'self' data: https:;
`;

const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: ContentSecurityPolicy.replace(/\s{2,}/g, ' ').trim(),
  },
];

module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};
```

---

### 9. CORS (Cross-Origin Resource Sharing)
**Score:** 4/10

**Analyse:**
- ⚠️ Pas de configuration CORS explicite
- ⚠️ Dépend de Next.js defaults

**Recommandations:**
```typescript
// next.config.mjs
const corsHeaders = [
  {
    key: 'Access-Control-Allow-Origin',
    value: process.env.ALLOWED_ORIGINS || 'https://trajectoire.fr',
  },
  {
    key: 'Access-Control-Allow-Methods',
    value: 'GET, POST, PUT, DELETE, OPTIONS',
  },
  {
    key: 'Access-Control-Allow-Headers',
    value: 'Content-Type, Authorization',
  },
];
```

---

## 💾 Base de Données

### 1. Nombre de Requêtes
**Score:** 5/10

**Analyse:**
```typescript
// api/interviews/[id]/report/route.ts:51-69
const { data: interview } = await supabase.from("interviews").select(...);
const { data: profile } = await supabase.from("profiles").select(...);
const subscription = await getUserSubscription(user.id);
```
**Problème:** 3 requêtes séquentielles
**Impact:** Latence additive

**Recommandations:**
```typescript
// 1. Utiliser join Supabase
const { data } = await supabase
  .from("interviews")
  .select(`
    session_id, user_id, score,
    profiles!inner (cv_score)
  `)
  .eq("session_id", id)
  .single();

// 2. Parallel requests
const [interview, profile, subscription] = await Promise.all([
  supabase.from("interviews").select(...),
  supabase.from("profiles").select(...),
  getUserSubscription(user.id),
]);
```

---

### 2. N+1 Queries
**Score:** 6/10

**Analyse:**
```sql
-- supabase_schema.sql:281-284
(select count(*) from evaluations  ev where ev.user_id = p.id)  as total_evaluations,
(select count(*) from simulations  si where si.user_id = p.id)  as total_simulations,
(select count(*) from action_items ai where ai.user_id = p.id and ai.done = false) as pending_actions,
(select count(*) from notifications n  where n.user_id  = p.id and n.read  = false) as unread_notifications
```
**Problème:** 4 subqueries par row dans view `dashboard_summary`
**Impact:** Performance dégradée sur gros datasets

**Recommandations:**
```sql
-- 1. Materialized view
CREATE MATERIALIZED VIEW dashboard_summary_mv AS
SELECT
  p.id,
  p.first_name,
  COUNT(DISTINCT ev.id) as total_evaluations,
  COUNT(DISTINCT si.id) as total_simulations,
  -- ...
FROM profiles p
LEFT JOIN evaluations ev ON ev.user_id = p.id
LEFT JOIN simulations si ON si.user_id = p.id
GROUP BY p.id;

-- 2. Refresh strategy
REFRESH MATERIALIZED VIEW CONCURRENTLY dashboard_summary_mv;

-- 3. Indexes sur les colonnes de jointure
CREATE INDEX idx_evaluations_user_id ON evaluations(user_id);
CREATE INDEX idx_simulations_user_id ON simulations(user_id);
```

---

### 3. Transactions
**Score:** 7/10

**Analyse:**
```typescript
// sil/core/runtime-loop.ts:307-373
const tx = await this.storageAdapter.transaction();
try {
  await tx.begin();
  await this.reportRepo.save(..., tx);
  await this.checkpointRepo.save(..., tx);
  await tx.commit();
} catch (err: any) {
  await tx.rollback();
  throw err;
}
```
**Verdict:** ✅ Transactions correctes dans SIL
**Gap:** Pas de transactions dans API routes Next.js

**Recommandations:**
```typescript
// Ajouter transactions dans API routes critiques
const { data, error } = await supabase.rpc('create_simulation_with_report', {
  p_user_id: userId,
  p_simulation_data: simulationData,
});
```

---

### 4. Index Inutiles
**Score:** Non évalué

**Analyse:** Pas d'indexes customisés dans schema
**Recommandations:**
```sql
-- Analyser les indexes
SELECT * FROM pg_indexes WHERE tablename = 'evaluations';

-- Identifier indexes non utilisés
SELECT schemaname, tablename, indexname, idx_scan 
FROM pg_stat_user_indexes 
WHERE idx_scan = 0;

-- Créer indexes manquants
CREATE INDEX idx_evaluations_user_created ON evaluations(user_id, created_at DESC);
CREATE INDEX idx_simulations_user_type ON simulations(user_id, type);
CREATE INDEX idx_notifications_user_read ON notifications(user_id, read) WHERE read = false;
```

---

### 5. VACUUM
**Score:** Non évalué

**Analyse:** Pas de configuration VACUUM visible
**Recommandations:**
```sql
-- Configurer autovacuum
ALTER TABLE evaluations SET (autovacuum_vacuum_scale_factor = 0.1);
ALTER TABLE simulations SET (autovacuum_vacuum_scale_factor = 0.1);

-- Monitoring VACUUM
SELECT relname, last_autovacuum, autovacuum_count 
FROM pg_stat_user_tables;
```

---

### 6. Analyse EXPLAIN
**Score:** Non évalué

**Recommandations:**
```sql
-- Analyser les queries lentes
EXPLAIN ANALYZE
SELECT * FROM dashboard_summary WHERE user_id = 'xxx';

-- Identifier full table scans
EXPLAIN ANALYZE
SELECT * FROM evaluations WHERE user_id = 'xxx';

-- Créer indexes si nécessaire
```

---

## ⚛️ Next.js

### 1. Server Actions
**Score:** N/A

**Analyse:**
```bash
grep -r "use server" apps/web/src/
# Résultat: 0 matches
```
**Verdict:** ❌ Pas de Server Actions utilisés
**Impact:** API routes classiques utilisées

**Recommandation:**
- Considérer Server Actions pour mutations simples
- Garder API routes pour logique complexe

---

### 2. RSC (React Server Components)
**Score:** 7/10

**Analyse:**
```typescript
// app/dashboard/rapport/page.tsx:1
"use client";
```
**Problème:** Page rapport est client component
**Impact:** Pas de SSR, pas de SEO

**Recommandations:**
```typescript
// Convertir en RSC avec "use client" minimal
export default function RapportPage() {
  // Server component
  return <ReportContent />;
}

"use client";
function ReportContent() {
  // Interactivité client
}
```

---

### 3. Cache
**Score:** 3/10

**Analyse:**
- ❌ Pas de cache configuré
- ❌ Pas de Redis pour session states
- ⚠️ Chaque request hit DB

**Recommandations:**
```typescript
// 1. Next.js cache
export const revalidate = 3600; // 1 hour

// 2. Redis cache
import { Redis } from '@upstash/redis';
const redis = new Redis({ url: process.env.REDIS_URL });

async function getCachedReport(sessionId: string) {
  const cached = await redis.get(`report:${sessionId}`);
  if (cached) return JSON.parse(cached);
  
  const report = await fetchReport(sessionId);
  await redis.setex(`report:${sessionId}`, 3600, JSON.stringify(report));
  return report;
}

// 3. Supabase cache
const { data } = await supabase
  .from('evaluations')
  .select('*')
  .eq('user_id', userId)
  .cache(300); // 5 min cache
```

---

### 4. ISR (Incremental Static Regeneration)
**Score:** 2/10

**Analyse:**
- ❌ Pas de ISR configuré
- ❌ Pages dynamiques uniquement

**Recommandations:**
```typescript
// app/dashboard/page.tsx
export const revalidate = 3600; // Revalidate every hour

// Ou ISR on-demand
export async function generateStaticParams() {
  const users = await getUsers();
  return users.map(user => ({ id: user.id }));
}
```

---

### 5. Streaming
**Score:** 4/10

**Analyse:**
- ⚠️ Pas de streaming visible
- ⚠️ Responses chargées en bloc

**Recommandations:**
```typescript
// Streaming pour réponses IA
export async function POST(req: Request) {
  const stream = await openai.chat.completions.create({
    stream: true,
    messages: [...],
  });

  return new Response(
    new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          controller.enqueue(chunk);
        }
        controller.close();
      },
    }),
    { headers: { 'Content-Type': 'text/event-stream' } }
  );
}
```

---

### 6. Suspense
**Score:** 5/10

**Analyse:**
```typescript
// Pas de Suspense boundary visible
```
**Recommandations:**
```typescript
import { Suspense } from 'react';

export default function DashboardPage() {
  return (
    <div>
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContent />
      </Suspense>
    </div>
  );
}
```

---

### 7. Bundle Size
**Score:** Non évalué

**Recommandations:**
```bash
# Analyser bundle size
npm run build

# Optimiser imports
import { BarChart } from 'recharts'; // ❌ Import tout
import { BarChart } from 'recharts/charts/BarChart'; // ✅ Import spécifique

# Code splitting
import dynamic from 'next/dynamic';
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Skeleton />,
});
```

---

## 🤖 IA Resilience

### 1. Retry Automatique
**Score:** 4/10

**Analyse:**
```typescript
// services/interview.ts:14-41
export function validateQuestions(raw: unknown): InterviewQuestion[] {
  if (!Array.isArray(raw)) {
    throw new Error("INVALID_QUESTIONS: Expected array");
  }
  // Pas de retry
}
```
**Problème:** Pas de retry sur appels IA
**Impact:** Échecs silencieux

**Recommandations:**
```typescript
import { retry } from '@lifeomic/attempt';

async function fetchWithRetry<T>(
  fn: () => Promise<T>,
  options = { maxAttempts: 3, delay: 1000 }
): Promise<T> {
  return retry(fn, options);
}

const questions = await fetchWithRetry(() => 
  openai.chat.completions.create(...)
);
```

---

### 2. Timeout
**Score:** 7/10

**Analyse:**
```typescript
// lib/websocket-safeguards.ts:149-153
export const defaultCircuitBreakerConfig: CircuitBreakerConfig = {
  timeout: 500,
  failureThreshold: 5,
  recoveryTimeout: 60000,
};

export const dbTimeout = 3000; // 3 seconds max for DB operations
```
**Verdict:** ✅ Timeouts configurés
**Gap:** Pas de timeout sur appels IA

**Recommandations:**
```typescript
import { AbortController } from 'abort-controller';

const controller = new AbortController();
const timeout = setTimeout(() => controller.abort(), 30000); // 30s

try {
  const response = await openai.chat.completions.create({
    ...,
    signal: controller.signal,
  });
} catch (error) {
  if (error.name === 'AbortError') {
    // Handle timeout specifically
  }
} finally {
  clearTimeout(timeout);
}
```

---

### 3. Circuit Breaker
**Score:** 8/10

**Analyse:**
```typescript
// lib/websocket-safeguards.ts:22-82
class CircuitBreaker {
  private state: CircuitBreakerState = {
    isOpen: false,
    failureCount: 0,
    lastFailureTime: null,
  };
  // Implementation complète
}
```
**Verdict:** ✅ Circuit breaker implémenté
**Recommandation:** Étendre aux appels IA

---

### 4. Fallback LLM
**Score:** 2/10

**Analyse:**
- ❌ Pas de fallback LLM configuré
- ❌ Pas de modèle de secours

**Recommandations:**
```typescript
const MODELS = [
  { provider: 'openai', model: 'gpt-4' },
  { provider: 'anthropic', model: 'claude-3-opus' },
  { provider: 'openai', model: 'gpt-3.5-turbo' }, // Fallback
];

async function callWithFallback(prompt: string) {
  for (const { provider, model } of MODELS) {
    try {
      return await callLLM(provider, model, prompt);
    } catch (error) {
      console.error(`${provider}/${model} failed, trying next`);
    }
  }
  throw new Error('All LLM providers failed');
}
```

---

### 5. Quota Utilisateur
**Score:** 5/10

**Analyse:**
```typescript
// lib/billing/get-user-subscription.ts (mentionné)
```
**Gap:** Pas de quota enforcement côté backend

**Recommandations:**
```typescript
async function checkUserQuota(userId: string): Promise<boolean> {
  const { data: usage } = await supabase
    .from('usage_logs')
    .select('count')
    .eq('user_id', userId)
    .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
  
  const subscription = await getUserSubscription(userId);
  const limit = subscription.plan === 'pro' ? 100 : 10;
  
  return usage.count < limit;
}
```

---

### 6. Coût par Conversation
**Score:** 2/10

**Analyse:**
- ❌ Pas de tracking tokens
- ❌ Pas de calcul coût

**Recommandations:**
```typescript
interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  cost: number;
}

async function trackUsage(userId: string, usage: TokenUsage) {
  await supabase.from('usage_logs').insert({
    user_id: userId,
    prompt_tokens: usage.promptTokens,
    completion_tokens: usage.completionTokens,
    cost: usage.cost,
    created_at: new Date(),
  });
}

// Calcul coût
function calculateCost(tokens: TokenUsage): number {
  const GPT4_COST = {
    prompt: 0.03 / 1000,
    completion: 0.06 / 1000,
  };
  
  return (tokens.promptTokens * GPT4_COST.prompt) +
         (tokens.completionTokens * GPT4_COST.completion);
}
```

---

### 7. Coût par Simulation
**Score:** 2/10

**Analyse:**
- ❌ Pas de tracking coût simulation
- ❌ Pas de budget alerts

**Recommandations:**
```typescript
async function calculateSimulationCost(sessionId: string): Promise<number> {
  const events = await getEvents(sessionId);
  let totalCost = 0;
  
  for (const event of events) {
    if (event.type === 'AI_RESPONSE') {
      totalCost += calculateCost(event.usage);
    }
  }
  
  return totalCost;
}

// Alertes budget
async function checkBudgetAlert(userId: string) {
  const monthlyCost = await getMonthlyCost(userId);
  const budget = await getUserBudget(userId);
  
  if (monthlyCost > budget * 0.8) {
    await sendAlert(userId, '80% budget used');
  }
}
```

---

## 🏗️ Architecture Analysis

### 1. Gateway Layer (`gateway/`)

**Structure:**
```
gateway/
├── app.ts (101 lignes)
├── controllers/
│   ├── session.controller.ts (73 lignes)
│   ├── event.controller.ts (48 lignes)
│   └── report.controller.ts (64 lignes)
├── middlewares/
│   ├── auth-middleware.ts (31 lignes)
│   ├── rbac-middleware.ts (1704 lignes)
│   └── tenant-middleware.ts (758 lignes)
└── services/
    ├── auth.ts
    ├── event-signer.ts
    ├── tenant-resolver.ts
    └── rbac.ts
```

**Points Positifs:**
- ✅ Séparation claire controllers/middlewares/services
- ✅ Support legacy mode (Phase 2-E) et secured mode (Phase 2-H)
- ✅ Overloading TypeScript intelligent pour compatibilité
- ✅ Signature cryptographique sur tous les événements
- ✅ Tenant isolation via middleware

**Problèmes Identifiés:**

#### 1.1 Error Handling Inconsistant
```typescript
// session.controller.ts:36-38
catch (err: any) {
  res.status(500).json({ error: err.message });
}
```
**Issue:** Expose les erreurs internes, pas de logging structuré
**Impact:** Sécurité (information leak), debug difficile
**Recommandation:**
```typescript
catch (err: any) {
  logger.error({ error: err.message, stack: err.stack }, "Session creation failed");
  res.status(500).json({ error: "INTERNAL_ERROR" });
}
```

#### 1.2 Idempotence Non-Explicite
```typescript
// session.controller.ts:15
const sessionId = `sess_${crypto.randomUUID()}`;
```
**Issue:** UUID généré côté Gateway, pas de garantie idempotence si retry client
**Impact:** Duplication potentielle de sessions
**Recommandation:** Accepter `sessionId` optionnel du client ou utiliser idempotency key

#### 1.3 Validation Payload Manquante
```typescript
// event.controller.ts:14
const payload = req.body.payload;
if (!payload) {
  return res.status(400).json({ error: "Missing payload" });
}
```
**Issue:** Pas de validation schema (Zod/Joi)
**Impact:** Données corrompues peuvent atteindre SIL
**Recommandation:** Ajouter validation Zod avec schémas stricts

#### 1.4 Rate Limiting Absent
**Issue:** Aucun rate limiting sur les endpoints
**Impact:** DoS possible, abuse API
**Recommandation:** Implémenter rate limiting (express-rate-limit)

---

### 2. SIL Layer (`sil/`)

**Structure:**
```
sil/
├── core/
│   ├── runtime-loop.ts (433 lignes)
│   ├── recovery-manager.ts
│   └── failure-controller.ts
├── services/
│   ├── ingestor.ts (142 lignes)
│   ├── event-router.ts
│   ├── store/
│   │   ├── postgres-event-store.ts (142 lignes)
│   │   ├── dual-event-store.ts
│   │   └── batched-event-writer.ts
│   └── postgres/
│       ├── checkpoint-repository.ts
│       ├── report-repository.ts
│       └── session-repository.ts
├── distributed/
│   ├── sharding/
│   ├── failover/
│   └── session-registry.ts
└── contracts/
    └── public-api.ts (89 lignes)
```

**Points Positifs:**
- ✅ Architecture event-sourcing pure
- ✅ Séparation stricte ingestion/processing/storage
- ✅ Hash chain pour intégrité événements
- ✅ Tenant isolation enforcement à l'ingestion
- ✅ Idempotence check avant écriture
- ✅ Wakeup pattern pour async processing
- ✅ Checkpointing pour recovery

**Problèmes Identifiés:**

#### 2.1 Ingestor: Timestamp Window Validation Manquante
```typescript
// ingestor.ts:69-75
const timeResult = await this.verifier.verifyTimestamp(incomingEvent);
if (!timeResult.isValid) {
  console.error(`[Ingestor] Timestamp invalid...`);
  await this.audit(incomingEvent, `Timestamp invalid: ${timeResult.reason}`);
  return;
}
```
**Issue:** Dépend de `EventVerifier` mais window non configurée
**Impact:** Replay attacks possibles avec vieux événements
**Recommandation:** Configurer window max 5 minutes, clock skew tolerance

#### 2.2 Runtime Loop: State In-Memory Only
```typescript
// runtime-loop.ts:30-31
private states: Map<string, SILState> = new Map();
private wakingSessions: Set<string> = new Set();
```
**Issue:** États en mémoire, pas de persistence inter-process
**Impact:** Perte d'état sur crash/restart, pas de horizontal scaling
**Recommandation:** Externaliser state (Redis) ou utiliser checkpointing actif

#### 2.3 Runtime Loop: No Backpressure
```typescript
// runtime-loop.ts:65-94
while (pendingEvents.length > 0) {
  for (const event of pendingEvents) {
    // Process event
  }
  pendingEvents = await this.store.readAfter(...);
}
```
**Issue:** Boucle infinie si events arrivent plus vite que traitement
**Impact:** Memory exhaustion, cascade failure
**Recommandation:** Ajouter max batch size, backpressure signal

#### 2.4 Postgres Event Store: Type Mapping Incorrect
```typescript
// postgres-event-store.ts:133
type: "UNKNOWN", // In an actual system we'd save type too
```
**Issue:** Type d'événement non persisté, mapping incorrect
**Impact:** Impossible de reconstruire le type depuis DB
**Recommandation:** Ajouter colonne `event_type` dans schema

#### 2.5 Dual Event Store: No Fallback Logic
**Issue:** Si primary fail, pas de logique de fallback documentée
**Impact:** Perte de données si primary down
**Recommandation:** Documenter et tester failover scenarios

#### 2.6 Recovery Manager: No Rollback Strategy
**Issue:** Si recovery échoue mi-chemin, pas de rollback
**Impact:** État corrompu irrécupérable
**Recommandation:** Implement transactional recovery avec rollback

---

### 3. Services Layer (`services/`)

**Structure:**
```
services/
├── interview.ts (134 lignes)
├── ats.ts (2470 lignes)
├── credits.ts (3305 lignes)
├── ai.ts (525 lignes)
└── parsing.ts (1610 lignes)
```

**Points Positifs:**
- ✅ Validation stricte des réponses IA
- ✅ Fallback values pour données invalides
- ✅ Hard limits (max 10 questions)
- ✅ Fonctions pures, testables

**Problèmes Identifiés:**

#### 3.1 Interview Service: No Retry Logic
```typescript
// interview.ts:14-41
export function validateQuestions(raw: unknown): InterviewQuestion[] {
  if (!Array.isArray(raw)) {
    throw new Error("INVALID_QUESTIONS: Expected array");
  }
  // ...
}
```
**Issue:** Si IA retourne données invalides, pas de retry
**Impact:** Échec silencieux, mauvaise UX
**Recommandation:** Implement retry avec exponential backoff

#### 3.2 ATS Service: No Caching
**Issue:** Parsing ATS est CPU-intensive, pas de cache
**Impact:** Latence élevée, coût compute élevé
**Recommandation:** Cache Redis avec TTL basé sur CV hash

#### 3.3 Credits Service: No Distributed Lock
**Issue:** Si concurrent requests, race condition sur débit
**Impact:** Over-spending possible
**Recommandation:** Distributed lock (Redis) ou atomic operations

---

## 📊 Observability Analysis

### 1. Logging
**Score:** 5/10

**Points Positifs:**
- ✅ StructuredLogger contract existe
- ✅ Logging dans RuntimeLoop

**Problèmes:**
- ❌ Pas de correlation ID entre services
- ❌ Pas de log aggregation (ELK non mentionné)
- ❌ Console.error utilisé en fallback

**Recommandations:**
```typescript
// Ajouter correlation ID
interface LogContext {
  traceId: string;
  spanId: string;
  tenantId: string;
  sessionId: string;
}
```

### 2. Metrics
**Score:** 2/10

**Problèmes:**
- ❌ Aucun système de métriques
- ❌ Pas de Prometheus/Grafana
- ❌ Pas de business metrics (sessions/s, errors/s)

**Recommandations:**
- Implement Prometheus client
- Track: request duration, error rate, queue depth
- Business metrics: active sessions, completion rate

### 3. Tracing
**Score:** 6/10

**Points Positifs:**
- ✅ TraceProvider contract existe
- ✅ TraceGraphBuilder pour observability

**Problèmes:**
- ❌ Pas de distributed tracing (OpenTelemetry)
- ❌ Pas de span propagation entre services

**Recommandations:**
- Implement OpenTelemetry
- Intégrer Jaeger/Tempo

---

## 📝 Recommendations Prioritaires

### P0 (Critical - Do Now)
1. **Fix XSS dans dashboard/rapport/page.tsx**
   - Supprimer `dangerouslySetInnerHTML`
   - Utiliser DOMPurify ou next/head

2. **Add CSRF Protection**
   - Implement tokens CSRF
   - Configurer SameSite cookies

3. **Implement CSP**
   - Ajouter headers CSP
   - Utiliser nonce/hash pour inline scripts

4. **Fix Postgres Event Store Type Mapping**
   - Ajouter colonne `event_type`
   - Migration script required

5. **Add Error Handling Structuré**
   - Remplacer tous `console.error` par logger
   - Implement error classification

### P1 (High - Next Sprint)
1. **Implement Caching Layer**
   - Redis pour session states
   - Cache invalidation strategy

2. **Add Observability**
   - Prometheus metrics
   - Structured logging avec correlation ID
   - OpenTelemetry tracing

3. **Improve Security**
   - Token rotation JWT
   - Encryption at rest
   - Security audit logging

4. **Add Backpressure**
   - Runtime loop max batch size
   - Queue depth monitoring

5. **Implement IA Resilience**
   - Retry automatique avec exponential backoff
   - Fallback LLM
   - Quota enforcement

6. **Add Cost Tracking**
   - Token usage tracking
   - Coût par conversation/simulation
   - Budget alerts

### P2 (Medium - Future)
1. **Implement Distributed Lock**
   - Credits service
   - Prevent race conditions

2. **Add E2E Tests**
   - Playwright
   - Load testing

3. **Optimize Database**
   - Connection pooling
   - Read replicas
   - Partitioning
   - Materialized views

4. **Improve Recovery**
   - Transactional recovery
   - Rollback strategy

5. **Next.js Optimizations**
   - Server Actions pour mutations simples
   - RSC pour pages statiques
   - ISR pour contenu dynamique
   - Streaming pour réponses IA
   - Suspense boundaries
   - Bundle size optimization

---

## 🎯 Conclusion

L'architecture backend de Trajectoire est **solide et bien pensée** avec un pattern event-sourcing moderne. La séparation Gateway/SIL/Storage est excellente pour la scalabilité et la maintenabilité.

**Points Forts:**
- Architecture event-sourcing pure
- Tenant isolation robuste (RLS Supabase)
- TypeScript strict
- Code bien structuré
- Circuit breaker implémenté
- Timeouts configurés

**Points Faibles:**
- Sécurité web (XSS, CSRF, CSP)
- Observabilité limitée (pas de métriques)
- Pas de caching (chaque request hit DB)
- Error handling basique (expose internals)
- Security gaps (encryption, rate limiting)
- IA resilience (retry, fallback, quota)
- Cost tracking absent

**Score Global:** 5.5/10

Avec les recommandations P0 implémentées, le score pourrait atteindre 7.5/10. L'architecture est prometteuse mais nécessite des hardening sécurité et IA avant go-live.
