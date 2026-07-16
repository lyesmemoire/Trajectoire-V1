-- Migration: Complete Row Level Security Policies
-- Date: 2026-07-03
-- Purpose: Add comprehensive RLS policies for all tables

-- Enable RLS on all tables
ALTER TABLE "public"."User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."CareerProfile" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."InterviewSession" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."CVAnalysis" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."Subscription" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."Session" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."Account" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."StorageFile" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."BehaviorEvent" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."InterviewEvent" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."UserBehaviorProfile" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."UserPredictionSnapshot" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."WaitlistEntry" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."PublicChallenge" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."PublicChallengeEntry" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."RecoveryEmailLog" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."AdminAuditLog" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."BehavioralPattern" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."AIUsageLog" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."OutboxEvent" ENABLE ROW LEVEL SECURITY;

-- ============================================
-- User Table Policies
-- ============================================

-- Users can read their own data
CREATE POLICY "Users can read own data" ON "public"."User"
  FOR SELECT USING (auth.uid()::TEXT = id);

-- Users can update their own data
CREATE POLICY "Users can update own data" ON "public"."User"
  FOR UPDATE USING (auth.uid()::TEXT = id);

-- Users can delete their own data
CREATE POLICY "Users can delete own data" ON "public"."User"
  FOR DELETE USING (auth.uid()::TEXT = id);

-- Admins can read all users
CREATE POLICY "Admins can read all users" ON "public"."User"
  FOR SELECT USING ("public".is_admin());

-- Admins can update all users
CREATE POLICY "Admins can update all users" ON "public"."User"
  FOR UPDATE USING ("public".is_admin());

-- Service role can insert (for registration)
CREATE POLICY "Service role can insert users" ON "public"."User"
  FOR INSERT WITH CHECK (auth.role() = 'service_role');

-- ============================================
-- CareerProfile Table Policies
-- ============================================

-- Users can read their own career profile
CREATE POLICY "Users can read own career profile" ON "public"."CareerProfile"
  FOR SELECT USING (auth.uid()::TEXT = "userId");

-- Users can update their own career profile
CREATE POLICY "Users can update own career profile" ON "public"."CareerProfile"
  FOR UPDATE USING (auth.uid()::TEXT = "userId");

-- Users can insert their own career profile
CREATE POLICY "Users can insert own career profile" ON "public"."CareerProfile"
  FOR INSERT WITH CHECK (auth.uid()::TEXT = "userId");

-- Admins can read all career profiles
CREATE POLICY "Admins can read all career profiles" ON "public"."CareerProfile"
  FOR SELECT USING ("public".is_admin());

-- ============================================
-- InterviewSession Table Policies
-- ============================================

-- Users can read their own interview sessions
CREATE POLICY "Users can read own interview sessions" ON "public"."InterviewSession"
  FOR SELECT USING (auth.uid()::TEXT = "userId" OR "userId" IS NULL);

-- Users can update their own interview sessions
CREATE POLICY "Users can update own interview sessions" ON "public"."InterviewSession"
  FOR UPDATE USING (auth.uid()::TEXT = "userId");

-- Users can insert their own interview sessions
CREATE POLICY "Users can insert own interview sessions" ON "public"."InterviewSession"
  FOR INSERT WITH CHECK (auth.uid()::TEXT = "userId" OR "userId" IS NULL);

-- Users can delete their own interview sessions
CREATE POLICY "Users can delete own interview sessions" ON "public"."InterviewSession"
  FOR DELETE USING (auth.uid()::TEXT = "userId");

-- Admins can read all interview sessions
CREATE POLICY "Admins can read all interview sessions" ON "public"."InterviewSession"
  FOR SELECT USING ("public".is_admin());

-- ============================================
-- CVAnalysis Table Policies
-- ============================================

-- Users can read their own CV analyses
CREATE POLICY "Users can read own CV analyses" ON "public"."CVAnalysis"
  FOR SELECT USING (auth.uid()::TEXT = "userId");

-- Users can insert their own CV analyses
CREATE POLICY "Users can insert own CV analyses" ON "public"."CVAnalysis"
  FOR INSERT WITH CHECK (auth.uid()::TEXT = "userId");

-- Users can update their own CV analyses
CREATE POLICY "Users can update own CV analyses" ON "public"."CVAnalysis"
  FOR UPDATE USING (auth.uid()::TEXT = "userId");

-- Users can delete their own CV analyses
CREATE POLICY "Users can delete own CV analyses" ON "public"."CVAnalysis"
  FOR DELETE USING (auth.uid()::TEXT = "userId");

-- Admins can read all CV analyses
CREATE POLICY "Admins can read all CV analyses" ON "public"."CVAnalysis"
  FOR SELECT USING ("public".is_admin());

-- ============================================
-- Subscription Table Policies
-- ============================================

-- Users can read their own subscription
CREATE POLICY "Users can read own subscription" ON "public"."Subscription"
  FOR SELECT USING (auth.uid()::TEXT = "userId");

-- Service role can insert/update subscriptions (Stripe webhooks)
CREATE POLICY "Service role can manage subscriptions" ON "public"."Subscription"
  FOR ALL USING (auth.role() = 'service_role');

