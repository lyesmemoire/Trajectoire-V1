/**
 * Competence Graph Engine - Layer 3
 * Moteur de graphe de compétences selon les spécifications HIIOS v4.0
 * Bibliothèque de connaissances RH, psychologiques, comportementales
 */

import {
  SkillGraph,
  SkillNode,
  Skill,
  Candidate,
} from "../interfaces/IHIIOSKernel";
import { logInfo } from "@/lib/logger/Logger";

// ============================================================================
// MODULE C.1 — PSYCHOLOGIE APPLIQUÉE
// ============================================================================

export interface PsychologicalHypothesis {
  id: string;
  label: string;
  description: string;
}

export interface PsychologicalPattern {
  signal: string;
  hypotheses: PsychologicalHypothesis[];
  distinctionQuestion: string;
}

// ============================================================================
// MODULE C.2 — COMMUNICATION SCIENCE
// ============================================================================

export enum CommunicationTechnique {
  REFLECTIVE_LISTENING = "REFLECTIVE_LISTENING",
  EMOTIONAL_LABELLING = "EMOTIONAL_LABELLING",
  STRATEGIC_SILENCE = "STRATEGIC_SILENCE",
  COGNITIVE_REFRAMING = "COGNITIVE_REFRAMING",
  NORMALISATION = "NORMALISATION",
  DOUBLE_REFLECTION = "DOUBLE_REFLECTION",
  MINIMAL_ENCOURAGEMENT = "MINIMAL_ENCOURAGEMENT",
  DEEP_REFORMULATION = "DEEP_REFORMULATION",
}

export interface CommunicationTechniqueInfo {
  technique: CommunicationTechnique;
  triggerCondition: string;
  example: string;
}

// ============================================================================
// MODULE C.3 — EXECUTIVE COACHING
// ============================================================================

export interface CoachingTrigger {
  condition: string;
  description: string;
}

export interface CoachingDeactivation {
  condition: string;
  description: string;
}

// ============================================================================
// MODULE C.4 — CAREER INTELLIGENCE
// ============================================================================

export enum MotivationType {
  INTRINSIQUE = "INTRINSIQUE",
  REACTIONNELLE = "REACTIONNELLE",
}

export enum CoherenceType {
  NARRATIF = "NARRATIF",
  OPPORTUNISTE = "OPPORTUNISTE",
}

export interface CareerTransition {
  from: string;
  to: string;
  motivation: MotivationType;
  coherence: CoherenceType;
}

export interface CareerReading {
  motivation: MotivationType;
  coherence: CoherenceType;
  reading: string;
}

// ============================================================================
// MODULE C.5 — HUMAN PRESENCE
// ============================================================================

export enum PresenceState {
  OPEN = "OPEN",
  ATTENTIVE = "ATTENTIVE",
  PROTECTIVE = "PROTECTIVE",
  CHALLENGING = "CHALLENGING",
  CONCLUDING = "CONCLUDING",
}

export interface PresenceInfo {
  state: PresenceState;
  description: string;
  empathyLevel: number;
  pressureLevel: number;
}

export class CompetenceGraphEngine {
  private static instance: CompetenceGraphEngine;

  private constructor() {}

  static getInstance(): CompetenceGraphEngine {
    if (!CompetenceGraphEngine.instance) {
      CompetenceGraphEngine.instance = new CompetenceGraphEngine();
    }
    return CompetenceGraphEngine.instance;
  }

  // ============================================================================
  // MODULE C.1 — PSYCHOLOGIE APPLIQUÉE
  // ============================================================================

