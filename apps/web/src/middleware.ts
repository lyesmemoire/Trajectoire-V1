// apps/web/src/middleware.ts

import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

import {
  getCorrelationId,
  getCorrelationIdHeader,
} from "@/lib/correlation/correlationId";

import { logger } from "@/lib/logger";

import {
  AuthorizationV2,
  UserRole,
  SubscriptionPlan,
  type UserContext,
} from "@/lib/authorization/AuthorizationV2";

import { generateNonce } from "@/lib/security/nonce";
import { initializeCsrfToken } from "@/lib/security/csrf-middleware";

const CONFIG = {
  ALLOWED_ORIGINS: [
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    "http://localhost:3000",
    "http://localhost:3001",
    ...(process.env.NEXT_PUBLIC_ALLOWED_ORIGINS?.split(",") || []),
  ],
} as const;

const IS_DEV = process.env.NODE_ENV === "development";

const PUBLIC_PAGE_ROUTES = new Set([
  "/",
  "/login",
  "/signup",
  "/pricing",
  "/privacy",
  "/terms",
]);

const PUBLIC_API_PREFIXES = [
  "/api/auth",
  "/api/public",
  "/api/health",
] as const;

/**
 * MVP pages that are always private.
 *
 * AuthorizationV2 contains the broader authorization model, but these
 * explicit prefixes prevent an unknown page from silently becoming public
 * when no AuthorizationV2 rule currently exists for it.
 */
const AUTHENTICATED_PAGE_PREFIXES = [
  "/dashboard",
  "/history",
  "/simulation",
  "/report",
  "/analyze",
  "/interview",
  "/knowledge",
  "/matching",
  "/settings",
  "/onboarding",
  "/copilot",
] as const;

function matchesPathPrefix(
  pathname: string,
  prefix: string,
): boolean {
  return (
    pathname === prefix ||
    pathname.startsWith(`${prefix}/`)
  );
}

function isPublicRoute(
  pathname: string,
): boolean {
  if (PUBLIC_PAGE_ROUTES.has(pathname)) {
    return true;
  }

  return PUBLIC_API_PREFIXES.some((prefix) =>
    matchesPathPrefix(pathname, prefix),
  );
}

function isExplicitlyAuthenticatedPage(
  pathname: string,
): boolean {
  return AUTHENTICATED_PAGE_PREFIXES.some((prefix) =>
    matchesPathPrefix(pathname, prefix),
  );
}

function isApiRoute(
  pathname: string,
): boolean {
  return (
    pathname === "/api" ||
    pathname.startsWith("/api/")
  );
}

function buildCorsHeaders(
  correlationId: string,
  origin: string | null,
): Record<string, string> {
  const headers: Record<string, string> = {
    "Access-Control-Allow-Methods":
      "GET, POST, PUT, DELETE, OPTIONS",

    "Access-Control-Allow-Headers":
      "Content-Type, Authorization, x-request-id",

    "Access-Control-Max-Age": "86400",

    [getCorrelationIdHeader()]:
      correlationId,
  };

  if (
    origin &&
    CONFIG.ALLOWED_ORIGINS.includes(
      origin as (typeof CONFIG.ALLOWED_ORIGINS)[number],
    )
  ) {
    headers["Access-Control-Allow-Origin"] =
      origin;
  }

  return headers;
}

function applySecurityHeaders(
  response: NextResponse,
  scriptNonce: string,
  styleNonce: string,
): NextResponse {
  response.headers.set(
    "x-script-nonce",
    scriptNonce,
  );

  response.headers.set(
    "x-style-nonce",
    styleNonce,
  );

  response.headers.set(
    "X-Frame-Options",
    "DENY",
  );

  response.headers.set(
    "X-Content-Type-Options",
    "nosniff",
  );

  response.headers.set(
    "X-XSS-Protection",
    "1; mode=block",
  );

  response.headers.set(
    "Referrer-Policy",
    "strict-origin-when-cross-origin",
  );

  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=()",
  );

  if (IS_DEV) {
    response.headers.delete(
      "Content-Security-Policy",
    );

    response.headers.delete(
      "Content-Security-Policy-Report-Only",
    );

    return response;
  }

  const csp = [
    "default-src 'self';",

    `script-src 'self' 'nonce-${scriptNonce}' 'strict-dynamic' https://cdn.jsdelivr.net;`,

    `style-src 'self' 'nonce-${styleNonce}' https://cdn.jsdelivr.net;`,

    "img-src 'self' data: https:;",

    "font-src 'self' https://cdn.jsdelivr.net;",

    "connect-src 'self' https://*.supabase.co https://api.openai.com;",

    "frame-ancestors 'none';",

    "object-src 'none';",

    "upgrade-insecure-requests;",
  ].join(" ");

  response.headers.set(
    "Content-Security-Policy",
    csp,
  );

  response.headers.set(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains",
  );

  return response;
}

function applyHeaders(
  response: NextResponse,
  headers: Record<string, string>,
): NextResponse {
  for (
    const [key, value] of
    Object.entries(headers)
  ) {
    response.headers.set(
      key,
      value,
    );
  }

  return response;
}

