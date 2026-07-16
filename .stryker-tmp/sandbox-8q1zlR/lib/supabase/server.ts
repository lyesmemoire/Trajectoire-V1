// @ts-nocheck
import { createServerClient as _createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { envServer } from "@/lib/env.server"

/**
 * Factory canonical du client Supabase côté serveur (Server Components,
 * Route Handlers, Server Actions). Instancie un client authentifié par
 * cookie, rafraîchit la session via le middleware.
 *
 * Utiliser `createServerClient()` partout. L'alias `createServerClientSupabase`
 * est conservé pour rétro-compatibilité et sera retiré une fois les imports
 * migrés.
 */
export async function createServerClient() {
  const cookieStore = await cookies()

  // Return a mock client if Supabase is not configured (for build time)
  if (!envServer.NEXT_PUBLIC_SUPABASE_URL || !envServer.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    // Return a minimal mock that won't crash during build
    return {
      auth: {
        getUser: async () => ({ data: { user: null }, error: null }),
        getSession: async () => ({ data: { session: null }, error: null }),
      },
    } as any
  }

  return _createServerClient<any>(
    envServer.NEXT_PUBLIC_SUPABASE_URL!,
    envServer.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options?: CookieOptions }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          } catch {
            // Server Component → ignoré (set impossible hors d'un Server Action / Route Handler)
          }
        },
      },
    }
  )
}

/** @deprecated utiliser `createServerClient`. Alias conservé pour rétro-compat. */
export const createServerClientSupabase = createServerClient

// Type local pour les options cookie — évite d'importer le type complet de @supabase/ssr
type CookieOptions = Record<string, unknown>
