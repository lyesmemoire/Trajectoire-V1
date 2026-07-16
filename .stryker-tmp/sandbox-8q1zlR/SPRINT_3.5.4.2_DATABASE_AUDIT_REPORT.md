# Sprint 3.5.4.2 - Database Validation Audit Report

## Executive Summary

**Status:** ⚠️ Issues Identified  
**Date:** 2026-07-03  
**Scope:** Prisma Schema, Supabase Schema, Storage, RLS, Indexes, Foreign Keys, Transactions, Orphan Data

---

## Phase 1: Prisma Schema Audit

### Overview
- **File:** `prisma/schema.prisma`
- **Datasource:** PostgreSQL with multiSchema (public, auth)
- **Models:** 25 models
- **Enums:** 2 enums (UserRole, Plan)

### Models Inventory

| Model | Purpose | Status |
|-------|---------|--------|
| User | Core user entity | ✅ Active |
| CareerProfile | User career metrics | ✅ Active |
| InterviewSession | Interview sessions | ✅ Active |
| AIUsageLog | LLM usage tracking | ✅ Active |
| Account | OAuth accounts | ✅ Active |
| AdminAuditLog | Admin actions | ✅ Active |
| BehaviorEvent | User behavior tracking | ✅ Active |
| BehavioralPattern | Pattern detection | ✅ Active |
| CVAnalysis | CV analysis results | ✅ Active |
| InterviewEvent | Interview events | ✅ Active |
| ProcessedWebhook | Webhook tracking | ⚠️ Unused |
| PromptVersion | Prompt versioning | ⚠️ Unused |
| PublicChallenge | Public challenges | ✅ Active |
| PublicChallengeEntry | Challenge entries | ✅ Active |
| RecoveryEmailLog | Recovery tracking | ✅ Active |
| Session | User sessions | ✅ Active |
| Subscription | User subscriptions | ✅ Active |
| UserAnalytics | User analytics | ✅ Active |
| UserBehaviorProfile | Behavior profiles | ✅ Active |
| UserPredictionSnapshot | Prediction snapshots | ✅ Active |
| WaitlistEntry | Waitlist management | ✅ Active |
| PremiumInterviewSession | Premium interviews | ⚠️ Duplicate |
| SimulationSession | Simulations | ⚠️ Duplicate |
| OutboxEvent | Event outbox | ✅ Active |

### Issues Identified

#### 1. Unused Models
- **ProcessedWebhook**: No references in codebase, appears to be legacy
- **PromptVersion**: No references in codebase, feature flag controlled (USE_PRISMA_PROMPTS)

#### 2. Duplicate Models
- **PremiumInterviewSession**: Duplicates InterviewSession functionality
- **SimulationSession**: Overlaps with InterviewSession, unclear purpose

#### 3. Missing Migrations
- No `prisma/migrations/` directory found
- Schema changes may not be version-controlled
- Risk of schema drift between environments

#### 4. Schema Duplication with Supabase
- Prisma has `User` model, Supabase has `profiles` table
- Prisma has `InterviewSession`, Supabase has `evaluations` and `simulations`
- Potential data inconsistency between the two schemas

### Foreign Keys Analysis

All foreign keys are properly defined with `onDelete: Cascade`:

| Model | FK Field | Reference | On Delete |
|-------|----------|-----------|-----------|
| CareerProfile | userId | User.id | Cascade ✅ |
| InterviewSession | userId | User.id | Cascade ✅ |
| AIUsageLog | userId | User.id | Cascade ✅ |
| Account | userId | User.id | Cascade ✅ |
| AdminAuditLog | adminId | User.id | Cascade ✅ |
| BehaviorEvent | userId | User.id | Cascade ✅ |
| BehavioralPattern | userId | User.id | Cascade ✅ |
| CVAnalysis | userId | User.id | Cascade ✅ |
| InterviewEvent | sessionId | InterviewSession.id | Cascade ✅ |
| PublicChallengeEntry | userId | User.id | Cascade ✅ |
| PublicChallengeEntry | challengeId | PublicChallenge.id | Cascade ✅ |
| RecoveryEmailLog | userId | User.id | Cascade ✅ |
| Session | userId | User.id | Cascade ✅ |
| Subscription | userId | User.id | Cascade ✅ |
| UserAnalytics | userId | User.id | Cascade ✅ |
| UserBehaviorProfile | userId | User.id | Cascade ✅ |
| UserPredictionSnapshot | userId | User.id | Cascade ✅ |
| WaitlistEntry | userId | User.id | No action ⚠️ |

