-- Migration to sync PremiumInterviewSession schema with Supabase table
-- This replaces camelCase columns with snake_case and adds missing columns

-- First, ensure the table exists
CREATE TABLE IF NOT EXISTS "public"."premium_interview_sessions" (
  "id" TEXT PRIMARY KEY,
  "status" TEXT DEFAULT 'active',
  "score" INTEGER DEFAULT 0,
  "questions" JSONB,
  "answers" JSONB,
  "feedback" JSONB
);

-- Add new columns if they don't exist
ALTER TABLE "public"."premium_interview_sessions" 
  ADD COLUMN IF NOT EXISTS "user_id" TEXT,
  ADD COLUMN IF NOT EXISTS "analysis_id" TEXT,
  ADD COLUMN IF NOT EXISTS "company" TEXT,
  ADD COLUMN IF NOT EXISTS "job_title" TEXT,
  ADD COLUMN IF NOT EXISTS "job_description" TEXT,
  ADD COLUMN IF NOT EXISTS "persona" TEXT,
  ADD COLUMN IF NOT EXISTS "difficulty" TEXT,
  ADD COLUMN IF NOT EXISTS "interview_type" TEXT,
  ADD COLUMN IF NOT EXISTS "interview_mode" TEXT,
  ADD COLUMN IF NOT EXISTS "recruiter_doubt" TEXT,
  ADD COLUMN IF NOT EXISTS "focus_area" TEXT,
  ADD COLUMN IF NOT EXISTS "target_role" TEXT,
  ADD COLUMN IF NOT EXISTS "cv_analysis" JSONB,
  ADD COLUMN IF NOT EXISTS "truth_analysis" JSONB,
  ADD COLUMN IF NOT EXISTS "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN IF NOT EXISTS "completed_at" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- In case there were previously camelCase columns created by Prisma without @map, we drop them
ALTER TABLE "public"."premium_interview_sessions" DROP COLUMN IF EXISTS "userId";
ALTER TABLE "public"."premium_interview_sessions" DROP COLUMN IF EXISTS "analysisId";
ALTER TABLE "public"."premium_interview_sessions" DROP COLUMN IF EXISTS "interviewType";
ALTER TABLE "public"."premium_interview_sessions" DROP COLUMN IF EXISTS "jobTitle";
ALTER TABLE "public"."premium_interview_sessions" DROP COLUMN IF EXISTS "jobDescription";
ALTER TABLE "public"."premium_interview_sessions" DROP COLUMN IF EXISTS "interviewMode";
ALTER TABLE "public"."premium_interview_sessions" DROP COLUMN IF EXISTS "recruiterDoubt";
ALTER TABLE "public"."premium_interview_sessions" DROP COLUMN IF EXISTS "focusArea";
ALTER TABLE "public"."premium_interview_sessions" DROP COLUMN IF EXISTS "targetRole";
ALTER TABLE "public"."premium_interview_sessions" DROP COLUMN IF EXISTS "cvAnalysis";
ALTER TABLE "public"."premium_interview_sessions" DROP COLUMN IF EXISTS "truthAnalysis";
ALTER TABLE "public"."premium_interview_sessions" DROP COLUMN IF EXISTS "startedAt";
ALTER TABLE "public"."premium_interview_sessions" DROP COLUMN IF EXISTS "completedAt";
ALTER TABLE "public"."premium_interview_sessions" DROP COLUMN IF EXISTS "createdAt";
