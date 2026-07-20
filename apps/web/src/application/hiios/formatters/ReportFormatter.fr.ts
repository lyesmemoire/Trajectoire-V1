/**
 * TRAJECTOIRE · HIIOS v4.0
 * Formatter de rapports en français
 * File: formatters/ReportFormatter.fr.ts
 */

import { fr } from '../../../i18n/fr';

// Interfaces pour les rapports (simplifiées pour le formatter)
interface HiringDecision {
  recommendation: 'HIRE' | 'NO_HIRE' | 'DEFER';
  confidence_score: number;
  probability_success: number;
  false_positive_risk: number;
  false_negative_risk: number;
  evidence_coverage: number;
  remaining_uncertainty: number;
  strong_signals: Array<{ description: string }>;
  weak_signals: Array<{ description: string }>;
  reasoning: string;
}

interface ProgressionReport {
  demonstrated_strengths: Array<{ description: string; evidence_quote: string }>;
  underdemonstrated_skills: Array<{ description: string }>;
  limiting_beliefs: Array<{ description: string }>;
  progression_plan: Array<{ week: number; action: string; skill_targeted: string }>;
  final_message: string;
}

export class ReportFormatterFr {

  // ──────────────────────────────────────────────────────────
  // RAPPORT DE DÉCISION
  // ──────────────────────────────────────────────────────────

  formatDecision(decision: HiringDecision): string {
    const lines: string[] = [];
    const labels = fr.decisionLabels;

    lines.push(`╔${'═'.repeat(74)}╗`);
    lines.push(`║  ${fr.reports.decision.title.toUpperCase()}${' '.repeat(74 - fr.reports.decision.title.length - 4)}║`);
    lines.push(`║  ${fr.reports.decision.subtitle}${' '.repeat(74 - fr.reports.decision.subtitle.length - 4)}║`);
    lines.push(`╠${'═'.repeat(74)}╣`);
    lines.push(`║                                                                          ║`);
    lines.push(`║  ${fr.decisions[decision.recommendation]}${' '.repeat(74 - fr.decisions[decision.recommendation].length - 4)}║`);
    lines.push(`║                                                                          ║`);
    lines.push(`╠${'═'.repeat(74)}╣`);
    lines.push(`║  ${labels.confidence.padEnd(30)} : ${(decision.confidence_score * 100).toFixed(0)}%${' '.repeat(38)}║`);
    lines.push(`║  ${labels.probabiliteSucces.padEnd(30)} : ${(decision.probability_success * 100).toFixed(0)}%${' '.repeat(38)}║`);
    lines.push(`║  ${labels.risqueFauxPositif.padEnd(30)} : ${(decision.false_positive_risk * 100).toFixed(0)}%${' '.repeat(38)}║`);
    lines.push(`║  ${labels.risqueFauxNegatif.padEnd(30)} : ${(decision.false_negative_risk * 100).toFixed(0)}%${' '.repeat(38)}║`);
    lines.push(`║  ${labels.couvertureProfil.padEnd(30)} : ${(decision.evidence_coverage * 100).toFixed(0)}%${' '.repeat(38)}║`);
    lines.push(`║  ${labels.incertitudeResiduelle.padEnd(30)} : ${(decision.remaining_uncertainty * 100).toFixed(0)}%${' '.repeat(38)}║`);
    lines.push(`╠${'═'.repeat(74)}╣`);
    lines.push(`║  ${labels.signauxForts.toUpperCase()}${' '.repeat(74 - labels.signauxForts.length - 4)}║`);
    lines.push(`╠${'═'.repeat(74)}╣`);

    for (const signal of decision.strong_signals) {
      lines.push(`║  · ${this.truncate(signal.description, 70)}${' '.repeat(Math.max(0, 70 - signal.description.length))}║`);
    }

    lines.push(`╠${'═'.repeat(74)}╣`);
    lines.push(`║  ${labels.signauxFaibles.toUpperCase()}${' '.repeat(74 - labels.signauxFaibles.length - 4)}║`);
    lines.push(`╠${'═'.repeat(74)}╣`);

    for (const signal of decision.weak_signals) {
      lines.push(`║  · ${this.truncate(signal.description, 70)}${' '.repeat(Math.max(0, 70 - signal.description.length))}║`);
    }

    lines.push(`╠${'═'.repeat(74)}╣`);
    lines.push(`║  ${labels.raisonnement.toUpperCase()}${' '.repeat(74 - labels.raisonnement.length - 4)}║`);
    lines.push(`╠${'═'.repeat(74)}╣`);
    lines.push(`║  ${this.truncate(decision.reasoning, 72)}${' '.repeat(Math.max(0, 72 - decision.reasoning.length))}║`);
    lines.push(`╚${'═'.repeat(74)}╝`);

    return lines.join('\n');
  }

