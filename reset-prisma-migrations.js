import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function resetPrismaMigrations() {
  console.log('=== RESET PRISMA MIGRATIONS TABLE ===\n');
  
  try {
    // Drop the table to let Prisma recreate it with correct checksums
    console.log('Dropping _prisma_migrations table...');
    await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS "_prisma_migrations"`);
    console.log('✅ Table dropped');
    
    console.log('\nPrisma will recreate this table with correct checksums on next migrate deploy');
    
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }
  
  await prisma.$disconnect();
}

resetPrismaMigrations();
