-- ============================================================
-- Migration: 014_audit_fixes.sql
-- Description: Correctifs d'audit de sécurité et transactionnalité
-- ============================================================

-- ✅ 1. stripe_customer_id
alter table public.profiles
add column if not exists stripe_customer_id text;

-- ✅ 2. RLS Fix profiles
drop policy if exists "Users can update own profile"
on public.profiles;

create or replace function update_profile_safe(
  first_name_input text default null,
  last_name_input text default null
)
returns void
language plpgsql
security definer
as $$
begin
  update public.profiles
  set
    first_name = coalesce(first_name_input, first_name),
    last_name = coalesce(last_name_input, last_name)
  where id = auth.uid();
end;
$$;

-- ✅ 3. reserve_credits_atomic
create or replace function reserve_credits_atomic(
  user_id_input uuid,
  amount_input int,
  reason_input text,
  reference_input text
)
returns boolean
language plpgsql
security definer
as $$
declare
  current_credits int;
  org_id uuid;
begin
  select organization_id into org_id
  from profiles
  where id = user_id_input
  for update;

  if org_id is null then
    select credits into current_credits
    from profiles
    where id = user_id_input
    for update;

    if current_credits < amount_input then
      return false;
    end if;

    update profiles
    set credits = credits - amount_input
    where id = user_id_input;

    insert into credit_ledger (
      user_id, type, amount, reason, reference_id
    )
    values (
      user_id_input, 'debit', amount_input,
      reason_input, reference_input
    );

  else
    select credits_pool into current_credits
    from organizations
    where id = org_id
    for update;

    if current_credits < amount_input then
      return false;
    end if;

    update organizations
    set credits_pool = credits_pool - amount_input
    where id = org_id;

    insert into organization_credit_ledger (
      organization_id, type, amount, reason, reference_id
    )
    values (
      org_id, 'debit', amount_input,
      reason_input, reference_input
    );

  end if;

  return true;
end;
$$;

-- ✅ 4. rollback_credits_atomic
create or replace function rollback_credits_atomic(
  user_id_input uuid,
  amount_input int,
  reason_input text,
  reference_input text
)
returns void
language plpgsql
security definer
as $$
declare
  org_id uuid;
begin
  select organization_id into org_id
  from profiles
  where id = user_id_input;

  if org_id is null then
    update profiles
    set credits = credits + amount_input
    where id = user_id_input;

    insert into credit_ledger (
      user_id, type, amount, reason, reference_id
    )
    values (
      user_id_input, 'credit', amount_input,
      reason_input || '_rollback', reference_input
    );

  else
    update organizations
    set credits_pool = credits_pool + amount_input
    where id = org_id;

    insert into organization_credit_ledger (
      organization_id, type, amount, reason, reference_id
    )
    values (
      org_id, 'credit', amount_input,
      reason_input || '_rollback', reference_input
    );

  end if;
end;
$$;
