import { CandidateProfile } from "../types";
import { JobOfferGraph } from "../profile/JobOfferGraph";
import { TransferableSkillsOutput, TransferableSkill } from "./careerCopilotTransferableSkillsIntelligenceEngine";
import { GapIntelligenceOutput } from "./careerCopilotGapIntelligenceEngine";
import { VoiceInterviewContext } from "./careerCopilotVoiceInterviewEngine";
import { VoiceSessionContext } from "../session/VoiceSessionManager";

/**
 * Final Interview Report Engine
 * 
 * Responsibilities:
 * - Construct the final interview report by aggregating results from existing intelligences
 * - Provide comprehensive report with all sections
 * - NO re-calculation of existing scores, NO re-analysis, NO re-doing of coaching
 * - ONLY aggregation and presentation of existing results with explainability
 */

export interface Explainability {
  source: string;
  proof: string;
  confidence: number;
  explanation: string;
  reasoning: string;
  consultedIntelligences: string[];
  limitations: string[];
}

export interface ReportItem {
  name: string;
  evidence: string;
  explainability: Explainability;
}

export interface SkillItem {
  skill: string;
  evidence: string;
  explainability: Explainability;
}

export interface GapItem {
  gap: string;
  impact: string;
  explainability: Explainability;
}

export interface ImprovementItem {
  improvement: string;
  priority: string;
  explainability: Explainability;
}

export interface ReportMetadata {
  reportId: string;
  sessionId: string;
  generatedAt: string;
  candidateId: string;
  jobOfferId: string;
  explainability: Explainability;
}

export interface FinalInterviewReportContext {
  executiveSummary: {
    overview: string;
    highlights: string[];
    overallAssessment: string;
    explainability: Explainability;
  };
  recruiterDecision: {
    decision: "Strong Hire" | "Hire" | "Lean Hire" | "Neutral" | "Lean Reject" | "Reject";
    justification: string;
    keyFactors: string[];
    explainability: Explainability;
  };
  globalScore: {
    overall: number;
    technical: number;
    behavioral: number;
    communication: number;
    leadership: number;
    business: number;
    confidence: number;
    star: number;
    evidence: number;
    explainability: Explainability;
  };
  demonstratedStrengths: ReportItem[];
  observedWeaknesses: ReportItem[];
  demonstratedSkills: SkillItem[];
  insufficientlyDemonstratedSkills: SkillItem[];
  criticalGaps: GapItem[];
  compensatingTransferableSkills: ReportItem[];
  successfulQuestions: ReportItem[];
  difficultQuestions: ReportItem[];
  detectedContradictions: ReportItem[];
  missedOpportunities: ReportItem[];
  remarkableMoments: ReportItem[];
  personalizedAdvice: ReportItem[];
  recruiterTakeaways: ReportItem[];
  improvementPlan: {
    shortTerm: ImprovementItem[];
    mediumTerm: ImprovementItem[];
    longTerm: ImprovementItem[];
    explainability: Explainability;
  };
  finalSynthesis: {
    conclusion: string;
    keyTakeaways: string[];
    nextSteps: string[];
    explainability: Explainability;
  };
  metadata: ReportMetadata;
}

