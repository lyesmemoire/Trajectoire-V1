/**
 * @deprecated Le singleton admin vit désormais dans `./admin` (qui lit la
 * variable d'environnement canonical `SUPABASE_SERVICE_ROLE_KEY`). Ce fichier
 * n'est conservé que pour rétro-compatibilité des imports existants :
 *
 *   import { supabaseAdmin } from "@/lib/supabase/service"
 *
 * Privilégier :
 *
 *   import { supabaseAdmin } from "@/lib/supabase/admin"
 */
// @ts-nocheck

export { supabaseAdmin, getSupabaseAdmin, createAdminClientSupabase } from "./admin"
