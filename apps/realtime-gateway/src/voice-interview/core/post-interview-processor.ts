import { interviewRepository } from "../persistence/singleton";
import { scoreStructuredInterview, callMistral } from "./scoring";
import { computeWeightedOverall } from "./compute-weighted-score";
import type { RoleType } from "./role-weights";
import { getUserPlan } from "../billing/usage-service";
import { generatePremiumReport } from "./premium-report";

export async function finalizeInterview(
  sessionId: string,
  log: (event: string, fields: Record<string, unknown>) => void,
): Promise<void> {
  try {
    const record = await interviewRepository.get(sessionId);
    if (!record || record.transcript.length === 0) return;

    // 1. Structured Score
    const transcriptText = record.transcript.join("\n");
    const structuredScore = await scoreStructuredInterview(
      transcriptText,
      callMistral,
    );

    // 2. Weighted Overall
    const role = (record.targetRole as RoleType) ?? "generic";
    const weightedOverall = computeWeightedOverall(structuredScore, role);

    const finalScore = {
      ...structuredScore,
      overall: weightedOverall,
      roleUsed: role,
    };

    // 3. Premium Report if user plan is not "free"
    let premiumReport;
    const userPlan = await getUserPlan(record.userId);

    if (userPlan !== "free") {
      premiumReport = await generatePremiumReport(
        transcriptText,
        finalScore,
        role,
        callMistral,
      );
      log("premium_report_generated", { sessionId, userPlan });
    }

    // 4. Update DB
    await interviewRepository.update(sessionId, {
      score: finalScore,
      ...(premiumReport ? { premiumReport } : {}),
    });

    log("interview_scored", {
      sessionId,
      overall: finalScore.overall,
      roleUsed: role,
    });
  } catch (err) {
    log("interview_scoring_error", { sessionId, error: String(err) });
  }
}
