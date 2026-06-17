-- supabase/consolidated-migration.sql
-- Script de migration complet et idempotent pour Supabase
-- À copier-coller dans le SQL Editor de Supabase et à exécuter en une seule fois.

-- ============================================================
-- 1. CRÉATION DES ENUMS (AVEC SÉCURITÉ CONCURRENCE)
-- ============================================================

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'recruiter_persona') THEN
    CREATE TYPE recruiter_persona AS ENUM (
      'big_tech_senior',
      'startup_founder',
      'corporate_hr',
      'technical_lead',
      'aggressive_recruiter'
    );
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'interview_phase') THEN
    CREATE TYPE interview_phase AS ENUM (
      'intro',
      'cv_deep_dive',
      'technical_case',
      'behavioral',
      'pressure_test',
      'closing'
    );
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'tx_state') THEN
    CREATE TYPE tx_state AS ENUM (
      'reserved',
      'completed',
      'failed',
      'expired'
    );
  END IF;
END $$;

-- ============================================================
-- 2. CRÉATION DES TABLES DE BASE (SI ABSENTES)
-- ============================================================

-- Table Profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  credits INTEGER DEFAULT 2,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Table CVs
CREATE TABLE IF NOT EXISTS public.cvs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  filename TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Table ATS Reports
CREATE TABLE IF NOT EXISTS public.ats_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  cv_id UUID REFERENCES public.cvs(id) ON DELETE CASCADE NOT NULL,
  score INTEGER NOT NULL,
  missing_keywords TEXT[] NOT NULL,
  suggestions TEXT[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Table Interview Sessions (Classique)
CREATE TABLE IF NOT EXISTS public.interview_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  cv_id UUID REFERENCES public.cvs(id) ON DELETE CASCADE NOT NULL,
  questions JSONB NOT NULL,
  answers JSONB DEFAULT '[]'::jsonb,
  feedback JSONB,
  score INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Table Credit Usage (Log d'audit)
CREATE TABLE IF NOT EXISTS public.credit_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  amount INTEGER NOT NULL,
  reason TEXT NOT NULL,
  tokens INTEGER DEFAULT 0,
  cost DECIMAL(10, 5) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Table Stripe Events (Idempotence)
CREATE TABLE IF NOT EXISTS public.stripe_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  credits_added INTEGER,
  processed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table Credit Transactions (Système de lock)
CREATE TABLE IF NOT EXISTS public.credit_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  idempotency_key TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  amount INTEGER NOT NULL,
  action TEXT NOT NULL,
  state tx_state DEFAULT 'reserved' NOT NULL,
  tokens_used INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table Premium Interview Sessions
CREATE TABLE IF NOT EXISTS public.premium_interview_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  job_title TEXT NOT NULL,
  company TEXT,
  persona recruiter_persona NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('normal','hard','elite')),
  phase interview_phase NOT NULL DEFAULT 'intro',
  stress_level INTEGER NOT NULL DEFAULT 10,
  technical_score INTEGER NOT NULL DEFAULT 0,
  coherence_score INTEGER NOT NULL DEFAULT 0,
  communication_score INTEGER NOT NULL DEFAULT 0,
  confidence_score INTEGER NOT NULL DEFAULT 0,
  stress_score INTEGER NOT NULL DEFAULT 0,
  tags JSONB NOT NULL DEFAULT '[]'::jsonb,
  transcript JSONB NOT NULL DEFAULT '[]'::jsonb,
  memory JSONB DEFAULT '{}'::jsonb,
  is_processing BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 3. MISES À JOUR DES COLONNES & STRUCTURES (PATCHES V2 À V5)
-- ============================================================

-- 3.1 Table CVs : renommage content -> extracted_text et colonnes de métadonnées
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'cvs' AND column_name = 'content'
  ) THEN
    ALTER TABLE public.cvs RENAME COLUMN content TO extracted_text;
  END IF;
END $$;

