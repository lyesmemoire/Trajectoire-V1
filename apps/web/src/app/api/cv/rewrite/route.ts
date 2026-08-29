import crypto from "crypto"

import {
  NextRequest,
  NextResponse,
} from "next/server"

import { IdempotencyService } from "@/core/idempotency/IdempotencyService"
import {
  generateImpactMetrics,
  improveExperience,
  rewriteSummary,
  tailorCVForOpportunity,
} from "@/lib/ai/cv-rewriter"
import { BillingService } from "@/lib/db/billing.service"
import { logger } from "@/lib/logger"
import { prisma } from "@/lib/prisma"
import { createClient } from "@/lib/supabase/server"

const REWRITE_COST = 2

const MAX_CONTENT_LENGTH = 20_000
const MAX_ROLE_LENGTH = 300
const MAX_CONTEXT_LENGTH = 15_000

type RewriteAction =
  | "rewrite_summary"
  | "improve_experience"
  | "generate_impact_metrics"
  | "tailor_opportunity"

type RewriteBody = {
  action?: string
  content?: string
  role?: string
  context?: string
}

function normalizeString(
  value: unknown,
  maxLength: number,
): string {
  if (typeof value !== "string") {
    return ""
  }

  return value
    .trim()
    .slice(0, maxLength)
}

function isRewriteAction(
  value: string,
): value is RewriteAction {
  return [
    "rewrite_summary",
    "improve_experience",
    "generate_impact_metrics",
    "tailor_opportunity",
  ].includes(value)
}

export async function POST(
  request: NextRequest,
) {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json(
      {
        error: "Non authentifié",
      },
      {
        status: 401,
      },
    )
  }

  let rawBody: RewriteBody

  try {
    rawBody =
      (await request.json()) as RewriteBody
  } catch {
    return NextResponse.json(
      {
        error: "Corps de requête invalide",
      },
      {
        status: 400,
      },
    )
  }

  const action =
    normalizeString(
      rawBody.action,
      80,
    )

  const content =
    normalizeString(
      rawBody.content,
      MAX_CONTENT_LENGTH,
    )

  const role =
    normalizeString(
      rawBody.role,
      MAX_ROLE_LENGTH,
    )

  const context =
    normalizeString(
      rawBody.context,
      MAX_CONTEXT_LENGTH,
    )

  if (!isRewriteAction(action)) {
    return NextResponse.json(
      {
        error: "Action non supportée",
      },
      {
        status: 400,
      },
    )
  }

  if (
    (
      action === "rewrite_summary" ||
      action === "improve_experience"
    ) &&
    !content
  ) {
    return NextResponse.json(
      {
        error: "Contenu manquant",
      },
      {
        status: 400,
      },
    )
  }

  if (
    action === "generate_impact_metrics" &&
    (
      !role ||
      !context
    )
  ) {
    return NextResponse.json(
      {
        error: "Rôle ou contexte manquant",
      },
      {
        status: 400,
      },
    )
  }

  if (
    action === "tailor_opportunity" &&
    (
      !content ||
      !role ||
      !context
    )
  ) {
    return NextResponse.json(
      {
        error:
          "CV, poste ou contexte d'opportunité manquant",
      },
      {
        status: 400,
      },
    )
  }

  const timeWindow =
    Math.floor(
      Date.now() /
        (10 * 60 * 1000),
    )

  const contentToHash = [
    action,
    content,
    role,
    context,
  ].join("|")

  const contentHash =
    crypto
      .createHash("sha256")
      .update(
        `${user.id}:${contentToHash}:${timeWindow}`,
      )
      .digest("hex")
      .slice(0, 32)

  const providedKey =
    request.headers.get(
      "Idempotency-Key",
    )

  const effectiveIdempKey =
    providedKey ||
    `rewrite-${contentHash}`

  const enableATSBilling =
    process.env.ENABLE_ATS_BILLING ===
    "true"

  if (
    enableATSBilling &&
    !providedKey &&
    request.headers.get(
      "X-Strict-Idempotency",
    ) === "true"
  ) {
    return NextResponse.json(
      {
        error:
          "Idempotency-Key header is required",
      },
      {
        status: 400,
      },
    )
  }

  const idempotencyService =
    new IdempotencyService()

  try {
    const finalResult =
      await idempotencyService.execute(
        effectiveIdempKey,

        user.id,

        "cv_rewrite",

        {
          action,
          contentLength:
            content.length,
          roleLength:
            role.length,
          contextLength:
            context.length,
        },

        async () => {
          let txId:
            | string
            | undefined

          if (enableATSBilling) {
            const reserveResult =
              await BillingService.reserveCredits(
                {
                  userId:
                    user.id,

                  amount:
                    REWRITE_COST,

                  action:
                    "cv_rewrite" as any,

                  operationId:
                    effectiveIdempKey,
                },
              )

            if (
              !reserveResult.success
            ) {
              throw new Error(
                `BILLING_ERROR:${reserveResult.error}`,
              )
            }

            txId =
              reserveResult.txId
          }

          let rewrittenContent = ""

          try {
            if (
              action ===
              "rewrite_summary"
            ) {
              rewrittenContent =
                await rewriteSummary(
                  content,
                )
            } else if (
              action ===
              "improve_experience"
            ) {
              rewrittenContent =
                await improveExperience(
                  content,
                )
            } else if (
              action ===
              "generate_impact_metrics"
            ) {
              rewrittenContent =
                await generateImpactMetrics(
                  role,
                  context,
                )
            } else {
              rewrittenContent =
                await tailorCVForOpportunity(
                  content,
                  role,
                  context,
                )
            }
          } catch (error) {
            if (txId) {
              await BillingService.rollbackCredits(
                txId,

                error instanceof Error
                  ? error.message
                  : "CV rewrite failed",
              )
            }

            throw error
          }

          if (txId) {
            await BillingService.commitCredits(
              txId,
              0,
            )
          }

          const expiresAt =
            new Date()

          expiresAt.setHours(
            expiresAt.getHours() +
              24,
          )

          await prisma.cvRewrite.create({
            data: {
              userId:
                user.id,

              idempotencyKey:
                effectiveIdempKey,

              action,

              originalContent:
                content,

              rewrittenContent,

              expiresAt,
            },
          })

          return {
            resultRef:
              effectiveIdempKey,

            data: {
              rewrittenContent,
            },
          }
        },

        async (
          resultRef,
        ) => {
          const cached =
            await prisma.cvRewrite.findUnique(
              {
                where: {
                  idempotencyKey:
                    resultRef,
                },
              },
            )

          if (!cached) {
            throw new Error(
              "Cached rewrite not found - may have expired",
            )
          }

          if (
            cached.expiresAt <
            new Date()
          ) {
            throw new Error(
              "Cached rewrite has expired",
            )
          }

          return {
            rewrittenContent:
              cached.rewrittenContent,
          }
        },
      )

    return NextResponse.json({
      success: true,
      data:
        finalResult.rewrittenContent,
    })
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unknown error"

    if (
      message.startsWith(
        "BILLING_ERROR:",
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Crédits insuffisants ou erreur de facturation",
        },
        {
          status: 402,
        },
      )
    }

    logger.error(
      {
        event:
          "CV rewrite - error",

        userId:
          user.id,

        action,

        message,
      },
      "CV rewrite failed",
    )

    return NextResponse.json(
      {
        error:
          "Erreur lors de la réécriture",
      },
      {
        status: 500,
      },
    )
  }
}