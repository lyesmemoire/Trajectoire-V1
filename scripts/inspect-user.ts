import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const cols = await prisma.$queryRawUnsafe(`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'User'
    ORDER BY ordinal_position;
  `) as any[];
  
  console.log('=== User table columns ===');
  cols.forEach((c: any) => console.log(`  ${c.column_name} (${c.data_type})`));
}

main().finally(() => prisma.$disconnect());
