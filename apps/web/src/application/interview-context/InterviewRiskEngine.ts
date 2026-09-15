/**
 * InterviewRiskEngine
 *
 * Derives up to 3 interview risks deterministically from the UnifiedInterviewContext.
 * No LLM call. No invention. 0–3 risks only.
 */

export interface InterviewRiskInput {
  cvText: string;
  jobTitle: string;
  matching: {
    matchedSkills: string[];
    missingSkills: string[];
    suggestions: string[];
    score: number | null;
  };
}
export type RiskSeverity = "HIGH" | "MEDIUM";
export type RiskEvidenceStatus = "MISSING" | "WEAK" | "PARTIAL";
export type RiskCategory =
  | "missing_skill"
  | "weak_evidence"
  | "no_metrics"
  | "seniority_gap"
  | "suggestion";

export interface InterviewRisk {
  id: string;
  title: string;
  reason: string;
  category: RiskCategory;
  severity: RiskSeverity;
  competency: string | null;
  evidenceStatus: RiskEvidenceStatus;
  source: string;
}

const MAX_RISKS = 3;

// ---------------------------------------------------------------------------
// Deterministic title + reason templates
// ---------------------------------------------------------------------------

function titleForCategory(
  category: RiskCategory,
  competency: string | null,
): string {
  const name = competency ?? "cette compétence";

  switch (category) {
    case "missing_skill":
      return `${name} peu démontré`;
    case "weak_evidence":
      return `${name} à prouver davantage`;
    case "no_metrics":
      return "Résultats insuffisamment quantifiés";
    case "seniority_gap":
      return "Niveau d'expérience à confirmer";
    case "suggestion":
      return competency ? `${competency} à renforcer` : "Point à améliorer";
  }
}

function reasonForCategory(
  category: RiskCategory,
  competency: string | null,
  jobTitle: string,
): string {
  const name = competency ?? "cette compétence";
  const job = jobTitle || "ce poste";

  switch (category) {
    case "missing_skill":
      return (
        `Le poste de ${job} requiert ${name}, mais votre CV n'apporte pas encore de preuves concrètes sur ce point.`
      );
    case "weak_evidence":
      return (
        `${name} apparaît dans votre profil, mais les preuves concrètes (exemples, résultats, impact) restent limitées pour convaincre sur ${job}.`
      );
    case "no_metrics":
      return (
        `Vos expériences sont pertinentes pour ${job}, mais peu de résultats mesurables (chiffres, KPIs, impact) apparaissent clairement dans votre CV.`
      );
    case "seniority_gap":
      return (
        `Le niveau demandé pour ${job} implique un périmètre de responsabilités que votre CV ne démontre pas encore explicitement.`
      );
    case "suggestion":
      return competency
        ? `L'analyse ATS recommande de renforcer ${competency} pour maximiser vos chances sur ${job}.`
        : `L'analyse ATS identifie ce point comme un axe d'amélioration important pour ${job}.`;
  }
}

// ---------------------------------------------------------------------------
// Slug helper for stable IDs
// ---------------------------------------------------------------------------
function slug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "")
    .slice(0, 40);
}

