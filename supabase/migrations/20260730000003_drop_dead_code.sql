-- Migration 3: Drop dead code + cleanup

-- Drop the unsafe process_stripe_payment function (no callers, no idempotence)
DROP FUNCTION IF EXISTS public.process_stripe_payment(TEXT, UUID, INTEGER, INTEGER, TEXT);

-- Drop the legacy spendCredits RPC if it exists (replaced by reserve/commit)
DROP FUNCTION IF EXISTS public.deduct_credits_atomic(UUID, INTEGER);
