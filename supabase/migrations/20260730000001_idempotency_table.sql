CREATE TABLE IF NOT EXISTS public.idempotency (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  idempotency_key TEXT NOT NULL,
  user_id TEXT NOT NULL,
  operation TEXT NOT NULL,
  request_params JSONB NOT NULL DEFAULT '{}'::jsonb,
  result_ref TEXT,
  status TEXT NOT NULL CHECK (status IN ('pending', 'completed', 'failed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ NOT NULL,
  CONSTRAINT idempotency_key_user_op_unique UNIQUE (idempotency_key, user_id, operation)
);

CREATE INDEX IF NOT EXISTS idx_idempotency_expires_at ON public.idempotency(expires_at);
