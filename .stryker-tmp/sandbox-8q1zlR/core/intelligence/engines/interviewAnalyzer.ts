// @ts-nocheck
import { InterviewAnalysis, CandidateProfile, JobAnalysis } from "../types";

/**
 * Interview Analyzer Engine
 * 
 * Responsibilities:
 * - Analyze interview performance across multiple dimensions
 * - Identify forces and weaknesses
 * - Detect contradictions in responses
 * - Assess quality of examples and STAR method usage
 * - Calculate composite scores for various competencies
 * - Provide actionable insights for improvement
 */

export class InterviewAnalyzerEngine {
  /**
   * Analyze interview performance based on profile, job, and simulation data
   */
  static analyzeInterview(
    profile: CandidateProfile,
    job: JobAnalysis,
    simulationData: {
      responses: string[];
      scores: Record<string, number>;
      duration: number;
      questions: string[];
    }
  ): InterviewAnalysis {
    const forces = this.identifyForces(profile, simulationData);
    const weaknesses = this.identifyWeaknesses(profile, simulationData);
    const contradictions = this.detectContradictions(profile, simulationData);
    const progressionAxes = this.identifyProgressionAxes(profile, job, simulationData);
    
    const exampleQuality = this.assessExampleQuality(simulationData);
    const starQuality = this.assessSTARQuality(simulationData);
    const impact = this.assessImpact(simulationData, job);
    const leadership = this.assessLeadership(profile, simulationData, job);
    const clarity = this.assessClarity(simulationData);
    const persuasion = this.assessPersuasion(simulationData, job);
    const structure = this.assessStructure(simulationData);
    const coherence = this.assessCoherence(profile, simulationData);
    const confidence = this.assessConfidence(profile, simulationData);

    return {
      forces,
      weaknesses,
      contradictions,
      progressionAxes,
      exampleQuality,
      starQuality,
      impact,
      leadership,
      clarity,
      persuasion,
      structure,
      coherence,
      confidence,
    };
  }

  /**
   * Identify candidate's strengths from interview performance
   */
  private static identifyForces(profile: CandidateProfile, simulationData: { responses: string[]; scores: Record<string, number> }): string[] {
    const forces: string[] = [];
    const scores = simulationData.scores;

    if (scores.communication !== undefined && scores.communication >= 75) {
      forces.push("Communication claire et structurée");
    }

    if (scores.leadership !== undefined && scores.leadership >= 75) {
      forces.push("Leadership naturel et capacité à inspirer");
    }

    if (scores.confidence !== undefined && scores.confidence >= 75) {
      forces.push("Confiance en soi et assurance appropriée");
    }

    if (scores.structure !== undefined && scores.structure >= 75) {
      forces.push("Excellente structuration des réponses");
    }

    if (scores.impact !== undefined && scores.impact >= 75) {
      forces.push("Fort impact business et résultats chiffrés");
    }

    if (profile.behavior.synthesisAbility >= 70) {
      forces.push("Bonne capacité de synthèse");
    }

    if (profile.behavior.stressManagement >= 70) {
      forces.push("Bonne gestion du stress en entretien");
    }

    // Analyze responses for specific strengths
    simulationData.responses.forEach(response => {
      if (response.length > 200 && response.length < 500) {
        forces.push("Réponses équilibrées en longueur");
      }
      
      if (/\d+%/.test(response) || /\d+\s*(euros|€|k|m)/i.test(response)) {
        forces.push("Utilisation de chiffres pour étayer les propos");
      }
    });

    return [...new Set(forces)]; // Remove duplicates
  }

