-- supabase/migrations/20260617001000_admin_roles_and_audit.sql

-- 1. Add role column to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role text DEFAULT 'user';

-- 2. Create admin_actions_log table
CREATE TABLE IF NOT EXISTS admin_actions_log (
  id uuid primary key default gen_random_uuid(),
  admin_user_id uuid references auth.users(id) on delete cascade,
  action text not null,
  payload jsonb,
  ip_hash text,
  user_agent_hash text,
  created_at timestamptz default now()
);

-- Protect table: only readable by admins/superusers (Row Level Security)
ALTER TABLE admin_actions_log ENABLE ROW LEVEL SECURITY;

-- Assuming there's a policy to read all if role = 'admin' (can be added later if needed)