function createRedirect(
  pathname: string,
  reason: string,
  requestUrl: string,
  correlationId: string,
): NextResponse {
  const loginUrl =
    new URL(
      "/login",
      requestUrl,
    );

  loginUrl.searchParams.set(
    "redirect",
    pathname,
  );

  loginUrl.searchParams.set(
    "reason",
    reason,
  );

  logger.info(
    {
      correlationId,
      pathname,
      reason,
    },
    "Middleware redirect",
  );

  return NextResponse.redirect(
    loginUrl,
  );
}

function createApiAuthorizationErrorResponse(
  reason: string,
  correlationId: string,
  corsHeaders: Record<string, string>,
  scriptNonce: string,
  styleNonce: string,
): NextResponse {
  const isAuthenticationRequired =
    reason === "Authentication required";

  const status =
    isAuthenticationRequired
      ? 401
      : 403;

  const response =
    NextResponse.json(
      {
        error:
          isAuthenticationRequired
            ? "authentication_required"
            : "access_denied",

        message:
          reason,

        correlationId,
      },
      {
        status,
      },
    );

  applyHeaders(
    response,
    corsHeaders,
  );

  applySecurityHeaders(
    response,
    scriptNonce,
    styleNonce,
  );

  response.headers.set(
    "Cache-Control",
    "no-store",
  );

  return response;
}
function createAuthenticationUnavailableResponse(
  request: NextRequest,
  correlationId: string,
  corsHeaders: Record<string, string>,
  scriptNonce: string,
  styleNonce: string,
): NextResponse {
  const pathname =
    request.nextUrl.pathname;

  logger.warn(
    {
      correlationId,
      pathname,
    },
    "Authentication service temporarily unavailable",
  );

  /*
   * Security invariant:
   *
   * If Supabase Auth cannot verify the current user, we do NOT:
   * - treat the user as anonymous;
   * - allow access to a private route;
   * - destroy/replace authentication cookies;
   * - redirect to login as if credentials were invalid.
   *
   * The request fails closed with HTTP 503.
   */
  if (isApiRoute(pathname)) {
    const response =
      NextResponse.json(
        {
          error:
            "authentication_unavailable",

          message:
            "Authentication service temporarily unavailable",

          correlationId,
        },
        {
          status: 503,
        },
      );

    applyHeaders(
      response,
      corsHeaders,
    );

    applySecurityHeaders(
      response,
      scriptNonce,
      styleNonce,
    );

    response.headers.set(
      "Retry-After",
      "3",
    );

    response.headers.set(
      "Cache-Control",
      "no-store",
    );

    return response;
  }

  const response =
    new NextResponse(
      `<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <meta
    name="viewport"
    content="width=device-width, initial-scale=1"
  />
  <title>Service temporairement indisponible</title>
</head>
<body>
  <main>
    <h1>Service temporairement indisponible</h1>
    <p>
      Nous ne pouvons pas vérifier votre session pour le moment.
      Veuillez réessayer dans quelques instants.
    </p>
  </main>
</body>
</html>`,
      {
        status: 503,

        headers: {
          "Content-Type":
            "text/html; charset=utf-8",

          "Cache-Control":
            "no-store",

          "Retry-After":
            "3",
        },
      },
    );

  applyHeaders(
    response,
    corsHeaders,
  );

  applySecurityHeaders(
    response,
    scriptNonce,
    styleNonce,
  );

  return response;
}

function createSupabaseClient(
  request: NextRequest,
) {
  let response =
    NextResponse.next({
      request,
    });

  const supabase =
    createServerClient(
      process.env
        .NEXT_PUBLIC_SUPABASE_URL!,

      process.env
        .NEXT_PUBLIC_SUPABASE_ANON_KEY!,

      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },

          setAll(cookiesToSet) {
            cookiesToSet.forEach(
              ({
                name,
                value,
              }) => {
                request.cookies.set(
                  name,
                  value,
                );
              },
            );

            response =
              NextResponse.next({
                request,
              });

            cookiesToSet.forEach(
              ({
                name,
                value,
                options,
              }) => {
                response.cookies.set(
                  name,
                  value,
                  options,
                );
              },
            );
          },
        },
      },
    );

  return {
    supabase,

    getResponse: () =>
      response,
  };
}

function isMissingAuthSession(
  error: unknown,
): boolean {
  if (
    !error ||
    typeof error !== "object"
  ) {
    return false;
  }

  const candidate =
    error as {
      name?: string;
      message?: string;
    };

  return (
    candidate.name ===
      "AuthSessionMissingError" ||
    candidate.message ===
      "Auth session missing!"
  );
}

