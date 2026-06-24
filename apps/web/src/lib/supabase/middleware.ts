import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/types/database";

function getEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    const isProduction = process.env.NODE_ENV === 'production';
    
    if (isProduction) {
      throw new Error(
        `[Trajectoire] Variable d'environnement manquante : ${name}\n` +
        `Cette variable est requise en production.`
      );
    }
    
    // En développement : log un warning et retourne un placeholder
    console.warn(
      `[Trajectoire] Variable d'environnement manquante : ${name}\n` +
      `Fonctionnalité limitée. Ajoutez cette variable dans .env.local pour activer toutes les features.`
    );
    
    // Placeholder pour permettre l'initialisation du client en dev
    if (name === "NEXT_PUBLIC_SUPABASE_URL") return "https://placeholder.supabase.co";
    if (name === "NEXT_PUBLIC_SUPABASE_ANON_KEY") return "placeholder-key-for-development";
    return "";
  }
  return value;
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    getEnvVar("NEXT_PUBLIC_SUPABASE_URL"),
    getEnvVar("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  const publicRoutes  = ["/", "/login", "/register", "/forgot-password"];
  const protectedRoutes = ["/dashboard"];

  const isProtected = protectedRoutes.some((r) => pathname.startsWith(r));
  const isPublic    = publicRoutes.includes(pathname);

  if (isProtected && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  if (isPublic && user && (pathname === "/login" || pathname === "/register")) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
