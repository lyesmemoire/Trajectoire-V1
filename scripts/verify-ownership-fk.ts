/**
 * Verify ownership foreign keys at database level
 * Check that user ownership is enforced via FK constraints
 */

import { PrismaClient } from '@prisma/client';

async function verifyOwnershipFK() {
  const prisma = new PrismaClient();

  try {
    console.log('=== OWNERSHIP FOREIGN KEY VERIFICATION ===\n');
    
    // Get all foreign keys in public schema
    const foreignKeys = await prisma.$queryRaw`
      SELECT
        tc.table_name,
        tc.constraint_name,
        kcu.column_name,
        ccu.table_name AS referenced_table,
        ccu.column_name AS referenced_column
      FROM information_schema.table_constraints tc
      JOIN information_schema.key_column_usage kcu
        ON tc.constraint_name = kcu.constraint_name
        AND tc.table_schema = kcu.table_schema
      JOIN information_schema.constraint_column_usage ccu
        ON tc.constraint_name = ccu.constraint_name
        AND tc.table_schema = ccu.table_schema
      WHERE tc.constraint_type = 'FOREIGN KEY'
        AND tc.table_schema = 'public'
      ORDER BY tc.table_name, tc.constraint_name
    `;
    
    console.log('All foreign keys in public schema:');
    console.log(JSON.stringify(foreignKeys, null, 2));
    
    // Check critical ownership FKs
    console.log('\n=== CRITICAL OWNERSHIP FOREIGN KEYS ===');
    
    const criticalFKs = [
      { table: 'graphs', column: 'user_id', ref_table: 'User', ref_column: 'id' },
      { table: 'graph_nodes', column: 'graph_id', ref_table: 'graphs', ref_column: 'id' },
      { table: 'graph_edges', column: 'graph_id', ref_table: 'graphs', ref_column: 'id' },
      { table: 'graph_edges', column: 'source_node_id', ref_table: 'graph_nodes', ref_column: 'id' },
      { table: 'graph_edges', column: 'target_node_id', ref_table: 'graph_nodes', ref_column: 'id' },
      { table: 'graph_versions', column: 'graph_id', ref_table: 'graphs', ref_column: 'id' },
      { table: 'graph_snapshots', column: 'graph_id', ref_table: 'graphs', ref_column: 'id' }
    ];
    
    for (const fk of criticalFKs) {
      const exists = Array.isArray(foreignKeys) && foreignKeys.some(
        (f: any) => 
          f.table_name === fk.table &&
          f.column_name === fk.column &&
          f.referenced_table === fk.ref_table &&
          f.referenced_column === fk.ref_column
      );
      console.log(`${fk.table}.${fk.column} -> ${fk.ref_table}.${fk.ref_column}: ${exists ? '✅ EXISTS' : '❌ MISSING'}`);
    }
    
    // Check ON DELETE behavior for ownership FKs
    console.log('\n=== ON DELETE BEHAVIOR FOR OWNERSHIP FKs ===');
    const ownershipFKs = await prisma.$queryRaw`
      SELECT
        tc.table_name,
        tc.constraint_name,
        kcu.column_name,
        ccu.table_name AS referenced_table,
        rc.delete_rule
      FROM information_schema.table_constraints tc
      JOIN information_schema.key_column_usage kcu
        ON tc.constraint_name = kcu.constraint_name
        AND tc.table_schema = kcu.table_schema
      JOIN information_schema.constraint_column_usage ccu
        ON tc.constraint_name = ccu.constraint_name
        AND tc.table_schema = ccu.table_schema
      JOIN information_schema.referential_constraints rc
        ON tc.constraint_name = rc.constraint_name
        AND tc.table_schema = rc.constraint_schema
      WHERE tc.constraint_type = 'FOREIGN KEY'
        AND tc.table_schema = 'public'
        AND kcu.column_name = 'user_id'
      ORDER BY tc.table_name
    `;
    
    console.log('Ownership FKs with ON DELETE behavior:');
    console.log(JSON.stringify(ownershipFKs, null, 2));
    
    console.log('\n✅ Ownership FK verification complete');
    
  } catch (error) {
    console.error('Error:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

verifyOwnershipFK();
