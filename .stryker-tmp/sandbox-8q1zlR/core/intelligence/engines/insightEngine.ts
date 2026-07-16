// @ts-nocheck
import { Insight, CandidateProfile, InterviewAnalysis, JobAnalysis } from "../types";

/**
 * Insight Engine
 * 
 * Responsibilities:
 * - Generate observations from data (not scores)
 * - Detect patterns in behavior and performance
 * - Provide actionable insights
 * - Identify recurring themes
 * - Generate contextual observations
 */

export class InsightEngine {
  /**
   * Generate insights from profile and interview data
   */
  static generateInsights(
    profile: CandidateProfile,
    interviewAnalysis: InterviewAnalysis,
    job: JobAnalysis
  ): Insight[] {
    const insights: Insight[] = [];

    // Communication insights
    insights.push(...this.generateCommunicationInsights(profile, interviewAnalysis));

    // Leadership insights
    insights.push(...this.generateLeadershipInsights(profile, interviewAnalysis));

    // Impact insights
    insights.push(...this.generateImpactInsights(profile, interviewAnalysis));

    // Behavioral insights
    insights.push(...this.generateBehavioralInsights(profile));

    // Pattern insights
    insights.push(...this.generatePatternInsights(profile));

    // Job-specific insights
    insights.push(...this.generateJobSpecificInsights(profile, job));

    // Progress insights
    insights.push(...this.generateProgressInsights(profile));

    return insights;
  }

  /**
   * Generate communication insights
   */
  private static generateCommunicationInsights(profile: CandidateProfile, interviewAnalysis: InterviewAnalysis): Insight[] {
    const insights: Insight[] = [];

    if (interviewAnalysis.clarity < 60) {
      insights.push({
        id: `insight-clarity-${Date.now()}`,
        category: "Communication",
        observation: "Vous utilisez rarement des connecteurs logiques pour structurer vos propos.",
        severity: "warning",
        actionable: true,
        timestamp: new Date(),
      });
    }

    if (interviewAnalysis.clarity >= 80) {
      insights.push({
        id: `insight-clarity-good-${Date.now()}`,
        category: "Communication",
        observation: "Vous structurez vos réponses de manière particulièrement claire et logique.",
        severity: "info",
        actionable: false,
        timestamp: new Date(),
      });
    }

    if (profile.behavior.communicationStyle === "direct" && interviewAnalysis.persuasion < 70) {
      insights.push({
        id: `insight-style-mismatch-${Date.now()}`,
        category: "Communication",
        observation: "Votre style direct pourrait être adouci pour améliorer la persuasion.",
        severity: "warning",
        actionable: true,
        timestamp: new Date(),
      });
    }

    if (profile.behavior.synthesisAbility >= 75) {
      insights.push({
        id: `insight-synthesis-${Date.now()}`,
        category: "Communication",
        observation: "Vous avez une capacité remarquable à synthétiser des informations complexes.",
        severity: "info",
        actionable: false,
        timestamp: new Date(),
      });
    }

    return insights;
  }

  /**
   * Generate leadership insights
   */
  private static generateLeadershipInsights(profile: CandidateProfile, interviewAnalysis: InterviewAnalysis): Insight[] {
    const insights: Insight[] = [];

    if (interviewAnalysis.leadership < 60) {
      insights.push({
        id: `insight-leadership-low-${Date.now()}`,
        category: "Leadership",
        observation: "Vous parlez peu de votre capacité à guider ou inspirer les autres.",
        severity: "warning",
        actionable: true,
        timestamp: new Date(),
      });
    }

    if (profile.behavior.leadershipStyle === "collaborative" && interviewAnalysis.leadership >= 75) {
      insights.push({
        id: `insight-leadership-collab-${Date.now()}`,
        category: "Leadership",
        observation: "Votre style collaboratif est bien perçu et démontre une vraie capacité à fédérer.",
        severity: "info",
        actionable: false,
        timestamp: new Date(),
      });
    }

    if (profile.behavior.leadershipStyle === "authoritative" && interviewAnalysis.persuasion < 65) {
      insights.push({
        id: `insight-leadership-authoritative-${Date.now()}`,
        category: "Leadership",
        observation: "Votre style autoritaire pourrait nuire à votre capacité de persuasion.",
        severity: "warning",
        actionable: true,
        timestamp: new Date(),
      });
    }

    if (interviewAnalysis.leadership >= 80) {
      insights.push({
        id: `insight-leadership-high-${Date.now()}`,
        category: "Leadership",
        observation: "Vous démontrez un leadership naturel qui se manifeste clairement dans vos exemples.",
        severity: "info",
        actionable: false,
        timestamp: new Date(),
      });
    }

    return insights;
  }