  /**
   * Génère des hypothèses psychologiques pour un signal observé
   */
  generatePsychologicalHypotheses(signal: string): PsychologicalPattern {
    // Base de patterns psychologiques
    const patterns: PsychologicalPattern[] = [
      {
        signal: "Minimise systématiquement ses succès",
        hypotheses: [
          { id: "H1", label: "Syndrome de l'imposteur", description: "Culture de modestie" },
          { id: "H2", label: "Attribution collective", description: "Réelle et justifiée" },
          { id: "H3", label: "Modestité performative", description: "Apprise" },
        ],
        distinctionQuestion: "Les résultats que vous citez — qui les a concrètement produits ?",
      },
      {
        signal: "Justifie tout avant qu'on demande rien",
        hypotheses: [
          { id: "H1", label: "Culpabilité préventive", description: "Sur le sujet abordé" },
          { id: "H2", label: "Profil analytique", description: "Anticipe les objections naturellement" },
          { id: "H3", label: "Expérience passée", description: "Mauvaise expérience d'entretien sur ce sujet" },
        ],
        distinctionQuestion: "Observer si le pattern se répète sur d'autres sujets",
      },
      {
        signal: "Répond à côté de la question",
        hypotheses: [
          { id: "H1", label: "Évitement", description: "Conscient ou inconscient" },
          { id: "H2", label: "Question mal comprise", description: "Problème de compréhension" },
          { id: "H3", label: "Sujet sensible", description: "Déclenché" },
        ],
        distinctionQuestion: "Reformuler exactement la même question. Observer.",
      },
    ];

    // Chercher le pattern correspondant
    const matchedPattern = patterns.find((p) => signal.toLowerCase().includes(p.signal.toLowerCase()));

    if (matchedPattern) {
      return matchedPattern;
    }

    // Pattern par défaut
    return {
      signal,
      hypotheses: [
        { id: "H1", label: "Hypothèse 1", description: "À définir" },
        { id: "H2", label: "Hypothèse 2", description: "À définir" },
        { id: "H3", label: "Hypothèse 3", description: "À définir" },
      ],
      distinctionQuestion: "Question de distinction à formuler",
    };
  }

  // ============================================================================
  // MODULE C.2 — COMMUNICATION SCIENCE
  // ============================================================================

  /**
   * Sélectionne la technique de communication appropriée
   */
  selectCommunicationTechnique(candidateState: string, emotionalSignal?: string): CommunicationTechniqueInfo {
    const techniques: CommunicationTechniqueInfo[] = [
      {
        technique: CommunicationTechnique.REFLECTIVE_LISTENING,
        triggerCondition: "Signal émotionnel détecté",
        example: "Je comprends que cette situation a été difficile pour vous.",
      },
      {
        technique: CommunicationTechnique.EMOTIONAL_LABELLING,
        triggerCondition: "Émotion non nommée présente",
        example: "Je sens que vous êtes frustré par cette situation.",
      },
      {
        technique: CommunicationTechnique.STRATEGIC_SILENCE,
        triggerCondition: "Après question difficile ou aveu",
        example: "[Silence stratégique pour permettre au candidat de développer]",
      },
      {
        technique: CommunicationTechnique.COGNITIVE_REFRAMING,
        triggerCondition: "Lecture uniquement négative",
        example: "Comment pourriez-vous voir cette situation comme une opportunité d'apprentissage ?",
      },
      {
        technique: CommunicationTechnique.NORMALISATION,
        triggerCondition: "Honte visible sur sujet commun",
        example: "C'est une réaction tout à fait normale dans ce type de situation.",
      },
      {
        technique: CommunicationTechnique.DOUBLE_REFLECTION,
        triggerCondition: "Deux énoncés contradictoires",
        example: "Vous dites X, mais aussi Y. Comment conciliez-vous ces deux points de vue ?",
      },
      {
        technique: CommunicationTechnique.MINIMAL_ENCOURAGEMENT,
        triggerCondition: "Candidat en ralentissement",
        example: "Continuez, vous êtes sur la bonne voie.",
      },
      {
        technique: CommunicationTechnique.DEEP_REFORMULATION,
        triggerCondition: "Accès à la Couche 4 nécessaire",
        example: "Si je comprends bien — ce qui vous a surtout marqué dans cet échec, ce n'est pas le résultat lui-même, c'est le sentiment d'avoir déçu quelqu'un. C'est ça ?",
      },
    ];

    // Sélection basée sur l'état et le signal émotionnel
    if (emotionalSignal && emotionalSignal.includes("émotion")) {
      return techniques.find((t) => t.technique === CommunicationTechnique.EMOTIONAL_LABELLING) || techniques[0];
    }

    if (candidateState === "CHALLENGE") {
      return techniques.find((t) => t.technique === CommunicationTechnique.STRATEGIC_SILENCE) || techniques[0];
    }

    return techniques[0]; // REFLECTIVE_LISTENING par défaut
  }

