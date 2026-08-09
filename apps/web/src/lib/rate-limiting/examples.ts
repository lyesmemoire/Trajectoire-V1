// lib/rate-limiting/examples.ts
//
// EXAMPLES OF RATE LIMITING IMPLEMENTATION
// Shows how to apply rate limiting to different types of API routes

import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "./rate-limit.middleware";
import { RouteType, RateLimitScope } from "./centralized-rate-limit.service";

// ============================================================
// EXAMPLE 1: Basic API Route with Default Rate Limiting
// ============================================================

export const GET = rateLimit(RouteType.API, async (req: NextRequest) => {
  // Your route handler logic here
  return NextResponse.json({ message: "Success" });
});

// ============================================================
// EXAMPLE 2: Auth Route with IP-Only Rate Limiting
// ============================================================

export const POST_auth = rateLimit(
  RouteType.AUTH,
  async (req: NextRequest) => {
    // Auth endpoint logic (login, signup, etc.)
    const body = await req.json();
    return NextResponse.json({ authenticated: true });
  },
  {
    scopes: [RateLimitScope.IP], // Only rate limit by IP for auth
  }
);

// ============================================================
// EXAMPLE 3: Upload Route with User + IP Rate Limiting
// ============================================================

export const POST_upload = rateLimit(
  RouteType.UPLOAD,
  async (req: NextRequest) => {
    // File upload logic
    const formData = await req.formData();
    const file = formData.get("file");
    
    // Process upload...
    return NextResponse.json({ uploaded: true });
  },
  {
    scopes: [RateLimitScope.USER, RateLimitScope.IP], // Rate limit by both user and IP
  }
);

// ============================================================
// EXAMPLE 4: Copilot Route with Custom Scope Configuration
// ============================================================

export const POST_copilot = rateLimit(
  RouteType.COPILOT,
  async (req: NextRequest) => {
    // AI copilot logic
    const body = await req.json();
    return NextResponse.json({ response: "AI response" });
  },
  {
    scopes: [RateLimitScope.USER, RateLimitScope.SESSION], // Rate limit by user and session
  }
);

// ============================================================
// EXAMPLE 5: Search Route with Organization-Level Rate Limiting
// ============================================================

export const GET_search = rateLimit(
  RouteType.SEARCH,
  async (req: NextRequest) => {
    // Search logic
    const query = req.nextUrl.searchParams.get("q");
    return NextResponse.json({ results: [] });
  },
  {
    scopes: [RateLimitScope.USER, RateLimitScope.ORGANISATION], // Rate limit by user and org
  }
);

// ============================================================
// EXAMPLE 6: Manual Rate Limit Check for Custom Logic
// ============================================================

import { checkRateLimitManual } from "./rate-limit.middleware";

export async function POST_customRateLimit(req: NextRequest) {
  // Manual rate limit check
  const { allowed, headers } = await checkRateLimitManual(
    req,
    RouteType.API,
    [RateLimitScope.USER, RateLimitScope.IP]
  );

  if (!allowed) {
    return NextResponse.json(
      { error: "Rate limit exceeded" },
      {
        status: 429,
        headers: headers ? Object.entries(headers).map(([k, v]) => [k, String(v)]) as [string, string][] : [],
      }
    );
  }

  // Your custom logic here
  return NextResponse.json({ success: true });
}

// ============================================================
// EXAMPLE 7: Stripe Webhook with IP-Only Rate Limiting
// ============================================================

export const POST_stripeWebhook = rateLimit(
  RouteType.STRIPE,
  async (req: NextRequest) => {
    // Stripe webhook logic
    const body = await req.text();
    const sig = req.headers.get("stripe-signature");
    
    // Verify webhook signature...
    return NextResponse.json({ received: true });
  },
  {
    scopes: [RateLimitScope.IP], // Only rate limit by IP for webhooks
  }
);

// ============================================================
// EXAMPLE 8: Dashboard Route with User-Only Rate Limiting
// ============================================================

export const GET_dashboard = rateLimit(
  RouteType.DASHBOARD,
  async (req: NextRequest) => {
    // Dashboard data fetch logic
    return NextResponse.json({ data: {} });
  },
  {
    scopes: [RateLimitScope.USER], // Only rate limit by user (no IP limit)
  }
);

// ============================================================
// EXAMPLE 9: Simulation Route with Session-Aware Rate Limiting
// ============================================================

export const POST_simulation = rateLimit(
  RouteType.SIMULATION,
  async (req: NextRequest) => {
    // Interview simulation logic
    const body = await req.json();
    return NextResponse.json({ sessionId: "123" });
  },
  {
    scopes: [RateLimitScope.USER, RateLimitScope.SESSION], // Track by user and session
  }
);

// ============================================================
// EXAMPLE 10: Matching Route with Multi-Scope Rate Limiting
// ============================================================

export const POST_matching = rateLimit(
  RouteType.MATCHING,
  async (req: NextRequest) => {
    // Job/candidate matching logic
    const body = await req.json();
    return NextResponse.json({ matches: [] });
  },
  {
    scopes: [RateLimitScope.USER, RateLimitScope.ORGANISATION, RateLimitScope.IP],
  }
);

// ============================================================
// EXAMPLE 11: Graph Route with Burst Capacity
// ============================================================

export const GET_graph = rateLimit(
  RouteType.GRAPH,
  async (req: NextRequest) => {
    // Knowledge graph query logic
    const query = req.nextUrl.searchParams.get("query");
    return NextResponse.json({ nodes: [], edges: [] });
  },
  {
    scopes: [RateLimitScope.USER, RateLimitScope.IP],
  }
);

// ============================================================
// EXAMPLE 12: Conditional Rate Limiting Based on User Tier
// ============================================================

export async function GET_conditionalRateLimit(req: NextRequest) {
  // Check user tier (premium users get higher limits)
  const userTier = req.headers.get("x-user-tier") || "free";
  
  const routeType = userTier === "premium" ? RouteType.API : RouteType.API;
  // Note: You would need to implement tier-specific route types or configs
  
  const { allowed } = await checkRateLimitManual(
    req,
    routeType,
    [RateLimitScope.USER]
  );

  if (!allowed) {
    return NextResponse.json(
      { error: "Rate limit exceeded", upgradeUrl: "/pricing" },
      { status: 429 }
    );
  }

  return NextResponse.json({ data: {} });
}
