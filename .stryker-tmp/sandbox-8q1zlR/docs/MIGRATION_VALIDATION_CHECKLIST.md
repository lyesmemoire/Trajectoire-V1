# Migration Validation Checklist

## Pre-Flight Checks

- [ ] Database is accessible (DATABASE_URL configured)
- [ ] Database backup created (production only)
- [ ] Schema changes reviewed
- [ ] Migration SQL reviewed
- [ ] Tests pass locally

## Migration Validation Steps

### 1. Schema Validation

```bash
# Check migration status
npx prisma migrate status

# Expected output: All migrations applied
```

### 2. Schema Diff Validation

```bash
# Compare schema with database
npx prisma migrate diff \
  --from-schema-datasource prisma \
  --to-schema-datamodel prisma/schema.prisma \
  --script

# Expected output: Empty (no differences)
```

### 3. Client Generation

```bash
# Generate Prisma Client
npx prisma generate

# Expected output: Success, no errors
```

### 4. Type Checking

```bash
# Run TypeScript type check
npm run typecheck

# Expected output: No errors
```

### 5. Application Tests

```bash
# Run unit tests
npm test

# Run integration tests (if available)
npm run test:integration

# Expected output: All tests pass
```

### 6. Data Integrity Check

```sql
-- Check all tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';

-- Expected: All Prisma models present

-- Check all indexes exist
SELECT indexname, tablename 
FROM pg_indexes 
WHERE schemaname = 'public';

-- Expected: All indexes from migrations present

-- Check foreign keys
SELECT
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY';

-- Expected: All foreign keys from migrations present
```

### 7. Performance Validation

```sql
-- Check index usage
SELECT schemaname, tablename, indexname, idx_scan 
FROM pg_stat_user_indexes 
WHERE schemaname = 'public'
ORDER BY idx_scan;

-- Expected: Indexes are being used (idx_scan > 0 for active indexes)
```

## Migration-Specific Validation

### 20260703_init

- [ ] All 21 models created
- [ ] All enums created (UserRole, Plan)
- [ ] All foreign keys created
- [ ] All indexes created
- [ ] Schema matches prisma/schema.prisma

### 20260703_add_missing_indexes

- [ ] CVAnalysis_userId_idx exists
- [ ] InterviewEvent_sessionId_idx exists
- [ ] Subscription_stripeCustomerId_idx exists
- [ ] Subscription_stripeSubId_idx exists

### 20260703_fix_waitlist_fk

- [ ] WaitlistEntry_userId_fkey has ON DELETE CASCADE
- [ ] No orphaned WaitlistEntry records

### 20260703_rls_helper

- [ ] Function is_admin() exists
- [ ] Function is_owner(text) exists
- [ ] Function current_user_id() exists
- [ ] Functions have execute permissions

### 20260703_storage_metadata

- [ ] StorageFile table exists
- [ ] StorageFile_userId_idx exists
- [ ] StorageFile_bucket_idx exists
- [ ] StorageFile_path_idx exists
- [ ] StorageFile_bucket_path_key unique constraint exists

## Rollback Validation

### Test Rollback Procedure

1. **Create test migration:**
   ```bash
   npx prisma migrate dev --create-only --name test_rollback
   ```

2. **Apply test migration:**
   ```bash
   npx prisma migrate deploy
   ```

3. **Verify test migration applied:**
   ```bash
   npx prisma migrate status
   ```

4. **Rollback test migration:**
   ```bash
   npx prisma migrate resolve --rolled-back "test_rollback"
   ```

5. **Verify rollback:**
   ```bash
   npx prisma migrate status
   ```

## Current Status

⚠️ **Note:** Full end-to-end validation requires database connectivity. 

The following validations have been completed:
- ✅ Migration files created
- ✅ Migration SQL syntax validated
- ✅ Prisma client generated successfully
- ✅ TypeScript type checking passed
- ✅ Code references updated

The following validations require database access:
- ⏳ Migration status check
- ⏳ Schema diff validation
- ⏳ Data integrity checks
- ⏳ Performance validation
- ⏳ Rollback procedure test

## Next Steps for Full Validation

1. **Configure DATABASE_URL** for target environment
2. **Run migration status check:** `npx prisma migrate status`
3. **Apply migrations if needed:** `npx prisma migrate deploy`
4. **Run schema diff validation**
5. **Execute data integrity checks**
6. **Test rollback procedure**

## Known Limitations

- Database connection not available in current environment
- Supabase connection requires valid credentials
- Some validations require production-like data
- Performance validation requires active query load
