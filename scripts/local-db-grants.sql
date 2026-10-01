-- ============================================================================================================
-- LOCAL UNIQUEMENT : droits des rôles Supabase sur le schéma public d'une base reconstruite à la main.
-- Ce n'est PAS une migration : ne jamais le placer dans prisma/migrations/ ni supabase/migrations/, ne jamais
-- l'exécuter contre la base distante (production).
--
-- Pourquoi : la base locale a été reconstruite depuis un export `pg_dump --schema-only --no-privileges`
-- (voir .claude/tasks.md, « Reconstruire une base locale »). Sans privilèges, `anon`, `authenticated` et
-- `service_role` n'ont aucun droit sur les tables : les appels Supabase de l'application (PostgREST, jeton
-- utilisateur) échouent en « permission denied ». Prisma (rôle `postgres`) n'est pas concerné.
--
-- Ce que fait le script :
--   1. recrée les droits que Supabase accorde par défaut sur `public` (ALL sur tables, fonctions et séquences
--      à anon, authenticated, service_role) et les droits par défaut des objets futurs ;
--   2. rejoue les durcissements connus des migrations Prisma, que l'export sans privilèges avait effacés
--      (20261004 : fonction handle_new_auth_user ; 20261005 : tables du radar).
--
-- Limite connue : la production est PLUS restrictive que les valeurs par défaut de Supabase sur plusieurs tables
-- (la migration 20261003 constate que anon et authenticated n'avaient aucun droit sur ~41 tables). Ces
-- restrictions ne sont pas reconstituées ici. La protection reste assurée en local par la RLS (activée par
-- l'export : une table sans politique refuse tout), mais le local est plus permissif que la production au niveau
-- des droits. Pour une copie fidèle, refaire l'export avec les privilèges (sans --no-privileges).
--
-- Usage (PowerShell, conteneur Supabase local) :
--   Get-Content scripts\local-db-grants.sql | docker exec -i supabase_db_Trajectoire psql -U postgres -d postgres -v ON_ERROR_STOP=1
--
-- Idempotent : peut être rejoué sans effet de bord. Les avertissements « no privileges were granted for
-- array_to_vector… » viennent des fonctions de l'extension vector (propriété d'un autre rôle) : sans importance.
-- ============================================================================================================

-- 1. Droits par défaut de Supabase sur public --------------------------------------------------------------
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

GRANT ALL ON ALL TABLES    IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES  IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;

-- Objets créés plus tard par `postgres` (migrations, prisma migrate deploy) : mêmes droits.
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES    TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON ROUTINES  TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;

-- 2. Durcissements des migrations Prisma, rejoués ------------------------------------------------------------
-- 20261004_harden_public_functions : la fonction du déclencheur d'inscription n'est pas appelable via l'API.
REVOKE EXECUTE ON FUNCTION public.handle_new_auth_user() FROM PUBLIC, anon, authenticated;

-- 20261005_add_job_radar_tables : le catalogue et les recherches du radar ne sont lus que par le serveur.
REVOKE ALL ON "public"."market_offers"   FROM anon, authenticated;
REVOKE ALL ON "public"."radar_searches"  FROM anon, authenticated;
REVOKE ALL ON "public"."radar_matches"   FROM anon, authenticated;
REVOKE ALL ON "public"."radar_sync_runs" FROM anon, authenticated;
