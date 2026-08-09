/**
 * Release Prisma Advisory Lock
 * Manually releases the advisory lock that is blocking migrations
 */

import { PrismaClient } from '@prisma/client';

async function releaseLock() {
  const prisma = new PrismaClient();

  try {
    console.log('Attempting to release Prisma advisory lock...');
    
    // Try to release the specific Prisma advisory lock
    const result = await prisma.$queryRaw`
      SELECT pg_advisory_unlock(72707369) as released
    `;
    
    console.log('Lock release result:', result);
    
    if (result && Array.isArray(result) && result[0]) {
      const released = result[0].released;
      if (released === true) {
        console.log('✅ Advisory lock released successfully');
      } else {
        console.log('⚠️ Advisory lock was not held by this session');
        console.log('The lock may be held by another process or is stale');
      }
    }
    
    console.log('✅ Advisory lock release attempted');
    
  } catch (error) {
    console.error('Error releasing lock:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

releaseLock();
