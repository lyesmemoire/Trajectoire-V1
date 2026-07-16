import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export const dynamic = "force-dynamic";

const OAuthRequestSchema = z.object({
  provider: z.enum(["google", "microsoft"]),
  redirect: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const input = OAuthRequestSchema.parse(body);

    // OAuth flow requires client-side redirect
    // This endpoint returns the OAuth URL for the client to redirect to
    const origin = process.env.NEXT_PUBLIC_APP_URL || req.headers.get("origin") || "http://localhost:3000";
    const redirectTo = input.redirect || "/dashboard";
    const callbackUrl = `${origin}/auth/callback?redirect=${encodeURIComponent(redirectTo)}`;

    // Return OAuth configuration for client-side redirect
    return NextResponse.json({
      success: true,
      provider: input.provider,
      callbackUrl,
    });
  } catch (error: any) {
    console.error("[API/OAuth] Error:", error);
    return NextResponse.json({ 
      success: false,
      code: "INVALID_REQUEST",
      message: "Invalid request"
    }, { status: 400 });
  }
}
