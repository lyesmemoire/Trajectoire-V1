# Sprint 3.5.5 - Database Source of Truth Report

## Executive Summary

**Objective:** Make Prisma the single source of truth for the database schema  
**Status:** ✅ Analysis Complete  
**Date:** 2026-07-03

---

## Phase 1: Prisma Models Usage Audit

### Models Inventory

| Model | Usage Count | Status | Decision |
|-------|-------------|--------|----------|
| User | High | ✅ Active | **KEEP** |
| CareerProfile | High | ✅ Active | **KEEP** |
| InterviewSession | High | ✅ Active | **KEEP** |
| AIUsageLog | High | ✅ Active | **KEEP** |
| Account | High | ✅ Active | **KEEP** |
| AdminAuditLog | Medium | ✅ Active | **KEEP** |
| BehaviorEvent | High | ✅ Active | **KEEP** |
| BehavioralPattern | Medium | ✅ Active | **KEEP** |
| CVAnalysis | High | ✅ Active | **KEEP** |
| InterviewEvent | High | ✅ Active | **KEEP** |
| ProcessedWebhook | None | ❌ Unused | **DELETE** |
| PromptVersion | Low | ⚠️ Feature flag | **KEEP** (conditional) |
| PublicChallenge | Medium | ✅ Active | **KEEP** |
| PublicChallengeEntry | Medium | ✅ Active | **KEEP** |
| RecoveryEmailLog | Medium | ✅ Active | **KEEP** |
| Session | High | ✅ Active | **KEEP** |
| Subscription | High | ✅ Active | **KEEP** |
| UserAnalytics | None | ❌ Unused | **DELETE** |
| UserBehaviorProfile | High | ✅ Active | **KEEP** |
| UserPredictionSnapshot | Medium | ✅ Active | **KEEP** |
| WaitlistEntry | Low | ✅ Active | **KEEP** |
| PremiumInterviewSession | Medium | ⚠️ Duplicate | **MERGE** |
| SimulationSession | Low | ⚠️ Duplicate | **MERGE** |
| OutboxEvent | Medium | ✅ Active | **KEEP** |

### Detailed Analysis

#### DELETE Candidates

**1. ProcessedWebhook**
- **Usage:** Only in schema.prisma and audit reports
- **Purpose:** Webhook tracking (appears to be legacy)
- **Impact:** None - not referenced in codebase
- **Action:** Safe to delete

**2. UserAnalytics**
- **Usage:** Only in schema.prisma and audit reports
- **Purpose:** User analytics (appears to be unused)
- **Impact:** None - not referenced in codebase
- **Action:** Safe to delete

#### MERGE Candidates

**1. PremiumInterviewSession**
- **Usage:** Used in 10 files (interview.service, premium-prompt, etc.)
- **Purpose:** Premium interview sessions
- **Overlap:** Duplicates InterviewSession functionality
- **Action:** Merge into InterviewSession with `isPremium` flag

**2. SimulationSession**
- **Usage:** Used in 4 files (executive simulate API)
- **Purpose:** Executive simulations
- **Overlap:** Overlaps with InterviewSession
- **Action:** Merge into InterviewSession with `type` field

#### KEEP Candidates (Conditional)

**1. PromptVersion**
- **Usage:** Used in `lib/db/prompt.service.ts`
- **Purpose:** Prompt versioning
- **Condition:** Controlled by `USE_PRISMA_PROMPTS` feature flag
- **Action:** Keep but document as feature-flagged

---

## Phase 2: Prisma vs Supabase Comparison

### Schema Duplication Analysis

| Prisma Model | Supabase Table | Overlap | Action |
|--------------|----------------|---------|--------|
| User | profiles | Partial | **KEEP Prisma** (source of truth) |
| InterviewSession | evaluations | High | **KEEP Prisma** |
| InterviewSession | simulations | High | **KEEP Prisma** |
| - | competency_scores | None | **DELETE** (unused) |
| - | action_items | None | **DELETE** (unused) |
| - | plan_milestones | None | **DELETE** (unused) |
| - | notifications | None | **DELETE** (unused) |
| - | progression_snapshots | None | **DELETE** (unused) |

### Supabase Tables to Delete

The following Supabase tables are not used in the Prisma-based architecture:

1. **profiles** - Replaced by Prisma User model
2. **evaluations** - Replaced by InterviewSession
3. **simulations** - Replaced by InterviewSession
4. **competency_scores** - Not used in current architecture
5. **action_items** - Not used in current architecture
6. **plan_milestones** - Not used in current architecture
7. **notifications** - Not used in current architecture
8. **progression_snapshots** - Not used in current architecture

