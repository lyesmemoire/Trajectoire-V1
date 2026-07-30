import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();

async function main() {
  const result = await p.$queryRawUnsafe(`
    SELECT definition 
    FROM pg_views 
    WHERE viewname = 'profiles';
  `) as any[];
  console.log(result);
}

main().finally(() => p.$disconnect());
