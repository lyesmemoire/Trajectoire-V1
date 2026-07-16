// @ts-nocheck
import { JobAnalysis, Skill, CultureProfile, LeadershipExpectations, CommunicationExpectations } from "../types";

/**
 * Job Analyzer Engine
 * 
 * Responsibilities:
 * - Parse and analyze job descriptions
 * - Extract key requirements and expectations
 * - Identify cultural fit indicators
 * - Determine probable interview questions
 * - Assess job difficulty and pressure
 * - Predict recruiter type and style
 */

export class JobAnalyzerEngine {
  /**
   * Analyze a job description and extract structured information
   */
  static analyzeJobDescription(jobDescription: string, position: string, sector: string): JobAnalysis {
    const seniority = this.determineSeniority(jobDescription, position);
    const requiredSkills = this.extractSkills(jobDescription);
    const softSkills = this.extractSoftSkills(jobDescription);
    const culture = this.analyzeCulture(jobDescription);
    const keywords = this.extractKeywords(jobDescription);
    const leadershipExpectations = this.extractLeadershipExpectations(jobDescription, seniority);
    const communicationExpectations = this.extractCommunicationExpectations(jobDescription, seniority);
    const technicalLevel = this.assessTechnicalLevel(jobDescription, seniority);
    const expectedRecruiterType = this.predictRecruiterType(sector, seniority);
    const exigencyLevel = this.assessExigency(jobDescription, seniority);
    const expectedPressure = this.assessPressure(jobDescription, sector);
    const probableQuestions = this.generateProbableQuestions(jobDescription, position, seniority);
    const probableTraps = this.identifyProbableTraps(jobDescription, position);

    return {
      position,
      seniority,
      sector,
      requiredSkills,
      softSkills,
      culture,
      keywords,
      leadershipExpectations,
      communicationExpectations,
      technicalLevel,
      expectedRecruiterType,
      exigencyLevel,
      expectedPressure,
      probableQuestions,
      probableTraps,
    };
  }

  /**
   * Determine the seniority level from job description
   */
  private static determineSeniority(description: string, position: string): "junior" | "intermediate" | "senior" | "expert" | "executive" {
    const lowerDesc = description.toLowerCase();
    const lowerPos = position.toLowerCase();

    const juniorKeywords = ["junior", "assistant", "intern", "stagiaire", "débutant", "entry level"];
    const intermediateKeywords = ["intermediate", "mid-level", "2-3 years", "3-5 ans"];
    const seniorKeywords = ["senior", "lead", "5+ years", "5+ ans", "expert", "spécialiste"];
    const expertKeywords = ["expert", "principal", "architect", "10+ years", "10+ ans", "head of"];
    const executiveKeywords = ["director", "vp", "c-level", "executive", "head", "chief", "directeur", "président"];

    if (executiveKeywords.some(k => lowerDesc.includes(k) || lowerPos.includes(k))) return "executive";
    if (expertKeywords.some(k => lowerDesc.includes(k) || lowerPos.includes(k))) return "expert";
    if (seniorKeywords.some(k => lowerDesc.includes(k) || lowerPos.includes(k))) return "senior";
    if (intermediateKeywords.some(k => lowerDesc.includes(k) || lowerPos.includes(k))) return "intermediate";
    if (juniorKeywords.some(k => lowerDesc.includes(k) || lowerPos.includes(k))) return "junior";

    return "intermediate"; // Default
  }

  /**
   * Extract hard skills from job description
   */
  private static extractSkills(description: string): Skill[] {
    const skillKeywords = [
      "javascript", "typescript", "python", "java", "react", "angular", "vue",
      "node.js", "sql", "nosql", "mongodb", "postgresql", "aws", "azure", "gcp",
      "docker", "kubernetes", "ci/cd", "agile", "scrum", "devops", "machine learning",
      "data analysis", "project management", "marketing", "sales", "finance",
      "accounting", "hr", "recruiting", "leadership", "management", "strategy",
    ];

    const lowerDesc = description.toLowerCase();
    const foundSkills: Skill[] = [];

    skillKeywords.forEach(skill => {
      if (lowerDesc.includes(skill)) {
        foundSkills.push({
          name: skill,
          level: 70, // Default required level
          lastAssessed: new Date(),
          trend: "stable",
        });
      }
    });

    return foundSkills;
  }