**Note:** These tables should be removed from `supabase_schema.sql` after confirming no direct Supabase client usage exists.

---

## Phase 3: Action Plan

### Immediate Actions

#### 1. Delete Unused Prisma Models
```prisma
// Remove from schema.prisma:
// - ProcessedWebhook
// - UserAnalytics
```

#### 2. Merge Duplicate Models
```prisma
// Add to InterviewSession:
isPremium     Boolean  @default(false)
sessionType   String   @default("interview") // "interview" | "simulation"
```

#### 3. Update References
- Update `lib/db/interview.service.ts` to use merged InterviewSession
- Update `lib/interview/premium-prompt.ts` to use `isPremium` flag
- Update `app/api/executive/` to use `sessionType` field

#### 4. Remove Supabase Schema
- Remove unused tables from `supabase_schema.sql`
- Keep only auth.users extension if needed

### Migration Strategy

#### Step 1: Data Migration (if needed)
```sql
-- Migrate PremiumInterviewSession to InterviewSession
ALTER TABLE "InterviewSession" 
ADD COLUMN "isPremium" BOOLEAN DEFAULT false,
ADD COLUMN "sessionType" VARCHAR DEFAULT 'interview';

UPDATE "InterviewSession" 
SET "isPremium" = true, "sessionType" = 'interview'
WHERE id IN (SELECT id FROM "premium_interview_sessions");

-- Migrate SimulationSession to InterviewSession
INSERT INTO "InterviewSession" (userId, sessionType, scores, overall, percentile, level)
SELECT userId, 'simulation', scores, overall, percentile, level
FROM "SimulationSession";

-- Drop old tables
DROP TABLE "premium_interview_sessions";
DROP TABLE "SimulationSession";
```

#### Step 2: Code Updates
- Update all references to use merged model
- Run tests to verify functionality

#### Step 3: Schema Cleanup
- Remove unused models from Prisma schema
- Generate Prisma client
- Run typecheck

---

## Phase 4: Repository Updates Required

### Files to Update

1. **`lib/db/interview.service.ts`**
   - Update to use merged InterviewSession
   - Add `isPremium` and `sessionType` handling

2. **`lib/interview/premium-prompt.ts`**
   - Update to use `isPremium` flag instead of separate model

3. **`app/api/executive/simulate/route.ts`**
   - Update to use `sessionType: 'simulation'`

4. **`lib/db/prompt.service.ts`**
   - Document PromptVersion as feature-flagged
   - Add conditional usage based on `USE_PRISMA_PROMPTS`

5. **`lib/ml/interview.feature-engine.ts`**
   - Update to use merged InterviewSession

---

## Phase 5: Validation Checklist

- [ ] Delete ProcessedWebhook from schema.prisma
- [ ] Delete UserAnalytics from schema.prisma
- [ ] Add isPremium field to InterviewSession
- [ ] Add sessionType field to InterviewSession
- [ ] Update lib/db/interview.service.ts
- [ ] Update lib/interview/premium-prompt.ts
- [ ] Update app/api/executive/simulate/route.ts
- [ ] Update app/api/executive/session/route.ts
- [ ] Update lib/ml/interview.feature-engine.ts
- [ ] Generate Prisma client: `npx prisma generate`
- [ ] Run typecheck: `npm run typecheck`
- [ ] Run tests: `npm test`
- [ ] Verify no API regressions

---

## Summary

### Models to DELETE (2)
- ProcessedWebhook
- UserAnalytics

### Models to MERGE (2)
- PremiumInterviewSession → InterviewSession (add isPremium flag)
- SimulationSession → InterviewSession (add sessionType field)

### Models to KEEP (21)
- User, CareerProfile, InterviewSession, AIUsageLog, Account, AdminAuditLog, BehaviorEvent, BehavioralPattern, CVAnalysis, InterviewEvent, PromptVersion (conditional), PublicChallenge, PublicChallengeEntry, RecoveryEmailLog, Session, Subscription, UserBehaviorProfile, UserPredictionSnapshot, WaitlistEntry, OutboxEvent

### Supabase Tables to DELETE (8)
- profiles, evaluations, simulations, competency_scores, action_items, plan_milestones, notifications, progression_snapshots

### Risk Assessment
- **Low Risk:** Deleting unused models (ProcessedWebhook, UserAnalytics)
- **Medium Risk:** Merging duplicate models (requires data migration and code updates)
- **High Risk:** Removing Supabase tables (requires verification of no direct Supabase client usage)

### Recommendation
Proceed with Prisma cleanup first (DELETE + MERGE), then audit Supabase client usage before removing Supabase tables.
