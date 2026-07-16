-- Migration: Credit Reservations System
-- Purpose: Implement 2-phase commit for credit consumption to prevent credit loss on crashes/errors
-- Status: Bloc 17.2.1

-- Create credit_reservations table
CREATE TABLE IF NOT EXISTS credit_reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('reserved', 'committed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '30 minutes',
  UNIQUE(session_id)
);

-- Index for fast lookups by session_id
CREATE INDEX IF NOT EXISTS idx_credit_reservations_session_id ON credit_reservations(session_id);

-- Index for cleanup of expired reservations
CREATE INDEX IF NOT EXISTS idx_credit_reservations_expires_at ON credit_reservations(expires_at);

-- Function to reserve credit (does NOT decrement yet)
CREATE OR REPLACE FUNCTION reserve_credit(p_user_id UUID, p_session_id TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
  v_plan TEXT;
  v_limit INTEGER;
  v_month_key TEXT;
  v_current_count INTEGER;
BEGIN
  -- Get user's current plan and usage
  SELECT plan, interviews_this_month, month_key
  INTO v_plan, v_current_count, v_month_key
  FROM user_usage
  WHERE user_id = p_user_id::text
  FOR UPDATE;

  -- If no record, create one
  IF NOT FOUND THEN
    INSERT INTO user_usage (user_id, plan, interviews_this_month, month_key)
    VALUES (p_user_id::text, 'free', 0, get_month_key());
    v_plan := 'free';
    v_current_count := 0;
    v_month_key := get_month_key();
  END IF;

  -- Reset monthly if needed
  IF v_month_key != get_month_key() THEN
    UPDATE user_usage
    SET interviews_this_month = 0, month_key = get_month_key()
    WHERE user_id = p_user_id::text;
    v_current_count := 0;
  END IF;

  -- Determine actual plan (check subscription status)
  IF v_plan != 'free' THEN
    SELECT subscription_status, current_period_end
    INTO v_plan, v_month_key
    FROM user_usage
    WHERE user_id = p_user_id::text;
    
    IF v_month_key IS NOT NULL AND v_month_key::timestamptz < NOW() THEN
      v_plan := 'free';
    END IF;
  END IF;

  -- Get plan limit
  v_limit := CASE v_plan
    WHEN 'free' THEN 3
    WHEN 'pro' THEN 20
    WHEN 'premium' THEN 999999
    ELSE 3
  END;

  -- Check if user has available credits
  IF v_current_count >= v_limit THEN
    RETURN FALSE;
  END IF;

  -- Create reservation
  INSERT INTO credit_reservations (user_id, session_id, status)
  VALUES (p_user_id, p_session_id, 'reserved');

  RETURN TRUE;
END;
$$;

-- Function to commit reservation (actually decrement credit)
CREATE OR REPLACE FUNCTION commit_credit(p_session_id TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
  v_user_id UUID;
  v_status TEXT;
BEGIN
  -- Get reservation
  SELECT user_id, status
  INTO v_user_id, v_status
  FROM credit_reservations
  WHERE session_id = p_session_id
  FOR UPDATE;

  -- If no reservation or already processed, return false
  IF NOT FOUND OR v_status != 'reserved' THEN
    RETURN FALSE;
  END IF;

  -- Update reservation status
  UPDATE credit_reservations
  SET status = 'committed'
  WHERE session_id = p_session_id;

  -- Actually decrement credit
  UPDATE user_usage
  SET interviews_this_month = interviews_this_month + 1
  WHERE user_id = v_user_id::text;

  RETURN TRUE;
END;
$$;

-- Function to cancel reservation (no credit consumed)
CREATE OR REPLACE FUNCTION cancel_credit(p_session_id TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
BEGIN
  -- Delete reservation if still reserved
  DELETE FROM credit_reservations
  WHERE session_id = p_session_id AND status = 'reserved';

  RETURN TRUE;
END;
$$;

-- Helper function to get month key
CREATE OR REPLACE FUNCTION get_month_key()
RETURNS TEXT
LANGUAGE sql
AS $$
  SELECT TO_CHAR(NOW(), 'YYYY-MM');
$$;

-- Cleanup function for expired reservations (call via cron)
CREATE OR REPLACE FUNCTION cleanup_expired_reservations()
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
  v_count INTEGER;
BEGIN
  DELETE FROM credit_reservations
  WHERE expires_at < NOW() AND status = 'reserved';

  GET DIAGNOSTICS v_count = ROW_COUNT;
  RETURN v_count;
END;
$$;
