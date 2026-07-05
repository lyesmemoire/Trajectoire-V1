CREATE TABLE premium_ats_reports (
  id             uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  cv_file_name   text,
  job_offer_raw  text        NOT NULL,
  overall_score  integer     CHECK (overall_score BETWEEN 0 AND 100),
  ats_result     jsonb       NOT NULL,
  munition_pack  jsonb,
  created_at     timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE premium_ats_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_own_premium_ats_reports"
  ON premium_ats_reports
  FOR ALL
  USING  (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE INDEX idx_premium_ats_user_date
  ON premium_ats_reports(user_id, created_at DESC);

CREATE INDEX idx_premium_ats_id
  ON premium_ats_reports(id);
