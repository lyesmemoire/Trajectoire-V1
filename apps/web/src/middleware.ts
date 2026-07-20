// apps/web/src/middleware.ts
//
// VERSION L1.2 — Middleware Premium
// PRÉCÉDENT : Auth Supabase + Request ID + CORS + Security headers
// AJOUTS    : Premium guard + Admin guard
// DÉPENDANCES : Supabase SSR uniquement (Edge compatible)
//
// ARCHITECTURE :
//   Le middleware Edge vérifie l'authentification via Supabase.
//   La vérification Premium se fait via une route API dédiée
//   car Prisma ne fonctionne pas dans l'Edge Runtime.
//
// TODO-L1.1 : Rien à modifier ici quand Stripe arrive.
//             Le webhook Stripe met à jour la BDD.
//             Ce middleware lit la BDD via /api/auth/check-access.
//             (Architecture déjà prête pour Stripe)

import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { getCorrelationId, setCorrelationId, getCorrelationIdHeader } from "@/lib/correlation/correlationId";

// Allowed origins for CORS
const ALLOWED_ORIGINS = [
  process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  "http://localhost:3000",
  "http://localhost:3001",
  ...(process.env.NEXT_PUBLIC_ALLOWED_ORIGINS?.split(",") || []),
];

// ============================================================
// CLASSIFICATION DES ROUTES
// ============================================================

const PUBLIC_ROUTES = [
  '/',
  '/features',
  '/pricing',
  '/faq',
  '/about',
  '/contact',
  '/blog',
  '/login',
  '/signup',
];

const PUBLIC_PREFIXES = [
  '/auth',
  '/api/auth',
  '/api/stripe/webhook',  // CRITIQUE — jamais bloquer
  '/api/health',
  '/_next',
  '/static',
];

const PUBLIC_FILES = [
  '/favicon.ico',
  '/robots.txt',
  '/sitemap.xml',
];

// Routes nécessitant login mais pas d'abonnement
const AUTH_ONLY_PREFIXES = [
  '/onboarding',
  '/api/cv',
  '/api/user',
];

// Routes nécessitant login + abonnement actif
const PREMIUM_PREFIXES = [
  '/dashboard',
  '/simulation',
  '/report',
  '/history',
  '/settings',
  '/api/simulation',
  '/api/report',
  '/api/interview',
];

// Routes nécessitant login + rôle admin
const ADMIN_PREFIXES = [
  '/admin',
  '/api/admin',
];

// ============================================================
// HELPERS DE CLASSIFICATION
// ============================================================

function isPublicRoute(pathname: string): boolean {
  if (PUBLIC_FILES.includes(pathname)) return true;
  if (PUBLIC_ROUTES.includes(pathname)) return true;
  if (PUBLIC_PREFIXES.some(prefix => pathname.startsWith(prefix))) return true;
  return false;
}

function isAuthOnlyRoute(pathname: string): boolean {
  return AUTH_ONLY_PREFIXES.some(prefix => pathname.startsWith(prefix));
}

function isPremiumRoute(pathname: string): boolean {
  return PREMIUM_PREFIXES.some(prefix => pathname.startsWith(prefix));
}

