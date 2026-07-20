/**
 * Learning Engine - Layer 8
 * Moteur d'apprentissage selon les spécifications HIIOS v4.0
 * Outcome-Based Learning · Equitable Weight Adjustment · Human-Reviewed
 * Audit Trail · Bias-Safe Updates · Minimum Statistical Threshold
 */

import { EvidenceType, BiasType } from '../interfaces/IHIIOSKernel';

// ============================================================================
// KERNEL STATE — Interface simplifiée pour Learning Engine
// ============================================================================

interface KernelState {
  memory_store: {
    getArchetypeForSession(sessionId: string): string;
  };
  bias_engine: {
    getCurrentExposure(targetId: string): number;
    getAffectedBiasTypes(targetId: string): BiasType[];
    sessionHadBiasType(sessionId: string, biasType: BiasType): boolean;
    correctionImprovedOutcome(sessionId: string, biasType: BiasType, outcomeScore: number): boolean;
  };
  weights_registry: {
    loadCurrent(): ActiveWeights | null;
    update(targetId: string, value: number, proposalId: string): void;
  };
}

// ============================================================================
// TYPES — OUTCOMES
// ============================================================================

export type OutcomeType =
  | 'SUCCESS'          // Candidat recruté · Performant à 12 mois
  | 'PARTIAL'          // Recruté · Performance mitigée
  | 'FAILURE'          // Recruté · Échec avéré
  | 'FALSE_POSITIVE'   // Recruté à tort · Erreur du système
  | 'FALSE_NEGATIVE'   // Non recruté à tort · Erreur du système
  | 'DEFERRED_SUCCESS' // DEFER → recruté ailleurs → succès confirmé

export type AdjustmentStatus =
  | 'PENDING_REVIEW'   // Calculé · En attente de validation humaine
  | 'APPROVED'         // Validé par un humain · Appliqué
  | 'REJECTED'         // Refusé · Raison documentée
  | 'APPLIED'          // Intégré dans les poids actifs
  | 'ROLLED_BACK'      // Appliqué puis annulé

export type LearningRiskLevel =
  | 'SAFE'             // Ajustement mineur · Sans risque de biais
  | 'MONITORED'        // À surveiller · Nécessite audit
  | 'HIGH_RISK'        // Risque de biais systématique · Bloqué
  | 'BLOCKED'          // Refusé automatiquement · Contraint par équité

// ============================================================================
// OUTCOME — RÉSULTAT OBSERVÉ
// ============================================================================

export interface CandidateOutcome {
  id                    : string
  candidate_id          : string
  interview_session_id  : string
  recorded_at           : Date
  observed_at           : Date            // Date de l'observation terrain

  // Recommandation initiale du système
  recommendation_made   : 'HIRE' | 'NO_HIRE' | 'DEFER'
  confidence_at_t0      : number
  risk_matrix_at_t0     : RiskSnapshot[]

  // Résultat réel à T+12 mois
  outcome_type          : OutcomeType
  outcome_details       : string
  outcome_score         : number          // 0.0 → 1.0

  // Analyse comparative
  skills_confirmed      : SkillOutcome[]  // Prédites correctement
  skills_overestimated  : SkillOutcome[]  // Surestimées par le système
  skills_underestimated : SkillOutcome[]  // Sous-estimées par le système
  risks_realized        : RiskSnapshot[]  // Risques qui se sont matérialisés
  risks_not_realized    : RiskSnapshot[]  // Risques qui ne se sont pas réalisés

  // Contexte
  recruiter_id          : string
  position_type         : string
  seniority_level       : string
  industry              : string

  // Validation humaine
  validated_by          : string
  validated_at          : Date
  validation_notes      : string
}

export interface SkillOutcome {
  skill_node_id         : string
  label                 : string
  predicted_score       : number
  actual_score          : number
  delta                 : number          // actual - predicted
  evidence_types_used   : EvidenceType[]
}

export interface RiskSnapshot {
  risk_type             : string
  probability_predicted : number
  materialized          : boolean
  impact_observed      ?: string
}

// ============================================================================
// WEIGHT ADJUSTMENT — PROPOSITION D'AJUSTEMENT
// ============================================================================

export interface WeightAdjustmentProposal {
  id                    : string
  generated_at          : Date
  outcome_ids           : string[]        // Outcomes qui ont déclenché cet ajustement
  sample_size           : number          // Nombre d'observations convergentes

  // Cible de l'ajustement
  target_type           : AdjustmentTargetType
  target_id             : string          // ID du poids cible
  target_label          : string          // Label lisible

  // Valeurs
  current_value         : number
  proposed_value        : number
  delta                 : number          // proposed - current
  delta_percent         : number          // |delta / current| × 100

  // Justification
  reasoning             : string          // Pourquoi cet ajustement ?
  supporting_outcomes   : OutcomeSummary[]
  statistical_confidence: number          // Confiance statistique

  // Évaluation des risques
  risk_level            : LearningRiskLevel
  equity_check          : EquityCheckResult
  bias_impact_assessment: BiasImpactAssessment

  // Workflow de validation
  status                : AdjustmentStatus
  reviewed_by          ?: string
  reviewed_at          ?: Date
  review_notes         ?: string
  applied_at           ?: Date
  rolled_back_at       ?: Date
  rollback_reason      ?: string
}

export type AdjustmentTargetType =
  | 'EVIDENCE_WEIGHT'        // Poids d'un type de preuve
  | 'PRIOR_BY_ARCHETYPE'     // Prior pour un archétype donné
  | 'PRIOR_BY_SENIORITY'     // Prior pour un niveau de séniorité
  | 'BIAS_PENALTY'           // Pénalité d'un type de biais
  | 'CONFIDENCE_THRESHOLD'   // Seuil de confiance pour une transition
  | 'INFORMATION_GAIN_WEIGHT'// Poids dans le calcul d'Information Gain

export interface OutcomeSummary {
  outcome_id            : string
  outcome_type          : OutcomeType
  skill_delta           : number
  recommendation_correct: boolean
}

// ============================================================================
// EQUITY CHECK — VÉRIFICATION D'ÉQUITÉ
// ============================================================================

export interface EquityCheckResult {
  passed                : boolean
  checked_at            : Date
  dimensions_checked    : EquityDimension[]
  violations_found      : EquityViolation[]
  overall_risk          : LearningRiskLevel
  recommendation        : 'APPROVE' | 'MONITOR' | 'BLOCK'
  notes                 : string
}

export interface EquityDimension {
  dimension             : string          // Ex: 'seniority', 'industry', 'archetype'
  groups_compared       : string[]
  max_delta_observed    : number
  threshold             : number
  passed                : boolean
}

export interface EquityViolation {
  dimension             : string
  group_a               : string
  group_b               : string
  delta_observed        : number
  threshold             : number
  severity              : 'WARNING' | 'VIOLATION' | 'CRITICAL'
  description           : string
}

