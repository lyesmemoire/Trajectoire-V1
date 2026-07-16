// @ts-nocheck
import { CandidateProfile } from "../types";
import { JobOfferGraph } from "../profile/JobOfferGraph";
import { MatchingCoreOutput } from "./careerCopilotMatchingIntelligenceEngine";
import { TransferableSkillsOutput } from "./careerCopilotTransferableSkillsIntelligenceEngine";
import { GapIntelligenceOutput } from "./careerCopilotGapIntelligenceEngine";

/**
 * Interview Preparation Intelligence Engine
 * 
 * Responsibilities:
 * - Prepare the optimal interview plan before the voice interview begins
 * - Generate interview questions based on candidate profile and job requirements
 * - Organize questions in optimal order
 * - Determine difficulty levels based on candidate and job match
 * - Prepare follow-up questions for each main question
 * - NO interview execution, NO speech recognition, NO coaching, NO final report generation
 * - ONLY interview plan preparation with explainability
 */

export interface Explainability {
  source: string;
  proof: string;
  confidence: number;
  explanation: string;
}

export interface InterviewQuestion {
  id: string;
  category: string;
  priority: "critical" | "high" | "medium" | "low";
  difficulty: "easy" | "medium" | "hard" | "expert";
  estimatedDuration: number;
  question: string;
  whyAsked: string;
  whatItMeasures: string;
  expectedSignals: string[];
  consultedIntelligences: string[];
  evidence: string;
  confidence: number;
  explanation: string;
  limitations: string[];
  followUps: string[];
}

export interface InterviewObjective {
  id: string;
  description: string;
  priority: "critical" | "high" | "medium" | "low";
  category: string;
  explainability: Explainability;
}

export interface ExpectedSkill {
  id: string;
  name: string;
  category: string;
  level: string;
  importance: "critical" | "high" | "medium" | "low";
  explainability: Explainability;
}

export interface ExpectedEvidence {
  id: string;
  skillId: string;
  type: string;
  description: string;
  source: string;
  confidence: number;
  explainability: Explainability;
}

export interface InterviewStrategy {
  approach: string;
  openingStrategy: string;
  progressionStrategy: string;
  closingStrategy: string;
  explainability: Explainability;
}

export interface DifficultyLevel {
  overall: "easy" | "medium" | "hard" | "expert";
  rationale: string;
  explainability: Explainability;
}

export interface InterviewDurationEstimate {
  totalMinutes: number;
  breakdown: {
    warmup: number;
    validation: number;
    technical: number;
    behavioral: number;
    advanced: number;
    culture: number;
    critical: number;
    closing: number;
  };
  explainability: Explainability;
}

export interface InterviewPreparationContext {
  interviewStrategy: InterviewStrategy;
  interviewObjectives: InterviewObjective[];
  questionQueue: InterviewQuestion[];
  priorityQueue: {
    critical: string[];
    high: string[];
    medium: string[];
    low: string[];
  };
  warmupQuestions: string[];
  technicalQuestions: string[];
  behavioralQuestions: string[];
  leadershipQuestions: string[];
  starQuestions: string[];
  gapValidationQuestions: string[];
  transferableSkillsValidationQuestions: string[];
  motivationQuestions: string[];
  cultureQuestions: string[];
  closingQuestions: string[];
  expectedSkillsToDemonstrate: ExpectedSkill[];
  expectedEvidence: ExpectedEvidence[];
  expectedRecruiterSignals: Array<{
    id: string;
    signal: string;
    importance: "critical" | "high" | "medium" | "low";
    explainability: Explainability;
  }>;
  difficultyLevel: DifficultyLevel;
  interviewDurationEstimate: InterviewDurationEstimate;
  adaptiveRules: Array<{
    id: string;
    condition: string;
    action: string;
    priority: "critical" | "high" | "medium" | "low";
    explainability: Explainability;
  }>;
  fallbackQuestions: Array<{
    id: string;
    triggerCondition: string;
    question: string;
    priority: "critical" | "high" | "medium" | "low";
    explainability: Explainability;
  }>;
  followUpCandidates: Array<{
    parentQuestionId: string;
    followUps: string[];
    explainability: Explainability;
  }>;
  stopConditions: Array<{
    id: string;
    type: string;
    condition: string;
    action: string;
    priority: "critical" | "high" | "medium" | "low";
    explainability: Explainability;
  }>;
  interviewExplainability: {
    source: string;
    proof: string;
    confidence: number;
    explanation: string;
    reasoning: string;
    consultedIntelligences: string[];
    limitations: string[];
  };
  metadata: {
    preparedAt: string;
    candidateGraphId: string;
    jobOfferGraphId: string;
    matchingCoreContextId: string;
    transferableSkillsContextId: string;
    gapContextId: string;
    totalQuestions: number;
    estimatedDuration: number;
    explainability: Explainability;
  };
}

