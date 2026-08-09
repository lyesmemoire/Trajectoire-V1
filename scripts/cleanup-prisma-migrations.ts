/**
 * Clean up _prisma_migrations table to resolve drift
 * This removes the inconsistent migration state
 */

import { PrismaClient } from '@prisma/client';

async function cleanupPrismaMigrations() {
  const prisma = new PrismaClient();

  try {
    console.log('=== CLEANING UP _PRISMA_MIGRATIONS TABLE ===\n');
    
    // Check if _prisma_migrations table exists
    const migrationTable = await prisma.$queryRaw`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_name = '_prisma_migrations'
    `;
    
    if (!migrationTable || !Array.isArray(migrationTable) || migrationTable.length === 0) {
      console.log('_prisma_migrations table does not exist');
      return;
    }
    
    console.log('_prisma_migrations table exists');
    
    // Check current migrations in database
    const currentMigrations = await prisma.$queryRaw`
      SELECT migration_name, started_at, finished_at, applied_steps_count
      FROM _prisma_migrations
      ORDER BY started_at
    `;
    console.log('Current migrations in database:', currentMigrations);
    
    // Drop the _prisma_migrations table
    console.log('\nDropping _prisma_migrations table...');
    await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS "public"."_prisma_migrations" CASCADE`);
    console.log('✅ Dropped _prisma_migrations table');
    
    // Verify cleanup
    const remainingMigrations = await prisma.$queryRaw`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_name = '_prisma_migrations'
    `;
    console.log('\nRemaining _prisma_migrations table:', remainingMigrations);
    
    console.log('\n✅ Prisma migrations cleanup complete');
    
  } catch (error) {
    console.error('Error:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

cleanupPrismaMigrations();
