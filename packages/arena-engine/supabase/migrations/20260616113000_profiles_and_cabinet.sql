-- PART 1: Proper profiles table for CV storage
-- CV belongs to the user, not to an interview or usage record.
-- Designed for future multi-CV support.

create table if not exists profiles (
  user_id text primary key,
  cv_text text,
  cv_last_updated timestamptz,
  default_target_role text,
  seniority_level text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Migrate existing cv_text from user_usage if it was already populated
-- (safe no-op if columns don't exist or are empty)
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_name = 'user_usage' and column_name = 'cv_text'
  ) then
    insert into profiles (user_id, cv_text, cv_last_updated)
    select user_id, cv_text, cv_last_updated
    from user_usage
    where cv_text is not null
    on conflict (user_id) do update
      set cv_text = excluded.cv_text,
          cv_last_updated = excluded.cv_last_updated;

    -- Drop the columns from user_usage (they don't belong there)
    alter table user_usage drop column if exists cv_text;
    alter table user_usage drop column if exists cv_last_updated;
  end if;
end $$;

-- PART 2: Cabinet report columns on interviews (idempotent)
alter table interviews
  add column if not exists cabinet_report jsonb,
  add column if not exists cabinet_score numeric,
  add column if not exists percentile_rank numeric,
  add column if not exists evaluation_snapshot jsonb,
  add column if not exists report_version text default 'cabinet_v1';

-- Index for dashboard queries (list by user, sort by score)
create index if not exists idx_interviews_cabinet_score
  on interviews (user_id, cabinet_score desc nulls last);