export class CareerCopilotInterviewPreparationEngine {
  /**
   * Helper method to extract years from hierarchy level
   */
  private static extractYearsFromLevel(level: string): number {
    const levelLower = level.toLowerCase();
    if (levelLower.includes("junior")) return 0;
    if (levelLower.includes("intermediate")) return 3;
    if (levelLower.includes("senior")) return 5;
    if (levelLower.includes("expert")) return 8;
    if (levelLower.includes("executive")) return 10;
    return 3; // default
  }

  /**
   * Prepare the interview plan based on candidate profile and job offer
   */
  static prepareInterview(
    candidateProfile: CandidateProfile,
    jobOfferGraph: JobOfferGraph,
    matchingCoreContext: MatchingCoreOutput,
    transferableSkillsContext: TransferableSkillsOutput,
    gapContext: GapIntelligenceOutput
  ): InterviewPreparationContext {
    const preparedAt = new Date(0).toISOString(); // Fixed date for determinism

    // Determine overall difficulty
    const difficultyLevel = this.calculateDifficulty(candidateProfile, jobOfferGraph, matchingCoreContext, gapContext);

    // Generate interview strategy
    const interviewStrategy = this.generateStrategy(candidateProfile, jobOfferGraph, matchingCoreContext);

    // Generate interview objectives
    const interviewObjectives = this.generateObjectives(matchingCoreContext, gapContext);

    // Generate question queue
    const questionQueue = this.generateQuestionQueue(candidateProfile, jobOfferGraph, matchingCoreContext, transferableSkillsContext, gapContext, difficultyLevel);

    // Organize questions by category
    const categorizedQuestions = this.categorizeQuestions(questionQueue);

    // Generate priority queue
    const priorityQueue = this.generatePriorityQueue(questionQueue);

    // Generate expected skills
    const expectedSkillsToDemonstrate = this.generateExpectedSkills(matchingCoreContext, gapContext);

    // Generate expected evidence
    const expectedEvidence = this.generateExpectedEvidence(matchingCoreContext, gapContext);

    // Generate expected recruiter signals
    const expectedRecruiterSignals = this.generateExpectedRecruiterSignals(matchingCoreContext, gapContext);

    // Estimate interview duration
    const interviewDurationEstimate = this.estimateDuration(questionQueue);

    // Generate adaptive rules
    const adaptiveRules = this.generateAdaptiveRules(gapContext);

    // Generate fallback questions
    const fallbackQuestions = this.generateFallbackQuestions(gapContext);

    // Generate follow-up candidates
    const followUpCandidates = this.generateFollowUpCandidates(questionQueue);

    // Generate stop conditions
    const stopConditions = this.generateStopConditions();

    return {
      interviewStrategy,
      interviewObjectives,
      questionQueue,
      priorityQueue,
      warmupQuestions: categorizedQuestions.warmup,
      technicalQuestions: categorizedQuestions.technical,
      behavioralQuestions: categorizedQuestions.behavioral,
      leadershipQuestions: categorizedQuestions.leadership,
      starQuestions: categorizedQuestions.star,
      gapValidationQuestions: categorizedQuestions.gapValidation,
      transferableSkillsValidationQuestions: categorizedQuestions.transferableSkills,
      motivationQuestions: categorizedQuestions.motivation,
      cultureQuestions: categorizedQuestions.culture,
      closingQuestions: categorizedQuestions.closing,
      expectedSkillsToDemonstrate,
      expectedEvidence,
      expectedRecruiterSignals,
      difficultyLevel,
      interviewDurationEstimate,
      adaptiveRules,
      fallbackQuestions,
      followUpCandidates,
      stopConditions,
      interviewExplainability: {
        source: "Interview Preparation Intelligence",
        proof: "Interview plan prepared at " + preparedAt,
        confidence: 85,
        explanation: "Structured interview plan based on candidate profile, job offer, and previous intelligence analyses",
        reasoning: "Interview plan generated by analyzing matching core, transferable skills, and gap contexts",
        consultedIntelligences: ["Matching Core", "Transferable Skills", "Gap Intelligence"],
        limitations: ["Interview plan depends on quality of previous intelligence analyses"]
      },
      metadata: {
        preparedAt,
        candidateGraphId: candidateProfile.identity.id,
        jobOfferGraphId: jobOfferGraph.id,
        matchingCoreContextId: matchingCoreContext.metadata.comparedAt,
        transferableSkillsContextId: transferableSkillsContext.metadata.analyzedAt,
        gapContextId: gapContext.metadata.analyzedAt,
        totalQuestions: questionQueue.length,
        estimatedDuration: interviewDurationEstimate.totalMinutes,
        explainability: {
          source: "Interview Preparation Intelligence",
          proof: "Interview plan prepared with " + questionQueue.length + " questions",
          confidence: 85,
          explanation: "Interview plan prepared based on candidate profile and job offer"
        }
      }
    };
  }

