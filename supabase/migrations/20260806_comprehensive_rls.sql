-- ==========================================
-- COMPREHENSIVE RLS POLICIES
-- Mission SH-008: Audit and implement RLS for all tables
-- ==========================================

-- Enable RLS on all tables
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CareerProfile" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "InterviewSession" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AIUsageLog" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Account" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AdminAuditLog" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "BehaviorEvent" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "BehavioralPattern" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CVAnalysis" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "PublicChallengeEntry" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "RecoveryEmailLog" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Session" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Subscription" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "UserAnalytics" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "UserBehaviorProfile" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "UserPredictionSnapshot" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "WaitlistEntry" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "PremiumInterviewSession" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SimulationSession" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CreditTransaction" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CreditUsage" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "StripeEvent" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Idempotency" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CvRewrite" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "PromptVersion" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "PublicChallenge" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "DataLineage" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Graph" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "GraphNode" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "GraphEdge" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "GraphVersion" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "GraphSnapshot" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "RefreshToken" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "BlacklistedToken" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "UsedToken" ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- USER TABLE POLICIES
-- ==========================================

-- Users can read their own profile
CREATE POLICY "Users can read own profile" ON "User"
  FOR SELECT TO authenticated
  USING (id = auth.uid()::text);

-- Users can update their own profile (non-critical fields)
CREATE POLICY "Users can update own profile" ON "User"
  FOR UPDATE TO authenticated
  USING (id = auth.uid()::text)
  WITH CHECK (id = auth.uid()::text);

-- Admins can read all users
CREATE POLICY "Admins can read all users" ON "User"
  FOR SELECT TO admin_role
  USING (true);

-- Admins can update all users
CREATE POLICY "Admins can update all users" ON "User"
  FOR UPDATE TO admin_role
  USING (true)
  WITH CHECK (true);

-- ==========================================
-- CAREER PROFILE POLICIES
-- ==========================================

-- Users can read their own career profile
CREATE POLICY "Users can read own career profile" ON "CareerProfile"
  FOR SELECT TO authenticated
  USING (userId = auth.uid()::text);

-- Users can update their own career profile
CREATE POLICY "Users can update own career profile" ON "CareerProfile"
  FOR UPDATE TO authenticated
  USING (userId = auth.uid()::text)
  WITH CHECK (userId = auth.uid()::text);

-- Admins can read all career profiles
CREATE POLICY "Admins can read all career profiles" ON "CareerProfile"
  FOR SELECT TO admin_role
  USING (true);

-- ==========================================
-- INTERVIEW SESSION POLICIES
-- ==========================================

-- Users can read their own interview sessions
CREATE POLICY "Users can read own interview sessions" ON "InterviewSession"
  FOR SELECT TO authenticated
  USING (userId = auth.uid()::text);

-- Users can insert their own interview sessions
CREATE POLICY "Users can insert own interview sessions" ON "InterviewSession"
  FOR INSERT TO authenticated
  WITH CHECK (userId = auth.uid()::text);

-- Users can update their own interview sessions
CREATE POLICY "Users can update own interview sessions" ON "InterviewSession"
  FOR UPDATE TO authenticated
  USING (userId = auth.uid()::text)
  WITH CHECK (userId = auth.uid()::text);

-- Admins can read all interview sessions
CREATE POLICY "Admins can read all interview sessions" ON "InterviewSession"
  FOR SELECT TO admin_role
  USING (true);

-- ==========================================
-- AI USAGE LOG POLICIES
-- ==========================================

-- Users can read their own AI usage logs
CREATE POLICY "Users can read own AI usage logs" ON "AIUsageLog"
  FOR SELECT TO authenticated
  USING (userId = auth.uid()::text);

-- Service role can insert AI usage logs
CREATE POLICY "Service can insert AI usage logs" ON "AIUsageLog"
  FOR INSERT TO service_role
  WITH CHECK (true);

-- Admins can read all AI usage logs
CREATE POLICY "Admins can read all AI usage logs" ON "AIUsageLog"
  FOR SELECT TO admin_role
  USING (true);

-- ==========================================
-- ACCOUNT POLICIES
-- ==========================================

-- Users can read their own accounts
CREATE POLICY "Users can read own accounts" ON "Account"
  FOR SELECT TO authenticated
  USING (userId = auth.uid()::text);

-- Service role can manage accounts
CREATE POLICY "Service can manage accounts" ON "Account"
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