async function buildUserContext(
  supabase:
    ReturnType<
      typeof createServerClient
    >,

  correlationId: string,
  pathname: string,
): Promise<UserContext | null> {
  /*
   * getUser() performs server-side verification against Supabase Auth.
   * We deliberately keep it as the authentication authority.
   *
   * Do not replace this with getSession() as an authorization shortcut:
   * getSession() alone would trust locally stored session information.
   */
  const {
    data: { user },
    error,
  } =
    await supabase.auth.getUser();

  if (error) {
    if (
      isMissingAuthSession(
        error,
      )
    ) {
      return null;
    }

    /*
     * Network/service failures are deliberately propagated.
     * The middleware will fail closed with HTTP 503 rather than
     * misclassifying the user as logged out.
     */
    throw error;
  }

  if (!user) {
    return null;
  }

  /*
   * Authentication has already been verified at this point.
   *
   * The application profile enriches authorization with role/plan,
   * but failure to read that profile must not invalidate a valid
   * Supabase authentication session.
   *
   * We fail down to the least-privileged application defaults.
   */
  const {
    data: profile,
    error: profileError,
  } =
    await supabase
      .from("users")
      .select("role, plan")
      .eq("id", user.id)
      .single();

  if (profileError) {
    logger.warn(
      {
        correlationId,
        pathname,
        userId:
          user.id,

        profileError: {
          code:
            profileError.code,

          message:
            profileError.message,
        },
      },
      "Authenticated user profile unavailable; using least-privileged defaults",
    );
  }

  return {
    userId:
      user.id,

    email:
      user.email || "",

    role:
      profile?.role ||
      UserRole.USER,

    plan:
      profile?.plan ||
      SubscriptionPlan.FREE,

    isAuthenticated:
      true,
  };
}

export async function middleware(
  request: NextRequest,
) {
  const pathname =
    request.nextUrl.pathname;

  const correlationId =
    getCorrelationId(
      request.headers,
    );

  const origin =
    request.headers.get(
      "origin",
    );

  logger.info(
    {
      correlationId,
      pathname,
      method:
        request.method,
    },
    "Middleware request",
  );

  const corsHeaders =
    buildCorsHeaders(
      correlationId,
      origin,
    );

  if (
    request.method ===
    "OPTIONS"
  ) {
    return NextResponse.json(
      {},
      {
        headers:
          corsHeaders,
      },
    );
  }

  const scriptNonce =
    generateNonce();

  const styleNonce =
    generateNonce();

  const {
    supabase,
    getResponse,
  } =
    createSupabaseClient(
      request,
    );

  if (
    isPublicRoute(
      pathname,
    )
  ) {
    const response =
      getResponse();

    applyHeaders(
      response,
      corsHeaders,
    );

    applySecurityHeaders(
      response,
      scriptNonce,
      styleNonce,
    );

    if (
      request.method ===
      "GET"
    ) {
      initializeCsrfToken(
        response,
      );
    }

    return response;
  }

  let userContext:
    UserContext | null =
    null;

  try {
    userContext =
      await buildUserContext(
        supabase,
        correlationId,
        pathname,
      );
  } catch (error) {
    logger.error(
      {
        correlationId,
        pathname,
        error,
      },
      "Supabase authentication verification failed in middleware",
    );

    /*
     * IMPORTANT:
     *
     * An infrastructure/Auth outage is not the same thing as
     * "the user is logged out".
     *
     * Fail closed with 503 and preserve the existing session.
     */
    return createAuthenticationUnavailableResponse(
      request,
      correlationId,
      corsHeaders,
      scriptNonce,
      styleNonce,
    );
  }

  /**
   * Explicit MVP authentication boundary.
   *
   * This executes before AuthorizationV2 so routes missing from its current
   * rule table cannot accidentally fall through as public.
   */
  if (
    isExplicitlyAuthenticatedPage(
      pathname,
    ) &&
    !userContext
  ) {
    return createRedirect(
      pathname,
      "Authentication required",
      request.url,
      correlationId,
    );
  }

  const auth =
    new AuthorizationV2(
      userContext,
    );

  const authResult =
    auth.checkAccess(
      pathname,
    );

  if (
    !authResult.allowed
  ) {
    const reason =
      authResult.reason ||
      "access_denied";

    /*
     * API contract:
     *
     * API consumers must receive an HTTP/JSON authorization response.
     * Redirecting an API request to /login causes HTTP clients to follow
     * the redirect and receive a misleading 200 text/html response.
     *
     * Browser page requests keep the existing login redirect behavior.
     */
    if (
      isApiRoute(
        pathname,
      )
    ) {
      return createApiAuthorizationErrorResponse(
        reason,
        correlationId,
        corsHeaders,
        scriptNonce,
        styleNonce,
      );
    }

    return createRedirect(
      pathname,
      reason,
      request.url,
      correlationId,
    );
  }

  const response =
    getResponse();

  applyHeaders(
    response,
    corsHeaders,
  );

  applySecurityHeaders(
    response,
    scriptNonce,
    styleNonce,
  );

  if (
    request.method ===
    "GET"
  ) {
    initializeCsrfToken(
      response,
    );
  }

  if (userContext) {
    response.headers.set(
      "x-user-id",
      userContext.userId,
    );

    response.headers.set(
      "x-user-role",
      userContext.role,
    );

    response.headers.set(
      "x-user-plan",
      userContext.plan,
    );
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|og-image.png|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};