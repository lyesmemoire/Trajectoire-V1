// @ts-nocheck
import { createServerClient } from "@/lib/supabase/server";
import { supabase } from "@/lib/supabase/client";

export async function getServerDb() {
  return createServerClient();
}

export function getBrowserDb() {
  return supabase;
}
