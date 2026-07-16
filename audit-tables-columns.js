import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function auditTableColumns() {
  console.log('=== AUDIT DES COLONNES DES TABLES EXISTANTES ===\n');
  
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
    console.log(`\n=== TABLE: ${table} ===`);
    try {
      const columns = await prisma.$queryRaw`
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = ${table}
        ORDER BY ordinal_position
      `;
      
      console.log('Column\tType\tNullable\tDefault');
      for (const col of columns) {
        console.log(`${col.column_name}\t${col.data_type}\t${col.is_nullable}\t${col.column_default || '-'}`);
      }
    } catch (error) {
      console.log(`ERROR: ${error.message}`);
    }
  }
  
  await prisma.$disconnect();
}

auditTableColumns();
