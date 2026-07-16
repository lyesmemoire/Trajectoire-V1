import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DIRECT_URL || process.env.DATABASE_URL
    }
  }
});

async function dropMigrationsTable() {
  console.log('=== DROP _prisma_migrations TABLE ===\n');
  
  try {
    console.log('Dropping _prisma_migrations table...');
    await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS "_prisma_migrations"`);
    console.log('✅ Table dropped');
    
    console.log('\nPrisma will recreate this table automatically on next migrate deploy');
    
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }
  
  await prisma.$disconnect();
}

dropMigrationsTable();
