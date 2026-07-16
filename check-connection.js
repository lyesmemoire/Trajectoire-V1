import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkConnection() {
  console.log('=== VÉRIFICATION DE LA CONNEXION ===\n');
  
  try {
    // Test connection
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ Connexion à la base de données réussie');
    
    // Check migrations table
    const tableExists = await prisma.$queryRaw`
      SELECT COUNT(*) as count 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = '_prisma_migrations'
    `;
    console.log(`Table _prisma_migrations: ${tableExists[0].count > 0 ? '✅ EXISTS' : '❌ NOT EXISTS'}`);
    
    // Check applied migrations
    if (tableExists[0].count > 0) {
      const applied = await prisma.$queryRaw`
        SELECT migration_name, applied_steps_count, finished_at
        FROM _prisma_migrations
        ORDER BY migration_name
      `;
      console.log(`\nMigrations appliquées: ${applied.length}`);
      for (const migration of applied) {
        console.log(`  ✅ ${migration.migration_name} (${migration.applied_steps_count} steps)`);
      }
    }
    
    // Check public tables
    const tables = await prisma.$queryRaw`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `;
    console.log(`\nTables dans schema public: ${tables.length}`);
    for (const table of tables) {
      console.log(`  - ${table.table_name}`);
    }
    
  } catch (error) {
    console.log(`❌ Erreur de connexion: ${error.message}`);
  }
  
  await prisma.$disconnect();
}

checkConnection();
