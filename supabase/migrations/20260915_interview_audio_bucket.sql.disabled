-- ============================================================
-- Trajectoire
-- Migration: interviews-audio private bucket
-- 2026-09-15
--
-- Creates a private Supabase Storage bucket for interview audio.
-- All uploads/reads/signing go through the service-role server client.
-- No client-side direct access is permitted.
--
-- ORPHAN RISK: Deleting an interview_session or user account does NOT
-- automatically delete the corresponding audio files in this bucket.
-- A future lifecycle/deletion job must handle:
--   DELETE FROM storage.objects WHERE bucket_id = 'interviews-audio'
--   AND name LIKE '{userId}/{sessionId}/%'
-- when a session or account is deleted.
-- ============================================================

-- Create the private bucket (idempotent)
INSERT INTO storage.buckets (id, name, public)
VALUES ('interviews-audio', 'interviews-audio', false)
ON CONFLICT (id) DO NOTHING;

-- No client-side RLS policies are needed.
-- All operations (upload, sign) are performed server-side
-- via the service-role client (createAdminClient), which bypasses RLS.
-- Adding client-side policies here would violate the principle of
-- least privilege and is intentionally omitted.
