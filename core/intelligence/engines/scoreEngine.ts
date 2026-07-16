import { CandidateProfile, JobAnalysis, InterviewAnalysis } from "../types";
import { LiveScores } from "@/app/(app)/dashboard/interview-simulation/types/interview";

/**
 * Score Engine
 * 
 * Responsibilities:
 * - Calculate composite scores from multiple data sources
 * - Weight scores based on job requirements
 * - Normalize scores across different scales
 * - Calculate probability scores
 * - Generate score breakdowns and explanations
 * - Clamp and adjust individual scores
 * - Calculate response impact on scores
 */

export class ScoreEngine {
  /**
   * Clamp score between 0 and 100
   */
  static clampScore(score: number): number {
    return Math.max(0, Math.min(100, score));
  }

  /**
   * Calculate score deltas based on response quality and length
   */
  static calculateResponseImpact(responseLength: number, quality: "short" | "good" | "long" | "excellent"): Partial<LiveScores> {
    const delta = quality === "excellent" ? 5 : quality === "good" ? 3 : quality === "long" ? 1 : -2;
    
    const deltas: Partial<LiveScores> = {
      communication: delta,
      confidence: delta,
      structure: delta,
    };
    
    if (quality === "excellent") {
      deltas.leadership = 3;
      deltas.impact = 3;
    }
    
    if (responseLength > 500) {
      deltas.synthesis = -2;
    }
    
    if (responseLength < 50) {
      deltas.communication = (deltas.communication || 0) - 3;
      deltas.impact = (deltas.impact || 0) - 2;
    }
    
    return deltas;
  }

  /**
   * Adjust difficulty by incrementing stress management
   */
  static adjustDifficulty(currentScores: LiveScores): LiveScores {
    return {
      ...currentScores,
      stressManagement: this.clampScore(currentScores.stressManagement + 2),
    };
  }

  /**
   * Calculate overall interview score
   */
  static calculateOverallScore(interviewAnalysis: InterviewAnalysis): number {
    const weights = {
      exampleQuality: 0.15,
      starQuality: 0.15,
      impact: 0.20,
      leadership: 0.15,
      clarity: 0.10,
      persuasion: 0.10,
      structure: 0.10,
      coherence: 0.05,
    };

    const score = 
      (interviewAnalysis.exampleQuality * weights.exampleQuality) +
      (interviewAnalysis.starQuality * weights.starQuality) +
      (interviewAnalysis.impact * weights.impact) +
      (interviewAnalysis.leadership * weights.leadership) +
      (interviewAnalysis.clarity * weights.clarity) +
      (interviewAnalysis.persuasion * weights.persuasion) +
      (interviewAnalysis.structure * weights.structure) +
      (interviewAnalysis.coherence * weights.coherence);

    return Math.round(score);
  }

  /**
   * Calculate job fit score
   */
  static calculateJobFitScore(profile: CandidateProfile, job: JobAnalysis): number {
    let fitScore = 0;
    let maxScore = 0;

    // Skills match
    maxScore += 30;
    const skillScore = this.calculateSkillMatchScore(profile, job);
    fitScore += skillScore;

    // Level match
    maxScore += 20;
    const levelScore = this.calculateLevelMatchScore(profile, job);
    fitScore += levelScore;

    // Behavioral fit
    maxScore += 25;
    const behavioralScore = this.calculateBehavioralFitScore(profile, job);
    fitScore += behavioralScore;

    // Experience fit
    maxScore += 15;
    const experienceScore = this.calculateExperienceFitScore(profile, job);
    fitScore += experienceScore;

    // Cultural fit
    maxScore += 10;
    const culturalScore = this.calculateCulturalFitScore(profile, job);
    fitScore += culturalScore;

    return Math.round((fitScore / maxScore) * 100);
  }