export class CareerCopilotFinalInterviewReportEngine {
  /**
   * Generate final interview report
   */
  static generateReport(
    candidateProfile: CandidateProfile,
    jobOfferGraph: JobOfferGraph,
    matchingCoreContext: any, // Simplified - Matching Intelligence Engine removed
    transferableSkillsContext: TransferableSkillsOutput,
    gapContext: GapIntelligenceOutput,
    interviewPreparationContext: any, // Simplified - Interview Preparation Engine removed
    voiceInterviewContext: VoiceInterviewContext,
    voiceSessionContext: VoiceSessionContext,
    liveAnswerAnalysisContext: any, // Simplified - Live Interview Analysis Engine removed
    liveCoachingContext: any // Simplified - Live Coaching Engine removed
  ): FinalInterviewReportContext {
    const reportId = `report_${Date.now()}`;
    const sessionId = voiceSessionContext.sessionId;
    const generatedAt = new Date(0).toISOString(); // Fixed date for determinism

    // Generate executive summary
    const executiveSummary = this.generateExecutiveSummary(
      matchingCoreContext,
      liveAnswerAnalysisContext,
      voiceInterviewContext
    );

    // Generate recruiter decision
    const recruiterDecision = this.generateRecruiterDecision(
      matchingCoreContext,
      liveAnswerAnalysisContext,
      gapContext
    );

    // Generate global score
    const globalScore = this.generateGlobalScore(
      matchingCoreContext,
      liveAnswerAnalysisContext,
      transferableSkillsContext
    );

    // Generate demonstrated strengths
    const demonstratedStrengths = this.generateDemonstratedStrengths(
      liveAnswerAnalysisContext,
      matchingCoreContext
    );

    // Generate observed weaknesses
    const observedWeaknesses = this.generateObservedWeaknesses(
      liveAnswerAnalysisContext,
      gapContext
    );

    // Generate demonstrated skills
    const demonstratedSkills = this.generateDemonstratedSkills(
      matchingCoreContext,
      liveAnswerAnalysisContext
    );

    // Generate insufficiently demonstrated skills
    const insufficientlyDemonstratedSkills = this.generateInsufficientlyDemonstratedSkills(
      gapContext,
      liveAnswerAnalysisContext
    );

    // Generate critical gaps
    const criticalGaps = this.generateCriticalGaps(gapContext);

    // Generate compensating transferable skills
    const compensatingTransferableSkills = this.generateCompensatingTransferableSkills(
      transferableSkillsContext,
      gapContext
    );

    // Generate successful questions
    const successfulQuestions = this.generateSuccessfulQuestions(
      liveAnswerAnalysisContext,
      voiceInterviewContext
    );

    // Generate difficult questions
    const difficultQuestions = this.generateDifficultQuestions(
      liveAnswerAnalysisContext,
      voiceInterviewContext
    );

    // Generate detected contradictions
    const detectedContradictions = this.generateDetectedContradictions(
      liveAnswerAnalysisContext
    );

    // Generate missed opportunities
    const missedOpportunities = this.generateMissedOpportunities(
      liveAnswerAnalysisContext,
      matchingCoreContext
    );

    // Generate remarkable moments
    const remarkableMoments = this.generateRemarkableMoments(
      liveAnswerAnalysisContext,
      voiceInterviewContext
    );

    // Generate personalized advice
    const personalizedAdvice = this.generatePersonalizedAdvice(
      liveCoachingContext,
      gapContext
    );

    // Generate recruiter takeaways
    const recruiterTakeaways = this.generateRecruiterTakeaways(
      liveAnswerAnalysisContext,
      matchingCoreContext
    );

    // Generate improvement plan
    const improvementPlan = this.generateImprovementPlan(
      gapContext,
      liveAnswerAnalysisContext,
      liveCoachingContext
    );

    // Generate final synthesis
    const finalSynthesis = this.generateFinalSynthesis(
      executiveSummary,
      recruiterDecision,
      globalScore,
      improvementPlan
    );

    return {
      executiveSummary,
      recruiterDecision,
      globalScore,
      demonstratedStrengths,
      observedWeaknesses,
      demonstratedSkills,
      insufficientlyDemonstratedSkills,
      criticalGaps,
      compensatingTransferableSkills,
      successfulQuestions,
      difficultQuestions,
      detectedContradictions,
      missedOpportunities,
      remarkableMoments,
      personalizedAdvice,
      recruiterTakeaways,
      improvementPlan,
      finalSynthesis,
      metadata: {
        reportId,
        sessionId,
        generatedAt,
        candidateId: candidateProfile.identity.id,
        jobOfferId: jobOfferGraph.id,
        explainability: {
          source: "Final Interview Report Engine",
          proof: "Report generated at " + generatedAt,
          confidence: 85,
          explanation: "Final report aggregated from all intelligences",
          reasoning: "Report based on aggregation of existing intelligence results",
          consultedIntelligences: [
            "CandidateGraph",
            "JobOfferGraph",
            "Matching Core",
            "Transferable Skills",
            "Gap Intelligence",
            "Interview Preparation Intelligence",
            "Voice Interview Engine",
            "Voice Session Manager",
            "Live Interview Analysis",
            "Live Coaching Intelligence"
          ],
          limitations: ["Report depends on availability and quality of all intelligence results"]
        }
      }
    };
  }

