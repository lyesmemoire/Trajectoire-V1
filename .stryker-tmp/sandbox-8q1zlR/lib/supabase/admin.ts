// @ts-nocheck
import { createClient, type SupabaseClient } from "@supabase/supabase-js"
import { envServer } from "@/lib/env.server"

/**
 * Source unique pour les clients admin Supabase (clé service role).
 *
 * ⚠️ La clé service role contourne la RLS — à n'utiliser que côté serveur,
 * jamais exposée au client.
 *
 * Lit `SUPABASE_SERVICE_ROLE_KEY` (variable canonical, cf. .env.example).
 */

export function createAdminClientSupabase(): SupabaseClient<any> {
  if (!envServer.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY manquant — ne jamais exposer côté client"
    )
  }
  return createClient<any>(
    envServer.NEXT_PUBLIC_SUPABASE_URL!,
    envServer.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}

/**
 * Singleton admin partagé. Le client admin ne portant aucun contexte
 * utilisateur (RLS désactivée par construction), une instance partagée
 * est sûre et évite de recréer un client à chaque appel.
 *
 * Initialisation paresseuse : `getSupabaseAdmin()` crée l'instance au premier
 * appel. `supabaseAdmin` (ci-dessous) expose cette instance via un Proxy pour
 * préserver l'ergonomie d'un import direct tout en restant lazy.
 */
let _supabaseAdmin: SupabaseClient<any> | null = null

export function getSupabaseAdmin(): SupabaseClient<any> {
  if (!_supabaseAdmin) {
    _supabaseAdmin = createAdminClientSupabase()
  }
  return _supabaseAdmin
}

/**
 * Singleton admin accessible directement (`supabaseAdmin.from(...)`).
 * Délègue à `getSupabaseAdmin()` via Proxy pour rester lazy : la clé service
 * role n'est lue qu'au premier accès, ce qui permet à ce module d'être
 * importé côté build sans planter si l'env n'est pas chargé.
 */
export const supabaseAdmin: SupabaseClient<any> = new Proxy(
  {} as SupabaseClient<any>,
  {
    get(_target, prop, receiver) {
      const client = getSupabaseAdmin()
      const value = Reflect.get(client, prop, client)
      return typeof value === "function" ? value.bind(client) : value
    },
  }
)
