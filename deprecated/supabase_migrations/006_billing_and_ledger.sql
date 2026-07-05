-- ============================================================
-- Migration: 006_billing_and_ledger.sql
-- Description: Stripe webhook anti-replay and immutable Credit Ledger
-- ============================================================

-- 1. Table for Stripe Webhook idempotency and anti-replay
CREATE TABLE IF NOT EXISTS stripe_events (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  processed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE stripe_events ENABLE ROW LEVEL SECURITY;

-- 2. Immutable Credit Ledger
CREATE TABLE IF NOT EXISTS credit_ledger (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('credit', 'debit')),
  amount INT NOT NULL CHECK (amount > 0),
  reason TEXT NOT NULL,
  reference_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexing for fast balance queries or user history
CREATE INDEX IF NOT EXISTS idx_credit_ledger_user_id ON credit_ledger(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_ledger_reference_id ON credit_ledger(reference_id);

ALTER TABLE credit_ledger ENABLE ROW LEVEL SECURITY;

-- Strict immutability rule: No one can UPDATE or DELETE a ledger row.
CREATE RULE no_update_credit_ledger AS ON UPDATE TO credit_ledger DO INSTEAD NOTHING;
CREATE RULE no_delete_credit_ledger AS ON DELETE TO credit_ledger DO INSTEAD NOTHING;


-- 3. Atomic Function: apply_credit_transaction
-- Replaces decrement_credits and any manual profile.credits update
CREATE OR REPLACE FUNCTION apply_credit_transaction(
  user_id_input UUID,
  type_input TEXT,
  amount_input INT,
  reason_input TEXT,
  reference_input TEXT DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Prevent duplicate reference usage (idempotency)
  IF reference_input IS NOT NULL THEN
    IF EXISTS (
      SELECT 1 FROM credit_ledger
      WHERE reference_id = reference_input
    ) THEN
      RETURN;
    END IF;
  END IF;

  -- Insert the immutable record
  INSERT INTO credit_ledger (user_id, type, amount, reason, reference_id)
  VALUES (user_id_input, type_input, amount_input, reason_input, reference_input);

  -- Update the cached balance on profiles
  IF type_input = 'credit' THEN
    UPDATE profiles
    SET credits = credits + amount_input
    WHERE id = user_id_input;
  ELSIF type_input = 'debit' THEN
    UPDATE profiles
    SET credits = credits - amount_input
    WHERE id = user_id_input;
  ELSE
    RAISE EXCEPTION 'Invalid transaction type: %', type_input;
  END IF;
END;
$$;

-- 4. Clean up old non-ledger functions
DROP FUNCTION IF EXISTS decrement_credits;
