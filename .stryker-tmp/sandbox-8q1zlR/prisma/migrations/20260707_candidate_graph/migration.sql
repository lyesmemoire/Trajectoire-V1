-- Migration: Candidate Graph Tables
-- Description: Create projection tables for candidate intelligence graphs and snapshots
--
-- IMPORTANT: These are PROJECTION tables, not source of truth.
-- The source of truth remains:
-- - User table (identity)
-- - CareerProfile table (career data)
-- - CVAnalysis table (skills, education)
-- - InterviewSession table (interview history)
--
-- candidate_graphs stores a consolidated view (projection) computed from source tables
-- candidate_graph_snapshots stores historical projections for progression tracking
-- These tables are caches for performance and convenience, not data duplication

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create candidate_graphs table
CREATE TABLE IF NOT EXISTS candidate_graphs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  graph JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_candidate_graphs_user_id ON candidate_graphs(user_id);

-- Create index on updated_at for sorting by recency
CREATE INDEX IF NOT EXISTS idx_candidate_graphs_updated_at ON candidate_graphs(updated_at DESC);

-- Create trigger to automatically update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_candidate_graphs_updated_at
  BEFORE UPDATE ON candidate_graphs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create candidate_graph_snapshots table
CREATE TABLE IF NOT EXISTS candidate_graph_snapshots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  graph JSONB NOT NULL DEFAULT '{}'::jsonb,
  context TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_candidate_graph_snapshots_user_id ON candidate_graph_snapshots(user_id);

-- Create index on created_at for sorting by recency
CREATE INDEX IF NOT EXISTS idx_candidate_graph_snapshots_created_at ON candidate_graph_snapshots(created_at DESC);

-- Create composite index for user + time queries
CREATE INDEX IF NOT EXISTS idx_candidate_graph_snapshots_user_created ON candidate_graph_snapshots(user_id, created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE candidate_graphs ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidate_graph_snapshots ENABLE ROW LEVEL SECURITY;

-- RLS Policies for candidate_graphs
-- Users can only read their own graph
CREATE POLICY "Users can read own candidate graph"
  ON candidate_graphs FOR SELECT
  USING (auth.uid() = user_id);

-- Users can only insert their own graph
CREATE POLICY "Users can insert own candidate graph"
  ON candidate_graphs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can only update their own graph
CREATE POLICY "Users can update own candidate graph"
  ON candidate_graphs FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can only delete their own graph
CREATE POLICY "Users can delete own candidate graph"
  ON candidate_graphs FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for candidate_graph_snapshots
-- Users can only read their own snapshots
CREATE POLICY "Users can read own snapshots"
  ON candidate_graph_snapshots FOR SELECT
  USING (auth.uid() = user_id);

-- Users can only insert their own snapshots
CREATE POLICY "Users can insert own snapshots"
  ON candidate_graph_snapshots FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can only delete their own snapshots
CREATE POLICY "Users can delete own snapshots"
  ON candidate_graph_snapshots FOR DELETE
  USING (auth.uid() = user_id);

-- Add comments for documentation
COMMENT ON TABLE candidate_graphs IS 'PROJECTION: Consolidated view of candidate intelligence computed from source tables (User, CareerProfile, CVAnalysis, InterviewSession)';
COMMENT ON TABLE candidate_graph_snapshots IS 'PROJECTION: Historical snapshots of candidate graphs for progression tracking';
COMMENT ON COLUMN candidate_graphs.graph IS 'JSONB representation of the complete candidate intelligence graph (computed projection)';
COMMENT ON COLUMN candidate_graph_snapshots.context IS 'Optional context describing the snapshot (e.g., "Interview simulation completed")';
