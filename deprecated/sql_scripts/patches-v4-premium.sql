-- Enum persona & phase
create type recruiter_persona as enum (
  'big_tech_senior',
  'startup_founder',
  'corporate_hr',
  'technical_lead',
  'aggressive_recruiter'
);

create type interview_phase as enum (
  'intro',
  'cv_deep_dive',
  'technical_case',
  'behavioral',
  'pressure_test',
  'closing'
);

create table premium_interview_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) not null,
  job_title text not null,
  company text,
  persona recruiter_persona not null,
  difficulty text not null check (difficulty in ('normal','hard','elite')),
  phase interview_phase not null default 'intro',
  stress_level int not null default 10,
  technical_score int not null default 0,
  coherence_score int not null default 0,
  confidence_score int not null default 0,
  transcript jsonb not null default '[]'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_premium_sessions_user on premium_interview_sessions(user_id);

-- Add memory column for token compression optimization
alter table premium_interview_sessions
add column memory jsonb default '{}'::jsonb;

-- Anti Double Submit protection
alter table premium_interview_sessions
add column is_processing boolean default false;

