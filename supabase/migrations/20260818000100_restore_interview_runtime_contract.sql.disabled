-- ============================================================
-- Trajectoire
-- Restore interview runtime persistence contract
-- 2026-08-18
--
-- Goals:
-- 1. Align public.interview_sessions with the runtime application.
-- 2. Align public.reports with report generation/UI.
-- 3. Restore public.interview_messages.
--
-- IMPORTANT:
-- Existing tables are preserved.
-- This migration is intentionally additive wherever possible.
-- ============================================================

BEGIN;

-- ============================================================
-- TRAJECTOIRE
-- Migration: restore_interview_runtime_contract
--
-- Deadlock protection:
-- - timeout court sur acquisition des verrous
-- - ordre déterministe des verrous
-- - transaction atomique
-- ============================================================

SET LOCAL lock_timeout = '10s';
SET LOCAL statement_timeout = '120s';

-- Acquérir les verrous AVANT les modifications.
-- Toujours dans le même ordre.
LOCK TABLE public.interview_sessions IN ACCESS EXCLUSIVE MODE;
LOCK TABLE public.reports IN ACCESS EXCLUSIVE MODE;


-- ============================================================
-- 1. INTERVIEW SESSIONS
-- ============================================================

ALTER TABLE public.interview_sessions
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'in_progress';

ALTER TABLE public.interview_sessions
  ADD COLUMN IF NOT EXISTS questions jsonb NOT NULL DEFAULT '[]'::jsonb;

ALTER TABLE public.interview_sessions
  ADD COLUMN IF NOT EXISTS answers jsonb NOT NULL DEFAULT '[]'::jsonb;

ALTER TABLE public.interview_sessions
  ADD COLUMN IF NOT EXISTS level text;

ALTER TABLE public.interview_sessions
  ADD COLUMN IF NOT EXISTS interview_type text;

ALTER TABLE public.interview_sessions
  ADD COLUMN IF NOT EXISTS started_at timestamptz NOT NULL DEFAULT now();

ALTER TABLE public.interview_sessions
  ADD COLUMN IF NOT EXISTS completed_at timestamptz;

ALTER TABLE public.interview_sessions
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

ALTER TABLE public.interview_sessions
  ADD COLUMN IF NOT EXISTS version integer NOT NULL DEFAULT 1;

ALTER TABLE public.interview_sessions
  ADD COLUMN IF NOT EXISTS career_trajectory_score double precision;

ALTER TABLE public.interview_sessions
  ADD COLUMN IF NOT EXISTS feedback_json jsonb;


-- ============================================================
-- Standardize duration naming
-- duration_sec -> duration_seconds
-- ============================================================

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'interview_sessions'
      AND column_name = 'duration_sec'
  )
  AND NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'interview_sessions'
      AND column_name = 'duration_seconds'
  )
  THEN
    ALTER TABLE public.interview_sessions
      RENAME COLUMN duration_sec TO duration_seconds;
  END IF;
END
$$;


-- ============================================================
-- INTERVIEW SESSION CONSTRAINTS
-- ============================================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'interview_sessions_status_check'
      AND conrelid = 'public.interview_sessions'::regclass
  )
  THEN
    ALTER TABLE public.interview_sessions
      ADD CONSTRAINT interview_sessions_status_check
      CHECK (
        status IN (
          'created',
          'in_progress',
          'running',
          'completed',
          'cancelled',
          'abandoned'
        )
      );
  END IF;
END
$$;


DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'interview_sessions_type_check'
      AND conrelid = 'public.interview_sessions'::regclass
  )
  THEN
    ALTER TABLE public.interview_sessions
      ADD CONSTRAINT interview_sessions_type_check
      CHECK (
        interview_type IS NULL
        OR interview_type IN ('RH', 'Technique', 'Manager')
      );
  END IF;
END
$$;


-- ============================================================
-- INTERVIEW SESSION INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_interview_sessions_user_id
  ON public.interview_sessions(user_id);

CREATE INDEX IF NOT EXISTS idx_interview_sessions_status
  ON public.interview_sessions(status);

CREATE INDEX IF NOT EXISTS idx_interview_sessions_created_at
  ON public.interview_sessions(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_interview_sessions_user_created
  ON public.interview_sessions(user_id, created_at DESC);


-- ============================================================
-- 2. REPORTS
-- ============================================================

-- Existing DB:
-- interview_session_id
--
-- Application contract:
-- session_id

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'reports'
      AND column_name = 'interview_session_id'
  )
  AND NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'reports'
      AND column_name = 'session_id'
  )
  THEN
    ALTER TABLE public.reports
      RENAME COLUMN interview_session_id TO session_id;
  END IF;
END
$$;


ALTER TABLE public.reports
  ADD COLUMN IF NOT EXISTS communication integer;

ALTER TABLE public.reports
  ADD COLUMN IF NOT EXISTS technical integer;

ALTER TABLE public.reports
  ADD COLUMN IF NOT EXISTS confidence integer;

