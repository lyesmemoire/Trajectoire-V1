-- Table pour les réponses individuelles
create table if not exists interview_responses (
  id            uuid primary key default gen_random_uuid(),
  session_id    uuid not null references interview_sessions(id) on delete cascade,
  question_index integer not null check (question_index between 0 and 2),
  question_text text not null,
  transcription text not null,
  score         jsonb not null,
  created_at    timestamptz not null default now(),
  
  unique (session_id, question_index) -- Une réponse par question par session
);

-- Index pour les rapports
create index if not exists idx_responses_session on interview_responses(session_id);

-- RLS : un utilisateur ne voit que ses propres réponses
alter table interview_responses enable row level security;

create policy "users_own_responses" on interview_responses
  for all using (
    session_id in (
      select id from interview_sessions where user_id = auth.uid()
    )
  );
