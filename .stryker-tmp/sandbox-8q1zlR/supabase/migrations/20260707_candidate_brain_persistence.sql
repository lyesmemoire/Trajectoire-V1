-- Migration: CandidateAIBrain Persistence
-- Date: 2026-07-07
-- Purpose: Persist CandidateAIBrain data to Supabase

-- Brain Observations table: Stores all AI observations
CREATE TABLE IF NOT EXISTS brain_observations (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  source TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('interview', 'ats', 'communication', 'leadership', 'career', 'general')),
  data JSONB NOT NULL,
  confidence NUMERIC NOT NULL CHECK (confidence >= 0 AND confidence <= 1),
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Brain Patterns table: Stores detected patterns
CREATE TABLE IF NOT EXISTS brain_patterns (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  pattern TEXT NOT NULL,
  frequency INTEGER NOT NULL DEFAULT 1,
  first_seen TIMESTAMP WITH TIME ZONE NOT NULL,
  last_seen TIMESTAMP WITH TIME ZONE NOT NULL,
  observations TEXT[] NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('strength', 'weakness', 'behavior', 'skill', 'risk')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Brain Insights table: Stores AI-generated insights
CREATE TABLE IF NOT EXISTS brain_insights (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('strength', 'weakness', 'contradiction', 'progress', 'regression', 'recurring')),
  description TEXT NOT NULL,
  evidence TEXT[] NOT NULL,
  confidence NUMERIC NOT NULL CHECK (confidence >= 0 AND confidence <= 1),
  actionable BOOLEAN NOT NULL DEFAULT false,
  coaching TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Brain Goals table: Stores candidate goals
CREATE TABLE IF NOT EXISTS brain_goals (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  description TEXT NOT NULL,
  target TEXT NOT NULL,
  current NUMERIC NOT NULL DEFAULT 0,
  target_value NUMERIC NOT NULL,
  unit TEXT NOT NULL,
  deadline TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'achieved', 'abandoned')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Brain History table: Stores AI execution history
CREATE TABLE IF NOT EXISTS brain_history (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  prompt_id TEXT NOT NULL,
  prompt_version TEXT NOT NULL,
  input JSONB NOT NULL,
  output JSONB NOT NULL,
  metrics JSONB NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('success', 'error', 'retry')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Brain Timeline table: Stores timeline events
CREATE TABLE IF NOT EXISTS brain_timeline (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('observation', 'goal', 'milestone', 'insight', 'contradiction', 'progress', 'regression')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  impact TEXT CHECK (impact IN ('low', 'medium', 'high')),
  related_ids TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_brain_observations_user_id ON brain_observations(user_id);
CREATE INDEX IF NOT EXISTS idx_brain_observations_timestamp ON brain_observations(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_brain_observations_source ON brain_observations(source);
CREATE INDEX IF NOT EXISTS idx_brain_patterns_user_id ON brain_patterns(user_id);
CREATE INDEX IF NOT EXISTS idx_brain_patterns_category ON brain_patterns(category);
CREATE INDEX IF NOT EXISTS idx_brain_insights_user_id ON brain_insights(user_id);
CREATE INDEX IF NOT EXISTS idx_brain_insights_type ON brain_insights(type);
CREATE INDEX IF NOT EXISTS idx_brain_goals_user_id ON brain_goals(user_id);
CREATE INDEX IF NOT EXISTS idx_brain_goals_status ON brain_goals(status);
CREATE INDEX IF NOT EXISTS idx_brain_history_user_id ON brain_history(user_id);
CREATE INDEX IF NOT EXISTS idx_brain_history_timestamp ON brain_history(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_brain_history_prompt_id ON brain_history(prompt_id);
CREATE INDEX IF NOT EXISTS idx_brain_timeline_user_id ON brain_timeline(user_id);
CREATE INDEX IF NOT EXISTS idx_brain_timeline_timestamp ON brain_timeline(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_brain_timeline_type ON brain_timeline(type);

-- Enable RLS on all tables
ALTER TABLE brain_observations ENABLE ROW LEVEL SECURITY;
ALTER TABLE brain_patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE brain_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE brain_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE brain_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE brain_timeline ENABLE ROW LEVEL SECURITY;

-- RLS Policies for brain_observations
CREATE POLICY "Users can view their own brain observations" ON brain_observations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own brain observations" ON brain_observations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own brain observations" ON brain_observations FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own brain observations" ON brain_observations FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for brain_patterns
CREATE POLICY "Users can view their own brain patterns" ON brain_patterns FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own brain patterns" ON brain_patterns FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own brain patterns" ON brain_patterns FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own brain patterns" ON brain_patterns FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for brain_insights
CREATE POLICY "Users can view their own brain insights" ON brain_insights FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own brain insights" ON brain_insights FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own brain insights" ON brain_insights FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own brain insights" ON brain_insights FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for brain_goals
CREATE POLICY "Users can view their own brain goals" ON brain_goals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own brain goals" ON brain_goals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own brain goals" ON brain_goals FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own brain goals" ON brain_goals FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for brain_history
CREATE POLICY "Users can view their own brain history" ON brain_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own brain history" ON brain_history FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own brain history" ON brain_history FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own brain history" ON brain_history FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for brain_timeline
CREATE POLICY "Users can view their own brain timeline" ON brain_timeline FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own brain timeline" ON brain_timeline FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own brain timeline" ON brain_timeline FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own brain timeline" ON brain_timeline FOR DELETE USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_brain_patterns_updated_at BEFORE UPDATE ON brain_patterns
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_brain_goals_updated_at BEFORE UPDATE ON brain_goals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