  /**
   * Identify candidate's weaknesses from interview performance
   */
  private static identifyWeaknesses(profile: CandidateProfile, simulationData: { responses: string[]; scores: Record<string, number> }): string[] {
    const weaknesses: string[] = [];
    const scores = simulationData.scores;

    if (scores.communication !== undefined && scores.communication < 60) {
      weaknesses.push("Communication manque de clarté");
    }

    if (scores.leadership !== undefined && scores.leadership < 60) {
      weaknesses.push("Leadership insuffisamment démontré");
    }

    if (scores.confidence !== undefined && scores.confidence < 60) {
      weaknesses.push("Confiance en soi à renforcer");
    }

    if (scores.structure !== undefined && scores.structure < 60) {
      weaknesses.push("Structuration des réponses à améliorer");
    }

    if (scores.impact !== undefined && scores.impact < 60) {
      weaknesses.push("Impact business insuffisamment quantifié");
    }

    if (profile.behavior.starProficiency < 60) {
      weaknesses.push("Maîtrise de la méthode STAR à renforcer");
    }

    if (profile.behavior.businessImpact < 60) {
      weaknesses.push("Orientation résultats à développer");
    }

    // Analyze responses for specific weaknesses
    simulationData.responses.forEach(response => {
      if (response.length > 800) {
        weaknesses.push("Tendance à être trop verbeux");
      }
      
      if (response.length < 100) {
        weaknesses.push("Réponses trop brèves");
      }
      
      if (!/\d+/.test(response)) {
        weaknesses.push("Manque de quantification");
      }
    });

    return [...new Set(weaknesses)];
  }

  /**
   * Detect contradictions in responses
   */
  private static detectContradictions(profile: CandidateProfile, simulationData: { responses: string[]; questions: string[] }): string[] {
    const contradictions: string[] = [];
    const responses = simulationData.responses;

    // Check for contradictions between stated skills and demonstrated performance
    if (profile.behavior.confidenceLevel < 50 && responses.some(r => r.toLowerCase().includes("confiant"))) {
      contradictions.push("Affirme être confiant mais posture suggère le contraire");
    }

    // Check for contradictions in leadership claims
    const leadershipMentions = responses.filter(r => r.toLowerCase().includes("leader") || r.toLowerCase().includes("équipe"));
    if (leadershipMentions.length > 0 && profile.behavior.leadershipStyle === "servant") {
      contradictions.push("Style de leadership collaboratif mais exemples suggèrent approche directive");
    }

    // Check for contradictions in stress management
    if (profile.behavior.stressManagement < 50 && responses.some(r => r.toLowerCase().includes("calme") || r.toLowerCase().includes("sous pression"))) {
      contradictions.push("Affirme gérer le stress mais réponses suggèrent tension");
    }

    // Check for contradictions in impact claims
    const impactClaims = responses.filter(r => /\d+%/.test(r));
    if (impactClaims.length === 0 && responses.some(r => r.toLowerCase().includes("impact") || r.toLowerCase().includes("résultat"))) {
      contradictions.push("Parle d'impact sans fournir de chiffres concrets");
    }

    return contradictions;
  }

  /**
   * Identify axes of progression
   */
  private static identifyProgressionAxes(profile: CandidateProfile, job: JobAnalysis, simulationData: { scores: Record<string, number> }): string[] {
    const axes: string[] = [];
    const scores = simulationData.scores;

    // Compare with job expectations
    if (scores.communication !== undefined && job.communicationExpectations && scores.communication < job.communicationExpectations.clarity - 15) {
      axes.push("Renforcer la clarté de communication pour atteindre les attentes du poste");
    }

    if (scores.leadership !== undefined && job.leadershipExpectations && scores.leadership < job.leadershipExpectations.level - 15) {
      axes.push("Développer le leadership au niveau attendu pour ce poste");
    }

    // Identify gaps based on profile history
    const decliningSkills = profile.skills.hardSkills.filter(s => s.trend === "declining");
    if (decliningSkills.length > 0) {
      axes.push(`Stabiliser et améliorer les compétences en déclin : ${decliningSkills.map(s => s.name).join(", ")}`);
    }

    // Identify gaps based on recurring errors
    const activeErrors = profile.history.recurringErrors.filter(e => e.status === "active");
    if (activeErrors.length > 0) {
      axes.push(`Corriger les erreurs récurrentes : ${activeErrors.map(e => e.pattern).join(", ")}`);
    }

    // Identify gaps based on behavioral metrics
    if (profile.behavior.starProficiency < 70) {
      axes.push("Maîtriser systématiquement la méthode STAR");
    }

    if (profile.behavior.businessImpact < 70) {
      axes.push("Quantifier systématiquement l'impact business");
    }

    if (profile.behavior.persuasionAbility < 70) {
      axes.push("Développer les capacités de persuasion et d'influence");
    }

    return axes;
  }

