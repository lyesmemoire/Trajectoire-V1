/**
 * Database Inventory Script using Prisma Client
 * Executes SQL queries directly against PostgreSQL without schema validation
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function runInventory() {
  try {
    console.log('Connected to PostgreSQL database via Prisma');

    // 1. Toutes les tables public existantes
    console.log('\n=== 1. TABLES PUBLIC ===');
    const tables = await prisma.$queryRaw`
      SELECT 
        table_name,
        table_type
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `;
    console.log(JSON.stringify(tables, null, 2));

    // 1b. Tous les schémas
    console.log('\n=== 1b. TOUS LES SCHÉMAS ===');
    const schemas = await prisma.$queryRaw`
      SELECT schema_name
      FROM information_schema.schemata
      WHERE schema_name NOT IN ('pg_catalog', 'information_schema', 'pg_toast')
      ORDER BY schema_name
    `;
    console.log(JSON.stringify(schemas, null, 2));

    // 1c. Tables dans tous les schémas
    console.log('\n=== 1c. TABLES DANS TOUS LES SCHÉMAS ===');
    const allTables = await prisma.$queryRaw`
      SELECT 
        table_schema,
        table_name,
        table_type
      FROM information_schema.tables
      WHERE table_schema NOT IN ('pg_catalog', 'information_schema', 'pg_toast')
      ORDER BY table_schema, table_name
    `;
    console.log(JSON.stringify(allTables, null, 2));

    // 2. Toutes les colonnes
    console.log('\n=== 2. COLONNES ===');
    const columns = await prisma.$queryRaw`
      SELECT 
        table_name,
        column_name,
        data_type,
        is_nullable,
        column_default
      FROM information_schema.columns
      WHERE table_schema = 'public'
      ORDER BY table_name, ordinal_position
    `;
    console.log(JSON.stringify(columns, null, 2));

    // 3. Clés primaires
    console.log('\n=== 3. CLEFS PRIMAIRES ===');
    const primaryKeys = await prisma.$queryRaw`
      SELECT 
        tc.table_name,
        kcu.column_name,
        tc.constraint_name
      FROM information_schema.table_constraints tc
      JOIN information_schema.key_column_usage kcu
        ON tc.constraint_name = kcu.constraint_name
        AND tc.table_schema = kcu.table_schema
      WHERE tc.table_schema = 'public'
        AND tc.constraint_type = 'PRIMARY KEY'
      ORDER BY tc.table_name
    `;
    console.log(JSON.stringify(primaryKeys, null, 2));

    // 4. Clés étrangères
    console.log('\n=== 4. CLEFS ÉTRANGÈRES ===');
    const foreignKeys = await prisma.$queryRaw`
      SELECT 
        tc.table_name,
        kcu.column_name,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name,
        tc.constraint_name
      FROM information_schema.table_constraints tc
      JOIN information_schema.key_column_usage kcu
        ON tc.constraint_name = kcu.constraint_name
        AND tc.table_schema = kcu.table_schema
      JOIN information_schema.constraint_column_usage ccu
        ON tc.constraint_name = ccu.constraint_name
        AND tc.table_schema = ccu.table_schema
      WHERE tc.table_schema = 'public'
        AND tc.constraint_type = 'FOREIGN KEY'
      ORDER BY tc.table_name
    `;
    console.log(JSON.stringify(foreignKeys, null, 2));

    // 5. Indexes
    console.log('\n=== 5. INDEXES ===');
    const indexes = await prisma.$queryRaw`
      SELECT 
        schemaname,
        tablename,
        indexname,
        indexdef
      FROM pg_indexes
      WHERE schemaname = 'public'
      ORDER BY tablename, indexname
    `;
    console.log(JSON.stringify(indexes, null, 2));

    // 6. Extensions
    console.log('\n=== 6. EXTENSIONS ===');
    const extensions = await prisma.$queryRaw`
      SELECT extname, extversion, nspname
      FROM pg_extension
      JOIN pg_namespace ON pg_extension.extnamespace = pg_namespace.oid
      ORDER BY extname
    `;
    console.log(JSON.stringify(extensions, null, 2));

    // 7. Existence de User
    console.log('\n=== 7. TABLE USER ===');
    const userTable = await prisma.$queryRaw`
      SELECT 
        table_name,
        table_type
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_name = 'User'
    `;
    console.log(JSON.stringify(userTable, null, 2));

    // 8. Structure User
    let userStructure = null;
    let userCount = null;
    if (userTable.length > 0) {
      console.log('\n=== 8. STRUCTURE USER ===');
      userStructure = await prisma.$queryRaw`
        SELECT 
          column_name,
          data_type,
          is_nullable,
          column_default,
          character_maximum_length,
          numeric_precision,
          numeric_scale
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'User'
        ORDER BY ordinal_position
      `;
      console.log(JSON.stringify(userStructure, null, 2));

      // 9. Nombre de lignes dans User
      console.log('\n=== 9. USER COUNT ===');
      userCount = await prisma.$queryRaw`SELECT COUNT(*) as user_count FROM "User"`;
      console.log(JSON.stringify(userCount, null, 2));
    }

    // 10. Tables Graph
    console.log('\n=== 10. TABLES GRAPH ===');
    const graphTables = await prisma.$queryRaw`
      SELECT 
        table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_name IN (
          'graphs',
          'graph_nodes', 
          'graph_edges',
          'graph_versions',
          'graph_snapshots'
        )
      ORDER BY table_name
    `;
    console.log(JSON.stringify(graphTables, null, 2));

    // 11. _prisma_migrations
    console.log('\n=== 11. PRISMA MIGRATIONS TABLE ===');
    const prismaMigrationsTable = await prisma.$queryRaw`
      SELECT 
        table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_name = '_prisma_migrations'
    `;
    console.log(JSON.stringify(prismaMigrationsTable, null, 2));

    // Save complete inventory to file
    const inventory = {
      timestamp: new Date().toISOString(),
      schemas,
      allTables,
      tables,
      columns,
      primaryKeys,
      foreignKeys,
      indexes,
      extensions,
      userTable,
      userStructure,
      userCount,
      graphTables,
      prismaMigrationsTable
    };

    const fs = await import('fs');
    fs.writeFileSync('SECURITY-FIX-004.1-DATABASE-INVENTORY.json', JSON.stringify(inventory, null, 2));
    console.log('\nInventory saved to SECURITY-FIX-004.1-DATABASE-INVENTORY.json');

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runInventory();