// ============================================================================
// BIAS IMPACT ASSESSMENT
// ============================================================================

export interface BiasImpactAssessment {
  assessed_at           : Date
  target_weight         : string
  current_bias_exposure : number          // 0.0 → 1.0
  projected_bias_exposure: number         // Après ajustement
  delta_bias_exposure   : number          // projected - current
  risk_level            : LearningRiskLevel
  affected_bias_types   : BiasType[]
  narrative             : string
}

// ============================================================================
// LEARNING CYCLE — CYCLE COMPLET D'APPRENTISSAGE
// ============================================================================

export interface LearningCycle {
  id                    : string
  started_at            : Date
  completed_at         ?: Date
  status                : 'RUNNING' | 'PENDING_REVIEW' | 'COMPLETED' | 'FAILED'

  outcomes_processed    : number
  proposals_generated   : number
  proposals_approved    : number
  proposals_rejected    : number
  proposals_applied     : number

  weight_deltas         : WeightDelta[]
  equity_violations     : EquityViolation[]
  net_improvement_score : number          // -1.0 → 1.0
  notes                 : string
}

export interface WeightDelta {
  target_type           : AdjustmentTargetType
  target_id             : string
  target_label          : string
  before                : number
  after                 : number
  delta                 : number
  applied_at            : Date
}

// ============================================================================
// LEARNING AUDIT — TRAÇABILITÉ COMPLÈTE
// ============================================================================

export interface LearningAuditEntry {
  id                    : string
  timestamp             : Date
  event_type            : LearningEventType
  actor                 : 'SYSTEM' | 'HUMAN'
  actor_id             ?: string
  target_id             : string
  description           : string
  before_value         ?: number
  after_value          ?: number
  outcome_refs          : string[]
  equity_check_ref     ?: string
}

export type LearningEventType =
  | 'OUTCOME_RECORDED'
  | 'PROPOSAL_GENERATED'
  | 'PROPOSAL_APPROVED'
  | 'PROPOSAL_REJECTED'
  | 'WEIGHT_APPLIED'
  | 'WEIGHT_ROLLED_BACK'
  | 'EQUITY_VIOLATION_DETECTED'
  | 'EQUITY_CHECK_PASSED'
  | 'CYCLE_STARTED'
  | 'CYCLE_COMPLETED'
  | 'MINIMUM_THRESHOLD_NOT_MET'
  | 'HIGH_RISK_BLOCKED'

// ============================================================================
// ACTIVE WEIGHTS — POIDS ACTIFS DU SYSTÈME
// ============================================================================

export interface ActiveWeights {
  version               : string
  last_updated          : Date
  update_count          : number

  evidence_weights      : Record<EvidenceType, number>
  prior_by_archetype    : Record<string, number>
  prior_by_seniority    : Record<string, number>
  bias_penalties        : Record<BiasType, number>
  confidence_thresholds : ConfidenceThresholds
  information_gain_weights: InformationGainWeights
}

export interface ConfidenceThresholds {
  contradiction_required : number    // Default: 0.60
  state_5_minimum        : number    // Default: 0.65
  decision_minimum       : number    // Default: 0.70
  confirmed_minimum      : number    // Default: 0.75
}

export interface InformationGainWeights {
  citation_multiplier    : number    // Default: 1.00
  behavior_multiplier    : number    // Default: 0.85
  absence_multiplier     : number    // Default: 0.60
  pattern_multiplier     : number    // Default: 1.20
}

// ============================================================================
// LEARNING ENGINE — CLASSE PRINCIPALE
// ============================================================================

export class LearningEngine {
  private kernel          : KernelState;
  private activeWeights   : ActiveWeights;
  private auditLog        : LearningAuditEntry[];
  private outcomeStore    : CandidateOutcome[];
  private proposalStore   : WeightAdjustmentProposal[];
  private cycleStore      : LearningCycle[];

  // Constantes de gouvernance
  private readonly MIN_SAMPLE_SIZE         = 30;
  private readonly MAX_SINGLE_DELTA        = 0.10;
  private readonly EQUITY_DELTA_THRESHOLD  = 0.05;
  private readonly HIGH_RISK_DELTA_BLOCK   = 0.08;

  constructor(kernel: KernelState) {
    this.kernel        = kernel;
    this.activeWeights = this.loadActiveWeights();
    this.auditLog      = [];
    this.outcomeStore  = [];
    this.proposalStore = [];
    this.cycleStore    = [];
  }

  // ──────────────────────────────────────────────────────────
  // ENTRÉE PRINCIPALE — ENREGISTREMENT D'UN OUTCOME
  // ──────────────────────────────────────────────────────────

  recordOutcome(outcome: CandidateOutcome): void {
    this.validateOutcome(outcome);
    this.outcomeStore.push(outcome);

    this.audit({
      event_type  : 'OUTCOME_RECORDED',
      actor       : 'HUMAN',
      actor_id    : outcome.validated_by,
      target_id   : outcome.candidate_id,
      description : `Outcome ${outcome.outcome_type} enregistré.
                     Recommandation initiale : ${outcome.recommendation_made}.
                     Confiance initiale : ${outcome.confidence_at_t0.toFixed(2)}.
                     Score outcome : ${outcome.outcome_score.toFixed(2)}.`,
      outcome_refs: [outcome.id],
    });

    const convergentOutcomes = this.findConvergentOutcomes(outcome);

    if (convergentOutcomes.length >= this.MIN_SAMPLE_SIZE) {
      this.triggerLearningCycle(convergentOutcomes);
    } else {
      this.audit({
        event_type  : 'MINIMUM_THRESHOLD_NOT_MET',
        actor       : 'SYSTEM',
        target_id   : outcome.id,
        description : `Seuil minimum non atteint.
                       Outcomes convergents disponibles : ${convergentOutcomes.length}/${this.MIN_SAMPLE_SIZE}.
                       Aucun ajustement déclenché.`,
        outcome_refs: [outcome.id],
      });
    }
  }

  // ──────────────────────────────────────────────────────────
  // CYCLE D'APPRENTISSAGE
  // ──────────────────────────────────────────────────────────

  private triggerLearningCycle(outcomes: CandidateOutcome[]): LearningCycle {
    const cycle: LearningCycle = {
      id                  : this.generateId('cycle'),
      started_at          : new Date(),
      status              : 'RUNNING',
      outcomes_processed  : outcomes.length,
      proposals_generated : 0,
      proposals_approved  : 0,
      proposals_rejected  : 0,
      proposals_applied   : 0,
      weight_deltas       : [],
      equity_violations   : [],
      net_improvement_score: 0,
      notes               : '',
    };

    this.cycleStore.push(cycle);
    this.audit({
      event_type  : 'CYCLE_STARTED',
      actor       : 'SYSTEM',
      target_id   : cycle.id,
      description : `Cycle d'apprentissage démarré.
                     ${outcomes.length} outcomes traités.`,
      outcome_refs: outcomes.map(o => o.id),
    });

    const proposals = this.generateProposals(outcomes);
    cycle.proposals_generated = proposals.length;

    cycle.status = 'PENDING_REVIEW';
    this.cycleStore[this.cycleStore.length - 1] = cycle;

    return cycle;
  }