ALTER TABLE public.cvs
  ADD COLUMN IF NOT EXISTS word_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS page_count INTEGER DEFAULT 1,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW());

-- 3.2 Table ATS Reports
ALTER TABLE public.ats_reports
  ADD COLUMN IF NOT EXISTS job_description TEXT,
  ADD COLUMN IF NOT EXISTS matched_keywords JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS missing_keywords JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS suggestions JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS total_keywords INTEGER DEFAULT 0;

-- 3.3 Table Interview Sessions (Classique)
ALTER TABLE public.interview_sessions
  ADD COLUMN IF NOT EXISTS job_title TEXT,
  ADD COLUMN IF NOT EXISTS job_description TEXT,
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'abandoned')),
  ADD COLUMN IF NOT EXISTS tokens_used INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS tokens_used_feedback INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ;

-- 3.4 Table Credit Usage
ALTER TABLE public.credit_usage
  ADD COLUMN IF NOT EXISTS tokens_used INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS estimated_cost_eur DECIMAL(10,6) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;

-- Renommage tokens -> tokens_used si présent
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'credit_usage' AND column_name = 'tokens') AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'credit_usage' AND column_name = 'tokens_used') THEN
    ALTER TABLE public.credit_usage RENAME COLUMN tokens TO tokens_used;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'credit_usage' AND column_name = 'estimated_cost') AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'credit_usage' AND column_name = 'estimated_cost_eur') THEN
    ALTER TABLE public.credit_usage RENAME COLUMN estimated_cost TO estimated_cost_eur;
  END IF;
END $$;

-- 3.5 Table Premium Interview Sessions (Progress Patches V5)
ALTER TABLE public.premium_interview_sessions
  ADD COLUMN IF NOT EXISTS communication_score INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS stress_score INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS tags JSONB NOT NULL DEFAULT '[]'::jsonb;

-- 3.6 Contrainte positive sur les montants de transaction
ALTER TABLE public.credit_transactions
  DROP CONSTRAINT IF EXISTS amount_positive,
  ADD CONSTRAINT amount_positive CHECK (amount > 0);

-- ============================================================
-- 4. POLITIQUES DE SÉCURITÉ RLS
-- ============================================================

-- Activation générale du RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cvs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ats_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interview_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stripe_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.premium_interview_sessions ENABLE ROW LEVEL SECURITY;

-- Politiques Profiles
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can access own profile" ON public.profiles;
CREATE POLICY "Users can access own profile" ON public.profiles FOR ALL USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Politiques CVs
DROP POLICY IF EXISTS "Users can view their own CVs" ON public.cvs;
DROP POLICY IF EXISTS "Users can insert their own CVs" ON public.cvs;
DROP POLICY IF EXISTS "Users can delete their own CVs" ON public.cvs;
DROP POLICY IF EXISTS "Users can access own cvs" ON public.cvs;
CREATE POLICY "Users can access own cvs" ON public.cvs FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Politiques ATS Reports
DROP POLICY IF EXISTS "Users can view their own ATS reports" ON public.ats_reports;
DROP POLICY IF EXISTS "Users can insert their own ATS reports" ON public.ats_reports;
DROP POLICY IF EXISTS "Users can access own ats_reports" ON public.ats_reports;
CREATE POLICY "Users can access own ats_reports" ON public.ats_reports FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Politiques Interview Sessions (Classique)
DROP POLICY IF EXISTS "Users can view their own interviews" ON public.interview_sessions;
DROP POLICY IF EXISTS "Users can insert their own interviews" ON public.interview_sessions;
DROP POLICY IF EXISTS "Users can update their own interviews" ON public.interview_sessions;
DROP POLICY IF EXISTS "Users can access own interview_sessions" ON public.interview_sessions;
CREATE POLICY "Users can access own interview_sessions" ON public.interview_sessions FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Politiques Credit Usage (Lecture seule)
DROP POLICY IF EXISTS "Users can view their own credit usage" ON public.credit_usage;
DROP POLICY IF EXISTS "Users can view own credit_usage" ON public.credit_usage;
CREATE POLICY "Users can view own credit_usage" ON public.credit_usage FOR SELECT USING (auth.uid() = user_id);