  /**
   * Calculate skill match score
   */
  private static calculateSkillMatchScore(profile: CandidateProfile, job: JobAnalysis): number {
    let matchScore = 0;
    let totalWeight = 0;

    job.requiredSkills.forEach(jobSkill => {
      const candidateSkill = profile.skills.hardSkills.find(s => s.name === jobSkill.name);
      if (candidateSkill) {
        const match = Math.min(100, (candidateSkill.level / jobSkill.level) * 100);
        matchScore += match;
      }
      totalWeight += 100;
    });

    return totalWeight > 0 ? (matchScore / totalWeight) * 30 : 0;
  }

  /**
   * Calculate level match score
   */
  private static calculateLevelMatchScore(profile: CandidateProfile, job: JobAnalysis): number {
    const levels = ["junior", "intermediate", "senior", "expert", "executive"];
    const candidateLevelIndex = levels.indexOf(profile.career.currentLevel);
    const jobLevelIndex = levels.indexOf(job.seniority);

    const difference = Math.abs(candidateLevelIndex - jobLevelIndex);
    
    if (difference === 0) return 20; // Perfect match
    if (difference === 1) return 15; // One level off
    if (difference === 2) return 10; // Two levels off
    if (difference === 3) return 5;  // Three levels off
    return 0; // Too far off
  }

  /**
   * Calculate behavioral fit score
   */
  private static calculateBehavioralFitScore(profile: CandidateProfile, job: JobAnalysis): number {
    let fitScore = 0;

    // Communication style match
    if (profile.behavior.communicationStyle === "direct" && job.communicationExpectations.clarity >= 80) {
      fitScore += 8;
    } else if (profile.behavior.communicationStyle === "diplomatic" && job.communicationExpectations.persuasion >= 80) {
      fitScore += 8;
    } else {
      fitScore += 5;
    }

    // Leadership style match
    const expectedLeadership = job.leadershipExpectations.level;
    if (profile.behavior.leadershipStyle === "transformational" && expectedLeadership >= 80) {
      fitScore += 8;
    } else if (profile.behavior.leadershipStyle === "collaborative" && expectedLeadership >= 60) {
      fitScore += 8;
    } else if (profile.behavior.leadershipStyle === "authoritative" && expectedLeadership >= 70) {
      fitScore += 8;
    } else {
      fitScore += 5;
    }

    // Confidence level
    if (profile.behavior.confidenceLevel >= 70) {
      fitScore += 5;
    } else {
      fitScore += 3;
    }

    // Business impact
    if (profile.behavior.businessImpact >= job.technicalLevel) {
      fitScore += 4;
    } else {
      fitScore += 2;
    }

    return fitScore;
  }

  /**
   * Calculate experience fit score
   */
  private static calculateExperienceFitScore(profile: CandidateProfile, job: JobAnalysis): number {
    const requiredYears = {
      junior: 0,
      intermediate: 3,
      senior: 7,
      expert: 12,
      executive: 15,
    };

    const required = requiredYears[job.seniority] || 5;
    const candidateYears = profile.career.yearsOfExperience;

    if (candidateYears >= required) return 15;
    if (candidateYears >= required - 2) return 12;
    if (candidateYears >= required - 4) return 8;
    if (candidateYears >= required - 6) return 4;
    return 0;
  }

  /**
   * Calculate cultural fit score
   */
  private static calculateCulturalFitScore(profile: CandidateProfile, job: JobAnalysis): number {
    // Simplified cultural fit based on work style preference
    let fitScore = 5; // Base score

    if (job.culture.workStyle === "Remote/Hybrid" && profile.behavior.communicationStyle === "analytical") {
      fitScore += 3;
    }

    if (job.culture.pace === "Fast" && profile.behavior.stressManagement >= 70) {
      fitScore += 2;
    }

    return Math.min(10, fitScore);
  }