  // ──────────────────────────────────────────────────────────
  // GÉNÉRATION DES PROPOSITIONS D'AJUSTEMENT
  // ──────────────────────────────────────────────────────────

  private generateProposals(
    outcomes: CandidateOutcome[],
  ): WeightAdjustmentProposal[] {
    const proposals: WeightAdjustmentProposal[] = [];

    // 1. Ajustements des poids de preuves
    proposals.push(...this.generateEvidenceWeightProposals(outcomes));

    // 2. Ajustements des priors par archétype
    proposals.push(...this.generateArchetypePriorProposals(outcomes));

    // 3. Ajustements des priors par séniorité
    proposals.push(...this.generateSeniorityPriorProposals(outcomes));

    // 4. Ajustements des pénalités de biais
    proposals.push(...this.generateBiasPenaltyProposals(outcomes));

    // 5. Ajustements des seuils de confiance
    proposals.push(...this.generateThresholdProposals(outcomes));

    for (const proposal of proposals) {
      this.proposalStore.push(proposal);
      this.audit({
        event_type   : 'PROPOSAL_GENERATED',
        actor        : 'SYSTEM',
        target_id    : proposal.id,
        description  : `Proposition générée :
                        ${proposal.target_label}
                        ${proposal.current_value.toFixed(3)} → ${proposal.proposed_value.toFixed(3)}
                        (${proposal.delta >= 0 ? '+' : ''}${proposal.delta.toFixed(3)})
                        Risque : ${proposal.risk_level}
                        Équité : ${proposal.equity_check.recommendation}`,
        before_value : proposal.current_value,
        after_value  : proposal.proposed_value,
        outcome_refs : proposal.outcome_ids,
      });
    }

    return proposals;
  }

  // ──────────────────────────────────────────────────────────
  // PROPOSITIONS — POIDS DES PREUVES
  // ──────────────────────────────────────────────────────────

  private generateEvidenceWeightProposals(
    outcomes: CandidateOutcome[],
  ): WeightAdjustmentProposal[] {
    const proposals: WeightAdjustmentProposal[] = [];
    const evidenceTypes: EvidenceType[] = [EvidenceType.CITATION, EvidenceType.BEHAVIOR, EvidenceType.ABSENCE, EvidenceType.PATTERN];

    for (const evType of evidenceTypes) {
      const relevantOutcomes = outcomes.filter(o =>
        o.skills_confirmed.some(s => s.evidence_types_used.includes(evType)) ||
        o.skills_overestimated.some(s => s.evidence_types_used.includes(evType))
      );

      if (relevantOutcomes.length < this.MIN_SAMPLE_SIZE) continue;

      const avgPredictionError = this.calculateAvgPredictionError(relevantOutcomes, evType);
      const currentWeight  = this.activeWeights.evidence_weights[evType];
      const proposedWeight = this.clampWeight(
        currentWeight - (avgPredictionError * 0.5),
        0.10,
        1.00,
      );

      const delta = proposedWeight - currentWeight;

      if (Math.abs(delta) < 0.005) continue;

      const equityCheck = this.runEquityCheck(`evidence_weight_${evType}`, relevantOutcomes, delta);
      const biasAssessment = this.assessBiasImpact(`evidence_weight_${evType}`, currentWeight, proposedWeight);
      const riskLevel = this.calculateRiskLevel(delta, equityCheck, biasAssessment);

      const proposal: WeightAdjustmentProposal = {
        id                    : this.generateId('prop'),
        generated_at          : new Date(),
        outcome_ids           : relevantOutcomes.map(o => o.id),
        sample_size           : relevantOutcomes.length,
        target_type           : 'EVIDENCE_WEIGHT',
        target_id             : `evidence_weight_${evType}`,
        target_label          : `Poids des preuves de type ${evType}`,
        current_value         : currentWeight,
        proposed_value        : proposedWeight,
        delta,
        delta_percent         : Math.abs(delta / currentWeight) * 100,
        reasoning             : this.buildEvidenceWeightReasoning(evType, avgPredictionError, relevantOutcomes),
        supporting_outcomes   : relevantOutcomes.slice(0, 10).map(o => this.summarizeOutcome(o)),
        statistical_confidence: this.calculateStatisticalConfidence(relevantOutcomes),
        risk_level            : riskLevel,
        equity_check          : equityCheck,
        bias_impact_assessment: biasAssessment,
        status                : riskLevel === 'BLOCKED' ? 'REJECTED' : 'PENDING_REVIEW',
      };

      if (riskLevel === 'BLOCKED') {
        this.audit({
          event_type  : 'HIGH_RISK_BLOCKED',
          actor       : 'SYSTEM',
          target_id   : proposal.id,
          description : `Proposition bloquée automatiquement.
                         Cible : ${proposal.target_label}
                         Risque : ${riskLevel}
                         Violation d'équité : ${equityCheck.violations_found.length > 0 ? 'OUI' : 'NON'}`,
          before_value: currentWeight,
          after_value : proposedWeight,
          outcome_refs: relevantOutcomes.map(o => o.id),
        });
      }

      proposals.push(proposal);
    }

    return proposals;
  }

  // ──────────────────────────────────────────────────────────
  // PROPOSITIONS — PRIORS PAR ARCHÉTYPE
  // ──────────────────────────────────────────────────────────

