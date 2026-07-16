-- ============================================================
-- Migration: 004_max_fraud_protection.sql
-- Description: Table creations for Device Fingerprinting, Risk Scoring, and Shadow Banning
-- ============================================================

-- 1. Tableau des devices pour empêcher la création multi-comptes
CREATE TABLE IF NOT EXISTS user_devices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  fingerprint TEXT NOT NULL,
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index pour vérifier rapidement si un fingerprint a déjà été utilisé de nombreuses fois
CREATE INDEX IF NOT EXISTS idx_user_devices_fingerprint ON user_devices(fingerprint);
CREATE INDEX IF NOT EXISTS idx_user_devices_user_id ON user_devices(user_id);

ALTER TABLE user_devices ENABLE ROW LEVEL SECURITY;
-- Aucun accès direct pour les utilisateurs (service role uniquement)

-- 2. Tableau des scores de risque
CREATE TABLE IF NOT EXISTS user_risk_scores (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  risk_score INT DEFAULT 0 NOT NULL,
  flags JSONB DEFAULT '{}'::jsonb NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE user_risk_scores ENABLE ROW LEVEL SECURITY;
-- Aucun accès direct

-- 3. Ajout de la colonne fraud_flag (Shadow Banning) sur la table profiles
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS fraud_flag BOOLEAN DEFAULT FALSE NOT NULL;

-- Fonction pratique (Trigger) pour initialiser user_risk_scores
CREATE OR REPLACE FUNCTION init_user_risk_score()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_risk_scores (user_id, risk_score, flags)
  VALUES (NEW.id, 0, '{}'::jsonb)
  ON CONFLICT DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Exécution sur la création d'un profile
DROP TRIGGER IF EXISTS on_profile_created_init_risk ON profiles;
CREATE TRIGGER on_profile_created_init_risk
  AFTER INSERT ON profiles
  FOR EACH ROW EXECUTE FUNCTION init_user_risk_score();
