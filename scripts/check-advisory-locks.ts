/**
 * Check and release all Prisma advisory locks
 */

import { PrismaClient } from '@prisma/client';

async function checkAndReleaseLocks() {
  const prisma = new PrismaClient();

  try {
    console.log('Checking for advisory locks...');
    
    // Check all advisory locks
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
      ORDER BY pid
    `;
    
    console.log('Advisory locks found:', locks);
    
    if (locks && Array.isArray(locks) && locks.length > 0) {
      console.log(`Found ${locks.length} advisory lock(s)`);
      
      for (const lock of locks) {
        console.log(`Lock: classid=${lock.classid}, objid=${lock.objid}, pid=${lock.pid}, mode=${lock.mode}, granted=${lock.granted}`);
        
        // Try to release each lock
        try {
          const result = await prisma.$queryRaw`
            SELECT pg_advisory_unlock(${lock.classid}, ${lock.objid}) as released
          `;
          console.log(`Release result for lock ${lock.classid}/${lock.objid}:`, result);
        } catch (error) {
          console.error(`Failed to release lock ${lock.classid}/${lock.objid}:`, error);
        }
      }
    } else {
      console.log('No advisory locks found');
    }
    
    // Try to release the specific Prisma lock
    console.log('\nTrying to release Prisma lock 72707369...');
    const prismaLockResult = await prisma.$queryRaw`
      SELECT pg_advisory_unlock(72707369) as released
    `;
    console.log('Prisma lock release result:', prismaLockResult);
    
  } catch (error) {
    console.error('Error:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

checkAndReleaseLocks();
