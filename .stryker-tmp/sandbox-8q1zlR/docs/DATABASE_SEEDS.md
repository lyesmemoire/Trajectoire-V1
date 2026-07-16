# Database Seeds Guide

## Overview

This project includes database seeding scripts to create reproducible test environments with realistic data.

## Available Seeds

### seed-dev
Development environment with comprehensive test data.

**Includes:**
- 14 users (Admin, Premium, Free, Recruiter, +10 test users)
- 2 career profiles
- 20 CV analyses
- 10 interview sessions
- 2 subscriptions
- 2 user behavior profiles
- 5 prediction snapshots
- 1 public challenge with 3 entries

**Usage:**
```bash
npm run db:seed:dev
```

### seed-test
Test environment with minimal data for E2E tests.

**Includes:**
- 4 users (Admin, Premium, Free, Recruiter)
- 2 career profiles
- 5 CV analyses
- 3 interview sessions
- 2 subscriptions

**Usage:**
```bash
npm run db:seed:test
```

### seed-demo
Demo environment with production-like data for showcases.

**Includes:**
- 20 users with diverse profiles
- 20 career profiles
- 50 CV analyses
- 25 interview sessions
- 10 subscriptions
- 20 behavior profiles
- 50 prediction snapshots
- 5 public challenges

**Usage:**
```bash
npm run db:seed:demo
```

## Running Seeds

### Prerequisites

1. **Database must be accessible:**
   ```bash
   # Check DATABASE_URL is set
   echo $DATABASE_URL
   ```

2. **Migrations must be applied:**
   ```bash
   npm run db:migrate
   ```

3. **Prisma client must be generated:**
   ```bash
   npx prisma generate
   ```

### Execution

```bash
# Development seed (cleans existing data)
npm run db:seed:dev

# Test seed (minimal data)
npm run db:seed:test

# Demo seed (production-like)
npm run db:seed:demo

# Generic seed (uses NODE_ENV)
npm run db:seed
```

## Seed Data Structure

### Users

| Email | Role | Plan | Purpose |
|-------|------|------|---------|
| admin@trajectoire.com | ADMIN_FOUNDER | EXPERT | Admin testing |
| premium@trajectoire.com | USER | PRO | Premium features testing |
| free@trajectoire.com | USER | FREE | Free tier testing |
| recruiter@trajectoire.com | USER | EXPERT | Recruiter features |
| user1-10@trajectoire.com | USER | MIXED | Load testing |

### Test Data Volumes

| Environment | Users | CVs | Interviews | Subscriptions |
|-------------|-------|-----|------------|---------------|
| Development | 14 | 20 | 10 | 2 |
| Test | 4 | 5 | 3 | 2 |
| Demo | 20 | 50 | 25 | 10 |

## Customizing Seeds

### Adding New Seed Data

Edit `prisma/seed.ts`:

```typescript
// Add your custom seed data
await prisma.customModel.create({
  data: {
    // your data
  },
});
```

### Environment-Specific Seeds

```typescript
if (process.env.NODE_ENV === 'development') {
  // Development-specific data
} else if (process.env.NODE_ENV === 'test') {
  // Test-specific data
} else if (process.env.NODE_ENV === 'production') {
  // Production-specific data
}
```

## Resetting Database

### Full Reset (Development Only)

```bash
# WARNING: This deletes all data
npx prisma migrate reset

# Re-seed
npm run db:seed:dev
```

### Partial Reset

```typescript
// In seed.ts, add cleanup for specific tables
await prisma.specificTable.deleteMany();
```

## Seed Validation

After running seeds, validate:

```bash
# Check user count
npx prisma studio

# Or use SQL
psql $DATABASE_URL -c "SELECT COUNT(*) FROM \"User\";"
```

## Troubleshooting

### Seed Fails

**Error:** Foreign key constraint violation

**Solution:** Ensure migrations are applied first:
```bash
npm run db:migrate
```

**Error:** Unique constraint violation

**Solution:** Clean existing data or use unique test data:
```typescript
const uniqueEmail = `test-${Date.now()}@example.com`;
```

### Seed Too Slow

**Optimization:** Use `createMany` for bulk inserts:
```typescript
await prisma.user.createMany({
  data: users,
  skipDuplicates: true,
});
```

## Best Practices

1. **Always run migrations before seeds**
2. **Use environment-specific seeds**
3. **Clean data in development, not in production**
4. **Use realistic data for demo environments**
5. **Document custom seed data**
6. **Version seed scripts with schema changes

## Security Notes

- **Never seed production with test credentials**
- **Use environment variables for sensitive data**
- **Rotate seeded passwords in production**
- **Audit seed data regularly**

## References

- [Prisma Seed Documentation](https://www.prisma.io/docs/guides/database/seed-database)
- [Database Migrations Guide](DATABASE_MIGRATIONS.md)
- [Migration Validation Checklist](MIGRATION_VALIDATION_CHECKLIST.md)
