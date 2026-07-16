import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DIRECT_URL || process.env.DATABASE_URL
    }
  }
});

async function recreateMigrationsTable() {
  console.log('=== RECÉATION DE _prisma_migrations AVEC BONS CHECKSUMS ===\n');
  
  try {
    // Drop existing table
    console.log('Dropping existing _prisma_migrations table...');
    await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS "_prisma_migrations"`);
    
    // Create table with correct structure
    console.log('Creating _prisma_migrations table...');
    await prisma.$executeRawUnsafe(`
      CREATE TABLE "_prisma_migrations" (
        "id" SERIAL PRIMARY KEY,
        "checksum" VARCHAR(255) NOT NULL,
        "finished_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "migration_name" VARCHAR(255) NOT NULL UNIQUE,
        "logs" TEXT,
        "rolled_back_at" TIMESTAMPTZ(3),
        "started_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "applied_steps_count" INTEGER NOT NULL DEFAULT 0
      )
    `);
    
    // Insert applied migrations with correct checksums
    const appliedMigrations = [
      { name: '20260703_init', checksum: '2d023e28b01e29f8bedf733d6dde690704cf77df7686f03db1498155be086e31', steps: 77 },
      { name: '20260703_add_missing_indexes', checksum: '12547745610c1f4318b11e5c220030fc37ca8c9dff2aa2adf3f883a9c357faf8', steps: 5 },
      { name: '20260703_complete_rls', checksum: 'b554fa84827aa17bf52f37c0df811d4c755fac52c99e8eb2499ebccbfbcb69dc', steps: 88 },
      { name: '20260703_fix_waitlist_fk', checksum: 'ee7c54c8aa5f2d5108725e5df1c94561d01e6e4a0f3bbb34372d74e0861a7745', steps: 2 }
    ];
    
    for (const migration of appliedMigrations) {
      console.log(`Inserting ${migration.name} with checksum ${migration.checksum.substring(0, 16)}...`);
      await prisma.$executeRawUnsafe(`
        INSERT INTO "_prisma_migrations" ("checksum", "migration_name", "applied_steps_count", "started_at", "finished_at")
        VALUES ('${migration.checksum}', '${migration.name}', ${migration.steps}, NOW(), NOW())
      `);
    }
    
    console.log('\n✅ _prisma_migrations table recreated with correct checksums');
    
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }
  
  await prisma.$disconnect();
}

recreateMigrationsTable();
