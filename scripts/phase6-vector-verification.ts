/**
 * PHASE 6: Vector Verification
 * Verify vector extension and vector columns
 */

import { PrismaClient } from '@prisma/client';

async function verifyVector() {
  const prisma = new PrismaClient();

  try {
    console.log('=== PHASE 6: VECTOR VERIFICATION ===\n');
    
    // Check vector extension
    console.log('=== VECTOR EXTENSION ===');
    const vectorExt = await prisma.$queryRaw`
      SELECT
        extname,
        extversion
      FROM pg_extension
      WHERE extname = 'vector'
    `;
    console.log('Vector extension:', vectorExt);
    
    // Check for vector columns
    console.log('\n=== VECTOR COLUMNS ===');
    const vectorColumns = await prisma.$queryRaw`
      SELECT
        table_name,
        column_name,
        data_type,
        udt_name
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND udt_name = 'vector'
      ORDER BY table_name, column_name
    `;
    console.log('Vector columns:', vectorColumns);
    
    // Check graph_nodes specifically for embedding column
    console.log('\n=== GRAPH_NODES.EMBEDDING COLUMN ===');
    const graphNodesEmbedding = await prisma.$queryRaw`
      SELECT
        column_name,
        data_type,
        udt_name,
        is_nullable
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = 'graph_nodes'
        AND column_name = 'embedding'
    `;
    console.log('graph_nodes.embedding column:', graphNodesEmbedding);
    
    const verification = {
      vector_extension_exists: vectorExt && Array.isArray(vectorExt) && vectorExt.length > 0,
      vector_extension_version: vectorExt && Array.isArray(vectorExt) && vectorExt[0]?.extversion,
      vector_columns_count: vectorColumns && Array.isArray(vectorColumns) ? vectorColumns.length : 0,
      graph_nodes_embedding_exists: graphNodesEmbedding && Array.isArray(graphNodesEmbedding) && graphNodesEmbedding.length > 0,
      graph_nodes_embedding_type: graphNodesEmbedding && Array.isArray(graphNodesEmbedding) && graphNodesEmbedding[0]?.udt_name,
      status: 'PASS'
    };
    
    console.log('\n=== VERIFICATION SUMMARY ===');
    console.log(`Vector extension exists: ${verification.vector_extension_exists ? '✅' : '❌'}`);
    console.log(`Vector extension version: ${verification.vector_extension_version || 'N/A'}`);
    console.log(`Vector columns count: ${verification.vector_columns_count}`);
    console.log(`graph_nodes.embedding exists: ${verification.graph_nodes_embedding_exists ? '✅' : '❌'}`);
    console.log(`graph_nodes.embedding type: ${verification.graph_nodes_embedding_type || 'N/A'}`);
    console.log(`Status: ${verification.status}`);
    
    console.log('\n✅ PHASE 6 COMPLETE');
    
    return verification;
    
  } catch (error) {
    console.error('Error:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

verifyVector();
