/**
 * TRAJECTOIRE · HIIOS v4.0
 * KernelState — Registre central
 * File: layer0-kernel/KernelState.ts
 */

import { EvidenceEngine }    from './EvidenceEngine';
import { HypothesisEngine }  from './HypothesisEngine';
import { QuestionPlanner }   from './QuestionPlanner';
import { SkillGraph }        from './SkillGraph';
import { DecisionLedger }    from '../layer5-decision/DecisionLedger';

// ──────────────────────────────────────────────────────────
// SESSION — ÉTAT D'UN ENTRETIEN
// ──────────────────────────────────────────────────────────

export interface InterviewSession {
  id               : string;
  candidate_id     : string;
  started_at       : Date;
  ended_at        ?: Date;
  current_turn     : number;
  interview_state  : InterviewState;
  empathy_level    : number;          // 0.0 → 1.0
  pressure_level   : number;          // 0.0 → 1.0
  archetype       ?: string;
  is_active        : boolean;
}

export type InterviewState =
  | 'CALIBRATION'
  | 'EXPLORATION'
  | 'PRECISION'
  | 'JUSTIFICATION'
  | 'CONTRADICTION'
  | 'PRESSION'
  | 'REFLEXION'
  | 'COMPLETED';

// ──────────────────────────────────────────────────────────
// TOUR — ENREGISTREMENT D'UN ÉCHANGE
// ──────────────────────────────────────────────────────────

export interface Turn {
  id                   : number;
  session_id           : string;
  interview_state      : InterviewState;
  question_asked       : string;
  question_id          : string;
  candidate_response   : string;
  recorded_at          : Date;
  evidence_ids_added   : string[];
  hypotheses_updated   : HypothesisUpdate[];
  bias_events          : string[];
  empathy_level        : number;
  pressure_level       : number;
  information_gain     : number;
}

export interface HypothesisUpdate {
  hypothesis_id : string;
  label         : string;
  before        : number;
  after         : number;
  delta         : number;
  trigger       : string;
}

// ──────────────────────────────────────────────────────────
// KERNEL STATE
// ──────────────────────────────────────────────────────────

export class KernelState {

  readonly session       : InterviewSession;
  readonly evidence      : EvidenceEngine;
  readonly hypothesis    : HypothesisEngine;
  readonly questions     : QuestionPlanner;
  readonly skills        : SkillGraph;
  readonly decision      : DecisionLedger;

  private timeline       : Turn[] = [];
  private biasLog        : BiasEvent[] = [];

  constructor(sessionId: string, candidateId: string) {

    // 1. Session
    this.session = {
      id              : sessionId,
      candidate_id    : candidateId,
      started_at      : new Date(),
      current_turn    : 0,
      interview_state : 'CALIBRATION',
      empathy_level   : 0.50,
      pressure_level  : 0.20,
      is_active       : true,
    };

    // 2. Moteurs — ordre d'instanciation important
    this.evidence   = new EvidenceEngine(sessionId);
    this.hypothesis = new HypothesisEngine(this.evidence);
    this.skills     = new SkillGraph(this.evidence);
    this.questions  = new QuestionPlanner(this.hypothesis, this.evidence);
    this.decision   = new DecisionLedger(this.hypothesis, this.evidence, this.skills);
  }

  // ────────────────────────────────────────────────────────
  // ENREGISTRER UN TOUR
  // ────────────────────────────────────────────────────────

  recordTurn(input: Omit<Turn, 'id' | 'session_id' | 'recorded_at'>): Turn {

    const turn: Turn = {
      ...input,
      id         : this.session.current_turn + 1,
      session_id : this.session.id,
      recorded_at: new Date(),
    };

    this.timeline.push(turn);
    (this.session as any).current_turn = turn.id;

    return turn;
  }

  // ────────────────────────────────────────────────────────
  // TRANSITION D'ÉTAT
  // ────────────────────────────────────────────────────────

  transitionTo(newState: InterviewState): void {
    this.validateTransition(this.session.interview_state, newState);
    (this.session as any).interview_state = newState;
  }

  private validateTransition(from: InterviewState, to: InterviewState): void {
    const order: InterviewState[] = [
      'CALIBRATION', 'EXPLORATION', 'PRECISION',
      'JUSTIFICATION', 'CONTRADICTION', 'PRESSION',
      'REFLEXION', 'COMPLETED',
    ];
    const fromIdx = order.indexOf(from);
    const toIdx   = order.indexOf(to);

    // On peut avancer ou revenir d'un pas
    if (toIdx < fromIdx - 1 && to !== 'EXPLORATION') {
      throw new Error(
        `Transition invalide : ${from} → ${to}. ` +
        `Le retour en arrière est limité à un état.`
      );
    }

    // Vérification du Principe d'Or avant PRESSION
    if (to === 'PRESSION' && !this.principleOrRespected()) {
      throw new Error(
        `Transition vers PRESSION bloquée. ` +
        `Principe d'Or non respecté : ` +
        `pression ${this.session.pressure_level.toFixed(2)} > ` +
        `empathie ${this.session.empathy_level.toFixed(2)} + 0.10.`
      );
    }
  }

