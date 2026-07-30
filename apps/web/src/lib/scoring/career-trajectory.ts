import { createSupabaseServerClient } from "@/lib/supabase/server";
import { logError } from "@/lib/logger/Logger";

export interface CTSResult {
  score: number;
  delta: number;
  label: string;
}

export function getCTSLabel(score: number): string {
  if (score <= 40) return "Foundation Phase";
  if (score <= 60) return "Emerging Candidate";
  if (score <= 75) return "Strong Candidate";
  if (score <= 90) return "Executive Ready";
  return "Board-Level Ready";
}

export async function computeAndSaveCTS(userId: string, sessionId: string, feedback: any): Promise<CTSResult | null> {
  try {
    const overall = feedback?.overallScore || 0;
    const credibility = feedback?.committeeDecision?.strategicCredibility || 0;
    const shortlist = feedback?.committeeDecision?.shortlistProbability || 0;

    // Clamp and calculate current session score
    const currentSessionScore = Math.max(0, Math.min(100, (0.4 * overall) + (0.3 * credibility) + (0.3 * shortlist)));

    const supabase = await createSupabaseServerClient();

    // Fetch last completed sessions to compute WMA
    // We get 4 to include the current one in the 5 max limit.
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

    const sessionScores = [currentSessionScore];
    
    if (history) {
      history.forEach(s => {
        const sOverall = s.feedback_json?.overallScore || 0;
        const sCred = s.feedback_json?.committeeDecision?.strategicCredibility || 0;
        const sShort = s.feedback_json?.committeeDecision?.shortlistProbability || 0;
        const sScore = Math.max(0, Math.min(100, (0.4 * sOverall) + (0.3 * sCred) + (0.3 * sShort)));
        sessionScores.push(sScore);
      });
    }

    // WMA formula with descending weights [5, 4, 3, 2, 1]
    const weights = [5, 4, 3, 2, 1].slice(0, sessionScores.length);
    const weightedSum = sessionScores.reduce((acc, score, i) => acc + (score * weights[i]), 0);
    const weightTotal = weights.reduce((a, b) => a + b, 0);
    
    const cts = weightTotal > 0 ? weightedSum / weightTotal : currentSessionScore;
    const finalCts = Math.round(cts * 10) / 10;

    // Delta calculation
    const previousCts = history && history.length > 0 ? history[0].career_trajectory_score : null;
    let delta = 0;
    if (previousCts !== null && previousCts !== undefined) {
      delta = Math.round((finalCts - previousCts) * 10) / 10;
    }

    // Save CTS to current session
    const { error: updateError } = await supabase
      .from("interview_sessions")
      .update({ career_trajectory_score: finalCts })
      .eq("id", sessionId);

    if (updateError) {
      logError("[CTS] Error saving score", updateError);
    }

    return {
      score: finalCts,
      delta,
      label: getCTSLabel(finalCts)
    };
  } catch (error) {
    logError("[CTS] computeAndSaveCTS error", error);
    return null;
  }
}
