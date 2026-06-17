import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServiceClient } from "@/lib/supabase-server";
import { requireAuth } from "@/lib/auth";
import { requireCVEditor } from "@/lib/security/require-cv-editor";
import { interviewStartLimiter } from "@/lib/security/rate-limit";
import { logEvent } from "@/lib/security/audit-log";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();
    const startTime = Date.now();
    const cvAccess = await requireCVEditor(user.id);
    if (!cvAccess.success) {
      return NextResponse.json(
        { error: "CV editor completion required" },
        { status: 403 },
      );
    }
    const { success } = await interviewStartLimiter.limit(
      `interview-start:${user.id}`,
    );
    if (!success) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { jobTitle, company, persona, difficulty } = body;

    // Use Service Role exclusively for the system insert to bypass RLS
    const adminSupabase = createSupabaseServiceClient();

    const { data, error } = await (adminSupabase as any)
      .from("premium_interview_sessions")
      .insert({
        user_id: user.id,
        company,
        job_title: jobTitle,
        difficulty,
        persona,
      })
      .select()
      .single();

    if (error) {
      console.error("[PREMIUM_INTERVIEW_INSERT_ERROR]", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const duration = Date.now() - startTime;
    logEvent(
      user.id,
      "INTERVIEW_START",
      { jobTitle, company, difficulty, persona, duration },
      req.headers.get("x-forwarded-for") ?? "",
      req.headers.get("user-agent") ?? ""
    );
    return NextResponse.json({ session: data });
  } catch (err: any) {
    console.error("[PREMIUM_INTERVIEW_INSERT_ERROR]", err);
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
