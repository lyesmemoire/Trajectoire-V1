-- Migration: Simplify Billing — 100% Abonnement
-- Supprime la logique crédits, passe à plan_type pur
-- Non-destructif : les tables sont conservées pour archivage

-- ── 1. Création robuste de la table user_usage ──────────────────────────────
-- On s'assure que la table existe avec toutes ses colonnes vitales
CREATE TABLE IF NOT EXISTS user_usage (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  plan TEXT NOT NULL DEFAULT 'free',
  plan_type TEXT NOT NULL DEFAULT 'free',
  has_used_free_trial BOOLEAN DEFAULT FALSE,
  interviews_this_month INT NOT NULL DEFAULT 0,
  month_key TEXT NOT NULL,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  subscription_status TEXT,
  current_period_end TIMESTAMPTZ,
  cv_text TEXT,
  cv_last_updated TIMESTAMPTZ
);

-- Au cas où la table existait déjà mais sans plan_type, on force l'ajout
ALTER TABLE user_usage
  ADD COLUMN IF NOT EXISTS plan_type TEXT NOT NULL DEFAULT 'free';

-- Migrer les données existantes (si la table contenait déjà des lignes)
UPDATE user_usage
SET plan_type = CASE
  WHEN plan IN ('premium', 'EXPERT') THEN 'strategique'
  WHEN plan IN ('pro', 'PRO')        THEN 'essentiel'
  ELSE 'free'
END
WHERE plan_type = 'free' AND plan != 'free';

-- ── 2. Drop les fonctions RPC crédits (plus utilisées) ──────────────────────
DROP FUNCTION IF EXISTS reserve_credit(UUID, TEXT);
DROP FUNCTION IF EXISTS commit_credit(TEXT);
DROP FUNCTION IF EXISTS cancel_credit(TEXT);
DROP FUNCTION IF EXISTS cleanup_expired_reservations();

-- ── 3. Index sur plan_type ──────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_user_usage_plan_type ON user_usage(plan_type);

-- ── Note : credit_reservations table conservée pour audit/archivage ─────────