-- ==========================================
-- ADMIN AUDIT LOG POLICIES
-- ==========================================

-- Admins can read all audit logs
CREATE POLICY "Admins can read all audit logs" ON "AdminAuditLog"
  FOR SELECT TO admin_role
  USING (true);

-- Service role can insert audit logs
CREATE POLICY "Service can insert audit logs" ON "AdminAuditLog"
  FOR INSERT TO service_role
  WITH CHECK (true);

-- ==========================================
-- BEHAVIOR EVENT POLICIES
-- ==========================================

-- Users can read their own behavior events
CREATE POLICY "Users can read own behavior events" ON "BehaviorEvent"
  FOR SELECT TO authenticated
  USING (userId = auth.uid()::text);

-- Service role can insert behavior events
CREATE POLICY "Service can insert behavior events" ON "BehaviorEvent"
  FOR INSERT TO service_role
  WITH CHECK (true);

-- Admins can read all behavior events
CREATE POLICY "Admins can read all behavior events" ON "BehaviorEvent"
  FOR SELECT TO admin_role
  USING (true);

-- ==========================================
-- BEHAVIORAL PATTERN POLICIES
-- ==========================================

-- Users can read their own behavioral patterns
CREATE POLICY "Users can read own behavioral patterns" ON "BehavioralPattern"
  FOR SELECT TO authenticated
  USING (userId = auth.uid()::text);

-- Service role can insert behavioral patterns
CREATE POLICY "Service can insert behavioral patterns" ON "BehavioralPattern"
  FOR INSERT TO service_role
  WITH CHECK (true);

-- Admins can read all behavioral patterns
CREATE POLICY "Admins can read all behavioral patterns" ON "BehavioralPattern"
  FOR SELECT TO admin_role
  USING (true);

-- ==========================================
-- CV ANALYSIS POLICIES
-- ==========================================

-- Users can read their own CV analyses
CREATE POLICY "Users can read own CV analyses" ON "CVAnalysis"
  FOR SELECT TO authenticated
  USING (userId = auth.uid()::text);

-- Users can insert their own CV analyses
CREATE POLICY "Users can insert own CV analyses" ON "CVAnalysis"
  FOR INSERT TO authenticated
  WITH CHECK (userId = auth.uid()::text);

-- Service role can insert CV analyses
CREATE POLICY "Service can insert CV analyses" ON "CVAnalysis"
  FOR INSERT TO service_role
  WITH CHECK (true);

-- Admins can read all CV analyses
CREATE POLICY "Admins can read all CV analyses" ON "CVAnalysis"
  FOR SELECT TO admin_role
  USING (true);

-- ==========================================
-- PUBLIC CHALLENGE ENTRY POLICIES
-- ==========================================

-- Users can read their own challenge entries
CREATE POLICY "Users can read own challenge entries" ON "PublicChallengeEntry"
  FOR SELECT TO authenticated
  USING (userId = auth.uid()::text);

-- Users can insert their own challenge entries
CREATE POLICY "Users can insert own challenge entries" ON "PublicChallengeEntry"
  FOR INSERT TO authenticated
  WITH CHECK (userId = auth.uid()::text);

-- Users can update their own challenge entries
CREATE POLICY "Users can update own challenge entries" ON "PublicChallengeEntry"
  FOR UPDATE TO authenticated
  USING (userId = auth.uid()::text)
  WITH CHECK (userId = auth.uid()::text);

-- Admins can read all challenge entries
CREATE POLICY "Admins can read all challenge entries" ON "PublicChallengeEntry"
  FOR SELECT TO admin_role
  USING (true);

-- ==========================================
-- RECOVERY EMAIL LOG POLICIES
-- ==========================================

-- Users can read their own recovery email logs
CREATE POLICY "Users can read own recovery email logs" ON "RecoveryEmailLog"
  FOR SELECT TO authenticated
  USING (userId = auth.uid()::text);

-- Service role can insert recovery email logs
CREATE POLICY "Service can insert recovery email logs" ON "RecoveryEmailLog"
  FOR INSERT TO service_role
  WITH CHECK (true);

-- Admins can read all recovery email logs
CREATE POLICY "Admins can read all recovery email logs" ON "RecoveryEmailLog"
  FOR SELECT TO admin_role
  USING (true);

-- ==========================================
-- SESSION POLICIES
-- ==========================================