  /**
   * Assess the quality of examples provided
   */
  private static assessExampleQuality(simulationData: { responses: string[] }): number {
    let qualityScore = 50;
    const responses = simulationData.responses;

    responses.forEach(response => {
      // Check for specific details
      if (/\d+/.test(response)) qualityScore += 5;
      if (response.includes("parce que") || response.includes("car")) qualityScore += 3;
      if (response.length > 150 && response.length < 600) qualityScore += 5;
      
      // Check for context
      if (response.toLowerCase().includes("situation") || response.toLowerCase().includes("contexte")) {
        qualityScore += 5;
      }
      
      // Check for outcome
      if (response.toLowerCase().includes("résultat") || response.toLowerCase().includes("outcome") || response.toLowerCase().includes("succès")) {
        qualityScore += 5;
      }
    });

    return Math.min(100, Math.round(qualityScore / responses.length));
  }

  /**
   * Assess STAR method quality
   */
  private static assessSTARQuality(simulationData: { responses: string[]; questions: string[] }): number {
    let starScore = 50;
    const responses = simulationData.responses;

    responses.forEach(response => {
      const lower = response.toLowerCase();
      
      // Situation
      if (lower.includes("situation") || lower.includes("contexte") || lower.includes("quand")) {
        starScore += 10;
      }
      
      // Task
      if (lower.includes("tâche") || lower.includes("objectif") || lower.includes("mission") || lower.includes("devait")) {
        starScore += 10;
      }
      
      // Action
      if (lower.includes("j'ai") || lower.includes("ai fait") || lower.includes("action")) {
        starScore += 10;
      }
      
      // Result
      if (lower.includes("résultat") || lower.includes("succès") || lower.includes("abouti") || lower.includes("conduit à")) {
        starScore += 10;
      }
    });

    return Math.min(100, Math.round(starScore / responses.length));
  }

  /**
   * Assess business impact
   */
  private static assessImpact(simulationData: { responses: string[] }, job: JobAnalysis): number {
    let impactScore = 50;
    const responses = simulationData.responses;

    responses.forEach(response => {
      // Check for quantification
      if (/\d+%/.test(response)) impactScore += 15;
      if (/\d+\s*(k|m|€|euros|dollars)/i.test(response)) impactScore += 15;
      
      // Check for business terms
      const businessTerms = ["revenue", "profit", "cost", "budget", "roi", "kpi", "chiffre d'affaires", "marge", "économie"];
      businessTerms.forEach(term => {
        if (response.toLowerCase().includes(term)) impactScore += 5;
      });
      
      // Check for outcome focus
      if (response.toLowerCase().includes("amélioré") || response.toLowerCase().includes("réduit") || response.toLowerCase().includes("augmenté")) {
        impactScore += 10;
      }
    });

    // Adjust based on job expectations
    const expectedImpact = job.seniority === "executive" ? 90 : job.seniority === "expert" ? 80 : job.seniority === "senior" ? 70 : 60;
    
    return Math.min(100, Math.round((impactScore / responses.length) * (expectedImpact / 70)));
  }

  /**
   * Assess leadership
   */
  private static assessLeadership(profile: CandidateProfile, simulationData: { responses: string[] }, job: JobAnalysis): number {
    let leadershipScore = profile.behavior.leadershipStyle === "authoritative" ? 60 : 
                          profile.behavior.leadershipStyle === "transformational" ? 80 :
                          profile.behavior.leadershipStyle === "servant" ? 75 : 70;

    const responses = simulationData.responses;

    responses.forEach(response => {
      const lower = response.toLowerCase();
      
      // Leadership indicators
      if (lower.includes("équipe") || lower.includes("team")) leadershipScore += 5;
      if (lower.includes("dirigé") || lower.includes("mené") || lower.includes("led")) leadershipScore += 5;
      if (lower.includes("mentor") || lower.includes("coach") || lower.includes("développé")) leadershipScore += 5;
      if (lower.includes("décision") || lower.includes("choix")) leadershipScore += 5;
    });

    // Adjust based on job expectations
    const expectedLeadership = job.leadershipExpectations.level;
    const adjustment = (leadershipScore - 50) * (expectedLeadership / 70);
    
    return Math.min(100, Math.max(0, Math.round(50 + adjustment)));
  }

