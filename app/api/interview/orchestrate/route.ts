import { NextRequest, NextResponse } from "next/server";
import { getStrictUser } from "@/lib/auth/get-user";
import { interviewLimiter } from "@/lib/security/rate-limit";
import { RequestHardening } from "@/lib/security/request-hardening";
import { z } from "zod";
import crypto from "crypto";
import { RequestContext } from "@/lib/core/runtime/context/RequestContext";
import { Pipeline } from "@/lib/core/runtime/pipeline/Pipeline";
import { appContainer } from "@/lib/core/runtime/container/app-container";
import { OrchestrateInterviewStepUseCase } from "@/lib/interview/application/use-cases/orchestrate-step/orchestrate-interview-step.use-case";
import { InterviewPresenter } from "@/lib/interview/presentation/interview.presenter";

const OrchestrateSchema = z.object({
  sessionId: z.string().uuid(),
  userAnswer: z.string().min(1).max(10000),
  currentQuestion: z.string().min(1).max(5000),
  signature: z.string().min(1),
  nonce: z.string().min(1),
  metrics: z.any().optional().default({}),
});

export async function POST(req: NextRequest) {
  // 1. Validation & Auth & RateLimit
  const user = await getStrictUser(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { success } = await interviewLimiter.limit(`interview:${user.id}`);
  if (!success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const bodyResult = OrchestrateSchema.safeParse(await req.json());
  if (!bodyResult.success) {
    return NextResponse.json(
      { error: "Invalid request data", details: bodyResult.error.format() },
      { status: 400 },
    );
  }

  const { sessionId, userAnswer, currentQuestion, signature, nonce, metrics } = bodyResult.data;

  // 🛡️ API HARDENING: Signature & Nonce Verification (Always Enforced)
  const isValid = await RequestHardening.verifyRequest(
    user.id,
    signature,
    JSON.stringify({ sessionId, userAnswer, currentQuestion }),
    nonce,
  );
  if (!isValid) {
    return NextResponse.json({ error: "Invalid request signature" }, { status: 403 });
  }

  // 2. RequestContext.run()
  const requestId = crypto.randomUUID();
  return RequestContext.run({ userId: user.id, requestId, correlationId: requestId }, async () => {
    // 3. Pipeline.execute()
    const pipeline = new Pipeline<any, any>();
    const useCase = appContainer.resolve<OrchestrateInterviewStepUseCase>("OrchestrateInterviewStepUseCase");
    const presenter = appContainer.resolve<InterviewPresenter>("InterviewPresenter");

    const result = await pipeline.execute({
      sessionId,
      userId: user.id,
      userAnswer,
      currentQuestion,
      metrics,
    }, (input) => useCase.execute(input));

    // 4 & 5. Presenter & ErrorHttpMapper
    const response = presenter.presentOrchestrate(result);
    return NextResponse.json(response.body, { status: response.status });
  });
}
