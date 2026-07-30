import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // List all tables in public schema
  const tables = await prisma.$queryRawUnsafe(`
    SELECT table_name FROM information_schema.tables 
    WHERE table_schema = 'public' 
    ORDER BY table_name;
  `) as any[];
  
  console.log('=== Tables in public schema ===');
  tables.forEach((t: any) => console.log(' ', t.table_name));

  // Check if profiles or User table has a credits column
  console.log('\n=== Columns with "credit" in name ===');
  const creditCols = await prisma.$queryRawUnsafe(`
    SELECT table_name, column_name, data_type 
    FROM information_schema.columns 
    WHERE table_schema = 'public' AND column_name ILIKE '%credit%'
    ORDER BY table_name;
  `) as any[];
  creditCols.forEach((c: any) => console.log(`  ${c.table_name}.${c.column_name} (${c.data_type})`));

  // Check existing functions
  console.log('\n=== Functions matching "credit" or "stripe" ===');
  const funcs = await prisma.$queryRawUnsafe(`
    SELECT routine_name FROM information_schema.routines 
    WHERE routine_schema = 'public' 
    AND (routine_name ILIKE '%credit%' OR routine_name ILIKE '%stripe%')
    ORDER BY routine_name;
  `) as any[];
  funcs.forEach((f: any) => console.log('  ', f.routine_name));
}

main().finally(() => prisma.$disconnect());
