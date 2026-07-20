/**
 * TRAJECTOIRE · HIIOS v4.0
 * Moteur 3 — Question Planner
 * File: layer0-kernel/QuestionPlanner.ts
 */

import { HypothesisEngine, Hypothesis } from './HypothesisEngine';
import { EvidenceEngine } from './EvidenceEngine';

// ──────────────────────────────────────────────────────────
// TYPES
// ──────────────────────────────────────────────────────────

export type QuestionCategory =
  | 'EXPLORATION'     // État 1 — Ouvrir l'espace
  | 'PRECISION'       // État 2 — Isoler la contribution
  | 'JUSTIFICATION'   // État 3 — Tester le raisonnement
  | 'CONTRADICTION'   // État 4 — Tester la flexibilité
  | 'PRESSION'        // État 5 — Tester la résilience
  | 'REFLEXION'       // État 6 — Tester la maturité
  | 'BIAS_CORRECTION' // Correction d'un biais détecté
  | 'COACHING';       // Question de développement

export type QuestionTechnique =
  | 'OPEN'             // Question ouverte
  | 'REFLECTIVE'       // Reformulation miroir
  | 'CONTRADICTORY'    // Contradiction directe
  | 'HYPOTHETICAL'     // Question hypothétique
  | 'BEHAVIORAL'       // Question comportementale (STAR)
  | 'PROJECTIVE'       // Projection dans le futur
  | 'SCALING';         // Mise à l'échelle (coaching)

// ──────────────────────────────────────────────────────────
// STRUCTURE D'UNE QUESTION PLANIFIÉE
// ──────────────────────────────────────────────────────────

export interface PlannedQuestion {
  id                      : string;
  text                    : string;           // Texte exact en français
  category                : QuestionCategory;
  technique               : QuestionTechnique;

  // Calcul d'information
  information_gain        : number;           // 0.0 → 1.0
  target_hypotheses       : string[];         // IDs des hypothèses ciblées
  target_skill_nodes      : string[];         // IDs des compétences ciblées
  uncertainty_reduction   : number;           // Réduction d'incertitude attendue

  // Contraintes
  required_interview_state: string;          // État minimum requis
  empathy_level_required  : number;           // 0.0 → 1.0
  pressure_level          : number;           // 0.0 → 1.0
  is_contradiction_trigger: boolean;          // Déclenche une contradiction
  is_bias_correction      : boolean;          // Corrige un biais
  bias_type_corrected    ?: string;

  // Candidat
  candidate_pool_size     : number;          // Nombre de questions candidates
  selected_at_turn       ?: number;
  selection_reason        : string;          // Pourquoi cette question a été choisie
}

// ──────────────────────────────────────────────────────────
// BANQUE DE QUESTIONS
// ──────────────────────────────────────────────────────────

// Structure d'une question dans la banque
interface QuestionTemplate {
  id              : string;
  text            : string;
  category        : QuestionCategory;
  technique       : QuestionTechnique;
  skill_nodes     : string[];
  interview_state : string;
  empathy_required: number;
  pressure_level  : number;
}

