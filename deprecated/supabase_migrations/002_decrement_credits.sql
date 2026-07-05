-- ============================================================
-- RPC: decrement_credits
-- Usage: supabase.rpc('decrement_credits', { user_id_input: '...', amount: 1 })
-- Pour recréditer: passer un amount négatif
-- ============================================================

CREATE OR REPLACE FUNCTION decrement_credits(user_id_input UUID, amount INT)
RETURNS VOID AS $$
BEGIN
  UPDATE profiles
  SET credits = credits - amount,
      updated_at = now()
  WHERE id = user_id_input
    AND credits - amount >= 0;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Insufficient credits or user not found';
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
