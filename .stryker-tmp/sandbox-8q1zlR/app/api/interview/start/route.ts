// @ts-nocheck
import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { getStrictUser } from "@/lib/auth/get-user";
import { requireCVEditor } from "@/lib/security/require-cv-editor";
import crypto from "crypto";
import { interviewStartLimiter } from "@/lib/security/rate-limit";
import { logEvent } from "@/lib/security/audit-log";
import { RequestContext } from "@/lib/core/runtime/context/RequestContext";
import { Pipeline } from "@/lib/core/runtime/pipeline/Pipeline";
import { appContainer } from "@/lib/core/runtime/container/app-container";
import { StartInterviewUseCase } from "@/lib/interview/application/use-cases/start-interview/start-interview.use-case";
import { InterviewPresenter } from "@/lib/interview/presentation/interview.presenter";

export const dynamic = "force-dynamic";

const RequestSchema = z.object({
  job_title: z.string().min(1).max(200),
  job_description: z.string().max(8000).optional().nullable(),
  cv_id: z.string().uuid().optional().nullable(),
});

export async function POST(req: NextRequest) {
  // 1. Validation & Auth & RateLimit
  const user = await getStrictUser(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cvAccess = await requireCVEditor(user.id);
  if (!cvAccess.success) {
    return NextResponse.json({ error: "CV editor completion required" }, { status: 403 });
  }

  const { success } = await interviewStartLimiter.limit(`interview-start:${user.id}`);
  if (!success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const parsed = RequestSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Paramètres invalides.", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { job_title, job_description, cv_id } = parsed.data;

  // Fetch CV summary from Supabase
  let candidateSummary: string | undefined = undefined;
  if (cv_id) {
    const supabase = await createServerClient();
    const jobHash = crypto
      .createHash("sha256")
      .update((job_description || "").trim().toLowerCase())
      .digest("hex");

    const { data: optCv } = await (supabase as any)
      .from("optimized_cvs")
      .select("improved_summary")
      .eq("cv_id", cv_id)
      .eq("job_hash", jobHash)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (optCv?.improved_summary) {
      candidateSummary = optCv.improved_summary;
    } else {
      const { data: rawCv } = await (supabase as any)
        .from("cvs")
        .select("extracted_text")
        .eq("id", cv_id)
        .single();
      if (rawCv?.extracted_text) {
        candidateSummary = rawCv.extracted_text.slice(0, 1500);
      }
    }
  }

  // 2. RequestContext.run()
  const requestId = crypto.randomUUID();
  return RequestContext.run({ userId: user.id, requestId, correlationId: requestId }, async () => {
    // 3. Pipeline.execute()
    const pipeline = new Pipeline<any, any>();
    const useCase = appContainer.resolve<StartInterviewUseCase>("StartInterviewUseCase");
    const presenter = appContainer.resolve<InterviewPresenter>("InterviewPresenter");

    const result = await pipeline.execute({
      userId: user.id,
      jobTitle: job_title,
      jobDescription: job_description || undefined,
      cvId: cv_id || undefined,
      candidateSummary,
    }, (input) => useCase.execute(input));

    // 4 & 5. Presenter & ErrorHttpMapper
    const response = presenter.presentStart(result);

    if (response.status === 200 || response.status === 201) {
      logEvent(
        user.id,
        "INTERVIEW_START",
        { job_title, job_description },
        req.headers.get("x-forwarded-for") ?? "",
        req.headers.get("user-agent") ?? "",
      );
      // Adding legacy fields for backward compatibility
      const body = {
        ...response.body,
        _deprecated: true,
        _replacement: "POST /api/interviews/init via Realtime Gateway V3",
      };
      return NextResponse.json(body, { status: response.status });
    }

    return NextResponse.json(response.body, { status: response.status });
  });
}
