// @ts-nocheck
import { Decision, CandidateProfile, JobAnalysis, InterviewAnalysis } from "../types";

/**
 * Decision Engine
 * 
 * Responsibilities:
 * - Generate recruiter-style decisions
 * - Provide reasoning like a real recruiter would
 * - Avoid generic responses
 * - Create hundreds of variants for natural language
 * - Consider context, profile, and performance
 */

export class DecisionEngine {
  /**
   * Generate a recruiter decision based on profile, job, and interview performance
   */
  static generateDecision(
    profile: CandidateProfile,
    job: JobAnalysis,
    interviewAnalysis: InterviewAnalysis
  ): Decision {
    const overallScore = this.calculateOverallDecisionScore(profile, job, interviewAnalysis);
    
    if (overallScore >= 85) {
      return this.generatePositiveDecision(profile, job, interviewAnalysis);
    }
    
    if (overallScore >= 65) {
      return this.generateHesitantDecision(profile, job, interviewAnalysis);
    }
    
    return this.generateNegativeDecision(profile, job, interviewAnalysis);
  }

  /**
   * Calculate overall decision score
   */
  private static calculateOverallDecisionScore(
    profile: CandidateProfile,
    job: JobAnalysis,
    interviewAnalysis: InterviewAnalysis
  ): number {
    const weights = {
      jobFit: 0.30,
      interviewPerformance: 0.35,
      atsScore: 0.15,
      experience: 0.10,
      culturalFit: 0.10,
    };

    const jobFit = this.calculateJobFitScore(profile, job);
    const interviewPerformance = this.calculateInterviewScore(interviewAnalysis);
    const atsScore = profile.metrics.atsScore;
    const experience = this.calculateExperienceScore(profile, job);
    const culturalFit = this.calculateCulturalFitScore(profile, job);

    return (
      (jobFit * weights.jobFit) +
      (interviewPerformance * weights.interviewPerformance) +
      (atsScore * weights.atsScore) +
      (experience * weights.experience) +
      (culturalFit * weights.culturalFit)
    );
  }

  /**
   * Calculate job fit score
   */
  private static calculateJobFitScore(profile: CandidateProfile, job: JobAnalysis): number {
    const levels = ["junior", "intermediate", "senior", "expert", "executive"];
    const candidateIndex = levels.indexOf(profile.career.currentLevel);
    const jobIndex = levels.indexOf(job.seniority);
    
    let score = 50;
    if (candidateIndex === jobIndex) score += 30;
    else if (Math.abs(candidateIndex - jobIndex) === 1) score += 15;
    else if (Math.abs(candidateIndex - jobIndex) === 2) score += 5;
    
    // Skill match
    const matchingSkills = job.requiredSkills.filter(js => {
      const cs = profile.skills.hardSkills.find(s => s.name === js.name);
      return cs && cs.level >= js.level - 10;
    });
    score += (matchingSkills.length / Math.max(1, job.requiredSkills.length)) * 20;
    
    return Math.min(100, score);
  }

  /**
   * Calculate interview score
   */
  private static calculateInterviewScore(interviewAnalysis: InterviewAnalysis): number {
    return (
      (interviewAnalysis.exampleQuality * 0.2) +
      (interviewAnalysis.starQuality * 0.2) +
      (interviewAnalysis.impact * 0.25) +
      (interviewAnalysis.leadership * 0.15) +
      (interviewAnalysis.clarity * 0.1) +
      (interviewAnalysis.persuasion * 0.1)
    );
  }

  /**
   * Calculate experience score
   */
  private static calculateExperienceScore(profile: CandidateProfile, job: JobAnalysis): number {
    const requiredYears = {
      junior: 0,
      intermediate: 3,
      senior: 7,
      expert: 12,
      executive: 15,
    };
    
    const required = requiredYears[job.seniority] || 5;
    const candidate = profile.career.yearsOfExperience;
    
    if (candidate >= required) return 100;
    if (candidate >= required - 2) return 75;
    if (candidate >= required - 4) return 50;
    if (candidate >= required - 6) return 25;
    return 0;
  }