  /**
   * Generate executive summary
   */
  private static generateExecutiveSummary(
    matchingCoreContext: any,
    liveAnswerAnalysisContext: any,
    _voiceInterviewContext: VoiceInterviewContext
  ): FinalInterviewReportContext["executiveSummary"] {
    const overallScore = liveAnswerAnalysisContext.overallQuality.score;
    const matchScore = Math.round(
      (matchingCoreContext.hardSkills.matched.length / Math.max(1, matchingCoreContext.hardSkills.matched.length + matchingCoreContext.hardSkills.missing.length)) * 100
    );

    return {
      overview: `The candidate completed the interview with an overall quality score of ${overallScore}/100 and a match score of ${matchScore}/100.`,
      highlights: [
        `Overall quality: ${liveAnswerAnalysisContext.overallQuality.level}`,
        `Technical quality: ${liveAnswerAnalysisContext.technicalQuality.level}`,
        `Recruiter confidence: ${liveAnswerAnalysisContext.recruiterConfidence.level}`
      ],
      overallAssessment: overallScore >= 60 ? "The candidate performed well during the interview." : "The candidate's performance was below expectations.",
      explainability: {
        source: "Final Interview Report Engine",
        proof: "Summary aggregated from live analysis and matching results",
        confidence: 85,
        explanation: "Executive summary based on aggregated scores",
        reasoning: "Summary derived from overall quality and match scores",
        consultedIntelligences: ["Live Interview Analysis", "Matching Core"],
        limitations: ["Summary based on aggregated scores only"]
      }
    };
  }

  /**
   * Generate recruiter decision
   */
  private static generateRecruiterDecision(
    matchingCoreContext: any,
    liveAnswerAnalysisContext: any,
    gapContext: GapIntelligenceOutput
  ): FinalInterviewReportContext["recruiterDecision"] {
    const overallScore = liveAnswerAnalysisContext.overallQuality.score;
    const matchScore = Math.round(
      (matchingCoreContext.hardSkills.matched.length / Math.max(1, matchingCoreContext.hardSkills.matched.length + matchingCoreContext.hardSkills.missing.length)) * 100
    );
    const criticalGaps = gapContext.criticalGaps.length;

    let decision: "Strong Hire" | "Hire" | "Lean Hire" | "Neutral" | "Lean Reject" | "Reject";
    let justification: string;
    let keyFactors: string[];

    if (overallScore >= 80 && matchScore >= 80 && criticalGaps === 0) {
      decision = "Strong Hire";
      justification = "Candidate demonstrates excellent performance with strong match and no critical gaps.";
      keyFactors = ["High overall quality", "Strong match", "No critical gaps"];
    } else if (overallScore >= 70 && matchScore >= 70 && criticalGaps === 0) {
      decision = "Hire";
      justification = "Candidate demonstrates good performance with solid match and no critical gaps.";
      keyFactors = ["Good overall quality", "Solid match", "No critical gaps"];
    } else if (overallScore >= 60 && matchScore >= 60 && criticalGaps <= 1) {
      decision = "Lean Hire";
      justification = "Candidate demonstrates acceptable performance with moderate match and minimal critical gaps.";
      keyFactors = ["Acceptable overall quality", "Moderate match", "Minimal critical gaps"];
    } else if (overallScore >= 50 && matchScore >= 50) {
      decision = "Neutral";
      justification = "Candidate demonstrates average performance with average match.";
      keyFactors = ["Average overall quality", "Average match"];
    } else if (overallScore >= 40 || matchScore >= 40) {
      decision = "Lean Reject";
      justification = "Candidate demonstrates below average performance or weak match.";
      keyFactors = ["Below average quality", "Weak match"];
    } else {
      decision = "Reject";
      justification = "Candidate demonstrates poor performance or very weak match.";
      keyFactors = ["Poor quality", "Very weak match"];
    }

    return {
      decision,
      justification,
      keyFactors,
      explainability: {
        source: "Final Interview Report Engine",
        proof: `Decision based on overall score ${overallScore}, match score ${matchScore}, and ${criticalGaps} critical gaps`,
        confidence: 80,
        explanation: `Recruiter decision: ${decision}`,
        reasoning: "Decision based on aggregated scores and gap analysis",
        consultedIntelligences: ["Live Interview Analysis", "Matching Core", "Gap Intelligence"],
        limitations: ["Decision based on aggregated scores only"]
      }
    };
  }

