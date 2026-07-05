-- supabase/patches-v2.sql
-- Migration complète : schéma + sécurité + fonctions atomiques
-- À exécuter dans Supabase SQL Editor dans l'ordre exact

-- ============================================================
-- SECTION 1 : MIGRATIONS DE SCHÉMA (ALTER TABLE)
-- ============================================================

-- 1.1 Table cvs : renommage content → extracted_text
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'cvs' AND column_name = 'content'
  ) THEN
    ALTER TABLE cvs RENAME COLUMN content TO extracted_text;
    RAISE NOTICE 'cvs.content renamed to extracted_text';
  ELSE
    RAISE NOTICE 'cvs.extracted_text already exists, skipping';
  END IF;
END $$;

-- 1.2 Table cvs : ajout colonnes manquantes
ALTER TABLE cvs
  ADD COLUMN IF NOT EXISTS word_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS page_count INTEGER DEFAULT 1;

-- 1.3 Table ats_reports : ajout colonnes manquantes
ALTER TABLE ats_reports
  ADD COLUMN IF NOT EXISTS job_description TEXT,
  ADD COLUMN IF NOT EXISTS matched_keywords JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS missing_keywords JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS suggestions JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS total_keywords INTEGER DEFAULT 0;

-- 1.4 Table interview_sessions : ajout colonnes manquantes
ALTER TABLE interview_sessions
  ADD COLUMN IF NOT EXISTS job_title TEXT,
  ADD COLUMN IF NOT EXISTS job_description TEXT,
  ADD COLUMN IF NOT EXISTS questions JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS answers JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS feedback JSONB,
  ADD COLUMN IF NOT EXISTS score INTEGER,
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'in_progress'
    CHECK (status IN ('in_progress', 'completed', 'abandoned')),
  ADD COLUMN IF NOT EXISTS tokens_used INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS tokens_used_feedback INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ;

-- 1.5 Table credit_usage : harmonisation colonnes
ALTER TABLE credit_usage
  ADD COLUMN IF NOT EXISTS tokens_used INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS estimated_cost_eur DECIMAL(10,6) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;

-- Renommage tokens → tokens_used si ancienne colonne existe
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'credit_usage' AND column_name = 'tokens'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'credit_usage' AND column_name = 'tokens_used'
  ) THEN
    ALTER TABLE credit_usage RENAME COLUMN tokens TO tokens_used;
    RAISE NOTICE 'credit_usage.tokens renamed to tokens_used';
  END IF;
END $$;

-- Renommage estimated_cost → estimated_cost_eur si ancienne colonne existe
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'credit_usage' AND column_name = 'estimated_cost'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'credit_usage' AND column_name = 'estimated_cost_eur'
  ) THEN
    ALTER TABLE credit_usage RENAME COLUMN estimated_cost TO estimated_cost_eur;
    RAISE NOTICE 'credit_usage.estimated_cost renamed to estimated_cost_eur';
  END IF;
END $$;

-- 1.6 Table stripe_events : structure complète
CREATE TABLE IF NOT EXISTS stripe_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id TEXT NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  credits_added INTEGER,
  processed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contrainte UNIQUE sur event_id (idempotence Stripe)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'stripe_events_event_id_key'
  ) THEN
    ALTER TABLE stripe_events
      ADD CONSTRAINT stripe_events_event_id_key UNIQUE (event_id);
    RAISE NOTICE 'UNIQUE constraint added on stripe_events.event_id';
  END IF;
END $$;

-- Index pour requêtes fréquentes
CREATE INDEX IF NOT EXISTS idx_stripe_events_user_id
  ON stripe_events(user_id);

CREATE INDEX IF NOT EXISTS idx_stripe_events_processed_at
  ON stripe_events(processed_at DESC);

-- ============================================================
-- SECTION 2 : SÉCURITÉ RLS
-- ============================================================

-- 2.1 Supprimer la politique publique dangereuse sur stripe_events
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'stripe_events'
      AND policyname = 'Service role can manage events'
  ) THEN
    DROP POLICY "Service role can manage events" ON stripe_events;
    RAISE NOTICE 'Dangerous public RLS policy removed from stripe_events';
  END IF;
END $$;

-- 2.2 stripe_events : RLS activé, AUCUNE politique publique
-- Seul le service role (bypass RLS) peut écrire
ALTER TABLE stripe_events ENABLE ROW LEVEL SECURITY;

-- Les utilisateurs authentifiés peuvent consulter LEURS événements
-- (lecture seule, utile pour debug côté client si nécessaire)
CREATE POLICY IF NOT EXISTS "Users can view own stripe events"
  ON stripe_events
  FOR SELECT
  USING (auth.uid() = user_id);

-- 2.3 Policies RLS complètes pour toutes les tables sensibles
ALTER TABLE cvs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can access own cvs" ON cvs;
CREATE POLICY "Users can access own cvs"
  ON cvs FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

ALTER TABLE ats_reports ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can access own ats_reports" ON ats_reports;
CREATE POLICY "Users can access own ats_reports"
  ON ats_reports FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

ALTER TABLE interview_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can access own interview_sessions" ON interview_sessions;
CREATE POLICY "Users can access own interview_sessions"
  ON interview_sessions FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

ALTER TABLE credit_usage ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own credit_usage" ON credit_usage;
CREATE POLICY "Users can view own credit_usage"
  ON credit_usage FOR SELECT
  USING (auth.uid() = user_id);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can access own profile" ON profiles;
