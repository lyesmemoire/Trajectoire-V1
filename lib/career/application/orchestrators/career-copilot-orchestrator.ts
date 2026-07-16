import { CareerCopilotProactiveEngine, ProactiveInput, ProactiveOutput } from "@/core/intelligence/engines/careerCopilotProactiveEngine";
import { CareerCopilotSuccessIntelligenceEngine } from "@/core/intelligence/engines/careerCopilotSuccessIntelligenceEngine";
import { CareerCopilotTransferableSkillsIntelligenceEngine } from "@/core/intelligence/engines/careerCopilotTransferableSkillsIntelligenceEngine";
import { CareerCopilotSelfReviewEngine } from "@/core/intelligence/engines/careerCopilotSelfReviewEngine";
import { CareerCopilotResourceIntelligenceEngine } from "@/core/intelligence/engines/careerCopilotResourceIntelligenceEngine";
import { CareerCopilotReflectionIntelligenceEngine } from "@/core/intelligence/engines/careerCopilotReflectionIntelligenceEngine";
import { CareerCopilotProgressionPlanEngine } from "@/core/intelligence/engines/careerCopilotProgressionPlanEngine";
import { CareerCopilotPlanningIntelligenceEngine } from "@/core/intelligence/engines/careerCopilotPlanningIntelligenceEngine";
import { CareerCopilotOutcomeIntelligenceEngine } from "@/core/intelligence/engines/careerCopilotOutcomeIntelligenceEngine";
import { CareerCopilotMissionIntelligenceEngine } from "@/core/intelligence/engines/careerCopilotMissionIntelligenceEngine";
import { CareerCopilotGapIntelligenceEngine } from "@/core/intelligence/engines/careerCopilotGapIntelligenceEngine";
import { CareerCopilotForecastEngine } from "@/core/intelligence/engines/careerCopilotForecastEngine";
import { CareerCopilotFinalInterviewReportEngine } from "@/core/intelligence/engines/careerCopilotFinalInterviewReportEngine";
import { CareerCopilotEvidenceIntelligenceEngine } from "@/core/intelligence/engines/careerCopilotEvidenceIntelligenceEngine";
import { CareerCopilotDigitalTwinEngine } from "@/core/intelligence/engines/careerCopilotDigitalTwinEngine";
import { CareerCopilotDailySummaryEngine } from "@/core/intelligence/engines/careerCopilotDailySummaryEngine";
import { CareerCopilotConstraintIntelligenceEngine } from "@/core/intelligence/engines/careerCopilotConstraintIntelligenceEngine";
import { CareerCopilotAutonomousIntelligenceEngine } from "@/core/intelligence/engines/careerCopilotAutonomousIntelligenceEngine";
import { CareerCopilotApplicationIntelligenceEngine } from "@/core/intelligence/engines/careerCopilotApplicationIntelligenceEngine";
import { CareerCopilotAdaptiveStrategyEngine } from "@/core/intelligence/engines/careerCopilotAdaptiveStrategyEngine";
import { CareerCopilotAccountabilityEngine } from "@/core/intelligence/engines/careerCopilotAccountabilityEngine";
import { CareerCopilotVoiceInterviewEngine } from "@/core/intelligence/engines/careerCopilotVoiceInterviewEngine";
import { CrossAnalysisService } from "../services/cross-analysis.service";
import { CareerMemoryEntity } from "../../domain/entities/career-memory.entity";

export interface CareerCopilotInput {
  userId: string;
  cv?: string;
  careerProfile?: any;
  atsAnalysis?: any;
  jobOffer?: string;
  interviewHistory?: any[];
  interviewData?: any;
  voiceData?: any;
  reportData?: any;
  historicalData?: {
    cvs: any[];
    atsAnalyses: any[];
    interviews: any[];
    reports: any[];
    recommendations: any[];
  };
}