-- Users can read their own sessions
CREATE POLICY "Users can read own sessions" ON "Session"
  FOR SELECT TO authenticated
  USING (userId = auth.uid()::text);

-- Service role can manage sessions
CREATE POLICY "Service can manage sessions" ON "Session"
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

-- ==========================================
-- SUBSCRIPTION POLICIES
-- ==========================================

-- Users can read their own subscription
CREATE POLICY "Users can read own subscription" ON "Subscription"
  FOR SELECT TO authenticated
  USING (userId = auth.uid()::text);

-- Service role can manage subscriptions
CREATE POLICY "Service can manage subscriptions" ON "Subscription"
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

-- Admins can read all subscriptions
CREATE POLICY "Admins can read all subscriptions" ON "Subscription"
  FOR SELECT TO admin_role
  USING (true);

-- ==========================================
-- USER ANALYTICS POLICIES
-- ==========================================

-- Users can read their own analytics
CREATE POLICY "Users can read own analytics" ON "UserAnalytics"
  FOR SELECT TO authenticated
  USING (userId = auth.uid()::text);

-- Service role can manage user analytics
CREATE POLICY "Service can manage user analytics" ON "UserAnalytics"
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

-- Admins can read all user analytics
CREATE POLICY "Admins can read all user analytics" ON "UserAnalytics"
  FOR SELECT TO admin_role
  USING (true);

-- ==========================================
-- USER BEHAVIOR PROFILE POLICIES
-- ==========================================

-- Users can read their own behavior profile
CREATE POLICY "Users can read own behavior profile" ON "UserBehaviorProfile"
  FOR SELECT TO authenticated
  USING (userId = auth.uid()::text);

-- Service role can manage user behavior profiles
CREATE POLICY "Service can manage user behavior profiles" ON "UserBehaviorProfile"
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

-- Admins can read all user behavior profiles
CREATE POLICY "Admins can read all user behavior profiles" ON "UserBehaviorProfile"
  FOR SELECT TO admin_role
  USING (true);

-- ==========================================
-- USER PREDICTION SNAPSHOT POLICIES
-- ==========================================

-- Users can read their own prediction snapshots
CREATE POLICY "Users can read own prediction snapshots" ON "UserPredictionSnapshot"
  FOR SELECT TO authenticated
  USING (userId = auth.uid()::text);

-- Service role can insert prediction snapshots
CREATE POLICY "Service can insert prediction snapshots" ON "UserPredictionSnapshot"
  FOR INSERT TO service_role
  WITH CHECK (true);

-- Admins can read all prediction snapshots
CREATE POLICY "Admins can read all prediction snapshots" ON "UserPredictionSnapshot"
  FOR SELECT TO admin_role
  USING (true);

-- ==========================================
-- WAITLIST ENTRY POLICIES
-- ==========================================

-- Users can read their own waitlist entry
CREATE POLICY "Users can read own waitlist entry" ON "WaitlistEntry"
  FOR SELECT TO authenticated
  USING (userId = auth.uid()::text);

-- Service role can manage waitlist entries
CREATE POLICY "Service can manage waitlist entries" ON "WaitlistEntry"
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

-- Admins can read all waitlist entries
CREATE POLICY "Admins can read all waitlist entries" ON "WaitlistEntry"
  FOR SELECT TO admin_role
  USING (true);

-- ==========================================
-- PREMIUM INTERVIEW SESSION POLICIES
-- ==========================================

-- Users can read their own premium interview sessions
CREATE POLICY "Users can read own premium interview sessions" ON "PremiumInterviewSession"
  FOR SELECT TO authenticated
  USING (userId = auth.uid()::text);

-- Users can insert their own premium interview sessions
CREATE POLICY "Users can insert own premium interview sessions" ON "PremiumInterviewSession"
  FOR INSERT TO authenticated
  WITH CHECK (userId = auth.uid()::text);

-- Users can update their own premium interview sessions
CREATE POLICY "Users can update own premium interview sessions" ON "PremiumInterviewSession"
  FOR UPDATE TO authenticated
  USING (userId = auth.uid()::text)
  WITH CHECK (userId = auth.uid()::text);

-- Admins can read all premium interview sessions
CREATE POLICY "Admins can read all premium interview sessions" ON "PremiumInterviewSession"
  FOR SELECT TO admin_role
  USING (true);

