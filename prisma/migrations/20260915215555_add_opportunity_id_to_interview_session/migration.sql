-- Migration: add_opportunity_id_to_interview_session
-- Adds a nullable opportunityId FK on InterviewSession pointing to Opportunity.
-- Uses SET NULL on delete so that removing an opportunity does not break existing sessions.

ALTER TABLE "public"."InterviewSession"
  ADD COLUMN IF NOT EXISTS "opportunityId" TEXT;

ALTER TABLE "public"."InterviewSession"
  ADD CONSTRAINT "InterviewSession_opportunityId_fkey"
  FOREIGN KEY ("opportunityId")
  REFERENCES "public"."opportunities"("id")
  ON DELETE SET NULL
  ON UPDATE CASCADE;

CREATE INDEX IF NOT EXISTS "InterviewSession_opportunityId_idx"
  ON "public"."InterviewSession"("opportunityId");
