import { PrismaClient } from '@prisma/client';
import { readdirSync } from 'fs';

const prisma = new PrismaClient();

async function checkMigrationsStatus() {
  console.log('=== ÉTAT DES MIGRATIONS ===\n');
  
  // Get all migration folders
  const migrationsDir = 'prisma/migrations';
  const migrationFolders = readdirSync(migrationsDir).sort();
  
  console.log('Migrations disponibles:');
  for (const folder of migrationFolders) {
    console.log(`- ${folder}`);
  }
  
  console.log('\n=== MIGRATIONS APPLIQUÉES ===');
  try {
    const applied = await prisma.$queryRaw`
      SELECT migration_name, applied_steps_count, finished_at
      FROM _prisma_migrations
      ORDER BY migration_name
    `;
    
    if (applied.length === 0) {
      console.log('Aucune migration appliquée');
    } else {
      for (const migration of applied) {
        console.log(`✅ ${migration.migration_name} (${migration.applied_steps_count} steps)`);
      }
    }
  } catch (error) {
    console.log(`❌ Erreur: ${error.message}`);
  }
  
  console.log('\n=== MIGRATIONS NON APPLIQUÉES ===');
  try {
    const applied = await prisma.$queryRaw`
      SELECT migration_name
      FROM _prisma_migrations
    `;
    const appliedNames = applied.map(m => m.migration_name);
    const notApplied = migrationFolders.filter(f => !appliedNames.includes(f));
    
    if (notApplied.length === 0) {
      console.log('Toutes les migrations sont appliquées');
    } else {
      for (const folder of notApplied) {
        console.log(`❌ ${folder}`);
      }
    }
  } catch (error) {
    console.log(`❌ Erreur: ${error.message}`);
  }
  
  await prisma.$disconnect();
}

checkMigrationsStatus();
