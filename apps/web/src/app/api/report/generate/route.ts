import { createClient } from "@/lib/supabase/server";
import { Container, ServiceTokens } from "@/infrastructure/di";
import { initializeContainer } from "@/infrastructure/di/bootstrap";
import { ReportService } from "@/application/services";
import { AuthenticationError, ValidationError } from "@/core/errors";
import { ApiResponseBuilder } from "@/core/http";
import { GenerateReportSchema } from "@/validation";
import { IdempotencyService } from "@/core/idempotency/IdempotencyService";
import { BillingService } from "@/lib/db/billing.service";
import { NextRequest } from "next/server";

const ENABLE_REPORT_BILLING = process.env.ENABLE_REPORT_BILLING === "true";
const REPORT_COST = 15; // credits per report

export async function POST(request: NextRequest) {
  try {
    initializeContainer();

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return ApiResponseBuilder.unauthorized();
    }

    const idempotencyKey = request.headers.get("Idempotency-Key");

    const body = await request.json();
    const validationResult = GenerateReportSchema.safeParse({ sessionId: body.sessionId });
    if (!validationResult.success) {
      const fieldErrors = validationResult.error.flatten().fieldErrors;
      const validationFields: Array<{ field: string; message: string }> = [];
      for (const [field, messages] of Object.entries(fieldErrors)) {
        if (messages && messages.length > 0) {
          validationFields.push({ field, message: messages[0] });
        }
      }
      throw new ValidationError("Invalid input data", validationFields);
    }

    const validatedData = validationResult.data;
    const reportService = (await Container.resolve(ServiceTokens.ReportService)) as ReportService;

    const generateWithBilling = async () => {
      let txId: string | undefined;
      const opKey = idempotencyKey || `report-${user.id}-${validatedData.sessionId}-${Date.now()}`;

      if (ENABLE_REPORT_BILLING) {
        const reserve = await BillingService.reserveCredits({
          userId: user.id,
          amount: REPORT_COST,
          action: "report_generate" as any,
          operationId: opKey,
        });
        if (!reserve.success) {
          throw new Error(`BILLING_ERROR:${reserve.error}`);
        }
        txId = reserve.txId;
      }

      try {
        const data = await reportService.generateReport({
          userId: user.id,
          sessionId: validatedData.sessionId,
        });

        // =========================================================
        // Dashboard KPIs + Gamification (best-effort)
        // =========================================================
        // 1) Persist score/feedback for KPIs
        try {
          const score =
            typeof (data as any).overallScore === "number"
              ? (data as any).overallScore
              : typeof (data as any).score === "number"
                ? (data as any).score
                : null;

          await supabase
            .from("interview_sessions")
            .upsert(
              {
                id: validatedData.sessionId,
                user_id: user.id,
                score,
                feedback: data as any,
              },
              { onConflict: "id" }
            );
        } catch (e) {
          console.warn("[report/generate] interview_sessions upsert failed:", e);
        }

        // 2) Award badges based on stored sessions
        try {
          await supabase.rpc("award_badges_for_user", { p_user_id: user.id });
        } catch (e) {
          console.warn("[report/generate] award_badges_for_user failed:", e);
        }

        // Commit billing if enabled
        if (txId) {
          await BillingService.commitCredits(txId, 0);
        }

        return data;
      } catch (err: any) {
        if (txId) {
          await BillingService.rollbackCredits(txId, err.message || "Report generation failed");
        }
        throw err;
      }
    };

    let result;
    if (idempotencyKey) {
      const idempotencyService = new IdempotencyService();
      result = await idempotencyService.execute(
        idempotencyKey,
        user.id,
        "report_generate",
        validatedData,
        async () => {
          const data = await generateWithBilling();
          return { resultRef: (data as any).reportId, data };
        },
        async (resultRef) => ({
          reportId: resultRef,
          overallScore: 0,
          communication: 0,
          technical: 0,
          confidence: 0,
          strengths: [],
          improvements: [],
          summary: "Cached report",
          recommendation: "Please view your dashboard for details.",
        })
      );
    } else {
      result = await generateWithBilling();
    }

    return ApiResponseBuilder.created(result);
  } catch (error: any) {
    if (error instanceof AuthenticationError) {
      return ApiResponseBuilder.unauthorized();
    }
    if (error?.message?.startsWith("BILLING_ERROR:")) {
      return ApiResponseBuilder.badRequest("Crédits insuffisants");
    }
    return ApiResponseBuilder.fromError(error);
  }
}
