/**
 * TRAJECTOIRE · HIIOS v4.0
 * Moteur 1 — Evidence Engine
 * File: layer0-kernel/EvidenceEngine.ts
 */

import {
  Evidence,
  EvidenceType,
  EvidenceReliability,
  EvidenceDirection,
} from "../interfaces/IHIIOSKernel";

// Poids maximum par type de preuve
const EVIDENCE_MAX_WEIGHT: Record<EvidenceType, number> = {
  CITATION : 0.90,
  BEHAVIOR : 0.70,
  ABSENCE  : 0.40,
  PATTERN  : 0.85,
};

// ──────────────────────────────────────────────────────────
// EVIDENCE STORE
// ──────────────────────────────────────────────────────────

export interface EvidenceStore {
  session_id: string;
  evidences: Evidence[];
  created_at: Date;
  updated_at: Date;
}

// ──────────────────────────────────────────────────────────
// EVIDENCE GRAPH — Types
// ──────────────────────────────────────────────────────────

// Canonical Reference: BCM-GRAPH-003 (blueprint.graph.evidence)
// Owner: Chief Cognitive Architect
export interface EvidenceGraph {
  nodes: EvidenceGraphNode[];
  edges: EvidenceGraphEdge[];
  generated_at: Date;
}

export interface EvidenceGraphNode {
  id: string;
  type: 'EVIDENCE' | 'HYPOTHESIS' | 'SKILL_NODE';
  label: string;
  weight: number;
  reliability?: EvidenceReliability;
}

export interface EvidenceGraphEdge {
  from: string;
  to: string;
  direction: EvidenceDirection;
  weight: number;
}

// ──────────────────────────────────────────────────────────
// EVIDENCE ENGINE
// ──────────────────────────────────────────────────────────

export class EvidenceEngine {

  private store: EvidenceStore;

  constructor(sessionId: string) {
    this.store = {
      session_id: sessionId,
      evidences: [],
      created_at: new Date(),
      updated_at: new Date(),
    };
  }

  // ────────────────────────────────────────────────────────
  // AJOUTER UNE PREUVE
  // ────────────────────────────────────────────────────────

  add(input: Omit<Evidence, 'id' | 'timestamp'>): Evidence {

    this.validateWeight(input.type, input.weight);

    const evidence: Evidence = {
      ...input,
      id: this.generateId(),
      timestamp: Date.now(),
    };

    this.store.evidences.push(evidence);
    this.store.updated_at = new Date();

    return evidence;
  }

  // ────────────────────────────────────────────────────────
  // REQUÊTES
  // ────────────────────────────────────────────────────────

  getAll(): Evidence[] {
    return [...this.store.evidences];
  }

  getByTurn(turn: number): Evidence[] {
    return this.store.evidences.filter(e => e.turn === turn);
  }

  getByType(type: EvidenceType): Evidence[] {
    return this.store.evidences.filter(e => e.type === type);
  }

  getByReliability(reliability: EvidenceReliability): Evidence[] {
    return this.store.evidences.filter(e => e.reliability === reliability);
  }

  getForHypothesis(hypothesisId: string): Evidence[] {
    return this.store.evidences.filter(
      e => e.hypothesesImpacted.includes(hypothesisId)
        && e.direction === EvidenceDirection.CONFIRMS
    );
  }

  getAgainstHypothesis(hypothesisId: string): Evidence[] {
    return this.store.evidences.filter(
      e => e.hypothesesImpacted.includes(hypothesisId)
        && e.direction === EvidenceDirection.INFIRMS
    );
  }

  getForSkillNode(nodeId: string): Evidence[] {
    return this.store.evidences.filter(
      e => e.skillsImpacted.includes(nodeId)
    );
  }

  getTopByWeight(n: number): Evidence[] {
    return [...this.store.evidences]
      .sort((a, b) => b.weight - a.weight)
      .slice(0, n);
  }

  getPatterns(): Evidence[] {
    return this.store.evidences.filter(e => e.type === EvidenceType.PATTERN);
  }

  // ────────────────────────────────────────────────────────
  // STATISTIQUES
  // ────────────────────────────────────────────────────────

  getTotalWeight(): number {
    return this.store.evidences.reduce((sum, e) => sum + e.weight, 0);
  }

