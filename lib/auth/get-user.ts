import { NextRequest } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

/**
 * Retourne l'utilisateur authentifié (via getUser, pas getSession)
 * ou null si non authentifié.
 *
 * Usage standard dans toutes les routes API :
 *   const user = await getStrictUser(req);
 *   if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
 */
export async function getStrictUser(req?: NextRequest) {
  const supabase = await createServerClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return user;
}