-- ==========================================
-- SIMULATION SESSION POLICIES
-- ==========================================

-- Users can read their own simulation sessions
CREATE POLICY "Users can read own simulation sessions" ON "SimulationSession"
  FOR SELECT TO authenticated
  USING (userId = auth.uid()::text);

-- Users can insert their own simulation sessions
CREATE POLICY "Users can insert own simulation sessions" ON "SimulationSession"
  FOR INSERT TO authenticated
  WITH CHECK (userId = auth.uid()::text);

-- Admins can read all simulation sessions
CREATE POLICY "Admins can read all simulation sessions" ON "SimulationSession"
  FOR SELECT TO admin_role
  USING (true);

-- ==========================================
-- CREDIT TRANSACTION POLICIES
-- ==========================================

-- Users can read their own credit transactions
CREATE POLICY "Users can read own credit transactions" ON "CreditTransaction"
  FOR SELECT TO authenticated
  USING (userId = auth.uid()::text);

-- Service role can manage credit transactions
CREATE POLICY "Service can manage credit transactions" ON "CreditTransaction"
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

-- Admins can read all credit transactions
CREATE POLICY "Admins can read all credit transactions" ON "CreditTransaction"
  FOR SELECT TO admin_role
  USING (true);

-- ==========================================
-- CREDIT USAGE POLICIES
-- ==========================================

-- Users can read their own credit usage
CREATE POLICY "Users can read own credit usage" ON "CreditUsage"
  FOR SELECT TO authenticated
  USING (userId = auth.uid()::text);

-- Service role can manage credit usage
CREATE POLICY "Service can manage credit usage" ON "CreditUsage"
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

-- Admins can read all credit usage
CREATE POLICY "Admins can read all credit usage" ON "CreditUsage"
  FOR SELECT TO admin_role
  USING (true);

-- ==========================================
-- STRIPE EVENT POLICIES
-- ==========================================

-- Service role can manage stripe events
CREATE POLICY "Service can manage stripe events" ON "StripeEvent"
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

-- Admins can read all stripe events
CREATE POLICY "Admins can read all stripe events" ON "StripeEvent"
  FOR SELECT TO admin_role
  USING (true);

-- ==========================================
-- IDEMPOTENCY POLICIES
-- ==========================================

-- Users can read their own idempotency records
CREATE POLICY "Idempotency can read own records" ON "Idempotency"
  FOR SELECT TO authenticated
  USING (userId = auth.uid()::text);

-- Service role can manage idempotency
CREATE POLICY "Service can manage idempotency" ON "Idempotency"
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

-- ==========================================
-- CV REWRITE POLICIES
-- ==========================================

-- Users can read their own CV rewrites
CREATE POLICY "Users can read own CV rewrites" ON "CvRewrite"
  FOR SELECT TO authenticated
  USING (userId = auth.uid()::text);

-- Service role can manage CV rewrites
CREATE POLICY "Service can manage CV rewrites" ON "CvRewrite"
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

-- ==========================================
-- PROMPT VERSION POLICIES
-- ==========================================

-- Service role can manage prompt versions
CREATE POLICY "Service can manage prompt versions" ON "PromptVersion"
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

-- Admins can read all prompt versions
CREATE POLICY "Admins can read all prompt versions" ON "PromptVersion"
  FOR SELECT TO admin_role
  USING (true);

-- ==========================================
-- PUBLIC CHALLENGE POLICIES
-- ==========================================

-- Anonymous users can read active public challenges
CREATE POLICY "Anonymous can read active challenges" ON "PublicChallenge"
  FOR SELECT TO anon
  USING (isActive = true);

-- Authenticated users can read all public challenges
CREATE POLICY "Users can read all challenges" ON "PublicChallenge"
  FOR SELECT TO authenticated
  USING (true);

-- Service role can manage public challenges
CREATE POLICY "Service can manage public challenges" ON "PublicChallenge"
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

-- Admins can manage public challenges
CREATE POLICY "Admins can manage public challenges" ON "PublicChallenge"
  FOR ALL TO admin_role
  USING (true)
  WITH CHECK (true);

-- ==========================================
-- DATA LINEAGE POLICIES
-- ==========================================

-- Service role can manage data lineage
CREATE POLICY "Service can manage data lineage" ON "DataLineage"
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

