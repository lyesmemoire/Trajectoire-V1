import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();

async function main() {
  console.log('=== Fixing remaining schema alignment items ===\n');

  // 1. Create cv_rewrites table
  try {
    await p.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS public.cv_rewrites (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id TEXT NOT NULL,
        idempotency_key TEXT UNIQUE NOT NULL,
        action TEXT NOT NULL,
        original_content TEXT NOT NULL,
        rewritten_content TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        expires_at TIMESTAMPTZ NOT NULL
      )
    `);
    console.log('✓ cv_rewrites table created');
  } catch (e: any) {
    console.log('⚠ cv_rewrites:', e.message.substring(0, 80));
  }

  // 2. Indexes on cv_rewrites
  try {
    await p.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS idx_cv_rewrites_user_id ON public.cv_rewrites (user_id)`);
    await p.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS idx_cv_rewrites_expires_at ON public.cv_rewrites (expires_at)`);
    console.log('✓ cv_rewrites indexes created');
  } catch (e: any) {
    console.log('⚠ indexes:', e.message.substring(0, 80));
  }

  // 3. Enable RLS on all billing tables
  const tables = ['credit_transactions', 'credit_usage', 'stripe_events', 'idempotency', 'cv_rewrites'];
  for (const t of tables) {
    try {
      await p.$executeRawUnsafe(`ALTER TABLE public."${t}" ENABLE ROW LEVEL SECURITY`);
      console.log(`✓ RLS enabled on ${t}`);
    } catch (e: any) {
      console.log(`⚠ RLS ${t}: ${e.message.substring(0, 80)}`);
    }
  }

  // 4. Create RLS policy on cv_rewrites (others already created)
  try {
    await p.$executeRawUnsafe(`
      CREATE POLICY "Service can manage cv rewrites" ON public.cv_rewrites
      FOR ALL USING (true) WITH CHECK (true)
    `);
    console.log('✓ RLS policy on cv_rewrites');
  } catch (e: any) {
    if (e.message?.includes('already exists')) {
      console.log('⚠ cv_rewrites policy already exists');
    } else {
      console.log('⚠ policy:', e.message.substring(0, 80));
    }
  }

  // 5. Verification
  console.log('\n=== Verification ===');
  for (const t of tables) {
    const rls = await p.$queryRawUnsafe(`
      SELECT relrowsecurity FROM pg_class 
      WHERE relname = '${t}' AND relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
    `) as any[];
    console.log(`  ${t} RLS: ${rls[0]?.relrowsecurity ? '✓ ON' : '✗ OFF'}`);
  }

  const cvr = await p.$queryRawUnsafe(`
    SELECT COUNT(*)::int as cnt FROM information_schema.tables 
    WHERE table_name = 'cv_rewrites' AND table_schema = 'public'
  `) as any[];
  console.log(`  cv_rewrites exists: ${cvr[0]?.cnt > 0 ? '✓ YES' : '✗ NO'}`);

  const cuType = await p.$queryRawUnsafe(`
    SELECT data_type FROM information_schema.columns 
    WHERE table_name = 'credit_usage' AND column_name = 'user_id' AND table_schema = 'public'
  `) as any[];
  console.log(`  credit_usage.user_id: ${cuType[0]?.data_type}`);

  const seType = await p.$queryRawUnsafe(`
    SELECT data_type FROM information_schema.columns 
    WHERE table_name = 'stripe_events' AND column_name = 'user_id' AND table_schema = 'public'
  `) as any[];
  console.log(`  stripe_events.user_id: ${seType[0]?.data_type}`);
}

main().finally(() => p.$disconnect());
