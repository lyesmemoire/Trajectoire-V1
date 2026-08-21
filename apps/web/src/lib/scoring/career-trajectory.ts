import { createSupabaseServerClient } from "@/lib/supabase/server";
import { logError } from "@/lib/logger/Logger";
import type { Json } from "@/types/supabase.generated";

export interface CTSResult {
  score: number;
  delta: number;
  label: string;
}

interface CommitteeDecisionFeedback {
  strategicCredibility?: number;
  shortlistProbability?: number;
}

interface InterviewFeedback {
  overallScore?: number;
  committeeDecision?: CommitteeDecisionFeedback;
}

export function getCTSLabel(score: number): string {
  if (score <= 40) return "Foundation Phase";
  if (score <= 60) return "Emerging Candidate";
  if (score <= 75) return "Strong Candidate";
  if (score <= 90) return "Executive Ready";
  return "Board-Level Ready";
}

function isJsonObject(
  value: Json | null,
): value is { [key: string]: Json | undefined } {
  return (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value)
  );
}

function getNumber(
  value: Json | undefined,
): number {
  return typeof value === "number" ? value : 0;
}

function parseInterviewFeedback(
  value: Json | null,
): InterviewFeedback {
  if (!isJsonObject(value)) {
    return {};
  }

  const overallScore = getNumber(value.overallScore);

  let committeeDecision: CommitteeDecisionFeedback | undefined;

  if (
    value.committeeDecision !== undefined &&
    value.committeeDecision !== null &&
    typeof value.committeeDecision === "object" &&
    !Array.isArray(value.committeeDecision)
  ) {
    committeeDecision = {
      strategicCredibility: getNumber(
        value.committeeDecision.strategicCredibility,
      ),
      shortlistProbability: getNumber(
        value.committeeDecision.shortlistProbability,
      ),
    };
  }

  return {
    overallScore,
    committeeDecision,
  };
}

function calculateSessionScore(
  feedback: InterviewFeedback,
): number {
  const overall = feedback.overallScore ?? 0;
  const credibility =
    feedback.committeeDecision?.strategicCredibility ?? 0;
  const shortlist =
    feedback.committeeDecision?.shortlistProbability ?? 0;

  return Math.max(
    0,
    Math.min(
      100,
      (0.4 * overall) +
        (0.3 * credibility) +
        (0.3 * shortlist),
    ),
  );
}

export async function computeAndSaveCTS(
  userId: string,
  sessionId: string,
  feedback: InterviewFeedback,
): Promise<CTSResult | null> {
  try {
    const currentSessionScore = calculateSessionScore(feedback);

    const supabase = await createSupabaseServerClient();

    /*
     * Fetch the previous four completed sessions.
     * Together with the current score this gives a five-session WMA.
     */
    const { data: history, error } = await supabase
      .from("interview_sessions")
      .select("id, career_trajectory_score, feedback_json")
      .eq("user_id", userId)
      .eq("status", "completed")
      .order("created_at", { ascending: false })
      .limit(4);

    if (error) {
      logError("[CTS] Error fetching history", error);
      return null;
    }

    const sessionScores: number[] = [currentSessionScore];

    for (const session of history ?? []) {
      const parsedFeedback = parseInterviewFeedback(
        session.feedback_json,
      );

      sessionScores.push(
        calculateSessionScore(parsedFeedback),
      );
    }

    // WMA formula with descending weights [5, 4, 3, 2, 1].
    const weights = [5, 4, 3, 2, 1].slice(
      0,
      sessionScores.length,
    );

    const weightedSum = sessionScores.reduce(
      (accumulator, score, index) =>
        accumulator + score * weights[index],
      0,
    );

    const weightTotal = weights.reduce(
      (accumulator, weight) => accumulator + weight,
      0,
    );

    const cts =
      weightTotal > 0
        ? weightedSum / weightTotal
        : currentSessionScore;

    const finalCts = Math.round(cts * 10) / 10;

    const previousCts =
      history && history.length > 0
        ? history[0].career_trajectory_score
        : null;

    let delta = 0;

    if (
      previousCts !== null &&
      previousCts !== undefined
    ) {
      delta =
        Math.round((finalCts - previousCts) * 10) / 10;
    }

    const { error: updateError } = await supabase
      .from("interview_sessions")
      .update({
        career_trajectory_score: finalCts,
      })
      .eq("id", sessionId);

    if (updateError) {
      logError("[CTS] Error saving score", updateError);
    }

    return {
      score: finalCts,
      delta,
      label: getCTSLabel(finalCts),
    };
  } catch (error) {
    logError("[CTS] computeAndSaveCTS error", error);
    return null;
  }
}