  // ────────────────────────────────────────────────────────
  // BIAIS
  // ────────────────────────────────────────────────────────

  recordBiasEvent(event: Omit<BiasEvent, 'id' | 'detected_at'>): BiasEvent {
    const biasEvent: BiasEvent = {
      ...event,
      id          : `bias_${Date.now()}`,
      detected_at : new Date(),
    };
    this.biasLog.push(biasEvent);

    // Appliquer la pénalité sur l'hypothèse concernée
    if (event.affected_hypothesis_id) {
      this.hypothesis.applyBiasPenalty(
        event.affected_hypothesis_id,
        event.confidence_penalty,
        event.bias_type,
        this.session.current_turn,
      );
    }

    return biasEvent;
  }

  hasPendingBias(): boolean {
    return this.biasLog.some(b => !b.resolved);
  }

  resolveBias(biasId: string): void {
    const bias = this.biasLog.find(b => b.id === biasId);
    if (bias) bias.resolved = true;
  }

  // ────────────────────────────────────────────────────────
  // PRINCIPE D'OR
  // ────────────────────────────────────────────────────────

  principleOrRespected(): boolean {
    return this.session.pressure_level <= this.session.empathy_level + 0.10;
  }

  adjustEmpathy(delta: number): void {
    const newLevel = Math.max(0, Math.min(1, this.session.empathy_level + delta));
    (this.session as any).empathy_level = newLevel;
  }

  adjustPressure(delta: number): void {
    const newLevel = Math.max(0, Math.min(1, this.session.pressure_level + delta));
    (this.session as any).pressure_level = newLevel;
  }

  // ────────────────────────────────────────────────────────
  // MISE À JOUR DU SKILL GRAPH
  // ────────────────────────────────────────────────────────

  refreshSkillGraph(): void {
    for (const node of this.skills.getAllNodes()) {
      this.skills.updateFromEvidence(node.id);
    }
  }

  // ────────────────────────────────────────────────────────
  // ACCÈS TIMELINE
  // ────────────────────────────────────────────────────────

  getTimeline(): Turn[]         { return [...this.timeline]; }
  getBiasLog():  BiasEvent[]    { return [...this.biasLog]; }
  getTurnById(id: number): Turn | undefined {
    return this.timeline.find(t => t.id === id);
  }
  getLastTurn(): Turn | undefined {
    return this.timeline[this.timeline.length - 1];
  }

  // ────────────────────────────────────────────────────────
  // TERMINER L'ENTRETIEN
  // ────────────────────────────────────────────────────────

  complete(): void {
    (this.session as any).interview_state = 'COMPLETED' as InterviewState;
    (this.session as any).ended_at        = new Date();
    (this.session as any).is_active       = false;
  }

  // ────────────────────────────────────────────────────────
  // SNAPSHOT — ÉTAT COMPLET À UN INSTANT T
  // ────────────────────────────────────────────────────────

  snapshot(): KernelSnapshot {
    return {
      session               : { ...this.session },
      active_hypotheses     : this.hypothesis.getActive().length,
      confirmed_hypotheses  : this.hypothesis.getByStatus('CONFIRMED').length,
      total_evidence        : this.evidence.getAll().length,
      skill_coverage        : this.skills.getCoveragePercent(),
      turns_completed       : this.session.current_turn,
      pending_bias          : this.hasPendingBias(),
      principle_or_ok       : this.principleOrRespected(),
      timeline_summary      : this.timeline.map(t => ({
        turn  : t.id,
        state : t.interview_state,
        gain  : t.information_gain,
      })),
    };
  }
}

// ──────────────────────────────────────────────────────────
// TYPES COMPLÉMENTAIRES
// ──────────────────────────────────────────────────────────

export interface BiasEvent {
  id                     : string;
  bias_type              : string;
  detected_at            : Date;
  turn                   : number;
  trigger                : string;
  affected_hypothesis_id : string;
  confidence_penalty     : number;
  mandatory_action       : string;
  resolved               : boolean;
}

export interface KernelSnapshot {
  session               : InterviewSession;
  active_hypotheses     : number;
  confirmed_hypotheses  : number;
  total_evidence        : number;
  skill_coverage        : number;
  turns_completed       : number;
  pending_bias          : boolean;
  principle_or_ok       : boolean;
  timeline_summary      : { turn: number; state: string; gain: number }[];
}
