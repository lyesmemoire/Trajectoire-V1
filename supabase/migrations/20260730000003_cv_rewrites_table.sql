-- Migration: Create cv_rewrites table for caching rewrite results
-- This table stores rewrite results to enable cache HIT retrieval in cv/rewrite route

CREATE TABLE IF NOT EXISTS public.cv_rewrites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  idempotency_key TEXT UNIQUE NOT NULL,
  action TEXT NOT NULL,
  original_content TEXT NOT NULL,
  rewritten_content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '24 hours')
);

CREATE INDEX IF NOT EXISTS idx_cv_rewrites_user_id ON public.cv_rewrites(user_id);
CREATE INDEX IF NOT EXISTS idx_cv_rewrites_expires_at ON public.cv_rewrites(expires_at);

-- Cleanup expired rewrites via pg_cron
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_available_extensions WHERE name = 'pg_cron') THEN
    PERFORM cron.schedule('cleanup-expired-rewrites', '0 */6 * * *', 'DELETE FROM public.cv_rewrites WHERE expires_at < NOW();');
  ELSE
    RAISE WARNING 'pg_cron is not available for cv_rewrites cleanup.';
  END IF;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'Could not setup pg_cron for cv_rewrites: %', SQLERRM;
END
$$;