  /**
   * Generate impact insights
   */
  private static generateImpactInsights(profile: CandidateProfile, interviewAnalysis: InterviewAnalysis): Insight[] {
    const insights: Insight[] = [];

    if (interviewAnalysis.impact < 60) {
      insights.push({
        id: `insight-impact-low-${Date.now()}`,
        category: "Impact",
        observation: "Vous racontez bien vos expériences mais vous évitez les chiffres concrets.",
        severity: "critical",
        actionable: true,
        timestamp: new Date(),
      });
    }

    if (profile.behavior.businessImpact < 65) {
      insights.push({
        id: `insight-business-impact-${Date.now()}`,
        category: "Impact",
        observation: "Vous êtes davantage orienté processus que résultats business.",
        severity: "warning",
        actionable: true,
        timestamp: new Date(),
      });
    }

    if (interviewAnalysis.impact >= 80) {
      insights.push({
        id: `insight-impact-high-${Date.now()}`,
        category: "Impact",
        observation: "Votre discours est crédible grâce à l'utilisation systématique de données chiffrées.",
        severity: "info",
        actionable: false,
        timestamp: new Date(),
      });
    }

    if (profile.behavior.businessImpact >= 80 && interviewAnalysis.persuasion >= 80) {
      insights.push({
        id: `insight-impact-persuasion-${Date.now()}`,
        category: "Impact",
        observation: "Vous combinez excellentement impact business et capacité de persuasion.",
        severity: "info",
        actionable: false,
        timestamp: new Date(),
      });
    }

    return insights;
  }

  /**
   * Generate behavioral insights
   */
  private static generateBehavioralInsights(profile: CandidateProfile): Insight[] {
    const insights: Insight[] = [];

    if (profile.behavior.confidenceLevel < 60) {
      insights.push({
        id: `insight-confidence-low-${Date.now()}`,
        category: "Behavior",
        observation: "Vous restez prudent dans vos affirmations et préférez nuancer vos propos.",
        severity: "warning",
        actionable: true,
        timestamp: new Date(),
      });
    }

    if (profile.behavior.confidenceLevel >= 80) {
      insights.push({
        id: `insight-confidence-high-${Date.now()}`,
        category: "Behavior",
        observation: "Vous dégagez une assurance naturelle sans paraître arrogant.",
        severity: "info",
        actionable: false,
        timestamp: new Date(),
      });
    }

    if (profile.behavior.stressManagement < 60) {
      insights.push({
        id: `insight-stress-${Date.now()}`,
        category: "Behavior",
        observation: "Vous semblez plus à l'aise dans des situations contrôlées que sous pression.",
        severity: "warning",
        actionable: true,
        timestamp: new Date(),
      });
    }

    if (profile.behavior.starProficiency < 60) {
      insights.push({
        id: `insight-star-${Date.now()}`,
        category: "Behavior",
        observation: "Vous préférez raconter des histoires plutôt que les structurer méthodiquement.",
        severity: "warning",
        actionable: true,
        timestamp: new Date(),
      });
    }

    if (profile.behavior.communicationStyle === "expressive" && profile.behavior.synthesisAbility < 60) {
      insights.push({
        id: `insight-style-synthesis-${Date.now()}`,
        category: "Behavior",
        observation: "Votre style expressif pourrait bénéficier d'une meilleure structuration.",
        severity: "warning",
        actionable: true,
        timestamp: new Date(),
      });
    }

    return insights;
  }

