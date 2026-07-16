import { NextRequest, NextResponse } from "next/server";
import { RequestContext } from "@/lib/core/runtime/context/RequestContext";
import { appContainer } from "@/lib/core/runtime/container/app-container";
import { ResendVerificationEmailUseCase } from "@/lib/auth/application/use-cases/resend-verification-email.use-case";
import { ErrorHttpMapper } from "@/lib/core/result/errors/ErrorHttpMapper";
import { z } from "zod";
import { emailVerificationRateLimiter } from "@/lib/core/security/rate-limiter";
import { auditLogger } from "@/lib/core/security/audit-logger";

export const dynamic = "force-dynamic";

const ResendRequestSchema = z.object({
  email: z.string().email("Email invalide"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const input = ResendRequestSchema.parse(body);

    // Rate limiting
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
    const userAgent = req.headers.get("user-agent") || undefined;
    const rateLimitResult = await emailVerificationRateLimiter.checkLimit(ip, userAgent);

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { 
          success: false,
          code: "RATE_LIMIT_EXCEEDED",
          message: "Trop de demandes de renvoi. Veuillez réessayer dans une heure."
        },
        { 
          status: 429,
          headers: {
            "X-RateLimit-Limit": "3",
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": new Date(rateLimitResult.resetTime).toISOString(),
          }
        }
      );
    }

    const correlationId = crypto.randomUUID();

    return RequestContext.run(
      { correlationId, requestId: crypto.randomUUID() },
      async () => {
        const resendVerificationEmailUseCase = appContainer.resolve<ResendVerificationEmailUseCase>("ResendVerificationEmailUseCase");
        const result = await resendVerificationEmailUseCase.execute({ email: input.email });

        if (result.isFailure()) {
          const error = result.unwrapError();
          const httpResponse = ErrorHttpMapper.toHttpResponse(error);
          return NextResponse.json(
            { 
              success: false,
              code: httpResponse.body.code,
              message: httpResponse.body.error
            },
            { status: httpResponse.status }
          );
        }

        // Log email verification sent
        auditLogger.logEmailVerificationSent(input.email, ip, userAgent, correlationId);

        return NextResponse.json({ success: true });
      }
    );
  } catch (error: any) {
    console.error("[API/VerifyEmail/Resend] Error:", error);
    return NextResponse.json({ 
      success: false,
      code: "INTERNAL_ERROR",
      message: "Internal server error"
    }, { status: 500 });
  }
}
