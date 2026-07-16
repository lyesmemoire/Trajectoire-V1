import { NextRequest, NextResponse } from "next/server";
import { RequestContext } from "@/lib/core/runtime/context/RequestContext";
import { appContainer } from "@/lib/core/runtime/container/app-container";
import { RegisterUserUseCase } from "@/lib/auth/application/use-cases/register-user.use-case";
import { AuthPresenter } from "@/lib/auth/presentation/AuthPresenter";
import { ErrorHttpMapper } from "@/lib/core/result/errors/ErrorHttpMapper";
import { z } from "zod";
import { registerRateLimiter } from "@/lib/core/security/rate-limiter";
import { auditLogger } from "@/lib/core/security/audit-logger";

export const dynamic = "force-dynamic";

const RegisterRequestSchema = z.object({
  email:       z.string().email("Email invalide"),
  password:    z.string().min(8, "Mot de passe trop court").max(128, "Mot de passe trop long"),
  fingerprint: z.string().max(500).optional(),
  company:     z.string().optional(),
  fullName:    z.string().max(100).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const input = RegisterRequestSchema.parse(body);

    // Honeypot
    if (input.company) {
      return NextResponse.json(
        { 
          success: false,
          code: "BOT_DETECTED",
          message: "Si cette adresse est valide, un email de confirmation a été envoyé."
        },
        { status: 200 }
      );
    }

    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
    const userAgent = req.headers.get("user-agent") || undefined;

    // Rate limiting
    const rateLimitResult = await registerRateLimiter.checkLimit(ip, userAgent);

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { 
          success: false,
          code: "RATE_LIMIT_EXCEEDED",
          message: "Trop de tentatives d'inscription. Veuillez réessayer dans une heure."
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
        const registerUserUseCase = appContainer.resolve<RegisterUserUseCase>("RegisterUserUseCase");
        const result = await registerUserUseCase.execute({
          email: input.email,
          password: input.password,
          displayName: input.fullName || input.email.split("@")[0] || "User",
          ip,
          fingerprint: input.fingerprint,
          userAgent,
        });

        if (result.isFailure()) {
          const error = result.unwrapError();
          const httpResponse = ErrorHttpMapper.toHttpResponse(error);
          
          // Log failed registration attempt
          auditLogger.logRegisterFailed(input.email, ip, userAgent, correlationId, error.message);

          return NextResponse.json(
            { 
              success: false,
              code: httpResponse.body.code,
              message: httpResponse.body.error
            },
            { status: httpResponse.status }
          );
        }

        const registerData = result.unwrap();

        // Log successful registration
        auditLogger.logRegisterSuccess(registerData.userId, input.email, ip, userAgent, correlationId);

        const presenter = new AuthPresenter();
        const response = presenter.present(registerData);
        return NextResponse.json({
          ...response,
          message: "Compte créé. Vérifiez votre email pour activer votre compte.",
        });
      }
    );
  } catch (error: any) {
    console.error("[API/Register] Error:", error);
    return NextResponse.json({ 
      success: false,
      code: "INTERNAL_ERROR",
      message: "Internal server error"
    }, { status: 500 });
  }
}
