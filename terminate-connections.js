import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function terminateConnections() {
  console.log('=== TERMINATION DES CONNEXIONS ACTIVES ===\n');
  
  try {
    // Terminate all connections except the current one
    const result = await prisma.$queryRawUnsafe(`
      SELECT pg_terminate_backend(pid)
      FROM pg_stat_activity
      WHERE datname = current_database()
      AND pid <> pg_backend_pid()
      AND state != 'idle'
    `);
    
    console.log(`✅ ${result.length} connexions terminées`);
    
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }
  
  await prisma.$disconnect();
}

terminateConnections();