ALTER TABLE public.reports
  ADD COLUMN IF NOT EXISTS summary text;

ALTER TABLE public.reports
  ADD COLUMN IF NOT EXISTS recommendation text;

ALTER TABLE public.reports
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

ALTER TABLE public.reports
  ADD COLUMN IF NOT EXISTS version integer NOT NULL DEFAULT 1;


-- ============================================================
-- REPORT CONSTRAINTS
-- ============================================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'reports_overall_score_check'
      AND conrelid = 'public.reports'::regclass
  )
  THEN
    ALTER TABLE public.reports
      ADD CONSTRAINT reports_overall_score_check
      CHECK (
        overall_score IS NULL
        OR overall_score BETWEEN 0 AND 100
      );
  END IF;
END
$$;


DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'reports_communication_check'
      AND conrelid = 'public.reports'::regclass
  )
  THEN
    ALTER TABLE public.reports
      ADD CONSTRAINT reports_communication_check
      CHECK (
        communication IS NULL
        OR communication BETWEEN 0 AND 100
      );
  END IF;
END
$$;


DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'reports_technical_check'
      AND conrelid = 'public.reports'::regclass
  )
  THEN
    ALTER TABLE public.reports
      ADD CONSTRAINT reports_technical_check
      CHECK (
        technical IS NULL
        OR technical BETWEEN 0 AND 100
      );
  END IF;
END
$$;


DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'reports_confidence_check'
      AND conrelid = 'public.reports'::regclass
  )
  THEN
    ALTER TABLE public.reports
      ADD CONSTRAINT reports_confidence_check
      CHECK (
        confidence IS NULL
        OR confidence BETWEEN 0 AND 100
      );
  END IF;
END
$$;


-- ============================================================
-- REPORT INDEXES
-- ============================================================

CREATE UNIQUE INDEX IF NOT EXISTS reports_one_per_session
  ON public.reports(session_id);

CREATE INDEX IF NOT EXISTS idx_reports_session_id
  ON public.reports(session_id);


-- ============================================================
-- 3. INTERVIEW MESSAGES
-- ============================================================

CREATE TABLE IF NOT EXISTS public.interview_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  session_id uuid NOT NULL
    REFERENCES public.interview_sessions(id)
    ON DELETE CASCADE,

  role text NOT NULL,

  content text NOT NULL,

  created_at timestamptz NOT NULL DEFAULT now(),

  version integer NOT NULL DEFAULT 1,

  CONSTRAINT interview_messages_role_check
    CHECK (role IN ('user', 'assistant'))
);


CREATE INDEX IF NOT EXISTS idx_interview_messages_session_id
  ON public.interview_messages(session_id);

CREATE INDEX IF NOT EXISTS idx_interview_messages_session_created
  ON public.interview_messages(session_id, created_at);


-- ============================================================
-- 4. UPDATED_AT AUTOMATION
-- ============================================================

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;


DROP TRIGGER IF EXISTS set_interview_sessions_updated_at
  ON public.interview_sessions;

CREATE TRIGGER set_interview_sessions_updated_at
BEFORE UPDATE ON public.interview_sessions
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();


DROP TRIGGER IF EXISTS set_reports_updated_at
  ON public.reports;

CREATE TRIGGER set_reports_updated_at
BEFORE UPDATE ON public.reports
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();


-- ============================================================
-- 5. RLS
-- ============================================================

ALTER TABLE public.interview_messages
  ENABLE ROW LEVEL SECURITY;


DROP POLICY IF EXISTS "Users can view their interview messages"
  ON public.interview_messages;

CREATE POLICY "Users can view their interview messages"
ON public.interview_messages
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM public.interview_sessions s
    WHERE s.id = interview_messages.session_id
      AND s.user_id = auth.uid()
  )
);


DROP POLICY IF EXISTS "Users can insert their interview messages"
  ON public.interview_messages;

CREATE POLICY "Users can insert their interview messages"
ON public.interview_messages
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.interview_sessions s
    WHERE s.id = interview_messages.session_id
      AND s.user_id = auth.uid()
  )
);


DROP POLICY IF EXISTS "Users can update their interview messages"
  ON public.interview_messages;

CREATE POLICY "Users can update their interview messages"
ON public.interview_messages
FOR UPDATE
USING (
  EXISTS (
    SELECT 1
    FROM public.interview_sessions s
    WHERE s.id = interview_messages.session_id
      AND s.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.interview_sessions s
    WHERE s.id = interview_messages.session_id
      AND s.user_id = auth.uid()
  )
);


DROP POLICY IF EXISTS "Users can delete their interview messages"
  ON public.interview_messages;

CREATE POLICY "Users can delete their interview messages"
ON public.interview_messages
FOR DELETE
USING (
  EXISTS (
    SELECT 1
    FROM public.interview_sessions s
    WHERE s.id = interview_messages.session_id
      AND s.user_id = auth.uid()
  )
);


COMMIT;