-- Politiques Stripe Events (Lecture seule)
DROP POLICY IF EXISTS "Service role can manage events" ON public.stripe_events;
DROP POLICY IF EXISTS "Users can view own stripe events" ON public.stripe_events;
CREATE POLICY "Users can view own stripe events" ON public.stripe_events FOR SELECT USING (auth.uid() = user_id);

-- Politiques Credit Transactions
DROP POLICY IF EXISTS "Users can access own credit transactions" ON public.credit_transactions;
CREATE POLICY "Users can access own credit transactions" ON public.credit_transactions FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Politiques Premium Interview Sessions
DROP POLICY IF EXISTS "Users can access own premium sessions" ON public.premium_interview_sessions;
CREATE POLICY "Users can access own premium sessions" ON public.premium_interview_sessions FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- 5. FONCTIONS PL/PGSQL & TRIGGERS (CRÉATION / DÉFINITION)
-- ============================================================

-- 5.1 Trigger auto-profil à l'inscription auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, credits, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    2, -- 2 crédits gratuits
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 5.2 Trigger mise à jour automatique de la colonne updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS update_credit_transactions_updated_at ON public.credit_transactions;
CREATE TRIGGER update_credit_transactions_updated_at
  BEFORE UPDATE ON public.credit_transactions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 5.3 Déduction atomique de crédits
