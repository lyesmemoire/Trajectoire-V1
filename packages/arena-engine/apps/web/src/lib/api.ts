/**
 * api.ts — Client HTTP vers le backend NestJS / realtime-gateway
 * Corrections appliquées :
 * B1B — fetchReport typé avec RawReportResponse (plus de any).
 *       RawReportResponse reflète exactement la structure retournée
 *       par Prisma (snake_case, champ `analysis` JSONB déjà parsé).
 * Auth — getUser() pour vérification identité + getSession() pour token.
 */
import { createClient } from "@/lib/supabase/client";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

// ── Auth headers ──────────────────────────────────────────────────────────

async function getAuthHeaders(): Promise<HeadersInit> {
  const supabase = createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("No authenticated user");
  }

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.access_token) {
    throw new Error("No active session");
  }

  return {
    Authorization: `Bearer ${session.access_token}`,
    "Content-Type": "application/json",
  };
}

// ── Types — structure brute retournée par l'API (snake_case Prisma) ───────

/** Score individuel d'une dimension comportementale ou cognitive */
export interface RawDimensionScore {
  label: string;
  score: number;
  comment?: string;
}

/** Scénario de décision analysé */
export interface RawDecisionItem {
  scenario: string;
  response: string;
  analysis: string;
  score: number;
}

/**
 * Contenu du champ JSONB analysis stocké dans InterviewSession.
 * Structure produite par report-generator.ts et validée par AnalysisSchema.
 */
export interface RawAnalysis {
  global_score: number;
  percentile: number;
  recommendation: string;
  executive_summary: string;
  soft_skills: RawDimensionScore[];
  hard_skills: RawDimensionScore[];
  integrity_score: number;
  consistency_score: number;
  assessment_text: string;
  gap_analysis?: string;
  decisions: RawDecisionItem[];
  overall_decision_score: number;
  decision_style: string;
  schema_version: "1.0";
}

/**
 * Réponse brute de GET /report/:interviewId
 * Correspond aux colonnes de la table InterviewSession dans Prisma.
 */
export interface RawReportResponse {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  status: "pending" | "in_progress" | "completed" | "error";
  candidate_name: string;
  /* Contenu JSONB déjà parsé en objet par le backend */
  analysis: RawAnalysis | null;
  /* Indique si l'utilisateur a accès au rapport complet */
  is_premium_unlocked: boolean;
}

// ── fetchReport ───────────────────────────────────────────────────────────

/**
 * Récupère le rapport d'un entretien par son ID.
 * Retourne RawReportResponse typé — utiliser toReportViewModel()
 * de lib/report-adapter.ts pour convertir vers le format UI.
 */
export async function fetchReport(
  interviewId: string
): Promise<RawReportResponse> {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_URL}/report/${interviewId}`, { headers });
  if (!res.ok) {
    throw new Error(`fetchReport failed: ${res.status} ${res.statusText}`);
  }

  return res.json() as Promise<RawReportResponse>;
}

// ── Autres appels API existants ───────────────────────────────────────────

export async function createInterview(): Promise<{ sessionId: string }> {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_URL}/interview`, {
    method: "POST",
    headers,
  });

  if (!res.ok) {
    throw new Error(`createInterview failed: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

export async function fetchInterviews(): Promise<
  Array<{
    id: string;
    created_at: string;
    status: string;
    analysis: Pick<RawAnalysis, "global_score" | "recommendation"> | null;
  }>
> {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_URL}/interviews`, { headers });

  if (!res.ok) {
    throw new Error(`fetchInterviews failed: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

export async function fetchInterview(sessionId: string): Promise<any> {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_URL}/interview/${sessionId}`, { headers });
  if (!res.ok) {
    throw new Error(`fetchInterview failed: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

export async function createCheckoutSession(): Promise<{ url: string }> {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_URL}/stripe/checkout`, {
    method: "POST",
    headers,
  });
  if (!res.ok) {
    throw new Error(`createCheckoutSession failed: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

export async function createPortalSession(): Promise<{ url: string }> {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_URL}/stripe/portal`, {
    method: "POST",
    headers,
  });
  if (!res.ok) {
    throw new Error(`createPortalSession failed: ${res.status} ${res.statusText}`);
  }
  return res.json();
}
