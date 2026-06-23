// app/auth/callback/route.ts
// Gère le callback OAuth, la confirmation email Supabase (PKCE + token_hash)
import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as
    | "signup"
    | "email"
    | "recovery"
    | "invite"
    | "magiclink"
    | "email_change"
    | null;
  const searchParam = searchParams.get("redirect") ?? searchParams.get("next");
  const allowedRedirects = [
    "/dashboard",
    "/interview-lab",
    "/truth-tunnel",
    "/premium",
    "/settings",
    "/onboarding",
  ];
  const redirectTo = allowedRedirects.includes(searchParam || "")
    ? searchParam!
    : "/dashboard";

  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: any[]) {
          cookiesToSet.forEach(({ name, value, options }: any) => {
            cookieStore.set(name, value, options);
          });
        },
      },
    },
  );

  // Méthode 1 : Vérification par token_hash (confirmation email directe)
  // C'est la méthode la plus fiable car elle ne dépend pas des cookies PKCE
  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({ token_hash, type });
    if (!error) {
      return NextResponse.redirect(`${origin}${redirectTo}`);
    }
    console.error("[Auth Callback] Token verification failed:", error.message);
    return NextResponse.redirect(
      `${origin}/auth/login?error=verification_failed`,
    );
  }

  // Méthode 2 : Échange de code PKCE (OAuth ou confirmation email via redirect Supabase)
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${redirectTo}`);
    }
    console.error("[Auth Callback] Code exchange failed:", error.message);
    // Si PKCE échoue, rediriger vers la page de confirmation avec un message explicite
    return NextResponse.redirect(`${origin}/auth/confirm?error=pkce_failed`);
  }

  // Aucun code ni token — lien invalide
  return NextResponse.redirect(`${origin}/auth/login?error=missing_code`);
}
