-- Migration: Add missing indexes for performance
-- Date: 2026-07-03
-- Purpose: Add indexes on foreign keys that were missing from initial schema

-- Index on CVAnalysis.userId (foreign key)
CREATE INDEX IF NOT EXISTS "CVAnalysis_userId_idx" ON "public"."CVAnalysis"("userId");

-- Index on InterviewEvent.sessionId (foreign key)
CREATE INDEX IF NOT EXISTS "InterviewEvent_sessionId_idx" ON "public"."InterviewEvent"("sessionId");

-- Index on Subscription.stripeCustomerId (foreign key)
CREATE INDEX IF NOT EXISTS "Subscription_stripeCustomerId_idx" ON "public"."Subscription"("stripeCustomerId");

-- Index on Subscription.stripeSubId (foreign key)
CREATE INDEX IF NOT EXISTS "Subscription_stripeSubId_idx" ON "public"."Subscription"("stripeSubId");

-- Index on InterviewEvent.sessionId (already exists in init, but ensuring it's there)
CREATE INDEX IF NOT EXISTS "InterviewEvent_sessionId_idx" ON "public"."InterviewEvent"("sessionId");