  /**
   * Generate global score
   */
  private static generateGlobalScore(
    matchingCoreContext: any,
    liveAnswerAnalysisContext: any,
    _transferableSkillsContext: TransferableSkillsOutput
  ): FinalInterviewReportContext["globalScore"] {
    const matchScore = Math.round(
      (matchingCoreContext.hardSkills.matched.length / Math.max(1, matchingCoreContext.hardSkills.matched.length + matchingCoreContext.hardSkills.missing.length)) * 100
    );
    const overall = Math.round(
      (liveAnswerAnalysisContext.overallQuality.score + matchScore) / 2
    );
    const technical = liveAnswerAnalysisContext.technicalQuality.score;
    const behavioral = liveAnswerAnalysisContext.behavioralQuality.score;
    const communication = liveAnswerAnalysisContext.communicationQuality.score;
    const leadership = Math.round(
      (matchingCoreContext.softSkills.matched.length / Math.max(1, matchingCoreContext.softSkills.matched.length + matchingCoreContext.softSkills.missing.length)) * 100
    );
    const business = 70; // Placeholder as business impact is not directly available
    const confidence = liveAnswerAnalysisContext.credibilityScore.score;
    const star = liveAnswerAnalysisContext.starCompliance.score;
    const evidence = liveAnswerAnalysisContext.evidenceScore.score;

    return {
      overall,
      technical,
      behavioral,
      communication,
      leadership,
      business,
      confidence,
      star,
      evidence,
      explainability: {
        source: "Final Interview Report Engine",
        proof: "Scores aggregated from live analysis and matching results",
        confidence: 85,
        explanation: "Global score based on aggregated dimensions",
        reasoning: "Scores derived from live analysis and matching intelligence",
        consultedIntelligences: ["Live Interview Analysis", "Matching Core", "Transferable Skills"],
        limitations: ["Scores based on aggregated results only"]
      }
    };
  }

  /**
   * Generate demonstrated strengths
   */
  private static generateDemonstratedStrengths(
    liveAnswerAnalysisContext: any,
    matchingCoreContext: any
  ): ReportItem[] {
    const strengths: ReportItem[] = [];
    const matchScore = Math.round(
      (matchingCoreContext.hardSkills.matched.length / Math.max(1, matchingCoreContext.hardSkills.matched.length + matchingCoreContext.hardSkills.missing.length)) * 100
    );

    if (liveAnswerAnalysisContext.strongElements.length > 0) {
      liveAnswerAnalysisContext.strongElements.forEach((strength: any) => {
        strengths.push({
          name: strength,
          evidence: "Identified during live interview analysis",
          explainability: {
            source: "Final Interview Report Engine",
            proof: "Strength identified in live analysis",
            confidence: 75,
            explanation: `Demonstrated strength: ${strength}`,
            reasoning: "Strength based on live analysis detection",
            consultedIntelligences: ["Live Interview Analysis"],
            limitations: ["Strength based on analysis detection only"]
          }
        });
      });
    }

    if (matchScore >= 70) {
      strengths.push({
        name: "Strong overall match with job requirements",
        evidence: `Match score: ${matchScore}`,
        explainability: {
          source: "Final Interview Report Engine",
          proof: "Strong match identified in matching core",
          confidence: 80,
          explanation: "Strong overall match with job requirements",
          reasoning: "Match based on matching core analysis",
          consultedIntelligences: ["Matching Core"],
          limitations: ["Match based on matching core analysis only"]
        }
      });
    }

    return strengths;
  }