  /**
   * Applique une DEEP_REFORMULATION
   */
  applyDeepReformulation(candidateResponse: string): string {
    const patterns = [
      {
        signal: "J'ai raté ce projet. On n'a pas atteint les objectifs.",
        reformulation: "Si je comprends bien — ce qui vous a surtout marqué dans cet échec, ce n'est pas le résultat lui-même, c'est le sentiment d'avoir déçu quelqu'un. C'est ça ?",
      },
    ];

    const matchedPattern = patterns.find((p) => candidateResponse.includes(p.signal));

    if (matchedPattern) {
      return matchedPattern.reformulation;
    }

    return "Pouvez-vous me dire ce que cette situation vous a appris sur vous-même ?";
  }

  // ============================================================================
  // MODULE C.3 — EXECUTIVE COACHING
  // ============================================================================

  /**
   * Vérifie si le coaching doit être activé
   */
  shouldActivateCoaching(candidate: Candidate): boolean {
    const triggers: CoachingTrigger[] = [
      { condition: "Le candidat n'a pas accès à ses propres ressources", description: "Blocage observable" },
      { condition: "Une croyance limitante est observable", description: "Auto-sabotage" },
      { condition: "Une reformulation peut ouvrir quelque chose", description: "Opportunité de coaching" },
    ];

    // Simplification : vérifier si le candidat est bloqué
    const isBlocked = candidate.currentInterview.state === "EXPLORATION" && candidate.currentInterview.currentTurn > 5;

    return isBlocked;
  }

  /**
   * Génère une question de coaching
   */
  generateCoachingQuestion(): string {
    return "Avec le recul, qu'est-ce que cette situation vous a appris sur votre manière de prendre vos décisions ?";
  }

  /**
   * Vérifie si le coaching doit être désactivé
   */
  shouldDeactivateCoaching(candidate: Candidate): boolean {
    const deactivations: CoachingDeactivation[] = [
      { condition: "Le candidat a trouvé sa réponse", description: "Autonomie retrouvée" },
      { condition: "La limite est structurelle, pas cognitive", description: "Limite externe" },
    ];

    // Simplification : vérifier si l'état a changé
    return candidate.currentInterview.state !== "EXPLORATION";
  }

  // ============================================================================
  // MODULE C.4 — CAREER INTELLIGENCE
  // ============================================================================

  /**
   * Analyse une transition de carrière
   */
  analyzeCareerTransition(from: string, to: string, context: string): CareerTransition {
    // Simplification : analyse basée sur le contexte
    const isIntrinsic = context.toLowerCase().includes("projet") || context.toLowerCase().includes("volonté");
    const isNarrative = context.toLowerCase().includes("suite") || context.toLowerCase().includes("logique");

    return {
      from,
      to,
      motivation: isIntrinsic ? MotivationType.INTRINSIQUE : MotivationType.REACTIONNELLE,
      coherence: isNarrative ? CoherenceType.NARRATIF : CoherenceType.OPPORTUNISTE,
    };
  }

