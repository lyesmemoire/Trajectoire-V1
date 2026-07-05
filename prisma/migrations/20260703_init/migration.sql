-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "auth";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('USER', 'ADMIN_SUPPORT', 'ADMIN_PRODUCT', 'ADMIN_FOUNDER');

-- CreateEnum
CREATE TYPE "public"."Plan" AS ENUM ('FREE', 'PRO', 'EXPERT');

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
    "userId" TEXT,
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
    "isPremium" BOOLEAN NOT NULL DEFAULT false,
    "sessionType" TEXT NOT NULL DEFAULT 'interview',

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
CREATE TABLE "public"."OutboxEvent" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "correlationId" TEXT NOT NULL,
    "aggregateId" TEXT,
    "causationId" TEXT,
    "aggregateType" TEXT,
    "payload" JSONB NOT NULL,
    "metadata" JSONB,
    "occurredAt" TIMESTAMP(3) NOT NULL,
    "availableAt" TIMESTAMP(3) NOT NULL,
    "processedAt" TIMESTAMP(3),
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "lastError" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OutboxEvent_pkey" PRIMARY KEY ("id")
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
CREATE UNIQUE INDEX "OutboxEvent_eventId_key" ON "public"."OutboxEvent"("eventId");

-- CreateIndex
CREATE INDEX "OutboxEvent_processedAt_idx" ON "public"."OutboxEvent"("processedAt");

-- CreateIndex
CREATE INDEX "OutboxEvent_availableAt_idx" ON "public"."OutboxEvent"("availableAt");

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
ALTER TABLE "public"."UserBehaviorProfile" ADD CONSTRAINT "UserBehaviorProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserPredictionSnapshot" ADD CONSTRAINT "UserPredictionSnapshot_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WaitlistEntry" ADD CONSTRAINT "WaitlistEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

