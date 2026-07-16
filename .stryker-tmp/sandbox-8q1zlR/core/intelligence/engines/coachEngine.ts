// @ts-nocheck
import { CoachPlan, CandidateProfile, JobAnalysis, InterviewAnalysis, DailyPlan, WeeklyPlan, MonthlyPlan } from "../types";

/**
 * Coach Engine
 * 
 * Responsibilities:
 * - Generate personalized coaching plans (7 days, 30 days, 90 days)
 * - Create daily, weekly, and monthly objectives
 * - Design exercises and practice activities
 * - Recommend specific simulations
 * - Adapt plans based on progress
 * - Focus on STAR, leadership, communication, persuasion
 */

export class CoachEngine {
  /**
   * Generate action plan (7/30/90 days) from score
   */
  static generateActionPlan(_score: number): {
    sevenDays: Array<{ id: string; objective: string; duration: string; expectedResult: string }>;
    thirtyDays: Array<{ id: string; objective: string; duration: string; expectedResult: string }>;
    ninetyDays: Array<{ id: string; objective: string; duration: string; expectedResult: string }>;
  } {
    return {
      sevenDays: [
        {
          id: "a-1",
          objective: "Réviser la méthode STAR",
          duration: "2 heures",
          expectedResult: "Être capable de structurer toute réponse avec STAR",
        },
        {
          id: "a-2",
          objective: "Identifier 3 exemples de leadership",
          duration: "1 heure",
          expectedResult: "Avoir 3 histoires STAR prêtes pour les questions de leadership",
        },
        {
          id: "a-3",
          objective: "Pratiquer la quantification",
          duration: "1 heure",
          expectedResult: "Transformer 5 résultats en chiffres concrets",
        },
      ],
      thirtyDays: [
        {
          id: "b-1",
          objective: "Maîtriser les questions comportementales",
          duration: "5 heures",
          expectedResult: "Répondre avec aisance à tout type de question comportementale",
        },
        {
          id: "b-2",
          objective: "Développer la vision stratégique",
          duration: "3 heures",
          expectedResult: "Articuler une vision à 3 ans pour un poste de direction",
        },
        {
          id: "b-3",
          objective: "Améliorer la communication non-verbale",
          duration: "2 heures",
          expectedResult: "Posture et langage corporel cohérents avec le discours",
        },
      ],
      ninetyDays: [
        {
          id: "c-1",
          objective: "Devenir expert en entretien",
          duration: "10 heures",
          expectedResult: "Niveau expert sur tous les types d'entretiens",
        },
        {
          id: "c-2",
          objective: "Développer un personal branding",
          duration: "5 heures",
          expectedResult: "Narrative personnelle cohérente et impactante",
        },
        {
          id: "c-3",
          objective: "Préparer aux entretiens de direction",
          duration: "8 heures",
          expectedResult: "Prêt pour les entretiens C-level et comités exécutifs",
        },
      ],
    };
  }

  /**
   * Generate a comprehensive coaching plan
   */
  static generateCoachPlan(
    profile: CandidateProfile,
    job: JobAnalysis,
    interviewAnalysis: InterviewAnalysis
  ): CoachPlan {
    return {
      sevenDays: this.generateSevenDayPlan(profile, job, interviewAnalysis),
      thirtyDays: this.generateThirtyDayPlan(profile, job, interviewAnalysis),
      ninetyDays: this.generateNinetyDayPlan(profile, job, interviewAnalysis),
    };
  }

