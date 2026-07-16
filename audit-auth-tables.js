import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function auditAuthTables() {
  console.log('=== AUDIT COMPLET DES TABLES AUTH ===\n');
  
  try {
    const result = await prisma.$queryRaw`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'auth'
      ORDER BY table_name
    `;
    
    console.log('Tables dans le schema auth:');
    for (const row of result) {
      console.log(`- ${row.table_name}`);
    }
  } catch (error) {
    console.log(`ERROR: ${error.message}`);
  }
  
  await prisma.$disconnect();
}

auditAuthTables();
