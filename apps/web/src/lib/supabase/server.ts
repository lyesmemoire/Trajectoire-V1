import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export function createSupabaseServerClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export const createClient = createSupabaseServerClient;
