// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";
import { RequestContext } from "@/lib/core/runtime/context/RequestContext";
import { appContainer } from "@/lib/core/runtime/container/app-container";
import { RegisterUserUseCase } from "@/lib/auth/application/use-cases/register-user.use-case";
import { AuthPresenter } from "@/lib/auth/presentation/AuthPresenter";
import { ErrorHttpMapper } from "@/lib/core/result/errors/ErrorHttpMapper";
import { z } from "zod";

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
        { message: "Si cette adresse est valide, un email de confirmation a été envoyé." },
        { status: 200 }
      );
    }

    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
    const userAgent = req.headers.get("user-agent") || undefined;

    return RequestContext.run(
      { correlationId: crypto.randomUUID(), requestId: crypto.randomUUID() },
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
          return NextResponse.json(
            { error: httpResponse.body.error, code: httpResponse.body.code },
            { status: httpResponse.status }
          );
        }

        const presenter = new AuthPresenter();
        const response = presenter.present(result.unwrap());
        return NextResponse.json({
          ...response,
          message: "Compte créé. Vérifiez votre email pour activer votre compte.",
        });
      }
    );
  } catch (error: any) {
    console.error("[API/Register] Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
