import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
  const sql = fs.readFileSync(path.join(process.cwd(), 'supabase/migrations/20260730000002_billing_fixes.sql'), 'utf-8');
  const statements = sql.split(/;(?=\s*$|\s*CREATE|\s*DROP|\s*DO|\s*--)/g).filter(s => s.trim().length > 0);
  
  for (const statement of statements) {
    if (statement.trim()) {
      console.log('Executing:', statement.substring(0, 50) + '...');
      try {
        await prisma.$executeRawUnsafe(statement + ';');
      } catch (err: any) {
        console.error('Error executing statement:', err.message);
      }
    }
  }
  console.log('Migration completed.');
}

main().finally(() => prisma.$disconnect());
