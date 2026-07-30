
export type InterviewSessionSummary = {
  id: string;
  createdAt: string;
  jobTitle: string;
  technicalScore: number;
  communicationScore: number;
  confidenceScore: number;
  stressScore: number;
  tags: string[];
};

export type ProgressKPI = {
  value: number;
  diff: number;
};

export type SkillInsight = {
  type: "weakness" | "strength" | "neutral";
  message: string;
};

export type CareerTrajectory = {
  currentScore: number;
  delta: number;
  label: string;
  history: number[];
};

export type ProgressData = {
  kpis: {
    technical: ProgressKPI;
    communication: ProgressKPI;
    confidence: ProgressKPI;
    stress: ProgressKPI;
  };
  history: InterviewSessionSummary[];
  insights: SkillInsight[];
  careerTrajectory: CareerTrajectory | null;
};

export async function getProgressData(supabase: unknown, userId: string, ): Promise<ProgressData | null> {
  const { data, error } = await supabase
    .from("premium_interview_sessions")
    .select(
      "id, created_at, job_title, technical_score, coherence_score, communication_score, confidence_score, stress_score, tags",
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  // Fetch CTS history from interview_sessions
  const { data: ctsData } = await supabase
    .from("interview_sessions")
    .select("career_trajectory_score")
    .eq("user_id", userId)
    .eq("status", "completed")
    .not("career_trajectory_score", "is", null)
    .order("created_at", { ascending: false })
    .limit(10);

  if (error) {
    console.error("Error fetching progress data:", error);
    return null;
  }

  if (!data || data.length === 0) {
    return null;
  }

  // Format history
  const history: InterviewSessionSummary[] = data.map((session: unknown) => ({
    id: session.id,
    createdAt: session.created_at,
    jobTitle: session.job_title,
    technicalScore: session.technical_score || 0,
    // Use communication_score if available, otherwise fallback to coherence_score
    communicationScore:
      session.communication_score || session.coherence_score || 0,
    confidenceScore: session.confidence_score || 0,
    stressScore: session.stress_score || 0,
    tags: Array.isArray(session.tags) ? (session.tags as string[]) : [],
  }));

  if (history.length === 0) return null;
  const latest = history[history.length - 1]!;
  const previous = history.length > 1 ? history[history.length - 2] : null;

  // Calculate KPIs
  const kpis = {
    technical: {
      value: latest.technicalScore,
      diff: previous ? latest.technicalScore - previous.technicalScore : 0,
    },
    communication: {
      value: latest.communicationScore,
      diff: previous
        ? latest.communicationScore - previous.communicationScore
        : 0,
    },
    confidence: {
      value: latest.confidenceScore,
      diff: previous ? latest.confidenceScore - previous.confidenceScore : 0,
    },
    stress: {
      value: latest.stressScore,
      diff: previous ? latest.stressScore - previous.stressScore : 0,
    },
  };

  // Generate Insights based on recent data
  const insights: SkillInsight[] = generateInsights(history);

  // Build career trajectory from CTS data
  let careerTrajectory: CareerTrajectory | null = null;
  if (ctsData && ctsData.length > 0) {
    const ctsHistory = ctsData.map((s: unknown) => s.career_trajectory_score as number).reverse();
    const current = ctsHistory[ctsHistory.length - 1];
    const previous = ctsHistory.length > 1 ? ctsHistory[ctsHistory.length - 2] : null;
    const delta = previous !== null ? Math.round((current - previous) * 10) / 10 : 0;

    const getCTSLabel = (score: number): string => {
      if (score <= 40) return "Foundation Phase";
      if (score <= 60) return "Emerging Candidate";
      if (score <= 75) return "Strong Candidate";
      if (score <= 90) return "Executive Ready";
      return "Board-Level Ready";
    };

    careerTrajectory = {
      currentScore: current,
      delta,
      label: getCTSLabel(current),
      history: ctsHistory
    };
  }

  return {
    kpis,
    history,
    insights,
    careerTrajectory,
  };
}

function generateInsights(history: InterviewSessionSummary[]): SkillInsight[] {
  const insights: SkillInsight[] = [];
  if (history.length === 0) return insights;

  const tagCounts: Record<string, number> = {};
  let confidenceTrend = 0;

  history.forEach((session, index) => {
    session.tags.forEach((tag) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });

    if (index > 0) {
      const prev = history[index - 1]!;
      if (session.confidenceScore > prev.confidenceScore) {
        confidenceTrend++;
      } else if (session.confidenceScore < prev.confidenceScore) {
        confidenceTrend--;
      }
    }
  });

  const totalSessions = history.length;

  // Rule-based insights
  if (
    tagCounts["missing_metrics"] &&
    tagCounts["missing_metrics"] >= Math.min(3, totalSessions)
  ) {
    insights.push({
      type: "weakness",
      message: "Vous fournissez rarement des métriques chiffrées.",
    });
  }

  if (
    tagCounts["weak_structure"] &&
    tagCounts["weak_structure"] >= Math.min(3, totalSessions)
  ) {
    insights.push({
      type: "weakness",
      message: "Vous perdez en structure sous pression ou dans la complexité.",
    });
  }

  if (tagCounts["rambling"] && tagCounts["rambling"] >= 2) {
    insights.push({
      type: "weakness",
      message:
        "Vos réponses ont tendance à s'allonger, essayez d'être plus concis.",
    });
  }

  if (confidenceTrend > 1) {
    insights.push({
      type: "strength",
      message:
        "Votre confiance progresse régulièrement après plusieurs sessions !",
    });
  }

  const latest = history[history.length - 1]!;
  if (latest.technicalScore > 80) {
    insights.push({
      type: "strength",
      message:
        "Excellente maîtrise technique démontrée lors de votre dernière session.",
    });
  }

  // Fallback if no specific insight
  if (insights.length === 0) {
    insights.push({
      type: "neutral",
      message:
        "Continuez à pratiquer pour accumuler plus de données et débloquer des analyses personnalisées.",
    });
  }

  return insights;
}
