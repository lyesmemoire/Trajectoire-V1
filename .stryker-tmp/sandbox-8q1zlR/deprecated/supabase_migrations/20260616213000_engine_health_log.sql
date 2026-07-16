-- Migration: 20260616213000_engine_health_log.sql
-- Create observability tables for V3 Engine

create table if not exists engine_health_log (
  id uuid default gen_random_uuid() primary key,
  interview_id uuid,
  engine_version text,
  engine_instance_id text,
  final_executive_score numeric,
  integrity_risk_index numeric,
  max_pressure_level int,
  total_turns int,
  duration_ms int,
  error_occurred boolean,
  timeout_occurred boolean,
  
  -- Distributions
  pressure_distribution jsonb,
  phase_breakdown jsonb,
  
  -- Business context for fine-grained calibration
  job_category text,
  candidate_level text,
  role_target text,
  
  created_at timestamptz default now()
);

-- Table for live engine settings (Kill switch)
create table if not exists engine_settings (
  id text primary key,
  engine_enabled boolean default true,
  updated_at timestamptz default now()
);

insert into engine_settings (id, engine_enabled) 
values ('default', true)
on conflict (id) do nothing;