  /**
   * Génère une lecture de carrière
   */
  generateCareerReading(transitions: CareerTransition[]): CareerReading {
    if (transitions.length === 0) {
      return {
        motivation: MotivationType.INTRINSIQUE,
        coherence: CoherenceType.NARRATIF,
        reading: "Insuffisamment de transitions pour générer une lecture",
      };
    }

    const intrinsicCount = transitions.filter((t) => t.motivation === MotivationType.INTRINSIQUE).length;
    const narrativeCount = transitions.filter((t) => t.coherence === CoherenceType.NARRATIF).length;

    const motivation = intrinsicCount >= transitions.length / 2 ? MotivationType.INTRINSIQUE : MotivationType.REACTIONNELLE;
    const coherence = narrativeCount >= transitions.length / 2 ? CoherenceType.NARRATIF : CoherenceType.OPPORTUNISTE;

    let reading = "";
    if (motivation === MotivationType.INTRINSIQUE && coherence === CoherenceType.NARRATIF) {
      reading = "Carrière construite avec une logique intrinsèque et un fil narratif cohérent";
    } else if (motivation === MotivationType.INTRINSIQUE && coherence === CoherenceType.OPPORTUNISTE) {
      reading = "Carrière motivée intrinsèquement mais avec des transitions opportunistes";
    } else if (motivation === MotivationType.REACTIONNELLE && coherence === CoherenceType.NARRATIF) {
      reading = "Carrière réactionnelle mais avec une logique narrative sous-jacente";
    } else {
      reading = "Carrière principalement réactionnelle et opportuniste";
    }

    return { motivation, coherence, reading };
  }

  // ============================================================================
  // MODULE C.5 — HUMAN PRESENCE
  // ============================================================================

  /**
   * Calcule l'état de présence actuel
   */
  calculatePresenceState(candidate: Candidate): PresenceInfo {
    const state = candidate.currentInterview.state;
    const currentTurn = candidate.currentInterview.currentTurn;

    let presenceState: PresenceState;
    let description: string;
    let empathyLevel: number;
    let pressureLevel: number;

    switch (state) {
      case "INTRODUCTION":
        presenceState = PresenceState.OPEN;
        description = "Espace ouvert. Candidat en confiance.";
        empathyLevel = 0.8;
        pressureLevel = 0.3;
        break;

      case "EXPLORATION":
        presenceState = PresenceState.ATTENTIVE;
        description = "Signal important détecté. Écoute maximale.";
        empathyLevel = 0.7;
        pressureLevel = 0.4;
        break;

      case "PRESSION":
        presenceState = PresenceState.CHALLENGING;
        description = "Niveau de pression élevé. Empathie compensatrice.";
        empathyLevel = 0.6;
        pressureLevel = 0.7;
        break;

      case "CHALLENGE":
        presenceState = PresenceState.CHALLENGING;
        description = "Niveau de pression élevé. Empathie compensatrice.";
        empathyLevel = 0.65;
        pressureLevel = 0.75;
        break;

      case "CONTRADICTION":
        presenceState = PresenceState.PROTECTIVE;
        description = "Candidat fragilisé. Sécurité prioritaire.";
        empathyLevel = 0.8;
        pressureLevel = 0.5;
        break;

      case "SYNTHESIS":
        presenceState = PresenceState.ATTENTIVE;
        description = "Signal important détecté. Écoute maximale.";
        empathyLevel = 0.7;
        pressureLevel = 0.4;
        break;

      case "CONCLUSION":
        presenceState = PresenceState.CONCLUDING;
        description = "Clôture bienveillante. Respect de ce qui a été partagé.";
        empathyLevel = 0.9;
        pressureLevel = 0.2;
        break;

      default:
        presenceState = PresenceState.OPEN;
        description = "Espace ouvert. Candidat en confiance.";
        empathyLevel = 0.7;
        pressureLevel = 0.4;
    }

    return { state: presenceState, description, empathyLevel, pressureLevel };
  }

