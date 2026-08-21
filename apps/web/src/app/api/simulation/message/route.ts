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
  ConversationService,
} from "@/application/services";

import {
  AuthenticationError,
} from "@/core/errors";

import {
  ApiResponseBuilder,
} from "@/core/http";

import {
  SendMessageSchema,
} from "@/validation";

import {
  IdempotencyService,
} from "@/core/idempotency/IdempotencyService";

import {
  BillingService,
} from "@/lib/db/billing.service";

import {
  rateLimit,
} from "@/lib/rate-limiting/rate-limit.middleware";

import {
  RateLimitScope,
  RouteType,
} from "@/lib/rate-limiting/centralized-rate-limit.service";

import {
  AuthServiceUnavailableError,
  getVerifiedUserWithRetry,
} from "@/lib/auth/verified-user";

import {
  UnifiedInterviewContextService,
} from "@/application/interview-context/UnifiedInterviewContextService";

import type {
  UnifiedInterviewContext,
} from "@/application/interview-context/UnifiedInterviewContextService";

const ENABLE_SIL_BILLING =
  process.env.ENABLE_SIL_BILLING ===
  "true";

const SIL_MESSAGE_COST = 5;

function isAllowedOrigin(
  request: NextRequest,
): boolean {
  const origin =
    request.headers.get("origin");

  /*
   * Server-to-server/internal requests can legitimately omit Origin.
   * Browser POST requests normally include it.
   */
  if (!origin) {
    return true;
  }

  try {
    const requestOrigin =
      new URL(
        request.url,
      ).origin;

    return (
      origin === requestOrigin
    );
  } catch {
    return false;
  }
}

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

/**
 * Build the unified brain context without making the interview
 * dependent on CV / ATS availability.
 *
 * If this enrichment fails, the candidate can still continue
 * the interview using the legacy session context.
 */
async function buildUnifiedContextSafely(
  params: {
    supabase: any;
    userId: string;
    sessionId: string;
  },
): Promise<
  UnifiedInterviewContext | null
