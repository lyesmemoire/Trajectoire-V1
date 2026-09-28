// apps/web/src/app/api/auth/callback/route.ts
//
// Callback Supabase (PKCE) : échange le `code` reçu par e-mail (confirmation
// d'inscription, réinitialisation de mot de passe…) contre une session,
// puis redirige vers `next` (par défaut /dashboard).
//
// Route publique : /api/auth est dans PUBLIC_API_PREFIXES (middleware.ts) et
// dans les règles AuthorizationV2 — aucune modification de ces fichiers requise.

import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { logger } from "@/lib/logger"

export const dynamic = "force-dynamic"

// N'autorise qu'une destination interne : jamais une redirection ouverte
// vers un domaine tiers construit depuis un paramètre de requête.
function sanitizeNext(value: string | null): string {
  if (!value) return "/dashboard"
  if (!value.startsWith("/")) return "/dashboard"
  if (value.startsWith("//")) return "/dashboard"
  return value
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const next = sanitizeNext(searchParams.get("next"))

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=missing_code`)
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    // Le message Supabase (ex. "code verifier could not be found") est
    // suffisamment générique pour être journalisé sans exposer de secret.
    logger.error({ err: error.message }, "[auth/callback] exchangeCodeForSession failed")
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent(error.message)}`,
    )
  }

  return NextResponse.redirect(`${origin}${next}`)
}
