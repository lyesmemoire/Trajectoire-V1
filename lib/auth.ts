// lib/auth.ts
import { createServerClient } from "@/lib/supabase/server";

/**
 * Retourne l'utilisateur authentifié ou null.
 */
export async function getAuthenticatedUser() {
  const supabase = await createServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) return null;
  return user;
}

/**
 * Retourne l'utilisateur ou lève une erreur Unauthorized.
 */
export async function requireAuth() {
  const user = await getAuthenticatedUser();
  if (!user) throw new Error("Unauthorized");
  return user;
}
