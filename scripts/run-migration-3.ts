import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  try {
    await prisma.$executeRawUnsafe('DROP FUNCTION IF EXISTS public.process_stripe_payment(TEXT, UUID, INTEGER, INTEGER, TEXT);');
    console.log('Dropped process_stripe_payment');
  } catch (e: any) {
    console.error('Error:', e.message);
  }
  await prisma.$disconnect();
}

main();
