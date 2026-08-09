/**
 * PHASE 7: Prisma Migration State
 * Check if _prisma_migrations table exists and its state
 */

import { PrismaClient } from '@prisma/client';

async function checkMigrationState() {
  const prisma = new PrismaClient();

  try {
    console.log('=== PHASE 7: PRISMA MIGRATION STATE ===\n');
    
    // Check if _prisma_migrations table exists
    console.log('=== _PRISMA_MIGRATIONS TABLE EXISTS ===');
    const migrationTableExists = await prisma.$queryRaw`
      SELECT EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_schema = 'public'
          AND table_name = '_prisma_migrations'
      ) as exists
    `;
    console.log('_prisma_migrations table exists:', migrationTableExists);
    
    const exists = migrationTableExists && Array.isArray(migrationTableExists) && migrationTableExists[0]?.exists === true;
    
    if (exists) {
      console.log('\n=== MIGRATION HISTORY ===');
      const migrations = await prisma.$queryRaw`
        SELECT
          migration_name,
          started_at,
          finished_at,
          applied_steps_count,
          rolled_back_at
        FROM _prisma_migrations
        ORDER BY started_at
      `;
      console.log('Migration history:', migrations);
    } else {
      console.log('\n=== MIGRATION HISTORY ===');
      console.log('MIGRATION HISTORY: MISSING');
      console.log('CONSEQUENCE: No migration history available. Database was initialized via db push instead of migrate.');
      console.log('IMPACT: Cannot use prisma migrate commands without migration history.');
      console.log('RECOMMENDATION: For production, consider creating a baseline migration or using migrate dev with shadow database.');
    }
    
    // Check local migrations directory
    console.log('\n=== LOCAL MIGRATIONS DIRECTORY ===');
    const fs = await import('fs');
    const path = await import('path');
    
    const migrationsDir = path.join(process.cwd(), 'prisma/migrations');
    const migrationsBackupDir = path.join(process.cwd(), 'prisma/migrations.backup');
    const initBaselineDir = path.join(process.cwd(), 'prisma/migrations/init_baseline');
    
    let localMigrations: string[] = [];
    let backupMigrations: string[] = [];
    let baselineMigrations: string[] = [];
    
    if (fs.existsSync(migrationsDir)) {
      localMigrations = fs.readdirSync(migrationsDir).filter((f: string) => 
        fs.statSync(path.join(migrationsDir, f)).isDirectory()
      );
    }
    
    if (fs.existsSync(migrationsBackupDir)) {
      backupMigrations = fs.readdirSync(migrationsBackupDir).filter((f: string) => 
        fs.statSync(path.join(migrationsBackupDir, f)).isDirectory()
      );
    }
    
    if (fs.existsSync(initBaselineDir)) {
      baselineMigrations = fs.readdirSync(initBaselineDir).filter((f: string) => 
        fs.statSync(path.join(initBaselineDir, f)).isDirectory()
      );
    }
    
    console.log('Local migrations:', localMigrations);
    console.log('Backup migrations:', backupMigrations);
    console.log('Baseline migrations:', baselineMigrations);
    
    const migrationState = {
      _prisma_migrations_exists: exists,
      migration_history: exists ? 'PRESENT' : 'MISSING',
      local_migrations_count: localMigrations.length,
      backup_migrations_count: backupMigrations.length,
      baseline_migrations_count: baselineMigrations.length,
      initialization_method: 'db push (no migration history)',
      status: exists ? 'PASS' : 'BLOCKED'
    };
    
    console.log('\n=== MIGRATION STATE SUMMARY ===');
    console.log(`_prisma_migrations exists: ${migrationState._prisma_migrations_exists ? '✅' : '❌'}`);
    console.log(`Migration history: ${migrationState.migration_history}`);
    console.log(`Initialization method: ${migrationState.initialization_method}`);
    console.log(`Status: ${migrationState.status}`);
    
    console.log('\n✅ PHASE 7 COMPLETE');
    
    return migrationState;
    
  } catch (error) {
    console.error('Error:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

checkMigrationState();