**Issue:** WaitlistEntry.userId has no cascade delete, could create orphans.

### Index Analysis

| Model | Index | Status |
|-------|-------|--------|
| User | email | ✅ |
| User | stripeCustomerId | ✅ |
| CareerProfile | userId (unique) | ✅ |
| InterviewSession | userId | ✅ |
| InterviewSession | createdAt | ✅ |
| InterviewSession | userId + createdAt (desc) | ✅ |
| AIUsageLog | createdAt | ✅ |
| AIUsageLog | userId | ✅ |
| Account | provider + providerAccountId (unique) | ✅ |
| Account | userId | ✅ |
| AdminAuditLog | action | ✅ |
| AdminAuditLog | adminId | ✅ |
| BehaviorEvent | sessionId | ✅ |
| BehaviorEvent | userId + type | ✅ |
| RecoveryEmailLog | userId + sentAt | ✅ |
| Session | userId | ✅ |
| UserPredictionSnapshot | createdAt | ✅ |
| UserPredictionSnapshot | returnSegment | ✅ |
| UserPredictionSnapshot | userId | ✅ |
| OutboxEvent | processedAt | ✅ |
| OutboxEvent | availableAt | ✅ |

**Missing Indexes:**
- `CVAnalysis.userId` - No index on foreign key
- `InterviewEvent.sessionId` - No index on foreign key
- `Subscription.stripeCustomerId` - No index on foreign key
- `Subscription.stripeSubId` - No index on foreign key

---

## Phase 2: Supabase Schema Audit

### Overview
- **File:** `supabase_schema.sql`
- **Tables:** 8 tables
- **Views:** 1 view (dashboard_summary)
- **Enums:** 7 enums

### Tables Inventory

| Table | Purpose | RLS | Status |
|-------|---------|-----|--------|
| profiles | User profiles extension | ✅ | ✅ Active |
| evaluations | User evaluations | ✅ | ✅ Active |
| competency_scores | Competency scores | ✅ | ✅ Active |
| simulations | Simulations | ✅ | ⚠️ Duplicate |
| action_items | Action items | ✅ | ✅ Active |
| plan_milestones | Plan milestones | ✅ | ✅ Active |
| notifications | Notifications | ✅ | ✅ Active |
| progression_snapshots | Progression snapshots | ✅ | ✅ Active |

### Issues Identified

#### 1. Schema Duplication
- **simulations** table duplicates InterviewSession from Prisma
- **evaluations** table overlaps with InterviewSession functionality
- Unclear which schema is the source of truth

#### 2. Missing Indexes
- `evaluations.user_id` - No index (despite being a foreign key)
- `competency_scores.evaluation_id` - No index (despite being a foreign key)
- `competency_scores.user_id` - No index (despite being a foreign key)
- `simulations.user_id` - No index (despite being a foreign key)
- `action_items.user_id` - No index (despite being a foreign key)
- `plan_milestones.user_id` - No index (despite being a foreign key)
- `notifications.user_id` - No index (despite being a foreign key)
- `progression_snapshots.user_id` - No index (despite being a foreign key)

#### 3. Missing Constraints
- `action_items.due_date` - No check constraint for valid dates
- `plan_milestones.position` - No check constraint for non-negative values

### RLS Policies Audit

All tables have RLS enabled with appropriate policies:

