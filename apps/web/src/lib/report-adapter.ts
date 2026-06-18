/**
 * report-adapter.ts
 * Couche de transformation entre la réponse API brute (snake_case Prisma)
 * et le ViewModel consommé par les composants React du rapport.
 * Pourquoi ce fichier existe :
 * L'API retourne les données en snake_case (convention Prisma/PostgreSQL).
 * Les composants UI attendent du camelCase (convention React/TypeScript).
 * Sans cette couche, toutes les props passées aux composants valent
 * undefined — le rapport s'affiche entièrement vide.
 * Usage :
 * const raw = await fetchReport(interviewId);
 * const vm = toReportViewModel(raw);
 * // vm est maintenant typé ReportViewModel, prêt pour les composants.
 */
import type {
  RawReportResponse,
  RawDimensionScore,
  RawDecisionItem,
} from "@/lib/api";

// ── Types du ViewModel (camelCase — convention composants React) ───────────

export interface DimensionScoreVM {
  label: string;
  score: number;
  comment?: string;
}

export interface DecisionItemVM {
  scenario: string;
  response: string;
  analysis: string;
  score: number;
}

/**
 * ViewModel complet du rapport exécutif.
 * Toutes les propriétés sont garanties non-nulles si isAnalysisAvailable.
 */
export interface ReportViewModel {
  // ── Métadonnées ──────────────────────────────────────────────────────
  interviewId: string;
  candidateName: string;
  createdAt: string;
  status: RawReportResponse["status"];
  isPremiumUnlocked: boolean;
  // ── Disponibilité de l'analyse ────────────────────────────────────────
  /** true si le champ analysis JSONB est présent et l'entretien terminé */
  isAnalysisAvailable: boolean;

  // ── Vue d'ensemble (ExecutiveOverview) ────────────────────────────────
  globalScore: number;
  percentile: number;
  recommendation: string;
  executiveSummary: string;

  // ── Compétences (DualBreakdown) ───────────────────────────────────────
  softSkills: DimensionScoreVM[];
  hardSkills: DimensionScoreVM[];

  // ── Intégrité (IntegritySection) ──────────────────────────────────────
  integrityScore: number;
  consistencyScore: number;
  assessmentText: string;
  gapAnalysis?: string;

  // ── Décisions (DecisionSimulation) ───────────────────────────────────
  decisions: DecisionItemVM[];
  overallDecisionScore: number;
  decisionStyle: string;
}

// ── Adaptateur principal ──────────────────────────────────────────────────

/**
 * Transforme une RawReportResponse (snake_case API) en ReportViewModel
 * (camelCase UI). Toutes les valeurs manquantes sont remplacées par des
 * défauts sûrs — les composants ne reçoivent jamais undefined.
 */
export function toReportViewModel(raw: RawReportResponse): ReportViewModel {
  const a = raw.analysis;
  const hasAnalysis = a !== null && raw.status === "completed";
  return {
    // Métadonnées
    interviewId: raw.id,
    candidateName: raw.candidate_name ?? "Candidat",
    createdAt: raw.created_at,
    status: raw.status,
    isPremiumUnlocked: raw.is_premium_unlocked ?? false,
    isAnalysisAvailable: hasAnalysis,

    // Vue d'ensemble
    globalScore:      a?.global_score       ?? 0,
    percentile:       a?.percentile         ?? 0,
    recommendation:   a?.recommendation     ?? "",
    executiveSummary: a?.executive_summary  ?? "",

    // Compétences
    softSkills: mapDimensions(a?.soft_skills),
    hardSkills: mapDimensions(a?.hard_skills),

    // Intégrité
    integrityScore:   a?.integrity_score    ?? 0,
    consistencyScore: a?.consistency_score  ?? 0,
    assessmentText:   a?.assessment_text    ?? "",
    gapAnalysis:      a?.gap_analysis,

    // Décisions
    decisions:            mapDecisions(a?.decisions),
    overallDecisionScore: a?.overall_decision_score ?? 0,
    decisionStyle:        a?.decision_style         ?? "",
  };
}

// ── Helpers privés ────────────────────────────────────────────────────────

function mapDimensions(
  raw: RawDimensionScore[] | undefined
): DimensionScoreVM[] {
  if (!raw || !Array.isArray(raw)) return [];
  return raw.map((d) => ({
    label: d.label,
    score: d.score,
    comment: d.comment,
  }));
}

function mapDecisions(
  raw: RawDecisionItem[] | undefined
): DecisionItemVM[] {
  if (!raw || !Array.isArray(raw)) return [];
  return raw.map((d) => ({
    scenario: d.scenario,
    response: d.response,
    analysis: d.analysis,
    score: d.score,
  }));
}
