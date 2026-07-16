-- =========================================
-- Migration: 007_ai_cost_optimization.sql
-- Description: AI Cache and Usage Stats
-- =========================================

-- =========================================
-- AI CACHE
-- =========================================

CREATE TABLE IF NOT EXISTS ai_cache (
  hash TEXT PRIMARY KEY,
  endpoint TEXT NOT NULL,
  model TEXT NOT NULL,
  response JSONB NOT NULL,
  token_cost INT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS ai_cache_endpoint_idx ON ai_cache(endpoint);
ALTER TABLE ai_cache ENABLE ROW LEVEL SECURITY;

-- =========================================
-- AI USAGE STATS
-- =========================================

CREATE TABLE IF NOT EXISTS ai_usage_stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL,
  model TEXT NOT NULL,
  tokens INT,
  estimated_cost NUMERIC,
  cached BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS ai_usage_user_idx ON ai_usage_stats(user_id);
ALTER TABLE ai_usage_stats ENABLE ROW LEVEL SECURITY;