  /**
   * Assess clarity
   */
  private static assessClarity(simulationData: { responses: string[] }): number {
    let clarityScore = 50;
    const responses = simulationData.responses;

    responses.forEach(response => {
      // Check for clear structure
      if (response.includes("premièrement") || response.includes("deuxièmement") || response.includes("enfin")) {
        clarityScore += 10;
      }
      
      // Check for appropriate length
      if (response.length > 100 && response.length < 500) {
        clarityScore += 10;
      }
      
      // Check for simple language
      const complexWords = response.match(/\b\w{10,}\b/g);
      if (!complexWords || complexWords.length < 3) {
        clarityScore += 5;
      }
    });

    return Math.min(100, Math.round(clarityScore / responses.length));
  }

  /**
   * Assess persuasion
   */
  private static assessPersuasion(simulationData: { responses: string[] }, job: JobAnalysis): number {
    let persuasionScore = 50;
    const responses = simulationData.responses;

    responses.forEach(response => {
      const lower = response.toLowerCase();
      
      // Persuasion indicators
      if (lower.includes("parce que") || lower.includes("car") || lower.includes("donc")) {
        persuasionScore += 5;
      }
      
      if (lower.includes("convaincu") || lower.includes("démontré") || lower.includes("prouvé")) {
        persuasionScore += 5;
      }
      
      // Check for evidence
      if (/\d+/.test(response)) persuasionScore += 5;
    });

    // Adjust based on job expectations
    const expectedPersuasion = job.communicationExpectations.persuasion;
    const adjustment = (persuasionScore - 50) * (expectedPersuasion / 70);
    
    return Math.min(100, Math.max(0, Math.round(50 + adjustment)));
  }

  /**
   * Assess structure
   */
  private static assessStructure(simulationData: { responses: string[] }): number {
    let structureScore = 50;
    const responses = simulationData.responses;

    responses.forEach(response => {
      // Check for logical flow
      if (response.includes("d'abord") || response.includes("ensuite") || response.includes("enfin")) {
        structureScore += 15;
      }
      
      if (response.includes("premier point") || response.includes("deuxième point") || response.includes("troisième point")) {
        structureScore += 15;
      }
      
      // Check for introduction and conclusion
      const sentences = response.split(/[.!?]/);
      if (sentences.length >= 3) {
        structureScore += 10;
      }
    });

    return Math.min(100, Math.round(structureScore / responses.length));
  }

  /**
   * Assess coherence
   */
  private static assessCoherence(profile: CandidateProfile, simulationData: { responses: string[] }): number {
    let coherenceScore = 70; // Base score

    // Check consistency with profile
    if (profile.behavior.communicationStyle === "direct" && simulationData.responses.some(r => r.length > 600)) {
      coherenceScore -= 10;
    }

    if (profile.behavior.communicationStyle === "analytical" && simulationData.responses.some(r => r.length < 100)) {
      coherenceScore -= 10;
    }

    // Check for consistent tone across responses
    const responseLengths = simulationData.responses.map(r => r.length);
    const avgLength = responseLengths.reduce((a, b) => a + b, 0) / responseLengths.length;
    const variance = responseLengths.reduce((sum, len) => sum + Math.pow(len - avgLength, 2), 0) / responseLengths.length;
    
    if (variance > 100000) { // High variance in response lengths
      coherenceScore -= 10;
    }

    return Math.max(0, Math.min(100, coherenceScore));
  }

  /**
   * Assess confidence
   */
  private static assessConfidence(profile: CandidateProfile, simulationData: { responses: string[] }): number {
    let confidenceScore = profile.behavior.confidenceLevel;

    const responses = simulationData.responses;

    responses.forEach(response => {
      const lower = response.toLowerCase();
      
      // Confidence indicators
      if (lower.includes("je suis sûr") || lower.includes("certain") || lower.includes("confiant")) {
        confidenceScore += 5;
      }
      
      if (lower.includes("je pense") || lower.includes("peut-être") || lower.includes("je ne sais pas")) {
        confidenceScore -= 5;
      }
      
      // Check for hedging
      if (lower.includes("un peu") || lower.includes("plutôt") || lower.includes("en quelque sorte")) {
        confidenceScore -= 3;
      }
    });

    return Math.max(0, Math.min(100, Math.round(confidenceScore / responses.length)));
  }
}
