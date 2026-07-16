-- PHASE 1: pg_stat_activity
SELECT '=== PHASE 1: pg_stat_activity ===' as phase;
SELECT pid, state, query, wait_event, backend_start
FROM pg_stat_activity
WHERE datname = current_database()
ORDER BY backend_start DESC;

-- PHASE 2: pg_locks
SELECT '=== PHASE 2: pg_locks ===' as phase;
SELECT l.relation::text as relation, l.mode, l.granted, l.pid
FROM pg_locks l
JOIN pg_database d ON l.database = d.oid
WHERE d.datname = current_database()
ORDER BY l.granted, l.relation;

-- PHASE 3: Identification
SELECT '=== PHASE 3: Identification ===' as phase;
SELECT 'Transactions ouvertes' as info;
SELECT pid, state, query_start, state_change
FROM pg_stat_activity
WHERE datname = current_database()
AND state IN ('active', 'idle in transaction')
ORDER BY state_change;

SELECT 'Sessions Prisma' as info;
SELECT pid, application_name, state, query
FROM pg_stat_activity
WHERE datname = current_database()
AND application_name ILIKE '%prisma%';

SELECT 'Sessions pgbouncer' as info;
SELECT pid, application_name, state
FROM pg_stat_activity
WHERE datname = current_database()
AND application_name ILIKE '%pgbouncer%';

SELECT 'Sessions idle in transaction' as info;
SELECT pid, state, query_start, state_change
FROM pg_stat_activity
WHERE datname = current_database()
AND state = 'idle in transaction';

-- PHASE 4: System info
SELECT '=== PHASE 4: System Info ===' as phase;
SELECT now(), current_database(), current_user();

-- PHASE 5: Tables
SELECT '=== PHASE 5: Tables ===' as phase;
SELECT '_prisma_migrations exists' as info;
SELECT COUNT(*) > 0 as exists
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name = '_prisma_migrations';

SELECT 'pg_tables (public schema)' as info;
SELECT schemaname, tablename
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