  getWeightForHypothesis(hypothesisId: string): number {
    const confirming = this.getForHypothesis(hypothesisId);
    const infirming = this.getAgainstHypothesis(hypothesisId);
    const positiveSum = confirming.reduce((s, e) => s + e.weight, 0);
    const negativeSum = infirming.reduce((s, e) => s + e.weight, 0);
    return positiveSum - negativeSum;
  }

  countByType(): Record<EvidenceType, number> {
    return {
      CITATION: this.getByType(EvidenceType.CITATION).length,
      BEHAVIOR: this.getByType(EvidenceType.BEHAVIOR).length,
      ABSENCE: this.getByType(EvidenceType.ABSENCE).length,
      PATTERN: this.getByType(EvidenceType.PATTERN).length,
    };
  }

  // ────────────────────────────────────────────────────────
  // EVIDENCE GRAPH
  // Graphe relationnel : preuve → hypothèse → compétence
  // ────────────────────────────────────────────────────────

  buildEvidenceGraph(): EvidenceGraph {

    const nodes: EvidenceGraphNode[] = this.store.evidences.map(e => ({
      id: e.id,
      type: 'EVIDENCE' as const,
      label: this.truncate(e.rawContent, 50),
      weight: e.weight,
      reliability: e.reliability,
    }));

    const edges: EvidenceGraphEdge[] = [];

    for (const evidence of this.store.evidences) {
      for (const hypId of evidence.hypothesesImpacted) {
        edges.push({
          from: evidence.id,
          to: hypId,
          direction: evidence.direction,
          weight: evidence.weight,
        });
      }
      for (const nodeId of evidence.skillsImpacted) {
        edges.push({
          from: evidence.id,
          to: nodeId,
          direction: evidence.direction,
          weight: evidence.weight,
        });
      }
    }

    return { nodes, edges, generated_at: new Date() };
  }

  // ────────────────────────────────────────────────────────
  // RAPPORT FORMATÉ EN FRANÇAIS
  // ────────────────────────────────────────────────────────

  formatReport(): string {
    const lines: string[] = [];
    const counts = this.countByType();
    const top5 = this.getTopByWeight(5);

    lines.push(`╔${'═'.repeat(74)}╗`);
    lines.push(`║  CARTE DES PREUVES · TRAJECTOIRE${' '.repeat(40)}║`);
    lines.push(`╠${'═'.repeat(74)}╣`);
    lines.push(`║  Total : ${this.store.evidences.length} preuves accumulées${' '.repeat(46 - String(this.store.evidences.length).length)}║`);
    lines.push(`╠${'═'.repeat(74)}╣`);
    lines.push(`║  Citations directes  : ${String(counts.CITATION).padEnd(4)} · Schémas répétés : ${String(counts.PATTERN).padEnd(4)}  ║`);
    lines.push(`║  Comportements       : ${String(counts.BEHAVIOR).padEnd(4)} · Absences        : ${String(counts.ABSENCE).padEnd(4)}  ║`);
    lines.push(`╠${'═'.repeat(74)}╣`);
    lines.push(`║  CINQ PREUVES LES PLUS IMPORTANTES${' '.repeat(38)}║`);
    lines.push(`╠${'═'.repeat(74)}╣`);

    for (const [i, ev] of top5.entries()) {
      const bar = this.progressBar(ev.weight, 15);
      lines.push(`║  ${i + 1}. Tour ${String(ev.turn).padEnd(2)} · ${ev.type.padEnd(8)} ${bar} ${ev.weight.toFixed(2)} · ${ev.reliability.padEnd(6)}║`);
      lines.push(`║     "${this.truncate(ev.rawContent, 68)}"${' '.repeat(Math.max(0, 68 - ev.rawContent.length))}║`);
    }

    lines.push(`╚${'═'.repeat(74)}╝`);
    return lines.join('\n');
  }

  // ────────────────────────────────────────────────────────
  // UTILITAIRES
  // ────────────────────────────────────────────────────────

  private validateWeight(type: EvidenceType, weight: number): void {
    const max = EVIDENCE_MAX_WEIGHT[type];
    if (weight < 0 || weight > max) {
      throw new Error(
        `Poids invalide pour le type ${type} : ${weight}. Maximum autorisé : ${max}.`
      );
    }
  }

  private generateId(): string {
    return `ev_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
  }

  private truncate(str: string, max: number): string {
    return str.length <= max ? str : str.slice(0, max - 3) + '...';
  }

  private progressBar(value: number, width: number): string {
    const filled = Math.round(value * width);
    return `[${'█'.repeat(filled)}${'░'.repeat(width - filled)}]`;
  }
}