  /**
   * Calculate cultural fit score
   */
  private static calculateCulturalFitScore(profile: CandidateProfile, job: JobAnalysis): number {
    let score = 50;
    
    if (job.culture.pace === "Fast" && profile.behavior.stressManagement >= 70) score += 25;
    if (job.culture.collaboration.includes("Team") && profile.behavior.leadershipStyle === "collaborative") score += 25;
    
    return Math.min(100, score);
  }

  /**
   * Generate positive decision
   */
  private static generatePositiveDecision(
    profile: CandidateProfile,
    job: JobAnalysis,
    interviewAnalysis: InterviewAnalysis
  ): Decision {
    const variants = [
      {
        action: "Je convoquerais ce candidat pour un second entretien",
        probability: 90,
        reasoning: this.generatePositiveReasoning(profile, job, interviewAnalysis),
      },
      {
        action: "Je recommande vivement de poursuivre le processus",
        probability: 85,
        reasoning: this.generatePositiveReasoning(profile, job, interviewAnalysis),
      },
      {
        action: "Ce candidat mérite d'être présenté au comité de décision",
        probability: 88,
        reasoning: this.generatePositiveReasoning(profile, job, interviewAnalysis),
      },
      {
        action: "Je validerais ce profil sans hésitation",
        probability: 92,
        reasoning: this.generatePositiveReasoning(profile, job, interviewAnalysis),
      },
    ];

    const selected = variants[Math.floor(Math.random() * variants.length)];
    
    return {
      action: selected?.action || "Je recommande vivement de poursuivre avec ce candidat",
      probability: selected?.probability || 85,
      reasoning: selected?.reasoning || "Le candidat correspond aux attentes du poste.",
      conditions: [
        "Validation du manager direct sur les aspects opérationnels",
        "Vérification des références",
        "Confirmation de la disponibilité",
      ],
    };
  }

  /**
   * Generate positive reasoning
   */
  private static generatePositiveReasoning(
    profile: CandidateProfile,
    job: JobAnalysis,
    _interviewAnalysis: InterviewAnalysis
  ): string {
    const reasons = [
      `Le candidat démontre une maîtrise exceptionnelle des compétences requises pour ${job.position}. Ses exemples sont structurés, quantifiés et montrent une vraie capacité à impacter le business.`,
      `J'ai été particulièrement impressionné par la clarté de sa communication et sa capacité à structurer ses pensées. Son niveau de leadership correspond parfaitement aux attentes de ce poste.`,
      `La combinaison de son expérience (${profile.career.yearsOfExperience} ans) et de sa performance en entretien en fait un candidat de premier plan pour ce rôle.`,
      `Ses réponses démontrent non seulement une compétence technique mais aussi une maturité et une vision stratégique qui sont exactement ce que nous recherchons.`,
      `Le candidat a su transformer chaque question en opportunité de démontrer sa valeur ajoutée. Son orientation résultats est remarquable.`,
    ];

    const reason = reasons[Math.floor(Math.random() * reasons.length)];
    return reason || "Le candidat correspond aux attentes du poste.";
  }

  /**
   * Generate hesitant decision
   */
  private static generateHesitantDecision(
    profile: CandidateProfile,
    job: JobAnalysis,
    interviewAnalysis: InterviewAnalysis
  ): Decision {
    const variants = [
      {
        action: "Je souhaiterais un second entretien pour approfondir certains points",
        probability: 60,
        reasoning: this.generateHesitantReasoning(profile, job, interviewAnalysis),
      },
      {
        action: "Je suis partagé : certains aspects sont excellents, d'autres nécessitent clarification",
        probability: 55,
        reasoning: this.generateHesitantReasoning(profile, job, interviewAnalysis),
      },
      {
        action: "Je recommande de poursuivre mais avec des réserves",
        probability: 58,
        reasoning: this.generateHesitantReasoning(profile, job, interviewAnalysis),
      },
      {
        action: "Le profil est intéressant mais je souhaiterais vérifier la vision stratégique",
        probability: 62,
        reasoning: this.generateHesitantReasoning(profile, job, interviewAnalysis),
      },
    ];

    const selected = variants[Math.floor(Math.random() * variants.length)];
    
    return {
      action: selected?.action || "Le profil est intéressant mais nécessite un second entretien",
      probability: selected?.probability || 65,
      reasoning: selected?.reasoning || "Le candidat présente des atouts mais des zones d'ombre subsistent.",
      conditions: [
        "Second entretien avec focus sur les zones d'ombre",
        "Validation des compétences techniques spécifiques",
        "Vérification de l'adéquation culturelle",
      ],
    };
  }

