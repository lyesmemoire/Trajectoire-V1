-- Migration : durcir deux fonctions de `public` signalées par les conseillers Supabase (audit CTO 2026-10-02)
--
-- 1. handle_new_auth_user() : fonction de déclencheur SECURITY DEFINER (crée la ligne public.users à
--    l'inscription, déclencheur on_auth_user_created sur auth.users). Elle était exécutable par `anon` et
--    `authenticated` via /rest/v1/rpc/handle_new_auth_user. On retire EXECUTE à PUBLIC, anon et
--    authenticated. Sans effet sur le déclencheur : PostgreSQL ne vérifie le droit EXECUTE d'une fonction
--    de déclencheur qu'à la création du déclencheur, pas à son exécution.
--
-- 2. award_badges_for_user(uuid) : appelée par /api/simulation/end avec le client de l'utilisateur
--    (rôle `authenticated`) : EXECUTE est CONSERVÉ. Seul son search_path, non figé, est corrigé (le corps
--    de la fonction n'est pas modifié ; elle reste SECURITY INVOKER et donc soumise à la RLS).
--
-- Non inclus volontairement : déplacer l'extension `vector` hors de `public` (les requêtes Prisma qui
-- emploient le type `vector` sans préfixe cesseraient de fonctionner : search_path de `postgres`).
--
-- Retour arrière :
--   GRANT EXECUTE ON FUNCTION public.handle_new_auth_user() TO PUBLIC;
--   ALTER FUNCTION public.award_badges_for_user(uuid) RESET search_path;

REVOKE EXECUTE ON FUNCTION public.handle_new_auth_user() FROM PUBLIC, anon, authenticated;

ALTER FUNCTION public.award_badges_for_user(uuid) SET search_path = public;
