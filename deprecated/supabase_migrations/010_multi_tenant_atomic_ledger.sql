-- =========================================
-- Migration: 010_multi_tenant_atomic_ledger.sql
-- Description: Multi-tenant atomic transactions
-- =========================================

create table if not exists organizations (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  plan text not null,
  credits_pool int default 0,
  created_at timestamp default now()
);

create table if not exists organization_credit_ledger (
  id uuid default uuid_generate_v4() primary key,
  organization_id uuid references organizations(id) on delete cascade,
  type text check (type in ('credit', 'debit')) not null,
  amount int not null check (amount > 0),
  reason text not null,
  reference_id text,
  created_at timestamp default now()
);

create index org_ledger_org_idx on organization_credit_ledger(organization_id);

alter table profiles
add column if not exists organization_id uuid references organizations(id);

create or replace function apply_credit_transaction(
  user_id_input uuid,
  type_input text,
  amount_input int,
  reason_input text,
  reference_input text default null
)
returns void
language plpgsql
security definer
as $$
declare
  org_id uuid;
  current_balance int;
begin

  -- Lock profile row (avoid race condition)
  select organization_id into org_id
  from profiles
  where id = user_id_input
  for update;

  if org_id is null then

    -- ✅ INDIVIDUAL USER

    if type_input = 'debit' then
      select credits into current_balance
      from profiles
      where id = user_id_input;

      if current_balance < amount_input then
        raise exception 'Insufficient credits';
      end if;
    end if;

    insert into credit_ledger (user_id, type, amount, reason, reference_id)
    values (user_id_input, type_input, amount_input, reason_input, reference_input);

    if type_input = 'credit' then
      update profiles
      set credits = credits + amount_input
      where id = user_id_input;
    else
      update profiles
      set credits = credits - amount_input
      where id = user_id_input;
    end if;

  else

    -- ✅ ORGANIZATION USER

    if type_input = 'debit' then
      select credits_pool into current_balance
      from organizations
      where id = org_id
      for update;

      if current_balance < amount_input then
        raise exception 'Insufficient organization credits';
      end if;
    end if;

    insert into organization_credit_ledger
      (organization_id, type, amount, reason, reference_id)
    values
      (org_id, type_input, amount_input, reason_input, reference_input);

    if type_input = 'credit' then
      update organizations
      set credits_pool = credits_pool + amount_input
      where id = org_id;
    else
      update organizations
      set credits_pool = credits_pool - amount_input
      where id = org_id;
    end if;

  end if;

end;
$$;
