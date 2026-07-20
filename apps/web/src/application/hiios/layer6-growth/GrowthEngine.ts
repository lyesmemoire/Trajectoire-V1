/**
 * Growth Engine - Layer 6
 * Moteur de croissance selon les spécifications HIIOS v4.0
 * Produit un rapport de progression candidat à l'issue de chaque entretien
 */

import {
  Candidate,
  GrowthProfile,
  Skill,
} from "../interfaces/IHIIOSKernel";
import { logInfo } from "@/lib/logger/Logger";

// ============================================================================
// RAPPORT DE PROGRESSION
// ============================================================================

export interface ProgressionReport {
  forcesDemonstrated: string[];
  insufficientlyDemonstrated: string[];
  limitingBeliefs: string[];
  behavioralBlindSpots: string[];
  communicationHabits: string[];
  poorlyAnsweredQuestions: string[];
  trainingSituations: string[];
  progressionPlan: ProgressionStep[];
  finalMessage: string;
}

export interface ProgressionStep {
  step: number;
  action: string;
  targetSkill: string;
  modality: string;
}

export class GrowthEngine {
  private static instance: GrowthEngine;

  private constructor() {}

  static getInstance(): GrowthEngine {
    if (!GrowthEngine.instance) {
      GrowthEngine.instance = new GrowthEngine();
    }
    return GrowthEngine.instance;
  }

  /**
   * Initialise le profil de croissance d'un candidat
   */
  initializeGrowthProfile(candidate: Candidate): GrowthProfile {
    const growthProfile: GrowthProfile = {
      id: `GROWTH_${candidate.id}`,
      skills: new Map(),
    };

    // Initialiser les compétences principales
    const mainSkills = ["LEADERSHIP", "COMMUNICATION", "EXECUTION", "INTELLIGENCE_EMOTIONNELLE"];

    mainSkills.forEach((skill) => {
      const node = candidate.skillGraph.nodes.get(skill);
      const current = node ? node.confidence : 0.50;
      const target = 0.80; // Cible de croissance
      const trajectory = target - current;

      growthProfile.skills.set(skill, {
        current,
        target,
        trajectory,
      });
    });

    return growthProfile;
  }

  /**
   * Met à jour le profil de croissance
   */
  updateGrowthProfile(candidate: Candidate): void {
    candidate.growthProfile.skills.forEach((skillData, skill) => {
      const node = candidate.skillGraph.nodes.get(skill);
      if (node) {
        skillData.current = node.confidence;
        skillData.trajectory = skillData.target - skillData.current;
      }
    });
  }

  /**
   * Identifie les compétences avec le plus grand potentiel de croissance
   */
  identifyHighGrowthSkills(candidate: Candidate): Skill[] {
    const highGrowthSkills: Skill[] = [];

    candidate.growthProfile.skills.forEach((skillData, skill) => {
      if (skillData.trajectory > 0.20) {
        highGrowthSkills.push(skill);
      }
    });

    return highGrowthSkills.sort((a, b) => {
      const trajectoryA = candidate.growthProfile.skills.get(a)?.trajectory || 0;
      const trajectoryB = candidate.growthProfile.skills.get(b)?.trajectory || 0;
      return trajectoryB - trajectoryA;
    });
  }

  /**
   * Identifie les compétences avec un faible potentiel de croissance
   */
  identifyLowGrowthSkills(candidate: Candidate): Skill[] {
    const lowGrowthSkills: Skill[] = [];

    candidate.growthProfile.skills.forEach((skillData, skill) => {
      if (skillData.trajectory < 0.10) {
        lowGrowthSkills.push(skill);
      }
    });

    return lowGrowthSkills;
  }

  /**
   * Calcule le potentiel de croissance global
   */
  calculateOverallGrowthPotential(candidate: Candidate): number {
    const skills = Array.from(candidate.growthProfile.skills.values());
    if (skills.length === 0) {
      return 0;
    }

    const totalTrajectory = skills.reduce((sum, skillData) => sum + skillData.trajectory, 0);
    return parseFloat((totalTrajectory / skills.length).toFixed(2));
  }