// Banque de questions en français
const QUESTION_BANK: QuestionTemplate[] = [

  // EXPLORATION
  {
    id              : 'q_exp_001',
    text            : 'Racontez-moi une situation récente où vous avez pris une décision difficile.',
    category        : 'EXPLORATION',
    technique       : 'BEHAVIORAL',
    skill_nodes     : ['leadership.decision', 'execution.incertitude'],
    interview_state : 'EXPLORATION',
    empathy_required: 0.30,
    pressure_level  : 0.20,
  },
  {
    id              : 'q_exp_002',
    text            : 'Parlez-moi d\'un moment où vous avez dû convaincre quelqu\'un qui n\'était pas d\'accord avec vous.',
    category        : 'EXPLORATION',
    technique       : 'BEHAVIORAL',
    skill_nodes     : ['leadership.influence', 'communication.desaccord'],
    interview_state : 'EXPLORATION',
    empathy_required: 0.30,
    pressure_level  : 0.20,
  },
  {
    id              : 'q_exp_003',
    text            : 'Décrivez-moi une période professionnelle où vous avez appris quelque chose d\'important sur vous-même.',
    category        : 'EXPLORATION',
    technique       : 'OPEN',
    skill_nodes     : ['intelligence_emotionnelle.conscienceSoi'],
    interview_state : 'EXPLORATION',
    empathy_required: 0.40,
    pressure_level  : 0.15,
  },

  // PRÉCISION
  {
    id              : 'q_pre_001',
    text            : 'Qu\'avez-vous réellement fait, vous personnellement, dans cette situation ?',
    category        : 'PRECISION',
    technique       : 'OPEN',
    skill_nodes     : ['execution.livraison'],
    interview_state : 'PRECISION',
    empathy_required: 0.35,
    pressure_level  : 0.30,
  },
  {
    id              : 'q_pre_002',
    text            : 'Quelle était votre décision la plus difficile dans ce projet — celle où vous auriez pu vous tromper ?',
    category        : 'PRECISION',
    technique       : 'BEHAVIORAL',
    skill_nodes     : ['leadership.decision', 'execution.incertitude'],
    interview_state : 'PRECISION',
    empathy_required: 0.40,
    pressure_level  : 0.35,
  },

  // JUSTIFICATION
  {
    id              : 'q_jus_001',
    text            : 'Pourquoi ce choix-là et pas un autre ?',
    category        : 'JUSTIFICATION',
    technique       : 'OPEN',
    skill_nodes     : ['leadership.decision'],
    interview_state : 'JUSTIFICATION',
    empathy_required: 0.40,
    pressure_level  : 0.40,
  },
  {
    id              : 'q_jus_002',
    text            : 'Sur quelle base avez-vous pris cette décision ? Qu\'est-ce qui comptait le plus pour vous ?',
    category        : 'JUSTIFICATION',
    technique       : 'OPEN',
    skill_nodes     : ['leadership.vision', 'execution.priorisation'],
    interview_state : 'JUSTIFICATION',
    empathy_required: 0.45,
    pressure_level  : 0.40,
  },

  // CONTRADICTION
  {
    id              : 'q_con_001',
    text            : 'Racontez-moi une situation où votre équipe a refusé votre décision.',
    category        : 'CONTRADICTION',
    technique       : 'CONTRADICTORY',
    skill_nodes     : ['leadership.responsabilisation', 'leadership.conflit'],
    interview_state : 'CONTRADICTION',
    empathy_required: 0.55,
    pressure_level  : 0.55,
  },
  {
    id              : 'q_con_002',
    text            : 'Dans quel contexte cette approche ne fonctionnerait-elle pas ?',
    category        : 'CONTRADICTION',
    technique       : 'HYPOTHETICAL',
    skill_nodes     : ['leadership.vision', 'intelligence_emotionnelle.conscienceSoi'],
    interview_state : 'CONTRADICTION',
    empathy_required: 0.50,
    pressure_level  : 0.50,
  },
  {
    id              : 'q_con_003',
    text            : 'Qu\'est-ce que votre équipe vous reprochait à l\'époque ?',
    category        : 'CONTRADICTION',
    technique       : 'CONTRADICTORY',
    skill_nodes     : ['intelligence_emotionnelle.conscienceSoi', 'leadership.conflit'],
    interview_state : 'CONTRADICTION',
    empathy_required: 0.60,
    pressure_level  : 0.55,
  },

  // PRESSION
  {
    id              : 'q_pre_p001',
    text            : 'Votre manager n\'était pas d\'accord avec vous. Qu\'avez-vous fait ?',
    category        : 'PRESSION',
    technique       : 'BEHAVIORAL',
    skill_nodes     : ['leadership.influence', 'intelligence_emotionnelle.regulation'],
    interview_state : 'PRESSION',
    empathy_required: 0.65,
    pressure_level  : 0.70,
  },
  {
    id              : 'q_pre_p002',
    text            : 'Racontez-moi la situation la plus difficile que vous ayez vécue professionnellement. Comment l\'avez-vous traversée ?',
    category        : 'PRESSION',
    technique       : 'BEHAVIORAL',
    skill_nodes     : ['intelligence_emotionnelle.resilience', 'execution.incertitude'],
    interview_state : 'PRESSION',
    empathy_required: 0.70,
    pressure_level  : 0.65,
  },

  // RÉFLEXION
  {
    id              : 'q_ref_001',
    text            : 'Avec le recul, referiez-vous exactement la même chose ?',
    category        : 'REFLEXION',
    technique       : 'PROJECTIVE',
    skill_nodes     : ['intelligence_emotionnelle.conscienceSoi', 'execution.apprentissage'],
    interview_state : 'REFLEXION',
    empathy_required: 0.60,
    pressure_level  : 0.40,
  },
  {
    id              : 'q_ref_002',
    text            : 'Qu\'est-ce que cette situation vous a appris sur votre manière de prendre vos décisions ?',
    category        : 'REFLEXION',
    technique       : 'SCALING',
    skill_nodes     : ['intelligence_emotionnelle.conscienceSoi', 'leadership.decision'],
    interview_state : 'REFLEXION',
    empathy_required: 0.60,
    pressure_level  : 0.35,
  },
];

// ──────────────────────────────────────────────────────────
// QUESTION PLANNER
// ──────────────────────────────────────────────────────────

export class QuestionPlanner {