  /**
   * Analyse le graphe de compétences d'un candidat
   */
  analyzeCompetenceGraph(candidate: Candidate): string {
    let analysis = `ANALYSE DU GRAPHE DE COMPÉTENCES\n\n`;

    const skillGraph = candidate.skillGraph;
    const nodes = Array.from(skillGraph.nodes.values());

    analysis += `NŒUDS (${nodes.length}) :\n`;

    nodes.forEach((node) => {
      analysis += `  - ${node.name} : ${(node.confidence * 100).toFixed(1)}% (poids : ${node.weight})\n`;
      if (node.parent) {
        analysis += `    Parent : ${node.parent}\n`;
      }
      if (node.children && node.children.length > 0) {
        analysis += `    Enfants : ${node.children.join(", ")}\n`;
      }
    });

    analysis += `\nARÊTES :\n`;

    skillGraph.edges.forEach((edges, from) => {
      edges.forEach((edge) => {
        analysis += `  - ${from} → ${edge.to} (poids : ${edge.weight})\n`;
      });
    });

    return analysis;
  }

  /**
   * Identifie les compétences les plus fortes
   */
  identifyStrongestSkills(candidate: Candidate, limit: number = 5): SkillNode[] {
    const nodes = Array.from(candidate.skillGraph.nodes.values());
    return nodes
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, limit);
  }

  /**
   * Identifie les compétences les plus faibles
   */
  identifyWeakestSkills(candidate: Candidate, limit: number = 5): SkillNode[] {
    const nodes = Array.from(candidate.skillGraph.nodes.values());
    return nodes
      .sort((a, b) => a.confidence - b.confidence)
      .slice(0, limit);
  }

  /**
   * Identifie les compétences les plus importantes
   * Basé sur le poids et la confiance
   */
  identifyMostImportantSkills(candidate: Candidate, limit: number = 5): SkillNode[] {
    const nodes = Array.from(candidate.skillGraph.nodes.values());
    return nodes
      .map((node) => ({
        node,
        score: node.confidence * node.weight,
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((item) => item.node);
  }

  /**
   * Calcule le score global de compétences
   */
  calculateOverallSkillScore(candidate: Candidate): number {
    const nodes = Array.from(candidate.skillGraph.nodes.values());
    if (nodes.length === 0) {
      return 0;
    }

    const weightedSum = nodes.reduce((sum, node) => sum + node.confidence * node.weight, 0);
    const totalWeight = nodes.reduce((sum, node) => sum + node.weight, 0);

    return parseFloat((weightedSum / totalWeight).toFixed(2));
  }

  /**
   * Compare le graphe de compétences avec l'archétype
   */
  compareWithArchetype(candidate: Candidate): string {
    let comparison = `COMPARAISON AVEC L'ARCHÉTYPE\n\n`;
    comparison += `Archétype : ${candidate.archetype.name}\n\n`;

    candidate.archetype.baseRates.forEach((baseRate, skill) => {
      const node = candidate.skillGraph.nodes.get(skill);
      if (node) {
        const diff = node.confidence - baseRate;
        const diffPercent = (diff * 100).toFixed(1);
        const sign = diff >= 0 ? "+" : "";
        comparison += `${skill} : ${(node.confidence * 100).toFixed(0)}% vs base rate ${(baseRate * 100).toFixed(0)}% (${sign}${diffPercent}%)\n`;
      }
    });

    return comparison;
  }

  /**
   * Identifie les compétences à développer
   */
  identifySkillsToDevelop(candidate: Candidate): Skill[] {
    const skillsToDevelop: Skill[] = [];

    candidate.skillGraph.nodes.forEach((node, skill) => {
      if (node.confidence < 0.60) {
        skillsToDevelop.push(skill);
      }
    });

    return skillsToDevelop;
  }

  /**
   * Identifie les compétences à exploiter
   */
  identifySkillsToLeverage(candidate: Candidate): Skill[] {
    const skillsToLeverage: Skill[] = [];

    candidate.skillGraph.nodes.forEach((node, skill) => {
      if (node.confidence >= 0.75) {
        skillsToLeverage.push(skill);
      }
    });

    return skillsToLeverage;
  }

  /**
   * Génère un profil de compétences
   */
  generateCompetenceProfile(candidate: Candidate): string {
    let profile = `PROFIL DE COMPÉTENCES\n\n`;

    profile += `SCORE GLOBAL : ${(this.calculateOverallSkillScore(candidate) * 100).toFixed(1)}%\n\n`;

    profile += `COMPÉTENCES FORTES :\n`;
    const strongest = this.identifyStrongestSkills(candidate, 3);
    strongest.forEach((node) => {
      profile += `  - ${node.name} : ${(node.confidence * 100).toFixed(1)}%\n`;
    });

    profile += `\nCOMPÉTENCES FAIBLES :\n`;
    const weakest = this.identifyWeakestSkills(candidate, 3);
    weakest.forEach((node) => {
      profile += `  - ${node.name} : ${(node.confidence * 100).toFixed(1)}%\n`;
    });

    profile += `\nCOMPÉTENCES À DÉVELOPPER :\n`;
    const toDevelop = this.identifySkillsToDevelop(candidate);
    toDevelop.forEach((skill) => {
      profile += `  - ${skill}\n`;
    });

    profile += `\nCOMPÉTENCES À EXPLOITER :\n`;
    const toLeverage = this.identifySkillsToLeverage(candidate);
    toLeverage.forEach((skill) => {
      profile += `  - ${skill}\n`;
    });

    return profile;
  }

  /**
   * Visualise le graphe de compétences
   */
  visualizeGraph(candidate: Candidate): string {
    let visualization = `VISUALISATION DU GRAPHE DE COMPÉTENCES\n\n`;

    // Afficher les compétences principales
    const mainSkills = ["LEADERSHIP", "COMMUNICATION", "EXECUTION", "INTELLIGENCE_EMOTIONNELLE"];

    mainSkills.forEach((skill) => {
      const node = candidate.skillGraph.nodes.get(skill);
      if (node) {
        const confidenceValue = node.confidence * 100;
        const confidence = confidenceValue.toFixed(0);
        const bar = "█".repeat(Math.floor(confidenceValue / 10)) + "░".repeat(10 - Math.floor(confidenceValue / 10));
        visualization += `${skill.padEnd(25)} ${bar} ${confidence}%\n`;
      }
    });

    return visualization;
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
            children: ["LEADERSHIP_DECISION", "LEADERSHIP_INFLUENCE"],
            weight: 1.0,
            confidence: 0.75,
          }],
          ["COMMUNICATION", {
            id: "COMMUNICATION",
            name: "Communication",
            parent: undefined,
            children: ["COMMUNICATION_CLARITY", "COMMUNICATION_LISTENING"],
            weight: 1.0,
            confidence: 0.65,
          }],
          ["EXECUTION", {
            id: "EXECUTION",
            name: "Exécution",
            parent: undefined,
            children: ["EXECUTION_PRIORITATION", "EXECUTION_DELIVERY"],
            weight: 1.0,
            confidence: 0.80,
          }],
          ["INTELLIGENCE_EMOTIONNELLE", {
            id: "INTELLIGENCE_EMOTIONNELLE",
            name: "Intelligence Émotionnelle",
            parent: undefined,
            children: ["IE_SELF_AWARENESS", "IE_EMPATHY"],
            weight: 1.0,
            confidence: 0.55,
          }],
        ]),
        edges: new Map([
          ["LEADERSHIP", [
            { from: "LEADERSHIP", to: "LEADERSHIP_DECISION", weight: 0.85 },
            { from: "LEADERSHIP", to: "LEADERSHIP_INFLUENCE", weight: 0.75 },
          ]],
        ]),
      },
      growthProfile: {
        id: "GROWTH_001",
        skills: new Map(),
      },
    };

    logInfo("=== Analyse du graphe de compétences ===");
    logInfo(this.analyzeCompetenceGraph(candidate));

    logInfo("\n=== Profil de compétences ===");
    logInfo(this.generateCompetenceProfile(candidate));

    logInfo("\n=== Comparaison avec l'archétype ===");
    logInfo(this.compareWithArchetype(candidate));

    logInfo("\n=== Visualisation du graphe ===");
    logInfo(this.visualizeGraph(candidate));
  }
}

export const competenceGraphEngine = CompetenceGraphEngine.getInstance();