CREATE OR REPLACE FUNCTION public.deduct_credits_atomic(
  uid UUID,
  amt INTEGER
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_current_credits INTEGER;
  v_new_credits INTEGER;
END;
$$;

-- Remplacement par version sécurisée v2 avec verrou ligne
CREATE OR REPLACE FUNCTION public.deduct_credits_atomic(
  uid UUID,
  amt INTEGER
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_current_credits INTEGER;
  v_new_credits INTEGER;
BEGIN
  IF amt <= 0 THEN
    RAISE EXCEPTION 'Deduction amount must be positive, got %', amt;
  END IF;

  SELECT credits INTO v_current_credits
  FROM public.profiles
  WHERE id = uid
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'User % not found', uid;
  END IF;

  IF v_current_credits < amt THEN
    RAISE EXCEPTION 'Insufficient credits: has %, needs %', v_current_credits, amt;
  END IF;

  v_new_credits := v_current_credits - amt;

  UPDATE public.profiles
  SET
    credits = v_new_credits,
    updated_at = NOW()
  WHERE id = uid;

  RETURN v_new_credits;
END;
$$;

-- 5.4 Ajout de crédits atomique
CREATE OR REPLACE FUNCTION public.add_credits_atomic(
  uid UUID,
  amt INTEGER
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_new_credits INTEGER;
BEGIN
  IF amt <= 0 THEN
    RAISE EXCEPTION 'Addition amount must be positive, got %', amt;
  END IF;

  UPDATE public.profiles
  SET
    credits = credits + amt,
    updated_at = NOW()
  WHERE id = uid
  RETURNING credits INTO v_new_credits;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'User % not found', uid;
  END IF;

  RETURN v_new_credits;
END;
$$;

-- 5.5 Traitement transactionnel de Stripe
CREATE OR REPLACE FUNCTION public.process_stripe_payment(
  p_event_id TEXT,
  p_user_id UUID,
  p_credits INTEGER,
  p_amount_cents INTEGER,
  p_pack_name TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_new_credits INTEGER;
BEGIN
  INSERT INTO public.stripe_events (event_id, user_id, credits_added, processed_at)
  VALUES (p_event_id, p_user_id, p_credits, NOW());

  UPDATE public.profiles
  SET
    credits = credits + p_credits,
    updated_at = NOW()
  WHERE id = p_user_id
  RETURNING credits INTO v_new_credits;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'User % not found during payment processing', p_user_id;
  END IF;

  INSERT INTO public.credit_usage (
    user_id,
    action,
    amount,
    tokens,
    cost,
    metadata,
    created_at
  )
  VALUES (
    p_user_id,
    'stripe_purchase',
    -p_credits,
    0,
    -(p_amount_cents::DECIMAL / 100) * 0.92,
    jsonb_build_object(
      'pack_name', p_pack_name,
      'event_id', p_event_id,
      'amount_cents', p_amount_cents
    ),
    NOW()
  );

  RETURN jsonb_build_object(
    'success', true,
    'credits_added', p_credits,
    'new_balance', v_new_credits,
    'user_id', p_user_id
  );

EXCEPTION
  WHEN unique_violation THEN
    RETURN jsonb_build_object(
      'success', false,
      'reason', 'already_processed',
      'event_id', p_event_id
    );
  WHEN OTHERS THEN
    RAISE;
END;
$$;

-- 5.6 Réserver (Lock) atomique de crédits
CREATE OR REPLACE FUNCTION public.reserve_credits_atomic(
  p_user_id UUID,
  p_amount INTEGER,
  p_action TEXT,
  p_idemp_key TEXT
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_current_credits INTEGER;
  v_tx_id UUID;
BEGIN
  SELECT credits INTO v_current_credits
  FROM public.profiles
  WHERE id = p_user_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'User % not found', p_user_id;
  END IF;

  IF v_current_credits < p_amount THEN
    RAISE EXCEPTION 'Insufficient credits: has %, needs %', v_current_credits, p_amount;
  END IF;

  INSERT INTO public.credit_transactions (idempotency_key, user_id, amount, action, state)
  VALUES (p_idemp_key, p_user_id, p_amount, p_action, 'reserved')
  RETURNING id INTO v_tx_id;

  UPDATE public.profiles
  SET 
    credits = credits - p_amount,
    updated_at = NOW()
  WHERE id = p_user_id;

  RETURN v_tx_id;
END;
$$;

-- 5.7 Commit (Valider la transaction)
CREATE OR REPLACE FUNCTION public.commit_credits_atomic(
  p_tx_id UUID,
  p_tokens INTEGER DEFAULT 0
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_tx public.credit_transactions%ROWTYPE;
BEGIN
  SELECT * INTO v_tx
  FROM public.credit_transactions
  WHERE id = p_tx_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Transaction % not found', p_tx_id;
  END IF;

  IF v_tx.state != 'reserved' THEN
    RAISE EXCEPTION 'Transaction % is not in reserved state (current: %)', p_tx_id, v_tx.state;
  END IF;

  UPDATE public.credit_transactions
  SET 
    state = 'completed',
    tokens_used = p_tokens,
    updated_at = NOW()
  WHERE id = p_tx_id;

  INSERT INTO public.credit_usage (user_id, reason, amount, tokens, created_at)
  VALUES (v_tx.user_id, v_tx.action, v_tx.amount, p_tokens, NOW());
END;
$$;

-- 5.8 Rollback (Rembourser la transaction)
CREATE OR REPLACE FUNCTION public.rollback_credits_atomic(
  p_tx_id UUID,
  p_reason TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_tx public.credit_transactions%ROWTYPE;
BEGIN
  SELECT * INTO v_tx
  FROM public.credit_transactions
  WHERE id = p_tx_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Transaction % not found', p_tx_id;
  END IF;

  IF v_tx.state != 'reserved' THEN
    RAISE EXCEPTION 'Cannot rollback transaction % (state: %)', p_tx_id, v_tx.state;
  END IF;

  UPDATE public.credit_transactions
  SET 
    state = 'failed',
    updated_at = NOW()
  WHERE id = p_tx_id;

  UPDATE public.profiles
  SET 
    credits = credits + v_tx.amount,
    updated_at = NOW()
  WHERE id = v_tx.user_id;
  
  INSERT INTO public.credit_usage (user_id, reason, amount, metadata, created_at)
  VALUES (v_tx.user_id, 'refund', -v_tx.amount, jsonb_build_object('reason', p_reason, 'tx_id', p_tx_id), NOW());
END;
$$;

-- 5.9 Nettoyage des transactions expirées (cron)
CREATE OR REPLACE FUNCTION public.cleanup_expired_transactions(
  p_minutes_old INTEGER DEFAULT 5
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_record RECORD;
  v_count INTEGER := 0;
BEGIN
  FOR v_record IN 
    SELECT id 
    FROM public.credit_transactions 
    WHERE state = 'reserved' 
      AND created_at < NOW() - (p_minutes_old || ' minutes')::interval
  LOOP
    BEGIN
      PERFORM public.rollback_credits_atomic(v_record.id, 'expired_timeout');
      UPDATE public.credit_transactions SET state = 'expired' WHERE id = v_record.id;
      v_count := v_count + 1;
    EXCEPTION WHEN OTHERS THEN
      RAISE WARNING 'Failed to cleanup transaction %: %', v_record.id, SQLERRM;
    END;
  END LOOP;

  RETURN v_count;
END;
$$;

-- ============================================================
-- 6. INDEXES DE PERFORMANCE & CRÉATION DES VUES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_cvs_user_id ON public.cvs(user_id);
CREATE INDEX IF NOT EXISTS idx_ats_reports_user_id ON public.ats_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_ats_reports_cv_id ON public.ats_reports(cv_id);
CREATE INDEX IF NOT EXISTS idx_interview_sessions_user_id ON public.interview_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_interview_sessions_status ON public.interview_sessions(status);
CREATE INDEX IF NOT EXISTS idx_credit_usage_user_id ON public.credit_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_usage_created_at ON public.credit_usage(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_stripe_events_user_id ON public.stripe_events(user_id);
CREATE INDEX IF NOT EXISTS idx_stripe_events_processed_at ON public.stripe_events(processed_at DESC);
CREATE INDEX IF NOT EXISTS idx_credit_tx_cleanup ON public.credit_transactions(state, created_at);
CREATE INDEX IF NOT EXISTS idx_credit_tx_user_state ON public.credit_transactions(user_id, state, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_premium_sessions_user ON public.premium_interview_sessions(user_id);

-- Vue d'administration des transactions
CREATE OR REPLACE VIEW public.admin_credit_transactions_summary AS
SELECT 
  state,
  COUNT(*) as count,
  SUM(amount) as total_credits,
  AVG(EXTRACT(EPOCH FROM (updated_at - created_at))) as avg_duration_seconds
FROM public.credit_transactions
GROUP BY state;

-- ============================================================
-- 7. VÉRIFICATION FINALE DE VALIDITÉ
-- ============================================================

DO $$
DECLARE
  v_issues INTEGER := 0;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'cvs' AND column_name = 'extracted_text') THEN
    RAISE WARNING 'MISSING: cvs.extracted_text';
    v_issues := v_issues + 1;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'add_credits_atomic') THEN
    RAISE WARNING 'MISSING: function add_credits_atomic';
    v_issues := v_issues + 1;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'process_stripe_payment') THEN
    RAISE WARNING 'MISSING: function process_stripe_payment';
    v_issues := v_issues + 1;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'stripe_events_event_id_key') THEN
    RAISE WARNING 'MISSING: UNIQUE constraint on stripe_events.event_id';
    v_issues := v_issues + 1;
  END IF;

  IF v_issues = 0 THEN
    RAISE NOTICE '✅ MIGRATION COMPLÈTE TERMINÉE AVEC SUCCÈS !';
  ELSE
    RAISE EXCEPTION '❌ Migration terminée avec % erreur(s). Voir les détails ci-dessus.', v_issues;
  END IF;
END $$;