  /**
   * Extract soft skills from job description
   */
  private static extractSoftSkills(description: string): string[] {
    const softSkillKeywords = [
      "communication", "leadership", "teamwork", "collaboration", "problem-solving",
      "adaptability", "creativity", "critical thinking", "time management",
      "organization", "interpersonal skills", "emotional intelligence", "negotiation",
      "presentation", "analytical", "strategic", "decision-making", "delegation",
      "mentoring", "coaching", "influence", "stakeholder management",
    ];

    const lowerDesc = description.toLowerCase();
    return softSkillKeywords.filter(skill => lowerDesc.includes(skill));
  }

  /**
   * Analyze cultural indicators in job description
   */
  private static analyzeCulture(description: string): CultureProfile {
    const lowerDesc = description.toLowerCase();

    const values: string[] = [];
    if (lowerDesc.includes("innovation") || lowerDesc.includes("innovative")) values.push("Innovation");
    if (lowerDesc.includes("collaboration") || lowerDesc.includes("team")) values.push("Collaboration");
    if (lowerDesc.includes("excellence") || lowerDesc.includes("quality")) values.push("Excellence");
    if (lowerDesc.includes("customer") || lowerDesc.includes("client")) values.push("Customer focus");
    if (lowerDesc.includes("agility") || lowerDesc.includes("agile")) values.push("Agility");
    if (lowerDesc.includes("integrity") || lowerDesc.includes("ethics")) values.push("Integrity");

    const workStyle = lowerDesc.includes("remote") || lowerDesc.includes("télétravail")
      ? "Remote/Hybrid"
      : lowerDesc.includes("fast-paced") || lowerDesc.includes("rythme soutenu")
      ? "Fast-paced"
      : "Structured";

    const pace = lowerDesc.includes("fast-paced") || lowerDesc.includes("rapid")
      ? "Fast"
      : lowerDesc.includes("steady") || lowerDesc.includes("stable")
      ? "Steady"
      : "Moderate";

    const collaboration = lowerDesc.includes("cross-functional") || lowerDesc.includes("transverse")
      ? "High cross-functional collaboration"
      : lowerDesc.includes("team")
      ? "Team-oriented"
      : "Individual contributor";

    const innovation = lowerDesc.includes("innovation") || lowerDesc.includes("pioneering")
      ? "High innovation focus"
      : lowerDesc.includes("improvement")
      ? "Continuous improvement"
      : "Process-oriented";

    return {
      values,
      workStyle,
      pace,
      collaboration,
      innovation,
    };
  }

  /**
   * Extract keywords for ATS matching
   */
  private static extractKeywords(description: string): string[] {
    const words = description.toLowerCase().match(/\b\w+\b/g) || [];
    const stopWords = new Set(["le", "la", "les", "de", "du", "des", "un", "une", "et", "ou", "mais", "donc", "or", "ni", "car", "the", "a", "an", "and", "or", "but", "so", "for", "with", "at", "by", "from", "in", "on", "to"]);
    
    const filteredWords = words.filter(word => word.length > 3 && !stopWords.has(word));
    const wordFrequency = new Map<string, number>();
    
    filteredWords.forEach(word => {
      wordFrequency.set(word, (wordFrequency.get(word) || 0) + 1);
    });
    
    return Array.from(wordFrequency.entries())
      .filter(([_, freq]) => freq >= 2)
      .map(([word]) => word)
      .slice(0, 20);
  }

  /**
   * Extract leadership expectations based on seniority
   */
  private static extractLeadershipExpectations(description: string, seniority: string): LeadershipExpectations {
    const lowerDesc = description.toLowerCase();

    let style: string[] = [];
    let level = 0;
    let focus: string[] = [];

    switch (seniority) {
      case "junior":
        style = ["Self-motivated", "Eager to learn", "Follows direction"];
        level = 20;
        focus = ["Learning", "Execution", "Reliability"];
        break;
      case "intermediate":
        style = ["Independent", "Collaborative", "Proactive"];
        level = 40;
        focus = ["Autonomy", "Quality", "Team contribution"];
        break;
      case "senior":
        style = ["Mentoring", "Technical leadership", "Decision-making"];
        level = 60;
        focus = ["Guidance", "Problem-solving", "Best practices"];
        break;
      case "expert":
        style = ["Strategic", "Visionary", "Influential"];
        level = 80;
        focus = ["Architecture", "Innovation", "Standards"];
        break;
      case "executive":
        style = ["Transformational", "Executive presence", "Change management"];
        level = 100;
        focus = ["Strategy", "Culture", "Business impact"];
        break;
    }

    if (lowerDesc.includes("manage") || lowerDesc.includes("gérer")) {
      style.push("People management");
      level += 10;
    }

    if (lowerDesc.includes("lead") || lowerDesc.includes("diriger")) {
      style.push("Team leadership");
      level += 15;
    }

    return { style, level: Math.min(100, level), focus };
  }

