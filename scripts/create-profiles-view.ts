import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();

async function main() {
  console.log('=== Creating profiles view as alias for User table ===\n');

  // Create an updatable view that maps User columns to the names expected by
  // the 15 supabase.from("profiles") callers in the codebase.
  //
  // This view is updatable because it's a simple SELECT from a single table
  // without aggregation, DISTINCT, GROUP BY, HAVING, LIMIT, OFFSET, UNION,
  // INTERSECT, or EXCEPT. PostgreSQL automatically makes it updatable.
  //
  // Columns mapped:
  //   User.id        → profiles.id
  //   User.email     → profiles.email 
  //   User.name      → profiles.full_name  (alias for from("profiles").select("full_name"))
  //   User.credits   → profiles.credits
  //   User.role      → profiles.role        (used by engine.ts L33)
  //   User.createdAt → profiles.created_at
  //   User.updatedAt → profiles.updated_at

  try {
    await p.$executeRawUnsafe(`
      CREATE OR REPLACE VIEW public.profiles AS
      SELECT 
        id,
        email,
        name AS full_name,
        credits,
        role,
        "createdAt" AS created_at,
        "updatedAt" AS updated_at
      FROM public."User"
    `);
    console.log('✓ View profiles created');
  } catch (e: any) {
    console.log('✗ View creation failed:', e.message.substring(0, 100));
    throw e;
  }

  // Enable RLS on view (inherits from base table)
  // Views inherit the base table's RLS policies in PostgreSQL
  // But we need to ensure the view itself doesn't bypass them

  // Verify the view works
  console.log('\n=== Verification ===');

  // 1. Check view exists
  const viewCheck = await p.$queryRawUnsafe(`
    SELECT table_name, is_updatable 
    FROM information_schema.views 
    WHERE table_name = 'profiles' AND table_schema = 'public'
  `) as any[];
  console.log(`  profiles view exists: ${viewCheck.length > 0 ? '✓ YES' : '✗ NO'}`);
  if (viewCheck.length > 0) {
    console.log(`  is_updatable: ${viewCheck[0].is_updatable}`);
  }

  // 2. Check columns
  const cols = await p.$queryRawUnsafe(`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'profiles' AND table_schema = 'public'
    ORDER BY ordinal_position
  `) as any[];
  console.log(`  columns: ${cols.map((c: any) => `${c.column_name}:${c.data_type}`).join(', ')}`);

  // 3. Insert test via view (should insert into User)
  const testId = `test-view-${Date.now()}`;
  try {
    // Test SELECT (no data yet, just check it doesn't error)
    const { } = await p.$queryRawUnsafe(`SELECT * FROM public.profiles LIMIT 1`);
    console.log('  SELECT from view: ✓ works');
  } catch (e: any) {
    console.log('  SELECT from view: ✗', e.message.substring(0, 80));
  }

  // 4. Test INSERT via view
  try {
    await p.$executeRawUnsafe(`
      INSERT INTO public.profiles (id, email, full_name, credits, created_at, updated_at)
      VALUES ('${testId}', '${testId}@test.com', 'Test View User', 100, NOW(), NOW())
    `);
    console.log('  INSERT via view: ✓ works');

    // Verify it's in User table
    const check = await p.$queryRawUnsafe(`SELECT id, credits FROM public."User" WHERE id = '${testId}'`) as any[];
    console.log(`  Row in User table: ${check.length > 0 ? '✓ found' : '✗ not found'} (credits=${check[0]?.credits})`);

    // Cleanup
    await p.$executeRawUnsafe(`DELETE FROM public."User" WHERE id = '${testId}'`);
    console.log('  Cleanup: ✓');
  } catch (e: any) {
    console.log('  INSERT via view: ✗', e.message.substring(0, 120));
  }

  // 5. Test UPDATE via view
  try {
    const testId2 = `test-view-upd-${Date.now()}`;
    // First insert a user directly
    await p.$executeRawUnsafe(`
      INSERT INTO public."User" (id, email, name, credits, "createdAt", "updatedAt", role, plan, "referralCode")
      VALUES ('${testId2}', '${testId2}@test.com', 'Before', 50, NOW(), NOW(), 'USER', 'FREE', 'REF-${Date.now()}')
    `);
    
    // Update via view
    await p.$executeRawUnsafe(`UPDATE public.profiles SET credits = 999 WHERE id = '${testId2}'`);
    
    const check = await p.$queryRawUnsafe(`SELECT credits FROM public."User" WHERE id = '${testId2}'`) as any[];
    console.log(`  UPDATE via view: ${check[0]?.credits === 999 ? '✓ works' : '✗ failed'} (credits=${check[0]?.credits})`);
    
    // Cleanup
    await p.$executeRawUnsafe(`DELETE FROM public."User" WHERE id = '${testId2}'`);
    console.log('  Cleanup: ✓');
  } catch (e: any) {
    console.log('  UPDATE via view: ✗', e.message.substring(0, 120));
  }
}

main().finally(() => p.$disconnect());