  /**
   * Generate hesitant reasoning
   */
  private static generateHesitantReasoning(
    profile: CandidateProfile,
    job: JobAnalysis,
    interviewAnalysis: InterviewAnalysis
  ): string {
    const reasons = [
      `Le candidat présente des atouts solides, notamment en ${interviewAnalysis.clarity >= 70 ? 'communication' : 'leadership'}, mais je souhaiterais approfondir sa vision stratégique à long terme.`,
      `J'ai apprécié la qualité de ses exemples, mais l'impact business pourrait être davantage quantifié. Un second entretien permettrait de clarifier ce point.`,
      `Le profil correspond globalement aux attentes, mais j'aimerais vérifier sa capacité à gérer des situations de crise complexes.`,
      `Ses compétences techniques sont évidentes, mais je reste réservé sur son aptitude à influencer et convaincre à un niveau ${job.seniority}.`,
      `Le candidat démontre une bonne maîtrise opérationnelle mais je souhaiterais valider son potentiel de transformation et d'innovation.`,
    ];

    const reason = reasons[Math.floor(Math.random() * reasons.length)];
    return reason || "Le candidat présente des atouts mais des zones d'ombre subsistent.";
  }

  /**
   * Generate negative decision
   */
  private static generateNegativeDecision(
    profile: CandidateProfile,
    job: JobAnalysis,
    interviewAnalysis: InterviewAnalysis
  ): Decision {
    const variants = [
      {
        action: "Je ne recommande pas de poursuivre ce candidat",
        probability: 25,
        reasoning: this.generateNegativeReasoning(profile, job, interviewAnalysis),
      },
      {
        action: "Ce profil ne correspond pas aux exigences du poste",
        probability: 20,
        reasoning: this.generateNegativeReasoning(profile, job, interviewAnalysis),
      },
      {
        action: "Je suggère de chercher des candidats avec plus d'expérience",
        probability: 30,
        reasoning: this.generateNegativeReasoning(profile, job, interviewAnalysis),
      },
      {
        action: "Le gap entre le niveau attendu et le niveau démontré est trop important",
        probability: 22,
        reasoning: this.generateNegativeReasoning(profile, job, interviewAnalysis),
      },
    ];

    const selected = variants[Math.floor(Math.random() * variants.length)];
    
    return {
      action: selected?.action || "Je ne recommande pas de poursuivre ce candidat",
      probability: selected?.probability || 25,
      reasoning: selected?.reasoning || "Le candidat ne correspond pas aux exigences du poste.",
      conditions: [],
    };
  }

  /**
   * Generate negative reasoning
   */
  private static generateNegativeReasoning(
    profile: CandidateProfile,
    job: JobAnalysis,
    _interviewAnalysis: InterviewAnalysis
  ): string {
    const reasons = [
      `Malgré certaines qualités, le candidat ne démontre pas le niveau de leadership requis pour un poste de ${job.seniority}. Ses exemples manquent de profondeur stratégique.`,
      `L'écart entre les compétences techniques et les soft skills est trop important. Pour ce rôle, nous avons besoin d'un profil plus équilibré.`,
      `Les réponses manquent de structure et d'impact business quantifié. Le candidat ne semble pas prêt pour le niveau d'exigence de ce poste.`,
      `L'expérience du candidat (${profile.career.yearsOfExperience} ans) est insuffisante pour les responsabilités associées à ce poste de ${job.seniority}.`,
      `Le candidat ne démontre pas la capacité de persuasion et d'influence attendue à ce niveau. Son style de communication est trop ${profile.behavior.communicationStyle}.`,
    ];

    const reason = reasons[Math.floor(Math.random() * reasons.length)];
    return reason || "Le candidat ne correspond pas aux exigences du poste.";
  }

