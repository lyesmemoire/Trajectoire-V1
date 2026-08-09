/**
 * Database Inventory Script
 * Executes SQL queries directly against PostgreSQL without Prisma validation
 */

const { Client } = require('pg');
require('dotenv').config();

async function runInventory() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    console.log('Connected to PostgreSQL database');

    // 1. Toutes les tables public existantes
    console.log('\n=== 1. TABLES PUBLIC ===');
    const tablesResult = await client.query(`
      SELECT 
        table_name,
        table_type
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    console.log(JSON.stringify(tablesResult.rows, null, 2));

    // 2. Toutes les colonnes
    console.log('\n=== 2. COLONNES ===');
    const columnsResult = await client.query(`
      SELECT 
        table_name,
        column_name,
        data_type,
        is_nullable,
        column_default
      FROM information_schema.columns
      WHERE table_schema = 'public'
      ORDER BY table_name, ordinal_position
    `);
    console.log(JSON.stringify(columnsResult.rows, null, 2));

    // 3. Clés primaires
    console.log('\n=== 3. CLEFS PRIMAIRES ===');
    const pkResult = await client.query(`
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
    `);
    console.log(JSON.stringify(pkResult.rows, null, 2));

    // 4. Clés étrangères
    console.log('\n=== 4. CLEFS ÉTRANGÈRES ===');
    const fkResult = await client.query(`
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
    `);
    console.log(JSON.stringify(fkResult.rows, null, 2));

    // 5. Indexes
    console.log('\n=== 5. INDEXES ===');
    const indexesResult = await client.query(`
      SELECT 
        schemaname,
        tablename,
        indexname,
        indexdef
      FROM pg_indexes
      WHERE schemaname = 'public'
      ORDER BY tablename, indexname
    `);
    console.log(JSON.stringify(indexesResult.rows, null, 2));

    // 6. Extensions
    console.log('\n=== 6. EXTENSIONS ===');
    const extensionsResult = await client.query(`
      SELECT extname, extversion, nspname
      FROM pg_extension
      JOIN pg_namespace ON pg_extension.extnamespace = pg_namespace.oid
      ORDER BY extname
    `);
    console.log(JSON.stringify(extensionsResult.rows, null, 2));

    // 7. Existence de User
    console.log('\n=== 7. TABLE USER ===');
    const userTableResult = await client.query(`
      SELECT 
        table_name,
        table_type
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_name = 'User'
    `);
    console.log(JSON.stringify(userTableResult.rows, null, 2));

    // 8. Structure User
    if (userTableResult.rows.length > 0) {
      console.log('\n=== 8. STRUCTURE USER ===');
      const userStructureResult = await client.query(`
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
      `);
      console.log(JSON.stringify(userStructureResult.rows, null, 2));

      // 9. Nombre de lignes dans User
      console.log('\n=== 9. USER COUNT ===');
      const userCountResult = await client.query('SELECT COUNT(*) as user_count FROM "User"');
      console.log(JSON.stringify(userCountResult.rows, null, 2));
    }

    // 10. Tables Graph
    console.log('\n=== 10. TABLES GRAPH ===');
    const graphTablesResult = await client.query(`
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
    `);
    console.log(JSON.stringify(graphTablesResult.rows, null, 2));

    // 11. _prisma_migrations
    console.log('\n=== 11. PRISMA MIGRATIONS TABLE ===');
    const prismaMigrationsResult = await client.query(`
      SELECT 
        table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_name = '_prisma_migrations'
    `);
    console.log(JSON.stringify(prismaMigrationsResult.rows, null, 2));

    // Save complete inventory to file
    const inventory = {
      timestamp: new Date().toISOString(),
      tables: tablesResult.rows,
      columns: columnsResult.rows,
      primaryKeys: pkResult.rows,
      foreignKeys: fkResult.rows,
      indexes: indexesResult.rows,
      extensions: extensionsResult.rows,
      userTable: userTableResult.rows,
      userStructure: userTableResult.rows.length > 0 ? (await client.query(`
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
      `)).rows : null,
      userCount: userTableResult.rows.length > 0 ? (await client.query('SELECT COUNT(*) as user_count FROM "User"')).rows : null,
      graphTables: graphTablesResult.rows,
      prismaMigrationsTable: prismaMigrationsResult.rows
    };

    const fs = require('fs');
    fs.writeFileSync('SECURITY-FIX-004.1-DATABASE-INVENTORY.json', JSON.stringify(inventory, null, 2));
    console.log('\nInventory saved to SECURITY-FIX-004.1-DATABASE-INVENTORY.json');

  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runInventory();