  private generateArchetypePriorProposals(
    outcomes: CandidateOutcome[],
  ): WeightAdjustmentProposal[] {
    const proposals: WeightAdjustmentProposal[] = [];
    const archetypes = this.getDistinctArchetypes(outcomes);

    for (const archetype of archetypes) {
      const archetypeOutcomes = outcomes.filter(o =>
        this.getArchetypeForOutcome(o) === archetype
      );

      if (archetypeOutcomes.length < this.MIN_SAMPLE_SIZE) continue;

      const avgOutcomeScore   = this.avg(archetypeOutcomes.map(o => o.outcome_score));
      const avgPredictedConf  = this.avg(archetypeOutcomes.map(o => o.confidence_at_t0));
      const calibrationError  = avgOutcomeScore - avgPredictedConf;

      const currentPrior  = this.activeWeights.prior_by_archetype[archetype] ?? 0.45;
      const proposedPrior = this.clampWeight(
        currentPrior + (calibrationError * 0.3),
        0.20,
        0.70,
      );

      const delta = proposedPrior - currentPrior;
      if (Math.abs(delta) < 0.005) continue;

      const equityCheck    = this.runEquityCheck(`prior_${archetype}`, archetypeOutcomes, delta);
      const biasAssessment = this.assessBiasImpact(`prior_${archetype}`, currentPrior, proposedPrior);
      const riskLevel      = this.calculateRiskLevel(delta, equityCheck, biasAssessment);

      proposals.push({
        id                    : this.generateId('prop'),
        generated_at          : new Date(),
        outcome_ids           : archetypeOutcomes.map(o => o.id),
        sample_size           : archetypeOutcomes.length,
        target_type           : 'PRIOR_BY_ARCHETYPE',
        target_id             : `prior_archetype_${archetype}`,
        target_label          : `Prior pour l'archétype "${archetype}"`,
        current_value         : currentPrior,
        proposed_value        : proposedPrior,
        delta,
        delta_percent         : Math.abs(delta / currentPrior) * 100,
        reasoning             : `Sur ${archetypeOutcomes.length} entretiens avec des candidats
                                 de type "${archetype}", le score moyen observé est de
                                 ${avgOutcomeScore.toFixed(2)} contre une confiance prédite de
                                 ${avgPredictedConf.toFixed(2)}.
                                 Erreur de calibration : ${calibrationError >= 0 ? '+' : ''}${calibrationError.toFixed(2)}.
                                 Ajustement proposé du prior : ${currentPrior.toFixed(2)} → ${proposedPrior.toFixed(2)}.`,
        supporting_outcomes   : archetypeOutcomes.slice(0, 10).map(o => this.summarizeOutcome(o)),
        statistical_confidence: this.calculateStatisticalConfidence(archetypeOutcomes),
        risk_level            : riskLevel,
        equity_check          : equityCheck,
        bias_impact_assessment: biasAssessment,
        status                : riskLevel === 'BLOCKED' ? 'REJECTED' : 'PENDING_REVIEW',
      });
    }

    return proposals;
  }

  // ──────────────────────────────────────────────────────────
  // PROPOSITIONS — PRIORS PAR SÉNIORITÉ
  // ──────────────────────────────────────────────────────────

  private generateSeniorityPriorProposals(
    outcomes: CandidateOutcome[],
  ): WeightAdjustmentProposal[] {
    const proposals  : WeightAdjustmentProposal[] = [];
    const seniorities = this.getDistinctSeniorities(outcomes);

    for (const seniority of seniorities) {
      const seniorityOutcomes = outcomes.filter(o => o.seniority_level === seniority);
      if (seniorityOutcomes.length < this.MIN_SAMPLE_SIZE) continue;

      const falsePositives = seniorityOutcomes.filter(o => o.outcome_type === 'FALSE_POSITIVE');
      const falseNegatives = seniorityOutcomes.filter(o => o.outcome_type === 'FALSE_NEGATIVE');
      const fpRate = falsePositives.length / seniorityOutcomes.length;
      const fnRate = falseNegatives.length / seniorityOutcomes.length;

      const currentPrior  = this.activeWeights.prior_by_seniority[seniority] ?? 0.45;
      let proposedPrior   = currentPrior;

      if (fpRate > 0.15) proposedPrior -= 0.05;   // Trop de faux positifs → baisser le prior
      if (fnRate > 0.15) proposedPrior += 0.05;   // Trop de faux négatifs → monter le prior
      proposedPrior = this.clampWeight(proposedPrior, 0.20, 0.70);

      const delta = proposedPrior - currentPrior;
      if (Math.abs(delta) < 0.005) continue;

      const equityCheck    = this.runEquityCheck(`prior_${seniority}`, seniorityOutcomes, delta);
      const biasAssessment = this.assessBiasImpact(`prior_${seniority}`, currentPrior, proposedPrior);
      const riskLevel      = this.calculateRiskLevel(delta, equityCheck, biasAssessment);

      proposals.push({
        id                    : this.generateId('prop'),
        generated_at          : new Date(),
        outcome_ids           : seniorityOutcomes.map(o => o.id),
        sample_size           : seniorityOutcomes.length,
        target_type           : 'PRIOR_BY_SENIORITY',
        target_id             : `prior_seniority_${seniority}`,
        target_label          : `Prior pour la séniorité "${seniority}"`,
        current_value         : currentPrior,
        proposed_value        : proposedPrior,
        delta,
        delta_percent         : Math.abs(delta / currentPrior) * 100,
        reasoning             : `Sur ${seniorityOutcomes.length} entretiens "${seniority}" :
                                 Taux de faux positifs : ${(fpRate * 100).toFixed(1)}%
                                 Taux de faux négatifs : ${(fnRate * 100).toFixed(1)}%
                                 ${fpRate > 0.15 ? `Le taux de FP dépasse 15% → prior réduit.` : ''}
                                 ${fnRate > 0.15 ? `Le taux de FN dépasse 15% → prior augmenté.` : ''}`,
        supporting_outcomes   : seniorityOutcomes.slice(0, 10).map(o => this.summarizeOutcome(o)),
        statistical_confidence: this.calculateStatisticalConfidence(seniorityOutcomes),
        risk_level            : riskLevel,
        equity_check          : equityCheck,
        bias_impact_assessment: biasAssessment,
        status                : riskLevel === 'BLOCKED' ? 'REJECTED' : 'PENDING_REVIEW',
      });
    }

    return proposals;
  }

  // ──────────────────────────────────────────────────────────
  // PROPOSITIONS — PÉNALITÉS DE BIAIS
  // ──────────────────────────────────────────────────────────