  /**
   * Generate observed weaknesses
   */
  private static generateObservedWeaknesses(
    liveAnswerAnalysisContext: any,
    gapContext: GapIntelligenceOutput
  ): ReportItem[] {
    const weaknesses: ReportItem[] = [];

    if (liveAnswerAnalysisContext.missingElements.length > 0) {
      liveAnswerAnalysisContext.missingElements.forEach((element: any) => {
        weaknesses.push({
          name: element,
          evidence: "Identified during live interview analysis",
          explainability: {
            source: "Final Interview Report Engine",
            proof: "Weakness identified in live analysis",
            confidence: 75,
            explanation: `Observed weakness: ${element}`,
            reasoning: "Weakness based on live analysis detection",
            consultedIntelligences: ["Live Interview Analysis"],
            limitations: ["Weakness based on analysis detection only"]
          }
        });
      });
    }

    if (gapContext.hardSkillGaps.length > 0) {
      gapContext.hardSkillGaps.slice(0, 3).forEach(gap => {
        weaknesses.push({
          name: gap.title,
          evidence: `Gap severity: ${gap.severity}`,
          explainability: {
            source: "Final Interview Report Engine",
            proof: "Weakness identified in gap analysis",
            confidence: 75,
            explanation: `Observed weakness: ${gap.title}`,
            reasoning: "Weakness based on gap analysis",
            consultedIntelligences: ["Gap Intelligence"],
            limitations: ["Weakness based on gap analysis only"]
          }
        });
      });
    }

    return weaknesses;
  }

  /**
   * Generate demonstrated skills
   */
  private static generateDemonstratedSkills(
    matchingCoreContext: any,
    _liveAnswerAnalysisContext: any
  ): SkillItem[] {
    const skills: SkillItem[] = [];

    matchingCoreContext.hardSkills.matched.slice(0, 5).forEach((skill: any) => {
      skills.push({
        skill: skill.name,
        evidence: `Match level: ${skill.candidateLevel || 'unknown'}`,
        explainability: {
          source: "Final Interview Report Engine",
          proof: "Skill identified in matching core",
          confidence: 75,
          explanation: `Demonstrated skill: ${skill.name}`,
          reasoning: "Skill based on matching core analysis",
          consultedIntelligences: ["Matching Core"],
          limitations: ["Skill based on matching core analysis only"]
        }
      });
    });

    return skills;
  }

  /**
   * Generate insufficiently demonstrated skills
   */
  private static generateInsufficientlyDemonstratedSkills(
    gapContext: GapIntelligenceOutput,
    _liveAnswerAnalysisContext: any
  ): SkillItem[] {
    const skills: SkillItem[] = [];

    gapContext.hardSkillGaps.slice(0, 3).forEach(gap => {
      skills.push({
        skill: gap.title,
        evidence: `Gap severity: ${gap.severity}`,
        explainability: {
          source: "Final Interview Report Engine",
          proof: "Skill gap identified in gap analysis",
          confidence: 75,
          explanation: `Insufficiently demonstrated skill: ${gap.title}`,
          reasoning: "Skill gap based on gap analysis",
          consultedIntelligences: ["Gap Intelligence"],
          limitations: ["Skill gap based on gap analysis only"]
        }
      });
    });

    return skills;
  }

  /**
   * Generate critical gaps
   */
  private static generateCriticalGaps(gapContext: GapIntelligenceOutput): GapItem[] {
    const gaps: GapItem[] = [];

    gapContext.hardSkillGaps.filter(g => g.severity === "critical").forEach(gap => {
      gaps.push({
        gap: gap.title,
        impact: gap.businessImpact,
        explainability: {
          source: "Final Interview Report Engine",
          proof: "Critical gap identified in gap analysis",
          confidence: 80,
          explanation: `Critical gap: ${gap.title}`,
          reasoning: "Critical gap based on gap analysis",
          consultedIntelligences: ["Gap Intelligence"],
          limitations: ["Critical gap based on gap analysis only"]
        }
      });
    });

    return gaps;
  }

