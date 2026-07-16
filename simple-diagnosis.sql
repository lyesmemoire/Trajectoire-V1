-- PHASE 1: pg_stat_activity
SELECT pid, state, query, wait_event, backend_start
FROM pg_stat_activity
WHERE datname = current_database()
ORDER BY backend_start DESC;

-- PHASE 2: pg_locks
SELECT l.relation::text as relation, l.mode, l.granted, l.pid
FROM pg_locks l
JOIN pg_database d ON l.database = d.oid
WHERE d.datname = current_database()
ORDER BY l.granted, l.relation;

-- PHASE 4: System info
SELECT now(), current_database(), current_user();

-- PHASE 5: Tables
SELECT COUNT(*) > 0 as _prisma_migrations_exists
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name = '_prisma_migrations';

SELECT schemaname, tablename
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
