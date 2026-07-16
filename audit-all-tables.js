import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function auditAllTables() {
  console.log('=== AUDIT COMPLET DES TABLES PUBLIC ===\n');
  
  try {
    const result = await prisma.$queryRaw`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `;
    
    console.log('Tables dans le schema public:');
    for (const row of result) {
      console.log(`- ${row.table_name}`);
    }
  } catch (error) {
    console.log(`ERROR: ${error.message}`);
  }
  
  await prisma.$disconnect();
}

auditAllTables();