  /**
   * Generate pattern insights from history
   */
  private static generatePatternInsights(profile: CandidateProfile): Insight[] {
    const insights: Insight[] = [];

    // Check for recurring errors
    const activeErrors = profile.history.recurringErrors.filter(e => e.status === "active");
    if (activeErrors.length > 0 && activeErrors[0]) {
      insights.push({
        id: `insight-recurring-${Date.now()}`,
        category: "Pattern",
        observation: `Vous répétez l'erreur suivante depuis ${activeErrors[0].firstOccurrence.toLocaleDateString()} : ${activeErrors[0].pattern}`,
        severity: "critical",
        actionable: true,
        timestamp: new Date(),
      });
    }

    // Check for improvement streak
    if (profile.metrics.currentStreak >= 5) {
      insights.push({
        id: `insight-streak-${Date.now()}`,
        category: "Pattern",
        observation: `Vous êtes sur une série de ${profile.metrics.currentStreak} améliorations consécutives.`,
        severity: "info",
        actionable: false,
        timestamp: new Date(),
      });
    }

    // Check for skill trends
    const decliningSkills = profile.skills.hardSkills.filter(s => s.trend === "declining");
    if (decliningSkills.length > 0) {
      insights.push({
        id: `insight-declining-${Date.now()}`,
        category: "Pattern",
        observation: `Certaines compétences sont en déclin : ${decliningSkills.map(s => s.name).join(", ")}`,
        severity: "warning",
        actionable: true,
        timestamp: new Date(),
      });
    }

    const improvingSkills = profile.skills.hardSkills.filter(s => s.trend === "improving");
    if (improvingSkills.length >= 3) {
      insights.push({
        id: `insight-improving-${Date.now()}`,
        category: "Pattern",
        observation: `Vous progressez sur plusieurs compétences : ${improvingSkills.map(s => s.name).join(", ")}`,
        severity: "info",
        actionable: false,
        timestamp: new Date(),
      });
    }

    return insights;
  }

  /**
   * Generate job-specific insights
   */
  private static generateJobSpecificInsights(profile: CandidateProfile, job: JobAnalysis): Insight[] {
    const insights: Insight[] = [];

    // Check skill match
    const missingSkills = job.requiredSkills.filter(jobSkill => {
      const candidateSkill = profile.skills.hardSkills.find(s => s.name === jobSkill.name);
      return !candidateSkill || candidateSkill.level < jobSkill.level - 20;
    });

    if (missingSkills.length > 0) {
      insights.push({
        id: `insight-skills-${Date.now()}`,
        category: "Job Fit",
        observation: `Il manque des compétences clés pour ce poste : ${missingSkills.map(s => s.name).join(", ")}`,
        severity: "critical",
        actionable: true,
        timestamp: new Date(),
      });
    }

    // Check level match
    const levels = ["junior", "intermediate", "senior", "expert", "executive"];
    const candidateLevelIndex = levels.indexOf(profile.career.currentLevel);
    const jobLevelIndex = levels.indexOf(job.seniority);

    if (candidateLevelIndex < jobLevelIndex - 1) {
      insights.push({
        id: `insight-level-${Date.now()}`,
        category: "Job Fit",
        observation: `Votre niveau actuel (${profile.career.currentLevel}) est inférieur au niveau attendu (${job.seniority}).`,
        severity: "warning",
        actionable: true,
        timestamp: new Date(),
      });
    }

    if (candidateLevelIndex > jobLevelIndex + 1) {
      insights.push({
        id: `insight-overqualified-${Date.now()}`,
        category: "Job Fit",
        observation: `Vous pourriez être surqualifié pour ce poste. Considérez des postes de niveau supérieur.`,
        severity: "info",
        actionable: true,
        timestamp: new Date(),
      });
    }

    // Check culture fit
    if (job.culture.pace === "Fast" && profile.behavior.stressManagement < 65) {
      insights.push({
        id: `insight-culture-pace-${Date.now()}`,
        category: "Culture Fit",
        observation: "Le rythme rapide de cette entreprise pourrait être un défi pour votre style de travail.",
        severity: "warning",
        actionable: true,
        timestamp: new Date(),
      });
    }

    return insights;
  }

