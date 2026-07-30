import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();

async function main() {
  // Get the actual function body of reserve_credits_atomic
  const funcs = ['reserve_credits_atomic', 'commit_credits_atomic', 'rollback_credits_atomic', 'add_credits_atomic', 'cleanup_expired_transactions'] as const;
  
  for (const fname of funcs) {
    const result = await p.$queryRawUnsafe(`
      SELECT prosrc FROM pg_proc WHERE proname = '${fname}'
    `) as any[];
    
    if (result.length > 0) {
      console.log(`\n${'='.repeat(60)}`);
      console.log(`=== ${fname} ===`);
      console.log(`${'='.repeat(60)}`);
      console.log(result[0].prosrc);
    } else {
      console.log(`\n--- ${fname}: NOT FOUND ---`);
    }
  }
}

main().finally(() => p.$disconnect());