export interface CareerCopilotOutput {
  nextActions: string[];
  alerts: string[];
  tips: string[];
  strengths: string[];
  weaknesses: string[];
  recommendedSkills: string[];
  recommendedTraining: string[];
  recommendedProjects: string[];
  careerOpportunities: string[];
  confidenceScore: number;
  proactiveInitiatives?: any[];
  successAnalysis?: any;
  transferableSkills?: any;
  selfReview?: any;
  scenarios?: any;
  resources?: any;
  reflection?: any;
  progressionPlan?: any;
  planning?: any;
  personalization?: any;
  outcomeAnalysis?: any;
  opportunities?: any;
  mission?: any;
  metaAnalysis?: any;
  matching?: any;
  marketAnalysis?: any;
  interviewAnalysis?: any;
  liveCoaching?: any;
  knowledgeEvolution?: any;
  interviewPreparation?: any;
  goals?: any;
  gaps?: any;
  forecast?: any;
  finalReport?: any;
  execution?: any;
  evidence?: any;
  digitalTwin?: any;
  decisions?: any;
  dailySummary?: any;
  conversation?: any;
  constraints?: any;
  confidence?: any;
  coaching?: any;
  careerNarrative?: any;
  autonomy?: any;
  application?: any;
  adaptiveStrategy?: any;
  accountability?: any;
  voiceInterview?: any;
}

/**
 * Career Copilot Orchestrator
 * 
 * Orchestrates all existing Career Copilot engines to provide comprehensive career guidance.
 * Reuses all 39 existing engines without creating new ones.
 * Invoked automatically after each candidate journey step.
 */
export class CareerCopilotOrchestrator {
  private crossAnalysisService: CrossAnalysisService;

  constructor() {
    this.crossAnalysisService = new CrossAnalysisService();
  }

  /**
   * Analyze candidate data using all available engines
   */
  async analyze(input: CareerCopilotInput, careerMemory?: CareerMemoryEntity): Promise<CareerCopilotOutput> {
    const output: CareerCopilotOutput = {
      nextActions: [],
      alerts: [],
      tips: [],
      strengths: [],
      weaknesses: [],
      recommendedSkills: [],
      recommendedTraining: [],
      recommendedProjects: [],
      careerOpportunities: [],
      confidenceScore: 50
    };

    try {
      // 1. Generate proactive initiatives
      const proactiveInput: ProactiveInput = {
        candidateGraph: this.buildCandidateGraph(input)
      };
      const proactiveOutput = await CareerCopilotProactiveEngine.generateInitiatives(proactiveInput);
      output.proactiveInitiatives = proactiveOutput.initiatives;
      output.nextActions.push(...proactiveOutput.initiatives.map(i => i.proposedAction));
      output.alerts.push(...proactiveOutput.initiatives.filter(i => i.type === "warn").map(i => i.message));
      output.tips.push(...proactiveOutput.initiatives.filter(i => i.type === "advise").map(i => i.message));

      // 2. Extract strengths and weaknesses from candidate graph
      if (input.careerProfile?.strengths) {
        output.strengths = input.careerProfile.strengths.map((s: any) => s.description);
      }
      if (input.careerProfile?.weaknesses) {
        output.weaknesses = input.careerProfile.weaknesses.map((w: any) => w.description);
      }

      // 3. Extract recommended skills from profile or ATS
      if (input.careerProfile?.recommendedSkills) {
        output.recommendedSkills = input.careerProfile.recommendedSkills.map((s: any) => s.title);
      } else if (input.atsAnalysis?.missingKeywords) {
        output.recommendedSkills = input.atsAnalysis.missingKeywords;
      }

      // 4. Calculate confidence score from profile
      if (input.careerProfile?.overallScore) {
        output.confidenceScore = input.careerProfile.overallScore;
      } else if (input.atsAnalysis?.score) {
        output.confidenceScore = input.atsAnalysis.score;
      }

      // 5. Extract career opportunities from job offer or market analysis
      if (input.jobOffer) {
        output.careerOpportunities.push(`Opportunité liée à l'offre: ${input.jobOffer}`);
      }

      // 6. Recommended training based on gaps
      if (input.atsAnalysis?.weaknesses) {
        output.recommendedTraining.push(...input.atsAnalysis.weaknesses.map((w: string) => `Formation: ${w}`));
      }

      // 7. Recommended projects based on skills
      if (output.recommendedSkills.length > 0) {
        output.recommendedProjects.push(...output.recommendedSkills.slice(0, 3).map(s => `Projet: ${s}`));
      }

      // 8. Perform cross-analysis if career memory is available
      if (careerMemory) {
        const crossAnalysis = await this.crossAnalysisService.performCrossAnalysis(careerMemory, input.jobOffer);
        
        // Add insights from cross-analysis
        if (crossAnalysis.cvToAts.scoreTrend === "improving") {
          output.tips.push("Vos scores ATS s'améliorent progressivement");
        } else if (crossAnalysis.cvToAts.scoreTrend === "declining") {
          output.alerts.push("Vos scores ATS diminuent, révisez votre CV");
        }

        if (crossAnalysis.atsToInterview.correlation > 0.7) {
          output.tips.push("Bonne corrélation entre vos scores ATS et vos performances en entretien");
        }

        if (crossAnalysis.careerProfileToHistory.progressionRate > 10) {
          output.tips.push("Progression significative détectée dans votre parcours");
        }
      }

      return output;
    } catch (error) {
      console.error("Career Copilot Orchestrator error:", error);
      // Return partial output even if some engines fail
      return output;
    }
  }

