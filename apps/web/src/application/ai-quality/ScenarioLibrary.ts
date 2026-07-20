/**
 * Scenario Library
 * Pre-defined interview scenarios for AI evaluation
 */

import {
  InterviewScenario,
  CandidateProfile,
  InterviewScenarioSchema,
  CandidateProfileSchema,
} from "./interfaces/IEvaluationPlatform";

export type { InterviewScenario, CandidateProfile };

// ============================================================================
// CANDIDATE PROFILES
// ============================================================================

const candidateProfiles: Record<string, CandidateProfile> = {
  juniorDeveloper: {
    id: "junior-dev",
    name: "Jean Dupont",
    role: "Junior Developer",
    experience: 1,
    softSkills: ["communication", "teamwork", "learning"],
    hardSkills: ["JavaScript", "TypeScript", "React", "HTML", "CSS"],
    personality: "curious and motivated",
    stressLevel: 7,
    confidenceLevel: 4,
    communicationAbility: 6,
    language: "French",
    frequentErrors: ["syntax errors", "forgetting semicolons", "misunderstanding requirements"],
    strengths: ["fast learner", "enthusiastic", "team player"],
    weaknesses: ["lack of experience", "sometimes overconfident", "needs guidance"],
    responseStyle: "enthusiastic",
  },
  seniorDeveloper: {
    id: "senior-dev",
    name: "Marie Martin",
    role: "Senior Developer",
    experience: 8,
    softSkills: ["leadership", "mentoring", "problem-solving"],
    hardSkills: ["TypeScript", "Node.js", "React", "Architecture", "DevOps"],
    personality: "confident and analytical",
    stressLevel: 3,
    confidenceLevel: 9,
    communicationAbility: 9,
    language: "French",
    frequentErrors: [],
    strengths: ["deep technical knowledge", "leadership", "system design"],
    weaknesses: ["can be too critical", "impatient with juniors"],
    responseStyle: "technical",
  },
  dataScientist: {
    id: "data-scientist",
    name: "Pierre Bernard",
    role: "Data Scientist",
    experience: 5,
    softSkills: ["analytical thinking", "communication", "curiosity"],
    hardSkills: ["Python", "Machine Learning", "Statistics", "SQL", "Data Visualization"],
    personality: "analytical and detail-oriented",
    stressLevel: 4,
    confidenceLevel: 7,
    communicationAbility: 7,
    language: "French",
    frequentErrors: ["overcomplicating simple problems", "getting lost in details"],
    strengths: ["strong analytical skills", "data-driven decision making"],
    weaknesses: ["can be too technical", "struggles with business context"],
    responseStyle: "technical",
  },
  devOps: {
    id: "devops",
    name: "Sophie Laurent",
    role: "DevOps Engineer",
    experience: 6,
    softSkills: ["problem-solving", "automation", "collaboration"],
    hardSkills: ["Docker", "Kubernetes", "CI/CD", "AWS", "Terraform"],
    personality: "pragmatic and efficient",
    stressLevel: 5,
    confidenceLevel: 8,
    communicationAbility: 8,
    language: "French",
    frequentErrors: ["ignoring security concerns", "over-optimizing"],
    strengths: ["automation expertise", "reliability focus", "cross-team collaboration"],
    weaknesses: ["can be rigid about processes", "sometimes misses business value"],
    responseStyle: "formal",
  },
  productManager: {
    id: "product-manager",
    name: "Lucas Moreau",
    role: "Product Manager",
    experience: 7,
    softSkills: ["communication", "prioritization", "stakeholder management"],
    hardSkills: ["Agile", "User Research", "Data Analysis", "Roadmapping"],
    personality: "strategic and empathetic",
    stressLevel: 6,
    confidenceLevel: 8,
    communicationAbility: 9,
    language: "French",
    frequentErrors: ["overcommitting", "underestimating technical complexity"],
    strengths: ["user empathy", "strategic thinking", "team alignment"],
    weaknesses: ["can be too optimistic", "sometimes lacks technical depth"],
    responseStyle: "casual",
  },
  uxDesigner: {
    id: "ux-designer",
    name: "Emma Rousseau",
    role: "UX Designer",
    experience: 4,
    softSkills: ["empathy", "creativity", "communication"],
    hardSkills: ["Figma", "User Research", "Prototyping", "Design Systems"],
    personality: "creative and user-focused",
    stressLevel: 5,
    confidenceLevel: 7,
    communicationAbility: 8,
    language: "French",
    frequentErrors: ["overdesigning", "ignoring technical constraints"],
    strengths: ["user empathy", "creative problem solving", "visual communication"],
    weaknesses: ["can be defensive about design", "struggles with technical trade-offs"],
    responseStyle: "enthusiastic",
  },
  sales: {
    id: "sales",
    name: "Thomas Dubois",
    role: "Sales Representative",
    experience: 5,
    softSkills: ["persuasion", "relationship building", "resilience"],
    hardSkills: ["CRM", "Negotiation", "Presentation", "Market Analysis"],
    personality: "outgoing and persistent",
    stressLevel: 4,
    confidenceLevel: 9,
    communicationAbility: 9,
    language: "French",
    frequentErrors: ["overpromising", "ignoring details"],
    strengths: ["relationship building", "persuasion", "resilience"],
    weaknesses: ["can be too aggressive", "sometimes lacks product knowledge"],
    responseStyle: "casual",
  },
  marketing: {
    id: "marketing",
    name: "Camille Petit",
    role: "Marketing Manager",
    experience: 6,
    softSkills: ["creativity", "strategic thinking", "communication"],
    hardSkills: ["Digital Marketing", "Content Strategy", "Analytics", "SEO"],
    personality: "creative and data-driven",
    stressLevel: 5,
    confidenceLevel: 8,
    communicationAbility: 8,
    language: "French",
    frequentErrors: ["focusing on vanity metrics", "underestimating costs"],
    strengths: ["creative campaigns", "data analysis", "brand building"],
    weaknesses: ["can be too focused on short-term results", "sometimes lacks ROI focus"],
    responseStyle: "enthusiastic",
  },
  finance: {
    id: "finance",
    name: "Nicolas Leroy",
    role: "Financial Analyst",
    experience: 5,
    softSkills: ["attention to detail", "analytical thinking", "integrity"],
    hardSkills: ["Excel", "Financial Modeling", "Risk Analysis", "Reporting"],
    personality: "meticulous and cautious",
    stressLevel: 3,
    confidenceLevel: 7,
    communicationAbility: 7,
    language: "French",
    frequentErrors: ["being too conservative", "missing strategic opportunities"],
    strengths: ["attention to detail", "risk management", "accuracy"],
    weaknesses: ["can be too risk-averse", "struggles with ambiguity"],
    responseStyle: "formal",
  },
  hr: {
    id: "hr",
    name: "Isabelle Blanc",
    role: "HR Manager",
    experience: 8,
    softSkills: ["empathy", "conflict resolution", "communication"],
    hardSkills: ["Recruitment", "Employee Relations", "Performance Management", "Compliance"],
    personality: "empathetic and diplomatic",
    stressLevel: 4,
    confidenceLevel: 8,
    communicationAbility: 9,
    language: "French",
    frequentErrors: ["being too lenient", "avoiding difficult conversations"],
    strengths: ["conflict resolution", "employee advocacy", "organizational culture"],
    weaknesses: ["can be too soft", "struggles with tough decisions"],
    responseStyle: "casual",
  },
  support: {
    id: "support",
    name: "Antoine Garcia",
    role: "Customer Support",
    experience: 3,
    softSkills: ["patience", "problem-solving", "communication"],
    hardSkills: ["Technical Troubleshooting", "CRM", "Product Knowledge", "Documentation"],
    personality: "patient and helpful",
    stressLevel: 6,
    confidenceLevel: 6,
    communicationAbility: 8,
    language: "French",
    frequentErrors: ["escalating too quickly", "not documenting solutions"],
    strengths: ["patience", "technical troubleshooting", "customer empathy"],
    weaknesses: ["can be overwhelmed", "sometimes lacks product depth"],
    responseStyle: "casual",
  },
  manager: {
    id: "manager",
    name: "François Michel",
    role: "Engineering Manager",
    experience: 10,
    softSkills: ["leadership", "mentoring", "strategic thinking"],
    hardSkills: ["Team Management", "Technical Leadership", "Agile", "Hiring"],
    personality: "supportive and strategic",
    stressLevel: 5,
    confidenceLevel: 9,
    communicationAbility: 9,
    language: "French",
    frequentErrors: ["micromanaging", "not delegating enough"],
    strengths: ["team development", "strategic vision", "cross-functional collaboration"],
    weaknesses: ["can be too hands-on", "struggles with work-life balance"],
    responseStyle: "formal",
  },
  cto: {
    id: "cto",
    name: "Claire Durand",
    role: "CTO",
    experience: 15,
    softSkills: ["vision", "leadership", "communication"],
    hardSkills: ["System Architecture", "Technology Strategy", "Team Building", "Business Acumen"],
    personality: "visionary and decisive",
    stressLevel: 4,
    confidenceLevel: 10,
    communicationAbility: 9,
    language: "French",
    frequentErrors: ["being too visionary", "underestimating implementation details"],
    strengths: ["strategic vision", "team building", "technology leadership"],
    weaknesses: ["can be disconnected from day-to-day", "sometimes overcommits"],
    responseStyle: "formal",
  },
  ceo: {
    id: "ceo",
    name: "Marc Lefebvre",
    role: "CEO",
    experience: 20,
    softSkills: ["leadership", "strategic thinking", "communication"],
    hardSkills: ["Business Strategy", "Fundraising", "Public Speaking", "Negotiation"],
    personality: "charismatic and ambitious",
    stressLevel: 3,
    confidenceLevel: 10,
    communicationAbility: 10,
    language: "French",
    frequentErrors: ["overpromising", "ignoring operational details"],
    strengths: ["vision", "leadership", "business acumen"],
    weaknesses: ["can be disconnected from reality", "sometimes unrealistic"],
    responseStyle: "formal",
  },
  freelance: {
    id: "freelance",
    name: "Julie Renard",
    role: "Freelance Developer",
    experience: 6,
    softSkills: ["adaptability", "self-motivation", "communication"],
    hardSkills: ["Full Stack", "Project Management", "Client Relations", "Multiple Technologies"],
    personality: "independent and versatile",
    stressLevel: 5,
    confidenceLevel: 8,
    communicationAbility: 8,
    language: "French",
    frequentErrors: ["overcommitting", "scope creep"],
    strengths: ["versatility", "adaptability", "client management"],
    weaknesses: ["can be isolated", "struggles with long-term planning"],
    responseStyle: "casual",
  },
};

