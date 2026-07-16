SELECT pid, state, query_start, state_change
FROM pg_stat_activity
WHERE datname = 'postgres'
AND state = 'idle in transaction';
