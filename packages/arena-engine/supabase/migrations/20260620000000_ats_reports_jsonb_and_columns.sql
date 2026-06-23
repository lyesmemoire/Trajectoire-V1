-- Migration: 20260620000000_ats_reports_jsonb_and_columns.sql
-- Date: 2026-06-20
-- Purpose:
--   1. Add missing columns: strengths (JSONB), weaknesses (JSONB), updated_at
--   2. Safely migrate existing TEXT[] columns to JSONB
--   3. Make score optional with default 0
--
-- Rollback: see 20260620000000_ats_reports_jsonb_and_columns_rollback.sql

BEGIN;

-- ── 1. Add missing columns ──────────────────────────────────────────

ALTER TABLE public.ats_reports
  ADD COLUMN IF NOT EXISTS strengths JSONB DEFAULT '[]'::jsonb;

ALTER TABLE public.ats_reports
  ADD COLUMN IF NOT EXISTS weaknesses JSONB DEFAULT '[]'::jsonb;

ALTER TABLE public.ats_reports
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- ── 2. Make score optional (was NOT NULL, but code sends 0 as default) ─

ALTER TABLE public.ats_reports
  ALTER COLUMN score DROP NOT NULL;

ALTER TABLE public.ats_reports
  ALTER COLUMN score SET DEFAULT 0;

-- ── 3. Safe TEXT[] → JSONB migration ────────────────────────────────
--    ⚠️  to_jsonb() préserve les tableaux PostgreSQL nativement.
--        ::jsonb sur un TEXT[] créerait un JSONB array de strings, mais
--        to_jsonb() est la méthode canonique et sûre.

-- matched_keywords: TEXT[] → JSONB
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'ats_reports'
      AND column_name = 'matched_keywords'
      AND data_type = 'ARRAY'
  ) THEN
    ALTER TABLE public.ats_reports
      ALTER COLUMN matched_keywords TYPE JSONB
      USING to_jsonb(matched_keywords);

    ALTER TABLE public.ats_reports
      ALTER COLUMN matched_keywords SET DEFAULT '[]'::jsonb;

    RAISE NOTICE 'ats_reports.matched_keywords: TEXT[] → JSONB converted';
  ELSE
    RAISE NOTICE 'ats_reports.matched_keywords: already JSONB or not present — skipped';
  END IF;
END $$;

-- missing_keywords: TEXT[] → JSONB
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

    ALTER TABLE public.ats_reports
      ALTER COLUMN missing_keywords SET DEFAULT '[]'::jsonb;

    RAISE NOTICE 'ats_reports.missing_keywords: TEXT[] → JSONB converted';
  ELSE
    RAISE NOTICE 'ats_reports.missing_keywords: already JSONB or not present — skipped';
  END IF;
END $$;

-- suggestions: TEXT[] → JSONB
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

    ALTER TABLE public.ats_reports
      ALTER COLUMN suggestions SET DEFAULT '[]'::jsonb;

    RAISE NOTICE 'ats_reports.suggestions: TEXT[] → JSONB converted';
  ELSE
    RAISE NOTICE 'ats_reports.suggestions: already JSONB or not present — skipped';
  END IF;
END $$;

-- ── 4. GIN index pour requêtes JSONB performantes ──────────────────

CREATE INDEX IF NOT EXISTS idx_ats_reports_matched_keywords_gin
  ON public.ats_reports USING GIN (matched_keywords jsonb_path_ops);

CREATE INDEX IF NOT EXISTS idx_ats_reports_missing_keywords_gin
  ON public.ats_reports USING GIN (missing_keywords jsonb_path_ops);

-- ── 5. Index sur updated_at pour le tri ────────────────────────────

CREATE INDEX IF NOT EXISTS idx_ats_reports_created_at
  ON public.ats_reports (created_at DESC);

COMMIT;
