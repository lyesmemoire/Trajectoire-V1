import { CandidateProfile } from "../types";
import { JobOfferGraph } from "../profile/JobOfferGraph";
import { TransferableSkillsOutput } from "./careerCopilotTransferableSkillsIntelligenceEngine";

/**
 * Gap Intelligence Engine
 * 
 * Responsibilities:
 * - Identify, qualify, and explain gaps between candidate profile and job offer
 * - Assess gap severity, blocking status, compensability, transferability, and learning potential
 * - NO global scoring, risk detection, opportunity detection, decision-making
 * - NO recommendations, interview preparation, or planning
 * - ONLY gap identification and qualification with explainability
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

export interface Gap {
  id: string;
  type: string;
  title: string;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  blocking: boolean;
  compensable: boolean;
  transferable: boolean;
  learningPossible: boolean;
  learningTimeEstimate: string;
  businessImpact: string;
  confidence: number;
  explanation: string;
  explainability: Explainability;
  classification: "missing" | "weak" | "partial" | "transferable" | "hidden" | "temporary" | "critical" | "blocking";
}

export interface GapSummary {
  totalGaps: number;
  criticalGapsCount: number;
  blockingGapsCount: number;
  compensableGapsCount: number;
  totalLearningTimeEstimate: string;
  explainability: Explainability;
}

export interface GapIntelligenceOutput {
  hardSkillGaps: Gap[];
  softSkillGaps: Gap[];
  technologyGaps: Gap[];
  experienceGaps: Gap[];
  educationGaps: Gap[];
  languageGaps: Gap[];
  businessGaps: Gap[];
  cultureGaps: Gap[];
  mobilityGaps: Gap[];
  criticalGaps: string[];
  blockingGaps: string[];
  transferableGaps: string[];
  learningGaps: string[];
  summary: GapSummary;
  metadata: {
    analyzedAt: string;
    candidateGraphId: string;
    jobOfferGraphId: string;
    matchingCoreContextId: string;
    transferableSkillsContextId: string;
    explainability: Explainability;
  };
}

// Learning time estimates for different skill categories
const LEARNING_TIME_ESTIMATES: Record<string, string> = {
  "docker": "10-20 hours",
  "kubernetes": "40-60 hours",
  "react": "30-50 hours",
  "vue": "20-40 hours",
  "angular": "40-60 hours",
  "symfony": "30-50 hours",
  "laravel": "20-40 hours",
  "asp.net": "60-80 hours",
  "mysql": "10-20 hours",
  "postgresql": "15-25 hours",
  "aws": "80-120 hours",
  "azure": "80-120 hours",
  "gcp": "80-120 hours",
  "gitlab ci": "10-20 hours",
  "github actions": "10-20 hours",
  "jenkins": "20-40 hours",
  "azure devops": "30-50 hours",
  "kanban": "10-20 hours",
  "product manager": "40-60 hours",
  "engineering manager": "60-80 hours",
  "kotlin": "20-40 hours",
  "java": "40-60 hours",
  "typescript": "10-20 hours",
  "go": "60-80 hours",
  "default": "40-60 hours"
};

export class CareerCopilotGapIntelligenceEngine {
  /**
   * Identify and qualify gaps based on matching core and transferable skills contexts
   */
  static identifyGaps(
    candidateProfile: CandidateProfile,
    jobOfferGraph: JobOfferGraph,
    matchingCoreContext: any, // Simplified - Matching Intelligence Engine removed
    transferableSkillsContext: TransferableSkillsOutput
  ): GapIntelligenceOutput {
    const analyzedAt = new Date(0).toISOString(); // Fixed date for determinism

    const hardSkillGaps = this.identifyHardSkillGaps(matchingCoreContext, transferableSkillsContext);
    const softSkillGaps = this.identifySoftSkillGaps(matchingCoreContext);
    const technologyGaps = this.identifyTechnologyGaps(matchingCoreContext, transferableSkillsContext);
    const experienceGaps = this.identifyExperienceGaps(matchingCoreContext);
    const educationGaps = this.identifyEducationGaps(matchingCoreContext);
    const languageGaps = this.identifyLanguageGaps(matchingCoreContext);
    const businessGaps = this.identifyBusinessGaps(matchingCoreContext);
    const cultureGaps = this.identifyCultureGaps(matchingCoreContext);
    const mobilityGaps = this.identifyMobilityGaps(matchingCoreContext);

    const allGaps = [
      ...hardSkillGaps,
      ...softSkillGaps,
      ...technologyGaps,
      ...experienceGaps,
      ...educationGaps,
      ...languageGaps,
      ...businessGaps,
      ...cultureGaps,
      ...mobilityGaps
    ];

    const criticalGaps = allGaps.filter(g => g.severity === "critical").map(g => g.id);
    const blockingGaps = allGaps.filter(g => g.blocking).map(g => g.id);
    const transferableGaps = allGaps.filter(g => g.transferable).map(g => g.id);
    const learningGaps = allGaps.filter(g => g.learningPossible).map(g => g.id);

    const summary = this.calculateSummary(allGaps);

    return {
      hardSkillGaps,
      softSkillGaps,
      technologyGaps,
      experienceGaps,
      educationGaps,
      languageGaps,
      businessGaps,
      cultureGaps,
      mobilityGaps,
      criticalGaps,
      blockingGaps,
      transferableGaps,
      learningGaps,
      summary,
      metadata: {
        analyzedAt,
        candidateGraphId: candidateProfile.identity.id,
        jobOfferGraphId: jobOfferGraph.id,
        matchingCoreContextId: matchingCoreContext.metadata.comparedAt,
        transferableSkillsContextId: transferableSkillsContext.metadata.analyzedAt,
        explainability: {
          source: "Gap Intelligence",
          proof: "Gap analysis performed at " + analyzedAt,
          confidence: 85,
          explanation: "Structured identification and qualification of gaps based on matching core and transferable skills contexts",
          reasoning: "Gaps identified by analyzing missing skills from matching core and transferability from transferable skills context",
          consultedIntelligences: ["Matching Core", "Transferable Skills"],
          limitations: ["Gap identification depends on quality of matching core and transferable skills analysis"]
        }
      }
    };
  }

  /**
   * Identify hard skill gaps
   */
  private static identifyHardSkillGaps(
    matchingCoreContext: any,
    transferableSkillsContext: TransferableSkillsOutput
  ): Gap[] {
    const gaps: Gap[] = [];
    const missingSkills = matchingCoreContext.hardSkills.missing;
    const directTransferable = transferableSkillsContext.transferableSkills.directTransferable;
    const partialTransferable = transferableSkillsContext.transferableSkills.partialTransferable;

    missingSkills.forEach((skill: any, index: any) => {
      const directTransfer = directTransferable.find(t => t.missingSkill.toLowerCase() === skill.name.toLowerCase());
      const partialTransfer = partialTransferable.find(t => t.missingSkill.toLowerCase() === skill.name.toLowerCase());

      if (directTransfer) {
        gaps.push(this.createGap(
          `hard_skill_${index}`,
          "hard_skill",
          skill.name,
          `Hard skill ${skill.name} is missing but directly transferable from ${directTransfer.sourceSkill}`,
          "low",
          false,
          true,
          true,
          true,
          LEARNING_TIME_ESTIMATES[skill.name.toLowerCase()] || LEARNING_TIME_ESTIMATES["default"] || "1-3 months",
          "Low impact - skill can be transferred quickly",
          directTransfer.transferConfidence,
          `Missing hard skill ${skill.name} is directly transferable from ${directTransfer.sourceSkill} with ${directTransfer.transferConfidence}% confidence`,
          "transferable"
        ));
      } else if (partialTransfer) {
        gaps.push(this.createGap(
          `hard_skill_${index}`,
          "hard_skill",
          skill.name,
          `Hard skill ${skill.name} is missing but partially transferable from ${partialTransfer.sourceSkill}`,
          "medium",
          false,
          true,
          true,
          true,
          LEARNING_TIME_ESTIMATES[skill.name.toLowerCase()] || LEARNING_TIME_ESTIMATES["default"] || "3-6 months",
          "Medium impact - skill can be transferred with additional learning",
          partialTransfer.transferConfidence,
          `Missing hard skill ${skill.name} is partially transferable from ${partialTransfer.sourceSkill} with ${partialTransfer.transferConfidence}% confidence`,
          "partial"
        ));
      } else {
        gaps.push(this.createGap(
          `hard_skill_${index}`,
          "hard_skill",
          skill.name,
          `Hard skill ${skill.name} is missing and not transferable`,
          skill.category === "critical" ? "critical" : "high",
          skill.category === "critical",
          false,
          false,
          true,
          LEARNING_TIME_ESTIMATES[skill.name.toLowerCase()] || LEARNING_TIME_ESTIMATES["default"] || "6-12 months",
          skill.category === "critical" ? "High impact - critical skill missing" : "Medium impact - skill requires learning",
          90,
          `Missing hard skill ${skill.name} is not transferable from existing skills and must be learned`,
          "missing"
        ));
      }
    });

    return gaps;
  }

  /**
   * Identify soft skill gaps
   */
  private static identifySoftSkillGaps(matchingCoreContext: any): Gap[] {
    const gaps: Gap[] = [];
    const missingSkills = matchingCoreContext.softSkills.missing;

    missingSkills.forEach((skill: any, index: any) => {
      gaps.push(this.createGap(
        `soft_skill_${index}`,
        "soft_skill",
        skill.name,
        `Soft skill ${skill.name} is missing`,
        "medium",
        false,
        true,
        false,
        true,
        "20-40 hours",
        "Medium impact - soft skill can be developed with practice",
        80,
        `Missing soft skill ${skill.name} can be developed through practice and experience`,
        "missing"
      ));
    });

    return gaps;
  }

  /**
   * Identify technology gaps
   */
  private static identifyTechnologyGaps(
    matchingCoreContext: any,
    transferableSkillsContext: TransferableSkillsOutput
  ): Gap[] {
    const gaps: Gap[] = [];
    const missingTechs = matchingCoreContext.technologies.allMissing;
    const directTransferable = transferableSkillsContext.transferableSkills.directTransferable;
    const partialTransferable = transferableSkillsContext.transferableSkills.partialTransferable;

    missingTechs.forEach((tech: any, index: any) => {
      const directTransfer = directTransferable.find(t => t.missingSkill.toLowerCase() === tech.toLowerCase());
      const partialTransfer = partialTransferable.find(t => t.missingSkill.toLowerCase() === tech.toLowerCase());

      if (directTransfer) {
        gaps.push(this.createGap(
          `technology_${index}`,
          "technology",
          tech,
          `Technology ${tech} is missing but directly transferable from ${directTransfer.sourceSkill}`,
          "low",
          false,
          true,
          true,
          true,
          LEARNING_TIME_ESTIMATES[tech.toLowerCase()] || LEARNING_TIME_ESTIMATES["default"] || "1-3 months",
          "Low impact - technology can be transferred quickly",
          directTransfer.transferConfidence,
          `Missing technology ${tech} is directly transferable from ${directTransfer.sourceSkill}`,
          "transferable"
        ));
      } else if (partialTransfer) {
        gaps.push(this.createGap(
          `technology_${index}`,
          "technology",
          tech,
          `Technology ${tech} is missing but partially transferable from ${partialTransfer.sourceSkill}`,
          "medium",
          false,
          true,
          true,
          true,
          LEARNING_TIME_ESTIMATES[tech.toLowerCase()] || LEARNING_TIME_ESTIMATES["default"] || "1-3 months",
          "Medium impact - technology can be transferred with additional learning",
          partialTransfer.transferConfidence,
          `Missing technology ${tech} is partially transferable from ${partialTransfer.sourceSkill}`,
          "partial"
        ));
      } else {
        gaps.push(this.createGap(
          `technology_${index}`,
          "technology",
          tech,
          `Technology ${tech} is missing and not transferable`,
          "high",
          false,
          false,
          false,
          true,
          LEARNING_TIME_ESTIMATES[tech.toLowerCase()] || LEARNING_TIME_ESTIMATES["default"] || "1-3 months",
          "Medium impact - technology requires learning",
          85,
          `Missing technology ${tech} is not transferable and must be learned`,
          "missing"
        ));
      }
    });

    return gaps;
  }

  /**
   * Identify experience gaps
   */
  private static identifyExperienceGaps(matchingCoreContext: any): Gap[] {
    const gaps: Gap[] = [];
    const experience = matchingCoreContext.experience;

    // Years of experience gap
    if (experience.requiredYears && experience.candidateYears < parseInt(experience.requiredYears)) {
      const gap = parseInt(experience.requiredYears) - experience.candidateYears;
      gaps.push(this.createGap(
        "experience_years",
        "experience",
        "Years of Experience",
        `Candidate has ${experience.candidateYears} years of experience, ${experience.requiredYears} required (gap of ${gap} years)`,
        gap > 5 ? "high" : "medium",
        gap > 5,
        false,
        false,
        false,
        "N/A - experience cannot be learned quickly",
        gap > 5 ? "High impact - significant experience gap" : "Medium impact - moderate experience gap",
        90,
        `Experience gap of ${gap} years cannot be compensated through learning`,
        "missing"
      ));
    }

    return gaps;
  }

  /**
   * Identify education gaps
   */
  private static identifyEducationGaps(matchingCoreContext: any): Gap[] {
    const gaps: Gap[] = [];
    const education = matchingCoreContext.education;

    if (!education.match && education.requiredLevel) {
      gaps.push(this.createGap(
        "education_degree",
        "education",
        "Education Degree",
        `Candidate education level (${education.candidateLevel}) does not match required level (${education.requiredLevel})`,
        education.requiredLevel.includes("Master") || education.requiredLevel.includes("PhD") ? "high" : "medium",
        education.requiredLevel.includes("PhD"),
        false,
        false,
        true,
        "2-4 years for degree completion",
        education.requiredLevel.includes("PhD") ? "High impact - PhD required" : "Medium impact - degree mismatch",
        85,
        `Education level mismatch requires additional education`,
        "missing"
      ));
    }

    return gaps;
  }

  /**
   * Identify language gaps
   */
  private static identifyLanguageGaps(matchingCoreContext: any): Gap[] {
    const gaps: Gap[] = [];
    const missingLanguages = matchingCoreContext.languages.missing;

    missingLanguages.forEach((lang: any, index: any) => {
      gaps.push(this.createGap(
        `language_${index}`,
        "language",
        lang.language,
        `Language ${lang.language} is missing (required level: ${lang.requiredLevel})`,
        "medium",
        false,
        false,
        false,
        true,
        "100-200 hours for proficiency",
        "Medium impact - language can be learned with time",
        80,
        `Missing language ${lang.language} can be learned with dedicated study`,
        "missing"
      ));
    });

    return gaps;
  }

  /**
   * Identify business gaps
   */
  private static identifyBusinessGaps(_matchingCoreContext: any): Gap[] {
    const gaps: Gap[] = [];
    // Business gaps would be identified from domain-specific requirements
    // For now, return empty as business gap detection requires more context
    return gaps;
  }

  /**
   * Identify culture gaps
   */
  private static identifyCultureGaps(_matchingCoreContext: any): Gap[] {
    const gaps: Gap[] = [];
    // Culture gaps would be identified from values and organizational fit
    // For now, return empty as culture gap detection requires more context
    return gaps;
  }

  /**
   * Identify mobility gaps
   */
  private static identifyMobilityGaps(_matchingCoreContext: any): Gap[] {
    const gaps: Gap[] = [];
    // Mobility gaps would be identified from location and remote work requirements
    // For now, return empty as mobility gap detection requires more context
    return gaps;
  }

  /**
   * Create a gap object
   */
  private static createGap(
    id: string,
    type: string,
    title: string,
    description: string,
    severity: "low" | "medium" | "high" | "critical",
    blocking: boolean,
    compensable: boolean,
    transferable: boolean,
    learningPossible: boolean,
    learningTimeEstimate: string,
    businessImpact: string,
    confidence: number,
    explanation: string,
    classification: "missing" | "weak" | "partial" | "transferable" | "hidden" | "temporary" | "critical" | "blocking"
  ): Gap {
    return {
      id,
      type,
      title,
      description,
      severity,
      blocking,
      compensable,
      transferable,
      learningPossible,
      learningTimeEstimate,
      businessImpact,
      confidence,
      explanation,
      explainability: {
        source: "Matching Core, Transferable Skills",
        proof: `Gap identified from matching core and transferable skills analysis: ${description}`,
        confidence,
        explanation,
        reasoning: `Gap classification based on severity (${severity}), blocking status (${blocking}), compensability (${compensable}), and transferability (${transferable})`,
        consultedIntelligences: ["Matching Core", "Transferable Skills"],
        limitations: ["Gap identification depends on quality of matching core and transferable skills analysis"]
      },
      classification
    };
  }

  /**
   * Calculate summary statistics
   */
  private static calculateSummary(allGaps: Gap[]): GapSummary {
    const totalGaps = allGaps.length;
    const criticalGapsCount = allGaps.filter(g => g.severity === "critical").length;
    const blockingGapsCount = allGaps.filter(g => g.blocking).length;
    const compensableGapsCount = allGaps.filter(g => g.compensable).length;

    // Estimate total learning time
    const learningGaps = allGaps.filter(g => g.learningPossible);
    let totalHours = 0;
    learningGaps.forEach(gap => {
      const timeMatch = gap.learningTimeEstimate?.match(/(\d+)/);
      if (timeMatch && timeMatch[1]) {
        totalHours += parseInt(timeMatch[1]);
      }
    });
    const totalLearningTimeEstimate = totalHours > 0 
      ? `${totalHours} hours (${Math.ceil(totalHours / 40)} weeks)` 
      : "N/A";

    return {
      totalGaps,
      criticalGapsCount,
      blockingGapsCount,
      compensableGapsCount,
      totalLearningTimeEstimate,
      explainability: {
        source: "Gap Intelligence",
        proof: `Summary calculated from ${totalGaps} identified gaps`,
        confidence: 85,
        explanation: `Summary includes ${criticalGapsCount} critical gaps, ${blockingGapsCount} blocking gaps, and ${compensableGapsCount} compensable gaps`,
        reasoning: "Summary statistics derived from gap analysis",
        consultedIntelligences: ["Matching Core", "Transferable Skills"],
        limitations: ["Summary depends on completeness of gap identification"]
      }
    };
  }
}