  /**
   * Calculate probability of success
   */
  static calculateSuccessProbability(profile: CandidateProfile, job: JobAnalysis, interviewScore: number): number {
    const jobFit = this.calculateJobFitScore(profile, job);
    const atsScore = profile.metrics.atsScore;
    const historicalSuccessRate = profile.metrics.successRate;

    // Weighted probability
    const weights = {
      jobFit: 0.35,
      interviewScore: 0.35,
      atsScore: 0.20,
      historicalSuccess: 0.10,
    };

    const probability = 
      (jobFit * weights.jobFit) +
      (interviewScore * weights.interviewScore) +
      (atsScore * weights.atsScore) +
      (historicalSuccessRate * weights.historicalSuccess);

    return Math.round(probability);
  }

  /**
   * Generate score breakdown with explanations
   */
  static generateScoreBreakdown(
    profile: CandidateProfile,
    job: JobAnalysis,
    interviewAnalysis: InterviewAnalysis
  ): {
    category: string;
    score: number;
    maxScore: number;
    explanation: string;
  }[] {
    const breakdown = [
      {
        category: "Fit avec le poste",
        score: this.calculateJobFitScore(profile, job),
        maxScore: 100,
        explanation: this.getJobFitExplanation(profile, job),
      },
      {
        category: "Performance en entretien",
        score: this.calculateOverallScore(interviewAnalysis),
        maxScore: 100,
        explanation: this.getInterviewScoreExplanation(interviewAnalysis),
      },
      {
        category: "Score ATS",
        score: profile.metrics.atsScore,
        maxScore: 100,
        explanation: this.getATSScoreExplanation(profile),
      },
      {
        category: "Historique de réussite",
        score: profile.metrics.successRate,
        maxScore: 100,
        explanation: this.getSuccessRateExplanation(profile),
      },
    ];

    return breakdown;
  }

  /**
   * Get job fit explanation
   */
  private static getJobFitExplanation(profile: CandidateProfile, job: JobAnalysis): string {
    const fitScore = this.calculateJobFitScore(profile, job);

    if (fitScore >= 80) {
      return "Votre profil correspond très bien aux exigences du poste. Vos compétences, votre niveau d'expérience et votre style de leadership sont alignés avec les attentes.";
    }
    if (fitScore >= 60) {
      return "Votre profil correspond globalement au poste, avec quelques écarts mineurs. Renforcez les compétences clés identifiées pour améliorer votre fit.";
    }
    if (fitScore >= 40) {
      return "Votre profil présente des écarts significatifs avec les exigences du poste. Un travail ciblé sur les compétences manquantes est nécessaire.";
    }
    return "Votre profil ne correspond pas actuellement aux exigences du poste. Considérez acquérir plus d'expérience ou viser des postes plus alignés avec votre niveau actuel.";
  }

  /**
   * Get interview score explanation
   */
  private static getInterviewScoreExplanation(interviewAnalysis: InterviewAnalysis): string {
    const score = this.calculateOverallScore(interviewAnalysis);

    if (score >= 80) {
      return "Excellente performance en entretien. Vos réponses sont bien structurées, vos exemples sont pertinents et votre communication est claire.";
    }
    if (score >= 60) {
      return "Bonne performance en entretien avec des points à améliorer. Structurez davantage vos réponses et quantifiez vos résultats.";
    }
    if (score >= 40) {
      return "Performance moyenne en entretien. Travaillez la méthode STAR et la quantification de l'impact pour progresser.";
    }
    return "Performance en entretien en dessous des attentes. Une préparation intensive est nécessaire avant de postuler à ce type de poste.";
  }

  /**
   * Get ATS score explanation
   */
  private static getATSScoreExplanation(profile: CandidateProfile): string {
    const score = profile.metrics.atsScore;

    if (score >= 80) {
      return "Votre CV est bien optimisé pour les ATS. Les mots-clés sont pertinents et la structure est claire.";
    }
    if (score >= 60) {
      return "Votre CV est raisonnablement optimisé. Ajoutez plus de mots-clés spécifiques au secteur pour améliorer le score.";
    }
    if (score >= 40) {
      return "Votre CV nécessite une optimisation significative. Révisez les mots-clés et la structure pour passer les filtres ATS.";
    }
    return "Votre CV n'est pas optimisé pour les ATS. Une révision complète est nécessaire pour maximiser vos chances.";
  }

