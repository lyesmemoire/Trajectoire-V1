import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  Container,
  ServiceTokens,
} from "@/infrastructure/di";

import {
  initializeContainer,
} from "@/infrastructure/di/bootstrap";

import {
  SimulationService,
} from "@/application/services";

import {
  AuthenticationError,
  ValidationError,
} from "@/core/errors";

import {
  ApiResponseBuilder,
} from "@/core/http";

import {
  CreateSessionSchema,
} from "@/validation";

import {
  IdempotencyService,
} from "@/core/idempotency/IdempotencyService";

import {
  AuthServiceUnavailableError,
  getVerifiedUserWithRetry,
} from "@/lib/auth/verified-user";

import {
  UnifiedInterviewContextService,
} from "@/application/interview-context/UnifiedInterviewContextService";

import {
  InterviewService,
} from "@/lib/ai/services/interview.service";

const MAX_JOB_DESCRIPTION_LENGTH =
  20_000;

function authUnavailableResponse() {
  return NextResponse.json(
    {
      success: false,
      data: null,
      error: {
        code:
          "AUTH_SERVICE_UNAVAILABLE",

        message:
          "Le service d'authentification est temporairement indisponible. Réessayez.",
      },
    },

    {
      status: 503,

      headers: {
        "Retry-After": "3",
      },
    },
  );
}