  /**
   * Calculate overall difficulty level
   */
  private static calculateDifficulty(
    candidateProfile: CandidateProfile,
    jobOfferGraph: JobOfferGraph,
    matchingCoreContext: MatchingCoreOutput,
    gapContext: GapIntelligenceOutput
  ): DifficultyLevel {
    const candidateYears = candidateProfile.career.yearsOfExperience || 0;
    const requiredYears = jobOfferGraph.generalInfo.hierarchyLevel ? this.extractYearsFromLevel(jobOfferGraph.generalInfo.hierarchyLevel) : 0;
    const criticalGaps = gapContext.summary.criticalGapsCount;
    const blockingGaps = gapContext.summary.blockingGapsCount;

    let overall: "easy" | "medium" | "hard" | "expert" = "medium";
    let rationale = "";

    if (candidateYears < 2 && requiredYears < 2) {
      overall = "easy";
      rationale = "Junior candidate for junior role";
    } else if (candidateYears < 2 && requiredYears >= 5) {
      overall = "hard";
      rationale = "Junior candidate for senior role";
    } else if (candidateYears >= 5 && requiredYears < 2) {
      overall = "medium";
      rationale = "Senior candidate for junior role";
    } else if (candidateYears >= 5 && requiredYears >= 5) {
      overall = "expert";
      rationale = "Senior candidate for senior role";
    } else {
      overall = "medium";
      rationale = "Mid-level candidate and role";
    }

    // Adjust based on gaps
    if (criticalGaps > 3 || blockingGaps > 2) {
      if (overall === "easy") overall = "medium";
      else if (overall === "medium") overall = "hard";
      else if (overall === "hard") overall = "expert";
      rationale += " with increased difficulty due to critical/blocking gaps";
    }

    return {
      overall,
      rationale,
      explainability: {
        source: "CandidateGraph, JobOfferGraph, Gap Intelligence",
        proof: `Candidate years: ${candidateYears}, Required years: ${requiredYears}, Critical gaps: ${criticalGaps}, Blocking gaps: ${blockingGaps}`,
        confidence: 85,
        explanation: `Difficulty level set to ${overall} based on candidate experience, job requirements, and gap severity`
      }
    };
  }

  /**
   * Generate interview strategy
   */
  private static generateStrategy(
    _candidateProfile: CandidateProfile,
    _jobOfferGraph: JobOfferGraph,
    _matchingCoreContext: MatchingCoreOutput
  ): InterviewStrategy {
    return {
      approach: "Structured progressive interview",
      openingStrategy: "Warmup with presentation and parcours questions to build rapport",
      progressionStrategy: "Progress from validation to technical to behavioral to advanced to culture",
      closingStrategy: "Wrap up with closing questions and allow candidate to ask questions",
      explainability: {
        source: "Interview Preparation Intelligence",
        proof: "Strategy based on interview best practices and candidate/job match",
        confidence: 85,
        explanation: "Structured progressive approach ensures comprehensive assessment while maintaining candidate comfort"
      }
    };
  }