  /**
   * Generate 7-day plan
   */
  private static generateSevenDayPlan(
    profile: CandidateProfile,
    job: JobAnalysis,
    _interviewAnalysis: InterviewAnalysis
  ): DailyPlan[] {
    const plans: DailyPlan[] = [];

    // Day 1: Assessment and STAR foundation
    plans.push({
      day: 1,
      objectives: [
        "Comprendre vos forces et faiblesses actuelles",
        "Maîtriser les bases de la méthode STAR",
        "Identifier 3 exemples STAR potentiels",
      ],
      exercises: [
        {
          id: "ex-star-1",
          title: "STAR Basics",
          description: "Écrire 3 exemples STAR sur vos expériences récentes",
          duration: "45 minutes",
          type: "star",
        },
        {
          id: "ex-assess-1",
          title: "Self-Assessment",
          description: "Revoir votre dernier rapport d'entretien et noter 3 points à améliorer",
          duration: "30 minutes",
          type: "other",
        },
      ],
      reading: [
        "Guide STAR: Situation, Tâche, Action, Résultat",
        "Comment structurer vos réponses d'entretien",
      ],
      simulation: {
        type: "Entretien technique",
        difficulty: "intermediate",
        focus: ["STAR method", "Structure"],
        reason: "Pratique immédiate de la méthode STAR",
      },
    });

    // Day 2: Quantification and impact
    plans.push({
      day: 2,
      objectives: [
        "Quantifier vos résultats passés",
        "Préparer 5 résultats chiffrés",
        "Pratiquer l'impact business",
      ],
      exercises: [
        {
          id: "ex-impact-1",
          title: "Impact Quantification",
          description: "Pour chaque résultat, trouver : pourcentage, gain financier, temps économisé",
          duration: "60 minutes",
          type: "other",
        },
        {
          id: "ex-story-1",
          title: "Story Impact",
          description: "Réécrire 3 histoires avec des chiffres concrets",
          duration: "45 minutes",
          type: "persuasion",
        },
      ],
      reading: [
        "L'art de quantifier l'impact business",
        "Comment parler chiffres en entretien",
      ],
    });

    // Day 3: Communication clarity
    plans.push({
      day: 3,
      objectives: [
        "Améliorer la clarté de communication",
        "Pratiquer la règle des 3 points",
        "Réduire la verbosité",
      ],
      exercises: [
        {
          id: "ex-clarity-1",
          title: "3-Point Rule",
          description: "Pratiquer à répondre en 3 points clés pour 10 questions fréquentes",
          duration: "45 minutes",
          type: "communication",
        },
        {
          id: "ex-timing-1",
          title: "Timing Practice",
          description: "Enregistrer vos réponses et viser 90 secondes max",
          duration: "30 minutes",
          type: "communication",
        },
      ],
      reading: [
        "Communication claire en entretien",
        "La règle des 3 points expliquée",
      ],
    });

    // Day 4: Leadership demonstration
    plans.push({
      day: 4,
      objectives: [
        "Préparer des exemples de leadership",
        "Démontrer la fédération d'équipe",
        "Montrer le développement de talents",
      ],
      exercises: [
        {
          id: "ex-leadership-1",
          title: "Leadership Stories",
          description: "Préparer 2 exemples : transformation d'équipe et mentoring",
          duration: "60 minutes",
          type: "leadership",
        },
        {
          id: "ex-we-1",
          title: "We vs I",
          description: "Réécrire vos exemples en utilisant 'nous' au lieu de 'je'",
          duration: "30 minutes",
          type: "leadership",
        },
      ],
      reading: [
        "Leadership en entretien : ce que les recruteurs cherchent",
        "Comment démontrer votre capacité à fédérer",
      ],
    });

    // Day 5: Confidence and stress management
    plans.push({
      day: 5,
      objectives: [
        "Renforcer la confiance en soi",
        "Pratiquer la gestion du stress",
        "Éliminer les expressions de doute",
      ],
      exercises: [
        {
          id: "ex-confidence-1",
          title: "Confidence Affirmations",
          description: "Pratiquer 10 affirmations positives avant chaque réponse",
          duration: "20 minutes",
          type: "other",
        },
        {
          id: "ex-stress-1",
          title: "Stress Scenarios",
          description: "Simuler 3 questions stressantes et pratiquer des réponses calmes",
          duration: "45 minutes",
          type: "other",
        },
      ],
      reading: [
        "Gérer le stress en entretien",
        "Confiance en soi : techniques pratiques",
      ],
    });

    // Day 6: Persuasion and influence
    plans.push({
      day: 6,
      objectives: [
        "Développer la persuasion",
        "Pratiquer l'argumentation",
        "Utiliser des preuves et exemples",
      ],
      exercises: [
        {
          id: "ex-persuasion-1",
          title: "Argument Structure",
          description: "Pratiquer : thèse, arguments, preuves, conclusion",
          duration: "45 minutes",
          type: "persuasion",
        },
        {
          id: "ex-evidence-1",
          title: "Evidence Gathering",
          description: "Collecter des preuves pour vos 5 plus grandes réalisations",
          duration: "30 minutes",
          type: "other",
        },
      ],
      reading: [
        "Persuasion en entretien",
        "Comment convaincre avec des faits",
      ],
    });

    // Day 7: Integration and simulation
    plans.push({
      day: 7,
      objectives: [
        "Intégrer toutes les compétences",
        "Pratiquer une simulation complète",
        "Recevoir du feedback",
      ],
      exercises: [
        {
          id: "ex-integration-1",
          title: "Full Practice",
          description: "Simulation complète de 30 minutes avec toutes les techniques apprises",
          duration: "45 minutes",
          type: "other",
        },
        {
          id: "ex-feedback-1",
          title: "Self-Feedback",
          description: "Revoir l'enregistrement et noter 3 améliorations",
          duration: "30 minutes",
          type: "other",
        },
      ],
      simulation: {
        type: job.position,
        difficulty: job.seniority,
        focus: ["Integration", "Full performance"],
        reason: "Test complet après 6 jours de préparation",
      },
    });

    return plans;
  }

