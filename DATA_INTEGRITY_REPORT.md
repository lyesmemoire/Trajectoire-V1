# Data Integrity Report

**Date:** 2026-07-03  
**Sprint:** 3.5.5 Phase 7  
**Status:** ✅ Scripts Created - Requires Database Execution

---

## Executive Summary

This report documents the data integrity tools created for the Trajectoire project. These scripts detect and repair orphaned data, duplicates, and unused storage files. Due to lack of database connectivity, actual execution and validation could not be completed, but all scripts are ready for deployment.

### Tools Created

- ✅ `detect-orphans.ts` - Detect orphaned records
- ✅ `detect-duplicates.ts` - Detect duplicate records
- ✅ `repair-relations.ts` - Repair orphaned relations
- ✅ `cleanup-unused-storage.ts` - Cleanup unused storage files

---

## Orphan Detection

### What Are Orphans?

Orphaned records are child records that reference a non-existent parent record due to:
- Manual database modifications
- Failed transactions
- Cascade delete misconfigurations
- Application bugs

### Detection Script

**File:** `scripts/data-integrity/detect-orphans.ts`

**Checks Performed:**
1. BehaviorEvents with non-existent InterviewSessions
2. InterviewEvents with non-existent InterviewSessions
3. CVAnalysis with non-existent Users
4. CareerProfiles with non-existent Users
5. Subscriptions with non-existent Users
6. Sessions with non-existent Users
7. Accounts with non-existent Users
8. WaitlistEntries with non-existent Users

**Usage:**
```bash
npm run db:detect-orphans
```

**Expected Output:**
```
🔍 Detecting orphaned data...

Checking BehaviorEvents...
   ✅ No orphaned BehaviorEvents
Checking InterviewEvents...
   ✅ No orphaned InterviewEvents
...

📊 Orphan Detection Summary
=========================

✅ No orphaned data detected. Database is clean.
```

---

## Duplicate Detection

### What Are Duplicates?

Duplicate records violate unique constraints and can cause:
- Data inconsistency
- Application errors
- User confusion
- Billing issues

### Detection Script

**File:** `scripts/data-integrity/detect-duplicates.ts`

**Checks Performed:**
1. Duplicate User emails
2. Duplicate User referral codes
3. Duplicate Subscription stripeSubId
4. Duplicate Session sessionToken
5. Duplicate PublicChallenge slug
6. Duplicate PublicChallengeEntry (challengeId, userId)

**Usage:**
```bash
npm run db:detect-duplicates
```

**Expected Output:**
```
🔍 Detecting duplicate data...

Checking User emails...
   ✅ No duplicate User emails
Checking User referral codes...
   ✅ No duplicate User referral codes
...

📊 Duplicate Detection Summary
=============================

✅ No duplicate data detected. Database is clean.
```

---

## Relation Repair

### Repair Strategy

The repair script permanently deletes orphaned records to restore referential integrity. This is a destructive operation and should only be run in development or staging environments.

### Repair Script

**File:** `scripts/data-integrity/repair-relations.ts`

**Safety Features:**
- Production environment check (blocks execution in production)
- Transaction-based deletion
- Detailed logging of deleted records

**Repairs Performed:**
1. Delete orphaned BehaviorEvents
2. Delete orphaned InterviewEvents
3. Delete orphaned CVAnalysis
4. Delete orphaned CareerProfiles
5. Delete orphaned Subscriptions
6. Delete orphaned Sessions
7. Delete orphaned Accounts
8. Delete orphaned WaitlistEntries

**Usage:**
```bash
npm run db:repair-relations
```

**Expected Output:**
```
🔧 Repairing orphaned relations...

Repairing BehaviorEvents...
   ✅ Deleted 0 orphaned BehaviorEvents
Repairing InterviewEvents...
   ✅ Deleted 0 orphaned InterviewEvents
...

📊 Repair Summary
================

BehaviorEvent: 0 records deleted
InterviewEvent: 0 records deleted
...

Total records deleted: 0

✅ No orphaned records found. Database is clean.
```

---

## Storage Cleanup

### Storage Issues

Storage files can become orphaned due to:
- User deletion without file cleanup
- Failed uploads
- Manual file deletions
- Storage quota limits

### Cleanup Script

**File:** `scripts/data-integrity/cleanup-unused-storage.ts`

**Checks Performed:**
1. StorageFile records without corresponding User
2. StorageFile records with potentially missing actual files
3. Old files (> 30 days) for manual review

