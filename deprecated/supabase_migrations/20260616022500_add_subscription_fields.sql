-- Cabinet Engine: Add subscription fields + CV text + cabinet report columns
-- Safe for re-runs (IF NOT EXISTS / ADD COLUMN IF NOT EXISTS)

-- 1. Stripe events idempotency table
create table if not exists stripe_events (
  id text primary key,
  type text,
  created_at timestamptz default now()
);

-- 2. Subscription fields on user_usage
alter table user_usage
  add column if not exists stripe_customer_id text,
  add column if not exists stripe_subscription_id text,
  add column if not exists subscription_status text,
  add column if not exists current_period_end timestamptz;

-- 3. CV text on user_usage (CV belongs to user, not to interview)
alter table user_usage
  add column if not exists cv_text text,
  add column if not exists cv_last_updated timestamptz;

-- 4. Cabinet report columns on interviews
alter table interviews
  add column if not exists cabinet_report jsonb,
  add column if not exists cabinet_score numeric,
  add column if not exists percentile_rank numeric,
  add column if not exists report_version text default 'cabinet_v1';