> {
  const {
    supabase,
    userId,
    sessionId,
  } = params;

  try {
    const service =
      new UnifiedInterviewContextService(
        supabase,
      );

    return await service.build({
      userId,
      sessionId,
    });
  } catch (error) {
    console.warn(
      "[simulation/message] Unified context unavailable, continuing with fallback:",
      error,
    );

    return null;
  }
}
export const POST =
  rateLimit(
    RouteType.SIMULATION,

    async (
      request: NextRequest,
    ) => {
      try {
        // =====================================================
        // 1. SAME-ORIGIN PROTECTION
        // =====================================================

        if (
          !isAllowedOrigin(
            request,
          )
        ) {
          return NextResponse.json(
            {
              success: false,

              error: {
                code:
                  "INVALID_ORIGIN",

                message:
                  "Origine de requête invalide.",
              },
            },

            {
              status: 403,
            },
          );
        }

        // =====================================================
        // 2. DEPENDENCY CONTAINER
        // =====================================================

        initializeContainer();

        // =====================================================
        // 3. AUTH
        // =====================================================

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

        // =====================================================
        // 4. REQUEST / VALIDATION
        // =====================================================

        const idempotencyKey =
          request.headers.get(
            "Idempotency-Key",
          );

        const formData =
          await request.formData();

        const rawData = {
          sessionId:
            formData.get(
              "sessionId",
            ) as string,

          content:
            formData.get(
              "content",
            ) as string,
        };

        const validationResult =
          SendMessageSchema
            .safeParse(
              rawData,
            );

        if (
          !validationResult.success
        ) {
          return ApiResponseBuilder
            .badRequest(
              "Invalid input data",
            );
        }

        const validatedData =
          validationResult.data;

        // =====================================================
        // 5. UNIFIED TRAJECTOIRE BRAIN CONTEXT
        // =====================================================

        /*
         * This is the new strategic bridge.
         *
         * Context can include:
         * - CV text
         * - job description
         * - matching score
         * - matched skills
         * - missing skills
         * - previous simulation scores
         * - interview priorities
         *
         * Failure here is intentionally non-fatal.
         */
        const unifiedContext =
          await buildUnifiedContextSafely({
            supabase,

            userId:
              user.id,

            sessionId:
              validatedData.sessionId,
          });

        // =====================================================
        // 6. IDEMPOTENCY KEY
        // =====================================================

        const effectiveIdempKey =
          idempotencyKey ??
          `sil-message-${user.id}-${Date.now()}`;
        // =====================================================
        // 7. SEND MESSAGE + OPTIONAL BILLING
        // =====================================================

        const sendWithBilling =
          async () => {
            if (
              ENABLE_SIL_BILLING
            ) {
              const reserveResult =
                await BillingService
                  .reserveCredits({
                    userId:
                      user.id,

                    amount:
                      SIL_MESSAGE_COST,

                    action:
                      "sil_message" as any,

                    operationId:
                      effectiveIdempKey,
                  });

              if (
                !reserveResult.success
              ) {
                throw new Error(
                  `BILLING_ERROR:${reserveResult.error}`,
                );
              }

              const conversationService =
                await Container.get<ConversationService>(
                  ServiceTokens.ConversationService,
                );

              try {
                const result =
                  await conversationService
                    .sendMessage({
                      userId:
                        user.id,

                      sessionId:
                        validatedData.sessionId,

                      content:
                        validatedData.content,

                      /*
                       * New contextual brain input.
                       *
                       * ConversationService remains backward compatible
                       * when this value is null.
                       */
                      unifiedContext,
                    });

                await BillingService
                  .commitCredits(
                    reserveResult.txId!,
                    0,
                  );

                return {
                  resultRef:
                    result.messageId,

                  data:
                    result,
                } as any;
              } catch (error) {
                /*
                 * Do not silently consume reserved credits if the
                 * conversation turn fails.
                 *
                 * The exact billing implementation may already handle
                 * expiration/rollback of reservations, so we preserve
                 * its existing contract here rather than inventing
                 * another refund call.
                 */
                throw error;
              }
            }

            const conversationService =
              await Container.get<ConversationService>(
                ServiceTokens.ConversationService,
              );

            const result =
              await conversationService
                .sendMessage({
                  userId:
                    user.id,

                  sessionId:
                    validatedData.sessionId,

                  content:
                    validatedData.content,

                  unifiedContext,
                });

            return {
              resultRef:
                result.messageId,

              data:
                result,
            } as any;
          };

        // =====================================================
        // 8. IDEMPOTENT EXECUTION
        // =====================================================

        const idempotencyService =
          new IdempotencyService();

        const result =
          await idempotencyService
            .execute(
              effectiveIdempKey,

              user.id,

              "sil_message",

              {
                sessionId:
                  validatedData.sessionId,

                /*
                 * Do NOT place CV text or job description in the
                 * idempotency payload.
                 *
                 * The business operation is the candidate message,
                 * not the entire contextual brain state.
                 */
                content:
                  validatedData.content,
              },

              sendWithBilling,

              async (
                resultRef:
                  string,
              ) => {
                const conversationService =
                  await Container.get<ConversationService>(
                    ServiceTokens.ConversationService,
                  );

                const messages =
                  await conversationService
                    .getMessages(
                      validatedData.sessionId,
                      user.id,
                    );

                return {
                  resultRef,

                  data: {
                    replayed: true,
                    messages,
                  },
                };
              },
            );
        // =====================================================
        // 9. RESPONSE
        // =====================================================

        /*
         * The simulation page reloads/refetches the session after this
         * operation, so JSON is more appropriate than an HTTP redirect.
         */
        return NextResponse.json(
          {
            success: true,

            data:
              result.data ??
              result,

            meta: {
              contextualInterview:
                Boolean(
                  unifiedContext,
                ),

              cvAvailable:
                Boolean(
                  unifiedContext
                    ?.candidate.cvText,
                ),

              matchingAvailable:
                unifiedContext
                  ?.matching.score !==
                  null &&
                unifiedContext
                  ?.matching.score !==
                  undefined,

              priorityCount:
                unifiedContext
                  ?.priorities.length ??
                0,
            },
          },

          {
            status: 200,
          },
        );
      } catch (error: any) {
        // =====================================================
        // AUTH NETWORK FAILURE
        // =====================================================

        if (
          error instanceof
          AuthServiceUnavailableError
        ) {
          console.error(
            "[simulation/message] Supabase Auth unavailable:",
            error.causeValue,
          );

          return authUnavailableResponse();
        }

        // =====================================================
        // AUTHENTICATION
        // =====================================================

        if (
          error instanceof
          AuthenticationError
        ) {
          return ApiResponseBuilder
            .unauthorized();
        }

        // =====================================================
        // BILLING
        // =====================================================

        if (
          error?.message
            ?.startsWith(
              "BILLING_ERROR:",
            )
        ) {
          return ApiResponseBuilder
            .badRequest(
              "Crédits insuffisants",
            );
        }

        // =====================================================
        // STANDARD APPLICATION ERRORS
        // =====================================================

        return ApiResponseBuilder
          .fromError(error);
      }
    },

    {
      scopes: [
        RateLimitScope.USER,
        RateLimitScope.IP,
      ],
    },
  );