  private generateBiasPenaltyProposals(
    outcomes: CandidateOutcome[],
  ): WeightAdjustmentProposal[] {
    const proposals  : WeightAdjustmentProposal[] = [];
    const biasTypes  = Object.keys(this.activeWeights.bias_penalties) as BiasType[];

    for (const biasType of biasTypes) {
      const biasOutcomes = outcomes.filter(o =>
        this.outcomeHadBiasType(o, biasType)
      );

      if (biasOutcomes.length < this.MIN_SAMPLE_SIZE) continue;

      const correctedOutcomes   = biasOutcomes.filter(o => this.biasCorrectionHelped(o, biasType));
      const uncorrectedOutcomes = biasOutcomes.filter(o => !this.biasCorrectionHelped(o, biasType));

      const correctionEfficacy = correctedOutcomes.length / biasOutcomes.length;
      const currentPenalty     = this.activeWeights.bias_penalties[biasType];

      let proposedPenalty = currentPenalty;
      if (correctionEfficacy < 0.60) proposedPenalty += 0.03;   // Correction insuffisante → augmenter
      if (correctionEfficacy > 0.90) proposedPenalty -= 0.02;   // Surcorrection → réduire
      proposedPenalty = this.clampWeight(proposedPenalty, 0.05, 0.30);

      const delta = proposedPenalty - currentPenalty;
      if (Math.abs(delta) < 0.003) continue;

      const equityCheck    = this.runEquityCheck(`bias_${biasType}`, biasOutcomes, delta);
      const biasAssessment = this.assessBiasImpact(`bias_penalty_${biasType}`, currentPenalty, proposedPenalty);
      const riskLevel      = this.calculateRiskLevel(delta, equityCheck, biasAssessment);

      proposals.push({
        id                    : this.generateId('prop'),
        generated_at          : new Date(),
        outcome_ids           : biasOutcomes.map(o => o.id),
        sample_size           : biasOutcomes.length,
        target_type           : 'BIAS_PENALTY',
        target_id             : `bias_penalty_${biasType}`,
        target_label          : `Pénalité du biais "${biasType}"`,
        current_value         : currentPenalty,
        proposed_value        : proposedPenalty,
        delta,
        delta_percent         : Math.abs(delta / currentPenalty) * 100,
        reasoning             : `Sur ${biasOutcomes.length} entretiens où ${biasType} a été détecté :
                                 Efficacité de la correction actuelle : ${(correctionEfficacy * 100).toFixed(1)}%.
                                 ${correctionEfficacy < 0.60 ? 'Correction insuffisante → pénalité augmentée.' : ''}
                                 ${correctionEfficacy > 0.90 ? 'Possible surcorrection → pénalité réduite.' : ''}`,
        supporting_outcomes   : biasOutcomes.slice(0, 10).map(o => this.summarizeOutcome(o)),
        statistical_confidence: this.calculateStatisticalConfidence(biasOutcomes),
        risk_level            : riskLevel,
        equity_check          : equityCheck,
        bias_impact_assessment: biasAssessment,
        status                : riskLevel === 'BLOCKED' ? 'REJECTED' : 'PENDING_REVIEW',
      });
    }

    return proposals;
  }

  // ──────────────────────────────────────────────────────────
  // PROPOSITIONS — SEUILS DE CONFIANCE
  // ──────────────────────────────────────────────────────────

  private generateThresholdProposals(
    outcomes: CandidateOutcome[],
  ): WeightAdjustmentProposal[] {
    const proposals: WeightAdjustmentProposal[] = [];

    if (outcomes.length < this.MIN_SAMPLE_SIZE * 2) return proposals;

    const falsePositiveOutcomes = outcomes.filter(o => o.outcome_type === 'FALSE_POSITIVE');
    const falseNegativeOutcomes = outcomes.filter(o => o.outcome_type === 'FALSE_NEGATIVE');

    const fpRate = falsePositiveOutcomes.length / outcomes.length;
    const fnRate = falseNegativeOutcomes.length / outcomes.length;

    const current = this.activeWeights.confidence_thresholds.decision_minimum;
    let proposed  = current;

    if (fpRate > 0.12) proposed = this.clampWeight(current + 0.02, 0.60, 0.90);
    if (fnRate > 0.12) proposed = this.clampWeight(current - 0.02, 0.60, 0.90);

    const delta = proposed - current;
    if (Math.abs(delta) < 0.005) return proposals;

    const equityCheck    = this.runEquityCheck('confidence_threshold', outcomes, delta);
    const biasAssessment = this.assessBiasImpact('confidence_threshold_decision', current, proposed);
    const riskLevel      = this.calculateRiskLevel(delta, equityCheck, biasAssessment);

    proposals.push({
      id                    : this.generateId('prop'),
      generated_at          : new Date(),
      outcome_ids           : outcomes.map(o => o.id),
      sample_size           : outcomes.length,
      target_type           : 'CONFIDENCE_THRESHOLD',
      target_id             : 'confidence_threshold_decision_minimum',
      target_label          : 'Seuil de confiance minimum pour décision finale',
      current_value         : current,
      proposed_value        : proposed,
      delta,
      delta_percent         : Math.abs(delta / current) * 100,
      reasoning             : `Sur ${outcomes.length} entretiens :
                               Taux de faux positifs : ${(fpRate * 100).toFixed(1)}%
                               Taux de faux négatifs : ${(fnRate * 100).toFixed(1)}%
                               ${fpRate > 0.12 ? 'FP élevés → seuil relevé pour plus de rigueur.' : ''}
                               ${fnRate > 0.12 ? 'FN élevés → seuil abaissé pour plus d\'ouverture.' : ''}`,
      supporting_outcomes   : outcomes.slice(0, 10).map(o => this.summarizeOutcome(o)),
      statistical_confidence: this.calculateStatisticalConfidence(outcomes),
      risk_level            : riskLevel,
      equity_check          : equityCheck,
      bias_impact_assessment: biasAssessment,
      status                : riskLevel === 'BLOCKED' ? 'REJECTED' : 'PENDING_REVIEW',
    });

    return proposals;
  }

  // ──────────────────────────────────────────────────────────
  // VALIDATION HUMAINE — APPROBATION / REJET
  // ──────────────────────────────────────────────────────────

  approveProposal(
    proposalId   : string,
    reviewerId   : string,
    reviewNotes  : string,
  ): void {
    const proposal = this.getProposalById(proposalId);
    this.assertProposalReviewable(proposal);

    proposal.status      = 'APPROVED';
    proposal.reviewed_by = reviewerId;
    proposal.reviewed_at = new Date();
    proposal.review_notes = reviewNotes;

    this.audit({
      event_type  : 'PROPOSAL_APPROVED',
      actor       : 'HUMAN',
      actor_id    : reviewerId,
      target_id   : proposalId,
      description : `Proposition approuvée par ${reviewerId}.
                     Notes : "${reviewNotes}"`,
      before_value: proposal.current_value,
      after_value : proposal.proposed_value,
      outcome_refs: proposal.outcome_ids,
    });

    this.applyProposal(proposal, reviewerId);
  }

  rejectProposal(
    proposalId   : string,
    reviewerId   : string,
    reason       : string,
  ): void {
    const proposal = this.getProposalById(proposalId);
    this.assertProposalReviewable(proposal);

    proposal.status       = 'REJECTED';
    proposal.reviewed_by  = reviewerId;
    proposal.reviewed_at  = new Date();
    proposal.review_notes = reason;

    this.audit({
      event_type  : 'PROPOSAL_REJECTED',
      actor       : 'HUMAN',
      actor_id    : reviewerId,
      target_id   : proposalId,
      description : `Proposition rejetée par ${reviewerId}.
                     Raison : "${reason}"`,
      before_value: proposal.current_value,
      after_value : proposal.proposed_value,
      outcome_refs: proposal.outcome_ids,
    });
  }

  // ──────────────────────────────────────────────────────────
  // APPLICATION D'UN POIDS
  // ──────────────────────────────────────────────────────────