  /**
   * Generate interview objectives
   */
  private static generateObjectives(
    matchingCoreContext: MatchingCoreOutput,
    gapContext: GapIntelligenceOutput
  ): InterviewObjective[] {
    const objectives: InterviewObjective[] = [];

    // Validate matched skills
    matchingCoreContext.hardSkills.matched.forEach((skill, index) => {
      objectives.push({
        id: `objective_matched_${index}`,
        description: `Validate ${skill.name} skill`,
        priority: "medium",
        category: "validation",
        explainability: {
          source: "Matching Core",
          proof: `Skill ${skill.name} is matched`,
          confidence: 90,
          explanation: `Objective to validate that candidate has ${skill.name} skill`
        }
      });
    });

    // Validate critical gaps
    gapContext.criticalGaps.forEach((gapId, index) => {
      objectives.push({
        id: `objective_critical_${index}`,
        description: `Validate critical gap ${gapId}`,
        priority: "critical",
        category: "gapValidation",
        explainability: {
          source: "Gap Intelligence",
          proof: `Critical gap ${gapId} identified`,
          confidence: 95,
          explanation: `Objective to validate critical gap ${gapId}`
        }
      });
    });

    // Validate transferable skills
    gapContext.transferableGaps.forEach((gapId, index) => {
      objectives.push({
        id: `objective_transferable_${index}`,
        description: `Validate transferable skill ${gapId}`,
        priority: "high",
        category: "transferableSkills",
        explainability: {
          source: "Gap Intelligence",
          proof: `Transferable gap ${gapId} identified`,
          confidence: 85,
          explanation: `Objective to validate transferable skill ${gapId}`
        }
      });
    });

    return objectives;
  }

