// apps/web/src/app/api/auth/callback/route.ts
//
// Callback Supabase : transforme le lien reçu par e-mail (confirmation
// d'inscription, réinitialisation de mot de passe, changement d'e-mail…) en
// session, puis redirige vers `next` (par défaut /dashboard).
//
// Trois formes de lien sont gérées :
//   - `?code=…`                  → flux PKCE (exchangeCodeForSession)
//   - `?token_hash=…&type=…`     → template e-mail à jeton (verifyOtp)
//   - `?error=…&error_code=…`    → Supabase a refusé le lien en amont
//
// Les erreurs sont renvoyées vers /login sous forme de CODE court
// (`?error=link_expired`), jamais avec le message brut de Supabase : la page
// de connexion le traduit. Le détail reste dans les logs serveur.
//
// Route publique : /api/auth est dans PUBLIC_API_PREFIXES (middleware.ts) et
// dans les règles AuthorizationV2 — aucune modification de ces fichiers requise.

import { NextRequest, NextResponse } from "next/server"
import type { EmailOtpType } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/server"
import { logger } from "@/lib/logger"
import { PreviewTransferService } from "@/lib/preview/PreviewTransferService"

export const dynamic = "force-dynamic"

// Témoin posé quand le lien mène à la réinitialisation du mot de passe :
// /reset-password ne s'ouvre qu'avec lui (sinon n'importe quelle session
// ouverte pourrait y changer son mot de passe). Garde d'usage côté client,
// pas une barrière de sécurité : Supabase reste l'autorité sur updateUser.
const RECOVERY_COOKIE = "pw_recovery"

// Jeton de l'analyse preview anonyme, posé par /signup : la confirmation
// d'e-mail s'ouvre souvent dans un autre onglet, où le sessionStorage de
// l'onglet d'origine est perdu. Le claim se fait donc ici, côté serveur, dès
// que la session existe.
const PREVIEW_COOKIE = "preview_token"

const OTP_TYPES: readonly EmailOtpType[] = [
  "signup",
  "invite",
  "magiclink",
  "recovery",
  "email_change",
  "email",
]

function isOtpType(value: string | null): value is EmailOtpType {
  return value !== null && (OTP_TYPES as readonly string[]).includes(value)
}

// N'autorise qu'une destination interne : jamais une redirection ouverte
// vers un domaine tiers construit depuis un paramètre de requête.
function sanitizeNext(value: string | null, fallback: string): string {
  if (!value) return fallback
  if (!value.startsWith("/")) return fallback
  if (value.startsWith("//")) return fallback
  if (value.startsWith("/\\")) return fallback
  return value
}

function loginError(origin: string, code: string): NextResponse {
  return NextResponse.redirect(`${origin}/login?error=${code}`)
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)

  const type = searchParams.get("type")
  const defaultNext = type === "recovery" ? "/reset-password" : "/dashboard"
  const next = sanitizeNext(searchParams.get("next"), defaultNext)

  // Supabase signale lui-même un lien refusé (expiré, déjà utilisé…).
  const providerError = searchParams.get("error")
  if (providerError) {
    const providerCode = searchParams.get("error_code")
    logger.warn(
      { error: providerError, errorCode: providerCode },
      "[auth/callback] lien refusé par Supabase",
    )
    return loginError(
      origin,
      providerCode === "otp_expired" ? "link_expired" : "link_invalid",
    )
  }

  const code = searchParams.get("code")
  const tokenHash = searchParams.get("token_hash")

  if (!code && !(tokenHash && isOtpType(type))) {
    return loginError(origin, "missing_code")
  }

  const supabase = await createClient()

  const { error } = code
    ? await supabase.auth.exchangeCodeForSession(code)
    : await supabase.auth.verifyOtp({
        type: type as EmailOtpType,
        token_hash: tokenHash as string,
      })

  if (error) {
    // Le message Supabase (ex. "code verifier could not be found") est
    // suffisamment générique pour être journalisé sans exposer de secret.
    logger.error({ err: error.message }, "[auth/callback] échange de session échoué")
    return loginError(origin, "link_invalid")
  }

  const response = NextResponse.redirect(`${origin}${next}`)

  const previewToken = request.cookies.get(PREVIEW_COOKIE)?.value
  if (previewToken) {
    // Jamais bloquant : un claim raté (jeton expiré, déjà consommé) ne doit pas
    // empêcher la connexion. Le témoin est supprimé dans tous les cas.
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        const result = await PreviewTransferService.transferPreviewToUser(
          previewToken,
          user.id,
        )
        if (!result.success) {
          logger.warn(
            { userId: user.id, reason: result.error },
            "[auth/callback] claim de la preview refusé",
          )
        }
      }
    } catch (err) {
      logger.error({ err }, "[auth/callback] claim de la preview échoué")
    }

    response.cookies.delete(PREVIEW_COOKIE)
  }

  if (next === "/reset-password") {
    response.cookies.set(RECOVERY_COOKIE, "1", {
      maxAge: 15 * 60,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    })
  }

  return response
}
