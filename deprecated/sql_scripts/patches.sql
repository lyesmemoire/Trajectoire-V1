-- Add this to the SQL setup to support atomic deductions
CREATE OR REPLACE FUNCTION public.deduct_credits_atomic(uid UUID, amt INTEGER)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE public.profiles
  SET credits = credits - amt
  WHERE id = uid AND credits >= amt;
  
  IF FOUND THEN
    RETURN TRUE;
  ELSE
    RETURN FALSE;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Table for Stripe Idempotency
CREATE TABLE IF NOT EXISTS stripe_events (
  event_id TEXT PRIMARY KEY,
  processed_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

ALTER TABLE stripe_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role can manage events" ON stripe_events FOR ALL USING (true);
