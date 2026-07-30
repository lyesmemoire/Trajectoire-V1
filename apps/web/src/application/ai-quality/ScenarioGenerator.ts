/**
 * Scenario Generator
 * Automatically generates thousands of interview scenarios
 */

import {
  InterviewScenario,
  CandidateProfile,
} from "./interfaces/IEvaluationPlatform";

// ============================================================================
// GENERATION PARAMETERS
// ============================================================================

export interface GenerationConfig {
  sectors: string[];
  jobTitles: string[];
  levels: ("junior" | "mid" | "senior" | "expert")[];
  difficulties: ("easy" | "medium" | "hard")[];
  personalities: string[];
  stressLevels: number[];
  confidenceLevels: number[];
  experienceRanges: { min: number; max: number }[];
  languages: string[];
  count: number;
}

export const defaultGenerationConfig: GenerationConfig = {
  sectors: [
    "Technology",
    "Finance",
    "Healthcare",
    "Retail",
    "Manufacturing",
    "Education",
    "Consulting",
    "Media",
    "Energy",
    "Transportation",
  ],
  jobTitles: [
    "Software Engineer",
    "Product Manager",
    "Data Scientist",
    "Marketing Manager",
    "Sales Representative",
    "Financial Analyst",
    "HR Manager",
    "Operations Manager",
    "UX Designer",
    "Business Analyst",
  ],
  levels: ["junior", "mid", "senior", "expert"],
  difficulties: ["easy", "medium", "hard"],
  personalities: [
    "analytical",
    "creative",
    "pragmatic",
    "enthusiastic",
    "cautious",
    "ambitious",
    "collaborative",
    "independent",
  ],
  stressLevels: [3, 5, 7, 9],
  confidenceLevels: [4, 6, 8, 10],
  experienceRanges: [
    { min: 0, max: 2 },
    { min: 2, max: 5 },
    { min: 5, max: 10 },
    { min: 10, max: 20 },
  ],
  languages: ["English", "French", "Spanish", "German"],
  count: 1000,
};

// ============================================================================
// SCENARIO GENERATOR CLASS
// ============================================================================

export class ScenarioGenerator {
  private static instance: ScenarioGenerator;
  private generatedScenarios: Map<string, InterviewScenario> = new Map();

  private constructor() {}

  static getInstance(): ScenarioGenerator {
    if (!ScenarioGenerator.instance) {
      ScenarioGenerator.instance = new ScenarioGenerator();
    }
    return ScenarioGenerator.instance;
  }

  /**
   * Generate scenarios
   */
  generateScenarios(config?: Partial<GenerationConfig>): InterviewScenario[] {
    const finalConfig = { ...defaultGenerationConfig, ...config };
    const scenarios: InterviewScenario[] = [];

    for (let i = 0; i < finalConfig.count; i++) {
      const scenario = this.generateSingleScenario(finalConfig, i);
      scenarios.push(scenario);
      this.generatedScenarios.set(scenario.id, scenario);
    }

    return scenarios;
  }

