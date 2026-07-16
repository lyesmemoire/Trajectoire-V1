SELECT COUNT(*) as count
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name = '_prisma_migrations';
