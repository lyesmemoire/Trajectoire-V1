/**
 * Terminate processes holding Prisma advisory locks
 * This requires superuser privileges
 */

import { PrismaClient } from '@prisma/client';

async function terminateLockHolders() {
  const prisma = new PrismaClient();

  try {
    console.log('Checking for processes holding advisory locks...');
    
    // Get processes holding the Prisma advisory lock
    const lockHolders = await prisma.$queryRaw`
      SELECT 
        pid,
        usename,
        application_name,
        state,
        query_start,
        state_change
      FROM pg_stat_activity
      WHERE pid IN (
        SELECT pid 
        FROM pg_locks 
        WHERE locktype = 'advisory' 
          AND objid = 72707369
      )
    `;
    
    console.log('Lock holders:', lockHolders);
    
    if (lockHolders && Array.isArray(lockHolders) && lockHolders.length > 0) {
      for (const holder of lockHolders) {
        console.log(`Attempting to terminate PID ${holder.pid} (${holder.application_name})...`);
        
        try {
          const result = await prisma.$queryRaw`
            SELECT pg_terminate_backend(${holder.pid}) as terminated
          `;
          console.log(`Termination result for PID ${holder.pid}:`, result);
        } catch (error) {
          console.error(`Failed to terminate PID ${holder.pid}:`, error);
        }
      }
    } else {
      console.log('No lock holders found');
    }
    
    // Check locks again after termination
    console.log('\nChecking locks after termination...');
    const remainingLocks = await prisma.$queryRaw`
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
    console.log('Remaining locks:', remainingLocks);
    
  } catch (error) {
    console.error('Error:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

terminateLockHolders();