// ============================================================================
// INTERVIEW SCENARIOS
// ============================================================================

const scenarios: InterviewScenario[] = [
  {
    id: "junior-dev-interview",
    name: "Junior Developer Interview",
    description: "Interview for a junior developer position focusing on fundamentals and potential",
    candidateProfile: candidateProfiles.juniorDeveloper,
    jobTitle: "Junior Developer",
    level: "junior",
    difficulty: "easy",
    duration: 30,
    expectedTopics: ["JavaScript basics", "React fundamentals", "Problem solving", "Team collaboration"],
    evaluationCriteria: ["technical knowledge", "learning ability", "communication", "enthusiasm"],
  },
  {
    id: "senior-dev-interview",
    name: "Senior Developer Interview",
    description: "Interview for a senior developer position focusing on architecture and leadership",
    candidateProfile: candidateProfiles.seniorDeveloper,
    jobTitle: "Senior Developer",
    level: "senior",
    difficulty: "hard",
    duration: 45,
    expectedTopics: ["System architecture", "Leadership", "Code review", "Mentoring", "Best practices"],
    evaluationCriteria: ["technical depth", "leadership", "communication", "problem solving"],
  },
  {
    id: "data-scientist-interview",
    name: "Data Scientist Interview",
    description: "Interview for a data scientist position focusing on ML and analytics",
    candidateProfile: candidateProfiles.dataScientist,
    jobTitle: "Data Scientist",
    level: "mid",
    difficulty: "medium",
    duration: 45,
    expectedTopics: ["Machine Learning", "Statistics", "Python", "Data analysis", "Business value"],
    evaluationCriteria: ["technical skills", "analytical thinking", "communication", "business acumen"],
  },
  {
    id: "devops-interview",
    name: "DevOps Engineer Interview",
    description: "Interview for a DevOps position focusing on infrastructure and automation",
    candidateProfile: candidateProfiles.devOps,
    jobTitle: "DevOps Engineer",
    level: "mid",
    difficulty: "medium",
    duration: 40,
    expectedTopics: ["CI/CD", "Docker", "Kubernetes", "Cloud services", "Automation"],
    evaluationCriteria: ["technical expertise", "automation mindset", "collaboration", "reliability focus"],
  },
  {
    id: "product-manager-interview",
    name: "Product Manager Interview",
    description: "Interview for a product manager position focusing on strategy and user focus",
    candidateProfile: candidateProfiles.productManager,
    jobTitle: "Product Manager",
    level: "mid",
    difficulty: "medium",
    duration: 45,
    expectedTopics: ["Product strategy", "User research", "Prioritization", "Stakeholder management", "Metrics"],
    evaluationCriteria: ["strategic thinking", "user empathy", "communication", "prioritization"],
  },
  {
    id: "ux-designer-interview",
    name: "UX Designer Interview",
    description: "Interview for a UX designer position focusing on design thinking and user research",
    candidateProfile: candidateProfiles.uxDesigner,
    jobTitle: "UX Designer",
    level: "mid",
    difficulty: "medium",
    duration: 40,
    expectedTopics: ["Design thinking", "User research", "Prototyping", "Design systems", "Collaboration"],
    evaluationCriteria: ["design skills", "user empathy", "communication", "problem solving"],
  },
  {
    id: "sales-interview",
    name: "Sales Representative Interview",
    description: "Interview for a sales position focusing on persuasion and relationship building",
    candidateProfile: candidateProfiles.sales,
    jobTitle: "Sales Representative",
    level: "mid",
    difficulty: "easy",
    duration: 30,
    expectedTopics: ["Sales techniques", "Relationship building", "Product knowledge", "Negotiation", "Resilience"],
    evaluationCriteria: ["persuasion", "communication", "resilience", "product knowledge"],
  },
  {
    id: "marketing-interview",
    name: "Marketing Manager Interview",
    description: "Interview for a marketing position focusing on strategy and creativity",
    candidateProfile: candidateProfiles.marketing,
    jobTitle: "Marketing Manager",
    level: "mid",
    difficulty: "medium",
    duration: 40,
    expectedTopics: ["Marketing strategy", "Content creation", "Analytics", "Brand building", "Campaign management"],
    evaluationCriteria: ["creativity", "strategic thinking", "analytical skills", "communication"],
  },
  {
    id: "finance-interview",
    name: "Financial Analyst Interview",
    description: "Interview for a finance position focusing on analysis and risk management",
    candidateProfile: candidateProfiles.finance,
    jobTitle: "Financial Analyst",
    level: "mid",
    difficulty: "medium",
    duration: 35,
    expectedTopics: ["Financial modeling", "Risk analysis", "Reporting", "Attention to detail", "Compliance"],
    evaluationCriteria: ["analytical skills", "attention to detail", "communication", "risk awareness"],
  },
  {
    id: "hr-interview",
    name: "HR Manager Interview",
    description: "Interview for an HR position focusing on people management and culture",
    candidateProfile: candidateProfiles.hr,
    jobTitle: "HR Manager",
    level: "senior",
    difficulty: "medium",
    duration: 40,
    expectedTopics: ["Employee relations", "Recruitment", "Conflict resolution", "Culture building", "Compliance"],
    evaluationCriteria: ["empathy", "communication", "conflict resolution", "strategic thinking"],
  },
  {
    id: "support-interview",
    name: "Customer Support Interview",
    description: "Interview for a support position focusing on problem solving and patience",
    candidateProfile: candidateProfiles.support,
    jobTitle: "Customer Support",
    level: "junior",
    difficulty: "easy",
    duration: 30,
    expectedTopics: ["Technical troubleshooting", "Customer service", "Patience", "Communication", "Product knowledge"],
    evaluationCriteria: ["patience", "problem solving", "communication", "technical knowledge"],
  },
  {
    id: "manager-interview",
    name: "Engineering Manager Interview",
    description: "Interview for a management position focusing on leadership and team development",
    candidateProfile: candidateProfiles.manager,
    jobTitle: "Engineering Manager",
    level: "senior",
    difficulty: "hard",
    duration: 50,
    expectedTopics: ["Leadership", "Team management", "Technical leadership", "Hiring", "Strategic thinking"],
    evaluationCriteria: ["leadership", "communication", "strategic thinking", "mentoring"],
  },
  {
    id: "cto-interview",
    name: "CTO Interview",
    description: "Interview for a CTO position focusing on vision and technology leadership",
    candidateProfile: candidateProfiles.cto,
    jobTitle: "CTO",
    level: "expert",
    difficulty: "hard",
    duration: 60,
    expectedTopics: ["Technology strategy", "Vision", "Team building", "Business acumen", "Innovation"],
    evaluationCriteria: ["vision", "leadership", "communication", "strategic thinking"],
  },
  {
    id: "ceo-interview",
    name: "CEO Interview",
    description: "Interview for a CEO position focusing on business strategy and leadership",
    candidateProfile: candidateProfiles.ceo,
    jobTitle: "CEO",
    level: "expert",
    difficulty: "hard",
    duration: 60,
    expectedTopics: ["Business strategy", "Leadership", "Vision", "Fundraising", "Public speaking"],
    evaluationCriteria: ["vision", "leadership", "communication", "business acumen"],
  },
  {
    id: "freelance-interview",
    name: "Freelance Developer Interview",
    description: "Interview for a freelance position focusing on versatility and adaptability",
    candidateProfile: candidateProfiles.freelance,
    jobTitle: "Freelance Developer",
    level: "mid",
    difficulty: "medium",
    duration: 35,
    expectedTopics: ["Full stack skills", "Project management", "Client relations", "Adaptability", "Self-motivation"],
    evaluationCriteria: ["versatility", "adaptability", "communication", "self-motivation"],
  },
];