| Table | Select | Insert | Update | Delete |
|-------|--------|--------|--------|-------|
| profiles | ✅ Own | ❌ | ✅ Own | ❌ |
| evaluations | ✅ Own | ✅ Own | ❌ | ❌ |
| competency_scores | ✅ Own | ✅ Own | ❌ | ❌ |
| simulations | ✅ Own | ✅ Own | ❌ | ❌ |
| action_items | ✅ Own | ❌ | ✅ Own | ❌ |
| plan_milestones | ✅ Own | ✅ Own | ✅ Own | ❌ |
| notifications | ✅ Own | ❌ | ✅ Own | ❌ |
| progression_snapshots | ✅ Own | ✅ Own | ❌ | ❌ |

**Issues:**
- No DELETE policies on any table (users cannot delete their own data)
- No INSERT policy for profiles (relies on trigger)
- No UPDATE policies for evaluations, competency_scores, simulations, progression_snapshots

### Triggers Audit

| Trigger | Purpose | Status |
|---------|---------|--------|
| profiles_updated_at | Auto-update updated_at | ✅ |
| on_auth_user_created | Create profile on signup | ✅ |
| action_items_updated_at | Auto-update updated_at | ✅ |
| plan_milestones_updated_at | Auto-update updated_at | ✅ |

All triggers are properly implemented.

---

## Phase 3: Storage Audit

### Status
⚠️ **Cannot audit** - Storage configuration requires Supabase dashboard access or API connection.

### Required Checks (Manual Verification Needed)
- [ ] Buckets exist: `cvs`, `avatars`, `documents`
- [ ] Bucket policies are configured correctly
- [ ] RLS policies on storage
- [ ] File size limits are appropriate
- [ ] Allowed file types are restricted
- [ ] Public/Private access is correctly configured

---

## Phase 4: RLS Policy Audit

### Summary
- **Prisma:** No RLS (application-level security)
- **Supabase:** RLS enabled on all tables

### Issues
1. **Incomplete Policy Coverage:**
   - No DELETE policies on Supabase tables
   - No UPDATE policies on several tables
   - Users cannot modify their own evaluations or simulations

2. **No Service Role Policies:**
   - No policies for admin/service role access
   - Backend may bypass RLS entirely

3. **No Row-Level Security on Prisma Models:**
   - Prisma operates at application level
   - No database-level security for Prisma tables

---

## Phase 5: Index Performance Audit

### Critical Indexes Missing

#### Prisma
```sql
-- Missing indexes
CREATE INDEX "CVAnalysis_userId_idx" ON "CVAnalysis"("userId");
CREATE INDEX "InterviewEvent_sessionId_idx" ON "InterviewEvent"("sessionId");
CREATE INDEX "Subscription_stripeCustomerId_idx" ON "Subscription"("stripeCustomerId");
CREATE INDEX "Subscription_stripeSubId_idx" ON "Subscription"("stripeSubId");
```

#### Supabase
```sql
-- Missing indexes
CREATE INDEX "evaluations_user_id_idx" ON "evaluations"("user_id");
CREATE INDEX "competency_scores_evaluation_id_idx" ON "competency_scores"("evaluation_id");
CREATE INDEX "competency_scores_user_id_idx" ON "competency_scores"("user_id");
CREATE INDEX "simulations_user_id_idx" ON "simulations"("user_id");
CREATE INDEX "action_items_user_id_idx" ON "action_items"("user_id");
CREATE INDEX "plan_milestones_user_id_idx" ON "plan_milestones"("user_id");
CREATE INDEX "notifications_user_id_idx" ON "notifications"("user_id");
CREATE INDEX "progression_snapshots_user_id_idx" ON "progression_snapshots"("user_id");
```

### Performance Impact
- **High:** Missing foreign key indexes cause full table scans on joins
- **Medium:** No composite indexes for common query patterns
- **Low:** Single-column indexes are adequate for most queries

---

## Phase 6: Foreign Keys Audit

