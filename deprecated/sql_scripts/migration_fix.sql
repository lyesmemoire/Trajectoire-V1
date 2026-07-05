-- =============================================================
-- MIGRATION SQL CORRECTIVE — Aligner DB avec le Code
-- Projet: wuepjnztvctagvquudop
-- Date: 2026-06-07
-- =============================================================

-- 0. Activer pgvector (OBLIGATOIRE pour cv_embeddings)
CREATE EXTENSION IF NOT EXISTS vector;

-- 1. DROP obsolete VIEW "prompt_versions" (was bridging to PascalCase "PromptVersion")
-- No longer needed: Prisma now maps directly to the prompt_versions table via @@map
DROP VIEW IF EXISTS public.prompt_versions;

-- 2. Table "ats_reports"
CREATE TABLE IF NOT EXISTS public.ats_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  cv_id UUID REFERENCES public.cvs(id) ON DELETE SET NULL,
  score INTEGER,
  report_json JSONB,
  job_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE public.ats_reports ENABLE ROW LEVEL SECURITY;

-- 3. Table "optimized_cvs"
CREATE TABLE IF NOT EXISTS public.optimized_cvs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  original_cv_id UUID REFERENCES public.cvs(id) ON DELETE SET NULL,
  optimized_text TEXT,
  improvements JSONB,
  ats_score_before INTEGER,
  ats_score_after INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE public.optimized_cvs ENABLE ROW LEVEL SECURITY;

-- 4. Table "cv_embeddings" (avec VECTOR propre)
CREATE TABLE IF NOT EXISTS public.cv_embeddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cv_id UUID NOT NULL REFERENCES public.cvs(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  embedding VECTOR(1536),
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE public.cv_embeddings ENABLE ROW LEVEL SECURITY;

-- 5. Table "credit_transactions"
CREATE TABLE IF NOT EXISTS public.credit_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  type TEXT NOT NULL,
  status TEXT DEFAULT 'completed',
  reference_id UUID,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;

-- 6. Table "cost_alerts"
CREATE TABLE IF NOT EXISTS public.cost_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_type TEXT NOT NULL,
  threshold NUMERIC,
  current_value NUMERIC,
  message TEXT,
  resolved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE public.cost_alerts ENABLE ROW LEVEL SECURITY;

-- 7. Table "credit_usage"
CREATE TABLE IF NOT EXISTS public.credit_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  credits_used INTEGER NOT NULL,
  action TEXT NOT NULL,
  session_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE public.credit_usage ENABLE ROW LEVEL SECURITY;

-- =============================================================
-- APRÈS EXÉCUTION, lance dans ton terminal :
-- npx supabase login
-- npx supabase gen types typescript --project-id wuepjnztvctagvquudop > types/database.ts
-- =============================================================