-- Admins can read all data lineage
CREATE POLICY "Admins can read all data lineage" ON "DataLineage"
  FOR SELECT TO admin_role
  USING (true);

-- ==========================================
-- GRAPH POLICIES
-- ==========================================

-- Users can read their own graphs
CREATE POLICY "Users can read own graphs" ON "Graph"
  FOR SELECT TO authenticated
  USING (source = 'MANUAL' OR deletedAt IS NULL);

-- Service role can manage graphs
CREATE POLICY "Service can manage graphs" ON "Graph"
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

-- Admins can read all graphs
CREATE POLICY "Admins can read all graphs" ON "Graph"
  FOR SELECT TO admin_role
  USING (true);

-- ==========================================
-- GRAPH NODE POLICIES
-- ==========================================

-- Service role can manage graph nodes
CREATE POLICY "Service can manage graph nodes" ON "GraphNode"
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

-- Admins can read all graph nodes
CREATE POLICY "Admins can read all graph nodes" ON "GraphNode"
  FOR SELECT TO admin_role
  USING (true);

-- ==========================================
-- GRAPH EDGE POLICIES
-- ==========================================

-- Service role can manage graph edges
CREATE POLICY "Service can manage graph edges" ON "GraphEdge"
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

-- Admins can read all graph edges
CREATE POLICY "Admins can read all graph edges" ON "GraphEdge"
  FOR SELECT TO admin_role
  USING (true);

-- ==========================================
-- GRAPH VERSION POLICIES
-- ==========================================

-- Service role can manage graph versions
CREATE POLICY "Service can manage graph versions" ON "GraphVersion"
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

-- Admins can read all graph versions
CREATE POLICY "Admins can read all graph versions" ON "GraphVersion"
  FOR SELECT TO admin_role
  USING (true);

-- ==========================================
-- GRAPH SNAPSHOT POLICIES
-- ==========================================

-- Service role can manage graph snapshots
CREATE POLICY "Service can manage graph snapshots" ON "GraphSnapshot"
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

-- Admins can read all graph snapshots
CREATE POLICY "Admins can read all graph snapshots" ON "GraphSnapshot"
  FOR SELECT TO admin_role
  USING (true);

-- ==========================================
-- REFRESH TOKEN POLICIES
-- ==========================================

-- Users can read their own refresh tokens
CREATE POLICY "Users can read own refresh tokens" ON "RefreshToken"
  FOR SELECT TO authenticated
  USING (userId = auth.uid()::text);

-- Service role can manage refresh tokens
CREATE POLICY "Service can manage refresh tokens" ON "RefreshToken"
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

-- ==========================================
-- BLACKLISTED TOKEN POLICIES
-- ==========================================

-- Service role can manage blacklisted tokens
CREATE POLICY "Service can manage blacklisted tokens" ON "BlacklistedToken"
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

-- ==========================================
-- USED TOKEN POLICIES
-- ==========================================

-- Service role can manage used tokens
CREATE POLICY "Service can manage used tokens" ON "UsedToken"
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

-- ==========================================
-- PREVIEW ANALYSIS POLICIES (if exists)
-- ==========================================

-- Users can read their own preview analyses
CREATE POLICY "Users can read own preview analyses" ON "PreviewAnalysis"
  FOR SELECT TO authenticated
  USING (claimedByUserId = auth.uid()::text);

-- Service role can manage preview analyses
CREATE POLICY "Service can manage preview analyses" ON "PreviewAnalysis"
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

-- Admins can read all preview analyses
CREATE POLICY "Admins can read all preview analyses" ON "PreviewAnalysis"
  FOR SELECT TO admin_role
  USING (true);

-- ==========================================
-- PROCESSED WEBHOOK POLICIES (if exists)
-- ==========================================

-- Service role can manage processed webhooks
CREATE POLICY "Service can manage processed webhooks" ON "ProcessedWebhook"
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

-- ==========================================
-- INTERVIEW EVENT POLICIES (if exists)
-- ==========================================

-- Service role can manage interview events
CREATE POLICY "Service can manage interview events" ON "InterviewEvent"
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

-- ==========================================
-- SECURITY RULES
-- ==========================================

-- Ensure no table is accessible without a policy
-- All tables must have at least one SELECT policy
-- All tables must have appropriate INSERT/UPDATE/DELETE policies
-- No policy should use "TO PUBLIC" or "TO ALL" without proper filtering
-- All user data must be isolated by auth.uid()