function buildFallbackFirstQuestion(
  params: {
    jobTitle: string;
    interviewType: string;
  },
): string {
  const {
    jobTitle,
    interviewType,
  } = params;

  if (
    interviewType === "Technique"
  ) {
    return `Bonjour. Pour commencer cet entretien pour le poste de ${jobTitle}, pouvez-vous me présenter brièvement votre parcours puis me parler de l'expérience technique la plus pertinente pour ce poste ?`;
  }

  if (
    interviewType === "Manager"
  ) {
    return `Bonjour. Pour commencer cet entretien pour le poste de ${jobTitle}, pouvez-vous me présenter votre parcours et me donner un exemple récent où vous avez dû prendre une décision importante avec votre équipe ?`;
  }

  return `Bonjour. Pour commencer cet entretien pour le poste de ${jobTitle}, pouvez-vous vous présenter en quelques minutes et m'expliquer ce qui vous motive particulièrement dans cette opportunité ?`;
}
async function ensureFirstQuestion(
  params: {
    supabase: any;

    userId: string;
    sessionId: string;

    jobTitle: string;
    level: string;

    interviewType:
      | "RH"
      | "Technique"
      | "Manager";
  },
): Promise<void> {
  const {
    supabase,
    userId,
    sessionId,
    jobTitle,
    level,
    interviewType,
  } = params;

  /*
   * Idempotence locale :
   * si une question existe déjà, ne jamais en créer une seconde.
   */
  const {
    data: existingMessages,
    error:
      existingMessagesError,
  } =
    await supabase
      .from(
        "interview_messages",
      )
      .select(
        "id,role",
      )
      .eq(
        "session_id",
        sessionId,
      )
      .order(
        "created_at",
        {
          ascending: true,
        },
      )
      .limit(1);

  if (
    existingMessagesError
  ) {
    console.warn(
      "[simulation/create] Could not verify existing messages:",
      existingMessagesError,
    );
  }

  if (
    Array.isArray(
      existingMessages,
    ) &&
    existingMessages.length > 0
  ) {
    return;
  }

  /*
   * Construire le cerveau unifié.
   * L'échec du contexte reste non bloquant.
   */
  let unifiedContext = null;

  try {
    const contextService =
      new UnifiedInterviewContextService(
        supabase,
      );

    unifiedContext =
      await contextService.build({
        userId,
        sessionId,
      });
  } catch (error) {
    console.warn(
      "[simulation/create] Unified context unavailable for first question:",
      error,
    );
  }

  /*
   * Génération IA.
   * Si le fournisseur est indisponible, la session démarre quand même.
   */
  let firstQuestion: string;

  const controller =
    new AbortController();

  const timeout =
    setTimeout(
      () =>
        controller.abort(),
      20_000,
    );

  try {
    firstQuestion =
      await InterviewService
        .generateFirstQuestion({
          jobTitle,
          level,
          interviewType,

          sessionId,
          userId,

          signal:
            controller.signal,

          unifiedContext,
        });

    firstQuestion =
      firstQuestion.trim();

    if (!firstQuestion) {
      throw new Error(
        "EMPTY_FIRST_QUESTION",
      );
    }
  } catch (error) {
    console.error(
      "[simulation/create] AI first question failed, using fallback:",
      error,
    );

    firstQuestion =
      buildFallbackFirstQuestion({
        jobTitle,
        interviewType,
      });
  } finally {
    clearTimeout(timeout);
  }

  /*
   * Persister la première question.
   */
  const {
    error: insertError,
  } =
    await supabase
      .from(
        "interview_messages",
      )
      .insert({
        session_id:
          sessionId,

        role:
          "assistant",

        content:
          firstQuestion,
      });

  if (insertError) {
    throw new Error(
      `FIRST_QUESTION_INSERT_FAILED:${insertError.message}`,
    );
  }

  console.info(
    "[simulation/create] First recruiter question created",
    {
      sessionId,
      contextual:
        Boolean(
          unifiedContext,
        ),
    },
  );
}
export async function POST(
  request: NextRequest,
) {
  try {
    initializeContainer();

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
      return ApiResponseBuilder
        .unauthorized();
    }

    const formData =
      await request.formData();

    const jobDescriptionRaw =
      formData.get(
        "jobDescription",
      );

    const jobDescription =
      typeof jobDescriptionRaw ===
      "string"
        ? jobDescriptionRaw
            .trim()
            .slice(
              0,
              MAX_JOB_DESCRIPTION_LENGTH,
            )
        : "";

    const rawData = {
      jobTitle:
        formData.get(
          "jobTitle",
        ) as string,

      level:
        formData.get(
          "level",
        ) as string,

      interviewType:
        formData.get(
          "interviewType",
        ) as string,

      duration:
        Number.parseInt(
          String(
            formData.get(
              "duration",
            ) ?? "",
          ),
          10,
        ),
    };

    const validationResult =
      CreateSessionSchema
        .safeParse(
          rawData,
        );

    if (
      !validationResult.success
    ) {
      const fieldErrors =
        validationResult
          .error
          .flatten()
          .fieldErrors;

      const validationFields:
        Array<{
          field: string;
          message: string;
        }> = [];

      for (
        const [
          field,
          messages,
        ] of Object.entries(
          fieldErrors,
        )
      ) {
        if (
          messages &&
          messages.length > 0
        ) {
          validationFields.push({
            field,

            message:
              messages[0] ??
              "Valeur invalide",
          });
        }
      }

      throw new ValidationError(
        "Invalid input data",
        validationFields,
      );
    }

    const validatedData =
      validationResult.data;

    const simulationService =
      (await Container.resolve(
        ServiceTokens
          .SimulationService,
      )) as SimulationService;

    const createSimulation =
      async () =>
        simulationService
          .createSimulation({
            userId:
              user.id,

            jobTitle:
              validatedData
                .jobTitle,

            level:
              validatedData
                .level,

            interviewType:
              validatedData
                .interviewType as
                | "RH"
                | "Technique"
                | "Manager",

            duration:
              validatedData
                .duration,
          });

    const idempotencyKey =
      request.headers.get(
        "Idempotency-Key",
      );

    let result;

    if (idempotencyKey) {
      const idempotencyService =
        new IdempotencyService();

      result =
        await idempotencyService
          .execute(
            idempotencyKey,

            user.id,

            "simulation_create",

            {
              ...validatedData,
              jobDescription,
            },

            async () => {
              const data =
                await createSimulation();

              return {
                resultRef:
                  data.sessionId,

                data,
              };
            },

            async (
              resultRef,
            ) => {
              const session =
                await simulationService
                  .getSession(
                    resultRef,
                    user.id,
                  );

              return {
                sessionId:
                  session.id,

                jobTitle:
                  session.jobTitle,

                level:
                  session.level,

                interviewType:
                  session.interviewType,

                durationSeconds:
                  session.durationSeconds,
              };
            },
          );
    } else {
      result =
        await createSimulation();
    }
    /*
     * Enrichir la session avec l'offre.
     */
    if (jobDescription) {
      const {
        error:
          contextUpdateError,
      } =
        await supabase
          .from(
            "interview_sessions",
          )
          .update({
            job_description:
              jobDescription,
          })
          .eq(
            "id",
            result.sessionId,
          )
          .eq(
            "user_id",
            user.id,
          );

      if (
        contextUpdateError
      ) {
        console.warn(
          "[simulation/create] job_description update failed:",
          contextUpdateError,
        );
      }
    }

    /*
     * IMPORTANT :
     * une simulation ne doit jamais arriver sur la page
     * sans première question.
     */
    await ensureFirstQuestion({
      supabase,

      userId:
        user.id,

      sessionId:
        result.sessionId,

      jobTitle:
        validatedData.jobTitle,

      level:
        validatedData.level,

      interviewType:
        validatedData.interviewType as
          | "RH"
          | "Technique"
          | "Manager",
    });

    return NextResponse.redirect(
      new URL(
        `/simulation/${result.sessionId}`,
        request.url,
      ),
      303,
    );
  } catch (error) {
    if (
      error instanceof
      AuthServiceUnavailableError
    ) {
      console.error(
        "[simulation/create] Supabase Auth unavailable:",
        error.causeValue,
      );

      return authUnavailableResponse();
    }

    if (
      error instanceof
      AuthenticationError
    ) {
      return ApiResponseBuilder
        .unauthorized();
    }

    return ApiResponseBuilder
      .fromError(error);
  }
}