**Limitations:**
- Requires Supabase Storage client for actual file verification
- Currently only identifies orphaned database records
- Manual verification required for actual file cleanup

**Usage:**
```bash
npm run db:cleanup-storage
```

**Expected Output:**
```
🧹 Cleaning up unused storage...

Checking for orphaned StorageFile records...
   ✅ No orphaned StorageFile records
Checking for potentially missing files in storage...
   ℹ️  Found 0 StorageFile records
   ℹ️  Note: Actual file verification requires Supabase Storage client
   ℹ️  Run manual verification with Supabase admin tools

📊 Storage Cleanup Summary
=========================

Orphaned DB Records: 0
Records Cleaned: 0
Total Size Freed: 0.00 MB

✅ No orphaned storage records found.
```

---

## Data Integrity Validation

### Validation Checklist

- [ ] Run orphan detection: `npm run db:detect-orphans`
- [ ] Run duplicate detection: `npm run db:detect-duplicates`
- [ ] If orphans found, run repair: `npm run db:repair-relations`
- [ ] Run storage cleanup: `npm run db:cleanup-storage`
- [ ] Verify foreign key constraints
- [ ] Verify unique constraints
- [ ] Verify cascade delete rules

### Foreign Key Validation

```sql
-- Check all foreign keys
SELECT
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name,
    rc.delete_rule,
    rc.update_rule
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
JOIN information_schema.referential_constraints AS rc
    ON tc.constraint_name = rc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY' 
  AND tc.table_schema = 'public'
ORDER BY tc.table_name;
```

### Unique Constraint Validation

```sql
-- Check all unique constraints
SELECT
    tc.table_name,
    kcu.column_name,
    tc.constraint_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
WHERE tc.constraint_type = 'UNIQUE'
  AND tc.table_schema = 'public'
ORDER BY tc.table_name;
```

---

## Prevention Strategies

### Application-Level Prevention

1. **Use Prisma Transactions**
   ```typescript
   await prisma.$transaction(async (tx) => {
     const user = await tx.user.create({ data: userData });
     await tx.careerProfile.create({ data: { userId: user.id } });
   });
   ```

2. **Validate Foreign Keys Before Insert**
   ```typescript
   const userExists = await prisma.user.findUnique({ where: { id: userId } });
   if (!userExists) throw new Error('User not found');
   ```

3. **Implement Soft Delete**
   ```typescript
   await prisma.user.update({
     where: { id },
     data: { deletedAt: new Date() }
   });
   ```

### Database-Level Prevention

1. **Proper Cascade Rules**
   ```sql
   ALTER TABLE "ChildTable" 
   ADD CONSTRAINT "child_parent_fkey" 
   FOREIGN KEY ("parentId") REFERENCES "ParentTable"("id") 
   ON DELETE CASCADE ON UPDATE CASCADE;
   ```

2. **Triggers for Cleanup**
   ```sql
   CREATE OR REPLACE FUNCTION cleanup_user_files()
   RETURNS TRIGGER AS $$
   BEGIN
     DELETE FROM "StorageFile" WHERE "userId" = OLD.id;
     RETURN OLD;
   END;
   $$ LANGUAGE plpgsql;

   CREATE TRIGGER trigger_cleanup_user_files
   BEFORE DELETE ON "User"
   FOR EACH ROW EXECUTE FUNCTION cleanup_user_files();
   ```

3. **Check Constraints**
   ```sql
   ALTER TABLE "User" 
   ADD CONSTRAINT "user_email_valid" 
   CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');
   ```

---

## Monitoring and Alerts

### Automated Checks

Create a scheduled job to run integrity checks:

```typescript
// scripts/scheduled/integrity-check.ts
import { detectOrphans } from '../data-integrity/detect-orphans';
import { detectDuplicates } from '../data-integrity/detect-duplicates';

async function scheduledIntegrityCheck() {
  const orphans = await detectOrphans();
  const duplicates = await detectDuplicates();
  
  if (orphans.length > 0 || duplicates.length > 0) {
    // Send alert to monitoring system
    await sendAlert({
      severity: 'warning',
      message: 'Data integrity issues detected',
      details: { orphans, duplicates }
    });
  }
}

// Run daily
setInterval(scheduledIntegrityCheck, 24 * 60 * 60 * 1000);
```

### Metrics to Track

