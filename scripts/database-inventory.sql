-- ÉTAPE 1: INVENTAIRE COMPLET DE LA BASE DE DONNÉES

-- 1. Toutes les tables public existantes
SELECT 
    table_name,
    table_type
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- 2. Toutes les colonnes
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public'
ORDER BY table_name, ordinal_position;

-- 3. Toutes les clés primaires
SELECT 
    tc.table_name,
    kcu.column_name,
    tc.constraint_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
WHERE tc.table_schema = 'public'
    AND tc.constraint_type = 'PRIMARY KEY'
ORDER BY tc.table_name;

-- 4. Toutes les clés étrangères
SELECT 
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name,
    tc.constraint_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage ccu
    ON tc.constraint_name = ccu.constraint_name
    AND tc.table_schema = ccu.table_schema
WHERE tc.table_schema = 'public'
    AND tc.constraint_type = 'FOREIGN KEY'
ORDER BY tc.table_name;

-- 5. Tous les indexes
SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

-- 6. Extensions installées
SELECT extname, extversion, nspname
FROM pg_extension
JOIN pg_namespace ON pg_extension.extnamespace = pg_namespace.oid
ORDER BY extname;

-- 7. Existence de public."User"
SELECT 
    table_name,
    table_type
FROM information_schema.tables
WHERE table_schema = 'public'
    AND table_name = 'User';

-- 8. Structure exacte de public."User"
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default,
    character_maximum_length,
    numeric_precision,
    numeric_scale
FROM information_schema.columns
WHERE table_schema = 'public'
    AND table_name = 'User'
ORDER BY ordinal_position;

-- 9. Nombre de lignes dans User
SELECT 
    COUNT(*) as user_count
FROM "User";

-- 10. Vérification spécifique des tables Graph
SELECT 
    table_name
FROM information_schema.tables
WHERE table_schema = 'public'
    AND table_name IN (
        'graphs',
        'graph_nodes', 
        'graph_edges',
        'graph_versions',
        'graph_snapshots'
    )
ORDER BY table_name;

-- 11. Vérification de _prisma_migrations
SELECT 
    table_name
FROM information_schema.tables
WHERE table_schema = 'public'
    AND table_name = '_prisma_migrations';
