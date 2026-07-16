import { createHash } from 'crypto';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

const migrationsDir = 'prisma/migrations';
const migrationFolders = readdirSync(migrationsDir).sort();

console.log('=== CALCUL DES CHECKSUMS SHA-256 ===\n');

for (const folder of migrationFolders) {
  const migrationFile = join(migrationsDir, folder, 'migration.sql');
  
  try {
    const content = readFileSync(migrationFile, 'utf8');
    const checksum = createHash('sha256').update(content).digest('hex');
    console.log(`${folder}: ${checksum}`);
  } catch (error) {
    console.log(`${folder}: ERROR - ${error.message}`);
  }
}