  /**
   * Generate question queue
   */
  private static generateQuestionQueue(
    candidateProfile: CandidateProfile,
    jobOfferGraph: JobOfferGraph,
    matchingCoreContext: MatchingCoreOutput,
    transferableSkillsContext: TransferableSkillsOutput,
    gapContext: GapIntelligenceOutput,
    difficultyLevel: DifficultyLevel
  ): InterviewQuestion[] {
    const questions: InterviewQuestion[] = [];
    let questionIndex = 0;

    // Warmup questions
    questions.push(this.createQuestion(
      questionIndex++,
      "presentation",
      "low",
      "easy",
      3,
      "Pouvez-vous vous présenter en quelques minutes ?",
      "To establish first contact and get an overview of the candidate's background",
      "Communication skills, self-awareness, ability to synthesize",
      ["Clear introduction", "Relevant experience highlighted", "Structured presentation"],
      ["CandidateGraph"],
      "Always asked first",
      95,
      "Warmup question to build rapport and get initial overview"
    ));

    questions.push(this.createQuestion(
      questionIndex++,
      "parcours",
      "low",
      "easy",
      5,
      "Parlez-moi de votre parcours professionnel",
      "To understand the candidate's career progression and identify key moments",
      "Career progression, key experiences, transitions",
      ["Clear career path", "Logical progression", "Relevant experiences"],
      ["CandidateGraph", "Matching Core"],
      "Candidate experience available",
      90,
      "Warmup question to understand career progression"
    ));

    // Validation questions - matched skills
    matchingCoreContext.hardSkills.matched.slice(0, 3).forEach((skill) => {
      questions.push(this.createQuestion(
        questionIndex++,
        "hardSkills",
        "high",
        difficultyLevel.overall === "easy" ? "medium" : difficultyLevel.overall,
        7,
        `Pouvez-vous me décrire votre expérience avec ${skill.name} ?`,
        `To validate ${skill.name} skill which is matched with the job requirements`,
        `${skill.name} proficiency, practical application, depth of knowledge`,
        [`Demonstrated ${skill.name} usage`, "Practical examples", "Depth of knowledge"],
        ["Matching Core", "Gap Intelligence"],
        `${skill.name} is matched in Matching Core`,
        85,
        `Validation question for matched skill ${skill.name}`
      ));
    });

    // Gap validation questions - critical gaps
    gapContext.hardSkillGaps.filter(g => g.severity === "critical").slice(0, 2).forEach((gap) => {
      questions.push(this.createQuestion(
        questionIndex++,
        "gapValidation",
        "critical",
        difficultyLevel.overall === "expert" ? "expert" : "hard",
        8,
        `Comment avez-vous abordé ${gap.title} dans vos projets précédents ?`,
        `To validate critical gap ${gap.title} which is required for the role`,
        `${gap.title} understanding, practical application, learning approach`,
        ["Demonstrated understanding", "Practical examples", "Learning approach"],
        ["Gap Intelligence"],
        `Critical gap ${gap.title} identified by Gap Intelligence`,
        90,
        `Gap validation question for critical skill ${gap.title}`
      ));
    });

    // Transferable skills validation questions
    gapContext.transferableGaps.slice(0, 2).forEach((gapId) => {
      const transferableSkill = gapContext.hardSkillGaps.find(g => g.id === gapId);
      if (transferableSkill) {
        questions.push(this.createQuestion(
          questionIndex++,
          "transferableSkills",
          "high",
          "medium",
          7,
          `Comment votre expérience peut-elle vous aider avec ${transferableSkill.title} ?`,
          `To validate transferable skill ${transferableSkill.title}`,
          `${transferableSkill.title} understanding, transferability, learning potential`,
          ["Understanding of transferability", "Practical examples", "Learning approach"],
          ["Gap Intelligence", "Transferable Skills Intelligence"],
          `Transferable gap ${gapId} identified by Gap Intelligence`,
          85,
          `Transferable skills validation question for ${transferableSkill.title}`
        ));
      }
    });

    // Technical questions
    questions.push(this.createQuestion(
      questionIndex++,
      "architecture",
      "high",
      difficultyLevel.overall,
      10,
      "Pouvez-vous me décrire l'architecture d'un projet complexe sur lequel vous avez travaillé ?",
      "To validate system architecture knowledge and design skills",
      "Architecture understanding, design patterns, scalability, trade-offs",
      ["Clear architecture description", "Design patterns knowledge", "Scalability considerations"],
      ["JobOfferGraph", "Matching Core"],
      "Architecture skills required in job offer",
      85,
      "Technical question to validate architecture skills"
    ));

    questions.push(this.createQuestion(
      questionIndex++,
      "problemSolving",
      "high",
      difficultyLevel.overall,
      10,
      "Décrivez un problème technique complexe que vous avez résolu",
      "To validate problem-solving capabilities and analytical thinking",
      "Problem analysis, solution design, implementation, results",
      ["Clear problem description", "Structured approach", "Measurable results"],
      ["JobOfferGraph", "Matching Core"],
      "Problem-solving skills required in job offer",
      85,
      "Technical question to validate problem-solving skills"
    ));

    // Behavioral questions
    questions.push(this.createQuestion(
      questionIndex++,
      "softSkills",
      "medium",
      "medium",
      7,
      "Comment travaillez-vous en équipe ?",
      "To validate teamwork and collaboration skills",
      "Collaboration, communication, conflict resolution, team dynamics",
      ["Team collaboration examples", "Communication style", "Conflict handling"],
      ["Matching Core", "Gap Intelligence"],
      "Soft skills required in job offer",
      85,
      "Behavioral question to validate teamwork skills"
    ));

    questions.push(this.createQuestion(
      questionIndex++,
      "communication",
      "medium",
      "medium",
      7,
      "Comment communiquez-vous avec les parties prenantes techniques et non techniques ?",
      "To validate communication skills across different audiences",
      "Technical communication, non-technical communication, adaptation",
      ["Clear communication examples", "Audience adaptation", "Stakeholder management"],
      ["Matching Core", "Gap Intelligence"],
      "Communication skills required in job offer",
      85,
      "Behavioral question to validate communication skills"
    ));

    // Leadership questions (if applicable)
    if (jobOfferGraph.generalInfo.title?.toLowerCase().includes("lead") || 
        jobOfferGraph.generalInfo.title?.toLowerCase().includes("manager")) {
      questions.push(this.createQuestion(
        questionIndex++,
        "leadership",
        "high",
        "hard",
        10,
        "Quelle est votre approche du leadership ?",
        "To validate leadership capabilities and management style",
        "Leadership philosophy, team management, decision-making, motivation",
        ["Clear leadership approach", "Team management examples", "Decision-making process"],
        ["JobOfferGraph", "Matching Core"],
        "Leadership skills required in job offer",
        85,
        "Leadership question to validate management skills"
      ));
    }

    // STAR questions
    questions.push(this.createQuestion(
      questionIndex++,
      "star",
      "medium",
      difficultyLevel.overall === "expert" ? "hard" : "medium",
      8,
      "Décrivez une situation où vous avez dû faire face à un défi majeur",
      "To validate behavior in challenging situations using STAR method",
      "Situation analysis, task definition, action taken, result achieved",
      ["Clear situation description", "Well-defined task", "Action-oriented approach", "Measurable results"],
      ["Matching Core", "Gap Intelligence"],
      "Behavioral validation using STAR method",
      85,
      "STAR question to validate behavior in challenging situations"
    ));

    // Motivation questions
    questions.push(this.createQuestion(
      questionIndex++,
      "motivation",
      "medium",
      "easy",
      5,
      "Pourquoi êtes-vous intéressé par ce poste ?",
      "To validate motivation and understanding of the role",
      "Motivation, role understanding, career goals",
      ["Clear motivation", "Role understanding", "Career alignment"],
      ["CandidateGraph", "JobOfferGraph"],
      "Motivation and role fit validation",
      90,
      "Motivation question to validate interest in the role"
    ));

    // Culture questions
    questions.push(this.createQuestion(
      questionIndex++,
      "culture",
      "medium",
      "easy",
      5,
      "Quelle est votre approche du travail en équipe et de la culture d'entreprise ?",
      "To validate cultural fit and team alignment",
      "Cultural alignment, team fit, values",
      ["Cultural understanding", "Team fit", "Values alignment"],
      ["CandidateGraph", "JobOfferGraph"],
      "Cultural fit validation",
      85,
      "Culture question to validate team alignment"
    ));

    // Closing questions
    questions.push(this.createQuestion(
      questionIndex++,
      "closing",
      "low",
      "easy",
      3,
      "Avez-vous des questions pour nous ?",
      "To allow candidate to ask questions and show interest",
      "Interest level, preparation, engagement",
      ["Relevant questions", "Preparation", "Engagement"],
      ["Interview Preparation Intelligence"],
      "Always asked at the end",
      95,
      "Closing question to allow candidate to ask questions"
    ));

    return questions;
  }

