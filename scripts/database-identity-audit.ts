/**
 * DATABASE IDENTITY AUDIT - READ-ONLY
 * STRICTLY NO MUTATIONS - ONLY SELECT QUERIES
 */

import { PrismaClient } from '@prisma/client';

// Mask credentials for safe logging
function maskConnectionString(url: string): string {
  if (!url) return 'NOT_SET';
  try {
    const urlObj = new URL(url);
    return `${urlObj.protocol}//${urlObj.username}:***@${urlObj.hostname}:${urlObj.port}${urlObj.pathname}`;
  } catch {
    return 'INVALID_URL';
  }
}

function maskSupabaseUrl(url: string): string {
  if (!url) return 'NOT_SET';
  try {
    const urlObj = new URL(url);
    return `${urlObj.protocol}//${urlObj.hostname}`;
  } catch {
    return 'INVALID_URL';
  }
}

// Extract project ref from Supabase URL
function extractProjectRef(supabaseUrl: string): string | null {
  if (!supabaseUrl) return null;
  try {
    const urlObj = new URL(supabaseUrl);
    const hostname = urlObj.hostname;
    const match = hostname.match(/([a-z0-9]{20})\./);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

// Convert BigInt to string for JSON serialization
function serializeBigInt(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj === 'bigint') return obj.toString();
  if (Array.isArray(obj)) return obj.map(serializeBigInt);
  if (typeof obj === 'object') {
    const result: any = {};
    for (const key in obj) {
      result[key] = serializeBigInt(obj[key]);
    }
    return result;
  }
  return obj;
}

async function runAudit() {
  const prisma = new PrismaClient();
  
  const auditResults: any = {
    timestamp: new Date().toISOString(),
    phase: 'DATABASE_IDENTITY_AUDIT',
    mode: 'READ_ONLY',
    mutations_performed: 'NONE'
  };

  try {
    console.log('=== DATABASE IDENTITY AUDIT - READ-ONLY ===\n');

    // 1. Identifier la connexion effective
    console.log('=== 1. CONNEXION EFFECTIVE ===');
    const databaseUrl = process.env.DATABASE_URL || 'NOT_SET';
    const directUrl = process.env.DIRECT_URL || 'NOT_SET';
    const supabaseUrl = process.env.SUPABASE_URL || 'NOT_SET';

    auditResults.database_url_masked = maskConnectionString(databaseUrl);
    auditResults.direct_url_masked = maskConnectionString(directUrl);
    auditResults.supabase_url_masked = maskSupabaseUrl(supabaseUrl);
    auditResults.supabase_project_ref = extractProjectRef(supabaseUrl);

    console.log('DATABASE_URL:', auditResults.database_url_masked);
    console.log('DIRECT_URL:', auditResults.direct_url_masked);
    console.log('SUPABASE_URL:', auditResults.supabase_url_masked);
    console.log('SUPABASE PROJECT REF:', auditResults.supabase_project_ref || 'NOT_EXTRACTED');

    // 2. Identifier l'instance Supabase
    console.log('\n=== 2. INSTANCE SUPABASE ===');
    const expectedProjectRef = 'bzxdozzbdvzgvgshyamp';
    auditResults.expected_project_ref = expectedProjectRef;
    auditResults.project_match = auditResults.supabase_project_ref === expectedProjectRef ? 'YES' : 'NO';
    console.log('EXPECTED PROJECT REF:', expectedProjectRef);
    console.log('PROJECT MATCH:', auditResults.project_match);

    // 3. Inspecter tous les schémas
    console.log('\n=== 3. TOUS LES SCHÉMAS ===');
    const schemas = await prisma.$queryRaw`
      SELECT 
        schema_name,
        (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = s.schema_name) as table_count,
        (SELECT COUNT(*) FROM information_schema.views WHERE table_schema = s.schema_name) as view_count
      FROM information_schema.schemata s
      WHERE schema_name NOT IN ('pg_catalog', 'information_schema', 'pg_toast')
      ORDER BY schema_name
    `;
    auditResults.schemas = serializeBigInt(schemas);
    console.log(JSON.stringify(auditResults.schemas, null, 2));

    // 4. Rechercher les tables Trajectoire
    console.log('\n=== 4. TABLES TRAJECTOIRE ===');
    const trajectoireTableNames = [
      'User', 'users', 'CV', 'Job', 'Subscription',
      'Graph', 'graphs', 'GraphNode', 'graph_nodes',
      'GraphEdge', 'graph_edges', 'GraphVersion', 'graph_versions',
      'GraphSnapshot', 'graph_snapshots', 'PreviewAnalysis'
    ];

    const tableDiscovery = await prisma.$queryRaw`
      SELECT 
        table_schema,
        table_name,
        'EXISTS' as exists
      FROM information_schema.tables
      WHERE table_schema NOT IN ('pg_catalog', 'information_schema', 'pg_toast')
        AND table_name = ANY(${trajectoireTableNames})
      ORDER BY table_schema, table_name
    `;
    auditResults.trajectoire_tables = serializeBigInt(tableDiscovery);
    console.log(JSON.stringify(auditResults.trajectoire_tables, null, 2));

    // 5. Rechercher les colonnes métier
    console.log('\n=== 5. COLONNES MÉTIER ===');
    const businessColumns = await prisma.$queryRaw`
      SELECT 
        table_schema,
        table_name,
        column_name,
        data_type
      FROM information_schema.columns
      WHERE table_schema NOT IN ('pg_catalog', 'information_schema', 'pg_toast')
        AND column_name IN ('userId', 'user_id', 'ownerId', 'owner_id', 'email', 'createdAt', 'created_at')
      ORDER BY table_schema, table_name, column_name
    `;
    auditResults.business_columns = serializeBigInt(businessColumns);
    console.log(JSON.stringify(auditResults.business_columns, null, 2));

    // 6. Identifier la base par son contenu (COUNT uniquement)
    console.log('\n=== 6. CONTENU DE LA BASE (COUNT SEULEMENT) ===');
    const contentAudit = await prisma.$queryRaw`
      SELECT 
        table_schema,
        table_name,
        (SELECT COUNT(*) FROM information_schema.columns WHERE table_schema = t.table_schema AND table_name = t.table_name) as column_count
      FROM information_schema.tables t
      WHERE table_schema NOT IN ('pg_catalog', 'information_schema', 'pg_toast')
      ORDER BY table_schema, table_name
    `;
    auditResults.content_audit = serializeBigInt(contentAudit);
    console.log(JSON.stringify(auditResults.content_audit, null, 2));

    // 7. Vérifier _prisma_migrations dans tous les schémas
    console.log('\n=== 7. PRISMA MIGRATIONS ===');
    const prismaMigrationsCheck = await prisma.$queryRaw`
      SELECT 
        table_schema,
        table_name,
        (SELECT COUNT(*) FROM information_schema.columns WHERE table_schema = t.table_schema AND table_name = t.table_name) as column_count
      FROM information_schema.tables t
      WHERE table_schema NOT IN ('pg_catalog', 'information_schema', 'pg_toast')
        AND table_name = '_prisma_migrations'
    `;
    auditResults.prisma_migrations = serializeBigInt(prismaMigrationsCheck);
    console.log(JSON.stringify(auditResults.prisma_migrations, null, 2));

    // 8. Vérifier l'identité PostgreSQL
    console.log('\n=== 8. IDENTITÉ POSTGRESQL ===');
    const postgresIdentity = await prisma.$queryRaw`
      SELECT
        current_database() as current_database,
        current_user as current_user,
        current_schema() as current_schema,
        inet_server_addr() as server_addr,
        inet_server_port() as server_port,
        version() as version
    `;
    auditResults.postgres_identity = serializeBigInt(postgresIdentity);
    console.log(JSON.stringify(auditResults.postgres_identity, null, 2));

    // 9. Comparer DATABASE_URL et DIRECT_URL
    console.log('\n=== 9. COMPARAISON DATABASE_URL / DIRECT_URL ===');
    auditResults.database_url_set = !!databaseUrl;
    auditResults.direct_url_set = !!directUrl;
    auditResults.urls_match = databaseUrl === directUrl ? 'YES' : 'NO';
    console.log('DATABASE_URL SET:', auditResults.database_url_set);
    console.log('DIRECT_URL SET:', auditResults.direct_url_set);
    console.log('URLS MATCH:', auditResults.urls_match);

    // 10. Vérifier le project ref Supabase
    console.log('\n=== 10. PROJECT REF SUPABASE ===');
    auditResults.supabase_project_ref_extracted = extractProjectRef(supabaseUrl);
    auditResults.expected_project_ref = expectedProjectRef;
    auditResults.project_ref_match = auditResults.supabase_project_ref_extracted === expectedProjectRef ? 'YES' : 'NO';
    console.log('EXTRACTED PROJECT REF:', auditResults.supabase_project_ref_extracted);
    console.log('EXPECTED PROJECT REF:', expectedProjectRef);
    console.log('PROJECT REF MATCH:', auditResults.project_ref_match);

    // 11. Diagnostic
    console.log('\n=== 11. DIAGNOSTIC ===');
    const publicTables = await prisma.$queryRaw`
      SELECT COUNT(*) as count
      FROM information_schema.tables
      WHERE table_schema = 'public'
    `;
    const publicTableCount = Number(publicTables[0]?.count || 0);
    
    auditResults.public_table_count = publicTableCount;
    auditResults.public_empty = publicTableCount === 0 ? 'YES' : 'NO';
    auditResults.trajectoire_tables_found = tableDiscovery.length > 0 ? 'YES' : 'NO';
    auditResults.prisma_migrations_found = prismaMigrationsCheck.length > 0 ? 'YES' : 'NO';

    console.log('PUBLIC TABLE COUNT:', publicTableCount);
    console.log('PUBLIC EMPTY:', auditResults.public_empty);
    console.log('TRAJECTOIRE TABLES FOUND:', auditResults.trajectoire_tables_found);
    console.log('PRISMA MIGRATIONS FOUND:', auditResults.prisma_migrations_found);

    // Diagnostic conclusion
    if (auditResults.project_ref_match === 'NO') {
      auditResults.diagnosis = 'WRONG_SUPABASE_PROJECT';
    } else if (publicTableCount === 0 && tableDiscovery.length === 0) {
      auditResults.diagnosis = 'DATABASE_NOT_INITIALIZED_OR_WRONG_TARGET';
    } else if (prismaMigrationsCheck.length === 0) {
      auditResults.diagnosis = 'NO_PRISMA_MIGRATIONS';
    } else {
      auditResults.diagnosis = 'UNKNOWN';
    }

    console.log('DIAGNOSIS:', auditResults.diagnosis);

    // 12. Final status
    console.log('\n=== 12. FINAL STATUS ===');
    auditResults.status = 'BLOCKED';
    auditResults.reason = 'READ_ONLY_AUDIT_COMPLETE_NO_MUTATIONS_PERFORMED';
    
    console.log('STATUS:', auditResults.status);
    console.log('REASON:', auditResults.reason);

    // Save audit results
    const fs = await import('fs');
    fs.writeFileSync('SECURITY-FIX-004.1-DATABASE-IDENTITY-AUDIT.json', JSON.stringify(serializeBigInt(auditResults), null, 2));
    console.log('\nAudit saved to SECURITY-FIX-004.1-DATABASE-IDENTITY-AUDIT.json');

  } catch (error) {
    console.error('ERROR:', error);
    auditResults.error = String(error);
    auditResults.status = 'ERROR';
    
    const fs = await import('fs');
    fs.writeFileSync('SECURITY-FIX-004.1-DATABASE-IDENTITY-AUDIT.json', JSON.stringify(serializeBigInt(auditResults), null, 2));
    
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runAudit();
