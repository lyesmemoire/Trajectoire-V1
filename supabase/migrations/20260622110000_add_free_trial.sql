-- Migration: Add free trial tracking for CV/ATS analysis
ALTER TABLE user_usage ADD COLUMN IF NOT EXISTS has_used_free_trial BOOLEAN DEFAULT FALSE;
