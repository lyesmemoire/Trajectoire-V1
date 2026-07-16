create table if not exists interviews (
  session_id text primary key,
  user_id text not null,
  started_at bigint not null,
  ended_at bigint,
  transcript jsonb not null,
  metrics jsonb,
  score jsonb,
  created_at timestamp default now()
);

create index if not exists idx_interviews_user on interviews(user_id);
