import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DIRECT_URL || process.env.DATABASE_URL
    }
  }
});

async function listTablesDetailed() {
  console.log('=== TABLES POSTGRESQL RÉELLES ===\n');
  
  try {
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema='public' 
      ORDER BY table_name
    `;
    
    console.log(`Nombre de tables: ${tables.length}\n`);
    console.log('Liste des tables:');
    for (const table of tables) {
      console.log(`  - ${table.table_name}`);
    }
    
    console.log('\n=== VÉRIFICATION TABLES SPÉCIFIQUES ===\n');
    
    const specificTables = ['StorageFile', 'candidate_graphs', 'candidate_graph_snapshots'];
    for (const tableName of specificTables) {
      const exists = await prisma.$queryRaw`
        SELECT COUNT(*) as count 
        FROM information_schema.tables 
        WHERE table_schema='public' 
        AND table_name = ${tableName}
      `;
      console.log(`${tableName}: ${exists[0].count > 0 ? 'EXISTS' : 'ABSENT'}`);
    }
    
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }
  
  await prisma.$disconnect();
}

listTablesDetailed();
