-- ─────────────────────────────────────────────────────────
-- Extensions
-- ─────────────────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ─────────────────────────────────────────────────────────
-- ENUM types
-- ─────────────────────────────────────────────────────────
create type plan_type        as enum ('free', 'pro');
create type objective_type   as enum (
  'promotion', 'interview', 'transition',
  'direction', 'clarity', 'other'
);
create type priority_type    as enum ('high', 'medium', 'low');
create type notif_type       as enum ('success', 'info', 'warning');
create type simulation_type  as enum ('interview', 'presentation', 'negotiation', 'feedback');
create type milestone_status as enum ('pending', 'current', 'done');

-- ─────────────────────────────────────────────────────────
-- profiles
-- Étend auth.users de Supabase
-- ─────────────────────────────────────────────────────────
create table profiles (
  id           uuid        primary key references auth.users(id) on delete cascade,
  first_name   text        not null default '',
  last_name    text        not null default '',
  role         text,
  objective    objective_type,
  plan         plan_type   not null default 'free',
  avatar_url   text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

alter table profiles enable row level security;

create policy "Users read own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "Users update own profile"
  on profiles for update
  using (auth.uid() = id);

-- Trigger : updated_at automatique
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on profiles
  for each row execute function set_updated_at();

-- Trigger : créer un profil à chaque inscription
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into profiles (id, first_name, last_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'first_name', ''),
    coalesce(new.raw_user_meta_data->>'last_name',  '')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ─────────────────────────────────────────────────────────
-- evaluations
-- ─────────────────────────────────────────────────────────
create table evaluations (
  id               uuid        primary key default uuid_generate_v4(),
  user_id          uuid        not null references profiles(id) on delete cascade,
  confidence_score integer     check (confidence_score between 0 and 100),
  stress_score     integer     check (stress_score     between 0 and 100),
  preparedness     integer     check (preparedness     between 0 and 100),
  decision_score   integer     check (decision_score   between 0 and 100),
  raw_answers      jsonb,
  completed_at     timestamptz,
  created_at       timestamptz not null default now()
);

alter table evaluations enable row level security;

create policy "Users read own evaluations"
  on evaluations for select
  using (auth.uid() = user_id);

create policy "Users insert own evaluations"
  on evaluations for insert
  with check (auth.uid() = user_id);

-- ─────────────────────────────────────────────────────────
-- competency_scores
-- 1 ligne par évaluation par compétence
-- ─────────────────────────────────────────────────────────
create table competency_scores (
  id             uuid    primary key default uuid_generate_v4(),
  evaluation_id  uuid    not null references evaluations(id) on delete cascade,
  user_id        uuid    not null references profiles(id)    on delete cascade,
  name           text    not null,
  score          integer not null check (score between 0 and 100),
  prev_score     integer check (prev_score between 0 and 100),
  created_at     timestamptz not null default now()
);

alter table competency_scores enable row level security;

create policy "Users read own competency_scores"
  on competency_scores for select
  using (auth.uid() = user_id);

create policy "Users insert own competency_scores"
  on competency_scores for insert
  with check (auth.uid() = user_id);

-- ─────────────────────────────────────────────────────────
-- simulations
-- ─────────────────────────────────────────────────────────
create table simulations (
  id             uuid             primary key default uuid_generate_v4(),
  user_id        uuid             not null references profiles(id) on delete cascade,
  type           simulation_type  not null,
  score          integer          check (score between 0 and 100),
  feedback       text,
  duration_sec   integer,
  completed_at   timestamptz,
  created_at     timestamptz      not null default now()
);

alter table simulations enable row level security;

create policy "Users read own simulations"
  on simulations for select
  using (auth.uid() = user_id);

create policy "Users insert own simulations"
  on simulations for insert
  with check (auth.uid() = user_id);

-- ─────────────────────────────────────────────────────────
-- action_items
-- ─────────────────────────────────────────────────────────
create table action_items (
  id          uuid           primary key default uuid_generate_v4(),
  user_id     uuid           not null references profiles(id) on delete cascade,
  label       text           not null,
  done        boolean        not null default false,
  priority    priority_type  not null default 'medium',
  due_date    date,
  created_at  timestamptz    not null default now(),
  updated_at  timestamptz    not null default now()
);

alter table action_items enable row level security;

create policy "Users read own action_items"
  on action_items for select
  using (auth.uid() = user_id);

create policy "Users insert own action_items"
  on action_items for insert
  with check (auth.uid() = user_id);

create policy "Users update own action_items"
  on action_items for update
  using (auth.uid() = user_id);

create trigger action_items_updated_at
  before update on action_items
  for each row execute function set_updated_at();

-- ─────────────────────────────────────────────────────────
-- plan_milestones
-- ─────────────────────────────────────────────────────────
create table plan_milestones (
  id          uuid             primary key default uuid_generate_v4(),
  user_id     uuid             not null references profiles(id) on delete cascade,
  week_label  text             not null,
  title       text             not null,
  status      milestone_status not null default 'pending',
  position    integer          not null default 0,
  created_at  timestamptz      not null default now(),
  updated_at  timestamptz      not null default now()
);

alter table plan_milestones enable row level security;

create policy "Users read own plan_milestones"
  on plan_milestones for select
  using (auth.uid() = user_id);

create policy "Users insert own plan_milestones"
  on plan_milestones for insert
  with check (auth.uid() = user_id);

create policy "Users update own plan_milestones"
  on plan_milestones for update
  using (auth.uid() = user_id);

create trigger plan_milestones_updated_at
  before update on plan_milestones
  for each row execute function set_updated_at();

-- ─────────────────────────────────────────────────────────
-- notifications
-- ─────────────────────────────────────────────────────────
create table notifications (
  id          uuid        primary key default uuid_generate_v4(),
  user_id     uuid        not null references profiles(id) on delete cascade,
  type        notif_type  not null default 'info',
  title       text        not null,
  body        text        not null,
  read        boolean     not null default false,
  created_at  timestamptz not null default now()
);

alter table notifications enable row level security;

create policy "Users read own notifications"
  on notifications for select
  using (auth.uid() = user_id);

create policy "Users update own notifications"
  on notifications for update
  using (auth.uid() = user_id);

-- ─────────────────────────────────────────────────────────
-- progression_snapshots
-- Snapshot hebdomadaire pour le graphique
-- ─────────────────────────────────────────────────────────
create table progression_snapshots (
  id             uuid    primary key default uuid_generate_v4(),
  user_id        uuid    not null references profiles(id) on delete cascade,
  week_label     text    not null,
  confidence     integer check (confidence    between 0 and 100),
  preparedness   integer check (preparedness  between 0 and 100),
  recorded_at    timestamptz not null default now()
);

alter table progression_snapshots enable row level security;

create policy "Users read own snapshots"
  on progression_snapshots for select
  using (auth.uid() = user_id);

create policy "Users insert own snapshots"
  on progression_snapshots for insert
  with check (auth.uid() = user_id);

-- ─────────────────────────────────────────────────────────
-- View : dashboard_summary
-- Agrégat principal pour alimenter la Home du dashboard
-- ─────────────────────────────────────────────────────────
create or replace view dashboard_summary as
select
  p.id                                          as user_id,
  p.first_name,
  p.last_name,
  p.role,
  p.plan,
  p.objective,

  -- Dernière évaluation
  e.id                                          as last_evaluation_id,
  e.confidence_score,
  e.stress_score,
  e.preparedness,
  e.decision_score,
  e.completed_at                                as last_evaluated_at,

  -- Compteurs
  (select count(*) from evaluations  ev where ev.user_id = p.id)  as total_evaluations,
  (select count(*) from simulations  si where si.user_id = p.id)  as total_simulations,
  (select count(*) from action_items ai where ai.user_id = p.id and ai.done = false) as pending_actions,
  (select count(*) from notifications n  where n.user_id  = p.id and n.read  = false) as unread_notifications

from profiles p
left join lateral (
  select * from evaluations
  where user_id = p.id and completed_at is not null
  order by completed_at desc
  limit 1
) e on true;