  /**
   * Generate 30-day plan
   */
  private static generateThirtyDayPlan(
    profile: CandidateProfile,
    job: JobAnalysis,
    _interviewAnalysis: InterviewAnalysis
  ): WeeklyPlan[] {
    const plans: WeeklyPlan[] = [];

    // Week 1: Foundation
    plans.push({
      week: 1,
      objectives: [
        "Maîtriser les fondamentaux STAR",
        "Quantifier tous les résultats",
        "Établir une base de 10 exemples solides",
      ],
      dailyFocus: [
        "Lundi : STAR method",
        "Mardi : Quantification",
        "Mercredi : Communication",
        "Jeudi : Leadership",
        "Vendredi : Pratique simulation",
        "Samedi : Révision et ajustement",
        "Dimanche : Repos et réflexion",
      ],
      exercises: [
        {
          id: "ex-w1-star",
          title: "STAR Mastery",
          description: "Créer 10 exemples STAR couvrant différents scénarios",
          duration: "2 heures",
          type: "star",
        },
        {
          id: "ex-w1-impact",
          title: "Impact Database",
          description: "Construire une base de données de vos résultats chiffrés",
          duration: "1.5 heures",
          type: "other",
        },
      ],
      simulations: [
        {
          type: "Entretien comportemental",
          difficulty: "intermediate",
          focus: ["STAR", "Impact"],
          reason: "Pratique des fondamentaux",
        },
        {
          type: "Entretien technique",
          difficulty: "intermediate",
          focus: ["Communication", "Structure"],
          reason: "Renforcement de la clarté",
        },
      ],
    });

    // Week 2: Deep dive
    plans.push({
      week: 2,
      objectives: [
        "Approfondir le leadership",
        "Développer la persuasion",
        "Améliorer la gestion du stress",
      ],
      dailyFocus: [
        "Lundi : Leadership avancé",
        "Mardi : Persuasion",
        "Mercredi : Stress management",
        "Jeudi : Synthèse",
        "Vendredi : Pratique simulation",
        "Samedi : Révision et ajustement",
        "Dimanche : Repos et réflexion",
      ],
      exercises: [
        {
          id: "ex-w2-leadership",
          title: "Leadership Scenarios",
          description: "Préparer des exemples pour 5 scénarios de leadership complexes",
          duration: "2 heures",
          type: "leadership",
        },
        {
          id: "ex-w2-persuasion",
          title: "Persuasion Techniques",
          description: "Pratiquer 5 techniques de persuasion différentes",
          duration: "1.5 heures",
          type: "persuasion",
        },
      ],
      simulations: [
        {
          type: "Entretien management",
          difficulty: "senior",
          focus: ["Leadership", "Persuasion"],
          reason: "Challenge leadership",
        },
        {
          type: "Entretien comportemental",
          difficulty: "senior",
          focus: ["Stress", "Confidence"],
          reason: "Gestion de la pression",
        },
      ],
    });

    // Week 3: Specialization
    plans.push({
      week: 3,
      objectives: [
        "Spécialiser pour le poste cible",
        "Adapter les exemples au secteur",
        "Préparer des questions spécifiques",
      ],
      dailyFocus: [
        "Lundi : Analyse du poste",
        "Mardi : Adaptation secteur",
        "Mercredi : Questions spécifiques",
        "Jeudi : Culture fit",
        "Vendredi : Pratique simulation",
        "Samedi : Révision et ajustement",
        "Dimanche : Repos et réflexion",
      ],
      exercises: [
        {
          id: "ex-w3-job",
          title: "Job-Specific Examples",
          description: "Adapter 5 exemples aux exigences spécifiques du poste",
          duration: "2 heures",
          type: "other",
        },
        {
          id: "ex-w3-culture",
          title: "Culture Alignment",
          description: "Préparer des exemples alignés avec la culture de l'entreprise",
          duration: "1.5 heures",
          type: "other",
        },
      ],
      simulations: [
        {
          type: job.position,
          difficulty: job.seniority,
          focus: ["Job-specific", "Culture"],
          reason: "Préparation ciblée",
        },
        {
          type: "Entretien final",
          difficulty: "senior",
          focus: ["Integration", "Performance"],
          reason: "Simulation complète",
        },
      ],
    });

    // Week 4: Refinement
    plans.push({
      week: 4,
      objectives: [
        "Affiner la performance",
        "Éliminer les dernières faiblesses",
        "Préparer pour l'entretien réel",
      ],
      dailyFocus: [
        "Lundi : Analyse des faiblesses",
        "Mardi : Correction ciblée",
        "Mercredi : Pratique intensive",
        "Jeudi : Simulation finale",
        "Vendredi : Feedback et ajustement",
        "Samedi : Préparation mentale",
        "Dimanche : Repos et préparation",
      ],
      exercises: [
        {
          id: "ex-w4-refine",
          title: "Weakness Correction",
          description: "Travailler spécifiquement sur les 3 plus grandes faiblesses identifiées",
          duration: "2 heures",
          type: "other",
        },
        {
          id: "ex-w4-polish",
          title: "Performance Polish",
          description: "Entraînement intensif sur les points de perfectionnement",
          duration: "1.5 heures",
          type: "other",
        },
      ],
      simulations: [
        {
          type: job.position,
          difficulty: job.seniority === "executive" ? "expert" : "executive",
          focus: ["Full performance", "Excellence"],
          reason: "Préparation niveau supérieur",
        },
        {
          type: "Entretien stress",
          difficulty: "expert",
          focus: ["Stress", "Resilience"],
          reason: "Test de résistance",
        },
      ],
    });

    return plans;
  }

