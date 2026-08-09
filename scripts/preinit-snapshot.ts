/**
 * PRE-INITIALIZATION SNAPSHOT - READ-ONLY
 * Captures database state before any mutations
 */

import { PrismaClient } from '@prisma/client';

async function runSnapshot() {
  const prisma = new PrismaClient();
  
  const snapshot: any = {
    timestamp: new Date().toISOString(),
    phase: 'PREINIT_SNAPSHOT',
    mode: 'READ_ONLY',
    mutations_performed: 'NONE'
  };

  try {
    console.log('=== PRE-INITIALIZATION SNAPSHOT - READ-ONLY ===\n');

    // Database identity
    console.log('=== DATABASE IDENTITY ===');
    const identity = await prisma.$queryRaw`
      SELECT
        current_database() as current_database,
        current_user as current_user,
        current_schema() as current_schema,
        inet_server_addr() as server_addr,
        inet_server_port() as server_port,
        version() as version
    `;
    snapshot.database_identity = identity;
    console.log(JSON.stringify(identity, null, 2));

    // All schemas
    console.log('\n=== ALL SCHEMAS ===');
    const schemas = await prisma.$queryRaw`
      SELECT schema_name
      FROM information_schema.schemata
      WHERE schema_name NOT IN ('pg_catalog', 'information_schema', 'pg_toast')
      ORDER BY schema_name
    `;
    snapshot.schemas = schemas;
    console.log(JSON.stringify(schemas, null, 2));

    // All tables in public
    console.log('\n=== PUBLIC TABLES ===');
    const publicTables = await prisma.$queryRaw`
      SELECT table_name, table_type
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `;
    snapshot.public_tables = publicTables;
    snapshot.public_table_count = Array.isArray(publicTables) ? publicTables.length : 0;
    console.log(`PUBLIC_TABLE_COUNT=${snapshot.public_table_count}`);

    // All extensions
    console.log('\n=== EXTENSIONS ===');
    const extensions = await prisma.$queryRaw`
      SELECT extname, extversion, nspname
      FROM pg_extension
      JOIN pg_namespace ON pg_extension.extnamespace = pg_namespace.oid
      ORDER BY extname
    `;
    snapshot.extensions = extensions;
    console.log(JSON.stringify(extensions, null, 2));

    // Check for _prisma_migrations
    console.log('\n=== PRISMA MIGRATIONS TABLE ===');
    const prismaMigrations = await prisma.$queryRaw`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_name = '_prisma_migrations'
    `;
    snapshot.prisma_migrations_exists = Array.isArray(prismaMigrations) && prismaMigrations.length > 0;
    console.log(`PRISMA_MIGRATIONS_EXISTS=${snapshot.prisma_migrations_exists}`);

    // Check for User table
    console.log('\n=== USER TABLE ===');
    const userTable = await prisma.$queryRaw`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_name = 'User'
    `;
    snapshot.user_table_exists = Array.isArray(userTable) && userTable.length > 0;
    console.log(`USER_TABLE_EXISTS=${snapshot.user_table_exists}`);

    // Check for Graph tables
    console.log('\n=== GRAPH TABLES ===');
    const graphTables = await prisma.$queryRaw`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_name IN ('graphs', 'graph_nodes', 'graph_edges', 'graph_versions', 'graph_snapshots')
      ORDER BY table_name
    `;
    snapshot.graph_tables = graphTables;
    snapshot.trajectoire_table_count = snapshot.public_table_count;
    console.log(`TRAJECTOIRE_TABLE_COUNT=${snapshot.trajectoire_table_count}`);

    // Check for vector extension
    console.log('\n=== VECTOR EXTENSION ===');
    const vectorExt = await prisma.$queryRaw`
      SELECT extname, extversion
      FROM pg_extension
      WHERE extname = 'vector'
    `;
    snapshot.vector_extension_exists = Array.isArray(vectorExt) && vectorExt.length > 0;
    console.log(`VECTOR_EXTENSION_EXISTS=${snapshot.vector_extension_exists}`);

    // Critical checks
    console.log('\n=== CRITICAL CHECKS ===');
    console.log(`PUBLIC_TABLE_COUNT=${snapshot.public_table_count}`);
    console.log(`TRAJECTOIRE_TABLE_COUNT=${snapshot.trajectoire_table_count}`);
    console.log(`PRISMA_MIGRATIONS_EXISTS=${snapshot.prisma_migrations_exists}`);
    console.log(`VECTOR_EXTENSION_EXISTS=${snapshot.vector_extension_exists}`);

    // Validation
    const criticalChecks = {
      PUBLIC_TABLE_COUNT: snapshot.public_table_count === 0,
      TRAJECTOIRE_TABLE_COUNT: snapshot.trajectoire_table_count === 0,
      PRISMA_MIGRATIONS_EXISTS: snapshot.prisma_migrations_exists === false,
      VECTOR_EXTENSION_EXISTS: snapshot.vector_extension_exists === false
    };

    snapshot.critical_checks = criticalChecks;
    snapshot.all_checks_pass = Object.values(criticalChecks).every(v => v === true);

    console.log('\n=== VALIDATION ===');
    console.log('ALL CHECKS PASS:', snapshot.all_checks_pass ? 'YES' : 'NO');

    if (!snapshot.all_checks_pass) {
      console.log('\n*** STOP - CRITICAL CHECK FAILED ***');
      console.log('One or more critical checks did not match expected values.');
      console.log('DO NOT PROCEED WITH MUTATIONS.');
      snapshot.status = 'BLOCKED';
      snapshot.reason = 'CRITICAL_CHECK_FAILED';
    } else {
      snapshot.status = 'READY';
      snapshot.reason = 'ALL_CHECKS_PASS';
    }

    // Save snapshot
    const fs = await import('fs');
    fs.writeFileSync('SECURITY-FIX-004.2-PREINIT-SNAPSHOT.json', JSON.stringify(snapshot, null, 2));
    console.log('\nSnapshot saved to SECURITY-FIX-004.2-PREINIT-SNAPSHOT.json');

  } catch (error) {
    console.error('ERROR:', error);
    snapshot.error = String(error);
    snapshot.status = 'ERROR';
    
    const fs = await import('fs');
    fs.writeFileSync('SECURITY-FIX-004.2-PREINIT-SNAPSHOT.json', JSON.stringify(snapshot, null, 2));
    
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runSnapshot();