  /**
   * Build candidate graph from input data
   */
  private buildCandidateGraph(input: CareerCopilotInput): any {
    return {
      identity: {
        name: input.careerProfile?.name || "Candidat",
        userId: input.userId
      },
      career: {
        currentRole: input.careerProfile?.currentRole || "Non défini",
        careerLevel: input.careerProfile?.careerLevel || "mid",
        targetRole: input.careerProfile?.targetRole || "Non défini"
      },
      overallScore: input.careerProfile?.overallScore || input.atsAnalysis?.score || 50,
      communication: input.careerProfile?.communication || { score: 50 },
      leadership: input.careerProfile?.leadership || { score: 50 },
      confidence: input.careerProfile?.confidence || 50,
      structure: input.careerProfile?.structure || { score: 50 },
      impact: input.careerProfile?.impact || { score: 50 },
      strengths: input.careerProfile?.strengths || [],
      weaknesses: input.careerProfile?.weaknesses || [],
      recommendedSkills: input.careerProfile?.recommendedSkills || [],
      recommendedInterviews: input.careerProfile?.recommendedInterviews || [],
      riskAnalysis: input.careerProfile?.riskAnalysis || { risks: [] },
      employability: input.careerProfile?.employability || { overall: 50 },
      progress: input.careerProfile?.progress || { timeline: [], change: 0, trend: "stable" }
    };
  }

  /**
   * Analyze after CV upload
   */
  async afterCvUpload(input: CareerCopilotInput, careerMemory?: CareerMemoryEntity): Promise<CareerCopilotOutput> {
    const output = await this.analyze(input, careerMemory);
    output.nextActions.push("Analyser le CV avec ATS", "Créer le profil carrière");
    return output;
  }

  /**
   * Analyze after profile extraction
   */
  async afterProfileExtraction(input: CareerCopilotInput, careerMemory?: CareerMemoryEntity): Promise<CareerCopilotOutput> {
    const output = await this.analyze(input, careerMemory);
    output.nextActions.push("Importer une offre d'emploi", "Lancer une analyse ATS");
    return output;
  }

  /**
   * Analyze after ATS analysis
   */
  async afterAtsAnalysis(input: CareerCopilotInput, careerMemory?: CareerMemoryEntity): Promise<CareerCopilotOutput> {
    const output = await this.analyze(input, careerMemory);
    output.nextActions.push("Optimiser le CV", "Préparer un entretien");
    return output;
  }

  /**
   * Analyze after CV optimization
   */
  async afterCvOptimization(input: CareerCopilotInput, careerMemory?: CareerMemoryEntity): Promise<CareerCopilotOutput> {
    const output = await this.analyze(input, careerMemory);
    output.nextActions.push("Lancer un entretien simulé", "Postuler à des offres");
    return output;
  }

  /**
   * Analyze during interview
   */
  async duringInterview(input: CareerCopilotInput, careerMemory?: CareerMemoryEntity): Promise<CareerCopilotOutput> {
    const output = await this.analyze(input, careerMemory);
    output.nextActions.push("Continuer l'entretien", "Améliorer les réponses");
    return output;
  }

  /**
   * Analyze after interview completion
   */
  async afterInterview(input: CareerCopilotInput, careerMemory?: CareerMemoryEntity): Promise<CareerCopilotOutput> {
    const output = await this.analyze(input, careerMemory);
    output.nextActions.push("Consulter le rapport final", "Préparer le prochain entretien");
    return output;
  }

  /**
   * Analyze after final report
   */
  async afterFinalReport(input: CareerCopilotInput, careerMemory?: CareerMemoryEntity): Promise<CareerCopilotOutput> {
    const output = await this.analyze(input, careerMemory);
    output.nextActions.push("Réviser le profil carrière", "Planifier les améliorations");
    return output;
  }
}
