-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('USER', 'ADMIN_SUPPORT', 'ADMIN_PRODUCT', 'ADMIN_FOUNDER');

-- CreateEnum
CREATE TYPE "public"."Plan" AS ENUM ('FREE', 'PRO', 'EXPERT');

-- CreateEnum
CREATE TYPE "public"."tx_state" AS ENUM ('reserved', 'committed', 'failed', 'expired');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "image" TEXT,
    "emailVerified" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "role" "public"."UserRole" NOT NULL DEFAULT 'USER',
    "plan" "public"."Plan" NOT NULL DEFAULT 'FREE',
    "stripeCustomerId" TEXT,
    "referralCode" TEXT NOT NULL,
    "referredBy" TEXT,
    "referralCount" INTEGER NOT NULL DEFAULT 0,
    "monthlyAnalysisCount" INTEGER NOT NULL DEFAULT 0,
    "monthlyResetDate" TIMESTAMP(3) NOT NULL DEFAULT (now() + '1 mon'::interval),
    "credits" INTEGER NOT NULL DEFAULT 100,
    "onboardingCompleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CareerProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "employabilityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "clarityTrend" DOUBLE PRECISION,
    "confidenceTrend" DOUBLE PRECISION,
    "ownershipTrend" DOUBLE PRECISION,
    "stressResistance" DOUBLE PRECISION,
    "leadershipScore" DOUBLE PRECISION,
    "communicationScore" DOUBLE PRECISION,
    "careerDNA" JSONB,
    "unlockedPersonas" TEXT[],
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CareerProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."InterviewSession" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "userId" TEXT NOT NULL,
    "persona" TEXT NOT NULL,
    "currentState" TEXT NOT NULL,
    "clarityScore" DOUBLE PRECISION,
    "confidenceScore" DOUBLE PRECISION,
    "ownershipScore" DOUBLE PRECISION,
    "specificityScore" DOUBLE PRECISION,
    "pressureLevel" INTEGER NOT NULL DEFAULT 0,
    "authenticityScore" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "jobTitle" TEXT,
    "company" TEXT,
    "score" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'active',
    "questions" JSONB,
    "answers" JSONB,
    "analysis" JSONB,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "career_trajectory_score" DOUBLE PRECISION,
    "challengeEntryId" TEXT,

    CONSTRAINT "InterviewSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AIUsageLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "sessionId" TEXT,
    "provider" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "feature" TEXT NOT NULL,
    "tokensInput" INTEGER NOT NULL,
    "tokensOutput" INTEGER NOT NULL,
    "latencyMs" INTEGER NOT NULL,
    "costUsd" DOUBLE PRECISION NOT NULL,
    "cacheHit" BOOLEAN NOT NULL DEFAULT false,
    "confidenceScore" DOUBLE PRECISION,
    "failureType" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AIUsageLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AdminAuditLog" (
    "id" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "targetId" TEXT,
    "metadata" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminAuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."BehaviorEvent" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "subtype" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "payload" JSONB NOT NULL,
    "latencyMs" INTEGER,
    "intensityScore" DOUBLE PRECISION,
    "entropyScore" DOUBLE PRECISION,
    "previousEventId" TEXT,
    "nextEventId" TEXT,

    CONSTRAINT "BehaviorEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."BehavioralPattern" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "pattern" TEXT NOT NULL,
    "frequency" INTEGER NOT NULL DEFAULT 1,
    "severity" DOUBLE PRECISION NOT NULL,
    "firstSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BehavioralPattern_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CVAnalysis" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "originalText" TEXT NOT NULL,
    "optimizedText" TEXT NOT NULL,
    "cvData" JSONB NOT NULL,
    "atsScoreBefore" INTEGER,
    "atsScoreAfter" INTEGER,
    "improvements" JSONB,
    "keywords" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CVAnalysis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."InterviewEvent" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "impactScore" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InterviewEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ProcessedWebhook" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProcessedWebhook_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PreviewAnalysis" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "ipHash" TEXT NOT NULL,
    "fingerprint" TEXT NOT NULL,
    "consumed" BOOLEAN NOT NULL DEFAULT false,
    "analysis_result" JSONB,
    "ats_score" INTEGER,
    "claimed_at" TIMESTAMP(3),
    "claimed_by_user_id" TEXT,
    "consumed_at" TIMESTAMP(3),
    "cv_extract" JSONB,
    "job_extract" JSONB,
    "raw_payload" JSONB,
    "recommendations" JSONB,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "strengths" JSONB,
    "weaknesses" JSONB,

    CONSTRAINT "PreviewAnalysis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PromptVersion" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PromptVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PublicChallenge" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "config" JSONB NOT NULL,
    "rewardCredits" INTEGER NOT NULL DEFAULT 0,
    "rewardBadgeId" TEXT,

    CONSTRAINT "PublicChallenge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PublicChallengeEntry" (
    "id" TEXT NOT NULL,
    "challengeId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bestScore" INTEGER NOT NULL DEFAULT 0,
    "maxPressure" INTEGER NOT NULL DEFAULT 0,
    "interruptions" INTEGER NOT NULL DEFAULT 0,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PublicChallengeEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."RecoveryEmailLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "riskLevel" TEXT NOT NULL,
    "cause" TEXT NOT NULL,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RecoveryEmailLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Subscription" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "stripeCustomerId" TEXT NOT NULL,
    "stripeSubId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "currentPeriodEnd" TIMESTAMP(3) NOT NULL,
    "plan" "public"."Plan" NOT NULL DEFAULT 'FREE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UserAnalytics" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "activationScore" INTEGER NOT NULL DEFAULT 0,
    "churnRisk" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "viralityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "engagementScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "lastActiveAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserAnalytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UserBehaviorProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "pressureType" TEXT,
    "weaknessPattern" TEXT,
    "targetArchetype" TEXT,
    "returnProbability" DOUBLE PRECISION,
    "returnSegment" TEXT,
    "lastPredictionDate" TIMESTAMP(3),
    "onboardingCompleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserBehaviorProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UserPredictionSnapshot" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "returnProbability" DOUBLE PRECISION NOT NULL,
    "returnSegment" TEXT NOT NULL,
    "primaryDriver" TEXT NOT NULL,
    "stressScore" DOUBLE PRECISION,
    "recoveryScore" DOUBLE PRECISION,
    "engagementScore" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserPredictionSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."WaitlistEntry" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "userId" TEXT,
    "source" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "converted" BOOLEAN NOT NULL DEFAULT false,
    "pressureType" TEXT,
    "weakness" TEXT,
    "intentReason" TEXT,
    "isWillingToRetry" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "WaitlistEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."premium_interview_sessions" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "analysisId" TEXT,
    "interviewType" TEXT NOT NULL DEFAULT 'standard',
    "status" TEXT NOT NULL DEFAULT 'active',
    "score" INTEGER NOT NULL DEFAULT 0,
    "questions" JSONB,
    "answers" JSONB,
    "feedback" JSONB,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "careerTrajectoryScore" DOUBLE PRECISION,

    CONSTRAINT "premium_interview_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SimulationSession" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "overall" INTEGER NOT NULL,
    "percentile" INTEGER NOT NULL,
    "scores" JSONB NOT NULL,
    "level" TEXT NOT NULL,

    CONSTRAINT "SimulationSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."credit_transactions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "idempotency_key" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "action" TEXT NOT NULL,
    "state" "public"."tx_state" NOT NULL DEFAULT 'reserved',
    "tokens_used" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "credit_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."credit_usage" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "action" TEXT NOT NULL,
    "credits_spent" INTEGER NOT NULL,
    "tokens_used" INTEGER NOT NULL DEFAULT 0,
    "estimated_cost_eur" DECIMAL(10,6) NOT NULL DEFAULT 0,
    "metadata" JSONB DEFAULT '{}',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" UUID NOT NULL,

    CONSTRAINT "credit_usage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."stripe_events" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "event_id" TEXT NOT NULL,
    "credits_added" INTEGER,
    "processed_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" UUID,

    CONSTRAINT "stripe_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."idempotency" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "idempotency_key" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "operation" TEXT NOT NULL,
    "request_params" JSONB NOT NULL,
    "result_ref" TEXT,
    "status" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMPTZ(6),
    "expires_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "idempotency_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."cv_rewrites" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" TEXT NOT NULL,
    "idempotency_key" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "original_content" TEXT NOT NULL,
    "rewritten_content" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "cv_rewrites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."graphs" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "version" INTEGER NOT NULL DEFAULT 1,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "source" TEXT NOT NULL DEFAULT 'MANUAL',
    "metadata" JSONB DEFAULT '{}',
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "graphs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."graph_nodes" (
    "id" TEXT NOT NULL,
    "graph_id" TEXT NOT NULL,
    "node_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "normalized_label" TEXT NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0.5,
    "source" TEXT NOT NULL,
    "metadata" JSONB DEFAULT '{}',
    "embedding" vector,
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "graph_nodes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."graph_edges" (
    "id" TEXT NOT NULL,
    "graph_id" TEXT NOT NULL,
    "edge_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "source_node_id" TEXT NOT NULL,
    "target_node_id" TEXT NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL DEFAULT 0.5,
    "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0.5,
    "reason" TEXT,
    "metadata" JSONB DEFAULT '{}',
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "graph_edges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."graph_versions" (
    "id" TEXT NOT NULL,
    "graph_id" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "description" TEXT,
    "changeLog" JSONB DEFAULT '{}',
    "node_count" INTEGER NOT NULL DEFAULT 0,
    "edge_count" INTEGER NOT NULL DEFAULT 0,
    "created_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "graph_versions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."graph_snapshots" (
    "id" TEXT NOT NULL,
    "graph_id" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "node_data" JSONB NOT NULL,
    "edge_data" JSONB NOT NULL,
    "metadata" JSONB DEFAULT '{}',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "graph_snapshots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."data_lineage" (
    "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "source_type" TEXT NOT NULL,
    "source_origin" TEXT NOT NULL,
    "source_provenance" TEXT NOT NULL,
    "source_pipeline" TEXT NOT NULL,
    "source_stage" TEXT NOT NULL,
    "source_timestamp" TIMESTAMPTZ(6) NOT NULL,
    "transformation_type" TEXT NOT NULL,
    "transformation_parameters" JSONB DEFAULT '{}',
    "transformation_description" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "graph_node_id" UUID,
    "relation_type" TEXT,
    "relation_target_uuid" UUID,
    "relation_name" TEXT,
    "parent_uuid" UUID,
    "storage_type" TEXT NOT NULL,
    "storage_location" TEXT NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0.5,
    "timestamp" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB DEFAULT '{}',

    CONSTRAINT "data_lineage_pkey" PRIMARY KEY ("uuid")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_stripeCustomerId_key" ON "public"."User"("stripeCustomerId");

-- CreateIndex
CREATE UNIQUE INDEX "User_referralCode_key" ON "public"."User"("referralCode");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "public"."User"("email");

-- CreateIndex
CREATE INDEX "User_stripeCustomerId_idx" ON "public"."User"("stripeCustomerId");

-- CreateIndex
CREATE INDEX "User_monthlyResetDate_idx" ON "public"."User"("monthlyResetDate");

-- CreateIndex
CREATE UNIQUE INDEX "CareerProfile_userId_key" ON "public"."CareerProfile"("userId");

-- CreateIndex
CREATE INDEX "InterviewSession_userId_idx" ON "public"."InterviewSession"("userId");

-- CreateIndex
CREATE INDEX "InterviewSession_createdAt_idx" ON "public"."InterviewSession"("createdAt");

-- CreateIndex
CREATE INDEX "InterviewSession_userId_createdAt_idx" ON "public"."InterviewSession"("userId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "AIUsageLog_createdAt_idx" ON "public"."AIUsageLog"("createdAt");

-- CreateIndex
CREATE INDEX "AIUsageLog_userId_idx" ON "public"."AIUsageLog"("userId");

-- CreateIndex
CREATE INDEX "Account_userId_idx" ON "public"."Account"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "public"."Account"("provider", "providerAccountId");

-- CreateIndex
CREATE INDEX "AdminAuditLog_action_idx" ON "public"."AdminAuditLog"("action");

-- CreateIndex
CREATE INDEX "AdminAuditLog_adminId_idx" ON "public"."AdminAuditLog"("adminId");

-- CreateIndex
CREATE INDEX "BehaviorEvent_sessionId_idx" ON "public"."BehaviorEvent"("sessionId");

-- CreateIndex
CREATE INDEX "BehaviorEvent_userId_type_idx" ON "public"."BehaviorEvent"("userId", "type");

-- CreateIndex
CREATE INDEX "CVAnalysis_userId_idx" ON "public"."CVAnalysis"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "PreviewAnalysis_token_key" ON "public"."PreviewAnalysis"("token");

-- CreateIndex
CREATE INDEX "PreviewAnalysis_token_idx" ON "public"."PreviewAnalysis"("token");

-- CreateIndex
CREATE INDEX "PreviewAnalysis_expiresAt_idx" ON "public"."PreviewAnalysis"("expiresAt");

-- CreateIndex
CREATE INDEX "PreviewAnalysis_consumed_idx" ON "public"."PreviewAnalysis"("consumed");

-- CreateIndex
CREATE INDEX "PreviewAnalysis_claimed_by_user_id_idx" ON "public"."PreviewAnalysis"("claimed_by_user_id");

-- CreateIndex
CREATE INDEX "PreviewAnalysis_claimed_by_user_id_consumed_idx" ON "public"."PreviewAnalysis"("claimed_by_user_id", "consumed");

-- CreateIndex
CREATE INDEX "PreviewAnalysis_status_expiresAt_idx" ON "public"."PreviewAnalysis"("status", "expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "PublicChallenge_slug_key" ON "public"."PublicChallenge"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "PublicChallengeEntry_challengeId_userId_key" ON "public"."PublicChallengeEntry"("challengeId", "userId");

-- CreateIndex
CREATE INDEX "RecoveryEmailLog_userId_sentAt_idx" ON "public"."RecoveryEmailLog"("userId", "sentAt");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "public"."Session"("sessionToken");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "public"."Session"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_userId_key" ON "public"."Subscription"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_stripeSubId_key" ON "public"."Subscription"("stripeSubId");

-- CreateIndex
CREATE UNIQUE INDEX "UserAnalytics_userId_key" ON "public"."UserAnalytics"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserBehaviorProfile_userId_key" ON "public"."UserBehaviorProfile"("userId");

-- CreateIndex
CREATE INDEX "UserPredictionSnapshot_createdAt_idx" ON "public"."UserPredictionSnapshot"("createdAt");

-- CreateIndex
CREATE INDEX "UserPredictionSnapshot_returnSegment_idx" ON "public"."UserPredictionSnapshot"("returnSegment");

-- CreateIndex
CREATE INDEX "UserPredictionSnapshot_userId_idx" ON "public"."UserPredictionSnapshot"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "WaitlistEntry_email_key" ON "public"."WaitlistEntry"("email");

-- CreateIndex
CREATE UNIQUE INDEX "WaitlistEntry_userId_key" ON "public"."WaitlistEntry"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "credit_transactions_idempotency_key_key" ON "public"."credit_transactions"("idempotency_key");

-- CreateIndex
CREATE UNIQUE INDEX "stripe_events_event_id_key" ON "public"."stripe_events"("event_id");

-- CreateIndex
CREATE INDEX "idx_idempotency_expires_at" ON "public"."idempotency"("expires_at");

-- CreateIndex
CREATE UNIQUE INDEX "idempotency_idempotency_key_user_id_operation_key" ON "public"."idempotency"("idempotency_key", "user_id", "operation");

-- CreateIndex
CREATE UNIQUE INDEX "cv_rewrites_idempotency_key_key" ON "public"."cv_rewrites"("idempotency_key");

-- CreateIndex
CREATE INDEX "cv_rewrites_user_id_idx" ON "public"."cv_rewrites"("user_id");

-- CreateIndex
CREATE INDEX "cv_rewrites_expires_at_idx" ON "public"."cv_rewrites"("expires_at");

-- CreateIndex
CREATE INDEX "graphs_user_id_idx" ON "public"."graphs"("user_id");

-- CreateIndex
CREATE INDEX "graphs_is_active_idx" ON "public"."graphs"("is_active");

-- CreateIndex
CREATE INDEX "graphs_deleted_at_idx" ON "public"."graphs"("deleted_at");

-- CreateIndex
CREATE INDEX "graphs_source_idx" ON "public"."graphs"("source");

-- CreateIndex
CREATE INDEX "graphs_created_at_idx" ON "public"."graphs"("created_at");

-- CreateIndex
CREATE INDEX "graphs_is_active_source_idx" ON "public"."graphs"("is_active", "source");

-- CreateIndex
CREATE INDEX "graphs_user_id_is_active_idx" ON "public"."graphs"("user_id", "is_active");

-- CreateIndex
CREATE INDEX "graph_nodes_graph_id_idx" ON "public"."graph_nodes"("graph_id");

-- CreateIndex
CREATE INDEX "graph_nodes_type_idx" ON "public"."graph_nodes"("type");

-- CreateIndex
CREATE INDEX "graph_nodes_normalized_label_idx" ON "public"."graph_nodes"("normalized_label");

-- CreateIndex
CREATE INDEX "graph_nodes_confidence_idx" ON "public"."graph_nodes"("confidence");

-- CreateIndex
CREATE INDEX "graph_nodes_deleted_at_idx" ON "public"."graph_nodes"("deleted_at");

-- CreateIndex
CREATE INDEX "graph_nodes_graph_id_type_idx" ON "public"."graph_nodes"("graph_id", "type");

-- CreateIndex
CREATE INDEX "graph_nodes_graph_id_normalized_label_idx" ON "public"."graph_nodes"("graph_id", "normalized_label");

-- CreateIndex
CREATE INDEX "graph_nodes_graph_id_type_confidence_idx" ON "public"."graph_nodes"("graph_id", "type", "confidence");

-- CreateIndex
CREATE INDEX "graph_nodes_graph_id_deleted_at_idx" ON "public"."graph_nodes"("graph_id", "deleted_at");

-- CreateIndex
CREATE INDEX "graph_edges_graph_id_idx" ON "public"."graph_edges"("graph_id");

-- CreateIndex
CREATE INDEX "graph_edges_type_idx" ON "public"."graph_edges"("type");

-- CreateIndex
CREATE INDEX "graph_edges_source_node_id_idx" ON "public"."graph_edges"("source_node_id");

-- CreateIndex
CREATE INDEX "graph_edges_target_node_id_idx" ON "public"."graph_edges"("target_node_id");

-- CreateIndex
CREATE INDEX "graph_edges_weight_idx" ON "public"."graph_edges"("weight");

-- CreateIndex
CREATE INDEX "graph_edges_confidence_idx" ON "public"."graph_edges"("confidence");

-- CreateIndex
CREATE INDEX "graph_edges_deleted_at_idx" ON "public"."graph_edges"("deleted_at");

-- CreateIndex
CREATE INDEX "graph_edges_graph_id_type_idx" ON "public"."graph_edges"("graph_id", "type");

-- CreateIndex
CREATE INDEX "graph_edges_graph_id_source_node_id_idx" ON "public"."graph_edges"("graph_id", "source_node_id");

-- CreateIndex
CREATE INDEX "graph_edges_graph_id_target_node_id_idx" ON "public"."graph_edges"("graph_id", "target_node_id");

-- CreateIndex
CREATE INDEX "graph_edges_source_node_id_target_node_id_idx" ON "public"."graph_edges"("source_node_id", "target_node_id");

-- CreateIndex
CREATE INDEX "graph_edges_graph_id_type_weight_idx" ON "public"."graph_edges"("graph_id", "type", "weight");

-- CreateIndex
CREATE INDEX "graph_edges_graph_id_deleted_at_idx" ON "public"."graph_edges"("graph_id", "deleted_at");

-- CreateIndex
CREATE INDEX "graph_versions_graph_id_idx" ON "public"."graph_versions"("graph_id");

-- CreateIndex
CREATE INDEX "graph_versions_version_idx" ON "public"."graph_versions"("version");

-- CreateIndex
CREATE INDEX "graph_versions_created_at_idx" ON "public"."graph_versions"("created_at");

-- CreateIndex
CREATE INDEX "graph_versions_graph_id_version_idx" ON "public"."graph_versions"("graph_id", "version");

-- CreateIndex
CREATE UNIQUE INDEX "graph_versions_graph_id_version_key" ON "public"."graph_versions"("graph_id", "version");

-- CreateIndex
CREATE INDEX "graph_snapshots_graph_id_idx" ON "public"."graph_snapshots"("graph_id");

-- CreateIndex
CREATE INDEX "graph_snapshots_version_idx" ON "public"."graph_snapshots"("version");

-- CreateIndex
CREATE INDEX "graph_snapshots_created_at_idx" ON "public"."graph_snapshots"("created_at");

-- CreateIndex
CREATE INDEX "graph_snapshots_graph_id_version_idx" ON "public"."graph_snapshots"("graph_id", "version");

-- CreateIndex
CREATE INDEX "data_lineage_source_type_idx" ON "public"."data_lineage"("source_type");

-- CreateIndex
CREATE INDEX "data_lineage_transformation_type_idx" ON "public"."data_lineage"("transformation_type");

-- CreateIndex
CREATE INDEX "data_lineage_relation_type_idx" ON "public"."data_lineage"("relation_type");

-- CreateIndex
CREATE INDEX "data_lineage_storage_type_idx" ON "public"."data_lineage"("storage_type");

-- CreateIndex
CREATE INDEX "data_lineage_graph_node_id_idx" ON "public"."data_lineage"("graph_node_id");

-- CreateIndex
CREATE INDEX "data_lineage_timestamp_idx" ON "public"."data_lineage"("timestamp");

-- CreateIndex
CREATE INDEX "data_lineage_confidence_idx" ON "public"."data_lineage"("confidence");

-- CreateIndex
CREATE INDEX "data_lineage_hash_idx" ON "public"."data_lineage"("hash");

-- CreateIndex
CREATE INDEX "data_lineage_parent_uuid_timestamp_idx" ON "public"."data_lineage"("parent_uuid", "timestamp");

-- CreateIndex
CREATE INDEX "data_lineage_graph_node_id_timestamp_idx" ON "public"."data_lineage"("graph_node_id", "timestamp");

-- AddForeignKey
ALTER TABLE "public"."CareerProfile" ADD CONSTRAINT "CareerProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."InterviewSession" ADD CONSTRAINT "InterviewSession_challengeEntryId_fkey" FOREIGN KEY ("challengeEntryId") REFERENCES "public"."PublicChallengeEntry"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."InterviewSession" ADD CONSTRAINT "InterviewSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AIUsageLog" ADD CONSTRAINT "AIUsageLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AdminAuditLog" ADD CONSTRAINT "AdminAuditLog_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BehaviorEvent" ADD CONSTRAINT "BehaviorEvent_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "public"."InterviewSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BehaviorEvent" ADD CONSTRAINT "BehaviorEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BehavioralPattern" ADD CONSTRAINT "BehavioralPattern_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CVAnalysis" ADD CONSTRAINT "CVAnalysis_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."InterviewEvent" ADD CONSTRAINT "InterviewEvent_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "public"."InterviewSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PublicChallengeEntry" ADD CONSTRAINT "PublicChallengeEntry_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "public"."PublicChallenge"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PublicChallengeEntry" ADD CONSTRAINT "PublicChallengeEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RecoveryEmailLog" ADD CONSTRAINT "RecoveryEmailLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Subscription" ADD CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserAnalytics" ADD CONSTRAINT "UserAnalytics_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserBehaviorProfile" ADD CONSTRAINT "UserBehaviorProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserPredictionSnapshot" ADD CONSTRAINT "UserPredictionSnapshot_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WaitlistEntry" ADD CONSTRAINT "WaitlistEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."graphs" ADD CONSTRAINT "graphs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."graph_nodes" ADD CONSTRAINT "graph_nodes_graph_id_fkey" FOREIGN KEY ("graph_id") REFERENCES "public"."graphs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."graph_edges" ADD CONSTRAINT "graph_edges_graph_id_fkey" FOREIGN KEY ("graph_id") REFERENCES "public"."graphs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."graph_edges" ADD CONSTRAINT "graph_edges_source_node_id_fkey" FOREIGN KEY ("source_node_id") REFERENCES "public"."graph_nodes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."graph_edges" ADD CONSTRAINT "graph_edges_target_node_id_fkey" FOREIGN KEY ("target_node_id") REFERENCES "public"."graph_nodes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."graph_versions" ADD CONSTRAINT "graph_versions_graph_id_fkey" FOREIGN KEY ("graph_id") REFERENCES "public"."graphs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."graph_snapshots" ADD CONSTRAINT "graph_snapshots_graph_id_fkey" FOREIGN KEY ("graph_id") REFERENCES "public"."graphs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