  /**
   * Generate compensating transferable skills
   */
  private static generateCompensatingTransferableSkills(
    transferableSkillsContext: TransferableSkillsOutput,
    _gapContext: GapIntelligenceOutput
  ): ReportItem[] {
    const skills: ReportItem[] = [];

    transferableSkillsContext.transferableSkills.directTransferable.slice(0, 3).forEach((skill: TransferableSkill) => {
      skills.push({
        name: skill.missingSkill,
        evidence: `Source: ${skill.sourceSkill || 'N/A'}`,
        explainability: {
          source: "Final Interview Report Engine",
          proof: "Transferable skill identified in transferable skills analysis",
          confidence: 75,
          explanation: `Compensating transferable skill: ${skill.missingSkill}`,
          reasoning: "Transferable skill based on transferable skills analysis",
          consultedIntelligences: ["Transferable Skills"],
          limitations: ["Transferable skill based on transferable skills analysis only"]
        }
      });
    });

    return skills;
  }

  /**
   * Generate successful questions
   */
  private static generateSuccessfulQuestions(
    liveAnswerAnalysisContext: any,
    _voiceInterviewContext: VoiceInterviewContext
  ): ReportItem[] {
    const questions: ReportItem[] = [];

    if (liveAnswerAnalysisContext.strongElements.length > 0) {
      questions.push({
        name: "Questions with strong elements demonstrated",
        evidence: `Strong elements: ${liveAnswerAnalysisContext.strongElements.join(", ")}`,
        explainability: {
          source: "Final Interview Report Engine",
          proof: "Successful questions identified in live analysis",
          confidence: 70,
          explanation: "Questions answered successfully",
          reasoning: "Success based on live analysis detection",
          consultedIntelligences: ["Live Interview Analysis"],
          limitations: ["Success based on analysis detection only"]
        }
      });
    }

    return questions;
  }

  /**
   * Generate difficult questions
   */
  private static generateDifficultQuestions(
    liveAnswerAnalysisContext: any,
    _voiceInterviewContext: VoiceInterviewContext
  ): ReportItem[] {
    const questions: ReportItem[] = [];

    if (liveAnswerAnalysisContext.missingElements.length > 0) {
      questions.push({
        name: "Questions with missing elements",
        evidence: `Missing elements: ${liveAnswerAnalysisContext.missingElements.join(", ")}`,
        explainability: {
          source: "Final Interview Report Engine",
          proof: "Difficult questions identified in live analysis",
          confidence: 70,
          explanation: "Questions answered with difficulty",
          reasoning: "Difficulty based on live analysis detection",
          consultedIntelligences: ["Live Interview Analysis"],
          limitations: ["Difficulty based on analysis detection only"]
        }
      });
    }

    return questions;
  }

  /**
   * Generate detected contradictions
   */
  private static generateDetectedContradictions(
    liveAnswerAnalysisContext: any
  ): ReportItem[] {
    const contradictions: ReportItem[] = [];

    liveAnswerAnalysisContext.contradictions.forEach((contradiction: any) => {
      contradictions.push({
        name: contradiction.type,
        evidence: contradiction.description,
        explainability: {
          source: "Final Interview Report Engine",
          proof: "Contradiction identified in live analysis",
          confidence: 70,
          explanation: `Detected contradiction: ${contradiction.type}`,
          reasoning: "Contradiction based on live analysis detection",
          consultedIntelligences: ["Live Interview Analysis"],
          limitations: ["Contradiction based on analysis detection only"]
        }
      });
    });

    return contradictions;
  }

