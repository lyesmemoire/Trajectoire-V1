/**
 * Candidate Simulator
 * Simulates candidate responses for AI evaluation
 */

import {
  SyntheticCandidate,
  ResponseStrategy,
  ConversationTurn,
  SyntheticCandidateSchema,
  CandidateProfile,
} from "./interfaces/IEvaluationPlatform";
import { scenarioLibrary, InterviewScenario } from "./ScenarioLibrary";

export type { SyntheticCandidate };

// ============================================================================
// RESPONSE STRATEGIES BY BEHAVIOR
// ============================================================================

const responseStrategies: Record<SyntheticCandidate["behavior"], ResponseStrategy> = {
  excellent: {
    thinkingTime: 3,
    responseLength: "medium",
    detailLevel: 8,
    honestyLevel: 9,
    questionFrequency: 2,
    hesitationRate: 0.1,
  },
  good: {
    thinkingTime: 4,
    responseLength: "medium",
    detailLevel: 7,
    honestyLevel: 8,
    questionFrequency: 1,
    hesitationRate: 0.2,
  },
  average: {
    thinkingTime: 5,
    responseLength: "medium",
    detailLevel: 5,
    honestyLevel: 7,
    questionFrequency: 1,
    hesitationRate: 0.3,
  },
  poor: {
    thinkingTime: 8,
    responseLength: "short",
    detailLevel: 3,
    honestyLevel: 5,
    questionFrequency: 0,
    hesitationRate: 0.5,
  },
  stressed: {
    thinkingTime: 2,
    responseLength: "short",
    detailLevel: 4,
    honestyLevel: 6,
    questionFrequency: 0,
    hesitationRate: 0.7,
  },
  verbose: {
    thinkingTime: 6,
    responseLength: "long",
    detailLevel: 9,
    honestyLevel: 8,
    questionFrequency: 3,
    hesitationRate: 0.2,
  },
  timid: {
    thinkingTime: 10,
    responseLength: "short",
    detailLevel: 4,
    honestyLevel: 6,
    questionFrequency: 0,
    hesitationRate: 0.6,
  },
  overconfident: {
    thinkingTime: 1,
    responseLength: "long",
    detailLevel: 6,
    honestyLevel: 4,
    questionFrequency: 2,
    hesitationRate: 0.05,
  },
  beginner: {
    thinkingTime: 7,
    responseLength: "short",
    detailLevel: 3,
    honestyLevel: 9,
    questionFrequency: 2,
    hesitationRate: 0.5,
  },
  expert: {
    thinkingTime: 2,
    responseLength: "medium",
    detailLevel: 9,
    honestyLevel: 9,
    questionFrequency: 1,
    hesitationRate: 0.1,
  },
};

// ============================================================================
// RESPONSE TEMPLATES BY ROLE
// ============================================================================