  /**
   * Generate progress insights
   */
  private static generateProgressInsights(profile: CandidateProfile): Insight[] {
    const insights: Insight[] = [];

    if (profile.metrics.atsTrend === "up") {
      insights.push({
        id: `insight-ats-up-${Date.now()}`,
        category: "Progress",
        observation: "Votre score ATS est en progression, indiquant une meilleure optimisation de votre CV.",
        severity: "info",
        actionable: false,
        timestamp: new Date(),
      });
    }

    if (profile.metrics.atsTrend === "down") {
      insights.push({
        id: `insight-ats-down-${Date.now()}`,
        category: "Progress",
        observation: "Votre score ATS a diminué. Vérifiez les mots-clés et la structure de votre CV.",
        severity: "warning",
        actionable: true,
        timestamp: new Date(),
      });
    }

    if (profile.metrics.successRate >= 85) {
      insights.push({
        id: `insight-success-${Date.now()}`,
        category: "Progress",
        observation: "Votre taux de réussite élevé démontre une excellente préparation et consistence.",
        severity: "info",
        actionable: false,
        timestamp: new Date(),
      });
    }

    if (profile.metrics.successRate < 60 && profile.metrics.totalSimulations >= 5) {
      insights.push({
        id: `insight-success-low-${Date.now()}`,
        category: "Progress",
        observation: "Après plusieurs simulations, votre taux de réussite reste faible. Changez d'approche.",
        severity: "critical",
        actionable: true,
        timestamp: new Date(),
      });
    }

    if (profile.metrics.totalSimulations >= 10 && profile.metrics.averageScore >= 75) {
      insights.push({
        id: `insight-experienced-${Date.now()}`,
        category: "Progress",
        observation: "Avec plus de 10 simulations et une moyenne élevée, vous avez atteint un niveau de maîtrise solide.",
        severity: "info",
        actionable: false,
        timestamp: new Date(),
      });
    }

    return insights;
  }

  /**
   * Generate quick insights for dashboard display
   */
  static generateQuickInsights(profile: CandidateProfile): string[] {
    const insights: string[] = [];

    if (profile.metrics.currentStreak >= 3) {
      insights.push(`Vous êtes sur une série de ${profile.metrics.currentStreak} améliorations`);
    }

    if (profile.behavior.confidenceLevel >= 80) {
      insights.push("Votre confiance en soi est un atout majeur");
    }

    if (profile.behavior.starProficiency < 60) {
      insights.push("La méthode STAR nécessite encore du travail");
    }

    if (profile.behavior.businessImpact >= 80) {
      insights.push("Votre orientation résultats est excellente");
    }

    const activeErrors = profile.history.recurringErrors.filter(e => e.status === "active");
    if (activeErrors.length > 0) {
      insights.push(`Attention : ${activeErrors.length} erreur(s) récurrente(s) à corriger`);
    }

    return insights.slice(0, 5);
  }

  /**
   * Generate executive summary
   */
  static generateExecutiveSummary(score: number, position: string): { content: string; maxWords: number } {
    const content = score >= 75
      ? `Le candidat démontre une solide expérience en ${position.toLowerCase()} avec une capacité avérée à structurer sa pensée et communiquer avec clarté. Ses exemples sont pertinents et montrent une vraie posture de leader. Quelques points à approfondir : la vision stratégique à long terme et la quantification systématique de l'impact business. Profil recommandé pour second entretien avec validation manager.`
      : score >= 50
      ? `Le candidat présente un profil intéressant pour ${position.toLowerCase()} avec des bases solides en communication et leadership. Les exemples sont pertinents mais manquent parfois de précision chiffrée. La capacité à gérer les situations complexes est démontrée mais pourrait être plus affirmée. Profil à suivre avec approfondissement sur la vision stratégique.`
      : `Le candidat montre des aptitudes pour ${position.toLowerCase()} mais nécessite un renforcement significatif en structuration de la pensée et quantification des résultats. La posture professionnelle est présente mais le leadership manque d'assurance. Profil à retravailler avant présentation en comité de décision.`;

    return {
      content,
      maxWords: 250,
    };
  }