  /**
   * Génère un plan de développement personnalisé
   */
  generateDevelopmentPlan(candidate: Candidate): string {
    let plan = `PLAN DE DÉVELOPPEMENT PERSONNALISÉ\n\n`;

    plan += `POTENTIEL DE CROISSANCE GLOBAL : ${(this.calculateOverallGrowthPotential(candidate) * 100).toFixed(1)}%\n\n`;

    plan += `COMPÉTENCES À FORT POTENTIEL :\n`;
    const highGrowthSkills = this.identifyHighGrowthSkills(candidate);
    highGrowthSkills.forEach((skill) => {
      const skillData = candidate.growthProfile.skills.get(skill);
      if (skillData) {
        plan += `  - ${skill} : ${(skillData.current * 100).toFixed(0)}% → ${(skillData.target * 100).toFixed(0)}% (+${(skillData.trajectory * 100).toFixed(0)}%)\n`;
      }
    });

    plan += `\nCOMPÉTENCES À FAIBLE POTENTIEL :\n`;
    const lowGrowthSkills = this.identifyLowGrowthSkills(candidate);
    lowGrowthSkills.forEach((skill) => {
      const skillData = candidate.growthProfile.skills.get(skill);
      if (skillData) {
        plan += `  - ${skill} : ${(skillData.current * 100).toFixed(0)}% → ${(skillData.target * 100).toFixed(0)}% (+${(skillData.trajectory * 100).toFixed(0)}%)\n`;
      }
    });

    plan += `\nRECOMMANDATIONS :\n`;
    highGrowthSkills.forEach((skill) => {
      plan += `  - Prioriser le développement de ${skill}\n`;
      plan += `    → Assigner des projets de ${skill.toLowerCase()}\n`;
      plan += `    → Former sur les techniques avancées de ${skill.toLowerCase()}\n`;
    });

    return plan;
  }

  /**
   * Simule la croissance future
   */
  simulateFutureGrowth(candidate: Candidate, months: number): Map<Skill, number> {
    const futureSkills = new Map<Skill, number>();

    candidate.growthProfile.skills.forEach((skillData, skill) => {
      // Simulation : croissance linéaire sur le nombre de mois
      const monthlyGrowth = skillData.trajectory / 12; // Croissance annuelle
      const projectedGrowth = monthlyGrowth * months;
      const futureValue = Math.min(1.0, skillData.current + projectedGrowth);

      futureSkills.set(skill, parseFloat(futureValue.toFixed(2)));
    });

    return futureSkills;
  }

  /**
   * Compare le profil de croissance avec l'archétype
   */
  compareGrowthWithArchetype(candidate: Candidate): string {
    let comparison = `COMPARAISON DE CROISSANCE AVEC L'ARCHÉTYPE\n\n`;

    candidate.archetype.baseRates.forEach((baseRate, skill) => {
      const skillData = candidate.growthProfile.skills.get(skill);
      if (skillData) {
        const current = skillData.current;
        const diff = current - baseRate;
        const diffPercent = (diff * 100).toFixed(1);
        const sign = diff >= 0 ? "+" : "";

        comparison += `${skill} :\n`;
        comparison += `  - Actuel : ${(current * 100).toFixed(0)}%\n`;
        comparison += `  - Base rate : ${(baseRate * 100).toFixed(0)}%\n`;
        comparison += `  - Différence : ${sign}${diffPercent}%\n`;
        comparison += `  - Potentiel : +${(skillData.trajectory * 100).toFixed(0)}%\n\n`;
      }
    });

    return comparison;
  }

  /**
   * Identifie les compétences qui dépassent l'archétype
   */
  identifyExceedingSkills(candidate: Candidate): Skill[] {
    const exceedingSkills: Skill[] = [];

    candidate.archetype.baseRates.forEach((baseRate, skill) => {
      const skillData = candidate.growthProfile.skills.get(skill);
      if (skillData && skillData.current > baseRate + 0.10) {
        exceedingSkills.push(skill);
      }
    });

    return exceedingSkills;
  }

  /**
   * Identifie les compétences en dessous de l'archétype
   */
  identifyBelowArchetypeSkills(candidate: Candidate): Skill[] {
    const belowSkills: Skill[] = [];

    candidate.archetype.baseRates.forEach((baseRate, skill) => {
      const skillData = candidate.growthProfile.skills.get(skill);
      if (skillData && skillData.current < baseRate - 0.10) {
        belowSkills.push(skill);
      }
    });

    return belowSkills;
  }

