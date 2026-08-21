import "server-only";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";

import { envServer } from "@/lib/env.server";
import type { Database } from "@/types/supabase.generated";

/**
 * Service-role Supabase client.
 *
 * SECURITY:
 * - bypasses RLS
 * - must never be exposed to browser code
 * - intended for trusted server-side operations only
 *
 * Database typing is generated directly from the current Supabase schema.
 */

let adminClient:
  | ReturnType<typeof createSupabaseClient<Database>>
  | null = null;

export function createAdminClient() {
  if (adminClient) {
    return adminClient;
  }

  adminClient = createSupabaseClient<Database>(
    envServer.NEXT_PUBLIC_SUPABASE_URL,
    envServer.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false,
      },
    },
  );

  return adminClient;
}
