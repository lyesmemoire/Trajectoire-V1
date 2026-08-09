/**
 * Drop Graph tables to resolve drift
 * These tables were created by a partially applied migration
 * and contain no user data (database is empty per audit)
 */

import { PrismaClient } from '@prisma/client';

async function dropGraphTables() {
  const prisma = new PrismaClient();

  try {
    console.log('=== DROPPING GRAPH TABLES TO RESOLVE DRIFT ===\n');
    
    // Check current state
    const currentTables = await prisma.$queryRaw`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_name LIKE 'graph%'
      ORDER BY table_name
    `;
    console.log('Current Graph tables:', currentTables);
    
    // Drop in reverse order of dependencies
    const dropOrder = [
      'graph_snapshots',
      'graph_versions', 
      'graph_edges',
      'graph_nodes',
      'graphs'
    ];
    
    for (const tableName of dropOrder) {
      try {
        console.log(`Dropping table ${tableName}...`);
        await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS "public"."${tableName}" CASCADE`);
        console.log(`✅ Dropped ${tableName}`);
      } catch (error) {
        console.error(`❌ Failed to drop ${tableName}:`, error);
      }
    }
    
    // Verify cleanup
    const remainingTables = await prisma.$queryRaw`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_name LIKE 'graph%'
      ORDER BY table_name
    `;
    console.log('\nRemaining Graph tables after cleanup:', remainingTables);
    
    // Check if vector extension exists
    const vectorExt = await prisma.$queryRaw`
      SELECT extname, extversion
      FROM pg_extension
      WHERE extname = 'vector'
    `;
    console.log('\nVector extension:', vectorExt);
    
    // Drop vector extension if it exists (will be recreated by migration)
    if (vectorExt && Array.isArray(vectorExt) && vectorExt.length > 0) {
      console.log('Dropping vector extension...');
      await prisma.$executeRawUnsafe(`DROP EXTENSION IF EXISTS vector CASCADE`);
      console.log('✅ Dropped vector extension');
    }
    
    console.log('\n✅ Graph tables cleanup complete');
    
  } catch (error) {
    console.error('Error:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

dropGraphTables();
