-- ============================================================
-- Migration: 005_centralized_fraud_engine.sql
-- Description: Refactoring for Centralized Fraud Engine
-- ============================================================

-- 1. Table for tracking IP registration spikes
CREATE TABLE IF NOT EXISTS ip_activity (
  ip_address TEXT PRIMARY KEY,
  registration_count INT DEFAULT 0 NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE ip_activity ENABLE ROW LEVEL SECURITY;
-- No direct access

-- 2. Drop fraud_flag from profiles
ALTER TABLE profiles DROP COLUMN IF EXISTS fraud_flag;

-- 3. Add banned flag to profiles for hard-bans
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS banned BOOLEAN DEFAULT FALSE NOT NULL;

-- 4. Ensure fraud_flag is in user_risk_scores
ALTER TABLE user_risk_scores ADD COLUMN IF NOT EXISTS fraud_flag BOOLEAN DEFAULT FALSE NOT NULL;