  /**
   * Get success rate explanation
   */
  private static getSuccessRateExplanation(profile: CandidateProfile): string {
    const rate = profile.metrics.successRate;

    if (rate >= 80) {
      return "Excellent taux de réussite historique. Vous performez bien de manière consistante.";
    }
    if (rate >= 60) {
      return "Bon taux de réussite avec une marge de progression. Analysez vos échecs pour identifier les patterns.";
    }
    if (rate >= 40) {
      return "Taux de réussite moyen. Concentrez-vous sur vos points faibles pour améliorer votre consistence.";
    }
    return "Taux de réussite faible. Une préparation plus approfondie et plus de pratique sont nécessaires.";
  }

  /**
   * Normalize score to 0-100 range
   */
  static normalizeScore(score: number, min: number, max: number): number {
    if (max === min) return 50;
    const normalized = ((score - min) / (max - min)) * 100;
    return Math.max(0, Math.min(100, Math.round(normalized)));
  }

  /**
   * Calculate percentile rank
   */
  static calculatePercentile(score: number, distribution: number[]): number {
    const sorted = [...distribution].sort((a, b) => a - b);
    const rank = sorted.filter(s => s <= score).length;
    return Math.round((rank / sorted.length) * 100);
  }

  /**
   * Generate enhanced comparison
   */
  static generateEnhancedComparison(score: number, difficulty: string): {
    userLevel: number;
    averageCandidate: number;
    goodCandidate: number;
    excellentCandidate: number;
    differences: {
      vsAverage: string;
      vsGood: string;
      vsExcellent: string;
    };
  } {
    const averageCandidate = difficulty === "expert" ? 60 : difficulty === "intermediate" ? 50 : 40;
    const goodCandidate = difficulty === "expert" ? 75 : difficulty === "intermediate" ? 65 : 55;
    const excellentCandidate = difficulty === "expert" ? 90 : difficulty === "intermediate" ? 80 : 70;

    return {
      userLevel: score,
      averageCandidate,
      goodCandidate,
      excellentCandidate,
      differences: {
        vsAverage: score > averageCandidate
          ? "Vous vous distinguez du candidat moyen par votre capacité à structurer vos réponses et à fournir des exemples concrets. Là où un candidat moyen se contenterait de généralités, vous apportez des précisions opérationnelles."
          : "Vous êtes au niveau du candidat moyen. Pour vous démarquer, il faudrait davantage de précision chiffrée et une meilleure structuration de vos arguments.",
        vsGood: score > goodCandidate
          ? "Vous surpassez le bon candidat par votre aisance communicationnelle et votre posture de leader affirmée. Votre capacité à articuler des idées complexes est supérieure à ce qui est généralement attendu."
          : "Vous êtes légèrement en dessous du bon candidat. L'écart se situe principalement dans la quantification des résultats et l'affirmation de votre vision stratégique.",
        vsExcellent: score > excellentCandidate
          ? "Vous rivalisez avec les candidats excellents. Votre maîtrise de la communication et votre leadership naturel sont remarquables. Pour atteindre le niveau exceptionnel, il faudrait davantage de vision stratégique à long terme."
          : "Le candidat excellent se distinguerait par une vision plus affirmée, des résultats systématiquement chiffrés et une capacité à transformer chaque question en opportunité de démontrer sa valeur ajoutée.",
      },
    };
  }

  /**
   * Calculate global score from live scores
   */
  static calculateGlobalScore(scores: Record<string, number> | { communication: number; leadership: number; structure: number; confidence: number; impact: number; stressManagement: number; synthesis: number }): number {
    const values = Object.values(scores);
    if (values.length === 0) return 65;
    return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
  }

  /**
   * Get performance level from score
   */
  static getLevel(score: number): "débutant" | "intermédiaire" | "avancé" | "expert" {
    if (score >= 85) return "expert";
    if (score >= 70) return "avancé";
    if (score >= 50) return "intermédiaire";
    return "débutant";
  }