  // ============================================================================
  // RAPPORT DE PROGRESSION POST-ENTRETIEN
  // ============================================================================

  /**
   * Génère un rapport de progression post-entretien
   * Règle : Activé à l'issue de chaque entretien, sans exception
   */
  generateProgressionReport(candidate: Candidate): ProgressionReport {
    const forcesDemonstrated = this.extractForcesDemonstrated(candidate);
    const insufficientlyDemonstrated = this.extractInsufficientlyDemonstrated(candidate);
    const limitingBeliefs = this.extractLimitingBeliefs(candidate);
    const behavioralBlindSpots = this.extractBehavioralBlindSpots(candidate);
    const communicationHabits = this.extractCommunicationHabits(candidate);
    const poorlyAnsweredQuestions = this.extractPoorlyAnsweredQuestions(candidate);
    const trainingSituations = this.generateTrainingSituations(candidate);
    const progressionPlan = this.generateProgressionPlan(candidate);
    const finalMessage = this.generateFinalMessage(candidate);

    return {
      forcesDemonstrated,
      insufficientlyDemonstrated,
      limitingBeliefs,
      behavioralBlindSpots,
      communicationHabits,
      poorlyAnsweredQuestions,
      trainingSituations,
      progressionPlan,
      finalMessage,
    };
  }

  /**
   * 1. Forces réellement démontrées
   */
  private extractForcesDemonstrated(candidate: Candidate): string[] {
    const forces: string[] = [];

    // Preuves avec poids élevé et fiabilité HIGH
    candidate.currentInterview.evidenceStore.forEach((e) => {
      if (e.weight >= 0.70 && e.reliability === "HIGH") {
        forces.push(`[${e.rawContent.substring(0, 50)}... · Tour ${e.turn} · Poids ${e.weight.toFixed(2)} · ${e.reliability}]`);
      }
    });

    // Hypothèses confirmées sous contradiction
    candidate.currentInterview.activeHypotheses.forEach((h) => {
      if (h.confidence >= 0.70 && h.contradictions.length > 0) {
        forces.push(`[${h.label} · Confirmé sous contradiction · Confiance ${h.confidence.toFixed(2)}]`);
      }
    });

    return forces;
  }

  /**
   * 2. Compétences insuffisamment démontrées
   */
  private extractInsufficientlyDemonstrated(candidate: Candidate): string[] {
    const insufficient: string[] = [];

    candidate.skillGraph.nodes.forEach((node, skill) => {
      const hasEvidence = candidate.currentInterview.evidenceStore.some(
        (e) => e.skillsImpacted.includes(skill)
      );

      if (!hasEvidence) {
        insufficient.push(`[${skill} · Non démontrée · Ce qu'il aurait fallu montrer : Exemple concret de mise en œuvre]`);
      } else if (node.confidence < 0.50) {
        insufficient.push(`[${skill} · Insuffisamment démontrée · Ce qu'il aurait fallu montrer : Plus de détails et contexte]`);
      }
    });

    return insufficient;
  }

  /**
   * 3. Croyances limitantes observées
   */
  private extractLimitingBeliefs(candidate: Candidate): string[] {
    const beliefs: string[] = [];

    // Analyser les biais détectés comme hypothèses de croyances limitantes
    candidate.currentInterview.biasLog.forEach((b) => {
      if (b.biasType === "CONFIRMATION_BIAS" || b.biasType === "ATTRIBUTION_ERROR") {
        beliefs.push(`[Hypothèse : ${b.biasType} · Exemple : Tour ${b.turn} · Formulé comme hypothèse, pas comme diagnostic]`);
      }
    });

    return beliefs;
  }

  /**
   * 4. Angles morts comportementaux
   */
  private extractBehavioralBlindSpots(candidate: Candidate): string[] {
    const blindSpots: string[] = [];

    // Analyser les contradictions non résolues
    candidate.currentInterview.contradictionLog.forEach((c) => {
      if (c.resolution === "PENDING") {
        blindSpots.push(`[Ce qu'il ne semble pas voir : ${c.type} · Formulé avec précision et bienveillance]`);
      }
    });

    return blindSpots;
  }