  private hypothesisEngine  : HypothesisEngine;
  private evidenceEngine    : EvidenceEngine;
  private askedQuestionIds  : Set<string> = new Set();
  private lastSelected      : PlannedQuestion | null = null;
  private selectionHistory  : PlannedQuestion[] = [];

  constructor(
    hypothesisEngine: HypothesisEngine,
    evidenceEngine  : EvidenceEngine,
  ) {
    this.hypothesisEngine = hypothesisEngine;
    this.evidenceEngine   = evidenceEngine;
  }

  // ────────────────────────────────────────────────────────
  // SÉLECTIONNER LA PROCHAINE QUESTION
  // ────────────────────────────────────────────────────────

  selectNext(context: QuestionContext): PlannedQuestion {

    const candidates = this.buildCandidatePool(context);
    const scored     = this.scoreAndFilter(candidates, context);
    const selected   = scored[0];

    if (!selected) {
      return this.buildFallbackQuestion(context);
    }

    selected.selected_at_turn = context.current_turn;
    this.askedQuestionIds.add(selected.id);
    this.lastSelected = selected;
    this.selectionHistory.push(selected);

    return selected;
  }

  // ────────────────────────────────────────────────────────
  // CONSTRUIRE LE POOL DE CANDIDATES
  // ────────────────────────────────────────────────────────

  private buildCandidatePool(context: QuestionContext): QuestionTemplate[] {

    return QUESTION_BANK.filter(q => {

      // Ne pas reposer une question déjà posée
      if (this.askedQuestionIds.has(q.id)) return false;

      // Respecter l'état de l'entretien
      const stateCompatible = this.isStateCompatible(q.interview_state, context.interview_state);
      if (!stateCompatible) return false;

      // Respecter le Principe d'Or
      const principleOrRespected = context.empathy_level >= q.empathy_required - 0.10;
      if (!principleOrRespected) return false;

      // Vérifier que la question a des hypothèses à tester
      const hasTargets = q.skill_nodes.some(nodeId =>
        this.hypothesisEngine.getActive().some(h => h.skill_node_id === nodeId)
      );

      return hasTargets || q.category === 'EXPLORATION';
    });
  }

  // ────────────────────────────────────────────────────────
  // SCORER ET FILTRER
  // ────────────────────────────────────────────────────────

  private scoreAndFilter(
    candidates : QuestionTemplate[],
    context    : QuestionContext,
  ): PlannedQuestion[] {

    const scored = candidates.map(q => {
      const gain   = this.calculateInformationGain(q, context);
      const planned = this.buildPlannedQuestion(q, gain, context, candidates.length);
      return planned;
    });

    return scored.sort((a, b) => b.information_gain - a.information_gain);
  }

  // ────────────────────────────────────────────────────────
  // CALCUL D'INFORMATION GAIN
  // ────────────────────────────────────────────────────────

  private calculateInformationGain(
    question : QuestionTemplate,
    context  : QuestionContext,
  ): number {

    let gain = 0;

    // Gain de base selon la catégorie
    const categoryGain: Record<QuestionCategory, number> = {
      EXPLORATION     : 0.30,
      PRECISION       : 0.45,
      JUSTIFICATION   : 0.50,
      CONTRADICTION   : 0.65,
      PRESSION        : 0.60,
      REFLEXION       : 0.55,
      BIAS_CORRECTION : 0.70,
      COACHING        : 0.40,
    };
    gain += categoryGain[question.category] ?? 0.30;

    // Bonus si des hypothèses indiscernables sont ciblées
    const indistinguishable = this.hypothesisEngine.getIndistinguishable();
    for (const [h1, h2] of indistinguishable) {
      const targetsH1 = question.skill_nodes.includes(h1.skill_node_id);
      const targetsH2 = question.skill_nodes.includes(h2.skill_node_id);
      if (targetsH1 || targetsH2) {
        gain += 0.20;  // Bonus important : question qui distingue des hypothèses proches
      }
    }

    // Bonus si des compétences peu explorées sont ciblées
    for (const nodeId of question.skill_nodes) {
      const evidences = this.evidenceEngine.getForSkillNode(nodeId);
      if (evidences.length === 0) {
        gain += 0.15;  // Compétence non encore explorée
      } else if (evidences.length === 1) {
        gain += 0.08;  // Compétence peu explorée
      }
    }

    // Malus si la pression est trop élevée par rapport à l'empathie
    if (question.pressure_level > context.empathy_level + 0.10) {
      gain -= 0.30;
    }

    return Math.max(0, Math.min(1, gain));
  }

  // ────────────────────────────────────────────────────────
  // CONSTRUIRE UNE QUESTION PLANIFIÉE
  // ────────────────────────────────────────────────────────