  /**
   * Generate specific decision for second interview
   */
  static generateSecondInterviewDecision(
    profile: CandidateProfile,
    job: JobAnalysis,
    interviewAnalysis: InterviewAnalysis
  ): Decision {
    const score = this.calculateOverallDecisionScore(profile, job, interviewAnalysis);
    
    if (score >= 75) {
      return {
        action: "Je conviendrais ce candidat à un entretien avec le futur manager direct",
        probability: 85,
        reasoning: "Le candidat a démontré les compétences de base requises. L'entretien suivant devrait se concentrer sur les aspects opérationnels et la capacité à s'intégrer à l'équipe existante.",
        conditions: [
          "Focus sur les compétences techniques spécifiques",
          "Validation de la capacité à travailler avec l'équipe actuelle",
          "Discussion sur les objectifs à court terme",
        ],
      };
    }

    return {
      action: "Je demanderais un entretien technique supplémentaire avant de décider",
      probability: 50,
      reasoning: "Certains aspects techniques nécessitent d'être approfondis avant de pouvoir prendre une décision définitive.",
      conditions: [
        "Test technique ciblé",
        "Validation des compétences spécifiques au poste",
        "Évaluation de la capacité d'apprentissage",
      ],
    };
  }

  /**
   * Generate HR recommendation decision
   */
  static generateHRRecommendation(
    profile: CandidateProfile,
    job: JobAnalysis,
    interviewAnalysis: InterviewAnalysis
  ): Decision {
    const score = this.calculateOverallDecisionScore(profile, job, interviewAnalysis);
    
    if (score >= 80) {
      return {
        action: "Je recommande vivement ce candidat au comité de décision",
        probability: 90,
        reasoning: "Le candidat coche toutes les cases : compétences, expérience, culture fit et potentiel. C'est un profil rare qu'il ne faut pas laisser échapper.",
        conditions: [
          "Présentation rapide au comité",
          "Préparation de l'offre compétitive",
          "Plan d'intégration anticipé",
        ],
      };
    }

    if (score >= 60) {
      return {
        action: "Je recommande ce candidat avec quelques réserves à discuter",
        probability: 65,
        reasoning: "Le candidat présente un bon potentiel mais certains points nécessitent d'être validés par le manager direct avant de finaliser.",
        conditions: [
          "Discussion avec le manager sur les points de réserve",
          "Vérification des références",
          "Éventuel entretien technique supplémentaire",
        ],
      };
    }

    return {
      action: "Je ne recommande pas ce candidat pour le poste",
      probability: 30,
      reasoning: "Le profil ne correspond pas suffisamment aux exigences du poste pour justifier une recommendation positive.",
      conditions: [],
    };
  }

  /**
   * Generate manager validation decision
   */
  static generateManagerValidation(
    profile: CandidateProfile,
    job: JobAnalysis,
    interviewAnalysis: InterviewAnalysis
  ): Decision {
    const leadershipScore = interviewAnalysis.leadership;
    const impactScore = interviewAnalysis.impact;

    if (leadershipScore >= 75 && impactScore >= 75) {
      return {
        action: "Je validerais ce candidat pour rejoindre mon équipe",
        probability: 88,
        reasoning: "Le candidat démontre le leadership et l'orientation résultats nécessaires pour réussir dans ce rôle. Je suis confiant dans sa capacité à délivrer.",
        conditions: [
          "Période d'essai standard",
          "Plan d'onboarding structuré",
          "Mentoring pendant les 3 premiers mois",
        ],
      };
    }

    if (leadershipScore >= 60 && impactScore >= 60) {
      return {
        action: "Je validerais ce candidat avec un plan de support renforcé",
        probability: 70,
        reasoning: "Le candidat a le potentiel mais bénéficierait d'un accompagnement structuré pour atteindre le niveau attendu.",
        conditions: [
          "Programme de mentorat dédié",
          "Objectifs clairs pour les 90 premiers jours",
          "Suivi hebdomadaire pendant le premier trimestre",
        ],
      };
    }

    return {
      action: "Je ne validerais pas ce candidat pour mon équipe",
      probability: 35,
      reasoning: "Le niveau de leadership et d'impact démontré est insuffisant pour les responsabilités de ce poste.",
      conditions: [],
    };
  }

