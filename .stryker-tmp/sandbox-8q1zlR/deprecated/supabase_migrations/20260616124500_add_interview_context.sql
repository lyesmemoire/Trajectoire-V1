-- Add contextual interview columns
alter table interviews
  add column if not exists interview_context jsonb,
  add column if not exists job_offer_summary text;