// ---------------------------------------------------------------------------
// Heuristic: does the CV text contain meaningful evidence for a skill?
// "MISSING"  → no mention at all
// "WEAK"     → mentioned but short / no context
// "PARTIAL"  → mentioned with some context but no metrics
// ---------------------------------------------------------------------------
function evidenceStatusFromCvText(
  cvText: string,
  competency: string,
): RiskEvidenceStatus {
  if (!cvText || !competency) return "MISSING";

  const lowerCv = cvText.toLowerCase();
  const lowerComp = competency.toLowerCase();

  // Check if any word from the competency appears in the CV
  const words = lowerComp.split(/\s+/).filter((w) => w.length > 2);
  const anyMatch = words.some((w) => lowerCv.includes(w));

  if (!anyMatch) return "MISSING";

  // Check for quantification signals near the competency mentions
  const metricsPattern = /(?:[+-]\s*\d+)|(?:\d+\s*(?:%|€|\$|k€|m€|k\b|m\b))|(?:\b(?:kpi|roi)\b)|(?:\b(?:augmentation|réduction|croissance|baisse|hausse|impact|amélioration|optimisation|gains?|économie)\b.{0,30}\d+)|(?:\d+\s+(?:clients|projets|utilisateurs|leads|ventes|commandes|applications)\b)/i;
  if (metricsPattern.test(cvText)) return "PARTIAL";

  return "WEAK";
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

export function buildTopRisks(
  input: InterviewRiskInput,
): InterviewRisk[] {
  const { matching, cvText = "", jobTitle = "" } = input;
  const risks: InterviewRisk[] = [];
  const seenIds = new Set<string>();

  function addRisk(risk: InterviewRisk): boolean {
    if (risks.length >= MAX_RISKS) return false;
    if (seenIds.has(risk.id)) return false;
    seenIds.add(risk.id);
    risks.push(risk);
    return true;
  }

  // -------------------------------------------------------------------------
  // A. Missing skills → HIGH (hardest gaps)
  // -------------------------------------------------------------------------
  for (const skill of matching.missingSkills) {
    if (!skill?.trim()) continue;

    const evidence = evidenceStatusFromCvText(cvText, skill);
    const category = "missing_skill";
    const id = `${category}_${slug(skill)}_${evidence}`;

    addRisk({
      id,
      title: titleForCategory(category, skill),
      reason: reasonForCategory(category, skill, jobTitle),
      category,
      severity: "HIGH",
      competency: skill,
      evidenceStatus: evidence,
      source: "matching.missingSkills",
    });
    if (risks.length >= MAX_RISKS) break;
  }

  // -------------------------------------------------------------------------
  // B. Matched skills with weak/no evidence in CV → HIGH or MEDIUM
  //    (present in keywords but not well demonstrated)
  // -------------------------------------------------------------------------
  if (risks.length < MAX_RISKS) {
    for (const skill of matching.matchedSkills) {
      if (!skill?.trim()) continue;

      const evidence = evidenceStatusFromCvText(cvText, skill);
      if (evidence === "PARTIAL") continue; // well-demonstrated, skip

      const severity: RiskSeverity = evidence === "MISSING" ? "HIGH" : "MEDIUM";
      const category: RiskCategory = evidence === "MISSING" ? "missing_skill" : "weak_evidence";
      const id = `${category}_${slug(skill)}_${evidence}`;

      addRisk({
        id,
        title: titleForCategory(category, skill),
        reason: reasonForCategory(category, skill, jobTitle),
        category,
        severity,
        competency: skill,
        evidenceStatus: evidence,
        source: "matching.matchedSkills",
      });
      if (risks.length >= MAX_RISKS) break;
    }
  }

  // -------------------------------------------------------------------------
  // C. No-metrics risk: if ATS score < 70 and few/no numbers in CV
  // -------------------------------------------------------------------------
  if (risks.length < MAX_RISKS) {
    const metricsPattern = /(?:[+-]\s*\d+)|(?:\d+\s*(?:%|€|\$|k€|m€|k\b|m\b))|(?:\b(?:kpi|roi)\b)|(?:\b(?:augmentation|réduction|croissance|baisse|hausse|impact|amélioration|optimisation|gains?|économie)\b.{0,30}\d+)|(?:\d+\s+(?:clients|projets|utilisateurs|leads|ventes|commandes|applications)\b)/i;
    const hasMetrics = metricsPattern.test(cvText);

    // Only flag if there are genuinely no metrics in a non-empty CV.
    // A low score alone should not trigger a vague risk if metrics ARE present.
    if (!hasMetrics && cvText.trim().length > 50) {
      const category = "no_metrics";
      const evidence = "WEAK";
      const id = `${category}_global_${evidence}`;
      if (!seenIds.has(id)) {
        addRisk({
          id,
          title: titleForCategory(category, null),
          reason: reasonForCategory(category, null, jobTitle),
          category,
          severity: "MEDIUM",
          competency: null,
          evidenceStatus: evidence,
          source: "cv.text_analysis",
        });
      }
    }
  }

  // -------------------------------------------------------------------------
  // D. ATS suggestions as fallback risks (if still room)
  // -------------------------------------------------------------------------
  if (risks.length < MAX_RISKS) {
    for (const suggestion of matching.suggestions) {
      if (!suggestion?.trim()) continue;

      const category = "suggestion";
      const evidence = "PARTIAL";
      const competency = suggestion.length < 60 ? suggestion : null;
      const id = `${category}_${competency ? slug(competency) : 'global'}_${evidence}`;

      addRisk({
        id,
        title: titleForCategory(category, suggestion.length < 40 ? suggestion : null),
        reason: reasonForCategory(
          category,
          suggestion.length < 40 ? suggestion : null,
          jobTitle,
        ),
        category,
        severity: "MEDIUM",
        competency,
        evidenceStatus: evidence,
        source: "matching.suggestions",
      });
      if (risks.length >= MAX_RISKS) break;
    }
  }

  // Sort: HIGH before MEDIUM
  return risks.sort((a, b) => {
    if (a.severity === b.severity) return 0;
    return a.severity === "HIGH" ? -1 : 1;
  });
}
