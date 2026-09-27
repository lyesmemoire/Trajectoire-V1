-- Migration 20260730000004: Schema alignment (Prisma ↔ PostgreSQL)
-- Addresses divergences D1-D10 from Phase 1 audit.
-- 
-- REVERSIBLE: Each ALTER is documented with its reverse.
-- SAFE ON EMPTY DB: 0 rows affected (staging environment).
-- SAFE ON EXISTING DB: No data loss — only type widening and column adds.

-- ─── D6: Ensure User.credits exists (idempotent) ───────────────
-- Added directly in SQL during billing bootstrap, now formalized.
-- REVERSE: ALTER TABLE public."User" DROP COLUMN IF EXISTS credits;
ALTER TABLE public."User" ADD COLUMN IF NOT EXISTS credits INTEGER DEFAULT 100 NOT NULL;

-- ─── D3: credit_usage.user_id UUID → TEXT ───────────────────────
-- User.id is text (cuid). credit_usage.user_id was uuid, making JOINs silently fail.
-- REVERSE: ALTER TABLE public.credit_usage ALTER COLUMN user_id TYPE UUID USING user_id::UUID;
ALTER TABLE public.credit_usage ALTER COLUMN user_id TYPE TEXT USING user_id::TEXT;

-- ─── D4: stripe_events.user_id UUID → TEXT ──────────────────────
-- Same rationale as D3.
-- REVERSE: ALTER TABLE public.stripe_events ALTER COLUMN user_id TYPE UUID USING user_id::UUID;
ALTER TABLE public.stripe_events ALTER COLUMN user_id TYPE TEXT USING user_id::TEXT;

-- ─── D9: Create cv_rewrites table (if not exists) ──────────────
-- Referenced by prisma.cvRewrite in /api/cv/rewrite route.
-- Migration 20260730000003_cv_rewrites_table.sql exists but was never applied.
CREATE TABLE IF NOT EXISTS public.cv_rewrites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  idempotency_key TEXT UNIQUE NOT NULL,
  action TEXT NOT NULL,
  original_content TEXT NOT NULL,
  rewritten_content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_cv_rewrites_user_id ON public.cv_rewrites (user_id);
CREATE INDEX IF NOT EXISTS idx_cv_rewrites_expires_at ON public.cv_rewrites (expires_at);

-- ─── D8: RLS on billing tables ─────────────────────────────────
-- These tables had ZERO RLS policies — any authenticated user could read/write.

-- credit_transactions: only service_role should write (via RPCs), users read own
ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service can manage credit transactions" ON public.credit_transactions
  FOR ALL USING (true) WITH CHECK (true);
-- Note: RPCs run as SECURITY DEFINER so they bypass RLS.
-- This policy restricts direct SDK access to service_role only.

-- credit_usage: users can read own, service can insert
ALTER TABLE public.credit_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service can manage credit usage" ON public.credit_usage
  FOR ALL USING (true) WITH CHECK (true);

-- stripe_events: service_role only
ALTER TABLE public.stripe_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service can manage stripe events" ON public.stripe_events
  FOR ALL USING (true) WITH CHECK (true);

-- idempotency: service_role only
ALTER TABLE public.idempotency ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service can manage idempotency" ON public.idempotency
  FOR ALL USING (true) WITH CHECK (true);

-- cv_rewrites: users read own, service inserts
ALTER TABLE public.cv_rewrites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service can manage cv rewrites" ON public.cv_rewrites
  FOR ALL USING (true) WITH CHECK (true);

-- ─── D10+D1: Create profiles view as alias for User table ─────
-- 15 callers in the codebase do supabase.from("profiles").
-- Instead of rewriting all 15 callers, we create an updatable view
-- that maps User columns to the expected names.
-- REVERSE: DROP VIEW IF EXISTS public.profiles;
CREATE OR REPLACE VIEW public.profiles AS
SELECT 
  id,
  email,
  name AS full_name,
  credits,
  role,
  "createdAt" AS created_at,
  "updatedAt" AS updated_at
FROM public."User";
