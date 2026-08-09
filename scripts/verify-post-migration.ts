/**
 * Verify post-migration database state
 * Check tables, columns, and structure
 */

import { PrismaClient } from '@prisma/client';

async function verifyPostMigration() {
  const prisma = new PrismaClient();

  try {
    console.log('=== POST-MIGRATION VERIFICATION ===\n');
    
    // Check all tables in public
    const tables = await prisma.$queryRaw`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `;
    console.log('Tables in public schema:', tables);
    console.log(`Table count: ${Array.isArray(tables) ? tables.length : 0}`);
    
    // Check for specific expected tables
    const expectedTables = [
      'User', 'CV', 'Job', 'Subscription',
      'graphs', 'graph_nodes', 'graph_edges', 'graph_versions', 'graph_snapshots'
    ];
    
    console.log('\n=== EXPECTED TABLES CHECK ===');
    for (const tableName of expectedTables) {
      const exists = await prisma.$queryRaw`
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public'
          AND table_name = ${tableName}
      `;
      const found = exists && Array.isArray(exists) && exists.length > 0;
      console.log(`${tableName}: ${found ? '✅ EXISTS' : '❌ MISSING'}`);
    }
    
    // Check graphs table columns
    console.log('\n=== GRAPHS TABLE COLUMNS ===');
    const graphColumns = await prisma.$queryRaw`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = 'graphs'
      ORDER BY ordinal_position
    `;
    console.log('Graph columns:', graphColumns);
    
    // Check for user_id column specifically
    const userIdColumn = await prisma.$queryRaw`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = 'graphs'
        AND column_name = 'user_id'
    `;
    console.log('\nuser_id column in graphs:', userIdColumn);
    
    // Check vector extension
    console.log('\n=== VECTOR EXTENSION ===');
    const vectorExt = await prisma.$queryRaw`
      SELECT extname, extversion
      FROM pg_extension
      WHERE extname = 'vector'
    `;
    console.log('Vector extension:', vectorExt);
    
    // Check _prisma_migrations table
    console.log('\n=== PRISMA MIGRATIONS TABLE ===');
    const prismaMigrations = await prisma.$queryRaw`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_name = '_prisma_migrations'
    `;
    console.log('_prisma_migrations table:', prismaMigrations);
    
    console.log('\n✅ Post-migration verification complete');
    
  } catch (error) {
    console.error('Error:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

verifyPostMigration();