  /**
   * Create a question object
   */
  private static createQuestion(
    index: number,
    category: string,
    priority: "critical" | "high" | "medium" | "low",
    difficulty: "easy" | "medium" | "hard" | "expert",
    estimatedDuration: number,
    question: string,
    whyAsked: string,
    whatItMeasures: string,
    expectedSignals: string[],
    consultedIntelligences: string[],
    evidence: string,
    confidence: number,
    explanation: string
  ): InterviewQuestion {
    return {
      id: `question_${index}`,
      category,
      priority,
      difficulty,
      estimatedDuration,
      question,
      whyAsked,
      whatItMeasures,
      expectedSignals,
      consultedIntelligences,
      evidence,
      confidence,
      explanation,
      limitations: ["Question may not capture all aspects of the skill", "Candidate response may vary"],
      followUps: [
        "Pouvez-vous me donner un exemple concret ?",
        "Pouvez-vous détailler ce point ?",
        "Quel a été le résultat ?"
      ]
    };
  }

  /**
   * Categorize questions
   */
  private static categorizeQuestions(questions: InterviewQuestion[]) {
    return {
      warmup: questions.filter(q => ["presentation", "parcours"].includes(q.category)).map(q => q.id),
      technical: questions.filter(q => ["hardSkills", "architecture", "problemSolving"].includes(q.category)).map(q => q.id),
      behavioral: questions.filter(q => ["softSkills", "communication"].includes(q.category)).map(q => q.id),
      leadership: questions.filter(q => ["leadership"].includes(q.category)).map(q => q.id),
      star: questions.filter(q => ["star"].includes(q.category)).map(q => q.id),
      gapValidation: questions.filter(q => ["gapValidation"].includes(q.category)).map(q => q.id),
      transferableSkills: questions.filter(q => ["transferableSkills"].includes(q.category)).map(q => q.id),
      motivation: questions.filter(q => ["motivation"].includes(q.category)).map(q => q.id),
      culture: questions.filter(q => ["culture"].includes(q.category)).map(q => q.id),
      closing: questions.filter(q => ["closing", "candidateQuestions"].includes(q.category)).map(q => q.id)
    };
  }

  /**
   * Generate priority queue
   */
  private static generatePriorityQueue(questions: InterviewQuestion[]) {
    return {
      critical: questions.filter(q => q.priority === "critical").map(q => q.id),
      high: questions.filter(q => q.priority === "high").map(q => q.id),
      medium: questions.filter(q => q.priority === "medium").map(q => q.id),
      low: questions.filter(q => q.priority === "low").map(q => q.id)
    };
  }