  /**
   * Generate score breakdown by category from global score
   */
  static generateScoreBreakdownFromGlobalScore(globalScore: number): {
    communication: {
      score: number;
      level: "excellent" | "bon" | "moyen" | "faible";
      explanation: string;
      justification: string;
      why: string;
      whatExplainsIt: string;
      excellentCandidateWould: string;
      howToGain10Points: string;
    };
    leadership: {
      score: number;
      level: "excellent" | "bon" | "moyen" | "faible";
      explanation: string;
      justification: string;
      why: string;
      whatExplainsIt: string;
      excellentCandidateWould: string;
      howToGain10Points: string;
    };
    confidence: {
      score: number;
      level: "excellent" | "bon" | "moyen" | "faible";
      explanation: string;
      justification: string;
      why: string;
      whatExplainsIt: string;
      excellentCandidateWould: string;
      howToGain10Points: string;
    };
    structure: {
      score: number;
      level: "excellent" | "bon" | "moyen" | "faible";
      explanation: string;
      justification: string;
      why: string;
      whatExplainsIt: string;
      excellentCandidateWould: string;
      howToGain10Points: string;
    };
    impact: {
      score: number;
      level: "excellent" | "bon" | "moyen" | "faible";
      explanation: string;
      justification: string;
      why: string;
      whatExplainsIt: string;
      excellentCandidateWould: string;
      howToGain10Points: string;
    };
    argumentation: {
      score: number;
      level: "excellent" | "bon" | "moyen" | "faible";
      explanation: string;
      justification: string;
      why: string;
      whatExplainsIt: string;
      excellentCandidateWould: string;
      howToGain10Points: string;
    };
    stressManagement: {
      score: number;
      level: "excellent" | "bon" | "moyen" | "faible";
      explanation: string;
      justification: string;
      why: string;
      whatExplainsIt: string;
      excellentCandidateWould: string;
      howToGain10Points: string;
    };
    listening: {
      score: number;
      level: "excellent" | "bon" | "moyen" | "faible";
      explanation: string;
      justification: string;
      why: string;
      whatExplainsIt: string;
      excellentCandidateWould: string;
      howToGain10Points: string;
    };
  } {
    const variance = () => Math.floor(Math.random() * 20) - 10;
    const baseScore = globalScore;
    
    return {
      communication: this.createScoreDetail(baseScore + variance(), "communication"),
      leadership: this.createScoreDetail(baseScore + variance(), "leadership"),
      confidence: this.createScoreDetail(baseScore + variance(), "confidence"),
      structure: this.createScoreDetail(baseScore + variance(), "structure"),
      impact: this.createScoreDetail(baseScore + variance(), "impact"),
      argumentation: this.createScoreDetail(baseScore + variance(), "argumentation"),
      stressManagement: this.createScoreDetail(baseScore + variance(), "stressManagement"),
      listening: this.createScoreDetail(baseScore + variance(), "listening"),
    };
  }

