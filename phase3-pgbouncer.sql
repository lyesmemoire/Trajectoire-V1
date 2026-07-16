SELECT pid, application_name, state
FROM pg_stat_activity
WHERE datname = 'postgres'
AND application_name ILIKE '%pgbouncer%';
