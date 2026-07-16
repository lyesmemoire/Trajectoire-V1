SELECT l.relation::text as relation, l.mode, l.granted, l.pid
FROM pg_locks l
JOIN pg_database d ON l.database = d.oid
WHERE d.datname = 'postgres'
ORDER BY l.granted, l.relation;
