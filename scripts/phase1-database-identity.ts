/**
 * PHASE 1: Database Identity Verification (READ-ONLY)
 * Verify database connection and identity
 */

import { PrismaClient } from '@prisma/client';

async function verifyDatabaseIdentity() {
  const prisma = new PrismaClient();

  try {
    console.log('=== PHASE 1: DATABASE IDENTITY VERIFICATION ===\n');
    
    // Get database identity
    const identity = await prisma.$queryRaw`
      SELECT
        current_database() as database,
        current_user as user,
        current_schema() as schema,
        version() as version
    `;
    console.log('Database Identity:', identity);
    
    // Get connection info
    const databaseUrl = process.env.DATABASE_URL;
    const directUrl = process.env.DIRECT_URL;
    
    console.log('\n=== CONNECTION STRINGS (MASKED) ===');
    console.log('DATABASE_URL host:', databaseUrl?.match(/@([^:]+):/)?.[1] || 'not parsed');
    console.log('DIRECT_URL host:', directUrl?.match(/@([^:]+):/)?.[1] || 'not parsed');
    
    // Extract Supabase project reference from DATABASE_URL
    const projectRef = databaseUrl?.match(/postgres\.([^@]+)@/)?.[1];
    console.log('\nSupabase Project Reference:', projectRef || 'not found');
    
    // Verify connection is working
    const connectionTest = await prisma.$queryRaw`SELECT 1 as connected`;
    console.log('\nConnection Test:', connectionTest);
    
    console.log('\n✅ PHASE 1 COMPLETE');
    
    return {
      identity,
      databaseUrlHost: databaseUrl?.match(/@([^:]+):/)?.[1],
      directUrlHost: directUrl?.match(/@([^:]+):/)?.[1],
      projectRef,
      connected: connectionTest && Array.isArray(connectionTest) && connectionTest[0]?.connected === 1
    };
    
  } catch (error) {
    console.error('Error:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

verifyDatabaseIdentity();