  /**
   * Generate single scenario
   */
  private generateSingleScenario(
    config: GenerationConfig,
    index: number
  ): InterviewScenario {
    const sector = this.randomSelect(config.sectors);
    const jobTitle = this.randomSelect(config.jobTitles);
    const level = this.randomSelect(config.levels);
    const difficulty = this.randomSelect(config.difficulties);
    const personality = this.randomSelect(config.personalities);
    const stressLevel = this.randomSelect(config.stressLevels);
    const confidenceLevel = this.randomSelect(config.confidenceLevels);
    const experienceRange = this.randomSelect(config.experienceRanges);
    const language = this.randomSelect(config.languages);

    const experience = this.randomInRange(experienceRange.min, experienceRange.max);
    const duration = this.calculateDuration(level, difficulty);

    const candidateProfile: CandidateProfile = {
      id: `candidate_${index}`,
      name: this.generateName(),
      role: jobTitle,
      experience,
      softSkills: this.generateSoftSkills(personality),
      hardSkills: this.generateHardSkills(sector, jobTitle, level),
      personality,
      stressLevel,
      confidenceLevel,
      communicationAbility: this.calculateCommunicationAbility(confidenceLevel, stressLevel),
      language,
      accent: language !== "English" ? language + " accent" : undefined,
      frequentErrors: this.generateFrequentErrors(level, experience),
      strengths: this.generateStrengths(personality, level),
      weaknesses: this.generateWeaknesses(personality, level),
      responseStyle: this.determineResponseStyle(personality),
    };

    const scenario: InterviewScenario = {
      id: `scenario_${index}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: `${jobTitle} Interview - ${level} - ${difficulty}`,
      description: `Interview for ${jobTitle} position in ${sector} sector. ${level} level with ${difficulty} difficulty.`,
      candidateProfile,
      jobTitle,
      level,
      difficulty,
      duration,
      expectedTopics: this.generateExpectedTopics(sector, jobTitle, level),
      evaluationCriteria: this.generateEvaluationCriteria(level, difficulty),
    };

    return scenario;
  }

  /**
   * Random select from array
   */
  private randomSelect<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  /**
   * Random number in range
   */
  private randomInRange(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Generate random name
   */
  private generateName(): string {
    const firstNames = [
      "Alex", "Jordan", "Taylor", "Morgan", "Casey",
      "Riley", "Jamie", "Quinn", "Avery", "Parker",
      "Sage", "River", "Phoenix", "Rowan", "Ember",
    ];
    const lastNames = [
      "Smith", "Johnson", "Williams", "Brown", "Jones",
      "Garcia", "Miller", "Davis", "Rodriguez", "Martinez",
      "Anderson", "Taylor", "Thomas", "Moore", "Jackson",
    ];
    return `${this.randomSelect(firstNames)} ${this.randomSelect(lastNames)}`;
  }

  /**
   * Generate soft skills based on personality
   */
  private generateSoftSkills(personality: string): string[] {
    const personalitySkills: Record<string, string[]> = {
      analytical: ["problem-solving", "critical thinking", "data analysis"],
      creative: ["innovation", "design thinking", "ideation"],
      pragmatic: ["efficiency", "practicality", "execution"],
      enthusiastic: ["motivation", "energy", "positivity"],
      cautious: ["risk management", "attention to detail", "planning"],
      ambitious: ["goal-setting", "drive", "leadership"],
      collaborative: ["teamwork", "communication", "empathy"],
      independent: ["self-motivation", "autonomy", "initiative"],
    };

    const baseSkills = personalitySkills[personality] || personalitySkills.analytical;
    const additionalSkills = ["adaptability", "learning", "communication"];
    return [...baseSkills, this.randomSelect(additionalSkills)];
  }

  /**
   * Generate hard skills based on sector, job title, and level
   */
  private generateHardSkills(sector: string, jobTitle: string, level: string): string[] {
    const sectorSkills: Record<string, string[]> = {
      Technology: ["Programming", "System Design", "Cloud Computing", "DevOps"],
      Finance: ["Financial Analysis", "Risk Management", "Excel", "Modeling"],
      Healthcare: ["Patient Care", "Medical Knowledge", "Compliance", "Documentation"],
      Retail: ["Customer Service", "Sales", "Inventory Management", "POS Systems"],
      Manufacturing: ["Process Optimization", "Quality Control", "Safety", "Equipment"],
      Education: ["Teaching", "Curriculum Design", "Student Assessment", "Technology"],
      Consulting: ["Problem Solving", "Client Management", "Presentation", "Analysis"],
      Media: ["Content Creation", "Social Media", "Analytics", "Design"],
      Energy: ["Technical Knowledge", "Safety", "Regulations", "Project Management"],
      Transportation: ["Logistics", "Route Planning", "Vehicle Maintenance", "Compliance"],
    };

    const baseSkills = sectorSkills[sector] || sectorSkills.Technology;
    const levelMultiplier = level === "junior" ? 1 : level === "mid" ? 2 : level === "senior" ? 3 : 4;
    const skillCount = Math.min(baseSkills.length, 2 + levelMultiplier);

    return baseSkills.slice(0, skillCount);
  }

  /**
   * Calculate communication ability
   */
  private calculateCommunicationAbility(confidenceLevel: number, stressLevel: number): number {
    const baseAbility = confidenceLevel * 0.7;
    const stressPenalty = stressLevel * 0.3;
    return Math.min(10, Math.max(1, Math.round(baseAbility - stressPenalty)));
  }

  /**
   * Generate frequent errors based on level and experience
   */
  private generateFrequentErrors(level: string, experience: number): string[] {
    if (level === "junior" || experience < 2) {
      return [
        "lack of experience",
        "overconfidence",
        "missing details",
        "poor time management",
      ];
    } else if (level === "mid" || experience < 5) {
      return [
        "occasional oversight",
        "communication gaps",
        "scope creep",
      ];
    } else {
      return [
        "over-optimism",
        "delegation issues",
        "work-life balance",
      ];
    }
  }

  /**
   * Generate strengths based on personality and level
   */
  private generateStrengths(personality: string, level: string): string[] {
    const personalityStrengths: Record<string, string[]> = {
      analytical: ["attention to detail", "logical thinking", "data-driven"],
      creative: ["innovation", "out-of-the-box thinking", "visual design"],
      pragmatic: ["efficiency", "practical solutions", "execution"],
      enthusiastic: ["energy", "motivation", "positive attitude"],
      cautious: ["risk awareness", "planning", "quality focus"],
      ambitious: ["drive", "goal orientation", "leadership"],
      collaborative: ["teamwork", "empathy", "communication"],
      independent: ["self-reliance", "initiative", "autonomy"],
    };

    const baseStrengths = personalityStrengths[personality] || personalityStrengths.analytical;
    const levelStrengths = level === "expert" ? ["mentorship", "strategic vision"] : [];
    return [...baseStrengths, ...levelStrengths];
  }

  /**
   * Generate weaknesses based on personality and level
   */
  private generateWeaknesses(personality: string, level: string): string[] {
    const personalityWeaknesses: Record<string, string[]> = {
      analytical: ["over-analysis", "perfectionism", "slow decision-making"],
      creative: ["lack of structure", "inconsistency", "over-idealism"],
      pragmatic: ["lack of innovation", "resistance to change", "short-term focus"],
      enthusiastic: ["burnout risk", "overcommitment", "lack of focus"],
      cautious: ["risk aversion", "slow action", "missed opportunities"],
      ambitious: ["workaholic tendencies", "impatience", "stress"],
      collaborative: ["difficulty with conflict", "people-pleasing", "slow decisions"],
      independent: ["isolation", "resistance to feedback", "communication gaps"],
    };

    return personalityWeaknesses[personality] || personalityWeaknesses.analytical;
  }

  /**
   * Determine response style
   */
  private determineResponseStyle(personality: string): "formal" | "casual" | "technical" | "enthusiastic" {
    const styleMap: Record<string, "formal" | "casual" | "technical" | "enthusiastic"> = {
      analytical: "technical",
      creative: "enthusiastic",
      pragmatic: "formal",
      enthusiastic: "enthusiastic",
      cautious: "formal",
      ambitious: "formal",
      collaborative: "casual",
      independent: "casual",
    };

    return styleMap[personality] || "casual";
  }

  /**
   * Calculate duration based on level and difficulty
   */
  private calculateDuration(level: string, difficulty: string): number {
    const baseDuration = level === "junior" ? 30 : level === "mid" ? 45 : level === "senior" ? 60 : 90;
    const difficultyMultiplier = difficulty === "easy" ? 0.8 : difficulty === "medium" ? 1 : 1.2;
    return Math.round(baseDuration * difficultyMultiplier);
  }

  /**
   * Generate expected topics
   */
  private generateExpectedTopics(sector: string, jobTitle: string, level: string): string[] {
    const baseTopics = [
      "introduction",
      "experience",
      "skills",
      "motivation",
      "questions",
    ];

    const levelTopics: Record<string, string[]> = {
      junior: ["fundamentals", "learning ability", "potential"],
      mid: ["problem-solving", "achievements", "leadership"],
      senior: ["strategy", "team management", "innovation"],
      expert: ["vision", "industry trends", "mentorship"],
    };

    const sectorTopics: Record<string, string[]> = {
      Technology: ["technical stack", "architecture", "best practices"],
      Finance: ["financial modeling", "risk", "regulations"],
      Healthcare: ["patient care", "compliance", "technology"],
      Retail: ["customer service", "sales", "operations"],
      Manufacturing: ["process", "quality", "safety"],
      Education: ["teaching methods", "curriculum", "technology"],
      Consulting: ["problem-solving", "client management", "industry knowledge"],
      Media: ["content", "audience", "trends"],
      Energy: ["technical knowledge", "sustainability", "regulations"],
      Transportation: ["logistics", "efficiency", "safety"],
    };

    return [
      ...baseTopics,
      ...levelTopics[level] || levelTopics.mid,
      ...sectorTopics[sector] || sectorTopics.Technology,
    ];
  }

  /**
   * Generate evaluation criteria
   */
  private generateEvaluationCriteria(level: string, difficulty: string): string[] {
    const baseCriteria = [
      "communication",
      "relevance",
      "clarity",
    ];

    const levelCriteria: Record<string, string[]> = {
      junior: ["potential", "learning ability", "attitude"],
      mid: ["problem-solving", "experience", "achievements"],
      senior: ["leadership", "strategy", "mentoring"],
      expert: ["vision", "innovation", "industry impact"],
    };

    const difficultyCriteria: Record<string, string[]> = {
      easy: ["basic knowledge", "enthusiasm"],
      medium: ["depth", "practical application"],
      hard: ["advanced concepts", "complex problem-solving"],
    };

    return [
      ...baseCriteria,
      ...levelCriteria[level] || levelCriteria.mid,
      ...difficultyCriteria[difficulty] || difficultyCriteria.medium,
    ];
  }

  /**
   * Get generated scenarios
   */
  getGeneratedScenarios(): InterviewScenario[] {
    return Array.from(this.generatedScenarios.values());
  }

  /**
   * Get scenario by ID
   */
  getScenarioById(id: string): InterviewScenario | null {
    return this.generatedScenarios.get(id) || null;
  }

  /**
   * Filter scenarios
   */
  filterScenarios(filters: {
    sector?: string;
    jobTitle?: string;
    level?: string;
    difficulty?: string;
    personality?: string;
  }): InterviewScenario[] {
    const scenarios = this.getGeneratedScenarios();

    return scenarios.filter(scenario => {
      if (filters.sector && !scenario.description.toLowerCase().includes(filters.sector.toLowerCase())) {
        return false;
      }
      if (filters.jobTitle && scenario.jobTitle !== filters.jobTitle) {
        return false;
      }
      if (filters.level && scenario.level !== filters.level) {
        return false;
      }
      if (filters.difficulty && scenario.difficulty !== filters.difficulty) {
        return false;
      }
      if (filters.personality && scenario.candidateProfile.personality !== filters.personality) {
        return false;
      }
      return true;
    });
  }

  /**
   * Get generation statistics
   */
  getStatistics(): {
    totalScenarios: number;
    sectors: Record<string, number>;
    jobTitles: Record<string, number>;
    levels: Record<string, number>;
    difficulties: Record<string, number>;
    personalities: Record<string, number>;
  } {
    const scenarios = this.getGeneratedScenarios();

    const sectors: Record<string, number> = {};
    const jobTitles: Record<string, number> = {};
    const levels: Record<string, number> = {};
    const difficulties: Record<string, number> = {};
    const personalities: Record<string, number> = {};

    scenarios.forEach(scenario => {
      // Extract sector from description
      const sectorMatch = scenario.description.match(/in (\w+) sector/);
      if (sectorMatch) {
        const sector = sectorMatch[1];
        sectors[sector] = (sectors[sector] || 0) + 1;
      }

      jobTitles[scenario.jobTitle] = (jobTitles[scenario.jobTitle] || 0) + 1;
      levels[scenario.level] = (levels[scenario.level] || 0) + 1;
      difficulties[scenario.difficulty] = (difficulties[scenario.difficulty] || 0) + 1;
      personalities[scenario.candidateProfile.personality] = (personalities[scenario.candidateProfile.personality] || 0) + 1;
    });

    return {
      totalScenarios: scenarios.length,
      sectors,
      jobTitles,
      levels,
      difficulties,
      personalities,
    };
  }

  /**
   * Export scenarios
   */
  exportScenarios(): InterviewScenario[] {
    return this.getGeneratedScenarios();
  }

  /**
   * Import scenarios
   */
  importScenarios(scenarios: InterviewScenario[]): void {
    scenarios.forEach(scenario => {
      this.generatedScenarios.set(scenario.id, scenario);
    });
  }

  /**
   * Clear generated scenarios
   */
  clearScenarios(): void {
    this.generatedScenarios.clear();
  }
}

export const scenarioGenerator = ScenarioGenerator.getInstance();
