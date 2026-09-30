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
  checkSimulationQuota,
  consumeSimulation,
  releaseSimulation,
  type SimulationQuota,
} from "@/lib/quota/simulation-quota";

import {
  UnifiedInterviewContextService,
} from "@/application/interview-context/UnifiedInterviewContextService";

import {
  InterviewService,
} from "@/lib/ai/services/interview.service";

import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

import {
  parseDifficulty,
  sanitizeMandatoryQuestion,
  withSessionSetup,
} from "@/lib/interview/session-setup";

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
/**
 * Plafond de simulations atteint (FREE : 0, Pack épuisé ou expiré).
 * Lancée depuis la consommation atomique quand la course est perdue.
 */
class SimulationQuotaExceededError extends Error {
  constructor(readonly quota: SimulationQuota) {
    super("SIMULATION_QUOTA_EXCEEDED");
  }
}

function quotaMessage(quota: SimulationQuota): string {
  if (quota.expired) {
    return "Votre Pack Entretien a expiré.";
  }
  if (quota.plan === "FREE") {
    return "Votre offre gratuite n'inclut pas de simulation.";
  }
  return "Vous avez utilisé toutes vos simulations disponibles.";
}

/**
 * Le formulaire de /simulation/new est un POST classique : une navigation
 * reçoit une redirection vers les offres, jamais un JSON brut. Les clients qui
 * demandent explicitement du JSON gardent le 403 structuré.
 */
function quotaExceededResponse(
  request: NextRequest,
  quota: SimulationQuota,
): NextResponse {
  const wantsJson =
    request.headers.get("accept")?.includes("application/json") ?? false;

  if (!wantsJson) {
    return NextResponse.redirect(
      new URL("/pricing?reason=quota", request.url),
      303,
    );
  }

  return NextResponse.json(
    {
      error: "SIMULATION_QUOTA_EXCEEDED",
      message: quotaMessage(quota),
      plan: quota.plan,
      used: quota.used,
      limit: quota.limit,
      remaining: 0,
      periodEnd: quota.periodEnd,
      expired: quota.expired,
    },
    { status: 403 },
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

    // --- Quota : refus rapide avant tout travail (FREE, Pack épuisé/expiré) ---
    // La consommation elle-même est atomique et se fait dans createSimulation.
    const quota = await checkSimulationQuota(user.id);
    if (!quota.allowed) {
      return quotaExceededResponse(request, quota);
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

      opportunityId:
        formData.get("opportunityId") ??
        undefined,

      difficulty:
        formData.get("difficulty") ??
        undefined,

      mandatoryQuestion:
        formData.get("mandatoryQuestion") ??
        undefined,
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

    // Consommation atomique juste avant la création : exécutée une seule fois,
    // y compris avec une clé d'idempotence (un rejeu ne redécompte pas).
    const createSimulation =
      async () => {
        const consumed =
          await consumeSimulation(
            user.id,
          );

        if (!consumed.ok) {
          throw new SimulationQuotaExceededError(
            consumed.quota,
          );
        }

        try {
          return await simulationService
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
        } catch (creationError) {
          // La session n'a pas été créée : on rend la simulation décomptée.
          await releaseSimulation(
            user.id,
          ).catch(
            (releaseError) =>
              console.error(
                "[simulation/create] release failed:",
                releaseError,
              ),
          );

          throw creationError;
        }
      };

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
     * Réglages de séance (difficulté, question imposée) : fusionnés dans `analysis` (JSONB existant).
     * Non bloquant : en cas d'échec la séance démarre avec les réglages par défaut.
     */
    try {
      const current = await prisma.interview_sessions.findFirst({
        where: { id: result.sessionId, user_id: user.id },
        select: { analysis: true },
      });

      if (current) {
        await prisma.interview_sessions.update({
          where: { id: result.sessionId },
          data: {
            analysis: withSessionSetup(current.analysis, {
              difficulty: parseDifficulty(validatedData.difficulty),
              mandatoryQuestion: sanitizeMandatoryQuestion(
                validatedData.mandatoryQuestion,
              ),
            }) as Prisma.InputJsonValue,
          },
        });
      }
    } catch (setupFailure) {
      console.warn("[simulation/create] setup update failed:", setupFailure);
    }

    /*
     * OPPORTUNITY LINK — server-side ownership validation.
     *
     * Never trust the opportunityId from the client directly.
     * Re-fetch from DB to verify it belongs to the authenticated user.
     * Only then persist the FK on InterviewSession.
     */
    const rawOpportunityId =
      typeof validatedData.opportunityId === "string" &&
      validatedData.opportunityId.trim().length > 0
        ? validatedData.opportunityId.trim()
        : null;

    if (rawOpportunityId) {
      const verifiedOpportunity =
        await prisma.opportunity.findFirst({
          where: {
            id: rawOpportunityId,
            userId: user.id, // ownership check
          },
          select: { id: true },
        });

      if (verifiedOpportunity) {
        const {
          error: opportunityLinkError,
        } =
          await supabase
            .from(
              "interview_sessions",
            )
            .update({
              // Cast needed: Supabase typed client doesn't reflect the new column
              // until types are regenerated after migration deployment.
              opportunityId:
                verifiedOpportunity.id,
            } as any)
            .eq(
              "id",
              result.sessionId,
            )
            .eq(
              "user_id",
              user.id,
            );

        if (opportunityLinkError) {
          // Non-blocking: link failure does not abort the simulation.
          console.warn(
            "[simulation/create] opportunityId link failed:",
            opportunityLinkError,
          );
        } else {
          console.info(
            "[simulation/create] session linked to opportunity",
            {
              sessionId: result.sessionId,
              opportunityId: verifiedOpportunity.id,
            },
          );
        }
      } else {
        // opportunityId sent by client does not belong to this user — silently refuse.
        console.warn(
          "[simulation/create] opportunityId ownership check failed — link refused",
          {
            userId: user.id,
            opportunityIdAttempted: rawOpportunityId,
          },
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
      SimulationQuotaExceededError
    ) {
      return quotaExceededResponse(
        request,
        error.quota,
      );
    }

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