  private applyProposal(
    proposal   : WeightAdjustmentProposal,
    approvedBy : string,
  ): void {
    const before = proposal.current_value;
    const after  = proposal.proposed_value;

    this.updateActiveWeight(proposal.target_type, proposal.target_id, after);

    proposal.status     = 'APPLIED';
    proposal.applied_at = new Date();

    this.kernel.weights_registry.update(
      proposal.target_id,
      after,
      proposal.id,
    );

    this.audit({
      event_type  : 'WEIGHT_APPLIED',
      actor       : 'HUMAN',
      actor_id    : approvedBy,
      target_id   : proposal.target_id,
      description : `Poids appliqué : ${proposal.target_label}
                     ${before.toFixed(3)} → ${after.toFixed(3)}
                     (${proposal.delta >= 0 ? '+' : ''}${proposal.delta.toFixed(3)})
                     Proposal : ${proposal.id}`,
      before_value: before,
      after_value : after,
      outcome_refs: proposal.outcome_ids,
    });
  }

  rollbackProposal(
    proposalId : string,
    reviewerId : string,
    reason     : string,
  ): void {
    const proposal = this.getProposalById(proposalId);

    if (proposal.status !== 'APPLIED') {
      throw new Error(`Impossible de rollback : statut actuel = ${proposal.status}`);
    }

    this.updateActiveWeight(
      proposal.target_type,
      proposal.target_id,
      proposal.current_value,
    );

    this.kernel.weights_registry.update(
      proposal.target_id,
      proposal.current_value,
      `rollback_${proposal.id}`,
    );

    proposal.status         = 'ROLLED_BACK';
    proposal.rolled_back_at = new Date();
    proposal.rollback_reason = reason;

    this.audit({
      event_type  : 'WEIGHT_ROLLED_BACK',
      actor       : 'HUMAN',
      actor_id    : reviewerId,
      target_id   : proposal.target_id,
      description : `Rollback effectué : ${proposal.target_label}
                     ${proposal.proposed_value.toFixed(3)} → ${proposal.current_value.toFixed(3)}
                     Raison : "${reason}"`,
      before_value: proposal.proposed_value,
      after_value : proposal.current_value,
      outcome_refs: proposal.outcome_ids,
    });
  }

  // ──────────────────────────────────────────────────────────
  // EQUITY CHECK
  // ──────────────────────────────────────────────────────────

  private runEquityCheck(
    targetId  : string,
    outcomes  : CandidateOutcome[],
    delta     : number,
  ): EquityCheckResult {
    const dimensions: EquityDimension[] = [];
    const violations: EquityViolation[] = [];

    const dimensionKeys = ['seniority_level', 'industry', 'position_type'] as const;

    for (const dim of dimensionKeys) {
      const groups = this.groupByField(outcomes, dim);
      const groupKeys = Object.keys(groups);

      if (groupKeys.length < 2) continue;

      const groupScores = Object.fromEntries(
        groupKeys.map(k => [k, this.avg(groups[k].map(o => o.outcome_score))])
      );

      const scores   = Object.values(groupScores);
      const maxDelta = Math.max(...scores) - Math.min(...scores);
      const threshold = this.EQUITY_DELTA_THRESHOLD;

      const passed = maxDelta <= threshold;

      dimensions.push({
        dimension          : dim,
        groups_compared    : groupKeys,
        max_delta_observed : maxDelta,
        threshold,
        passed,
      });

      if (!passed) {
        const sortedGroups = groupKeys.sort((a, b) => groupScores[b] - groupScores[a]);
        const groupA = sortedGroups[0];
        const groupB = sortedGroups[sortedGroups.length - 1];

        const violation: EquityViolation = {
          dimension     : dim,
          group_a       : groupA,
          group_b       : groupB,
          delta_observed: maxDelta,
          threshold,
          severity      : maxDelta > threshold * 2 ? 'CRITICAL'
                        : maxDelta > threshold * 1.5 ? 'VIOLATION'
                        : 'WARNING',
          description   : `L'ajustement proposé crée un écart de ${(maxDelta * 100).toFixed(1)}%
                           entre "${groupA}" et "${groupB}" sur la dimension "${dim}".
                           Seuil autorisé : ${(threshold * 100).toFixed(1)}%.`,
        };

        violations.push(violation);

        if (violation.severity === 'CRITICAL' || violation.severity === 'VIOLATION') {
          this.audit({
            event_type       : 'EQUITY_VIOLATION_DETECTED',
            actor            : 'SYSTEM',
            target_id        : targetId,
            description      : `Violation d'équité détectée.
                                Dimension : ${dim}
                                Groupes : ${groupA} vs ${groupB}
                                Delta : ${(maxDelta * 100).toFixed(1)}%
                                Sévérité : ${violation.severity}`,
            outcome_refs     : outcomes.map(o => o.id),
          });
        }
      }
    }

    const allPassed = violations.length === 0;
    const hasCritical = violations.some(v => v.severity === 'CRITICAL');
    const hasViolation = violations.some(v => v.severity === 'VIOLATION');

    const recommendation = hasCritical ? 'BLOCK'
                         : hasViolation ? 'BLOCK'
                         : violations.length > 0 ? 'MONITOR'
                         : 'APPROVE';

    const overallRisk: LearningRiskLevel = hasCritical ? 'BLOCKED'
                                         : hasViolation ? 'HIGH_RISK'
                                         : violations.length > 0 ? 'MONITORED'
                                         : 'SAFE';

    if (allPassed) {
      this.audit({
        event_type  : 'EQUITY_CHECK_PASSED',
        actor       : 'SYSTEM',
        target_id   : targetId,
        description : `Vérification d'équité réussie.
                       ${dimensions.length} dimensions vérifiées. Aucune violation.`,
        outcome_refs: outcomes.map(o => o.id),
      });
    }

    return {
      passed        : allPassed,
      checked_at    : new Date(),
      dimensions_checked: dimensions,
      violations_found  : violations,
      overall_risk  : overallRisk,
      recommendation,
      notes         : allPassed
                      ? `Toutes les dimensions vérifiées. Aucune violation d'équité détectée.`
                      : `${violations.length} violation(s) détectée(s). Voir les détails.`,
    };
  }

  // ──────────────────────────────────────────────────────────
  // BIAS IMPACT ASSESSMENT
  // ──────────────────────────────────────────────────────────

