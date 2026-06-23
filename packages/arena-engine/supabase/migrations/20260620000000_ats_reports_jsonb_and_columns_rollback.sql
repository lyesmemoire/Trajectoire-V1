-- Rollback: 20260620000000_ats_reports_jsonb_and_columns.sql
-- ⚠️  À exécuter UNIQUEMENT si la migration forward échoue.
--     La conversion JSONB → TEXT[] avec données existantes est destructive.

BEGIN;

-- 1. Drop indexes
DROP INDEX IF EXISTS public.idx_ats_reports_matched_keywords_gin;
DROP INDEX IF EXISTS public.idx_ats_reports_missing_keywords_gin;
DROP INDEX IF EXISTS public.idx_ats_reports_created_at;

-- 2. Drop new columns
ALTER TABLE public.ats_reports DROP COLUMN IF EXISTS strengths;
ALTER TABLE public.ats_reports DROP COLUMN IF EXISTS weaknesses;
ALTER TABLE public.ats_reports DROP COLUMN IF EXISTS updated_at;

-- 3. Revert JSONB → TEXT[] (seulement si colonne est toujours JSONB)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'ats_reports'
      AND column_name = 'matched_keywords'
      AND data_type = 'jsonb'
  ) THEN
    ALTER TABLE public.ats_reports
      ALTER COLUMN matched_keywords TYPE TEXT[]
      USING (
        CASE
          WHEN matched_keywords IS NULL THEN NULL
          WHEN matched_keywords = 'null'::jsonb THEN NULL
          ELSE ARRAY(SELECT jsonb_array_elements_text(matched_keywords))
        END
      );
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'ats_reports'
      AND column_name = 'missing_keywords'
      AND data_type = 'jsonb'
  ) THEN
    ALTER TABLE public.ats_reports
      ALTER COLUMN missing_keywords TYPE TEXT[]
      USING (
        CASE
          WHEN missing_keywords IS NULL THEN NULL
          WHEN missing_keywords = 'null'::jsonb THEN NULL
          ELSE ARRAY(SELECT jsonb_array_elements_text(missing_keywords))
        END
      );
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'ats_reports'
      AND column_name = 'suggestions'
      AND data_type = 'jsonb'
  ) THEN
    ALTER TABLE public.ats_reports
      ALTER COLUMN suggestions TYPE TEXT[]
      USING (
        CASE
          WHEN suggestions IS NULL THEN NULL
          WHEN suggestions = 'null'::jsonb THEN NULL
          ELSE ARRAY(SELECT jsonb_array_elements_text(suggestions))
        END
      );
  END IF;
END $$;

-- 4. Restore score NOT NULL
ALTER TABLE public.ats_reports ALTER COLUMN score SET NOT NULL;
ALTER TABLE public.ats_reports ALTER COLUMN score DROP DEFAULT;

COMMIT;
