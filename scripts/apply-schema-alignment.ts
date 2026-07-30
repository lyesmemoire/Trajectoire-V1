import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
  const migrationPath = path.join(process.cwd(), 'supabase/migrations/20260730000004_schema_alignment.sql');
  const sql = fs.readFileSync(migrationPath, 'utf-8');

  // Split by statements (separated by semicolons at end of line, ignoring comments)
  const statements = sql
    .split(/;\s*\n/)
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'));

  console.log(`=== Applying migration: 20260730000004_schema_alignment ===`);
  console.log(`  Statements to execute: ${statements.length}\n`);

  for (let i = 0; i < statements.length; i++) {
    const stmt = statements[i] + ';';
    const label = stmt.substring(0, 70).replace(/\n/g, ' ');
    try {
      await prisma.$executeRawUnsafe(stmt);
      console.log(`  ✓ [${i + 1}/${statements.length}] ${label}...`);
    } catch (e: any) {
      const msg = e.message || '';
      // Some errors are expected (e.g., policy already exists)
      if (msg.includes('already exists')) {
        console.log(`  ⚠ [${i + 1}/${statements.length}] Already exists: ${label}...`);
      } else {
        console.log(`  ✗ [${i + 1}/${statements.length}] FAILED: ${msg.substring(0, 100)}`);
        console.log(`    Statement: ${stmt.substring(0, 200)}`);
      }
    }
  }

  console.log('\n=== Migration complete ===');

  // Verify
  console.log('\n=== Post-migration verification ===');
  
  // Check credit_usage.user_id type
  const cuCol = await prisma.$queryRawUnsafe(`
    SELECT data_type FROM information_schema.columns 
    WHERE table_name = 'credit_usage' AND column_name = 'user_id' AND table_schema = 'public'
  `) as any[];
  console.log(`  credit_usage.user_id type: ${cuCol[0]?.data_type || 'NOT FOUND'}`);

  // Check stripe_events.user_id type
  const seCol = await prisma.$queryRawUnsafe(`
    SELECT data_type FROM information_schema.columns 
    WHERE table_name = 'stripe_events' AND column_name = 'user_id' AND table_schema = 'public'
  `) as any[];
  console.log(`  stripe_events.user_id type: ${seCol[0]?.data_type || 'NOT FOUND'}`);

  // Check cv_rewrites exists
  const cvr = await prisma.$queryRawUnsafe(`
    SELECT COUNT(*)::int as cnt FROM information_schema.tables 
    WHERE table_name = 'cv_rewrites' AND table_schema = 'public'
  `) as any[];
  console.log(`  cv_rewrites table exists: ${cvr[0]?.cnt > 0 ? 'YES' : 'NO'}`);

  // Check RLS enabled
  const rlsTables = ['credit_transactions', 'credit_usage', 'stripe_events', 'idempotency', 'cv_rewrites'];
  for (const t of rlsTables) {
    const rls = await prisma.$queryRawUnsafe(`
      SELECT relrowsecurity FROM pg_class 
      WHERE relname = '${t}' AND relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
    `) as any[];
    console.log(`  ${t} RLS enabled: ${rls[0]?.relrowsecurity ? 'YES' : 'NO'}`);
  }

  // Check User.credits column
  const userCredits = await prisma.$queryRawUnsafe(`
    SELECT data_type, column_default FROM information_schema.columns 
    WHERE table_name = 'User' AND column_name = 'credits' AND table_schema = 'public'
  `) as any[];
  console.log(`  User.credits: type=${userCredits[0]?.data_type || 'NOT FOUND'}, default=${userCredits[0]?.column_default || 'NONE'}`);
}

main().finally(() => prisma.$disconnect());