  /**
   * Generate 90-day plan
   */
  private static generateNinetyDayPlan(
    profile: CandidateProfile,
    job: JobAnalysis,
    _interviewAnalysis: InterviewAnalysis
  ): MonthlyPlan[] {
    const plans: MonthlyPlan[] = [];

    // Month 1: Foundation
    plans.push({
      month: 1,
      objectives: [
        "Maîtriser les fondamentaux de l'entretien",
        "Construire une base de 20 exemples solides",
        "Atteindre un score de 70+ en simulation",
      ],
      weeklyFocus: [
        "Semaine 1 : STAR et structure",
        "Semaine 2 : Quantification et impact",
        "Semaine 3 : Communication et clarté",
        "Semaine 4 : Leadership et persuasion",
      ],
      milestones: [
        "10 exemples STAR maîtrisés",
        "15 résultats chiffrés identifiés",
        "Score simulation ≥ 70",
        "Confidence ≥ 75",
      ],
      simulations: [
        {
          type: "Entretien comportemental",
          difficulty: "intermediate",
          focus: ["Fundamentals"],
          reason: "Base building",
        },
        {
          type: "Entretien technique",
          difficulty: "intermediate",
          focus: ["Technical"],
          reason: "Technical practice",
        },
        {
          type: job.position,
          difficulty: "senior",
          focus: ["Target role"],
          reason: "Role-specific practice",
        },
      ],
    });

    // Month 2: Deepening
    plans.push({
      month: 2,
      objectives: [
        "Approfondir les compétences avancées",
        "Spécialiser pour le secteur cible",
        "Atteindre un score de 80+ en simulation",
      ],
      weeklyFocus: [
        "Semaine 5 : Leadership avancé",
        "Semaine 6 : Persuasion et influence",
        "Semaine 7 : Gestion de crise",
        "Semaine 8 : Vision stratégique",
      ],
      milestones: [
        "20 exemples STAR maîtrisés",
        "Score simulation ≥ 80",
        "Leadership ≥ 80",
        "Persuasion ≥ 80",
      ],
      simulations: [
        {
          type: "Entretien management",
          difficulty: "senior",
          focus: ["Leadership"],
          reason: "Leadership deep dive",
        },
        {
          type: "Entretien direction",
          difficulty: "expert",
          focus: ["Strategy"],
          reason: "Strategic thinking",
        },
        {
          type: job.position,
          difficulty: "expert",
          focus: ["Excellence"],
          reason: "Expert level practice",
        },
      ],
    });

    // Month 3: Mastery
    plans.push({
      month: 3,
      objectives: [
        "Atteindre le niveau d'excellence",
        "Préparer pour des entretiens de haut niveau",
        "Maintenir une performance consistante",
      ],
      weeklyFocus: [
        "Semaine 9 : Intégration complète",
        "Semaine 10 : Simulation stress",
        "Semaine 11 : Feedback et ajustement",
        "Semaine 12 : Préparation finale",
      ],
      milestones: [
        "Score simulation ≥ 85",
        "Consistance ≥ 90%",
        "Confidence ≥ 90",
        "Prêt pour entretien réel",
      ],
      simulations: [
        {
          type: "Entretien executive",
          difficulty: "executive",
          focus: ["Executive presence"],
          reason: "Executive level",
        },
        {
          type: "Entretien stress",
          difficulty: "expert",
          focus: ["Resilience"],
          reason: "Stress test",
        },
        {
          type: job.position,
          difficulty: "executive",
          focus: ["Mastery"],
          reason: "Final preparation",
        },
      ],
    });

    return plans;
  }

  /**
   * Adapt plan based on progress
   */
  static adaptPlan(
    currentPlan: CoachPlan,
    progress: { metric: string; improvement: number }[]
  ): CoachPlan {
    // If significant improvement in STAR, reduce STAR exercises
    const starProgress = progress.find(p => p.metric === "STAR");
    if (starProgress && starProgress.improvement > 20) {
      currentPlan.sevenDays = currentPlan.sevenDays.map(day => ({
        ...day,
        exercises: day.exercises.filter(ex => ex.type !== "star"),
      }));
    }

    // If leadership is lagging, add leadership exercises
    const leadershipProgress = progress.find(p => p.metric === "Leadership");
    if (leadershipProgress && leadershipProgress.improvement < 10 && currentPlan.sevenDays[3]) {
      currentPlan.sevenDays[3].exercises.push({
        id: "ex-leadership-extra",
        title: "Leadership Extra Practice",
        description: "Pratique supplémentaire de leadership",
        duration: "30 minutes",
        type: "leadership",
      });
    }

    return currentPlan;
  }
}
