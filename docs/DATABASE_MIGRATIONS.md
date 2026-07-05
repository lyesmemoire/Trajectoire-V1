# Database Migrations Guide

## Overview

This project uses Prisma Migrate for database schema versioning. All schema changes must be done through Prisma migrations, not manual SQL scripts.

## Migration Structure

```
prisma/
├── schema.prisma              # Single source of truth
└── migrations/
    ├── 20260703_init/
    │   └── migration.sql      # Initial schema
    ├── 20260703_add_missing_indexes/
    │   └── migration.sql      # Performance indexes
    ├── 20260703_fix_waitlist_fk/
    │   └── migration.sql      # Foreign key fix
    ├── 20260703_rls_helper/
    │   └── migration.sql      # RLS helper functions
    └── 20260703_storage_metadata/
        └── migration.sql      # Storage tracking table
```

## Development Workflow

### 1. Make Schema Changes

Edit `prisma/schema.prisma` to add/modify models:

```prisma
model Example {
  id    String @id @default(cuid())
  name  String
  value Int
}
```

### 2. Create Migration

```bash
# Create migration (without applying)
npx prisma migrate dev --create-only --name add_example_model

# Create and apply migration (dev only)
npx prisma migrate dev --name add_example_model
```

### 3. Generate Prisma Client

```bash
npx prisma generate
```

### 4. Test Locally

```bash
npm run typecheck
npm test
```

## Production Workflow

### 1. Create Migration in Dev

Always create migrations in development first:

```bash
npx prisma migrate dev --name add_example_model
```

### 2. Review Migration SQL

Check the generated SQL in `prisma/migrations/<timestamp>/migration.sql`:

```bash
cat prisma/migrations/20260703_add_example_model/migration.sql
```

### 3. Apply to Staging

```bash
# Set DATABASE_URL to staging
DATABASE_URL=postgresql://staging-db-url npx prisma migrate deploy
```

### 4. Test Staging

- Run application tests
- Verify data integrity
- Check performance

### 5. Apply to Production

```bash
# Set DATABASE_URL to production
DATABASE_URL=postgresql://prod-db-url npx prisma migrate deploy
```

### 6. Monitor

- Check application logs
- Monitor database performance
- Verify no errors

## Rollback Procedure

### Option 1: Manual Rollback (Recommended)

1. **Identify the migration to rollback:**
   ```bash
   npx prisma migrate status
   ```

2. **Create a rollback migration:**
   ```bash
   npx prisma migrate dev --create-only --name rollback_add_example_model
   ```

3. **Edit the rollback SQL manually:**
   ```sql
   -- Drop the table
   DROP TABLE IF EXISTS "public"."Example";
   ```

4. **Apply the rollback:**
   ```bash
   npx prisma migrate deploy
   ```

### Option 2: Prisma Resolve (Use with Caution)

```bash
# Mark migration as applied (if already applied manually)
npx prisma migrate resolve --applied "20260703_add_example_model"

# Mark migration as rolled back (if manually rolled back)
npx prisma migrate resolve --rolled-back "20260703_add_example_model"
```

### Option 3: Database Restore (Emergency)

If migration causes critical issues:

1. **Stop application**
2. **Restore from backup:**
   ```bash
   pg_restore -d your_database backup_file.dump
   ```
3. **Mark migration as rolled back:**
   ```bash
   npx prisma migrate resolve --rolled-back "20260703_add_example_model"
   ```
4. **Restart application**

## Migration Best Practices

### DO

- ✅ Always create migrations in development first
- ✅ Review generated SQL before applying to production
- ✅ Test migrations on staging environment
- ✅ Use descriptive migration names (e.g., `add_user_index` not `migration_1`)
- ✅ Keep migrations backward-compatible when possible
- ✅ Add indexes in separate migrations if they take time
- ✅ Document breaking changes in migration comments

### DON'T

- ❌ Never edit applied migrations
- ❌ Never apply migrations directly to production without testing
- ❌ Never use `DROP COLUMN` or `DROP TABLE` without data migration
- ❌ Never change migration filenames after creation
- ❌ Never skip migrations in production
- ❌ Never mix manual SQL with Prisma migrations

## Data Migrations

For complex data transformations:

### 1. Create Schema Migration First

```bash
npx prisma migrate dev --name add_new_field
```

### 2. Create Data Migration Script

Create `scripts/migrate-data.ts`:

```typescript
import prisma from '@/lib/prisma';

async function migrateData() {
  const users = await prisma.user.findMany();
  
  for (const user of users) {
    await prisma.user.update({
      where: { id: user.id },
      data: { newField: transform(user.oldField) }
    });
  }
}

migrateData()
  .then(() => console.log('Migration complete'))
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

### 3. Run Data Migration

```bash
npx ts-node scripts/migrate-data.ts
```

### 4. Verify and Commit

```bash
npm run typecheck
git add .
git commit -m "Add data migration for new field"
```

## Troubleshooting

### Migration Fails

**Error:** `P3006: Migration <name> failed to apply cleanly`

**Solution:**
1. Check the error message for specific issue
2. Manually fix the database state
3. Use `npx prisma migrate resolve` to mark as applied/rolled-back
4. Create a new migration to fix the issue

### Schema Drift

**Error:** `The database schema is not empty`

**Solution:**
```bash
# Reset database (DEVELOPMENT ONLY)
npx prisma migrate reset

# Or baseline existing schema
npx prisma db push
```

### Lock File Issues

**Error:** `Migration lock file exists`

**Solution:**
```bash
# Remove lock file
rm prisma/migrations/migration_lock.toml
```

## Current Migrations

| ID | Name | Date | Status |
|----|------|------|--------|
| 20260703_init | Initial Schema | 2026-07-03 | ✅ Applied |
| 20260703_add_missing_indexes | Add Missing Indexes | 2026-07-03 | ✅ Applied |
| 20260703_fix_waitlist_fk | Fix Waitlist FK | 2026-07-03 | ✅ Applied |
| 20260703_rls_helper | RLS Helper Functions | 2026-07-03 | ✅ Applied |
| 20260703_storage_metadata | Storage Metadata Table | 2026-07-03 | ✅ Applied |

## Deprecated Scripts

The following SQL scripts have been deprecated and moved to `deprecated/`:

- `supabase_schema.sql` - Replaced by Prisma migrations
- `migration_fix.sql` - Replaced by Prisma migrations
- `schema_mvp.sql` - Replaced by Prisma migrations
- `supabase/migrations/*` - Replaced by Prisma migrations
- `supabase/patches*.sql` - Replaced by Prisma migrations

## References

- [Prisma Migrate Documentation](https://www.prisma.io/docs/concepts/components/prisma-migrate)
- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
- [PostgreSQL Migration Best Practices](https://wiki.postgresql.org/wiki/Don%27t_Do_This)
