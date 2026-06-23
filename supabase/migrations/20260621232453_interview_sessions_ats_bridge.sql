ALTER TABLE interview_sessions
  ADD COLUMN IF NOT EXISTS ats_report_id uuid
    REFERENCES premium_ats_reports(id) ON DELETE SET NULL;

COMMENT ON COLUMN interview_sessions.ats_report_id IS
  'Référence vers l''analyse ATS premium ayant généré les munitions d''attaque';

CREATE INDEX IF NOT EXISTS idx_interview_sessions_ats_report
  ON interview_sessions(ats_report_id)
  WHERE ats_report_id IS NOT NULL;
