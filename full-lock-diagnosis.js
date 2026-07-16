import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fullLockDiagnosis() {
  console.log('=== SPRINT OPS-02 — POSTGRESQL LOCK RECOVERY ===\n');
  
  try {
    // PHASE 1: pg_stat_activity
    console.log('=== PHASE 1: pg_stat_activity ===');
    const activity = await prisma.$queryRaw`
      SELECT pid, state, query, wait_event, backend_start
      FROM pg_stat_activity
      WHERE datname = current_database()
      ORDER BY backend_start DESC
    `;
    
    console.log('PID\tSTATE\tQUERY\tWAIT_EVENT\tBACKEND_START');
    for (const row of activity) {
      const query = row.query ? row.query.substring(0, 50) : 'NULL';
      console.log(`${row.pid}\t${row.state}\t${query}\t${row.wait_event}\t${row.backend_start}`);
    }
    
    // PHASE 2: pg_locks
    console.log('\n=== PHASE 2: pg_locks ===');
    const locks = await prisma.$queryRaw`
      SELECT l.relation::text as relation, l.mode, l.granted, l.pid
      FROM pg_locks l
      JOIN pg_database d ON l.database = d.oid
      WHERE d.datname = current_database()
      ORDER BY l.granted, l.relation
    `;
    
    console.log('RELATION\tMODE\tGRANTED\tPID');
    for (const lock of locks) {
      console.log(`${lock.relation}\t${lock.mode}\t${lock.granted}\t${lock.pid}`);
    }
    
    // PHASE 3: Identify specific lock types
    console.log('\n=== PHASE 3: Identification des locks ===');
    
    const openTransactions = await prisma.$queryRaw`
      SELECT pid, state, query_start, state_change
      FROM pg_stat_activity
      WHERE datname = current_database()
      AND state IN ('active', 'idle in transaction')
      ORDER BY state_change
    `;
    
    console.log(`Transactions ouvertes: ${openTransactions.length}`);
    for (const tx of openTransactions) {
      console.log(`  PID: ${tx.pid}, State: ${tx.state}, Query start: ${tx.query_start}`);
    }
    
    const prismaSessions = await prisma.$queryRaw`
      SELECT pid, application_name, state, query
      FROM pg_stat_activity
      WHERE datname = current_database()
      AND application_name ILIKE '%prisma%'
    `;
    
    console.log(`\nSessions Prisma: ${prismaSessions.length}`);
    for (const session of prismaSessions) {
      console.log(`  PID: ${session.pid}, App: ${session.application_name}, State: ${session.state}`);
    }
    
    const pgbouncerSessions = await prisma.$queryRaw`
      SELECT pid, application_name, state
      FROM pg_stat_activity
      WHERE datname = current_database()
      AND application_name ILIKE '%pgbouncer%'
    `;
    
    console.log(`\nSessions pgbouncer: ${pgbouncerSessions.length}`);
    for (const session of pgbouncerSessions) {
      console.log(`  PID: ${session.pid}, App: ${session.application_name}, State: ${session.state}`);
    }
    
    const idleInTransaction = await prisma.$queryRaw`
      SELECT pid, state, query_start, state_change
      FROM pg_stat_activity
      WHERE datname = current_database()
      AND state = 'idle in transaction'
    `;
    
    console.log(`\nSessions idle in transaction: ${idleInTransaction.length}`);
    for (const session of idleInTransaction) {
      console.log(`  PID: ${session.pid}, Query start: ${session.query_start}, State change: ${session.state_change}`);
    }
    
    // PHASE 4: System info
    console.log('\n=== PHASE 4: System Info ===');
    const now = await prisma.$queryRaw`SELECT now() as now`;
    const currentDatabase = await prisma.$queryRaw`SELECT current_database() as current_database`;
    const currentUser = await prisma.$queryRaw`SELECT current_user() as current_user`;
    
    console.log(`Now: ${now[0].now}`);
    console.log(`Database: ${currentDatabase[0].current_database}`);
    console.log(`User: ${currentUser[0].current_user}`);
    
    // PHASE 5: Tables
    console.log('\n=== PHASE 5: Tables ===');
    
    const prismaMigrationsExists = await prisma.$queryRaw`
      SELECT COUNT(*) as count
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_name = '_prisma_migrations'
    `;
    console.log(`_prisma_migrations exists: ${prismaMigrationsExists[0].count > 0 ? 'YES' : 'NO'}`);
    
    const pgTables = await prisma.$queryRaw`
      SELECT schemaname, tablename
      FROM pg_tables
      WHERE schemaname = 'public'
      ORDER BY tablename
    `;
    console.log(`\npg_tables (public schema): ${pgTables.length} tables`);
    for (const table of pgTables) {
      console.log(`  ${table.schemaname}.${table.tablename}`);
    }
    
    const infoSchemaTables = await prisma.$queryRaw`
      SELECT table_schema, table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `;
    console.log(`\ninformation_schema.tables (public schema): ${infoSchemaTables.length} tables`);
    for (const table of infoSchemaTables) {
      console.log(`  ${table.table_schema}.${table.table_name}`);
    }
    
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }
  
  await prisma.$disconnect();
}

fullLockDiagnosis();
