import { createSupabaseServerClient } from "@/lib/supabase/server";
import { supabase } from "@/lib/supabase/client";

export async function getServerDb() {
  return createSupabaseServerClient();
}

export function getBrowserDb() {
  return supabase;
}
