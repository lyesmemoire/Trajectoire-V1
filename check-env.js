import { readFileSync } from 'fs';

const env = readFileSync('.env', 'utf8');
const lines = env.split('\n');

console.log('=== VARIABLES ENVIRONNEMENT ===\n');
for (const line of lines) {
  if (line.startsWith('DATABASE_URL') || line.startsWith('DIRECT_URL')) {
    const [key, value] = line.split('=');
    if (value) {
      const masked = value.replace(/:[^:]+@/, ':****@');
      console.log(`${key}=${masked}`);
    }
  }
}
