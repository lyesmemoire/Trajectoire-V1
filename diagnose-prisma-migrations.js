import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function diagnosePrismaMigrations() {
  console.log('=== DIAGNOSTIC PRISMA MIGRATIONS ===\n');
  
  try {
    // Check _prisma_migrations structure
    console.log('=== STRUCTURE _prisma_migrations ===');
    const columns = await prisma.$queryRaw`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_schema = 'public'
      AND table_name = '_prisma_migrations'
      ORDER BY ordinal_position
    `;
    
    for (const col of columns) {
      console.log(`${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
    }
    
    // Check current data
    console.log('\n=== DONNÉES ACTUELLES ===');
    const migrations = await prisma.$queryRaw`
      SELECT * FROM _prisma_migrations
      ORDER BY migration_name
    `;
    
    for (const m of migrations) {
      console.log(`- ${m.migration_name}: checksum=${m.checksum}, steps=${m.applied_steps_count}`);
    }
    
    // Check if Prisma can read the table
    console.log('\n=== TEST LECTURE PRISMA ===');
    try {
      await prisma.$queryRaw`SELECT id, migration_name FROM _prisma_migrations LIMIT 1`;
      console.log('✅ Prisma peut lire _prisma_migrations');
    } catch (error) {
      console.log(`❌ Prisma ne peut pas lire: ${error.message}`);
    }
    
  } catch (error) {
    console.log(`❌ Erreur: ${error.message}`);
  }
  
  await prisma.$disconnect();
}

diagnosePrismaMigrations();
