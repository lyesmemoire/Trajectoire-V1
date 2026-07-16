-- Ajout du rapport final et de la date de complétion sur les sessions
alter table interview_sessions
  add column if not exists final_report jsonb,
  add column if not exists completed_at timestamptz;

-- Index pour récupérer rapidement les sessions terminées
create index if not exists idx_sessions_completed
  on interview_sessions(user_id, completed_at desc nulls last);