  private assessBiasImpact(
    targetId      : string,
    currentValue  : number,
    proposedValue : number,
  ): BiasImpactAssessment {
    const delta               = proposedValue - currentValue;
    const currentExposure     = this.kernel.bias_engine.getCurrentExposure(targetId);
    const projectedExposure   = Math.max(0, Math.min(1, currentExposure + delta * 0.5));
    const deltaExposure       = projectedExposure - currentExposure;
    const affectedBiasTypes   = this.kernel.bias_engine.getAffectedBiasTypes(targetId);

    const riskLevel: LearningRiskLevel =
      Math.abs(delta) > this.HIGH_RISK_DELTA_BLOCK ? 'HIGH_RISK' :
      Math.abs(deltaExposure) > 0.05 ? 'MONITORED' :
      'SAFE';

    return {
      assessed_at             : new Date(),
      target_weight           : targetId,
      current_bias_exposure   : currentExposure,
      projected_bias_exposure : projectedExposure,
      delta_bias_exposure     : deltaExposure,
      risk_level              : riskLevel,
      affected_bias_types     : affectedBiasTypes,
      narrative               : `L'ajustement proposé modifie l'exposition aux biais de
                                 ${(currentExposure * 100).toFixed(1)}% → ${(projectedExposure * 100).toFixed(1)}%.
                                 ${riskLevel === 'HIGH_RISK' ? 'Risque élevé. Révision humaine obligatoire.' : ''}
                                 ${riskLevel === 'MONITORED' ? 'À surveiller après application.' : ''}
                                 ${riskLevel === 'SAFE' ? 'Impact négligeable sur l\'exposition aux biais.' : ''}`,
    };
  }

  // ──────────────────────────────────────────────────────────
  // RAPPORTS ET OBSERVABILITÉ
  // ──────────────────────────────────────────────────────────

  getActiveWeights(): ActiveWeights {
    return { ...this.activeWeights };
  }

  getPendingProposals(): WeightAdjustmentProposal[] {
    return this.proposalStore.filter(p => p.status === 'PENDING_REVIEW');
  }

  getLearningHistory(): LearningCycle[] {
    return [...this.cycleStore];
  }

  getAuditLog(limit = 100): LearningAuditEntry[] {
    return this.auditLog.slice(-limit);
  }

  generateLearningReport(): string {
    const lines: string[] = [];
    const pending    = this.getPendingProposals();
    const applied    = this.proposalStore.filter(p => p.status === 'APPLIED');
    const blocked    = this.proposalStore.filter(p => p.risk_level === 'BLOCKED');
    const cycles     = this.cycleStore;
    const outcomes   = this.outcomeStore;

    lines.push(`╔${'═'.repeat(74)}╗`);
    lines.push(`║  LEARNING ENGINE REPORT · TRAJECTOIRE${' '.repeat(36)}║`);
    lines.push(`╠${'═'.repeat(74)}╣`);
    lines.push(`║  Outcomes enregistrés  : ${String(outcomes.length).padEnd(6)}${' '.repeat(42)}║`);
    lines.push(`║  Cycles complétés      : ${String(cycles.length).padEnd(6)}${' '.repeat(42)}║`);
    lines.push(`║  Propositions générées : ${String(this.proposalStore.length).padEnd(6)}${' '.repeat(42)}║`);
    lines.push(`║  En attente de révision: ${String(pending.length).padEnd(6)}${' '.repeat(42)}║`);
    lines.push(`║  Appliquées            : ${String(applied.length).padEnd(6)}${' '.repeat(42)}║`);
    lines.push(`║  Bloquées (équité)     : ${String(blocked.length).padEnd(6)}${' '.repeat(42)}║`);
    lines.push(`╠${'═'.repeat(74)}╣`);
    lines.push(`║  POIDS ACTIFS${' '.repeat(60)}║`);
    lines.push(`╠${'═'.repeat(74)}╣`);

    for (const [evType, weight] of Object.entries(this.activeWeights.evidence_weights)) {
      lines.push(`║  Evidence ${evType.padEnd(12)} : ${weight.toFixed(3)}${' '.repeat(50)}║`);
    }

    lines.push(`╠${'═'.repeat(74)}╣`);
    lines.push(`║  PROPOSITIONS EN ATTENTE${' '.repeat(49)}║`);
    lines.push(`╠${'═'.repeat(74)}╣`);

    for (const prop of pending) {
      const sign = prop.delta >= 0 ? '+' : '';
      lines.push(`║  ${prop.target_label.slice(0, 40).padEnd(40)} ${sign}${prop.delta.toFixed(3)} [${prop.risk_level.padEnd(10)}]║`);
    }

    lines.push(`╠${'═'.repeat(74)}╣`);
    lines.push(`║  CONTRAINTES ACTIVES${' '.repeat(53)}║`);
    lines.push(`╠${'═'.repeat(74)}╣`);
    lines.push(`║  Seuil minimum d'observations : ${String(this.MIN_SAMPLE_SIZE).padEnd(5)}${' '.repeat(38)}║`);
    lines.push(`║  Delta maximum par ajustement : ${this.MAX_SINGLE_DELTA.toFixed(2).padEnd(5)}${' '.repeat(37)}║`);
    lines.push(`║  Seuil d'équité               : ${this.EQUITY_DELTA_THRESHOLD.toFixed(2).padEnd(5)}${' '.repeat(37)}║`);
    lines.push(`║  Révision humaine obligatoire : OUI${' '.repeat(38)}║`);
    lines.push(`╚${'═'.repeat(74)}╝`);

    return lines.join('\n');
  }

  // ──────────────────────────────────────────────────────────
  // UTILITAIRES PRIVÉS
  // ──────────────────────────────────────────────────────────

  private audit(entry: Omit<LearningAuditEntry, 'id' | 'timestamp'>): void {
    this.auditLog.push({
      id         : this.generateId('audit'),
      timestamp  : new Date(),
      ...entry,
    });
  }

  private avg(values: number[]): number {
    if (values.length === 0) return 0;
    return values.reduce((sum, v) => sum + v, 0) / values.length;
  }

