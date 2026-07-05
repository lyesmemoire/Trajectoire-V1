-- 011_interview_sessions.sql
-- Table principale pour les sessions d'entretien simulé (Mock Interview Lab)

create table if not exists interview_sessions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  job_title text,
  job_description text,
  status text check (status in ('in_progress', 'completed')) default 'in_progress',
  candidate_summary text,
  questions jsonb default '[]'::jsonb,
  answers jsonb default '[]'::jsonb,
  analysis jsonb,
  final_score int,
  level text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Index pour requêtes fréquentes
create index if not exists interview_user_idx on interview_sessions(user_id);
create index if not exists interview_status_idx on interview_sessions(user_id, status);
create index if not exists interview_created_idx on interview_sessions(created_at desc);

-- RLS
alter table interview_sessions enable row level security;

create policy "Users can view own sessions"
  on interview_sessions for select
  using (auth.uid() = user_id);

create policy "Users can insert own sessions"
  on interview_sessions for insert
  with check (auth.uid() = user_id);

create policy "Users can update own sessions"
  on interview_sessions for update
  using (auth.uid() = user_id);
