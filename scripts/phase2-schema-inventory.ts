/**
 * PHASE 2: Complete Public Schema Inventory (READ-ONLY)
 * List tables, columns, types, nullable, primary keys, foreign keys, indexes, unique constraints, extensions
 */

import { PrismaClient } from '@prisma/client';

async function inventorySchema() {
  const prisma = new PrismaClient();

  try {
    console.log('=== PHASE 2: COMPLETE PUBLIC SCHEMA INVENTORY ===\n');
    
    const inventory: any = {
      tables: [],
      columns: [],
      primary_keys: [],
      foreign_keys: [],
      indexes: [],
      unique_constraints: [],
      extensions: []
    };
    
    // Get all tables in public schema
    console.log('=== TABLES ===');
    const tables = await prisma.$queryRaw`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `;
    console.log('Tables:', tables);
    inventory.tables = tables;
    
    // Get all columns
    console.log('\n=== COLUMNS ===');
    const columns = await prisma.$queryRaw`
      SELECT
        table_name,
        column_name,
        data_type,
        udt_name,
        is_nullable,
        column_default,
        ordinal_position
      FROM information_schema.columns
      WHERE table_schema = 'public'
      ORDER BY table_name, ordinal_position
    `;
    console.log(`Columns count: ${Array.isArray(columns) ? columns.length : 0}`);
    inventory.columns = columns;
    
    // Get primary keys
    console.log('\n=== PRIMARY KEYS ===');
    const primaryKeys = await prisma.$queryRaw`
      SELECT
        tc.table_name,
        tc.constraint_name,
        kcu.column_name
      FROM information_schema.table_constraints tc
      JOIN information_schema.key_column_usage kcu
        ON tc.constraint_name = kcu.constraint_name
        AND tc.table_schema = kcu.table_schema
      WHERE tc.constraint_type = 'PRIMARY KEY'
        AND tc.table_schema = 'public'
      ORDER BY tc.table_name
    `;
    console.log('Primary Keys:', primaryKeys);
    inventory.primary_keys = primaryKeys;
    
    // Get foreign keys
    console.log('\n=== FOREIGN KEYS ===');
    const foreignKeys = await prisma.$queryRaw`
      SELECT
        tc.table_name,
        tc.constraint_name,
        kcu.column_name,
        ccu.table_name AS referenced_table,
        ccu.column_name AS referenced_column,
        rc.delete_rule,
        rc.update_rule
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
      ORDER BY tc.table_name, tc.constraint_name
    `;
    console.log(`Foreign Keys count: ${Array.isArray(foreignKeys) ? foreignKeys.length : 0}`);
    inventory.foreign_keys = foreignKeys;
    
    // Get indexes
    console.log('\n=== INDEXES ===');
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
    console.log(`Indexes count: ${Array.isArray(indexes) ? indexes.length : 0}`);
    inventory.indexes = indexes;
    
    // Get unique constraints
    console.log('\n=== UNIQUE CONSTRAINTS ===');
    const uniqueConstraints = await prisma.$queryRaw`
      SELECT
        tc.table_name,
        tc.constraint_name,
        kcu.column_name
      FROM information_schema.table_constraints tc
      JOIN information_schema.key_column_usage kcu
        ON tc.constraint_name = kcu.constraint_name
        AND tc.table_schema = kcu.table_schema
      WHERE tc.constraint_type = 'UNIQUE'
        AND tc.table_schema = 'public'
      ORDER BY tc.table_name, tc.constraint_name
    `;
    console.log('Unique Constraints:', uniqueConstraints);
    inventory.unique_constraints = uniqueConstraints;
    
    // Get extensions
    console.log('\n=== EXTENSIONS ===');
    const extensions = await prisma.$queryRaw`
      SELECT
        extname,
        extversion,
        nspname
      FROM pg_extension
      JOIN pg_namespace ON pg_extension.extnamespace = pg_namespace.oid
      ORDER BY extname
    `;
    console.log('Extensions:', extensions);
    inventory.extensions = extensions;
    
    // Save inventory to JSON
    const fs = await import('fs');
    const path = await import('path');
    
    const inventoryPath = path.join(process.cwd(), 'SECURITY-FIX-004.3-SCHEMA-INVENTORY.json');
    fs.writeFileSync(inventoryPath, JSON.stringify(inventory, null, 2));
    
    console.log(`\n✅ Inventory saved to: ${inventoryPath}`);
    console.log('\n✅ PHASE 2 COMPLETE');
    
    return inventory;
    
  } catch (error) {
    console.error('Error:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

inventorySchema();
