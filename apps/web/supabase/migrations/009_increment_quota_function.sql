-- Fonction RPC pour incrémenter le quota utilisateur
CREATE OR REPLACE FUNCTION increment_quota(
  p_user_id UUID,
  p_quota_type TEXT,
  p_amount INTEGER DEFAULT 1,
  p_period_start TIMESTAMP WITH TIME ZONE,
  p_period_end TIMESTAMP WITH TIME ZONE
)
RETURNS VOID
LANGUAGE plpgsql
AS $$
DECLARE
  v_quota_id UUID;
BEGIN
  -- Chercher un quota existant
  SELECT id INTO v_quota_id
  FROM user_quotas
  WHERE user_id = p_user_id
    AND quota_type = p_quota_type
    AND period_start >= p_period_start
  LIMIT 1;

  IF v_quota_id IS NULL THEN
    -- Créer un nouveau quota
    INSERT INTO user_quotas (user_id, quota_type, quota_limit, quota_used, period_start, period_end)
    VALUES (
      p_user_id,
      p_quota_type,
      -- Définir la limite selon le type (par défaut Free)
      CASE p_quota_type
        WHEN 'simulations' THEN 10
        WHEN 'messages' THEN 50
        WHEN 'reports' THEN 5
        WHEN 'tokens' THEN 100000
        ELSE 100
      END,
      p_amount,
      p_period_start,
      p_period_end
    );
  ELSE
    -- Incrémenter le quota existant
    UPDATE user_quotas
    SET quota_used = quota_used + p_amount,
        updated_at = NOW()
    WHERE id = v_quota_id;
  END IF;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION increment_quota TO authenticated;
GRANT EXECUTE ON FUNCTION increment_quota TO anon;
