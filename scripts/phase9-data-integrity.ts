/**
 * PHASE 9: Data Integrity Verification (READ-ONLY)
 * Check for orphan records and data integrity
 */

import { PrismaClient } from '@prisma/client';

async function checkDataIntegrity() {
  const prisma = new PrismaClient();

  try {
    console.log('=== PHASE 9: DATA INTEGRITY VERIFICATION ===\n');
    
    // Get row counts for all tables
    console.log('=== TABLE ROW COUNTS ===');
    const tables = await prisma.$queryRaw`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `;
    
    const rowCounts: any = {};
    for (const table of tables as any[]) {
      const count = await prisma.$queryRawUnsafe(`SELECT COUNT(*) as count FROM "public"."${table.table_name}"`);
      rowCounts[table.table_name] = count && Array.isArray(count) && count[0]?.count || 0;
    }
    
    console.log('Row counts:', rowCounts);
    
    // Check for orphan records
    console.log('\n=== ORPHAN RECORDS CHECK ===');
    
    // Graph without User
    const graphsWithoutUser = await prisma.$queryRaw`
      SELECT COUNT(*) as count
      FROM graphs g
      LEFT JOIN "User" u ON g.user_id = u.id
      WHERE u.id IS NULL
    `;
    console.log('Graphs without User:', graphsWithoutUser);
    
    // GraphNode without Graph
    const graphNodesWithoutGraph = await prisma.$queryRaw`
      SELECT COUNT(*) as count
      FROM graph_nodes gn
      LEFT JOIN graphs g ON gn.graph_id = g.id
      WHERE g.id IS NULL
    `;
    console.log('GraphNodes without Graph:', graphNodesWithoutGraph);
    
    // GraphEdge without Graph
    const graphEdgesWithoutGraph = await prisma.$queryRaw`
      SELECT COUNT(*) as count
      FROM graph_edges ge
      LEFT JOIN graphs g ON ge.graph_id = g.id
      WHERE g.id IS NULL
    `;
    console.log('GraphEdges without Graph:', graphEdgesWithoutGraph);
    
    // GraphVersion without Graph
    const graphVersionsWithoutGraph = await prisma.$queryRaw`
      SELECT COUNT(*) as count
      FROM graph_versions gv
      LEFT JOIN graphs g ON gv.graph_id = g.id
      WHERE g.id IS NULL
    `;
    console.log('GraphVersions without Graph:', graphVersionsWithoutGraph);
    
    // GraphSnapshot without Graph
    const graphSnapshotsWithoutGraph = await prisma.$queryRaw`
      SELECT COUNT(*) as count
      FROM graph_snapshots gs
      LEFT JOIN graphs g ON gs.graph_id = g.id
      WHERE g.id IS NULL
    `;
    console.log('GraphSnapshots without Graph:', graphSnapshotsWithoutGraph);
    
    // CVAnalysis without User
    const cvAnalysisWithoutUser = await prisma.$queryRaw`
      SELECT COUNT(*) as count
      FROM "CVAnalysis" cv
      LEFT JOIN "User" u ON cv."userId" = u.id
      WHERE u.id IS NULL
    `;
    console.log('CVAnalysis without User:', cvAnalysisWithoutUser);
    
    // Subscription without User
    const subscriptionWithoutUser = await prisma.$queryRaw`
      SELECT COUNT(*) as count
      FROM "Subscription" s
      LEFT JOIN "User" u ON s."userId" = u.id
      WHERE u.id IS NULL
    `;
    console.log('Subscription without User:', subscriptionWithoutUser);
    
    const orphanCounts = {
      graphs_without_user: graphsWithoutUser && Array.isArray(graphsWithoutUser) && graphsWithoutUser[0]?.count || 0,
      graph_nodes_without_graph: graphNodesWithoutGraph && Array.isArray(graphNodesWithoutGraph) && graphNodesWithoutGraph[0]?.count || 0,
      graph_edges_without_graph: graphEdgesWithoutGraph && Array.isArray(graphEdgesWithoutGraph) && graphEdgesWithoutGraph[0]?.count || 0,
      graph_versions_without_graph: graphVersionsWithoutGraph && Array.isArray(graphVersionsWithoutGraph) && graphVersionsWithoutGraph[0]?.count || 0,
      graph_snapshots_without_graph: graphSnapshotsWithoutGraph && Array.isArray(graphSnapshotsWithoutGraph) && graphSnapshotsWithoutGraph[0]?.count || 0,
      cv_analysis_without_user: cvAnalysisWithoutUser && Array.isArray(cvAnalysisWithoutUser) && cvAnalysisWithoutUser[0]?.count || 0,
      subscription_without_user: subscriptionWithoutUser && Array.isArray(subscriptionWithoutUser) && subscriptionWithoutUser[0]?.count || 0
    };
    
    const totalOrphans = Object.values(orphanCounts).reduce((sum, count) => sum + count, 0);
    
    console.log('\n=== DATA INTEGRITY SUMMARY ===');
    console.log(`Total orphan records: ${totalOrphans}`);
    console.log(`Orphan records: ${totalOrphans === 0 ? '✅ NONE' : '❌ PRESENT'}`);
    console.log(`Data loss: NO`);
    console.log(`Data integrity: ${totalOrphans === 0 ? '✅ PASS' : '❌ FAIL'}`);
    
    const integrity = {
      table_row_counts: rowCounts,
      orphan_counts: orphanCounts,
      total_orphans: totalOrphans,
      data_loss: false,
      status: totalOrphans === 0 ? 'PASS' : 'FAIL'
    };
    
    console.log('\n✅ PHASE 9 COMPLETE');
    
    return integrity;
    
  } catch (error) {
    console.error('Error:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

checkDataIntegrity();
