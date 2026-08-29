-- CreateEnum
CREATE TYPE "public"."WorkspaceReadiness" AS ENUM ('SETUP', 'IN_PROGRESS', 'READY', 'INTERVIEWING', 'COMPLETED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "public"."CareerMemoryOrigin" AS ENUM ('USER_CONFIRMED', 'AI_DERIVED', 'IMPORTED');

-- CreateEnum
CREATE TYPE "public"."CareerMemoryStatus" AS ENUM ('SUGGESTED', 'CONFIRMED', 'REJECTED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "public"."DiscoveryProvider" AS ENUM ('GREENHOUSE', 'LEVER', 'ASHBY', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."DiscoveryJobStatus" AS ENUM ('LIVE', 'STALE', 'CLOSED');

-- CreateTable
CREATE TABLE "public"."application_workspaces" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "opportunityId" TEXT NOT NULL,
    "selectedCVAnalysisId" TEXT,
    "interviewSessionId" TEXT,
    "readiness" "public"."WorkspaceReadiness" NOT NULL DEFAULT 'SETUP',
    "companyResearch" JSONB,
    "preparation" JSONB,
    "tasks" JSONB,
    "notes" TEXT,
    "metadata" JSONB,
    "lastActivityAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "application_workspaces_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."career_stories" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "situation" TEXT NOT NULL,
    "task" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "result" TEXT NOT NULL,
    "skills" TEXT[],
    "tags" TEXT[],
    "metrics" JSONB,
    "source" TEXT,
    "confidence" INTEGER NOT NULL DEFAULT 100,
    "isFavorite" BOOLEAN NOT NULL DEFAULT false,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "interviewSessionId" TEXT,
    "cVAnalysisId" TEXT,

    CONSTRAINT "career_stories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."opportunity_stories" (
    "id" TEXT NOT NULL,
    "opportunityId" TEXT NOT NULL,
    "storyId" TEXT NOT NULL,
    "relevance" INTEGER,
    "reason" TEXT,
    "selected" BOOLEAN NOT NULL DEFAULT true,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "opportunity_stories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."career_memories" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "origin" "public"."CareerMemoryOrigin" NOT NULL DEFAULT 'USER_CONFIRMED',
    "status" "public"."CareerMemoryStatus" NOT NULL DEFAULT 'CONFIRMED',
    "confidence" INTEGER NOT NULL DEFAULT 100,
    "evidence" JSONB,
    "sourceType" TEXT,
    "sourceId" TEXT,
    "isFavorite" BOOLEAN NOT NULL DEFAULT false,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "interviewSessionId" TEXT,
    "cVAnalysisId" TEXT,

    CONSTRAINT "career_memories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."opportunity_memories" (
    "id" TEXT NOT NULL,
    "opportunityId" TEXT NOT NULL,
    "memoryId" TEXT NOT NULL,
    "relevance" INTEGER,
    "reason" TEXT,
    "selected" BOOLEAN NOT NULL DEFAULT false,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "opportunity_memories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."discovery_sources" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "provider" "public"."DiscoveryProvider" NOT NULL,
    "company" TEXT NOT NULL,
    "boardKey" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "lastSyncAt" TIMESTAMP(3),
    "lastSyncStatus" TEXT,
    "lastSyncError" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "discovery_sources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."discovered_jobs" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "opportunityId" TEXT,
    "provider" "public"."DiscoveryProvider" NOT NULL,
    "sourceKey" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "boardKey" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "location" TEXT,
    "department" TEXT,
    "employmentType" TEXT,
    "workplaceType" TEXT,
    "description" TEXT NOT NULL,
    "sourceUrl" TEXT NOT NULL,
    "applyUrl" TEXT,
    "fingerprint" TEXT NOT NULL,
    "status" "public"."DiscoveryJobStatus" NOT NULL DEFAULT 'LIVE',
    "publishedAt" TIMESTAMP(3),
    "firstSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "closedAt" TIMESTAMP(3),
    "rawPayload" JSONB,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "discovered_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "application_workspaces_opportunityId_key" ON "public"."application_workspaces"("opportunityId");

-- CreateIndex
CREATE INDEX "application_workspaces_userId_idx" ON "public"."application_workspaces"("userId");

-- CreateIndex
CREATE INDEX "application_workspaces_userId_updatedAt_idx" ON "public"."application_workspaces"("userId", "updatedAt" DESC);

-- CreateIndex
CREATE INDEX "application_workspaces_selectedCVAnalysisId_idx" ON "public"."application_workspaces"("selectedCVAnalysisId");

-- CreateIndex
CREATE INDEX "application_workspaces_interviewSessionId_idx" ON "public"."application_workspaces"("interviewSessionId");

-- CreateIndex
CREATE INDEX "career_stories_userId_idx" ON "public"."career_stories"("userId");

-- CreateIndex
CREATE INDEX "career_stories_userId_isFavorite_idx" ON "public"."career_stories"("userId", "isFavorite");

-- CreateIndex
CREATE INDEX "career_stories_userId_updatedAt_idx" ON "public"."career_stories"("userId", "updatedAt" DESC);

-- CreateIndex
CREATE INDEX "opportunity_stories_opportunityId_idx" ON "public"."opportunity_stories"("opportunityId");

-- CreateIndex
CREATE INDEX "opportunity_stories_storyId_idx" ON "public"."opportunity_stories"("storyId");

-- CreateIndex
CREATE INDEX "opportunity_stories_opportunityId_selected_idx" ON "public"."opportunity_stories"("opportunityId", "selected");

-- CreateIndex
CREATE UNIQUE INDEX "opportunity_stories_opportunityId_storyId_key" ON "public"."opportunity_stories"("opportunityId", "storyId");

-- CreateIndex
CREATE INDEX "career_memories_userId_idx" ON "public"."career_memories"("userId");

-- CreateIndex
CREATE INDEX "career_memories_userId_status_idx" ON "public"."career_memories"("userId", "status");

-- CreateIndex
CREATE INDEX "career_memories_userId_category_idx" ON "public"."career_memories"("userId", "category");

-- CreateIndex
CREATE INDEX "career_memories_userId_isFavorite_idx" ON "public"."career_memories"("userId", "isFavorite");

-- CreateIndex
CREATE INDEX "career_memories_userId_updatedAt_idx" ON "public"."career_memories"("userId", "updatedAt" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "career_memories_userId_category_key_key" ON "public"."career_memories"("userId", "category", "key");

-- CreateIndex
CREATE INDEX "opportunity_memories_opportunityId_idx" ON "public"."opportunity_memories"("opportunityId");

-- CreateIndex
CREATE INDEX "opportunity_memories_memoryId_idx" ON "public"."opportunity_memories"("memoryId");

-- CreateIndex
CREATE INDEX "opportunity_memories_opportunityId_selected_idx" ON "public"."opportunity_memories"("opportunityId", "selected");

-- CreateIndex
CREATE UNIQUE INDEX "opportunity_memories_opportunityId_memoryId_key" ON "public"."opportunity_memories"("opportunityId", "memoryId");

-- CreateIndex
CREATE INDEX "discovery_sources_userId_idx" ON "public"."discovery_sources"("userId");

-- CreateIndex
CREATE INDEX "discovery_sources_userId_enabled_idx" ON "public"."discovery_sources"("userId", "enabled");

-- CreateIndex
CREATE INDEX "discovery_sources_provider_boardKey_idx" ON "public"."discovery_sources"("provider", "boardKey");

-- CreateIndex
CREATE UNIQUE INDEX "discovery_sources_userId_provider_boardKey_key" ON "public"."discovery_sources"("userId", "provider", "boardKey");

-- CreateIndex
CREATE INDEX "discovered_jobs_userId_idx" ON "public"."discovered_jobs"("userId");

-- CreateIndex
CREATE INDEX "discovered_jobs_userId_status_lastSeenAt_idx" ON "public"."discovered_jobs"("userId", "status", "lastSeenAt" DESC);

-- CreateIndex
CREATE INDEX "discovered_jobs_userId_fingerprint_idx" ON "public"."discovered_jobs"("userId", "fingerprint");

-- CreateIndex
CREATE INDEX "discovered_jobs_opportunityId_idx" ON "public"."discovered_jobs"("opportunityId");

-- CreateIndex
CREATE INDEX "discovered_jobs_provider_boardKey_idx" ON "public"."discovered_jobs"("provider", "boardKey");

-- CreateIndex
CREATE UNIQUE INDEX "discovered_jobs_userId_provider_sourceKey_key" ON "public"."discovered_jobs"("userId", "provider", "sourceKey");

-- AddForeignKey
ALTER TABLE "public"."application_workspaces" ADD CONSTRAINT "application_workspaces_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."application_workspaces" ADD CONSTRAINT "application_workspaces_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "public"."opportunities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."application_workspaces" ADD CONSTRAINT "application_workspaces_selectedCVAnalysisId_fkey" FOREIGN KEY ("selectedCVAnalysisId") REFERENCES "public"."CVAnalysis"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."application_workspaces" ADD CONSTRAINT "application_workspaces_interviewSessionId_fkey" FOREIGN KEY ("interviewSessionId") REFERENCES "public"."InterviewSession"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."career_stories" ADD CONSTRAINT "career_stories_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."career_stories" ADD CONSTRAINT "career_stories_interviewSessionId_fkey" FOREIGN KEY ("interviewSessionId") REFERENCES "public"."InterviewSession"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."career_stories" ADD CONSTRAINT "career_stories_cVAnalysisId_fkey" FOREIGN KEY ("cVAnalysisId") REFERENCES "public"."CVAnalysis"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."opportunity_stories" ADD CONSTRAINT "opportunity_stories_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "public"."opportunities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."opportunity_stories" ADD CONSTRAINT "opportunity_stories_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "public"."career_stories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."career_memories" ADD CONSTRAINT "career_memories_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."career_memories" ADD CONSTRAINT "career_memories_interviewSessionId_fkey" FOREIGN KEY ("interviewSessionId") REFERENCES "public"."InterviewSession"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."career_memories" ADD CONSTRAINT "career_memories_cVAnalysisId_fkey" FOREIGN KEY ("cVAnalysisId") REFERENCES "public"."CVAnalysis"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."opportunity_memories" ADD CONSTRAINT "opportunity_memories_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "public"."opportunities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."opportunity_memories" ADD CONSTRAINT "opportunity_memories_memoryId_fkey" FOREIGN KEY ("memoryId") REFERENCES "public"."career_memories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."discovery_sources" ADD CONSTRAINT "discovery_sources_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."discovered_jobs" ADD CONSTRAINT "discovered_jobs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."discovered_jobs" ADD CONSTRAINT "discovered_jobs_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "public"."opportunities"("id") ON DELETE SET NULL ON UPDATE CASCADE;