  private clampWeight(value: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, value));
  }

  private generateId(prefix: string): string {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  }

  private calculateStatisticalConfidence(outcomes: CandidateOutcome[]): number {
    const n = outcomes.length;
    if (n < this.MIN_SAMPLE_SIZE) return 0;
    return Math.min(0.99, 0.50 + (n - this.MIN_SAMPLE_SIZE) / (this.MIN_SAMPLE_SIZE * 4));
  }

  private calculateRiskLevel(
    delta        : number,
    equityCheck  : EquityCheckResult,
    biasAssessment: BiasImpactAssessment,
  ): LearningRiskLevel {
    if (equityCheck.recommendation === 'BLOCK')           return 'BLOCKED';
    if (biasAssessment.risk_level === 'HIGH_RISK')        return 'HIGH_RISK';
    if (Math.abs(delta) > this.HIGH_RISK_DELTA_BLOCK)     return 'HIGH_RISK';
    if (equityCheck.recommendation === 'MONITOR')         return 'MONITORED';
    if (biasAssessment.risk_level === 'MONITORED')        return 'MONITORED';
    return 'SAFE';
  }

  private calculateAvgPredictionError(
    outcomes  : CandidateOutcome[],
    evType    : EvidenceType,
  ): number {
    const relevant = outcomes.filter(o =>
      [...o.skills_confirmed, ...o.skills_overestimated]
        .some(s => s.evidence_types_used.includes(evType))
    );
    if (relevant.length === 0) return 0;
    const errors = relevant.flatMap(o =>
      o.skills_overestimated
        .filter(s => s.evidence_types_used.includes(evType))
        .map(s => Math.abs(s.delta))
    );
    return this.avg(errors);
  }

  private buildEvidenceWeightReasoning(
    evType   : EvidenceType,
    avgError : number,
    outcomes : CandidateOutcome[],
  ): string {
    const overEst = outcomes.filter(o =>
      o.skills_overestimated.some(s => s.evidence_types_used.includes(evType))
    ).length;
    return `Sur ${outcomes.length} entretiens utilisant des preuves de type ${evType},
            ${overEst} cas de surestimation détectés.
            Erreur moyenne de prédiction : ${avgError.toFixed(3)}.
            Ajustement proposé pour réduire cette erreur systématique.`;
  }

  private summarizeOutcome(o: CandidateOutcome): OutcomeSummary {
    return {
      outcome_id             : o.id,
      outcome_type           : o.outcome_type,
      skill_delta            : this.avg([
                                 ...o.skills_overestimated.map(s => Math.abs(s.delta)),
                                 ...o.skills_underestimated.map(s => Math.abs(s.delta)),
                               ]),
      recommendation_correct : o.outcome_type === 'SUCCESS' &&
                               o.recommendation_made === 'HIRE' ||
                               o.outcome_type === 'FALSE_NEGATIVE' &&
                               o.recommendation_made === 'NO_HIRE',
    };
  }

  private findConvergentOutcomes(outcome: CandidateOutcome): CandidateOutcome[] {
    return this.outcomeStore.filter(o =>
      o.seniority_level === outcome.seniority_level ||
      o.position_type   === outcome.position_type   ||
      o.industry        === outcome.industry
    );
  }

  private groupByField<T extends Record<string, any>>(
    items : T[],
    field : keyof T,
  ): Record<string, T[]> {
    return items.reduce((acc, item) => {
      const key = String(item[field]);
      acc[key] = acc[key] ?? [];
      acc[key].push(item);
      return acc;
    }, {} as Record<string, T[]>);
  }

  private getDistinctArchetypes(outcomes: CandidateOutcome[]): string[] {
    return [...new Set(outcomes.map(o => this.getArchetypeForOutcome(o)))];
  }

  private getDistinctSeniorities(outcomes: CandidateOutcome[]): string[] {
    return [...new Set(outcomes.map(o => o.seniority_level))];
  }

  private getArchetypeForOutcome(o: CandidateOutcome): string {
    return this.kernel.memory_store.getArchetypeForSession(o.interview_session_id);
  }

  private outcomeHadBiasType(o: CandidateOutcome, biasType: BiasType): boolean {
    return this.kernel.bias_engine.sessionHadBiasType(o.interview_session_id, biasType);
  }

  private biasCorrectionHelped(o: CandidateOutcome, biasType: BiasType): boolean {
    return this.kernel.bias_engine.correctionImprovedOutcome(o.interview_session_id, biasType, o.outcome_score);
  }

  private getProposalById(id: string): WeightAdjustmentProposal {
    const p = this.proposalStore.find(p => p.id === id);
    if (!p) throw new Error(`Proposition introuvable : ${id}`);
    return p;
  }

  private assertProposalReviewable(p: WeightAdjustmentProposal): void {
    if (p.status !== 'PENDING_REVIEW') {
      throw new Error(`Proposition non révisable : statut = ${p.status}`);
    }
  }

  private updateActiveWeight(
    targetType : AdjustmentTargetType,
    targetId   : string,
    value      : number,
  ): void {
    switch (targetType) {
      case 'EVIDENCE_WEIGHT': {
        const evType = targetId.replace('evidence_weight_', '') as EvidenceType;
        this.activeWeights.evidence_weights[evType] = value;
        break;
      }
      case 'PRIOR_BY_ARCHETYPE': {
        const archetype = targetId.replace('prior_archetype_', '');
        this.activeWeights.prior_by_archetype[archetype] = value;
        break;
      }
      case 'PRIOR_BY_SENIORITY': {
        const seniority = targetId.replace('prior_seniority_', '');
        this.activeWeights.prior_by_seniority[seniority] = value;
        break;
      }
      case 'BIAS_PENALTY': {
        const biasType = targetId.replace('bias_penalty_', '') as BiasType;
        this.activeWeights.bias_penalties[biasType] = value;
        break;
      }
      case 'CONFIDENCE_THRESHOLD': {
        this.activeWeights.confidence_thresholds.decision_minimum = value;
        break;
      }
    }
    this.activeWeights.last_updated = new Date();
    this.activeWeights.update_count++;
  }

  private loadActiveWeights(): ActiveWeights {
    return this.kernel.weights_registry.loadCurrent() ?? this.getDefaultWeights();
  }

  private getDefaultWeights(): ActiveWeights {
    return {
      version                : '4.0.0',
      last_updated           : new Date(),
      update_count           : 0,
      evidence_weights       : {
        CITATION  : 0.85,
        BEHAVIOR  : 0.70,
        ABSENCE   : 0.40,
        PATTERN   : 0.90,
      },
      prior_by_archetype     : {
        Junior       : 0.35,
        Senior       : 0.50,
        Expert       : 0.55,
        Manager      : 0.50,
        Consultant   : 0.45,
      },
      prior_by_seniority     : {
        junior       : 0.35,
        mid          : 0.45,
        senior       : 0.55,
        director     : 0.50,
      },
      bias_penalties         : {
        HALO_EFFECT       : 0.15,
        SIMILARITY_BIAS   : 0.12,
        AFFINITY_BIAS     : 0.12,
        ANCHORING         : 0.10,
        CONFIRMATION_BIAS : 0.18,
        CONTRAST_EFFECT   : 0.08,
        ATTRIBUTION_ERROR : 0.12,
      } as Record<BiasType, number>,
      confidence_thresholds  : {
        contradiction_required : 0.60,
        state_5_minimum        : 0.65,
        decision_minimum       : 0.70,
        confirmed_minimum      : 0.75,
      },
      information_gain_weights: {
        citation_multiplier  : 1.00,
        behavior_multiplier  : 0.85,
        absence_multiplier   : 0.60,
        pattern_multiplier   : 1.20,
      },
    };
  }

  private validateOutcome(outcome: CandidateOutcome): void {
    if (!outcome.candidate_id)         throw new Error('candidate_id requis');
    if (!outcome.interview_session_id) throw new Error('interview_session_id requis');
    if (!outcome.validated_by)         throw new Error('validated_by requis — révision humaine obligatoire');
    if (!outcome.validated_at)         throw new Error('validated_at requis');
    if (outcome.outcome_score < 0 || outcome.outcome_score > 1) {
      throw new Error(`outcome_score invalide : ${outcome.outcome_score}`);
    }
  }
}

export const learningEngine = new LearningEngine(null as any);
