import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkTables() {
  const tables = [
    'CareerProfile',
    'Journey',
    'CVAnalysis',
    'JobOffer',
    'OptimizedCV',
    'InterviewSession',
    'InterviewReport',
    'VoiceRecording'
  ];

  console.log('Checking tables in public schema...');
  console.log('');

  for (const table of tables) {
    try {
      const result = await prisma.$queryRaw`
        SELECT COUNT(*) as count 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = ${table}
      `;
      const exists = result[0].count > 0;
      
      if (exists) {
        const countResult = await prisma.$queryRawUnsafe(`SELECT COUNT(*) as count FROM "${table}"`);
        console.log(`${table}: ✅ EXISTS (${countResult[0].count} rows)`);
      } else {
        console.log(`${table}: ❌ NOT EXISTS`);
      }
    } catch (error) {
      console.log(`${table}: ❌ ERROR - ${error.message}`);
    }
  }

  await prisma.$disconnect();
}

checkTables();
