/**
 * Verify public schema is empty before proceeding
 */

import { PrismaClient } from '@prisma/client';

async function verifyEmptyPublic() {
  const prisma = new PrismaClient();

  try {
    console.log('=== VERIFYING PUBLIC SCHEMA IS EMPTY ===\n');
    
    const tables = await prisma.$queryRaw`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `;
    
    console.log('Tables in public schema:', tables);
    console.log(`Table count: ${Array.isArray(tables) ? tables.length : 0}`);
    
    if (tables && Array.isArray(tables) && tables.length > 0) {
      console.log('⚠️ Public schema is NOT empty');
      return false;
    } else {
      console.log('✅ Public schema is empty');
      return true;
    }
    
  } catch (error) {
    console.error('Error:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

verifyEmptyPublic();
