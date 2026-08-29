CREATE TYPE "public"."OpportunityStatus" AS ENUM (
  'DISCOVERED',
  'TO_ANALYZE',
  'TO_APPLY',
  'APPLIED',
  'INTERVIEW',
  'OFFER',
  'REJECTED',
  'ARCHIVED'
);

CREATE TABLE "public"."opportunities" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "company" TEXT,
  "location" TEXT,
  "sourceUrl" TEXT,
  "source" TEXT,
  "description" TEXT NOT NULL,
  "status" "public"."OpportunityStatus" NOT NULL DEFAULT 'DISCOVERED',
  "matchScore" INTEGER,
  "skillsScore" INTEGER,
  "experienceScore" INTEGER,
  "seniorityScore" INTEGER,
  "relevanceScore" INTEGER,
  "recommendation" TEXT,
  "recommendationLabel" TEXT,
  "strengths" JSONB,
  "gaps" JSONB,
  "analysis" JSONB,
  "metadata" JSONB,
  "discoveredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "analyzedAt" TIMESTAMP(3),
  "appliedAt" TIMESTAMP(3),
  "interviewAt" TIMESTAMP(3),
  "offerAt" TIMESTAMP(3),
  "rejectedAt" TIMESTAMP(3),
  "archivedAt" TIMESTAMP(3),
  "nextAction" TEXT,
  "nextActionAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "opportunities_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "opportunities_userId_idx"
ON "public"."opportunities"("userId");

CREATE INDEX "opportunities_userId_status_idx"
ON "public"."opportunities"("userId", "status");

CREATE INDEX "opportunities_userId_matchScore_idx"
ON "public"."opportunities"("userId", "matchScore");

CREATE INDEX "opportunities_userId_updatedAt_idx"
ON "public"."opportunities"("userId", "updatedAt" DESC);

CREATE INDEX "opportunities_status_idx"
ON "public"."opportunities"("status");

CREATE INDEX "opportunities_createdAt_idx"
ON "public"."opportunities"("createdAt");

ALTER TABLE "public"."opportunities"
ADD CONSTRAINT "opportunities_userId_fkey"
FOREIGN KEY ("userId")
REFERENCES "public"."users"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;