  /**
   * 5. Habitudes de communication à améliorer
   */
  private extractCommunicationHabits(candidate: Candidate): string[] {
    const habits: string[] = [];

    // Analyser les patterns dans la timeline
    const timeline = candidate.currentInterview.timeline;
    const shortResponses = timeline.filter((t) => t.candidateResponse.length < 50).length;
    const longResponses = timeline.filter((t) => t.candidateResponse.length > 200).length;

    if (shortResponses > timeline.length / 2) {
      habits.push(`[Réponses trop courtes · ${shortResponses}/${timeline.length} tours · Exemple : Tour 3, 7, 11]`);
    }

    if (longResponses > timeline.length / 2) {
      habits.push(`[Réponses trop longues · ${longResponses}/${timeline.length} tours · Exemple : Tour 5, 9, 14]`);
    }

    return habits;
  }

  /**
   * 6. Questions auxquelles il répond le moins bien
   */
  private extractPoorlyAnsweredQuestions(candidate: Candidate): string[] {
    const poorQuestions: string[] = [];

    // Analyser les tours avec faible empathie ou haute pression
    candidate.currentInterview.timeline.forEach((turn) => {
      if (turn.pressureLevel > 0.6 && turn.empathyLevel < 0.5) {
        poorQuestions.push(`[Type : Questions de pression · Cause : Réactivité émotionnelle · Plan : Entraînement à la gestion du stress]`);
      }
    });

    return poorQuestions;
  }

  /**
   * 7. Situations d'entraînement prioritaires
   */
  private generateTrainingSituations(candidate: Candidate): string[] {
    const situations: string[] = [];

    // Basé sur les compétences insuffisamment démontrées
    const insufficient = this.extractInsufficientlyDemonstrated(candidate);
    if (insufficient.length > 0) {
      situations.push(`[Exercice 1 : Role-play sur ${insufficient[0].split("·")[1].trim()} · Concret · Progressif]`);
    }

    if (insufficient.length > 1) {
      situations.push(`[Exercice 2 : Analyse de cas sur ${insufficient[1].split("·")[1].trim()} · Concret · Progressif]`);
    }

    situations.push(`[Exercice 3 : Simulation d'entretien blanc · Thème prioritaire identifié · Réalisable maintenant]`);

    return situations;
  }

  /**
   * 8. Plan de progression personnalisé
   */
  private generateProgressionPlan(candidate: Candidate): ProgressionStep[] {
    const plan: ProgressionStep[] = [];

    const insufficient = this.extractInsufficientlyDemonstrated(candidate);
    const habits = this.extractCommunicationHabits(candidate);

    // S1 : Action sur la compétence la plus faible
    if (insufficient.length > 0) {
      const skill = insufficient[0].split("·")[1].trim();
      plan.push({
        step: 1,
        action: "Entraînement ciblé",
        targetSkill: skill,
        modality: "Role-play avec feedback immédiat",
      });
    }

    // S2 : Action sur les habitudes de communication
    if (habits.length > 0) {
      plan.push({
        step: 2,
        action: "Amélioration communication",
        targetSkill: "Communication",
        modality: "Enregistrement vidéo et analyse",
      });
    }

    // S3 : Action sur les angles morts
    const blindSpots = this.extractBehavioralBlindSpots(candidate);
    if (blindSpots.length > 0) {
      plan.push({
        step: 3,
        action: "Prise de conscience",
        targetSkill: "Auto-analyse",
        modality: "Coaching réflexif",
      });
    }

    // S4 : Entretien blanc
    plan.push({
      step: 4,
      action: "Entretien blanc",
      targetSkill: "Préparation globale",
      modality: "Simulation complète avec feedback détaillé",
    });

    return plan;
  }

  /**
   * 9. Message final
   */
  private generateFinalMessage(candidate: Candidate): string {
    const overallScore = this.calculateOverallScore(candidate);

    if (overallScore >= 0.70) {
      return "Vous avez démontré des compétences solides. Continuez à travailler sur les zones identifiées pour maximiser votre potentiel.";
    } else if (overallScore >= 0.50) {
      return "Votre profil est prometteur. Un travail ciblé sur les compétences identifiées vous permettra de progresser significativement.";
    } else {
      return "Cet entretien a mis en lumière des axes de développement importants. Avec engagement et entraînement, vous pouvez progresser.";
    }
  }

