import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function auditTablesExist() {
  console.log('=== AUDIT DES TABLES EXISTANTES ===\n');
  
  const tables = [
    'profiles',
    'dashboard_summary',
    'interview_sessions',
    'cvs',
    'resumes',
    'ats_analyses',
    'credit_ledger',
    'transactions',
    'user_usage',
    'user_risk_scores',
    'user_devices',
    'premium_interview_sessions',
    'cv_embeddings'
  ];
  
  for (const table of tables) {
    try {
      const result = await prisma.$queryRawUnsafe(`
        SELECT COUNT(*) as count 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = '${table}'
      `);
      const exists = result[0].count > 0;
      console.log(`${table}: ${exists ? '✅ EXISTS' : '❌ NOT EXISTS'}`);
      
      if (exists) {
        // Try to count rows
        try {
          const countResult = await prisma.$queryRawUnsafe(`SELECT COUNT(*) as count FROM public."${table}"`);
          console.log(`  Rows: ${countResult[0].count}`);
        } catch (error) {
          console.log(`  Rows: ERROR - ${error.message}`);
        }
      }
    } catch (error) {
      console.log(`${table}: ERROR - ${error.message}`);
    }
  }
  
  await prisma.$disconnect();
}

auditTablesExist();
