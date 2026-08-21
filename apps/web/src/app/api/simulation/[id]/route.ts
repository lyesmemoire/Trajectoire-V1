import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  AuthServiceUnavailableError,
  getVerifiedUserWithRetry,
} from "@/lib/auth/verified-user";

import {
  UnifiedInterviewContextService,
} from "@/application/interview-context/UnifiedInterviewContextService";

export async function GET(
  _request: NextRequest,
  {
    params,
  }: {
    params:
      Promise<{
        id: string;
      }>;
  },
) {
  try {
    const { id } =
      await params;

    const {
      supabase,
      user,
      authError,
    } =
      await getVerifiedUserWithRetry();

    if (
      authError ||
      !user
    ) {
      return NextResponse.json(
        {
          error:
            "Non authentifié",
        },
        {
          status: 401,
        },
      );
    }

    const {
      data: session,
      error: sessionError,
    } =
      await supabase
        .from(
          "interview_sessions",
        )
        .select("*")
        .eq(
          "id",
          id,
        )
        .eq(
          "user_id",
          user.id,
        )
        .single();

    if (
      sessionError ||
      !session
    ) {
      return NextResponse.json(
        {
          error:
            "Session introuvable",
        },
        {
          status: 404,
        },
      );
    }

    if (
      session.status ===
      "completed"
    ) {
      const {
        data: report,
      } =
        await supabase
          .from("reports")
          .select("id")
          .eq(
            "session_id",
            id,
          )
          .single();

      if (report) {
        return NextResponse.json(
          {
            redirect:
              `/report/${report.id}`,
          },
        );
      }
    }

    const {
      data: messages,
      error:
        messagesError,
    } =
      await supabase
        .from(
          "interview_messages",
        )
        .select("*")
        .eq(
          "session_id",
          id,
        )
        .order(
          "created_at",
          {
            ascending: true,
          },
        );

    if (
      messagesError
    ) {
      return NextResponse.json(
        {
          error:
            "Erreur lors du chargement des messages",
        },
        {
          status: 500,
        },
      );
    }

    /*
     * Unified brain context.
     *
     * Best effort: a missing CV or ATS report must never prevent
     * the interview session itself from loading.
     */
    let context = null;

    try {
      const contextService =
        new UnifiedInterviewContextService(
          supabase,
        );

      context =
        await contextService.build({
          userId:
            user.id,
          sessionId:
            id,
        });
    } catch (contextError) {
      console.warn(
        "[simulation/session] Unified context unavailable:",
        contextError,
      );
    }

    return NextResponse.json({
      session,
      messages:
        messages ?? [],
      context,
    });
  } catch (error) {
    if (
      error instanceof
      AuthServiceUnavailableError
    ) {
      console.error(
        "[simulation/session] Supabase Auth unavailable:",
        error.causeValue,
      );

      return NextResponse.json(
        {
          error:
            "Service d'authentification temporairement indisponible",
          code:
            "AUTH_SERVICE_UNAVAILABLE",
        },
        {
          status: 503,
          headers: {
            "Retry-After": "3",
          },
        },
      );
    }

    console.error(
      "[simulation/session] Unexpected error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Erreur interne",
      },
      {
        status: 500,
      },
    );
  }
}