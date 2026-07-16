SELECT pid, state, query, wait_event, backend_start
FROM pg_stat_activity
WHERE datname = 'postgres'
ORDER BY backend_start DESC;
