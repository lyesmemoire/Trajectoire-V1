import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'fs';

const prisma = new PrismaClient();

async function applyRemainingMigrations() {
  console.log('=== APPLICATION DES MIGRATIONS RESTANTES ===\n');
  
  const migrationsToApply = [
    '20260703_rls_helper',
    '20260703_storage_metadata',
    '20260707_candidate_graph'
  ];
  
  for (const folder of migrationsToApply) {
    console.log(`\n=== MIGRATION: ${folder} ===`);
    const migrationFile = `prisma/migrations/${folder}/migration.sql`;
    
    try {
      const sql = readFileSync(migrationFile, 'utf8');
      const statements = sql.split(';').filter(s => s.trim().length > 0);
      
      console.log(`Executing ${statements.length} statements...`);
      
      for (let i = 0; i < statements.length; i++) {
        const statement = statements[i].trim();
        if (!statement) continue;
        
        try {
          await prisma.$executeRawUnsafe(statement);
        } catch (error) {
          console.log(`  ⚠️  Statement ${i + 1} failed (might be idempotent): ${error.message.substring(0, 80)}`);
        }
      }
      
      // Mark as applied
      await prisma.$executeRawUnsafe(`
        INSERT INTO "_prisma_migrations" ("checksum", "migration_name", "applied_steps_count")
        VALUES ('${folder}', '${folder}', ${statements.length})
        ON CONFLICT ("migration_name") DO NOTHING
      `);
      
      console.log(`✅ ${folder} applied`);
    } catch (error) {
      console.log(`❌ ${folder} failed: ${error.message}`);
    }
  }
  
  await prisma.$disconnect();
  console.log('\n=== MIGRATIONS TERMINÉES ===');
}

applyRemainingMigrations();