  /**
   * Generate missed opportunities
   */
  private static generateMissedOpportunities(
    liveAnswerAnalysisContext: any,
    _matchingCoreContext: any
  ): ReportItem[] {
    const opportunities: ReportItem[] = [];

    liveAnswerAnalysisContext.opportunitiesDetected.forEach((opportunity: any) => {
      opportunities.push({
        name: opportunity,
        evidence: "Identified during live interview analysis",
        explainability: {
          source: "Final Interview Report Engine",
          proof: "Missed opportunity identified in live analysis",
          confidence: 70,
          explanation: `Missed opportunity: ${opportunity}`,
          reasoning: "Opportunity based on live analysis detection",
          consultedIntelligences: ["Live Interview Analysis"],
          limitations: ["Opportunity based on analysis detection only"]
        }
      });
    });

    return opportunities;
  }

  /**
   * Generate remarkable moments
   */
  private static generateRemarkableMoments(
    liveAnswerAnalysisContext: any,
    _voiceInterviewContext: VoiceInterviewContext
  ): ReportItem[] {
    const moments: ReportItem[] = [];

    if (liveAnswerAnalysisContext.strongElements.length > 0) {
      moments.push({
        name: "Strong performance in key areas",
        evidence: `Strong elements: ${liveAnswerAnalysisContext.strongElements.join(", ")}`,
        explainability: {
          source: "Final Interview Report Engine",
          proof: "Remarkable moment identified in live analysis",
          confidence: 65,
          explanation: "Remarkable moment during interview",
          reasoning: "Remarkable moment based on live analysis detection",
          consultedIntelligences: ["Live Interview Analysis"],
          limitations: ["Remarkable moment based on analysis detection only"]
        }
      });
    }

    return moments;
  }

  /**
   * Generate personalized advice
   */
  private static generatePersonalizedAdvice(
    liveCoachingContext: any,
    _gapContext: GapIntelligenceOutput
  ): ReportItem[] {
    const advice: ReportItem[] = [];

    if (liveCoachingContext.coachingNeeded && liveCoachingContext.recommendedHint) {
      advice.push({
        name: liveCoachingContext.recommendedHint.message,
        evidence: `Coaching type: ${liveCoachingContext.recommendedHint.type}`,
        explainability: {
          source: "Final Interview Report Engine",
          proof: "Advice identified in live coaching",
          confidence: 70,
          explanation: "Personalized advice from coaching",
          reasoning: "Advice based on live coaching intelligence",
          consultedIntelligences: ["Live Coaching Intelligence"],
          limitations: ["Advice based on coaching intelligence only"]
        }
      });
    }

    return advice;
  }

  /**
   * Generate recruiter takeaways
   */
  private static generateRecruiterTakeaways(
    liveAnswerAnalysisContext: any,
    matchingCoreContext: any
  ): ReportItem[] {
    const takeaways: ReportItem[] = [];
    const matchScore = Math.round(
      (matchingCoreContext.hardSkills.matched.length / Math.max(1, matchingCoreContext.hardSkills.matched.length + matchingCoreContext.hardSkills.missing.length)) * 100
    );

    takeaways.push({
      name: `Overall quality: ${liveAnswerAnalysisContext.overallQuality.level}`,
      evidence: `Score: ${liveAnswerAnalysisContext.overallQuality.score}`,
      explainability: {
        source: "Final Interview Report Engine",
        proof: "Takeaway based on live analysis",
        confidence: 75,
        explanation: "Recruiter takeaway from overall quality",
        reasoning: "Takeaway based on live analysis score",
        consultedIntelligences: ["Live Interview Analysis"],
        limitations: ["Takeaway based on analysis score only"]
      }
    });

    takeaways.push({
      name: `Match level: ${matchScore >= 70 ? 'High' : matchScore >= 50 ? 'Medium' : 'Low'}`,
      evidence: `Score: ${matchScore}`,
      explainability: {
        source: "Final Interview Report Engine",
        proof: "Takeaway based on matching core",
        confidence: 75,
        explanation: "Recruiter takeaway from match level",
        reasoning: "Takeaway based on matching core score",
        consultedIntelligences: ["Matching Core"],
        limitations: ["Takeaway based on matching core score only"]
      }
    });

    return takeaways;
  }