-- Admins can read all subscriptions
CREATE POLICY "Admins can read all subscriptions" ON "public"."Subscription"
  FOR SELECT USING ("public".is_admin());

-- ============================================
-- Session Table Policies
-- ============================================

-- Users can read their own sessions
CREATE POLICY "Users can read own sessions" ON "public"."Session"
  FOR SELECT USING (auth.uid()::TEXT = "userId");

-- Users can insert their own sessions
CREATE POLICY "Users can insert own sessions" ON "public"."Session"
  FOR INSERT WITH CHECK (auth.uid()::TEXT = "userId");

-- Users can delete their own sessions
CREATE POLICY "Users can delete own sessions" ON "public"."Session"
  FOR DELETE USING (auth.uid()::TEXT = "userId");

-- Service role can manage sessions
CREATE POLICY "Service role can manage sessions" ON "public"."Session"
  FOR ALL USING (auth.role() = 'service_role');

-- ============================================
-- Account Table Policies
-- ============================================

-- Users can read their own accounts
CREATE POLICY "Users can read own accounts" ON "public"."Account"
  FOR SELECT USING (auth.uid()::TEXT = "userId");

-- Users can insert their own accounts
CREATE POLICY "Users can insert own accounts" ON "public"."Account"
  FOR INSERT WITH CHECK (auth.uid()::TEXT = "userId");

-- Service role can manage accounts
CREATE POLICY "Service role can manage accounts" ON "public"."Account"
  FOR ALL USING (auth.role() = 'service_role');

-- ============================================
-- StorageFile Table Policies
-- ============================================

-- Users can read their own storage files
CREATE POLICY "Users can read own storage files" ON "public"."StorageFile"
  FOR SELECT USING (auth.uid()::TEXT = "userId" OR "userId" IS NULL);

-- Users can insert their own storage files
CREATE POLICY "Users can insert own storage files" ON "public"."StorageFile"
  FOR INSERT WITH CHECK (auth.uid()::TEXT = "userId" OR "userId" IS NULL);

-- Users can delete their own storage files
CREATE POLICY "Users can delete own storage files" ON "public"."StorageFile"
  FOR DELETE USING (auth.uid()::TEXT = "userId");

-- Admins can read all storage files
CREATE POLICY "Admins can read all storage files" ON "public"."StorageFile"
  FOR SELECT USING ("public".is_admin());

-- ============================================
-- BehaviorEvent Table Policies
-- ============================================

-- Users can read their own behavior events
CREATE POLICY "Users can read own behavior events" ON "public"."BehaviorEvent"
  FOR SELECT USING (auth.uid()::TEXT = "userId");

-- Users can insert their own behavior events
CREATE POLICY "Users can insert own behavior events" ON "public"."BehaviorEvent"
  FOR INSERT WITH CHECK (auth.uid()::TEXT = "userId");

-- Admins can read all behavior events
CREATE POLICY "Admins can read all behavior events" ON "public"."BehaviorEvent"
  FOR SELECT USING ("public".is_admin());

-- ============================================
-- InterviewEvent Table Policies
-- ============================================

-- Users can read events from their own sessions
CREATE POLICY "Users can read own interview events" ON "public"."InterviewEvent"
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM "InterviewSession" 
      WHERE "InterviewSession".id = "InterviewEvent"."sessionId" 
      AND "InterviewSession"."userId" = auth.uid()::TEXT
    )
  );

-- Users can insert events for their own sessions
CREATE POLICY "Users can insert own interview events" ON "public"."InterviewEvent"
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM "InterviewSession" 
      WHERE "InterviewSession".id = "InterviewEvent"."sessionId" 
      AND "InterviewSession"."userId" = auth.uid()::TEXT
    )
  );

-- Admins can read all interview events
CREATE POLICY "Admins can read all interview events" ON "public"."InterviewEvent"
  FOR SELECT USING ("public".is_admin());

-- ============================================
-- UserBehaviorProfile Table Policies
-- ============================================

-- Users can read their own behavior profile
CREATE POLICY "Users can read own behavior profile" ON "public"."UserBehaviorProfile"
  FOR SELECT USING (auth.uid()::TEXT = "userId");

-- Service role can manage behavior profiles
CREATE POLICY "Service role can manage behavior profiles" ON "public"."UserBehaviorProfile"
  FOR ALL USING (auth.role() = 'service_role');

-- Admins can read all behavior profiles
CREATE POLICY "Admins can read all behavior profiles" ON "public"."UserBehaviorProfile"
  FOR SELECT USING ("public".is_admin());

-- ============================================
-- UserPredictionSnapshot Table Policies
-- ============================================

-- Users can read their own prediction snapshots
CREATE POLICY "Users can read own prediction snapshots" ON "public"."UserPredictionSnapshot"
  FOR SELECT USING (auth.uid()::TEXT = "userId");

-- Service role can manage prediction snapshots
CREATE POLICY "Service role can manage prediction snapshots" ON "public"."UserPredictionSnapshot"
  FOR ALL USING (auth.role() = 'service_role');

