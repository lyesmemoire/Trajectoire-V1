/**
 * core/v2/candidate-facts.ts — Faits extraits du CV (P3.7.1). PURE, déterministe.
 *
 * Base de faits utilisée pour détecter les contradictions CV ↔ réponses orales.
 */

export interface CandidateFacts {
  skills: string[];
  /** Années d'expérience déclarées par compétence (best-effort). */
  yearsExperience: Record<string, number>;
  technologiesMentioned: string[];
  certifications: string[];
}

const TECH_VOCAB = [
  "javascript", "typescript", "react", "node", "node.js", "python", "java",
  "go", "rust", "docker", "kubernetes", "aws", "gcp", "azure", "sql",
  "postgresql", "mysql", "mongodb", "redis", "graphql", "rest", "terraform",
  "kafka", "spark", "microservices", "nestjs", "next.js",
];

const CERT_MARKERS = ["certifié", "certified", "certification", "aws certified", "cka", "ckad"];

/**
 * Extrait les années d'expérience par techno. Repère des motifs comme :
 *  "Kubernetes : 2 ans", "4 ans d'AWS", "AWS (3 ans)".
 */
function extractYears(text: string): Record<string, number> {
  const t = text.toLowerCase();
  const out: Record<string, number> = {};
  for (const skill of TECH_VOCAB) {
    if (!t.includes(skill)) continue;
    // L'année suit généralement la techno ("AWS : 4 ans"). On ne regarde
    // qu'APRÈS le skill (fenêtre courte) pour éviter de capter l'année d'une
    // autre techno mentionnée juste avant.
    const idx = t.indexOf(skill);
    const window = t.slice(idx + skill.length, idx + skill.length + 20);
    const m = window.match(/(\d+)\s*an/);
    if (m && m[1]) out[skill] = Number(m[1]);
  }
  return out;
}

export function extractCandidateFacts(cvText: string): CandidateFacts {
  const t = (cvText ?? "").toLowerCase();
  const skills = TECH_VOCAB.filter((s) => t.includes(s));
  return {
    skills,
    yearsExperience: extractYears(cvText ?? ""),
    technologiesMentioned: skills,
    certifications: CERT_MARKERS.filter((c) => t.includes(c)),
  };
}

export interface Contradiction {
  type: "years_mismatch" | "skill_denied";
  skill: string;
  cvValue: number | string;
  spokenValue: number | string;
  message: string;
}

/**
 * Compare une réponse orale aux faits du CV et renvoie une contradiction si écart.
 * Déterministe ; ne renvoie qu'au plus une contradiction (la plus parlante).
 */
export function detectContradiction(facts: CandidateFacts, transcript: string, ): Contradiction | null {
  const t = (transcript ?? "").toLowerCase();

  // Écart d'années sur une compétence présente dans le CV.
  for (const [skill, cvYears] of Object.entries(facts.yearsExperience)) {
    if (!t.includes(skill)) continue;
    const idx = t.indexOf(skill);
    // "depuis 6 ans" peut précéder ou suivre la techno -> fenêtre des deux côtés,
    // mais on privilégie une fenêtre resserrée pour rester fiable.
    const window = t.slice(Math.max(0, idx - 20), idx + skill.length + 20);
    const m = window.match(/(\d+)\s*an/);
    if (m && m[1]) {
      const spoken = Number(m[1]);
      if (Math.abs(spoken - cvYears) >= 2) {
        return {
          type: "years_mismatch",
          skill,
          cvValue: cvYears,
          spokenValue: spoken,
          message: `Je remarque un écart : ton CV mentionne plutôt ${cvYears} an(s) d'expérience sur « ${skill} », mais tu indiques ${spoken}. Peux-tu préciser ?`,
        };
      }
    }
  }
  return null;
}
