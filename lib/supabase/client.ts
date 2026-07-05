import { createBrowserClient } from "@supabase/ssr"
import type { Database } from "@/types/database"
import { envClient } from "@/lib/env.client"

/**
 * Client Supabase côté navigateur. Clé anon publique (NEXT_PUBLIC_*),
 * sécurisée par RLS côté base.
 */
export function createBrowserClientSupabase() {
  // Check if Supabase is configured (for build time)
  if (!envClient.NEXT_PUBLIC_SUPABASE_URL || !envClient.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    // Return a mock client for build time
    return {
      auth: {
        signInWithOAuth: async () => ({ error: null }),
        signInWithPassword: async () => ({ error: null, data: { user: null, session: null } }),
        signOut: async () => ({ error: null }),
        getUser: async () => ({ data: { user: null }, error: null }),
        getSession: async () => ({ data: { session: null }, error: null }),
      },
    } as any
  }

  return createBrowserClient<any>(
    envClient.NEXT_PUBLIC_SUPABASE_URL!,
    envClient.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

/** Singleton navigateur. */
export const supabase = createBrowserClientSupabase()
