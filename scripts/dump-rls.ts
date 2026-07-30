import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();

async function main() {
  const policies = await p.$queryRawUnsafe(`
    SELECT tablename, policyname, permissive, roles, cmd, qual, with_check 
    FROM pg_policies 
    WHERE schemaname = 'public'
    ORDER BY tablename, policyname;
  `) as any[];
  
  console.log("=== RLS Policies ===");
  policies.forEach(p => {
    console.log(`Table: ${p.tablename} | Policy: ${p.policyname} | Cmd: ${p.cmd}`);
    console.log(`  Roles: ${p.roles}`);
    console.log(`  USING: ${p.qual}`);
    console.log(`  WITH CHECK: ${p.with_check}`);
    console.log('---');
  });
}

main().finally(() => p.$disconnect());
