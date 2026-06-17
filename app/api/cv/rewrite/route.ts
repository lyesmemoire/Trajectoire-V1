import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { requireAuth } from "@/lib/auth";
import { z } from "zod";
import { sanitizeInput } from "@/lib/security/sanitize-cv";
import {
  improveExperience,
  rewriteSummary,
  generateImpactMetrics,
} from "@/lib/ai/cv-rewriter";
import prisma from "@/lib/prisma";
import { cvRewriteLimiter } from "@/lib/security/rate-limit";
import { logEvent } from "@/lib/security/audit-log";

export const dynamic = "force-dynamic";

const RewriteRequestSchema = z.object({
  action: z.enum(["improve_experience", "rewrite_summary", "generate_metrics"]),
  content: z.string().min(5).max(3000),
  context: z.string().max(1000).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();
    // Rate limit
    const { success } = await cvRewriteLimiter.limit(`cv-rewrite:${user.id}`);
    if (!success) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }
    const supabase = await createSupabaseServerClient();

    // Zod validation
    const rawBody = await req.json();
    const parsed = RewriteRequestSchema.safeParse(rawBody);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error },
        { status: 400 },
      );
    }

    const { action, content, context } = parsed.data;

    // Check Quotas
    const dbUser = (await prisma.user.findUnique({
      where: { id: user.id },
      select: { monthlyAiCredits: true } as any,
    })) as any;

    if (!dbUser || dbUser.monthlyAiCredits <= 0) {
      return NextResponse.json(
        { error: "Insufficient AI credits" },
        { status: 403 },
      );
    }

    // Sanitize BEFORE AI
    const sanitizedContent = sanitizeInput(content);
    const sanitizedContext = context ? sanitizeInput(context) : "";

    let result = "";

    // Execute AI Action
    if (action === "improve_experience") {
      result = await improveExperience(sanitizedContent);
    } else if (action === "rewrite_summary") {
      result = await rewriteSummary(sanitizedContent);
    } else if (action === "generate_metrics") {
      result = await generateImpactMetrics(sanitizedContent, sanitizedContext);
    }

    // Deduct credit
    await prisma.user.update({
      where: { id: user.id },
      data: { monthlyAiCredits: { decrement: 1 } } as any,
    });

    logEvent(
      user.id,
      "CV_REWRITE",
      { action, contentLength: content.length },
      req.headers.get("x-forwarded-for") ?? undefined,
      req.headers.get("user-agent") ?? "",
    ).catch((e) => {
      console.error("Failed to write audit log", e);
    });
    return NextResponse.json({ result });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("[CV_REWRITE_ERROR]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
