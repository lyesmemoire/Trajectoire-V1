SELECT COUNT(*) as _prisma_migrations_exists
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name = '_prisma_migrations';
