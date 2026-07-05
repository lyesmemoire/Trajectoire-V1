-- ============================================================
-- Migration 015: Referral System (Supabase-native)
-- Migre le referral depuis Prisma User vers profiles Supabase
-- ============================================================

-- 1. Ajout des colonnes referral sur profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS referral_code TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS referred_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS referral_count INTEGER DEFAULT 0;

-- Index pour lookup rapide par code
CREATE INDEX IF NOT EXISTS idx_profiles_referral_code
  ON public.profiles(referral_code);

-- 2. Fonction de génération de code referral (backend-only, déterministe + salt)
CREATE OR REPLACE FUNCTION public.generate_referral_code(p_user_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_code TEXT;
  v_existing TEXT;
BEGIN
  -- Vérifier si l'utilisateur a déjà un code
  SELECT referral_code INTO v_existing
  FROM profiles WHERE id = p_user_id;

  IF v_existing IS NOT NULL THEN
    RETURN v_existing;
  END IF;

  -- Générer un code unique basé sur l'ID utilisateur (8 caractères alphanumériques)
  -- On utilise un hash tronqué pour garantir l'unicité tout en restant lisible
  v_code := UPPER(SUBSTRING(
    encode(digest(p_user_id::text || extract(epoch from now())::text, 'sha256'), 'hex')
    FROM 1 FOR 8
  ));

  -- Insérer le code
  UPDATE profiles
  SET referral_code = v_code, updated_at = NOW()
  WHERE id = p_user_id;

  RETURN v_code;
END;
$$;

-- 3. Fonction d'attribution de referral (atomique, anti-fraude)
CREATE OR REPLACE FUNCTION public.process_referral_attribution(
  p_new_user_id UUID,
  p_referral_code TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_referrer_id UUID;
  v_new_count INTEGER;
BEGIN
  -- 1. Résoudre le parrain
  SELECT id INTO v_referrer_id
  FROM profiles
  WHERE referral_code = p_referral_code;

  IF v_referrer_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'reason', 'invalid_code');
  END IF;

  -- 2. Bloquer l'auto-referral
  IF v_referrer_id = p_new_user_id THEN
    RETURN jsonb_build_object('success', false, 'reason', 'self_referral');
  END IF;

  -- 3. Vérifier que le filleul n'est pas déjà parrainé
  IF EXISTS (
    SELECT 1 FROM profiles
    WHERE id = p_new_user_id AND referred_by IS NOT NULL
  ) THEN
    RETURN jsonb_build_object('success', false, 'reason', 'already_referred');
  END IF;

  -- 4. Attribuer le parrain au filleul
  UPDATE profiles
  SET referred_by = v_referrer_id, updated_at = NOW()
  WHERE id = p_new_user_id;

  -- 5. Incrémenter le compteur du parrain
  UPDATE profiles
  SET referral_count = referral_count + 1, updated_at = NOW()
  WHERE id = v_referrer_id
  RETURNING referral_count INTO v_new_count;

  RETURN jsonb_build_object(
    'success', true,
    'referrer_id', v_referrer_id,
    'new_referral_count', v_new_count
  );
END;
$$;

-- 4. Fonction de reward conditionnel (appelée après premier achat du filleul)
CREATE OR REPLACE FUNCTION public.reward_referrer_on_first_usage(
  p_filleul_id UUID,
  p_reward_credits INTEGER DEFAULT 2
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_referrer_id UUID;
  v_already_rewarded BOOLEAN;
  v_new_balance INTEGER;
BEGIN
  -- 1. Trouver le parrain (avec verrouillage implicite sur le profile pour la suite si besoin)
  SELECT referred_by INTO v_referrer_id
  FROM profiles
  WHERE id = p_filleul_id;

  IF v_referrer_id IS NULL THEN
    RETURN jsonb_build_object('rewarded', false, 'reason', 'no_referrer');
  END IF;

  -- 2. Vérifier si le reward a déjà été donné (via credit_ledger avec verrouillage)
  -- L'utilisation d'une transaction avec un insert conditionnel ou l'update empêche les race conditions.
  -- Pour un verrouillage complet, on verrouille la ligne du parrain dès maintenant :
  PERFORM 1 FROM profiles WHERE id = v_referrer_id FOR UPDATE;

  SELECT EXISTS (
    SELECT 1 FROM credit_ledger
    WHERE user_id = v_referrer_id
      AND reason = 'referral_reward'
      AND reference_id = p_filleul_id::text
  ) INTO v_already_rewarded;

  IF v_already_rewarded THEN
    RETURN jsonb_build_object('rewarded', false, 'reason', 'already_rewarded');
  END IF;

  -- 3. Créditer le parrain
  UPDATE profiles
  SET credits = credits + p_reward_credits, updated_at = NOW()
  WHERE id = v_referrer_id
  RETURNING credits INTO v_new_balance;

  -- 4. Logger dans le ledger
  INSERT INTO credit_ledger (user_id, type, amount, reason, reference_id)
  VALUES (v_referrer_id, 'credit', p_reward_credits, 'referral_reward', p_filleul_id::text);

  RETURN jsonb_build_object(
    'rewarded', true,
    'referrer_id', v_referrer_id,
    'credits_added', p_reward_credits,
    'new_balance', v_new_balance
  );
END;
$$;

-- ============================================================
-- VÉRIFICATION
-- ============================================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'referral_code'
  ) THEN
    RAISE EXCEPTION 'MISSING: profiles.referral_code';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'generate_referral_code') THEN
    RAISE EXCEPTION 'MISSING: function generate_referral_code';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'process_referral_attribution') THEN
    RAISE EXCEPTION 'MISSING: function process_referral_attribution';
  END IF;

  RAISE NOTICE '✅ Migration 015_referral_migration completed successfully';
END $$;
