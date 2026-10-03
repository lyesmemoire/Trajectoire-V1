import { NextRequest, NextResponse } from "next/server";

import { Container, ServiceTokens } from "@/infrastructure/di";
import { initializeContainer } from "@/infrastructure/di/bootstrap";
import { SimulationService } from "@/application/services";
import { AuthenticationError, ValidationError } from "@/core/errors";
import { ApiResponseBuilder } from "@/core/http";
import { CreateSessionSchema } from "@/validation";
import { IdempotencyService } from "@/core/idempotency/IdempotencyService";
import { AuthServiceUnavailableError, getVerifiedUserWithRetry } from "@/lib/auth/verified-user";
import { checkSimulationQuota, type SimulationQuota } from "@/lib/quota/simulation-quota";
import {
  MAX_JOB_DESCRIPTION_LENGTH,
  SimulationQuotaExceededError,
  createSimulationRecord,
  finalizeSimulation,
  type InterviewType,
} from "@/lib/simulation/start-simulation";

function authUnavailableResponse() {
  return NextResponse.json(
    {
      success: false,
      data: null,
      error: {
        code: "AUTH_SERVICE_UNAVAILABLE",
        message: "Le service d'authentification est temporairement indisponible. Réessayez.",
      },
    },
    {
      status: 503,
      headers: { "Retry-After": "3" },
    },
  );
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
function quotaExceededResponse(request: NextRequest, quota: SimulationQuota): NextResponse {
  const wantsJson = request.headers.get("accept")?.includes("application/json") ?? false;

  if (!wantsJson) {
    return NextResponse.redirect(new URL("/pricing?reason=quota", request.url), 303);
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

export async function POST(request: NextRequest) {
  try {
    initializeContainer();

    const { supabase, user, authError } = await getVerifiedUserWithRetry();

    if (authError || !user) {
      return ApiResponseBuilder.unauthorized();
    }

    // --- Quota : refus rapide avant tout travail (FREE, Pack épuisé/expiré) ---
    // La consommation elle-même est atomique et se fait dans createSimulationRecord.
    const quota = await checkSimulationQuota(user.id);
    if (!quota.allowed) {
      return quotaExceededResponse(request, quota);
    }

    const formData = await request.formData();

    const jobDescriptionRaw = formData.get("jobDescription");
    const jobDescription =
      typeof jobDescriptionRaw === "string"
        ? jobDescriptionRaw.trim().slice(0, MAX_JOB_DESCRIPTION_LENGTH)
        : "";

    const rawData = {
      jobTitle: formData.get("jobTitle") as string,
      level: formData.get("level") as string,
      interviewType: formData.get("interviewType") as string,
      duration: Number.parseInt(String(formData.get("duration") ?? ""), 10),
      opportunityId: formData.get("opportunityId") ?? undefined,
      difficulty: formData.get("difficulty") ?? undefined,
      persona: formData.get("persona") ?? undefined,
      mandatoryQuestion: formData.get("mandatoryQuestion") ?? undefined,
    };

    const validationResult = CreateSessionSchema.safeParse(rawData);

    if (!validationResult.success) {
      const fieldErrors = validationResult.error.flatten().fieldErrors;

      const validationFields: Array<{ field: string; message: string }> = [];

      for (const [field, messages] of Object.entries(fieldErrors)) {
        if (messages && messages.length > 0) {
          validationFields.push({ field, message: messages[0] ?? "Valeur invalide" });
        }
      }

      throw new ValidationError("Invalid input data", validationFields);
    }

    const validatedData = validationResult.data;
    const interviewType = validatedData.interviewType as InterviewType;

    const simulationService = (await Container.resolve(ServiceTokens.SimulationService)) as SimulationService;

    // Consommation atomique juste avant la création : exécutée une seule fois,
    // y compris avec une clé d'idempotence (un rejeu ne redécompte pas).
    const createSimulation = () =>
      createSimulationRecord({
        userId: user.id,
        jobTitle: validatedData.jobTitle,
        level: validatedData.level,
        interviewType,
        duration: validatedData.duration,
      });

    const idempotencyKey = request.headers.get("Idempotency-Key");

    let result;

    if (idempotencyKey) {
      const idempotencyService = new IdempotencyService();

      result = await idempotencyService.execute(
        idempotencyKey,
        user.id,
        "simulation_create",
        { ...validatedData, jobDescription },
        async () => {
          const data = await createSimulation();
          return { resultRef: data.sessionId, data };
        },
        async (resultRef) => {
          const session = await simulationService.getSession(resultRef, user.id);

          return {
            sessionId: session.id,
            jobTitle: session.jobTitle,
            level: session.level,
            interviewType: session.interviewType,
            durationSeconds: session.durationSeconds,
          };
        },
      );
    } else {
      result = await createSimulation();
    }

    // Offre, réglages, lien avec l'opportunité, puis première question : une simulation ne doit jamais
    // arriver sur la page sans première question.
    await finalizeSimulation({
      supabase,
      userId: user.id,
      sessionId: result.sessionId,
      input: {
        jobTitle: validatedData.jobTitle,
        level: validatedData.level,
        interviewType,
        duration: validatedData.duration,
        jobDescription,
        difficulty: validatedData.difficulty,
        persona: validatedData.persona,
        mandatoryQuestion: validatedData.mandatoryQuestion,
        opportunityId: validatedData.opportunityId,
      },
    });

    return NextResponse.redirect(new URL(`/simulation/${result.sessionId}`, request.url), 303);
  } catch (error) {
    if (error instanceof SimulationQuotaExceededError) {
      return quotaExceededResponse(request, error.quota);
    }

    if (error instanceof AuthServiceUnavailableError) {
      console.error("[simulation/create] Supabase Auth unavailable:", error.causeValue);

      return authUnavailableResponse();
    }

    if (error instanceof AuthenticationError) {
      return ApiResponseBuilder.unauthorized();
    }

    return ApiResponseBuilder.fromError(error);
  }
}