-- Admins can read all prediction snapshots
CREATE POLICY "Admins can read all prediction snapshots" ON "public"."UserPredictionSnapshot"
  FOR SELECT USING ("public".is_admin());

-- ============================================
-- WaitlistEntry Table Policies
-- ============================================

-- Users can read their own waitlist entry
CREATE POLICY "Users can read own waitlist entry" ON "public"."WaitlistEntry"
  FOR SELECT USING (auth.uid()::TEXT = "userId" OR "userId" IS NULL);

-- Anyone can insert waitlist entries
CREATE POLICY "Anyone can insert waitlist entry" ON "public"."WaitlistEntry"
  FOR INSERT WITH CHECK (true);

-- Admins can read all waitlist entries
CREATE POLICY "Admins can read all waitlist entries" ON "public"."WaitlistEntry"
  FOR SELECT USING ("public".is_admin());

-- ============================================
-- PublicChallenge Table Policies
-- ============================================

-- Authenticated users can read public challenges
CREATE POLICY "Authenticated users can read challenges" ON "public"."PublicChallenge"
  FOR SELECT USING (auth.role() = 'authenticated');

-- Service role can manage challenges
CREATE POLICY "Service role can manage challenges" ON "public"."PublicChallenge"
  FOR ALL USING (auth.role() = 'service_role');

-- ============================================
-- PublicChallengeEntry Table Policies
-- ============================================

-- Users can read their own challenge entries
CREATE POLICY "Users can read own challenge entries" ON "public"."PublicChallengeEntry"
  FOR SELECT USING (auth.uid()::TEXT = "userId");

-- Users can insert their own challenge entries
CREATE POLICY "Users can insert own challenge entries" ON "public"."PublicChallengeEntry"
  FOR INSERT WITH CHECK (auth.uid()::TEXT = "userId");

-- Users can update their own challenge entries
CREATE POLICY "Users can update own challenge entries" ON "public"."PublicChallengeEntry"
  FOR UPDATE USING (auth.uid()::TEXT = "userId");

-- Admins can read all challenge entries
CREATE POLICY "Admins can read all challenge entries" ON "public"."PublicChallengeEntry"
  FOR SELECT USING ("public".is_admin());

-- ============================================
-- RecoveryEmailLog Table Policies
-- ============================================

-- Users can read their own recovery email logs
CREATE POLICY "Users can read own recovery logs" ON "public"."RecoveryEmailLog"
  FOR SELECT USING (auth.uid()::TEXT = "userId");

-- Service role can manage recovery logs
CREATE POLICY "Service role can manage recovery logs" ON "public"."RecoveryEmailLog"
  FOR ALL USING (auth.role() = 'service_role');

-- Admins can read all recovery logs
CREATE POLICY "Admins can read all recovery logs" ON "public"."RecoveryEmailLog"
  FOR SELECT USING ("public".is_admin());

-- ============================================
-- AdminAuditLog Table Policies
-- ============================================

-- Admins can read all audit logs
CREATE POLICY "Admins can read audit logs" ON "public"."AdminAuditLog"
  FOR SELECT USING ("public".is_admin());

-- Service role can insert audit logs
CREATE POLICY "Service role can insert audit logs" ON "public"."AdminAuditLog"
  FOR INSERT WITH CHECK (auth.role() = 'service_role');

-- ============================================
-- BehavioralPattern Table Policies
-- ============================================

-- Users can read their own behavioral patterns
CREATE POLICY "Users can read own behavioral patterns" ON "public"."BehavioralPattern"
  FOR SELECT USING (auth.uid()::TEXT = "userId");

-- Service role can manage behavioral patterns
CREATE POLICY "Service role can manage behavioral patterns" ON "public"."BehavioralPattern"
  FOR ALL USING (auth.role() = 'service_role');

-- Admins can read all behavioral patterns
CREATE POLICY "Admins can read all behavioral patterns" ON "public"."BehavioralPattern"
  FOR SELECT USING ("public".is_admin());

-- ============================================
-- AIUsageLog Table Policies
-- ============================================

-- Users can read their own AI usage logs
CREATE POLICY "Users can read own AI usage logs" ON "public"."AIUsageLog"
  FOR SELECT USING (auth.uid()::TEXT = "userId" OR "userId" IS NULL);

-- Service role can manage AI usage logs
CREATE POLICY "Service role can manage AI usage logs" ON "public"."AIUsageLog"
  FOR ALL USING (auth.role() = 'service_role');

-- Admins can read all AI usage logs
CREATE POLICY "Admins can read all AI usage logs" ON "public"."AIUsageLog"
  FOR SELECT USING ("public".is_admin());

-- ============================================
-- OutboxEvent Table Policies
-- ============================================

-- Service role can manage outbox events
CREATE POLICY "Service role can manage outbox events" ON "public"."OutboxEvent"
  FOR ALL USING (auth.role() = 'service_role');

-- Admins can read all outbox events
CREATE POLICY "Admins can read outbox events" ON "public"."OutboxEvent"
  FOR SELECT USING ("public".is_admin());
