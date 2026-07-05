-- =========================================
-- Migration: 009_cost_alerts.sql
-- Description: Monitoring AI costs and alerts
-- =========================================

CREATE TABLE IF NOT EXISTS cost_alerts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  threshold NUMERIC NOT NULL,
  window_minutes INT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Pre-populate some recommended alert rules
INSERT INTO cost_alerts (threshold, window_minutes) VALUES 
  (0.5, 10), -- e.g. Alert if more than $0.50 spent in 10 minutes (configurable via Dashboard later)
  (2.0, 60), -- Alert if more than $2.00 spent in an hour
  (10.0, 1440) -- Alert if more than $10.00 spent in a day
ON CONFLICT DO NOTHING;

ALTER TABLE cost_alerts ENABLE ROW LEVEL SECURITY;

-- Only admins can manage cost_alerts (if we implement RLS roles, otherwise default secure)
-- For now, service_role is used to query these rules.
