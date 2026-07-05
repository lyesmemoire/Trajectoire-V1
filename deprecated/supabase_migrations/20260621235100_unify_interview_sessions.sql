-- Chantier 1 : Unification DB
-- interview_sessions absorbe les colonnes du Realtime Gateway V3
-- completed_at existe déjà (migration 20260621210000) → pas d'ended_at
-- final_score existe déjà → voice_score est distinct (score vocal temps réel)

ALTER TABLE interview_sessions
  ADD COLUMN IF NOT EXISTS target_role       text,
  ADD COLUMN IF NOT EXISTS job_offer_summary text,
  ADD COLUMN IF NOT EXISTS transcript        jsonb,
  ADD COLUMN IF NOT EXISTS metrics           jsonb,
  ADD COLUMN IF NOT EXISTS voice_report      jsonb,
  ADD COLUMN IF NOT EXISTS voice_score       integer
    CHECK (voice_score BETWEEN 0 AND 100);

COMMENT ON COLUMN interview_sessions.target_role IS
  'Rôle cible de l''entretien (Gateway V3)';
COMMENT ON COLUMN interview_sessions.transcript IS
  'Tableau d''échanges {role, text, timestamp} du Gateway V3';
COMMENT ON COLUMN interview_sessions.metrics IS
  'Scores par phase de l''entretien (Gateway V3)';
COMMENT ON COLUMN interview_sessions.voice_report IS
  'Rapport vocal complet JSON du Gateway V3 (distinct de final_report Arena)';
COMMENT ON COLUMN interview_sessions.voice_score IS
  'Score global vocal extrait pour tri dashboard (0-100)';

CREATE INDEX IF NOT EXISTS idx_interview_sessions_voice_score
  ON interview_sessions(user_id, voice_score DESC)
  WHERE voice_score IS NOT NULL;
