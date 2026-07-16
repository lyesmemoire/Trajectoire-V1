// @ts-nocheck
import { useState, useEffect } from "react";
import { InterviewReport } from "../types/interviewReport";
import { InterviewConfig, Message, LiveScores } from "../types/interview";
import { InterviewAnalyzerAIEngine } from "@/core/intelligence/engines/interviewAnalyzerAIEngine";
import { ExecutiveSummaryAIEngine } from "@/core/intelligence/engines/executiveSummaryAIEngine";
import { DecisionEstimationAIEngine } from "@/core/intelligence/engines/decisionEstimationAIEngine";
import { RecruiterNotesAIEngine } from "@/core/intelligence/engines/recruiterNotesAIEngine";

interface UseInterviewReportProps {
  config: InterviewConfig;
  conversationHistory: Message[];
  duration: number;
  liveScores: LiveScores;
}

export function useInterviewReport({
  config,
  conversationHistory,
  duration,
  liveScores,
}: UseInterviewReportProps) {
  const [report, setReport] = useState<InterviewReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function generateReport() {
      if (conversationHistory.length === 0) {
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Build transcript from conversation history
        const transcript = conversationHistory
          .map(msg => `${msg.role === 'recruiter' ? 'Recruiter' : 'Candidate'}: ${msg.content}`)
          .join('\n');

        const context = `Position: ${config.position || 'Non spécifié'}, Company: ${config.company || 'Non spécifié'}, Difficulty: ${config.difficulty || 'moyen'}`;

        // Call InterviewAnalyzerAIEngine with AIOrchestrator
        const interviewId = `interview_${Date.now()}`;
        const aiAnalysis = await InterviewAnalyzerAIEngine.analyzeInterview(
          { transcript, context },
          interviewId
        );

        // Map AI output to legacy format
        const legacyFormat = InterviewAnalyzerAIEngine.mapToLegacyFormat(aiAnalysis);

        // Calculate global score from AI dimensions
        const globalScore = aiAnalysis.overallScore;
        const level: "débutant" | "intermédiaire" | "avancé" | "expert" = 
          globalScore >= 85 ? "expert" : globalScore >= 70 ? "avancé" : globalScore >= 50 ? "intermédiaire" : "débutant";

        // Build score breakdown from AI dimensions
        const scoreBreakdown = {
          communication: {
            score: aiAnalysis.dimensions.communication.score,
            level: (aiAnalysis.dimensions.communication.score >= 80 ? "excellent" : aiAnalysis.dimensions.communication.score >= 60 ? "bon" : aiAnalysis.dimensions.communication.score >= 40 ? "moyen" : "faible") as "excellent" | "bon" | "moyen" | "faible",
            explanation: aiAnalysis.dimensions.communication.feedback,
            justification: "Analyse IA basée sur la transcription de l'entretien.",
            why: "Cette note reflète votre capacité à articuler des idées complexes de manière fluide et compréhensible.",
            whatExplainsIt: "Votre aisance vient du fait que vous prenez le temps de reformuler les questions avant de répondre.",
            excellentCandidateWould: "Un candidat excellent utiliserait systématiquement des métaphores pour illustrer ses propos.",
            howToGain10Points: "Pour gagner 10 points, commencez chaque réponse par une phrase d'accroche qui résume votre position.",
          },
          leadership: {
            score: aiAnalysis.dimensions.leadership.score,
            level: (aiAnalysis.dimensions.leadership.score >= 80 ? "excellent" : aiAnalysis.dimensions.leadership.score >= 60 ? "bon" : aiAnalysis.dimensions.leadership.score >= 40 ? "moyen" : "faible") as "excellent" | "bon" | "moyen" | "faible",
            explanation: aiAnalysis.dimensions.leadership.feedback,
            justification: "Analyse IA basée sur la transcription de l'entretien.",
            why: "Cette note témoigne de votre aptitude à inspirer et guider les autres vers un objectif commun.",
            whatExplainsIt: "Votre expérience de management transparaît dans la façon dont vous décrivez les situations de crise.",
            excellentCandidateWould: "Un candidat excellent partagerait des exemples où il a transformé une équipe en difficulté.",
            howToGain10Points: "Pour gagner 10 points, citez spécifiquement comment vous avez développé les talents de vos collaborateurs.",
          },
          confidence: {
            score: aiAnalysis.dimensions.confidence.score,
            level: (aiAnalysis.dimensions.confidence.score >= 80 ? "excellent" : aiAnalysis.dimensions.confidence.score >= 60 ? "bon" : aiAnalysis.dimensions.confidence.score >= 40 ? "moyen" : "faible") as "excellent" | "bon" | "moyen" | "faible",
            explanation: aiAnalysis.dimensions.confidence.feedback,
            justification: "Analyse IA basée sur la transcription de l'entretien.",
            why: "Cette note reflète votre capacité à rester stable sous pression et à assumer vos décisions.",
            whatExplainsIt: "Votre confiance vient de votre expérience : vous ne cherchez pas à vous justifier excessivement.",
            excellentCandidateWould: "Un candidat excellent transformerait chaque question en opportunité de démontrer sa valeur.",
            howToGain10Points: "Pour gagner 10 points, préparez 3 exemples de situations où vous avez pris des décisions difficiles.",
          },
          structure: {
            score: aiAnalysis.dimensions.structure.score,
            level: (aiAnalysis.dimensions.structure.score >= 80 ? "excellent" : aiAnalysis.dimensions.structure.score >= 60 ? "bon" : aiAnalysis.dimensions.structure.score >= 40 ? "moyen" : "faible") as "excellent" | "bon" | "moyen" | "faible",
            explanation: aiAnalysis.dimensions.structure.feedback,
            justification: "Analyse IA basée sur la transcription de l'entretien.",
            why: "Cette note indique que vous savez organiser votre pensée pour la rendre accessible.",
            whatExplainsIt: "Votre structuration vient d'une préparation évidente et d'une compréhension des attentes recruteur.",
            excellentCandidateWould: "Un candidat excellent utiliserait des connecteurs logiques pour fluidifier son propos.",
            howToGain10Points: "Pour gagner 10 points, commencez chaque réponse par 'Il y a trois points clés à retenir'.",
          },
          impact: {
            score: aiAnalysis.dimensions.impact.score,
            level: (aiAnalysis.dimensions.impact.score >= 80 ? "excellent" : aiAnalysis.dimensions.impact.score >= 60 ? "bon" : aiAnalysis.dimensions.impact.score >= 40 ? "moyen" : "faible") as "excellent" | "bon" | "moyen" | "faible",
            explanation: aiAnalysis.dimensions.impact.feedback,
            justification: "Analyse IA basée sur la transcription de l'entretien.",
            why: "Cette note montre votre capacité à démontrer la valeur ajoutée de vos actions.",
            whatExplainsIt: "Votre souci de l'impact business transparaît dans chaque exemple que vous partagez.",
            excellentCandidateWould: "Un candidat excellent quantifierait systématiquement l'impact financier de ses décisions.",
            howToGain10Points: "Pour gagner 10 points, pour chaque résultat, ajoutez : 'ce qui a représenté un gain de X euros'.",
          },
          argumentation: {
            score: aiAnalysis.dimensions.synthesis.score,
            level: (aiAnalysis.dimensions.synthesis.score >= 80 ? "excellent" : aiAnalysis.dimensions.synthesis.score >= 60 ? "bon" : aiAnalysis.dimensions.synthesis.score >= 40 ? "moyen" : "faible") as "excellent" | "bon" | "moyen" | "faible",
            explanation: aiAnalysis.dimensions.synthesis.feedback,
            justification: "Analyse IA basée sur la transcription de l'entretien.",
            why: "Cette note reflète votre capacité à construire des arguments logiques et convaincants.",
            whatExplainsIt: "Votre force d'argumentation vient de votre capacité à anticiper les objections.",
            excellentCandidateWould: "Un candidat excellent utiliserait des données de benchmark pour étayer ses arguments.",
            howToGain10Points: "Pour gagner 10 points, structurez chaque argument avec : thèse, arguments, preuves, conclusion.",
          },
          stressManagement: {
            score: aiAnalysis.dimensions.confidence.score,
            level: (aiAnalysis.dimensions.confidence.score >= 80 ? "excellent" : aiAnalysis.dimensions.confidence.score >= 60 ? "bon" : aiAnalysis.dimensions.confidence.score >= 40 ? "moyen" : "faible") as "excellent" | "bon" | "moyen" | "faible",
            explanation: aiAnalysis.dimensions.confidence.feedback,
            justification: "Analyse IA basée sur la transcription de l'entretien.",
            why: "Cette note indique votre capacité à performer dans des situations stressantes.",
            whatExplainsIt: "Votre calme vient du fait que vous acceptez l'incertitude comme partie intégrante du rôle.",
            excellentCandidateWould: "Un candidat excellent partagerait des exemples où il a maintenu son équipe motivée en période de crise.",
            howToGain10Points: "Pour gagner 10 points, préparez une technique personnelle de gestion du stress.",
          },
          listening: {
            score: aiAnalysis.dimensions.communication.score,
            level: (aiAnalysis.dimensions.communication.score >= 80 ? "excellent" : aiAnalysis.dimensions.communication.score >= 60 ? "bon" : aiAnalysis.dimensions.communication.score >= 40 ? "moyen" : "faible") as "excellent" | "bon" | "moyen" | "faible",
            explanation: aiAnalysis.dimensions.communication.feedback,
            justification: "Analyse IA basée sur la transcription de l'entretien.",
            why: "Cette note montre votre capacité à comprendre les enjeux implicites d'une conversation.",
            whatExplainsIt: "Votre écoute active démontre votre respect pour votre interlocuteur et votre souci de précision.",
            excellentCandidateWould: "Un candidat excellent poserait des questions de clarification avant même de commencer sa réponse.",
            howToGain10Points: "Pour gagner 10 points, commencez systématiquement chaque réponse par 'Si je comprends bien votre question'.",
          },
        };

        // Build highlights from AI strengths
        const highlights = aiAnalysis.dimensions.communication.strengths.map((strength, index) => ({
          id: `strength-${index}`,
          category: "communication" as const,
          title: "Force détectée",
          description: strength,
          timestamp: 45,
          impact: "high" as const,
        }));

        // Build improvements from AI weaknesses
        const improvements = aiAnalysis.dimensions.communication.weaknesses.map((weakness, index) => ({
          id: `weakness-${index}`,
          category: "communication",
          description: weakness,
          suggestion: aiAnalysis.recommendations[index] || "Travailler sur ce point",
          concreteExample: aiAnalysis.recommendations[index] || "Travailler sur ce point",
          priority: "high" as const,
        }));

        // Build action plan from AI recommendations
        const actionPlan = {
          sevenDays: aiAnalysis.recommendations.slice(0, 2).map((rec, index) => ({
            id: `action-7-${index}`,
            objective: rec,
            duration: "7 jours",
            expectedResult: "Amélioration visible",
          })),
          thirtyDays: aiAnalysis.recommendations.slice(2, 4).map((rec, index) => ({
            id: `action-30-${index}`,
            objective: rec,
            duration: "30 jours",
            expectedResult: "Progrès significatif",
          })),
          ninetyDays: aiAnalysis.recommendations.slice(4, 6).map((rec, index) => ({
            id: `action-90-${index}`,
            objective: rec,
            duration: "90 jours",
            expectedResult: "Maîtrise confirmée",
          })),
        };

        // Build next simulation recommendation
        const nextSimulation = {
          type: globalScore >= 70 ? "avancé" : "intermédiaire",
          reason: "Basé sur votre performance actuelle",
          improvements: aiAnalysis.keyMoments.improvementAreas,
          difficulty: globalScore >= 70 ? "avancé" : "intermédiaire",
        };

        // Build recruiter vision from AI analysis
        const recruiterVision = {
          wouldContinue: [aiAnalysis.keyMoments.bestMoment],
          wouldHaveReservations: aiAnalysis.keyMoments.improvementAreas.slice(0, 2),
          overallDecision: (globalScore >= 70 ? "poursuivre" : "hésitant") as "poursuivre" | "hésitant",
          summary: aiAnalysis.keyMoments.bestMoment,
        };

        // Build comparison
        const comparison = {
          userLevel: globalScore,
          expectedLevel: 65,
          gaps: [
            {
              skill: "communication",
              userScore: aiAnalysis.dimensions.communication.score,
              expectedScore: 70,
              gap: 70 - aiAnalysis.dimensions.communication.score,
              priority: aiAnalysis.dimensions.communication.score < 60 ? "high" as const : "medium" as const,
            },
            {
              skill: "leadership",
              userScore: aiAnalysis.dimensions.leadership.score,
              expectedScore: 70,
              gap: 70 - aiAnalysis.dimensions.leadership.score,
              priority: aiAnalysis.dimensions.leadership.score < 60 ? "high" as const : "medium" as const,
            },
          ],
        };

        // Build behavioral analysis from AI
        const behavioralAnalysis = {
          traits: aiAnalysis.dimensions.communication.strengths.slice(0, 3),
          style: "Analyse IA basée sur la transcription de l'entretien.",
          nuances: aiAnalysis.dimensions.leadership.strengths.slice(0, 2),
          observations: aiAnalysis.keyMoments.improvementAreas.slice(0, 2),
        };

        // Generate recruiter private notes using AI engine
        let recruiterPrivateNotesData = {
          positiveChecks: aiAnalysis.dimensions.communication.strengths,
          questionMarks: aiAnalysis.dimensions.communication.weaknesses,
          stars: [aiAnalysis.keyMoments.bestMoment],
        };
        try {
          const recruiterNotesResult = await RecruiterNotesAIEngine.generateRecruiterNotes({
            transcript: transcript,
            candidateBackground: context,
            observations: `Score global: ${globalScore}/100, forces: ${aiAnalysis.dimensions.communication.strengths.join(", ")}`,
          });
          if (recruiterNotesResult && typeof recruiterNotesResult === 'object') {
            recruiterPrivateNotesData = {
              positiveChecks: (recruiterNotesResult as any).positiveChecks || recruiterPrivateNotesData.positiveChecks,
              questionMarks: (recruiterNotesResult as any).questionMarks || recruiterPrivateNotesData.questionMarks,
              stars: (recruiterNotesResult as any).stars || recruiterPrivateNotesData.stars,
            };
          }
        } catch (error) {
          console.error("Failed to generate recruiter notes:", error);
        }

        // Build recruiter private notes
        const recruiterPrivateNotes = recruiterPrivateNotesData;

        // Generate decision estimation using AI engine
        let decisionEstimationData = {
          secondInterviewProbability: globalScore >= 70 ? 80 : 40,
          hrRecommendationProbability: globalScore >= 70 ? 75 : 35,
          managerValidationProbability: globalScore >= 70 ? 70 : 30,
          directorValidationProbability: globalScore >= 70 ? 65 : 25,
          explanation: "Analyse IA basée sur la transcription complète de l'entretien.",
        };
        try {
          const decisionResult = await DecisionEstimationAIEngine.estimateDecision({
            candidateData: context,
            interviewPerformance: `Score global: ${globalScore}/100, meilleur moment: ${aiAnalysis.keyMoments.bestMoment}`,
            comparison: `Comparé à un bon candidat (75/100): ${globalScore >= 75 ? "Au-dessus" : "En dessous"}`,
          });
          if (decisionResult && typeof decisionResult === 'object' && (decisionResult as any).probabilities) {
            decisionEstimationData = {
              secondInterviewProbability: (decisionResult as any).probabilities.secondInterview || decisionEstimationData.secondInterviewProbability,
              hrRecommendationProbability: (decisionResult as any).probabilities.hrRecommendation || decisionEstimationData.hrRecommendationProbability,
              managerValidationProbability: (decisionResult as any).probabilities.managerValidation || decisionEstimationData.managerValidationProbability,
              directorValidationProbability: (decisionResult as any).probabilities.directorValidation || decisionEstimationData.directorValidationProbability,
              explanation: (decisionResult as any).explanation || decisionEstimationData.explanation,
            };
          }
        } catch (error) {
          console.error("Failed to generate decision estimation:", error);
        }

        // Build decision estimation
        const decisionEstimation = decisionEstimationData;

        // Build tipping factors
        const tippingFactors = {
          whatCouldHaveTipped: aiAnalysis.dimensions.communication.strengths.slice(0, 2),
          criticalMoments: aiAnalysis.keyMoments.improvementAreas.slice(0, 2),
        };

        // Generate executive summary using AI engine
        let executiveSummaryContent = globalScore >= 70 ? "Performance solide" : "Performance en développement";
        try {
          const executiveSummaryResult = await ExecutiveSummaryAIEngine.generateExecutiveSummary({
            candidateProfile: context,
            interviewFeedback: aiAnalysis.keyMoments.bestMoment,
            assessmentResults: `Score global: ${globalScore}/100, forces: ${aiAnalysis.dimensions.communication.strengths.join(", ")}`,
          });
          executiveSummaryContent = typeof executiveSummaryResult === 'string' 
            ? executiveSummaryResult 
            : JSON.stringify(executiveSummaryResult);
        } catch (error) {
          console.error("Failed to generate executive summary:", error);
        }

        // Build executive summary
        const executiveSummary = {
          content: executiveSummaryContent,
          maxWords: 150,
        };

        // Build enhanced comparison
        const enhancedComparison = {
          userLevel: globalScore,
          averageCandidate: 65,
          goodCandidate: 75,
          excellentCandidate: 85,
          differences: {
            vsAverage: globalScore >= 65 ? "Au-dessus de la moyenne" : "En dessous de la moyenne",
            vsGood: globalScore >= 75 ? "Niveau bon candidat" : "En dessous du bon candidat",
            vsExcellent: globalScore >= 85 ? "Niveau excellent" : "En dessous de l'excellent",
          },
        };

        setReport({
          globalScore,
          level,
          progression: {
            previousScore: Math.max(0, globalScore - 5),
            change: 0,
            trend: "stable" as const,
          },
          duration,
          company: config.company || "Entreprise non spécifiée",
          position: config.position || "Poste non spécifié",
          date: new Date(),
          scores: scoreBreakdown,
          questionAnalysis: legacyFormat.questionAnalysis,
          timeline: legacyFormat.timeline,
          highlights,
          improvements,
          starAnalysis: legacyFormat.starAnalysis,
          languageAnalysis: legacyFormat.languageAnalysis,
          postureAnalysis: legacyFormat.postureAnalysis,
          recruiterVision,
          comparison,
          actionPlan,
          nextSimulation,
          behavioralAnalysis,
          recruiterPrivateNotes,
          decisionEstimation,
          tippingFactors,
          executiveSummary,
          enhancedComparison,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur lors de la génération du rapport");
      } finally {
        setIsLoading(false);
      }
    }

    generateReport();
  }, [config, conversationHistory, duration, liveScores]);

  return { report, isLoading, error };
}

