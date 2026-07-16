-- Patch V5: Progress Dashboard additions

-- Add new columns to premium_interview_sessions for detailed tracking
alter table premium_interview_sessions
add column if not exists communication_score int not null default 0,
add column if not exists stress_score int not null default 0,
add column if not exists tags jsonb not null default '[]'::jsonb;