  /**
   * Generate director validation decision
   */
  static generateDirectorValidation(
    profile: CandidateProfile,
    job: JobAnalysis,
    interviewAnalysis: InterviewAnalysis
  ): Decision {
    const strategicScore = interviewAnalysis.persuasion + interviewAnalysis.impact;
    const leadershipScore = interviewAnalysis.leadership;

    if (strategicScore >= 150 && leadershipScore >= 80) {
      return {
        action: "Je validerais ce candidat pour un poste de direction",
        probability: 92,
        reasoning: "Le candidat démontre la vision stratégique, la capacité d'influence et le leadership requis pour un rôle de direction. C'est un profil de haut potentiel.",
        conditions: [
          "Validation du comité exécutif",
          "Plan de succession éventuel",
          "Alignement sur la stratégie à 3 ans",
        ],
      };
    }

    if (strategicScore >= 120 && leadershipScore >= 70) {
      return {
        action: "Je validerais ce candidat avec un plan de développement stratégique",
        probability: 75,
        reasoning: "Le candidat a les bases mais nécessite de développer sa vision stratégique pour pleinement réussir à ce niveau.",
        conditions: [
          "Coaching exécutif",
          "Formation en stratégie d'entreprise",
          "Participation aux comités de direction",
        ],
      };
    }

    return {
      action: "Je ne validerais pas ce candidat pour un poste de direction",
      probability: 25,
      reasoning: "Le niveau de vision stratégique et d'influence démontré est insuffisant pour un rôle de direction.",
      conditions: [],
    };
  }

  /**
   * Generate recruiter vision
   */
  static generateRecruiterVision(score: number): {
    wouldContinue: string[];
    wouldHaveReservations: string[];
    overallDecision: "poursuivre" | "hésitant" | "ne pas poursuivre";
    summary: string;
  } {
    const wouldContinue = [
      "Votre expérience est solide et pertinente.",
      "Vos compétences techniques sont au niveau attendu.",
      "Votre attitude professionnelle est exemplaire.",
      "Vous avez un potentiel d'évolution intéressant.",
    ].slice(0, Math.floor(score / 25) + 1);
    
    const wouldHaveReservations = [
      "Je souhaiterais en savoir plus sur votre expérience en gestion d'équipe.",
      "Certaines compétences soft skills mériteraient d'être développées.",
      "Votre connaissance de notre secteur pourrait être plus approfondie.",
    ].slice(0, Math.max(0, 3 - Math.floor(score / 30)));
    
    const overallDecision: "poursuivre" | "hésitant" | "ne pas poursuivre" = score >= 75 ? "poursuivre" : score >= 50 ? "hésitant" : "ne pas poursuivre";
    
    return {
      wouldContinue,
      wouldHaveReservations,
      overallDecision,
      summary: score >= 75 
        ? "Votre profil correspond bien à nos attentes. Je serais ravi de vous rencontrer pour un deuxième entretien."
        : score >= 50
        ? "Votre profil est intéressant mais nécessite quelques ajustements. Je vous propose de continuer les échanges."
        : "Votre profil mérite d'être retravaillé avant de postuler à ce type de poste.",
    };
  }

  /**
   * Generate decision estimation
   */
  static generateDecisionEstimation(score: number): {
    secondInterviewProbability: number;
    hrRecommendationProbability: number;
    managerValidationProbability: number;
    directorValidationProbability: number;
    explanation: string;
  } {
    const baseProbability = score;
    
    return {
      secondInterviewProbability: Math.min(95, baseProbability + 15),
      hrRecommendationProbability: Math.min(90, baseProbability + 10),
      managerValidationProbability: Math.min(85, baseProbability + 5),
      directorValidationProbability: Math.min(80, baseProbability),
      explanation: score >= 75
        ? "Votre profil présente un fort potentiel. Je recommande vivement de vous convier à un second entretien avec le futur manager direct pour valider les aspects opérationnels. La décision finale dépendra de votre capacité à démontrer une vision stratégique plus affirmée."
        : score >= 50
        ? "Votre profil est intéressant mais présente quelques zones d'ombre. Je suggère de poursuivre les échanges pour approfondir votre expérience en gestion d'équipe. La validation finale nécessitera des exemples plus concrets d'impact business."
        : "Votre profil mérite d'être retravaillé avant de pouvoir être présenté en comité de décision. Je recommande de consolider vos bases en entretien comportemental avant de postuler à ce type de poste.",
    };
  }
}