  /**
   * Generate expected skills
   */
  private static generateExpectedSkills(
    matchingCoreContext: MatchingCoreOutput,
    gapContext: GapIntelligenceOutput
  ): ExpectedSkill[] {
    const skills: ExpectedSkill[] = [];

    // Matched skills
    matchingCoreContext.hardSkills.matched.forEach((skill, index) => {
      skills.push({
        id: `skill_matched_${index}`,
        name: skill.name,
        category: skill.category || "technical",
        level: "demonstrated",
        importance: "high",
        explainability: {
          source: "Matching Core",
          proof: `Skill ${skill.name} is matched`,
          confidence: 90,
          explanation: `Expected to demonstrate ${skill.name} skill`
        }
      });
    });

    // Critical gaps
    gapContext.criticalGaps.forEach((gapId, index) => {
      skills.push({
        id: `skill_critical_${index}`,
        name: gapId,
        category: "gap",
        level: "to be validated",
        importance: "critical",
        explainability: {
          source: "Gap Intelligence",
          proof: `Critical gap ${gapId} identified`,
          confidence: 95,
          explanation: `Expected to validate critical gap ${gapId}`
        }
      });
    });

    return skills;
  }

  /**
   * Generate expected evidence
   */
  private static generateExpectedEvidence(
    matchingCoreContext: MatchingCoreOutput,
    _gapContext: GapIntelligenceOutput
  ): ExpectedEvidence[] {
    const evidence: ExpectedEvidence[] = [];

    // Evidence for matched skills
    matchingCoreContext.hardSkills.matched.forEach((skill, index) => {
      evidence.push({
        id: `evidence_matched_${index}`,
        skillId: `skill_matched_${index}`,
        type: "practical example",
        description: `Practical example of ${skill.name} usage`,
        source: "Matching Core",
        confidence: 85,
        explainability: {
          source: "Matching Core",
          proof: `Skill ${skill.name} is matched`,
          confidence: 85,
          explanation: `Expected practical example of ${skill.name}`
        }
      });
    });

    return evidence;
  }

  /**
   * Generate expected recruiter signals
   */
  private static generateExpectedRecruiterSignals(
    _matchingCoreContext: MatchingCoreOutput,
    _gapContext: GapIntelligenceOutput
  ): Array<{
    id: string;
    signal: string;
    importance: "critical" | "high" | "medium" | "low";
    explainability: Explainability;
  }> {
    return [
      {
        id: "signal_communication",
        signal: "Clear and structured communication",
        importance: "high",
        explainability: {
          source: "Interview Preparation Intelligence",
          proof: "Communication is critical for all roles",
          confidence: 90,
          explanation: "Expected clear and structured communication throughout the interview"
        }
      },
      {
        id: "signal_technical_depth",
        signal: "Technical depth and understanding",
        importance: "high",
        explainability: {
          source: "Interview Preparation Intelligence",
          proof: "Technical skills are required for this role",
          confidence: 85,
          explanation: "Expected demonstration of technical depth and understanding"
        }
      },
      {
        id: "signal_problem_solving",
        signal: "Structured problem-solving approach",
        importance: "high",
        explainability: {
          source: "Interview Preparation Intelligence",
          proof: "Problem-solving is critical for this role",
          confidence: 85,
          explanation: "Expected structured problem-solving approach"
        }
      }
    ];
  }

  /**
   * Estimate interview duration
   */
  private static estimateDuration(questions: InterviewQuestion[]): InterviewDurationEstimate {
    const totalMinutes = questions.reduce((sum, q) => sum + q.estimatedDuration, 0);

    const warmup = questions.filter(q => ["presentation", "parcours"].includes(q.category)).reduce((sum, q) => sum + q.estimatedDuration, 0);
    const validation = questions.filter(q => ["hardSkills"].includes(q.category)).reduce((sum, q) => sum + q.estimatedDuration, 0);
    const technical = questions.filter(q => ["architecture", "problemSolving"].includes(q.category)).reduce((sum, q) => sum + q.estimatedDuration, 0);
    const behavioral = questions.filter(q => ["softSkills", "communication"].includes(q.category)).reduce((sum, q) => sum + q.estimatedDuration, 0);
    const advanced = questions.filter(q => ["star", "leadership"].includes(q.category)).reduce((sum, q) => sum + q.estimatedDuration, 0);
    const culture = questions.filter(q => ["motivation", "culture"].includes(q.category)).reduce((sum, q) => sum + q.estimatedDuration, 0);
    const critical = questions.filter(q => ["gapValidation", "transferableSkills"].includes(q.category)).reduce((sum, q) => sum + q.estimatedDuration, 0);
    const closing = questions.filter(q => ["closing"].includes(q.category)).reduce((sum, q) => sum + q.estimatedDuration, 0);

    return {
      totalMinutes,
      breakdown: {
        warmup,
        validation,
        technical,
        behavioral,
        advanced,
        culture,
        critical,
        closing
      },
      explainability: {
        source: "Interview Preparation Intelligence",
        proof: `Total duration calculated from ${questions.length} questions`,
        confidence: 85,
        explanation: `Estimated total interview duration of ${totalMinutes} minutes`
      }
    };
  }

