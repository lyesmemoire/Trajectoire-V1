import { ParsedCV } from "../../types/cv";

export interface BulletDiagnostic {
  bullet: string;
  metrics: {
    hasQuantification: boolean;
    actionVerb: boolean;
    tooLong: boolean;
    tooShort: boolean;
    passive: boolean;
  };
  score: number;
}

export interface SectionDiagnostic {
  sectionTitle: string;
  bullets: BulletDiagnostic[];
  sectionScore: number;
}

export interface GlobalDiagnostic {
  impactScore: number; // 0 to 10
  clarityScore: number; // 0 to 10
  quantificationScore: number; // 0 to 10
  overallScore: number; // 0 to 10
  sections: SectionDiagnostic[];
}

const ACTION_VERBS = new Set([
  // FR
  "piloté", "optimisé", "déployé", "conçu", "géré", "dirigé", "créé", "développé",
  "réalisé", "mis en place", "augmenté", "réduit", "atteint", "mené", "coordonné",
  "animé", "lancé", "implémenté", "structuré", "garanti", "assuré", "supervisé",
  "accompagné", "délivré", "construit", "organisé",
  // EN
  "managed", "led", "developed", "designed", "optimized", "deployed", "created",
  "implemented", "increased", "decreased", "reduced", "achieved", "coordinated",
  "launched", "structured", "ensured", "supervised", "built", "delivered",
  "organized", "spearheaded", "executed"
]);

const PASSIVE_MARKERS = [
  "a été", "ont été", "was", "were", "ayant été", "étant"
];

const QUANTIFICATION_REGEX = /(\d+[\.,]?\d*\s*(%|€|k€|K|M|mois|ans|clients|utilisateurs|users))|\b\d+\b/i;
const PERF_CONTEXT_REGEX = /(réduction|augmentation|gain|croissance|hausse|baisse|reduction|increase|growth|profit|amélioration|improvement)/i;

export function evaluateBullet(bullet: string): BulletDiagnostic {
  const words = bullet.split(/\s+/).filter(w => w.trim().length > 0);
  const length = words.length;
  
  const tooLong = length > 22;
  const tooShort = length < 8;

  const firstWord = words[0]?.toLowerCase()?.replace(/[.,:;!?]/g, "") || "";
  const actionVerb = ACTION_VERBS.has(firstWord);

  const lowerBullet = bullet.toLowerCase();
  const passive = PASSIVE_MARKERS.some(marker => lowerBullet.includes(marker));

  const hasPlaceholder = /\[.*?\]/.test(bullet);
  const hasQuantBase = QUANTIFICATION_REGEX.test(bullet);
  const hasPerfContext = PERF_CONTEXT_REGEX.test(bullet);
  
  // A bullet only gets quantification points if it has real numbers, NOT placeholders
  const hasQuantification = hasQuantBase && !hasPlaceholder; 

  let score = 5; // Base score out of 10
  
  if (hasQuantification) {
    score += 2;
    if (hasPerfContext) score += 1;
  }
  
  if (actionVerb) score += 2;
  
  if (passive) score -= 1;
  if (tooLong || tooShort) score -= 1;

  score = Math.max(0, Math.min(10, score));

  return {
    bullet,
    metrics: {
      hasQuantification,
      actionVerb,
      tooLong,
      tooShort,
      passive
    },
    score
  };
}

export function evaluateCV(cv: ParsedCV): GlobalDiagnostic {
  const sections: SectionDiagnostic[] = [];
  let totalBullets = 0;
  let totalImpact = 0;
  let totalClarity = 0;
  let totalQuant = 0;

  for (const exp of cv.experiences) {
    if (!exp.bullets || exp.bullets.length === 0) continue;
    
    const bulletDiags = exp.bullets.map(evaluateBullet);
    const sectionScore = bulletDiags.reduce((acc, b) => acc + b.score, 0) / bulletDiags.length;

    for (const b of bulletDiags) {
      totalBullets++;
      if (b.metrics.actionVerb && !b.metrics.passive) totalImpact += 1;
      if (!b.metrics.tooLong && !b.metrics.tooShort) totalClarity += 1;
      if (b.metrics.hasQuantification) totalQuant += 1;
    }

    sections.push({
      sectionTitle: exp.position || exp.company || "Experience",
      bullets: bulletDiags,
      sectionScore
    });
  }

  if (totalBullets === 0) {
    return { impactScore: 0, clarityScore: 0, quantificationScore: 0, overallScore: 0, sections: [] };
  }

  const impactScore = (totalImpact / totalBullets) * 10;
  const clarityScore = (totalClarity / totalBullets) * 10;
  const quantificationScore = (totalQuant / totalBullets) * 10;
  
  const overallScore = (impactScore * 0.4) + (clarityScore * 0.3) + (quantificationScore * 0.3);

  return {
    impactScore,
    clarityScore,
    quantificationScore,
    overallScore,
    sections
  };
}
