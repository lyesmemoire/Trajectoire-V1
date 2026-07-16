import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'fs';
import { join } from 'path';

const prisma = new PrismaClient();

async function applyMigrationManual() {
  console.log('=== APPLICATION MANUELLE DE LA MIGRATION 20260703_init ===\n');
  
  const migrationFile = 'prisma/migrations/20260703_init/migration.sql';
  const sql = readFileSync(migrationFile, 'utf8');
  
  // Split SQL by semicolons and execute each statement
  const statements = sql.split(';').filter(s => s.trim().length > 0);
  
  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i].trim();
    if (!statement) continue;
    
    try {
      console.log(`Executing statement ${i + 1}/${statements.length}...`);
      await prisma.$executeRawUnsafe(statement);
      console.log(`✅ Statement ${i + 1} executed successfully`);
    } catch (error) {
      console.log(`❌ Statement ${i + 1} failed: ${error.message}`);
      console.log(`Statement: ${statement.substring(0, 100)}...`);
      // Continue with next statement
    }
  }
  
  await prisma.$disconnect();
  console.log('\n=== MIGRATION TERMINÉE ===');
}

applyMigrationManual();
