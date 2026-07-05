/**
 * Barrel — source canonical d'imports Supabase.
 *
 *   - Navigateur : `supabase`, `createBrowserClientSupabase`
 *   - Serveur    : `createServerClient` (alias déprécié `createServerClientSupabase`)
 *   - Admin      : `supabaseAdmin` (singleton), `createAdminClientSupabase` (factory),
 *                  `getSupabaseAdmin` (lazy init)
 */
export { supabase, createBrowserClientSupabase } from "./client"
export {
  supabaseAdmin,
  getSupabaseAdmin,
  createAdminClientSupabase,
} from "./admin"
export { createServerClient, createServerClientSupabase } from "./server"
