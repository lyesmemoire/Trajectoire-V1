import { useMemo, useState, useEffect } from "react";
import type { InterviewConfig, LiveScores, Message } from "../types/interview";
import type { ActionPlan, InterviewReport, ScoreDetail } from "../types/interviewReport";

interface UseInterviewReportProps {
  readonly config: InterviewConfig;
  readonly conversationHistory: readonly Message[];
  readonly duration: number;
  readonly liveScores: LiveScores;
}

function scoreLevel(score: number): ScoreDetail["level"] {
  if (score >= 80) return "excellent";
  if (score >= 60) return "bon";
  if (score >= 40) return "moyen";
  return "faible";
}

function detail(score: number, category: string): ScoreDetail {
  const safeScore = Math.max(0, Math.min(100, Math.round(score)));
  return {
    score: safeScore,
    level: scoreLevel(safeScore),
    explanation: "Évaluation en direct de " + category + ".",
    justification: "Les indicateurs de simulation sont consolidés au fil de l'entretien.",
    why: "Cette note reflète les signaux observés pendant la simulation.",
    whatExplainsIt: "La progression dépend de la structure et de la précision des réponses.",
    excellentCandidateWould: "Un candidat excellent apporterait des exemples concrets et chiffrés.",
    howToGain10Points: "Structurez la réponse avec la méthode STAR et quantifiez l'impact.",
  };
}

function average(scores: LiveScores): number {
  const values = Object.values(scores);
  return values.reduce((total, value) => total + value, 0) / values.length;
}

function createActionPlan(): ActionPlan {
  const step = {
    id: "star-practice",
    objective: "Préparer un exemple STAR chiffré",
    duration: "20 minutes",
    expectedResult: "Une réponse structurée et mesurable",
  };

  return { sevenDays: [step], thirtyDays: [step], ninetyDays: [step] };
}

function createReport(
  config: InterviewConfig,
  conversationHistory: readonly Message[],
  duration: number,
  liveScores: LiveScores,
): InterviewReport {
  const globalScore = Math.round(average(liveScores));
  const level = globalScore >= 85 ? "expert" : globalScore >= 70 ? "avancé" : globalScore >= 50 ? "intermédiaire" : "débutant";
  const scoreBreakdown = {
    communication: detail(liveScores.communication, "la communication"),
    leadership: detail(liveScores.leadership, "le leadership"),
    confidence: detail(liveScores.confidence, "la confiance"),
    structure: detail(liveScores.structure, "la structure"),
    impact: detail(liveScores.impact, "l'impact"),
    argumentation: detail(liveScores.structure, "l'argumentation"),
    stressManagement: detail(liveScores.stressManagement, "la gestion du stress"),
    listening: detail(liveScores.synthesis, "l'écoute"),
  };

  return {
    globalScore,
    level,
    progression: { previousScore: Math.max(0, globalScore - 5), change: 0, trend: "stable" },
    duration,
    company: config.company || "Entreprise non spécifiée",
    position: config.position || "Poste non spécifié",
    date: new Date(),
    scores: scoreBreakdown,
    questionAnalysis: conversationHistory
      .filter((message) => message.role === "recruiter")
      .map((message, index) => ({
        id: String(index),
        question: message.content,
        responseSummary: "Réponse capturée dans la simulation.",
        positives: [],
        weaknesses: [],
        recruiterThoughts: "À consolider avec la suite de l'entretien.",
        recruiterExpectations: "Illustrer les réponses par des résultats mesurables.",
        score: globalScore,
      })),
    timeline: [],
    highlights: [],
    improvements: [{
      id: "star",
      category: "Structure",
      description: "Renforcez la structuration des réponses.",
      suggestion: "Utilisez la méthode STAR.",
      concreteExample: "Situation, tâche, action, résultat.",
      priority: "high",
    }],
    starAnalysis: [],
    languageAnalysis: {
      fillerWords: { count: 0, frequency: "low", examples: [] },
      repetitions: { count: 0, frequency: "low", examples: [] },
      clarity: { score: liveScores.communication, feedback: "Conservez des réponses concises." },
      sentenceLength: { average: 0, variance: 0, feedback: "Variez la longueur des phrases." },
      vocabulary: { diversity: 0, sophistication: 0, feedback: "Utilisez un vocabulaire précis." },
      persuasion: { score: liveScores.impact, feedback: "Quantifiez les résultats." },
      fluency: { score: liveScores.confidence, feedback: "Prenez le temps de structurer la réponse." },
    },
    postureAnalysis: {
      confidence: { score: liveScores.confidence, feedback: "Maintenez une posture calme." },
      calmness: { score: liveScores.stressManagement, feedback: "Respirez avant de répondre." },
      leadership: { score: liveScores.leadership, feedback: "Explicitez vos décisions." },
      energy: { score: liveScores.impact, feedback: "Restez engagé." },
      impact: { score: liveScores.impact, feedback: "Mettez en avant vos résultats." },
      presence: { score: liveScores.confidence, feedback: "Conservez un discours assuré." },
    },
    recruiterVision: {
      wouldContinue: ["La simulation peut se poursuivre."],
      wouldHaveReservations: [],
      overallDecision: globalScore >= 70 ? "poursuivre" : "hésitant",
      summary: "Synthèse issue des indicateurs de simulation.",
    },
    comparison: { userLevel: globalScore, expectedLevel: config.difficulty === "expert" ? 85 : config.difficulty === "intermediate" ? 70 : 55, gaps: [] },
    actionPlan: createActionPlan(),
    nextSimulation: { type: config.interviewType, reason: "Consolider les compétences ciblées.", improvements: ["Structurer les réponses avec STAR."], difficulty: config.difficulty },
    behavioralAnalysis: { traits: [], style: "À préciser", nuances: [], observations: [] },
    recruiterPrivateNotes: { positiveChecks: [], questionMarks: [], stars: [] },
    decisionEstimation: { secondInterviewProbability: globalScore, hrRecommendationProbability: globalScore, managerValidationProbability: globalScore, directorValidationProbability: globalScore, explanation: "Projection indicative issue de la simulation." },
    tippingFactors: { whatCouldHaveTipped: [], criticalMoments: [] },
    executiveSummary: { content: "Rapport de simulation disponible.", maxWords: 150 },
    enhancedComparison: {
      userLevel: globalScore,
      averageCandidate: 65,
      goodCandidate: 75,
      excellentCandidate: 85,
      differences: { vsAverage: "Comparez votre performance à la moyenne.", vsGood: "Comparez votre performance à un bon candidat.", vsExcellent: "Comparez votre performance à un candidat excellent." },
    },
  };
}

export function useInterviewReport({ config, conversationHistory, duration, liveScores }: UseInterviewReportProps) {
  const [report, setReport] = useState<InterviewReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPersistedData() {
      setIsLoading(true);
      setError(null);

      try {
        // Try to fetch persisted interview data from repository
        const response = await fetch('/api/interview/report');
        if (response.ok) {
          const persistedData = await response.json();
          if (persistedData) {
            // Use persisted data if available
            setReport(persistedData);
            setIsLoading(false);
            return;
          }
        }
      } catch (fetchError) {
        console.warn("Failed to fetch persisted interview data, using fallback:", fetchError);
      }

      // Fallback to mock data if persistence is not available
      const fallbackReport = conversationHistory.length === 0 ? null : createReport(config, conversationHistory, duration, liveScores);
      setReport(fallbackReport);
      setIsLoading(false);
    }

    fetchPersistedData();
  }, [config, conversationHistory, duration, liveScores]);

  return { report, isLoading, error };
}

