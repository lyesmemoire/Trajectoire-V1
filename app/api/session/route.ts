import { NextRequest, NextResponse } from "next/server";
import { RequestContext } from "@/lib/core/runtime/context/RequestContext";
import { appContainer } from "@/lib/core/runtime/container/app-container";
import { GetCurrentUserUseCase } from "@/lib/auth/application/use-cases/get-current-user.use-case";
import { ErrorHttpMapper } from "@/lib/core/result/errors/ErrorHttpMapper";
import { createServerClientSupabase } from "@/lib/supabase/server";
import type { UserRepositoryPort as PrismaUserRepositoryPort } from "@/lib/users/ports/user-repository.port";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const supabase = await createServerClientSupabase();
    
    // Get session from cookies
    const sessionResult = await supabase.auth.getSession();
    const session = sessionResult.data?.session;
    const sessionError = sessionResult.error;

    if (sessionError || !session) {
      return NextResponse.json(
        { 
          success: false,
          code: "NO_SESSION",
          message: "No active session"
        },
        { status: 401 }
      );
    }

    return RequestContext.run(
      { correlationId: crypto.randomUUID(), requestId: crypto.randomUUID() },
      async () => {
        // Get user from auth repository
        const getCurrentUserUseCase = appContainer.resolve<GetCurrentUserUseCase>("GetCurrentUserUseCase");
        const userResult = await getCurrentUserUseCase.execute({ userId: session.user.id });

        if (userResult.isFailure()) {
          const error = userResult.unwrapError();
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

        const userAggregate = userResult.unwrap();

        // Get user profile from Prisma repository
        const prismaUserRepo = appContainer.resolve<PrismaUserRepositoryPort>("PrismaUserRepository");
        const profileResult = await prismaUserRepo.findById(session.user.id);

        let profile = null;
        if (profileResult.isSuccess()) {
          profile = profileResult.unwrap();
        }

        return NextResponse.json({
          success: true,
          user: {
            id: userAggregate.id.value,
            email: userAggregate.email.value,
            displayName: userAggregate.displayName.value,
            avatar: userAggregate.avatar,
            roles: userAggregate.roles.map(r => r.value),
            subscription: userAggregate.subscription,
            status: userAggregate.status.value,
            emailVerified: userAggregate.emailVerified,
            createdAt: userAggregate.createdAt,
            updatedAt: userAggregate.updatedAt,
          },
          profile: profile ? {
            userId: profile.user.id,
            fullName: profile.profile.fullName,
            credits: profile.profile.credits,
            cvEditorCompleted: profile.profile.cvEditorCompleted,
          } : null,
          session: {
            expiresAt: session.expires_at ? new Date(session.expires_at).toISOString() : null,
          },
        });
      }
    );
  } catch (error: any) {
    console.error("[API/Session] Error:", error);
    return NextResponse.json({ 
      success: false,
      code: "INTERNAL_ERROR",
      message: "Internal server error"
    }, { status: 500 });
  }
}