function isAdminRoute(pathname: string): boolean {
  return ADMIN_PREFIXES.some(prefix => pathname.startsWith(prefix));
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const correlationId = getCorrelationId(request.headers);
  const origin = request.headers.get("origin");

  // CORS headers
  const corsHeaders: Record<string, string> = {
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, x-request-id",
    "Access-Control-Max-Age": "86400",
    [getCorrelationIdHeader()]: correlationId,
  };

  // Add origin if allowed
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    corsHeaders["Access-Control-Allow-Origin"] = origin;
  }

  // Handle preflight requests
  if (request.method === "OPTIONS") {
    return NextResponse.json({}, { headers: corsHeaders });
  }

  // 1. Routes publiques — passer directement
  if (isPublicRoute(pathname)) {
    const response = NextResponse.next();
    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
    response.headers.set(getCorrelationIdHeader(), correlationId);
    return response;
  }

  let supabaseResponse = NextResponse.next({
    request,
  });

  // Add CORS headers and correlation ID to response
  Object.entries(corsHeaders).forEach(([key, value]) => {
    supabaseResponse.headers.set(key, value);
  });

  // Security headers
  supabaseResponse.headers.set("Content-Security-Policy", 
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net; " +
    "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; " +
    "img-src 'self' data: https:; " +
    "font-src 'self' https://cdn.jsdelivr.net; " +
    "connect-src 'self' https://*.supabase.co https://api.openai.com; " +
    "frame-ancestors 'none';"
  );
  supabaseResponse.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  supabaseResponse.headers.set("X-Frame-Options", "DENY");
  supabaseResponse.headers.set("X-Content-Type-Options", "nosniff");
  supabaseResponse.headers.set("X-XSS-Protection", "1; mode=block");
  supabaseResponse.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  supabaseResponse.headers.set("Permissions-Policy", 
    "camera=(), microphone=(), geolocation=(), payment=()"
  );

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://dummy.supabase.co",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "dummy",
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: any[]) { // eslint-disable-line @typescript-eslint/no-explicit-any
          cookiesToSet.forEach(({ name, value }: any) => request.cookies.set(name, value)); // eslint-disable-line @typescript-eslint/no-explicit-any
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }: any) => // eslint-disable-line @typescript-eslint/no-explicit-any
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session if expired - required for Server Components
  const { data: { user } } = await supabase.auth.getUser();

  // 2. Route nécessitant authentification — rediriger si non connecté
  if (!user) {
    if (isAuthOnlyRoute(pathname) || isPremiumRoute(pathname) || isAdminRoute(pathname)) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    return supabaseResponse;
  }

  // 3. Route AUTH ONLY — utilisateur connecté, accès accordé
  if (isAuthOnlyRoute(pathname)) {
    return supabaseResponse;
  }

  // 4. Route ADMIN — vérifier le rôle via header
  if (isAdminRoute(pathname)) {
    // La vérification précise du rôle se fait dans les pages/API admin
    // Le middleware vérifie uniquement l'authentification
    // Un utilisateur non-admin verra une page 403 dans la route elle-même
    supabaseResponse.headers.set('x-user-id', user.id);
    return supabaseResponse;
  }

  // 5. Route PREMIUM — vérifier l'abonnement
  if (isPremiumRoute(pathname)) {
    const accessResponse = await checkPremiumAccess(request, user.id, pathname);
    if (accessResponse) return accessResponse;
  }

  // 6. Ajouter le user ID aux headers pour les routes qui en ont besoin
  supabaseResponse.headers.set('x-user-id', user.id);

  return supabaseResponse;
}

// ============================================================
// VÉRIFICATION PREMIUM
// Via route API interne — Prisma non disponible dans Edge
// ============================================================

async function checkPremiumAccess(
  request: NextRequest,
  userId: string,
  originalPath: string
): Promise<NextResponse | null> {

  try {
    // Appel à la route interne de vérification d'accès
    const checkUrl = new URL('/api/auth/check-access', request.url);

    const checkResponse = await fetch(checkUrl.toString(), {
      method: 'GET',
      headers: {
        // Transmettre les cookies pour l'authentification
        'Cookie': request.headers.get('cookie') ?? '',
        'x-user-id': userId,
        'x-internal-request': 'middleware',
      },
    });

    if (!checkResponse.ok) {
      // Fail closed avec logging détaillé
      console.error("[Middleware] check-access failed:", {
        status: checkResponse.status,
        userId,
        pathname: originalPath,
      });
      const pricingUrl = new URL('/pricing', request.url);
      pricingUrl.searchParams.set('redirect', originalPath);
      pricingUrl.searchParams.set('reason', 'access_check_failed');
      return NextResponse.redirect(pricingUrl);
    }

    const { hasAccess } = await checkResponse.json();

    if (!hasAccess) {
      // Rediriger vers pricing en conservant l'URL d'origine
      const pricingUrl = new URL('/pricing', request.url);
      pricingUrl.searchParams.set('redirect', originalPath);
      pricingUrl.searchParams.set('reason', 'premium_required');
      return NextResponse.redirect(pricingUrl);
    }

    return null; // Accès accordé

  } catch (error) {
    console.error("[Middleware] check-access error:", {
      error: error instanceof Error ? error.message : error,
      userId,
      pathname: originalPath,
    });
    const pricingUrl = new URL('/pricing', request.url);
    pricingUrl.searchParams.set('redirect', originalPath);
    pricingUrl.searchParams.set('reason', 'access_check_error');
    return NextResponse.redirect(pricingUrl);
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|og-image.png|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