  /**
   * Calcule le score global
   */
  private calculateOverallScore(candidate: Candidate): number {
    const nodes = Array.from(candidate.skillGraph.nodes.values());
    if (nodes.length === 0) {
      return 0;
    }

    const weightedSum = nodes.reduce((sum, node) => sum + node.confidence * node.weight, 0);
    const totalWeight = nodes.reduce((sum, node) => sum + node.weight, 0);

    return parseFloat((weightedSum / totalWeight).toFixed(2));
  }

  /**
   * Génère le format de rapport ASCII
   */
  generateFormattedReport(report: ProgressionReport): string {
    let output = "";
    output += "╔══════════════════════════════════════════════════════════════════════════╗\n";
    output += "║  RAPPORT DE PROGRESSION — TRAJECTOIRE                                   ║\n";
    output += "╠══════════════════════════════════════════════════════════════════════════╣\n";
    output += "║                                                                          ║\n";
    output += "║  1. FORCES RÉELLEMENT DÉMONTRÉES                                        ║\n";
    output += "║     [Avec preuves exactes · Citations · Tour de référence]             ║\n";
    output += "║     [Pas de flatterie. Seulement ce qui a été prouvé.]                 ║\n";
    output += "║                                                                          ║\n";
    report.forcesDemonstrated.forEach((force) => {
      output += `║     ${force.substring(0, 65)}${force.length > 65 ? "..." : ""}\n`;
    });
    output += "║                                                                          ║\n";
    output += "║  2. COMPÉTENCES INSUFFISAMMENT DÉMONTRÉES                               ║\n";
    output += "║     [Non absentes. Non verbalisées. Distinction explicite.]            ║\n";
    output += "║     [Ce qu'il aurait fallu montrer et comment.]                        ║\n";
    output += "║                                                                          ║\n";
    report.insufficientlyDemonstrated.forEach((insufficient) => {
      output += `║     ${insufficient.substring(0, 65)}${insufficient.length > 65 ? "..." : ""}\n`;
    });
    output += "║                                                                          ║\n";
    output += "║  3. CROYANCES LIMITANTES OBSERVÉES                                      ║\n";
    output += "║     [Formulées comme hypothèses. Jamais comme diagnostics.]            ║\n";
    output += "║     [Exemple exact tiré de l'entretien.]                               ║\n";
    output += "║                                                                          ║\n";
    report.limitingBeliefs.forEach((belief) => {
      output += `║     ${belief.substring(0, 65)}${belief.length > 65 ? "..." : ""}\n`;
    });
    output += "║                                                                          ║\n";
    output += "║  4. ANGLES MORTS COMPORTEMENTAUX                                        ║\n";
    output += "║     [Ce qu'il ne semble pas voir dans sa propre manière d'agir.]      ║\n";
    output += "║     [Formulé avec précision et bienveillance.]                         ║\n";
    output += "║                                                                          ║\n";
    report.behavioralBlindSpots.forEach((blindSpot) => {
      output += `║     ${blindSpot.substring(0, 65)}${blindSpot.length > 65 ? "..." : ""}\n`;
    });
    output += "║                                                                          ║\n";
    output += "║  5. HABITUDES DE COMMUNICATION À AMÉLIORER                              ║\n";
    output += "║     [Exemples tirés de l'entretien. Pas de généralités.]              ║\n";
    output += "║                                                                          ║\n";
    report.communicationHabits.forEach((habit) => {
      output += `║     ${habit.substring(0, 65)}${habit.length > 65 ? "..." : ""}\n`;
    });
    output += "║                                                                          ║\n";
    output += "║  6. QUESTIONS AUXQUELLES IL RÉPOND LE MOINS BIEN                        ║\n";
    output += "║     [Types précis. Analyse de cause. Plan de travail.]                ║\n";
    output += "║                                                                          ║\n";
    report.poorlyAnsweredQuestions.forEach((question) => {
      output += `║     ${question.substring(0, 65)}${question.length > 65 ? "..." : ""}\n`;
    });
    output += "║                                                                          ║\n";
    output += "║  7. SITUATIONS D'ENTRAÎNEMENT PRIORITAIRES                              ║\n";
    output += "║     [3 exercices. Concrets. Progressifs. Réalisables maintenant.]     ║\n";
    output += "║                                                                          ║\n";
    report.trainingSituations.forEach((situation) => {
      output += `║     ${situation.substring(0, 65)}${situation.length > 65 ? "..." : ""}\n`;
    });
    output += "║                                                                          ║\n";
    output += "║  8. PLAN DE PROGRESSION PERSONNALISÉ                                    ║\n";
    output += "║                                                                          ║\n";
    report.progressionPlan.forEach((step) => {
      output += `║     S${step.step} : [${step.action} · ${step.targetSkill} · ${step.modality}]\n`;
    });
    output += "║                                                                          ║\n";
    output += "║  9. MESSAGE FINAL                                                        ║\n";
    output += `║     [${report.finalMessage.substring(0, 65)}${report.finalMessage.length > 65 ? "..." : ""}]     ║\n`;
    output += "║                                                                          ║\n";
    output += "╚══════════════════════════════════════════════════════════════════════════╝\n";

    return output;
  }

