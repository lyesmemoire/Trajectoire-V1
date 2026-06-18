import { NextResponse } from "next/server";

/**
 * Route de test Sentry — DEV ONLY.
 * Déclenche volontairement une erreur pour vérifier que Sentry la capture.
 * GET /api/test-sentry
 */
export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not available in production" }, { status: 403 });
  }

  throw new Error("🔥 Sentry test error — this should appear in your Sentry dashboard");
}
