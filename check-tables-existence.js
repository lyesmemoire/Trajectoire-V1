import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkTablesExistence() {
  console.log('=== VÉRIFICATION TABLES ===\n');
  
  try {
    // Toutes les tables public
    const allTables = await prisma.$queryRaw`
      SELECT tablename FROM pg_tables WHERE schemaname='public' ORDER BY tablename
    `;
    
    console.log(`Tables dans schema public: ${allTables.length}`);
    for (const table of allTables) {
      console.log(`  - ${table.tablename}`);
    }
    
    // Table _prisma_migrations spécifique
    const prismaMigrations = await prisma.$queryRaw`
      SELECT tablename FROM pg_tables WHERE tablename='_prisma_migrations'
    `;
    
    console.log(`\n_prisma_migrations existe: ${prismaMigrations.length > 0 ? 'YES' : 'NO'}`);
    if (prismaMigrations.length > 0) {
      console.log(`  tablename: ${prismaMigrations[0].tablename}`);
    }
    
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }
  
  await prisma.$disconnect();
}

checkTablesExistence();