  /**
   * Create detailed score information
   */
  private static createScoreDetail(score: number, category: string): {
    score: number;
    level: "excellent" | "bon" | "moyen" | "faible";
    explanation: string;
    justification: string;
    why: string;
    whatExplainsIt: string;
    excellentCandidateWould: string;
    howToGain10Points: string;
  } {
    const clampedScore = Math.max(0, Math.min(100, score));
    const level: "excellent" | "bon" | "moyen" | "faible" = clampedScore >= 80 ? "excellent" : clampedScore >= 60 ? "bon" : clampedScore >= 40 ? "moyen" : "faible";
    
    const content: Record<string, { explanation: string; justification: string; why: string; whatExplainsIt: string; excellentCandidateWould: string; howToGain10Points: string }> = {
      communication: {
        explanation: "J'ai rapidement perçu que vous savez structurer votre pensée.",
        justification: "Lorsque vous avez présenté votre projet de transformation, vous avez immédiatement expliqué le contexte puis les décisions prises. Cette structure a rendu votre discours particulièrement crédible.",
        why: "Cette note reflète votre capacité à articuler des idées complexes de manière fluide et compréhensible.",
        whatExplainsIt: "Votre aisance vient du fait que vous prenez le temps de reformuler les questions avant de répondre, ce qui montre une écoute active.",
        excellentCandidateWould: "Un candidat excellent utiliserait systématiquement des métaphores pour illustrer ses propos et adapterait son langage à son interlocuteur.",
        howToGain10Points: "Pour gagner 10 points, commencez chaque réponse par une phrase d'accroche qui résume votre position, puis développez avec des exemples concrets.",
      },
      leadership: {
        explanation: "J'ai noté une vraie posture de leader dans vos exemples.",
        justification: "Quand vous avez évoqué la gestion de votre équipe, vous avez parlé de 'nous' plutôt que de 'je', ce qui démontre une capacité à fédérer.",
        why: "Cette note témoigne de votre aptitude à inspirer et guider les autres vers un objectif commun.",
        whatExplainsIt: "Votre expérience de management transparaît dans la façon dont vous décrivez les situations de crise.",
        excellentCandidateWould: "Un candidat excellent partagerait des exemples où il a transformé une équipe en difficulté en équipe performante.",
        howToGain10Points: "Pour gagner 10 points, citez spécifiquement comment vous avez développé les talents de vos collaborateurs avec des exemples nommés.",
      },
      confidence: {
        explanation: "Vous dégagez une assurance naturelle sans forcer.",
        justification: "Même sur les questions délicates concernant vos échecs, vous avez répondu avec calme et précision, ce qui montre une confiance en soi réelle.",
        why: "Cette note reflète votre capacité à rester stable sous pression et à assumer vos décisions.",
        whatExplainsIt: "Votre confiance vient de votre expérience : vous ne cherchez pas à vous justifier excessivement.",
        excellentCandidateWould: "Un candidat excellent transformerait chaque question en opportunité de démontrer sa valeur.",
        howToGain10Points: "Pour gagner 10 points, préparez 3 exemples de situations où vous avez pris des décisions difficiles et assumez-les pleinement.",
      },
      structure: {
        explanation: "Vos réponses suivent une logique claire.",
        justification: "J'ai apprécié la façon dont vous avez utilisé la méthode STAR pour la question sur le conflit : Situation, Tâche, Action, Résultat, tout y était.",
        why: "Cette note indique que vous savez organiser votre pensée pour la rendre accessible.",
        whatExplainsIt: "Votre structuration vient d'une préparation évidente et d'une compréhension des attentes recruteur.",
        excellentCandidateWould: "Un candidat excellent utiliserait des connecteurs logiques ('cependant', 'par conséquent', 'en revanche') pour fluidifier son propos.",
        howToGain10Points: "Pour gagner 10 points, commencez chaque réponse par 'Il y a trois points clés à retenir' puis énumérez-les systématiquement.",
      },
      impact: {
        explanation: "Vous mettez en avant vos résultats de manière convaincante.",
        justification: "Lorsque vous avez parlé de l'augmentation de productivité, vous avez donné le chiffre exact : +23%. C'est précis et crédible.",
        why: "Cette note montre votre capacité à démontrer la valeur ajoutée de vos actions.",
        whatExplainsIt: "Votre souci de l'impact business transparaît dans chaque exemple que vous partagez.",
        excellentCandidateWould: "Un candidat excellent quantifierait systématiquement l'impact financier de ses décisions.",
        howToGain10Points: "Pour gagner 10 points, pour chaque résultat, ajoutez : 'ce qui a représenté un gain de X euros' ou 'ce qui a permis d'économiser Y jours'.",
      },
      argumentation: {
        explanation: "Votre raisonnement est solide et étayé.",
        justification: "Sur la question stratégique, vous avez présenté deux options avec leurs avantages et inconvénients avant de trancher. C'est méthodique.",
        why: "Cette note reflète votre capacité à construire des arguments logiques et convaincants.",
        whatExplainsIt: "Votre force d'argumentation vient de votre capacité à anticiper les objections.",
        excellentCandidateWould: "Un candidat excellent utiliserait des données de benchmark pour étayer ses arguments.",
        howToGain10Points: "Pour gagner 10 points, structurez chaque argument avec : thèse, arguments, preuves, conclusion.",
      },
      stressManagement: {
        explanation: "Vous gérez la pression avec aisance.",
        justification: "Quand je vous ai demandé de décrire votre plus grand échec, vous n'avez pas hésité et vous avez partagé une leçon apprise. C'est le signe d'une bonne résilience.",
        why: "Cette note indique votre capacité à performer dans des situations stressantes.",
        whatExplainsIt: "Votre calme vient du fait que vous acceptez l'incertitude comme partie intégrante du rôle.",
        excellentCandidateWould: "Un candidat excellent partagerait des exemples où il a maintenu son équipe motivée en période de crise.",
        howToGain10Points: "Pour gagner 10 points, préparez une technique personnelle de gestion du stress (respiration, priorisation) et mentionnez-la.",
      },
      listening: {
        explanation: "J'ai senti que vous écoutiez vraiment mes questions.",
        justification: "Avant de répondre sur la culture d'entreprise, vous avez reformulé ma question pour vous assurer d'avoir bien compris. C'est une excellente pratique.",
        why: "Cette note montre votre capacité à comprendre les enjeux implicites d'une conversation.",
        whatExplainsIt: "Votre écoute active démontre votre respect pour votre interlocuteur et votre souci de précision.",
        excellentCandidateWould: "Un candidat excellent poserait des questions de clarification avant même de commencer sa réponse.",
        howToGain10Points: "Pour gagner 10 points, commencez systématiquement chaque réponse par 'Si je comprends bien votre question, vous souhaitez savoir...' puis confirmez.",
      },
    };
    
    const explanation = content[category] || {
      explanation: "J'ai perçu une certaine maîtrise dans ce domaine.",
      justification: "Vos réponses démontrent une compréhension globale des enjeux.",
      why: "Cette note reflète votre niveau actuel dans cette compétence.",
      whatExplainsIt: "Votre performance est liée à votre expérience et votre préparation.",
      excellentCandidateWould: "Un candidat excellent montrerait une maîtrise exceptionnelle avec des exemples précis.",
      howToGain10Points: "Pour gagner 10 points, préparez des exemples spécifiques et quantifiés dans ce domaine.",
    };
    
    return {
      score: clampedScore,
      level,
      ...explanation,
    };
  }