const responseTemplates: Record<string, string[]> = {
  "Junior Developer": [
    "I've been working with JavaScript for about a year now, mainly on personal projects and some freelance work.",
    "I'm familiar with React basics and have built a few small applications using it.",
    "I'm eager to learn and grow my skills in a professional environment.",
    "I sometimes struggle with complex concepts but I'm working on improving my understanding.",
    "I believe I can contribute to the team while learning from more experienced developers.",
  ],
  "Senior Developer": [
    "I have 8 years of experience building scalable web applications using TypeScript and modern frameworks.",
    "I've led several teams and mentored junior developers throughout my career.",
    "I focus on writing clean, maintainable code and following best practices.",
    "I've designed and implemented microservices architectures for high-traffic applications.",
    "I believe in continuous improvement and staying up-to-date with industry trends.",
  ],
  "Data Scientist": [
    "I specialize in machine learning and statistical analysis using Python.",
    "I've worked on various projects including predictive modeling and data visualization.",
    "I'm comfortable with SQL and have experience with big data technologies.",
    "I focus on data-driven decision making and communicating insights to stakeholders.",
    "I'm always looking for ways to improve model accuracy and efficiency.",
  ],
  "DevOps Engineer": [
    "I have extensive experience with containerization and orchestration using Docker and Kubernetes.",
    "I've implemented CI/CD pipelines for multiple organizations.",
    "I focus on automation and infrastructure as code using Terraform.",
    "I believe in reliability and monitoring as core principles of DevOps.",
    "I've worked with various cloud providers including AWS and GCP.",
  ],
  "Product Manager": [
    "I have experience managing product roadmaps and prioritizing features based on user needs.",
    "I believe in data-driven product decisions and continuous user research.",
    "I've worked closely with engineering teams to deliver products on time.",
    "I focus on aligning product strategy with business goals.",
    "I'm skilled at stakeholder management and cross-functional collaboration.",
  ],
  "UX Designer": [
    "I specialize in user-centered design and have experience conducting user research.",
    "I'm proficient with design tools like Figma and have built design systems.",
    "I believe in iterative design based on user feedback.",
    "I focus on creating intuitive and accessible user experiences.",
    "I collaborate closely with developers to ensure design feasibility.",
  ],
  "Sales Representative": [
    "I have a strong track record in sales and building client relationships.",
    "I'm skilled at negotiation and closing deals.",
    "I believe in understanding customer needs and providing tailored solutions.",
    "I'm persistent but respectful in my approach to sales.",
    "I have experience with CRM systems and sales analytics.",
  ],
  "Marketing Manager": [
    "I have experience developing and executing marketing campaigns across multiple channels.",
    "I'm data-driven and focus on ROI and measurable results.",
    "I've built brands from scratch and grown existing ones.",
    "I'm skilled at content strategy and digital marketing.",
    "I believe in continuous testing and optimization of marketing efforts.",
  ],
  "Financial Analyst": [
    "I have strong analytical skills and experience with financial modeling.",
    "I'm detail-oriented and focus on accuracy in my work.",
    "I'm proficient with Excel and financial reporting tools.",
    "I believe in risk management and thorough analysis.",
    "I have experience presenting financial insights to stakeholders.",
  ],
  "HR Manager": [
    "I have experience in all aspects of human resources including recruitment and employee relations.",
    "I believe in building a positive company culture and supporting employee development.",
    "I'm skilled at conflict resolution and performance management.",
    "I focus on compliance and best practices in HR.",
    "I have experience with HRIS systems and workforce planning.",
  ],
  "Customer Support": [
    "I have experience providing technical support and troubleshooting issues.",
    "I'm patient and empathetic when dealing with customer concerns.",
    "I'm skilled at explaining technical concepts to non-technical users.",
    "I believe in first-contact resolution and customer satisfaction.",
    "I have experience with CRM and support ticketing systems.",
  ],
  "Engineering Manager": [
    "I have experience leading engineering teams and managing technical projects.",
    "I believe in servant leadership and supporting my team's growth.",
    "I'm skilled at hiring and building high-performing teams.",
    "I focus on technical excellence while delivering business value.",
    "I have experience with agile methodologies and continuous delivery.",
  ],
  "CTO": [
    "I have extensive experience in technology leadership and strategic planning.",
    "I believe in building strong engineering cultures and technical excellence.",
    "I've scaled engineering organizations and managed technical debt.",
    "I focus on aligning technology strategy with business goals.",
    "I have experience with board-level communication and fundraising.",
  ],
  "CEO": [
    "I have experience leading companies and driving business growth.",
    "I believe in building strong teams and executing on vision.",
    "I've raised capital and managed investor relationships.",
    "I focus on long-term strategy while executing on short-term goals.",
    "I have experience with public speaking and representing the company.",
  ],
  "Freelance Developer": [
    "I have experience working with multiple clients and adapting to different requirements.",
    "I'm self-motivated and comfortable managing my own projects.",
    "I have a broad skill set across full-stack development.",
    "I believe in clear communication and delivering quality work.",
    "I'm experienced in client relations and project management.",
  ],
};

// ============================================================================
// CANDIDATE SIMULATOR CLASS
// ============================================================================

export class CandidateSimulator {
  private static instance: CandidateSimulator;
  private currentCandidate: SyntheticCandidate | null = null;
  private conversationHistory: ConversationTurn[] = [];
  private turnCount = 0;

  private constructor() {}

  static getInstance(): CandidateSimulator {
    if (!CandidateSimulator.instance) {
      CandidateSimulator.instance = new CandidateSimulator();
    }
    return CandidateSimulator.instance;
  }