// ============================================================================
// SCENARIO LIBRARY CLASS
// ============================================================================

export class ScenarioLibrary {
  private static instance: ScenarioLibrary;

  private constructor() {}

  static getInstance(): ScenarioLibrary {
    if (!ScenarioLibrary.instance) {
      ScenarioLibrary.instance = new ScenarioLibrary();
    }
    return ScenarioLibrary.instance;
  }

  /**
   * Get all scenarios
   */
  getAllScenarios(): InterviewScenario[] {
    return scenarios;
  }

  /**
   * Get scenario by ID
   */
  getScenarioById(id: string): InterviewScenario | null {
    return scenarios.find(s => s.id === id) || null;
  }

  /**
   * Get scenarios by difficulty
   */
  getScenariosByDifficulty(difficulty: "easy" | "medium" | "hard"): InterviewScenario[] {
    return scenarios.filter(s => s.difficulty === difficulty);
  }

  /**
   * Get scenarios by level
   */
  getScenariosByLevel(level: "junior" | "mid" | "senior" | "expert"): InterviewScenario[] {
    return scenarios.filter(s => s.level === level);
  }

  /**
   * Get all candidate profiles
   */
  getAllCandidateProfiles(): CandidateProfile[] {
    return Object.values(candidateProfiles);
  }

  /**
   * Get candidate profile by ID
   */
  getCandidateProfileById(id: string): CandidateProfile | null {
    return candidateProfiles[id] || null;
  }

  /**
   * Validate scenario
   */
  validateScenario(scenario: InterviewScenario): boolean {
    const result = InterviewScenarioSchema.safeParse(scenario);
    return result.success;
  }

  /**
   * Validate candidate profile
   */
  validateCandidateProfile(profile: CandidateProfile): boolean {
    const result = CandidateProfileSchema.safeParse(profile);
    return result.success;
  }
}

export const scenarioLibrary = ScenarioLibrary.getInstance();
