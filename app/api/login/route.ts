import { NextRequest, NextResponse } from "next/server";
import { RequestContext } from "@/lib/core/runtime/context/RequestContext";
import { appContainer } from "@/lib/core/runtime/container/app-container";
import { LoginUserUseCase } from "@/lib/auth/application/use-cases/login-user.use-case";
import { ErrorHttpMapper } from "@/lib/core/result/errors/ErrorHttpMapper";
import { z } from "zod";
import { authRateLimiter } from "@/lib/core/security/rate-limiter";
import { auditLogger, AuditEventType } from "@/lib/core/security/audit-logger";

export const dynamic = "force-dynamic";

const LoginRequestSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(1, "Mot de passe requis"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const input = LoginRequestSchema.parse(body);

    // Rate limiting
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
    const userAgent = req.headers.get("user-agent") || undefined;
    const rateLimitResult = await authRateLimiter.checkLimit(ip, userAgent);

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { 
          success: false,
          code: "RATE_LIMIT_EXCEEDED",
          message: "Trop de tentatives de connexion. Veuillez réessayer dans quelques minutes."
        },
        { 
          status: 429,
          headers: {
            "X-RateLimit-Limit": "5",
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
        const loginUserUseCase = appContainer.resolve<LoginUserUseCase>("LoginUserUseCase");
        const result = await loginUserUseCase.execute({
          email: input.email,
          password: input.password,
        });

        if (result.isFailure()) {
          const error = result.unwrapError();
          const httpResponse = ErrorHttpMapper.toHttpResponse(error);
          
          // Log failed login attempt
          auditLogger.logLoginFailed(input.email, ip, userAgent, correlationId, error.message);

          return NextResponse.json(
            { 
              success: false,
              code: httpResponse.body.code,
              message: httpResponse.body.error
            },
            { status: httpResponse.status }
          );
        }

        const loginData = result.unwrap();

        // Log successful login
        auditLogger.logLoginSuccess(loginData.userId, input.email, ip, userAgent, correlationId);

        // Set HTTP-only cookies for session
        const response = NextResponse.json({
          success: true,
          userId: loginData.userId,
        });

        // Set access token cookie
        response.cookies.set("sb-access-token", loginData.accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: loginData.expiresIn,
          path: "/",
        });

        // Set refresh token cookie
        response.cookies.set("sb-refresh-token", loginData.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 7, // 7 days
          path: "/",
        });

        return response;
      }
    );
  } catch (error: any) {
    console.error("[API/Login] Error:", error);
    return NextResponse.json({ 
      success: false,
      code: "INTERNAL_ERROR",
      message: "Internal server error"
    }, { status: 500 });
  }
}
