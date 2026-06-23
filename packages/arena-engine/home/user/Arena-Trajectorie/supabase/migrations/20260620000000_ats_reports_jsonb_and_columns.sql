-- Migration: 20260620000000_ats_reports_jsonb_and_columns.sql
-- Date: 2026-06-20
-- Purpose:
--   1. Add missing columns: strengths (JSONB), weaknesses (JSONB)
--   2. Migrate existing TEXT[] columns to JSONB for matched_keywords, missing_keywords, suggestions
--   3. Add updated_at column for audit
--
-- Rollback: see supabase/migrations/20260620000000_ats_reports_jsonb_and_columns_rollback.sql

BEGIN;

-- 1. Add missing columns: strengths and weaknesses (JSONB)
ALTER TABLE public.ats_reports
  ADD COLUMN IF NOT EXISTS strengths JSONB DEFAULT '[]'::jsonb;

ALTER TABLE public.ats_reports
  ADD COLUMN IF NOT EXISTS weaknesses JSONB DEFAULT '[]'::jsonb;

-- 2. Migrate existing TEXT[] columns to JSONB if they are still TEXT[]
--    matched_keywords
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'ats_reports'
      AND column_name = 'matched_keywords'
      AND data_type = 'ARRAY'
  ) THEN
    -- Convert existing TEXT[] data to JSONB
    ALTER TABLE public.ats_reports
      ALTER COLUMN matched_keywords TYPE JSONB
      USING to_jsonb(matched_keywords);
  END IF;
END $$;

--    missing_keywords
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'ats_reports'
      AND column_name = 'missing_keywords'
      AND data_type = 'ARRAY'
  ) THEN
    ALTER TABLE public.ats_reports
      ALTER COLUMN missing_keywords TYPE JSONB
      USING to_jsonb(missing_keywords);
  END IF;
END $$;

--    suggestions
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'ats_reports'
      AND column_name = 'suggestions'
      AND data_type = 'ARRAY'
  ) THEN
    ALTER TABLE public.ats_reports
      ALTER COLUMN suggestions TYPE JSONB
      USING to_jsonb(suggestions);
  END IF;
END $$;

-- 3. Add updated_at column for audit trail
ALTER TABLE public.ats_reports
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW());

-- 4. Set default for strengths/weaknesses if they didn't exist before
ALTER TABLE public.ats_reports
  ALTER COLUMN strengths SET DEFAULT '[]'::jsonb;

ALTER TABLE public.ats_reports
  ALTER COLUMN weaknesses SET DEFAULT '[]'::jsonb;

-- 5. Make score nullable (it may be 0 initially)
ALTER TABLE public.ats_reports
  ALTER COLUMN score SET DEFAULT 0;

COMMIT;