CREATE POLICY "Users can access own profile"
  ON profiles FOR ALL
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ============================================================
-- SECTION 3 : FONCTIONS ATOMIQUES
-- ============================================================

-- 3.1 Déduction atomique de crédits (existante — mise à jour)
CREATE OR REPLACE FUNCTION deduct_credits_atomic(
  uid UUID,
  amt INTEGER
)
RETURNS INTEGER -- Retourne le solde restant
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

  -- Verrouillage de la ligne pour éviter toute race condition
  SELECT credits INTO v_current_credits
  FROM profiles
  WHERE id = uid
  FOR UPDATE; -- Verrou exclusif sur la ligne

  IF NOT FOUND THEN
    RAISE EXCEPTION 'User % not found', uid;
  END IF;

  IF v_current_credits < amt THEN
    RAISE EXCEPTION 'Insufficient credits: has %, needs %',
      v_current_credits, amt;
  END IF;

  v_new_credits := v_current_credits - amt;

  UPDATE profiles
  SET
    credits = v_new_credits,
    updated_at = NOW()
  WHERE id = uid;

  RETURN v_new_credits;
END;
$$;

-- 3.2 Addition atomique de crédits (NOUVELLE FONCTION — corrige C8)
CREATE OR REPLACE FUNCTION add_credits_atomic(
  uid UUID,
  amt INTEGER
)
RETURNS INTEGER -- Retourne le nouveau solde
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

  UPDATE profiles
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

-- 3.3 Traitement atomique complet d'un paiement Stripe
CREATE OR REPLACE FUNCTION process_stripe_payment(
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
  -- Étape 1 : Insérer l'événement Stripe
  -- Échoue immédiatement si l'event_id existe déjà (UNIQUE constraint)
  -- Cela bloque toute exécution parallèle avant même le crédit
  INSERT INTO stripe_events (event_id, user_id, credits_added, processed_at)
  VALUES (p_event_id, p_user_id, p_credits, NOW());

  -- Étape 2 : Créditer l'utilisateur avec verrou ligne
  UPDATE profiles
  SET
    credits = credits + p_credits,
    updated_at = NOW()
  WHERE id = p_user_id
  RETURNING credits INTO v_new_credits;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'User % not found during payment processing', p_user_id;
  END IF;

  -- Étape 3 : Logger la transaction financière
  INSERT INTO credit_usage (
    user_id,
    action,
    credits_spent,
    tokens_used,
    estimated_cost_eur,
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
    -- Événement déjà traité : retour silencieux (idempotence)
    RETURN jsonb_build_object(
      'success', false,
      'reason', 'already_processed',
      'event_id', p_event_id
    );
  WHEN OTHERS THEN
    -- Toute autre erreur annule la transaction entière
    RAISE;
END;
$$;

-- ============================================================
-- SECTION 4 : INDEXES DE PERFORMANCE
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_cvs_user_id
  ON cvs(user_id);

CREATE INDEX IF NOT EXISTS idx_ats_reports_user_id
  ON ats_reports(user_id);

CREATE INDEX IF NOT EXISTS idx_ats_reports_cv_id
  ON ats_reports(cv_id);

CREATE INDEX IF NOT EXISTS idx_interview_sessions_user_id
  ON interview_sessions(user_id);

CREATE INDEX IF NOT EXISTS idx_interview_sessions_status
  ON interview_sessions(status);

CREATE INDEX IF NOT EXISTS idx_credit_usage_user_id
  ON credit_usage(user_id);

CREATE INDEX IF NOT EXISTS idx_credit_usage_created_at
  ON credit_usage(created_at DESC);

-- ============================================================
-- SECTION 5 : TRIGGER CRÉATION PROFILE AUTOMATIQUE
-- ============================================================

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO profiles (id, email, credits, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    2, -- Bonus signup : 2 crédits offerts
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO NOTHING; -- Idempotent si trigger se déclenche deux fois
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- VÉRIFICATION FINALE
-- ============================================================

DO $$
DECLARE
  v_issues INTEGER := 0;
BEGIN
  -- Vérifier extracted_text existe sur cvs
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'cvs' AND column_name = 'extracted_text'
  ) THEN
    RAISE WARNING 'MISSING: cvs.extracted_text';
    v_issues := v_issues + 1;
  END IF;

  -- Vérifier add_credits_atomic existe
  IF NOT EXISTS (
    SELECT 1 FROM pg_proc WHERE proname = 'add_credits_atomic'
  ) THEN
    RAISE WARNING 'MISSING: function add_credits_atomic';
    v_issues := v_issues + 1;
  END IF;

  -- Vérifier process_stripe_payment existe
  IF NOT EXISTS (
    SELECT 1 FROM pg_proc WHERE proname = 'process_stripe_payment'
  ) THEN
    RAISE WARNING 'MISSING: function process_stripe_payment';
    v_issues := v_issues + 1;
  END IF;

  -- Vérifier contrainte UNIQUE sur stripe_events
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'stripe_events_event_id_key'
  ) THEN
    RAISE WARNING 'MISSING: UNIQUE constraint on stripe_events.event_id';
    v_issues := v_issues + 1;
  END IF;

  IF v_issues = 0 THEN
    RAISE NOTICE '✅ Migration patches-v2.sql completed successfully';
  ELSE
    RAISE EXCEPTION '❌ Migration completed with % issue(s). Check warnings above.', v_issues;
  END IF;
END $$;