### Prisma Foreign Keys
- **Total:** 19 foreign keys
- **With Cascade:** 18 (94.7%)
- **No Action:** 1 (WaitlistEntry.userId)

### Supabase Foreign Keys
- **Total:** 8 foreign keys
- **With Cascade:** 8 (100%)

### Issues
1. **WaitlistEntry.userId** should have `onDelete: Cascade` or `Set Null`
2. **No foreign key constraints** on some relationships (e.g., BehaviorEvent.previousEventId, BehaviorEvent.nextEventId)

---

## Phase 7: Transactions Audit

### Status
⚠️ **Cannot test** - Requires database connection and test data.

### Required Tests (Manual Verification Needed)
- [ ] Create transaction with multiple operations
- [ ] Rollback on error
- [ ] Concurrent transaction handling
- [ ] Deadlock detection
- [ ] Transaction isolation levels

### Code Review Findings
- Transaction handling is done at repository level
- No explicit transaction management in domain layer
- Risk of partial updates on failures

---

## Phase 8: Orphan Data Audit

### Status
⚠️ **Cannot audit** - Requires database connection and data analysis.

### Potential Orphan Sources
1. **BehaviorEvent** with non-existent sessionId
2. **InterviewEvent** with non-existent sessionId
3. **CompetencyScore** with non-existent evaluation_id
4. **WaitlistEntry** with non-existent userId (no cascade)

### Recommended Cleanup Queries
```sql
-- Find orphaned BehaviorEvents
SELECT be.* FROM "BehaviorEvent" be
LEFT JOIN "InterviewSession" is ON be.sessionId = is.id
WHERE is.id IS NULL;

-- Find orphaned InterviewEvents
SELECT ie.* FROM "InterviewEvent" ie
LEFT JOIN "InterviewSession" is ON ie.sessionId = is.id
WHERE is.id IS NULL;

-- Find orphaned CompetencyScores
SELECT cs.* FROM competency_scores cs
LEFT JOIN evaluations e ON cs.evaluation_id = e.id
WHERE e.id IS NULL;
```

---

## Phase 9: Recommendations

### Critical (Fix Immediately)
1. **Add missing foreign key indexes** - Performance impact
2. **Fix WaitlistEntry.userId cascade** - Data integrity
3. **Choose single schema source of truth** - Prisma vs Supabase duplication
4. **Implement Prisma migrations** - Schema version control

### High Priority
1. **Remove unused models** (ProcessedWebhook, PromptVersion)
2. **Resolve duplicate models** (PremiumInterviewSession, SimulationSession)
3. **Add missing RLS policies** (DELETE, UPDATE)
4. **Add check constraints** on numeric fields

### Medium Priority
1. **Add composite indexes** for common query patterns
2. **Implement transaction management** at domain layer
3. **Add orphan data cleanup** scripts
4. **Document schema decisions** (Prisma vs Supabase)

### Low Priority
1. **Add database triggers** for audit logging
2. **Implement soft deletes** on critical tables
3. **Add data retention policies**
4. **Create database views** for common queries

---

## Summary Statistics

| Category | Total | Issues | Status |
|----------|-------|--------|--------|
| Prisma Models | 25 | 4 unused/duplicate | ⚠️ |
| Supabase Tables | 8 | 1 duplicate | ⚠️ |
| Foreign Keys | 27 | 1 missing cascade | ⚠️ |
| Indexes | 20 | 12 missing | ❌ |
| RLS Policies | 24 | 8 missing | ⚠️ |
| Migrations | 0 | N/A | ❌ |

**Overall Grade:** C (Needs Improvement)

---

## Next Steps

1. **Immediate:**
   - Add missing foreign key indexes
   - Fix WaitlistEntry.userId cascade
   - Decide on Prisma vs Supabase schema strategy

2. **Short-term:**
   - Remove unused models
   - Implement Prisma migrations
   - Complete RLS policy coverage

3. **Long-term:**
   - Consolidate schemas
   - Implement comprehensive transaction testing
   - Add automated orphan data detection
