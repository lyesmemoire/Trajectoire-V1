import "server-only"

import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import type { Database } from "@/types/supabase.generated"

/**
 * Supabase server client.
 *
 * Uses the authenticated user's SSR cookies.
 *
 * IMPORTANT:
 * - Never use SUPABASE_SERVICE_ROLE_KEY here.
 * - The service-role client belongs in ./service.ts.
 * - Session refresh is handled by middleware.
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
             * Middleware is responsible for refreshing the Supabase
             * session and persisting refreshed cookies to the response.
             */
          }
        },
      },
    }
  )
}

export const createClient = createSupabaseServerClient