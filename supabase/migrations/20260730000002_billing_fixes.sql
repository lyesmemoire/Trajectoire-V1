-- Migration 2: Billing Fixes (Idempotency, Cron, Commit checks)

DROP FUNCTION IF EXISTS public.add_credits_atomic(UUID, INTEGER);

CREATE OR REPLACE FUNCTION public.add_credits_atomic(
  uid UUID,
  amt INTEGER,
  p_idemp_key TEXT DEFAULT NULL,
  p_action TEXT DEFAULT 'add_credits'
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

  IF p_idemp_key IS NOT NULL THEN
    -- Attempt to insert into credit_transactions to ensure idempotency
    BEGIN
      INSERT INTO public.credit_transactions (idempotency_key, user_id, amount, action, state)
      VALUES (p_idemp_key, uid, amt, p_action, 'committed');
    EXCEPTION WHEN unique_violation THEN
      -- Already processed, return current balance
      SELECT credits INTO v_new_credits FROM public.profiles WHERE id = uid;
      RETURN v_new_credits;
    END;
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
  v_tx RECORD;
BEGIN
  SELECT * INTO v_tx FROM public.credit_transactions WHERE id = p_tx_id FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Transaction % not found', p_tx_id;
  END IF;

  IF v_tx.state != 'reserved' THEN
    RAISE EXCEPTION 'Transaction % is in state %, cannot commit', p_tx_id, v_tx.state;
  END IF;

  UPDATE public.credit_transactions
  SET state = 'committed', tokens_used = p_tokens, updated_at = NOW()
  WHERE id = p_tx_id;

  INSERT INTO public.credit_usage (user_id, action, amount, tokens, created_at)
  VALUES (v_tx.user_id, v_tx.action, v_tx.amount, p_tokens, NOW());
END;
$$;


DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_available_extensions WHERE name = 'pg_cron') THEN
    CREATE EXTENSION IF NOT EXISTS pg_cron;
    PERFORM cron.schedule('cleanup-expired-reservations', '*/5 * * * *', 'SELECT public.cleanup_expired_transactions(5);');
  ELSE
    RAISE WARNING 'pg_cron is not available.';
  END IF;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'Could not setup pg_cron: %', SQLERRM;
END
$$;
