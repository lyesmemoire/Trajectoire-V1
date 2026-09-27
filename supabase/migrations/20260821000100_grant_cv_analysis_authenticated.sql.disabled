-- ============================================================
-- CVAnalysis authenticated privileges
--
-- RLS remains authoritative.
-- This GRANT only allows PostgREST/authenticated to reach the
-- table. Existing RLS policies continue to restrict rows.
-- ============================================================

GRANT SELECT ON TABLE public."CVAnalysis" TO authenticated;

-- Preserve explicit service access for trusted server-side
-- Supabase clients where applicable.
GRANT SELECT, INSERT, UPDATE, DELETE
ON TABLE public."CVAnalysis"
TO service_role;