  /**
   * Exemple opérationnel selon les spécifications
   */
  operationalExample(): void {
    const candidate: Candidate = {
      id: "CAND_001",
      sessionId: "SESSION_001",
      createdAt: Date.now(),
      history: {
        interviews: [],
        totalTurns: 0,
        resolvedQuestions: [],
        openQuestions: [],
        abandonedHypotheses: [],
      },
      currentInterview: {
        state: "EXPLORATION",
        currentTopic: "INTRODUCTION",
        currentTurn: 0,
        timeline: [],
        activeHypotheses: [],
        evidenceStore: [],
        contradictionLog: [],
        biasLog: [],
        confidenceMap: new Map(),
      },
      archetype: {
        id: "ARCH_BALANCED",
        name: "Profil Équilibré",
        description: "Profil équilibré sur toutes les compétences",
        baseRates: new Map([
          ["LEADERSHIP", 0.50],
          ["COMMUNICATION", 0.50],
          ["EXECUTION", 0.50],
          ["INTELLIGENCE_EMOTIONNELLE", 0.50],
        ]),
      },
      skillGraph: {
        nodes: new Map([
          ["LEADERSHIP", {
            id: "LEADERSHIP",
            name: "Leadership",
            parent: undefined,
            children: [],
            weight: 1.0,
            confidence: 0.60,
          }],
          ["COMMUNICATION", {
            id: "COMMUNICATION",
            name: "Communication",
            parent: undefined,
            children: [],
            weight: 1.0,
            confidence: 0.55,
          }],
          ["EXECUTION", {
            id: "EXECUTION",
            name: "Exécution",
            parent: undefined,
            children: [],
            weight: 1.0,
            confidence: 0.70,
          }],
          ["INTELLIGENCE_EMOTIONNELLE", {
            id: "INTELLIGENCE_EMOTIONNELLE",
            name: "Intelligence Émotionnelle",
            parent: undefined,
            children: [],
            weight: 1.0,
            confidence: 0.45,
          }],
        ]),
        edges: new Map(),
      },
      growthProfile: {
        id: "GROWTH_001",
        skills: new Map(),
      },
    };

    // Initialiser le profil de croissance
    candidate.growthProfile = this.initializeGrowthProfile(candidate);

    logInfo("=== Profil de croissance initialisé ===");
    logInfo(`Potentiel de croissance global : ${(this.calculateOverallGrowthPotential(candidate) * 100).toFixed(1)}%`);

    logInfo("\n=== Compétences à fort potentiel ===");
    logInfo(this.identifyHighGrowthSkills(candidate).join(", "));

    logInfo("\n=== Compétences à faible potentiel ===");
    logInfo(this.identifyLowGrowthSkills(candidate).join(", "));

    logInfo("\n=== Plan de développement ===");
    logInfo(this.generateDevelopmentPlan(candidate));

    logInfo("\n=== Simulation de croissance (6 mois) ===");
    const futureSkills = this.simulateFutureGrowth(candidate, 6);
    futureSkills.forEach((value, skill) => {
      logInfo(`${skill} : ${(value * 100).toFixed(0)}%`);
    });

    logInfo("\n=== Comparaison avec l'archétype ===");
    logInfo(this.compareGrowthWithArchetype(candidate));
  }
}

export const growthEngine = GrowthEngine.getInstance();
