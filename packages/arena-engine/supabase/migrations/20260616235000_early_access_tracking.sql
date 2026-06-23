-- supabase/migrations/20260616235000_early_access_tracking.sql
CREATE TABLE IF NOT EXISTS public.early_access_tracking (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  created_at timestamptz default now()
);

ALTER TABLE public.early_access_tracking ENABLE ROW LEVEL SECURITY;
