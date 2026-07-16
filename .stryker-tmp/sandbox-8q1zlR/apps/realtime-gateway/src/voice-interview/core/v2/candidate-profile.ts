/**
 * core/v2/candidate-profile.ts — Profil candidat normalisé (P3.6, Bloc 1).
 *
 * Le moteur V2 ne relit JAMAIS le CV : il travaille sur ce profil dérivé de
 * l'analyse (CV + offre + ATS). PURE, déterministe, sans LLM/DB.
 */
// @ts-nocheck


export type Seniority = "junior" | "mid" | "senior";

export interface CandidateProfile {
  strengths: string[];
  gaps: string[];
  seniority: Seniority;
  technicalSkills: string[];
  softSkills: string[];
  targetRole: string;
}

/** Entrée brute (issue de ProductOutput / ATS côté web, ou d'un appel direct). */
export interface BuildProfileInput {
  strengths?: string[];
  gaps?: string[];
  matchScore?: number;
  targetRole?: string;
  /** Texte CV optionnel : sert uniquement à dériver skills/séniorité ici. */
  cvText?: string;
  jobText?: string;
}

/** Compétences techniques reconnues (catalogue minimal extensible). */
const TECH_VOCAB = [
  "javascript", "typescript", "react", "node", "node.js", "python", "java",
  "go", "rust", "docker", "kubernetes", "aws", "gcp", "azure", "sql",
  "postgresql", "mysql", "mongodb", "redis", "graphql", "rest", "api",
  "ci/cd", "terraform", "kafka", "microservices", "nestjs", "next.js",
];

const SOFT_VOCAB = [
  "leadership", "communication", "autonomie", "rigueur", "esprit d'équipe",
  "équipe", "gestion de projet", "mentorat", "adaptabilité", "curiosité",
];

const SENIOR_MARKERS = [
  "lead", "senior", "principal", "architecte", "manager", "10 ans", "8 ans",
  "responsable", "head of",
];
const JUNIOR_MARKERS = ["junior", "stage", "stagiaire", "alternance", "débutant", "1 an"];

function uniqLower(arr: string[]): string[] {
  return [...new Set(arr.map((s) => s.trim().toLowerCase()).filter(Boolean))];
}

function extractFrom(text: string, vocab: string[]): string[] {
  const t = text.toLowerCase();
  return vocab.filter((v) => t.includes(v));
}

/** Déduit la séniorité à partir du texte + du score de match. */
export function inferSeniority(cvText: string, matchScore: number): Seniority {
  const t = cvText.toLowerCase();
  if (SENIOR_MARKERS.some((m) => t.includes(m))) return "senior";
  if (JUNIOR_MARKERS.some((m) => t.includes(m))) return "junior";
  if (matchScore >= 75) return "senior";
  if (matchScore >= 45) return "mid";
  return "junior";
}

export function buildCandidateProfile(
  input: BuildProfileInput,
): CandidateProfile {
  const cvText = input.cvText ?? "";
  const jobText = input.jobText ?? "";
  const matchScore = typeof input.matchScore === "number" ? input.matchScore : 50;

  const technicalSkills = uniqLower([
    ...(input.strengths ?? []),
    ...extractFrom(cvText, TECH_VOCAB),
  ]).filter((s) => TECH_VOCAB.includes(s) || (input.strengths ?? []).map((x) => x.toLowerCase()).includes(s));

  const softSkills = uniqLower(extractFrom(`${cvText} ${input.strengths?.join(" ") ?? ""}`, SOFT_VOCAB));

  return {
    strengths: uniqLower(input.strengths ?? []),
    gaps: uniqLower(input.gaps ?? extractFrom(jobText, TECH_VOCAB).filter((s) => !cvText.toLowerCase().includes(s))),
    seniority: inferSeniority(cvText, matchScore),
    technicalSkills: technicalSkills.length > 0 ? technicalSkills : extractFrom(cvText, TECH_VOCAB),
    softSkills,
    targetRole: (input.targetRole ?? "").trim() || "le poste visé",
  };
}

/** Le candidat revendique-t-il une compétence (utile pour les questions pièges) ? */
export function claimsSkill(profile: CandidateProfile, skill: string): boolean {
  const s = skill.toLowerCase();
  return (
    profile.technicalSkills.includes(s) ||
    profile.strengths.some((x) => x.includes(s))
  );
}