- Orphaned record count
- Duplicate record count
- Storage orphan count
- Foreign key violation count
- Unique constraint violation count

---

## Rollback Procedures

### If Repair Goes Wrong

1. **Restore from Backup**
   ```bash
   pg_restore -d trajectoire backup_file.dump
   ```

2. **Re-run Detection**
   ```bash
   npm run db:detect-orphans
   ```

3. **Manual Review**
   ```sql
   -- Check specific tables
   SELECT COUNT(*) FROM "BehaviorEvent" 
   WHERE "sessionId" NOT IN (SELECT id FROM "InterviewSession");
   ```

---

## Known Limitations

### Current Limitations

1. **No Database Connectivity**
   - Scripts cannot be executed in current environment
   - Validation requires actual database access

2. **Storage File Verification**
   - Requires Supabase Storage client
   - Currently only checks database records

3. **No Automated Scheduling**
   - Scripts must be run manually
   - No CI/CD integration

### Future Improvements

1. **Add CI/CD Integration**
   - Run integrity checks in pipeline
   - Block deployment if issues found

2. **Add Storage Client**
   - Integrate Supabase Storage SDK
   - Verify actual file existence

3. **Add Automated Repair**
   - Auto-repair non-critical orphans
   - Require approval for critical repairs

4. **Add Historical Tracking**
   - Log all integrity issues
   - Track repair history
   - Identify recurring issues

---

## Recommendations

### Immediate Actions

1. **Configure Database Access**
   - Set up test database for validation
   - Configure environment variables

2. **Run Integrity Checks**
   - Execute all scripts on test database
   - Verify no issues in current data

3. **Add to CI/CD**
   - Integrate integrity checks in pipeline
   - Run checks before deployments

### Short-term Improvements

1. **Add Monitoring**
   - Set up automated integrity checks
   - Configure alerts for issues

2. **Add Storage Integration**
   - Integrate Supabase Storage client
   - Verify actual file existence

3. **Add Scheduled Jobs**
   - Run daily integrity checks
   - Auto-repair non-critical issues

### Long-term Improvements

1. **Implement Soft Delete**
   - Add deletedAt columns
   - Implement cleanup jobs

2. **Add Audit Trail**
   - Track all data modifications
   - Log cascade operations

3. **Add Data Validation**
   - Implement check constraints
   - Add application-level validation

---

## Conclusion

### Status Summary

**Scripts Created:** ✅ Complete  
**Documentation:** ✅ Complete  
**Validation:** ⏳ Requires database access  
**Integration:** ⏳ Requires CI/CD setup  

### Readiness Assessment

**Integrity Tools:** ✅ Ready for deployment  
**Safety Features:** ✅ Production checks in place  
**Documentation:** ✅ Complete usage guide  
**Monitoring:** ⏳ Requires setup  

### Next Steps

1. **Configure database access** for validation
2. **Run integrity checks** on test database
3. **Integrate in CI/CD** pipeline
4. **Set up monitoring** and alerts
5. **Add storage client** for file verification

---

## Appendix

### Script Reference

| Script | Purpose | Safety | Usage |
|--------|---------|--------|-------|
| detect-orphans.ts | Detect orphaned records | Read-only | `npm run db:detect-orphans` |
| detect-duplicates.ts | Detect duplicate records | Read-only | `npm run db:detect-duplicates` |
| repair-relations.ts | Delete orphaned records | Destructive | `npm run db:repair-relations` |
| cleanup-unused-storage.ts | Cleanup storage files | Destructive | `npm run db:cleanup-storage` |

### Foreign Key Reference

| Table | Foreign Key | Referenced Table | Cascade Rule |
|-------|-------------|------------------|--------------|
| BehaviorEvent | sessionId | InterviewSession | CASCADE |
| InterviewEvent | sessionId | InterviewSession | CASCADE |
| CVAnalysis | userId | User | CASCADE |
| CareerProfile | userId | User | CASCADE |
| Subscription | userId | User | CASCADE |
| Session | userId | User | CASCADE |
| Account | userId | User | CASCADE |
| WaitlistEntry | userId | User | CASCADE |

### References

- [Prisma Transactions](https://www.prisma.io/docs/concepts/components/prisma-client/transactions)
- [PostgreSQL Foreign Keys](https://www.postgresql.org/docs/current/ddl-constraints.html)
- [Data Integrity Best Practices](https://www.postgresql.org/docs/current/ddl-constraints.html)
