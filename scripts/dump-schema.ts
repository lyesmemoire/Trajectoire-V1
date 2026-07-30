import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();

async function main() {
  // 1. All tables with columns
  const cols = await p.$queryRawUnsafe(`
    SELECT c.table_name, c.column_name, c.data_type, c.is_nullable, 
           COALESCE(SUBSTRING(c.column_default, 1, 60), 'NONE') as col_default
    FROM information_schema.columns c
    WHERE c.table_schema = 'public' 
    ORDER BY c.table_name, c.ordinal_position
  `) as any[];
  
  let currentTable = '';
  for (const c of cols) {
    if (c.table_name !== currentTable) {
      currentTable = c.table_name;
      console.log(`\n=== ${currentTable} ===`);
    }
    console.log(`  ${c.column_name} | ${c.data_type} | null:${c.is_nullable} | default:${c.col_default}`);
  }

  // 2. All functions
  console.log('\n\n=== FUNCTIONS ===');
  const funcs = await p.$queryRawUnsafe(`
    SELECT r.routine_name
    FROM information_schema.routines r
    WHERE r.routine_schema = 'public' AND r.routine_type = 'FUNCTION'
    ORDER BY r.routine_name
  `) as any[];
  for (const f of funcs) {
    console.log(`  ${f.routine_name}`);
  }

  // 3. All enums
  console.log('\n\n=== ENUMS ===');
  const enums = await p.$queryRawUnsafe(`
    SELECT t.typname, STRING_AGG(e.enumlabel, ', ' ORDER BY e.enumsortorder) as vals
    FROM pg_type t
    JOIN pg_enum e ON t.oid = e.enumtypid
    WHERE t.typnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
    GROUP BY t.typname
    ORDER BY t.typname
  `) as any[];
  for (const en of enums) {
    console.log(`  ${en.typname}: ${en.vals}`);
  }

  // 4. Unique constraints
  console.log('\n\n=== UNIQUE CONSTRAINTS ===');
  const uniques = await p.$queryRawUnsafe(`
    SELECT tc.table_name, tc.constraint_name, 
           STRING_AGG(kcu.column_name, ', ') as cols
    FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu 
      ON tc.constraint_name = kcu.constraint_name AND tc.table_schema = kcu.table_schema
    WHERE tc.constraint_type = 'UNIQUE' AND tc.table_schema = 'public'
    GROUP BY tc.table_name, tc.constraint_name
    ORDER BY tc.table_name
  `) as any[];
  for (const u of uniques) {
    console.log(`  ${u.table_name} | ${u.constraint_name} | (${u.cols})`);
  }

  // 5. RLS
  console.log('\n\n=== RLS POLICIES ===');
  const rls = await p.$queryRawUnsafe(`
    SELECT tablename, policyname, cmd, roles::text 
    FROM pg_policies WHERE schemaname = 'public' ORDER BY tablename
  `) as any[];
  if (rls.length === 0) console.log('  (none)');
  for (const r of rls) {
    console.log(`  ${r.tablename} | ${r.policyname} | ${r.cmd} | ${r.roles}`);
  }
}

main().finally(() => p.$disconnect());
