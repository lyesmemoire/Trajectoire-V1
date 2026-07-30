import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Drop the old UUID-signature functions that conflict
  console.log('Dropping old UUID-based function signatures...');
  
  await prisma.$executeRawUnsafe(`DROP FUNCTION IF EXISTS public.add_credits_atomic(UUID, INTEGER, TEXT, TEXT);`);
  await prisma.$executeRawUnsafe(`DROP FUNCTION IF EXISTS public.add_credits_atomic(UUID, INTEGER);`);
  await prisma.$executeRawUnsafe(`DROP FUNCTION IF EXISTS public.reserve_credits_atomic(UUID, INTEGER, TEXT, TEXT);`);
  
  console.log('✓ Old UUID functions dropped');
}

main().finally(() => prisma.$disconnect());
