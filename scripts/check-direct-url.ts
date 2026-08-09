/**
 * Check if we can use DIRECT_URL for direct connection
 */

import { PrismaClient } from '@prisma/client';

async function checkDirectUrl() {
  const directUrl = process.env.DIRECT_URL;
  
  console.log('DATABASE_URL:', process.env.DATABASE_URL?.replace(/:[^:]+@/, ':***@'));
  console.log('DIRECT_URL:', directUrl?.replace(/:[^:]+@/, ':***@'));
  
  if (!directUrl) {
    console.log('DIRECT_URL not set');
    return;
  }
  
  // Try to connect with DIRECT_URL
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: directUrl
      }
    }
  });
  
  try {
    console.log('\nTesting connection with DIRECT_URL...');
    const result = await prisma.$queryRaw`SELECT current_database(), current_user()`;
    console.log('Connection successful:', result);
    
    // Check for advisory locks
    const locks = await prisma.$queryRaw`
      SELECT 
        locktype,
        classid,
        objid,
        pid,
        mode,
        granted
      FROM pg_locks
      WHERE locktype = 'advisory'
        AND objid = 72707369
    `;
    console.log('Advisory locks with DIRECT_URL:', locks);
    
  } catch (error) {
    console.error('Error with DIRECT_URL:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDirectUrl();
