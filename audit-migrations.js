import { PrismaClient } from '@prisma/client';
import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';

const prisma = new PrismaClient();

async function auditMigrations() {
  console.log('=== PHASE 2 — AUDIT MIGRATIONS ===\n');
  
  const migrationsDir = 'prisma/migrations';
  const migrationFolders = readdirSync(migrationsDir);
  
  console.log('Migration\tAppliquée\tManquante\tCorrompue');
  
  for (const folder of migrationFolders) {
    const migrationFile = join(migrationsDir, folder, 'migration.sql');
    let isApplied = false;
    let isCorrupted = false;
    
    try {
      const result = await prisma.$queryRaw`
        SELECT COUNT(*) as count 
        FROM _prisma_migrations 
        WHERE migration_name = ${folder}
      `;
      isApplied = result[0].count > 0;
    } catch (error) {
      // Table _prisma_migrations might not exist
    }
    
    try {
      const content = readFileSync(migrationFile, 'utf8');
      if (!content || content.trim().length === 0) {
        isCorrupted = true;
      }
    } catch (error) {
      isCorrupted = true;
    }
    
    console.log(`${folder}\t${isApplied ? '✅' : '❌'}\t${!isApplied ? '✅' : '❌'}\t${isCorrupted ? '✅' : '❌'}`);
  }
  
  await prisma.$disconnect();
}

auditMigrations();