  /**
   * Generate behavioral analysis
   */
  static generateBehavioralAnalysis(score: number, traits: string[], style: string, nuances: string[], observations: string[]): {
    traits: string[];
    style: string;
    nuances: string[];
    observations: string[];
  } {
    return {
      traits,
      style,
      nuances,
      observations,
    };
  }

  /**
   * Generate recruiter private notes
   */
  static generateRecruiterPrivateNotes(score: number): {
    positiveChecks: string[];
    questionMarks: string[];
    stars: string[];
  } {
    const positiveChecks = [
      "✓ Leadership naturel",
      "✓ Très bonne écoute",
      "✓ Capacité de synthèse",
      "✓ Posture professionnelle",
      "✓ Exemples pertinents",
    ].slice(0, Math.floor(score / 20) + 2);

    const questionMarks = [
      "? À challenger sur la vision stratégique",
      "? Manque quelques résultats chiffrés",
      "? Pourrait être plus concis",
      "? À approfondir sur la gestion de crise",
    ].slice(0, Math.max(1, 4 - Math.floor(score / 25)));

    const stars = score >= 75 
      ? ["⭐ Potentiel intéressant", "⭐ À suivre"]
      : score >= 50
      ? ["⭐ Bon potentiel"]
      : ["⭐ En progression"];

    return {
      positiveChecks,
      questionMarks,
      stars,
    };
  }

  /**
   * Generate tipping factors
   */
  static generateTippingFactors(score: number): {
    whatCouldHaveTipped: string[];
    criticalMoments: string[];
  } {
    const whatCouldHaveTipped = [
      "Une réponse plus structurée sur la question stratégique aurait montré une meilleure capacité d'analyse.",
      "Un meilleur exemple chiffré sur la gestion de budget aurait renforcé votre crédibilité opérationnelle.",
      "Une conclusion plus percutante sur votre vision aurait démontré un leadership plus affirmé.",
      "Plus de chiffres sur l'impact de vos décisions auraient convaincu sur votre orientation résultats.",
    ].slice(0, Math.max(1, 4 - Math.floor(score / 25)));

    const criticalMoments = [
      "Le moment où vous avez hésité sur la définition de votre rôle a créé un doute sur votre clarté de vision.",
      "Votre réponse sur l'échec a été bien gérée mais aurait pu être plus transformative.",
      "La question sur la culture d'entreprise a révélé une certaine distance avec les enjeux RH.",
    ];

    return {
      whatCouldHaveTipped,
      criticalMoments,
    };
  }

  /**
   * Generate detected strengths (raw data for UI projection)
   */
  static generateStrengths(score: number): Array<{
    id: string;
    category: "leadership" | "communication" | "conflict" | "synthesis" | "other";
    priority: "low" | "medium" | "high";
    confidence: number;
    impact: "low" | "medium" | "high";
    evidence: string;
  }> {
    const allStrengths = [
      { 
        id: "s-1", 
        category: "leadership" as const, 
        priority: "high" as const,
        confidence: 0.92,
        impact: "high" as const,
        evidence: "Capacité naturelle à guider l'équipe démontrée",
      },
      { 
        id: "s-2", 
        category: "communication" as const, 
        priority: "high" as const,
        confidence: 0.88,
        impact: "high" as const,
        evidence: "Idées claires et bien articulées",
      },
      { 
        id: "s-3", 
        category: "conflict" as const, 
        priority: "high" as const,
        confidence: 0.85,
        impact: "high" as const,
        evidence: "Résolution de situation complexe avec diplomatie",
      },
      { 
        id: "s-4", 
        category: "synthesis" as const, 
        priority: "medium" as const,
        confidence: 0.79,
        impact: "medium" as const,
        evidence: "Capacité de synthèse remarquable",
      },
    ];
    
    return allStrengths.slice(0, Math.floor(score / 25) + 1);
  }
}