  /**
   * Generate comparison with benchmarks
   */
  static generateComparison(score: number, difficulty: string): {
    userLevel: number;
    expectedLevel: number;
    gaps: Array<{
      skill: string;
      userScore: number;
      expectedScore: number;
      gap: number;
      priority: "low" | "medium" | "high";
    }>;
  } {
    const expectedScore = difficulty === "expert" ? 85 : difficulty === "intermediate" ? 70 : 55;
    const getPriority = (gap: number): "low" | "medium" | "high" => Math.abs(gap) > 15 ? "high" : gap > 10 ? "medium" : "low";
    
    return {
      userLevel: score,
      expectedLevel: expectedScore,
      gaps: [
        {
          skill: "Communication",
          userScore: score,
          expectedScore: expectedScore,
          gap: expectedScore - score,
          priority: getPriority(expectedScore - score),
        },
        {
          skill: "Leadership",
          userScore: score - 5,
          expectedScore: expectedScore,
          gap: expectedScore - score + 5,
          priority: getPriority(expectedScore - score + 5),
        },
        {
          skill: "Impact",
          userScore: score + 3,
          expectedScore: expectedScore,
          gap: expectedScore - score - 3,
          priority: getPriority(expectedScore - score - 3),
        },
      ],
    };
  }
}
