create table if not exists user_usage (
  user_id text primary key,
  plan text not null default 'free',
  interviews_this_month int not null default 0,
  month_key text not null
);
