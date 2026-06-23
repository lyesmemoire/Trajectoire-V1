-- Rollback: 20260620000000_ats_reports_jsonb_and_columns.sql
-- Date: 2026-06-20
-- Purpose: Revert JSONB migration and new columns for ats_reports

BEGIN;

-- 1. Drop updated_at column
ALTER TABLE public.ats_reports DROP COLUMN IF EXISTS updated_at;

-- 2. Drop strengths and weaknesses columns
ALTER TABLE public.ats_reports DROP COLUMN IF EXISTS strengths;
ALTER TABLE public.ats_reports DROP COLUMN IF EXISTS weaknesses;

-- 3. Revert JSONB columns back to TEXT[]
--    matched_keywords
ALTER TABLE public.ats_reports
  ALTER COLUMN matched_keywords TYPE TEXT[]
  USING ARRAY(SELECT jsonb_array_elements_text(matched_keywords));

--    missing_keywords
ALTER TABLE public.ats_reports
  ALTER COLUMN missing_keywords TYPE TEXT[]
  USING ARRAY(SELECT jsonb_array_elements_text(missing_keywords));

--    suggestions
ALTER TABLE public.ats_reports
  ALTER COLUMN suggestions TYPE TEXT[]
  USING ARRAY(SELECT jsonb_array_elements_text(suggestions));

-- 4. Restore NOT NULL defaults
ALTER TABLE public.ats_reports ALTER COLUMN score SET NOT NULL;
ALTER TABLE public.ats_reports ALTER COLUMN score DROP DEFAULT;

COMMIT;
