-- Migration: Runtime Sessions Persistence
-- Date: 2026-07-11
-- Purpose: Persist Runtime session snapshots to Supabase

-- Runtime Sessions table: Stores complete Runtime session snapshots
CREATE TABLE IF NOT EXISTS runtime_sessions (
  id TEXT PRIMARY KEY,
  session_id TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  candidate_id TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'closed', 'error')),
  
  -- Session timing
  started_at TIMESTAMP WITH TIME ZONE NOT NULL,
  ended_at TIMESTAMP WITH TIME ZONE,
  duration INTEGER,
  last_saved_at TIMESTAMP WITH TIME ZONE,
  save_count INTEGER NOT NULL DEFAULT 0,
  
  -- Complete snapshot data (JSONB)
  runtime_state JSONB NOT NULL,
  provider_state JSONB NOT NULL,
  audio_state JSONB NOT NULL,
  pipeline_state JSONB NOT NULL,
  timeline JSONB NOT NULL,
  correlation_ids TEXT[] NOT NULL,
  diagnostics JSONB NOT NULL,
  metadata JSONB NOT NULL,
  errors JSONB NOT NULL,
  events JSONB NOT NULL,
  
  -- Versioning for future compatibility
  version TEXT NOT NULL DEFAULT '1.0',
  checksum TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  closed_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_runtime_sessions_session_id ON runtime_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_runtime_sessions_user_id ON runtime_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_runtime_sessions_candidate_id ON runtime_sessions(candidate_id);
CREATE INDEX IF NOT EXISTS idx_runtime_sessions_status ON runtime_sessions(status);
CREATE INDEX IF NOT EXISTS idx_runtime_sessions_started_at ON runtime_sessions(started_at DESC);
CREATE INDEX IF NOT EXISTS idx_runtime_sessions_last_saved_at ON runtime_sessions(last_saved_at DESC);
CREATE INDEX IF NOT EXISTS idx_runtime_sessions_version ON runtime_sessions(version);

-- Enable RLS
ALTER TABLE runtime_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own runtime sessions" ON runtime_sessions 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own runtime sessions" ON runtime_sessions 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own runtime sessions" ON runtime_sessions 
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own runtime sessions" ON runtime_sessions 
  FOR DELETE USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_runtime_sessions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updated_at
CREATE TRIGGER update_runtime_sessions_updated_at 
  BEFORE UPDATE ON runtime_sessions
  FOR EACH ROW EXECUTE FUNCTION update_runtime_sessions_updated_at();

-- Function to update last_saved_at and save_count on save/update
CREATE OR REPLACE FUNCTION update_runtime_sessions_save_metadata()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_saved_at = TIMEZONE('utc', NOW());
  NEW.save_count = COALESCE(OLD.save_count, 0) + 1;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for save metadata (only on updates, not on initial insert)
CREATE TRIGGER update_runtime_sessions_save_metadata 
  BEFORE UPDATE ON runtime_sessions
  FOR EACH ROW 
  WHEN (OLD.status = 'active' AND NEW.status = 'active')
  EXECUTE FUNCTION update_runtime_sessions_save_metadata();

-- Function to set closed_at when status changes to closed
CREATE OR REPLACE FUNCTION set_runtime_sessions_closed_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'closed' AND OLD.status != 'closed' THEN
    NEW.closed_at = TIMEZONE('utc', NOW());
    NEW.ended_at = COALESCE(NEW.ended_at, TIMEZONE('utc', NOW()));
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for closed_at
CREATE TRIGGER set_runtime_sessions_closed_at 
  BEFORE UPDATE ON runtime_sessions
  FOR EACH ROW 
  WHEN (NEW.status != OLD.status)
  EXECUTE FUNCTION set_runtime_sessions_closed_at();

-- Comment on table
COMMENT ON TABLE runtime_sessions IS 'Stores complete Runtime session snapshots for persistence and restoration';