  /**
   * Extract communication expectations
   */
  private static extractCommunicationExpectations(description: string, seniority: string): CommunicationExpectations {
    const lowerDesc = description.toLowerCase();

    const style: string[] = [];
    let clarity = 50;
    let persuasion = 50;

    if (lowerDesc.includes("presentation") || lowerDesc.includes("présentation")) {
      style.push("Presentation skills");
      clarity += 20;
    }

    if (lowerDesc.includes("negotiation") || lowerDesc.includes("négociation")) {
      style.push("Negotiation");
      persuasion += 25;
    }

    if (lowerDesc.includes("stakeholder") || lowerDesc.includes("parties prenantes")) {
      style.push("Stakeholder management");
      clarity += 15;
      persuasion += 15;
    }

    if (lowerDesc.includes("written") || lowerDesc.includes("écrit")) {
      style.push("Written communication");
      clarity += 10;
    }

    // Adjust based on seniority
    switch (seniority) {
      case "junior":
        clarity = Math.min(100, clarity + 10);
        break;
      case "intermediate":
        clarity = Math.min(100, clarity + 15);
        persuasion = Math.min(100, persuasion + 10);
        break;
      case "senior":
        clarity = Math.min(100, clarity + 20);
        persuasion = Math.min(100, persuasion + 20);
        break;
      case "expert":
        clarity = Math.min(100, clarity + 25);
        persuasion = Math.min(100, persuasion + 25);
        break;
      case "executive":
        clarity = Math.min(100, clarity + 30);
        persuasion = Math.min(100, persuasion + 35);
        break;
    }

    return { style, clarity, persuasion };
  }

  /**
   * Assess technical level required
   */
  private static assessTechnicalLevel(description: string, seniority: string): number {
    const lowerDesc = description.toLowerCase();
    let level = 50;

    const technicalKeywords = ["code", "programming", "développement", "software", "logiciel", "technical", "technique"];
    const advancedKeywords = ["architecture", "system design", "conception système", "scalability", "extensibilité"];

    if (technicalKeywords.some(k => lowerDesc.includes(k))) {
      level += 20;
    }

    if (advancedKeywords.some(k => lowerDesc.includes(k))) {
      level += 25;
    }

    switch (seniority) {
      case "junior":
        level = Math.min(100, level);
        break;
      case "intermediate":
        level = Math.min(100, level + 10);
        break;
      case "senior":
        level = Math.min(100, level + 20);
        break;
      case "expert":
        level = Math.min(100, level + 30);
        break;
      case "executive":
        level = Math.max(30, level - 10); // Less technical, more strategic
        break;
    }

    return level;
  }

  /**
   * Predict the type of recruiter
   */
  private static predictRecruiterType(sector: string, seniority: string): string {
    const sectorLower = sector.toLowerCase();

    if (seniority === "executive") {
      return "Executive Search Consultant / Headhunter";
    }

    if (sectorLower.includes("tech") || sectorLower.includes("software") || sectorLower.includes("it")) {
      return "Technical Recruiter / Engineering Manager";
    }

    if (sectorLower.includes("sales") || sectorLower.includes("commercial")) {
      return "Sales Recruiter / VP Sales";
    }

    if (sectorLower.includes("finance") || sectorLower.includes("accounting")) {
      return "Finance Recruiter / CFO";
    }

    if (sectorLower.includes("hr") || sectorLower.includes("rh")) {
      return "HR Business Partner / HR Director";
    }

    return "Generalist Recruiter / Hiring Manager";
  }

  /**
   * Assess exigency level
   */
  private static assessExigency(description: string, seniority: string): number {
    const lowerDesc = description.toLowerCase();
    let exigency = 50;

    const exigencyKeywords = ["must", "required", "mandatory", "essential", "obligatoire", "requis", "impératif"];
    const flexibleKeywords = ["nice to have", "plus", "preferred", "préféré", "bonus"];

    exigencyKeywords.forEach(k => {
      if (lowerDesc.includes(k)) exigency += 10;
    });

    flexibleKeywords.forEach(k => {
      if (lowerDesc.includes(k)) exigency -= 5;
    });

    switch (seniority) {
      case "junior":
        exigency = Math.max(30, exigency - 10);
        break;
      case "intermediate":
        exigency = Math.min(100, exigency);
        break;
      case "senior":
        exigency = Math.min(100, exigency + 10);
        break;
      case "expert":
        exigency = Math.min(100, exigency + 20);
        break;
      case "executive":
        exigency = Math.min(100, exigency + 25);
        break;
    }

    return Math.max(0, Math.min(100, exigency));
  }