  /**
   * Initialize candidate for simulation
   */
  initializeCandidate(scenario: InterviewScenario, behavior: SyntheticCandidate["behavior"]): SyntheticCandidate {
    const candidate: SyntheticCandidate = {
      id: `candidate_${Date.now()}`,
      profile: scenario.candidateProfile,
      behavior,
      responseStrategy: responseStrategies[behavior],
    };

    this.currentCandidate = candidate;
    this.conversationHistory = [];
    this.turnCount = 0;

    return candidate;
  }

  /**
   * Generate response to recruiter question
   */
  generateResponse(recruiterQuestion: string): ConversationTurn {
    if (!this.currentCandidate) {
      throw new Error("Candidate not initialized");
    }

    const strategy = this.currentCandidate.responseStrategy;
    const profile = this.currentCandidate.profile;
    const templates = responseTemplates[profile.role] || responseTemplates["Junior Developer"];

    // Select a template based on conversation context
    const template = this.selectTemplate(templates, recruiterQuestion);
    
    // Add hesitation markers if applicable
    let response = template;
    if (Math.random() < strategy.hesitationRate) {
      response = this.addHesitation(response);
    }

    // Add detail based on detail level
    if (strategy.detailLevel > 5) {
      response = this.addDetail(response, profile);
    }

    // Add question if applicable
    if (Math.random() < (strategy.questionFrequency / 10)) {
      response = this.addQuestion(response);
    }

    const turn: ConversationTurn = {
      id: `turn_${this.turnCount++}`,
      role: "candidate",
      content: response,
      timestamp: new Date(),
      metadata: {
        behavior: this.currentCandidate.behavior,
        thinkingTime: strategy.thinkingTime,
        hesitationRate: strategy.hesitationRate,
      },
    };

    this.conversationHistory.push(turn);
    return turn;
  }

  /**
   * Select appropriate template based on question
   */
  private selectTemplate(templates: string[], question: string): string {
    // Simple selection - in production, would use semantic matching
    const index = this.turnCount % templates.length;
    return templates[index];
  }

  /**
   * Add hesitation markers to response
   */
  private addHesitation(response: string): string {
    const hesitations = ["Um...", "Well...", "Let me think...", "I would say...", "Actually..."];
    const hesitation = hesitations[Math.floor(Math.random() * hesitations.length)];
    return `${hesitation} ${response}`;
  }

  /**
   * Add detail to response based on profile
   */
  private addDetail(response: string, profile: CandidateProfile): string {
    const skill = profile.hardSkills[Math.floor(Math.random() * profile.hardSkills.length)];
    return `${response} For example, I've worked extensively with ${skill}.`;
  }

  /**
   * Add question to response
   */
  private addQuestion(response: string): string {
    const questions = [
      "Would you like me to elaborate on that?",
      "Do you have any specific questions about my experience?",
      "Is there anything else you'd like to know?",
      "Would you like me to give you a specific example?",
    ];
    const question = questions[Math.floor(Math.random() * questions.length)];
    return `${response} ${question}`;
  }

  /**
   * Get conversation history
   */
  getConversationHistory(): ConversationTurn[] {
    return this.conversationHistory;
  }

  /**
   * Reset simulator
   */
  reset(): void {
    this.currentCandidate = null;
    this.conversationHistory = [];
    this.turnCount = 0;
  }

  /**
   * Validate candidate
   */
  validateCandidate(candidate: SyntheticCandidate): boolean {
    const result = SyntheticCandidateSchema.safeParse(candidate);
    return result.success;
  }

  /**
   * Create synthetic candidate from profile
   */
  createSyntheticCandidate(
    profileId: string,
    behavior: SyntheticCandidate["behavior"]
  ): SyntheticCandidate {
    const profile = scenarioLibrary.getCandidateProfileById(profileId);
    if (!profile) {
      throw new Error(`Profile not found: ${profileId}`);
    }

    return {
      id: `candidate_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      profile,
      behavior,
      responseStrategy: responseStrategies[behavior],
    };
  }

  /**
   * Get all available behaviors
   */
  getAvailableBehaviors(): SyntheticCandidate["behavior"][] {
    return Object.keys(responseStrategies) as SyntheticCandidate["behavior"][];
  }
}

export const candidateSimulator = CandidateSimulator.getInstance();
