import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();

async function main() {
  // Check for views
  console.log('=== VIEWS in public schema ===');
  const views = await p.$queryRawUnsafe(`
    SELECT table_name, view_definition 
    FROM information_schema.views 
    WHERE table_schema = 'public'
    ORDER BY table_name
  `) as any[];
  if (views.length === 0) console.log('  (none)');
  for (const v of views) {
    console.log(`  VIEW: ${v.table_name}`);
    console.log(`    DEF: ${(v.view_definition || '').substring(0, 200)}`);
  }

  // Row counts
  console.log('\n=== ROW COUNTS ===');
  const tables = ['User', 'credit_transactions', 'credit_usage', 'stripe_events', 'idempotency', 'CVAnalysis', 'InterviewSession', 'Subscription', 'CareerProfile', 'SimulationSession'];
  for (const t of tables) {
    try {
      const count = await p.$queryRawUnsafe(`SELECT COUNT(*)::int as cnt FROM public."${t}"`) as any[];
      console.log(`  ${t}: ${count[0].cnt} rows`);
    } catch (e: any) {
      console.log(`  ${t}: ERROR - ${e.message.substring(0, 60)}`);
    }
  }

  // Distinct user_ids in billing tables
  console.log('\n=== DISTINCT user_id VALUES ===');
  for (const t of ['credit_transactions', 'credit_usage', 'stripe_events']) {
    try {
      const vals = await p.$queryRawUnsafe(`SELECT DISTINCT user_id FROM public."${t}" LIMIT 5`) as any[];
      console.log(`  ${t}: ${vals.length} distinct values: ${vals.map((v: any) => v.user_id).join(', ')}`);
    } catch (e: any) {
      console.log(`  ${t}: ERROR - ${e.message.substring(0, 60)}`);
    }
  }

  // Check if profiles is an alias/synonym/view
  console.log('\n=== CHECK profiles existence ===');
  try {
    const res = await p.$queryRawUnsafe(`
      SELECT relname, relkind FROM pg_class 
      WHERE relname = 'profiles' 
      AND relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
    `) as any[];
    if (res.length === 0) {
      console.log('  profiles: DOES NOT EXIST (no table, view, or materialized view)');
    } else {
      for (const r of res) {
        const kind = r.relkind === 'r' ? 'TABLE' : r.relkind === 'v' ? 'VIEW' : r.relkind === 'm' ? 'MATVIEW' : r.relkind;
        console.log(`  profiles: EXISTS as ${kind}`);
      }
    }
  } catch (e: any) {
    console.log(`  profiles: CHECK ERROR - ${e.message.substring(0, 80)}`);
  }

  // Orphan check: credit_transactions.user_id not in User.id
  console.log('\n=== ORPHAN CHECK ===');
  try {
    const orphans = await p.$queryRawUnsafe(`
      SELECT ct.user_id, ct.id, ct.action 
      FROM credit_transactions ct 
      LEFT JOIN "User" u ON ct.user_id = u.id 
      WHERE u.id IS NULL
      LIMIT 10
    `) as any[];
    console.log(`  credit_transactions orphans: ${orphans.length}`);
    orphans.forEach((o: any) => console.log(`    user_id=${o.user_id} tx=${o.id}`));
  } catch (e: any) {
    console.log(`  orphan check error: ${e.message.substring(0, 80)}`);
  }
}

main().finally(() => p.$disconnect());