  private buildPlannedQuestion(
    template         : QuestionTemplate,
    informationGain  : number,
    context          : QuestionContext,
    poolSize         : number,
  ): PlannedQuestion {

    const targetHypotheses = this.hypothesisEngine.getActive()
      .filter(h => template.skill_nodes.includes(h.skill_node_id))
      .map(h => h.id);

    const indistinguishable = this.hypothesisEngine.getIndistinguishable();
    const distinctionPairs  = indistinguishable
      .filter(([h1, h2]) =>
        template.skill_nodes.includes(h1.skill_node_id) ||
        template.skill_nodes.includes(h2.skill_node_id)
      );

    let selectionReason = `Information Gain : ${informationGain.toFixed(2)}.`;
    if (distinctionPairs.length > 0) {
      const labels = distinctionPairs[0].map(h => h.label).join(' et ');
      selectionReason += ` Distingue ${labels}.`;
    }
    if (template.skill_nodes.some(n => this.evidenceEngine.getForSkillNode(n).length === 0)) {
      selectionReason += ` Explore une compétence non encore couverte.`;
    }

    return {
      id                      : template.id,
      text                    : template.text,
      category                : template.category,
      technique               : template.technique,
      information_gain        : informationGain,
      target_hypotheses       : targetHypotheses,
      target_skill_nodes      : template.skill_nodes,
      uncertainty_reduction   : informationGain * 0.8,
      required_interview_state: template.interview_state,
      empathy_level_required  : template.empathy_required,
      pressure_level          : template.pressure_level,
      is_contradiction_trigger: template.category === 'CONTRADICTION',
      is_bias_correction      : template.category === 'BIAS_CORRECTION',
      candidate_pool_size     : poolSize,
      selection_reason        : selectionReason,
    };
  }

  private buildFallbackQuestion(context: QuestionContext): PlannedQuestion {
    return {
      id                      : 'fallback',
      text                    : 'Qu\'est-ce qui vous a amené à postuler pour ce poste ?',
      category                : 'EXPLORATION',
      technique               : 'OPEN',
      information_gain        : 0.20,
      target_hypotheses       : [],
      target_skill_nodes      : [],
      uncertainty_reduction   : 0.15,
      required_interview_state: 'EXPLORATION',
      empathy_level_required  : 0.30,
      pressure_level          : 0.15,
      is_contradiction_trigger: false,
      is_bias_correction      : false,
      candidate_pool_size     : 0,
      selection_reason        : 'Question de secours. Aucune question disponible dans le pool.',
    };
  }

  private isStateCompatible(
    required : string,
    current  : string,
  ): boolean {
    const order = ['CALIBRATION', 'EXPLORATION', 'PRECISION', 'JUSTIFICATION', 'CONTRADICTION', 'PRESSION', 'REFLEXION'];
    const reqIdx = order.indexOf(required);
    const curIdx = order.indexOf(current);
    return curIdx >= reqIdx - 1;  // Tolérance d'un état
  }

  getLastSelected(): PlannedQuestion | null { return this.lastSelected; }
  getSelectionHistory(): PlannedQuestion[]  { return [...this.selectionHistory]; }

  getAllOpenWithGain(): PlannedQuestion[] {
    return QUESTION_BANK
      .filter(q => !this.askedQuestionIds.has(q.id))
      .map(q => this.buildPlannedQuestion(q, 0.30, {} as QuestionContext, 0))
      .sort((a, b) => b.information_gain - a.information_gain);
  }

  // ────────────────────────────────────────────────────────
  // RAPPORT
  // ────────────────────────────────────────────────────────

  formatSelectionReport(): string {
    const lines: string[] = [];
    lines.push(`╔${'═'.repeat(74)}╗`);
    lines.push(`║  QUESTIONS POSÉES · TRAJECTOIRE${' '.repeat(42)}║`);
    lines.push(`╠${'═'.repeat(74)}╣`);

    for (const [i, q] of this.selectionHistory.entries()) {
      const gain = `IG:${q.information_gain.toFixed(2)}`;
      lines.push(`║  ${String(i + 1).padEnd(3)} Tour ${String(q.selected_at_turn ?? 0).padEnd(3)} [${q.category.padEnd(15)}] ${gain.padEnd(8)}║`);
      lines.push(`║      "${q.text.slice(0, 64).padEnd(64)}"  ║`);
    }

    lines.push(`╚${'═'.repeat(74)}╝`);
    return lines.join('\n');
  }
}

// ──────────────────────────────────────────────────────────
// CONTEXTE DE SÉLECTION
// ──────────────────────────────────────────────────────────

export interface QuestionContext {
  current_turn        : number;
  interview_state     : string;
  empathy_level       : number;
  pressure_level      : number;
  active_bias_types   : string[];
  candidate_archetype: string;
}