  /**
   * Assess expected pressure level
   */
  private static assessPressure(description: string, sector: string): number {
    const lowerDesc = description.toLowerCase();
    const sectorLower = sector.toLowerCase();
    let pressure = 50;

    const pressureKeywords = ["fast-paced", "deadline", "urgent", "high-pressure", "rythme soutenu", "délai", "urgence"];
    const calmKeywords = ["steady", "balanced", "équilibre", "stable"];

    pressureKeywords.forEach(k => {
      if (lowerDesc.includes(k)) pressure += 15;
    });

    calmKeywords.forEach(k => {
      if (lowerDesc.includes(k)) pressure -= 10;
    });

    if (sectorLower.includes("startup") || sectorLower.includes("sales")) {
      pressure += 20;
    }

    if (sectorLower.includes("government") || sectorLower.includes("public")) {
      pressure -= 15;
    }

    return Math.max(0, Math.min(100, pressure));
  }

  /**
   * Generate probable interview questions
   */
  private static generateProbableQuestions(description: string, position: string, seniority: string): string[] {
    const questions: string[] = [];

    // Generic questions
    questions.push("Parlez-moi de vous et de votre parcours");
    questions.push("Pourquoi souhaitez-vous rejoindre notre entreprise ?");
    questions.push("Qu'est-ce qui vous motive dans ce poste ?");

    // Seniority-specific questions
    switch (seniority) {
      case "junior":
        questions.push("Qu'avez-vous appris récemment ?");
        questions.push("Comment travaillez-vous en équipe ?");
        break;
      case "intermediate":
        questions.push("Décrivez un projet complexe que vous avez mené");
        questions.push("Comment gérez-vous les priorités ?");
        break;
      case "senior":
        questions.push("Comment avez-vous développé vos compétences ?");
        questions.push("Donnez-moi un exemple de leadership");
        break;
      case "expert":
        questions.push("Quelle est votre vision de votre domaine ?");
        questions.push("Comment avez-vous influencé les standards de votre équipe ?");
        break;
      case "executive":
        questions.push("Quelle est votre stratégie pour les 12 prochains mois ?");
        questions.push("Comment transformeriez-vous notre organisation ?");
        break;
    }

    // Position-specific questions
    const lowerPos = position.toLowerCase();
    if (lowerPos.includes("manager") || lowerPos.includes("chef")) {
      questions.push("Comment gérez-vous les performances de votre équipe ?");
      questions.push("Comment recrutez-vous vos collaborateurs ?");
    }

    if (lowerPos.includes("develop") || lowerPos.includes("développeur")) {
      questions.push("Comment assurez-vous la qualité de votre code ?");
      questions.push("Comment gérez-vous la dette technique ?");
    }

    // Description-based questions
    const lowerDesc = description.toLowerCase();
    if (lowerDesc.includes("crisis") || lowerDesc.includes("crise")) {
      questions.push("Décrivez une situation de crise que vous avez gérée");
    }

    if (lowerDesc.includes("innovation")) {
      questions.push("Comment avez-vous innové dans votre rôle actuel ?");
    }

    return questions.slice(0, 10);
  }

  /**
   * Identify probable interview traps
   */
  private static identifyProbableTraps(description: string, position: string): string[] {
    const traps: string[] = [];

    const lowerDesc = description.toLowerCase();
    const lowerPos = position.toLowerCase();

    // Common traps
    traps.push("Question sur vos faiblesses - ne pas être trop critique ni trop arrogant");
    traps.push("Question sur l'échec - montrer la résilience et les apprentissages");

    // Seniority-specific traps
    if (lowerPos.includes("senior") || lowerPos.includes("lead") || lowerPos.includes("expert")) {
      traps.push("Question sur la gestion d'un conflit - éviter de blâmer les autres");
      traps.push("Question sur la prise de décision - montrer la méthode et l'écoute");
    }

    if (lowerPos.includes("manager") || lowerPos.includes("chef")) {
      traps.push("Question sur un employé sous-performant - éviter d'être trop dur ou trop laxiste");
    }

    // Description-based traps
    if (lowerDesc.includes("team") || lowerDesc.includes("équipe")) {
      traps.push("Question sur le travail en équipe difficile - éviter de se présenter comme le sauveur");
    }

    if (lowerDesc.includes("innovation") || lowerDesc.includes("change")) {
      traps.push("Question sur la résistance au changement - éviter de minimiser les défis");
    }

    return traps.slice(0, 5);
  }
}
