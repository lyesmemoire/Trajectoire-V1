import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import type { Database } from "@/types/database"

/**
 * Canonical Supabase server client.
 *
 * Used by:
 * - Server Components
 * - Route Handlers
 * - Server Actions
 *
 * Authentication is read from the Supabase SSR cookies.
 *
 * IMPORTANT:
 * This client MUST NOT use SUPABASE_SERVICE_ROLE_KEY.
 * The service-role client lives in ./service.ts.
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },

        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          } catch {
            /**
             * Server Components cannot always mutate cookies.
             *
             * Session refresh is handled by middleware.
             */
          }
        },
      },
    },
  )
}

export const createClient = createSupabaseServerClient