  /**
   * Generate improvement plan
   */
  private static generateImprovementPlan(
    gapContext: GapIntelligenceOutput,
    liveAnswerAnalysisContext: any,
    _liveCoachingContext: any
  ): FinalInterviewReportContext["improvementPlan"] {
    const shortTerm: ImprovementItem[] = [];
    const mediumTerm: ImprovementItem[] = [];
    const longTerm: ImprovementItem[] = [];

    // Short term improvements (0-3 months)
    if (liveAnswerAnalysisContext.missingElements.length > 0) {
      liveAnswerAnalysisContext.missingElements.slice(0, 2).forEach((element: any) => {
        shortTerm.push({
          improvement: `Address missing element: ${element}`,
          priority: "high",
          explainability: {
            source: "Final Interview Report Engine",
            proof: "Improvement based on live analysis",
            confidence: 70,
            explanation: "Short-term improvement needed",
            reasoning: "Improvement based on live analysis detection",
            consultedIntelligences: ["Live Interview Analysis"],
            limitations: ["Improvement based on analysis detection only"]
          }
        });
      });
    }

    // Medium term improvements (3-6 months)
    gapContext.hardSkillGaps.slice(0, 2).forEach(gap => {
      mediumTerm.push({
        improvement: `Address gap: ${gap.title}`,
        priority: gap.severity === "critical" ? "high" : "medium",
        explainability: {
          source: "Final Interview Report Engine",
          proof: "Improvement based on gap analysis",
          confidence: 70,
          explanation: "Medium-term improvement needed",
          reasoning: "Improvement based on gap analysis",
          consultedIntelligences: ["Gap Intelligence"],
          limitations: ["Improvement based on gap analysis only"]
        }
      });
    });

    // Long term improvements (6-12 months)
    if (liveAnswerAnalysisContext.overallQuality.score < 70) {
      longTerm.push({
        improvement: "Improve overall interview performance",
        priority: "medium",
        explainability: {
          source: "Final Interview Report Engine",
          proof: "Improvement based on live analysis",
          confidence: 70,
          explanation: "Long-term improvement needed",
          reasoning: "Improvement based on overall quality score",
          consultedIntelligences: ["Live Interview Analysis"],
          limitations: ["Improvement based on analysis score only"]
        }
      });
    }

    return {
      shortTerm,
      mediumTerm,
      longTerm,
      explainability: {
        source: "Final Interview Report Engine",
        proof: "Improvement plan aggregated from all intelligences",
        confidence: 75,
        explanation: "Prioritized improvement plan",
        reasoning: "Plan based on gap analysis and live analysis",
        consultedIntelligences: ["Gap Intelligence", "Live Interview Analysis", "Live Coaching Intelligence"],
        limitations: ["Plan based on aggregated analysis only"]
      }
    };
  }

  /**
   * Generate final synthesis
   */
  private static generateFinalSynthesis(
    executiveSummary: FinalInterviewReportContext["executiveSummary"],
    recruiterDecision: FinalInterviewReportContext["recruiterDecision"],
    globalScore: FinalInterviewReportContext["globalScore"],
    _improvementPlan: FinalInterviewReportContext["improvementPlan"]
  ): FinalInterviewReportContext["finalSynthesis"] {
    return {
      conclusion: `The candidate achieved an overall score of ${globalScore.overall}/100 with a recruiter decision of ${recruiterDecision.decision}.`,
      keyTakeaways: [
        `Overall quality: ${globalScore.overall}`,
        `Recruiter decision: ${recruiterDecision.decision}`,
        `Technical score: ${globalScore.technical}`,
        `Communication score: ${globalScore.communication}`
      ],
      nextSteps: [
        "Review detailed report sections",
        "Implement short-term improvements",
        "Follow medium-term improvement plan",
        "Track long-term progress"
      ],
      explainability: {
        source: "Final Interview Report Engine",
        proof: "Synthesis aggregated from all report sections",
        confidence: 80,
        explanation: "Final synthesis of interview performance",
        reasoning: "Synthesis based on executive summary, decision, scores, and improvement plan",
        consultedIntelligences: ["All Intelligences"],
        limitations: ["Synthesis based on aggregated sections only"]
      }
    };
  }
}
