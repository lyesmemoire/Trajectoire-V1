import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkTableExists() {
  console.log('=== VÉRIFICATION TABLE _prisma_migrations ===\n');
  
  try {
    const result = await prisma.$queryRaw`
      SELECT COUNT(*) as count
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_name = '_prisma_migrations'
    `;
    
    console.log(`_prisma_migrations exists: ${result[0].count > 0 ? 'YES' : 'NO'}`);
    console.log(`Count: ${result[0].count}`);
    
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }
  
  await prisma.$disconnect();
}

checkTableExists();
