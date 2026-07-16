SELECT COUNT(*) as count FROM pg_tables WHERE schemaname = 'public' AND tablename = '_prisma_migrations';