  // ──────────────────────────────────────────────────────────
  // RAPPORT DE PROGRESSION
  // ──────────────────────────────────────────────────────────

  formatProgression(report: ProgressionReport): string {
    const lines: string[] = [];
    const s = fr.reports.progression.sections;
    const plan = fr.reports.progression.planLabels;

    lines.push(`╔${'═'.repeat(74)}╗`);
    lines.push(`║  ${fr.reports.progression.title.toUpperCase()}${' '.repeat(74 - fr.reports.progression.title.length - 4)}║`);
    lines.push(`║  ${fr.reports.progression.subtitle}${' '.repeat(74 - fr.reports.progression.subtitle.length - 4)}║`);
    lines.push(`╠${'═'.repeat(74)}╣`);

    // Section 1 — Forces
    lines.push(`║  1. ${s.forcesProuvees.toUpperCase()}${' '.repeat(74 - s.forcesProuvees.length - 7)}║`);
    lines.push(`╠${'═'.repeat(74)}╣`);
    for (const force of report.demonstrated_strengths) {
      lines.push(`║  ✓ ${this.truncate(force.description, 70)}${' '.repeat(Math.max(0, 70 - force.description.length))}║`);
      lines.push(`║    Preuve : "${this.truncate(force.evidence_quote, 64)}"${' '.repeat(Math.max(0, 64 - force.evidence_quote.length))}║`);
    }

    // Section 2 — Compétences à améliorer
    lines.push(`╠${'═'.repeat(74)}╣`);
    lines.push(`║  2. ${s.competencesAmeliorer.toUpperCase()}${' '.repeat(74 - s.competencesAmeliorer.length - 7)}║`);
    lines.push(`╠${'═'.repeat(74)}╣`);
    lines.push(`║  ${fr.reports.progression.notes.competencesNote}${' '.repeat(10)}║`);
    for (const comp of report.underdemonstrated_skills) {
      lines.push(`║  → ${this.truncate(comp.description, 70)}${' '.repeat(Math.max(0, 70 - comp.description.length))}║`);
    }

    // Section 3 — Croyances limitantes
    lines.push(`╠${'═'.repeat(74)}╣`);
    lines.push(`║  3. ${s.croyancesLimitantes.toUpperCase()}${' '.repeat(74 - s.croyancesLimitantes.length - 7)}║`);
    lines.push(`╠${'═'.repeat(74)}╣`);
    lines.push(`║  ${fr.reports.progression.notes.croyancesNote}${' '.repeat(10)}║`);
    for (const croyance of report.limiting_beliefs) {
      lines.push(`║  ⚠ ${this.truncate(croyance.description, 70)}${' '.repeat(Math.max(0, 70 - croyance.description.length))}║`);
    }

    // Section 8 — Plan de progression
    lines.push(`╠${'═'.repeat(74)}╣`);
    lines.push(`║  8. ${s.planProgression.toUpperCase()}${' '.repeat(74 - s.planProgression.length - 7)}║`);
    lines.push(`╠${'═'.repeat(74)}╣`);
    for (const step of report.progression_plan) {
      lines.push(`║  ${plan.semaine} ${step.week} · ${step.action}${' '.repeat(Math.max(0, 60 - step.action.length))}║`);
      lines.push(`║    ${plan.cible} : ${step.skill_targeted}${' '.repeat(Math.max(0, 58 - step.skill_targeted.length))}║`);
    }

    // Section 9 — Message final
    lines.push(`╠${'═'.repeat(74)}╣`);
    lines.push(`║  ${s.messageFinal.toUpperCase()}${' '.repeat(74 - s.messageFinal.length - 4)}║`);
    lines.push(`╠${'═'.repeat(74)}╣`);
    lines.push(`║  ${this.truncate(report.final_message, 72)}${' '.repeat(Math.max(0, 72 - report.final_message.length))}║`);
    lines.push(`╚${'═'.repeat(74)}╝`);

    return lines.join('\n');
  }

  private truncate(str: string, max: number): string {
    return str.length <= max ? str : str.slice(0, max - 3) + '...';
  }
}