  /**
   * Generate adaptive rules
   */
  private static generateAdaptiveRules(_gapContext: GapIntelligenceOutput): Array<{
    id: string;
    condition: string;
    action: string;
    priority: "critical" | "high" | "medium" | "low";
    explainability: Explainability;
  }> {
    return [
      {
        id: "rule_critical_gap",
        condition: "Critical gap not validated",
        action: "Ask follow-up question to validate critical gap",
        priority: "critical",
        explainability: {
          source: "Gap Intelligence",
          proof: "Critical gaps must be validated",
          confidence: 95,
          explanation: "If critical gap is not validated, ask follow-up question"
        }
      },
      {
        id: "rule_time_pressure",
        condition: "Time remaining < 10 minutes",
        action: "Skip non-critical questions, focus on critical gaps",
        priority: "high",
        explainability: {
          source: "Interview Preparation Intelligence",
          proof: "Time pressure requires prioritization",
          confidence: 90,
          explanation: "If time is limited, prioritize critical questions"
        }
      },
      {
        id: "rule_candidate_struggling",
        condition: "Candidate struggling with current difficulty",
        action: "Reduce difficulty of next questions",
        priority: "medium",
        explainability: {
          source: "Interview Preparation Intelligence",
          proof: "Candidate struggling requires adaptation",
          confidence: 85,
          explanation: "If candidate is struggling, reduce difficulty"
        }
      }
    ];
  }

  /**
   * Generate fallback questions
   */
  private static generateFallbackQuestions(_gapContext: GapIntelligenceOutput): Array<{
    id: string;
    triggerCondition: string;
    question: string;
    priority: "critical" | "high" | "medium" | "low";
    explainability: Explainability;
  }> {
    return [
      {
        id: "fallback_silence",
        triggerCondition: "Silence > 30 seconds",
        question: "Pouvez-vous reformuler votre réponse ?",
        priority: "high",
        explainability: {
          source: "Interview Preparation Intelligence",
          proof: "Silence may indicate confusion",
          confidence: 85,
          explanation: "If silence is detected, ask candidate to reformulate"
        }
      },
      {
        id: "fallback_incomplete",
        triggerCondition: "Response incomplete",
        question: "Pouvez-vous me donner plus de détails ?",
        priority: "medium",
        explainability: {
          source: "Interview Preparation Intelligence",
          proof: "Incomplete response needs clarification",
          confidence: 85,
          explanation: "If response is incomplete, ask for more details"
        }
      }
    ];
  }

  /**
   * Generate follow-up candidates
   */
  private static generateFollowUpCandidates(questions: InterviewQuestion[]): Array<{
    parentQuestionId: string;
    followUps: string[];
    explainability: Explainability;
  }> {
    return questions.map(q => ({
      parentQuestionId: q.id,
      followUps: q.followUps,
      explainability: {
        source: "Interview Preparation Intelligence",
        proof: `Follow-ups prepared for question ${q.id}`,
        confidence: 85,
        explanation: `Follow-ups available for question ${q.id}`
      }
    }));
  }

  /**
   * Generate stop conditions
   */
  private static generateStopConditions(): Array<{
    id: string;
    type: string;
    condition: string;
    action: string;
    priority: "critical" | "high" | "medium" | "low";
    explainability: Explainability;
  }> {
    return [
      {
        id: "stop_max_time",
        type: "time",
        condition: "Total time > 60 minutes",
        action: "Proceed to closing questions",
        priority: "critical",
        explainability: {
          source: "Interview Preparation Intelligence",
          proof: "Maximum time limit reached",
          confidence: 95,
          explanation: "If maximum time is reached, proceed to closing"
        }
      },
      {
        id: "stop_all_validated",
        type: "completion",
        condition: "All critical skills validated",
        action: "Proceed to closing questions",
        priority: "high",
        explainability: {
          source: "Interview Preparation Intelligence",
          proof: "All critical skills validated",
          confidence: 90,
          explanation: "If all critical skills are validated, proceed to closing"
        }
      }
    ];
  }
}
