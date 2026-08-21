import {
  generateObject,
} from "ai";

import {
  extractCVText,
} from "./extraction/extract-pdf-text";

import {
  normalizeSkills,
} from "./normalization/normalize-skills";

import {
  calculateSkillScore,
} from "./scoring/engine";

import {
  calculatePremiumATSScore,
  PremiumATSScore,
} from "./scoring/premium-engine";

import {
  detectRecruiterSignals,
} from "./recruiter-signals/detector";

import {
  generateRecruiterDoubts,
} from "./recruiter-signals/doubt-engine";

import {
  analyzeTechnicalLeadership,
  detectInconsistencies,
  predictInterviewRisks,
} from "./behavioral-logic/recruiter-grade";

import {
  JobIntelligenceSchema,
  AdvancedCVSchema,
  RecruiterFeedbackSchema,
} from "./schemas/orchestrator-schemas";

import {
  getFastAIModel,
  getReasoningAIModel,
  isRemoteAIAvailable,
} from "@/lib/ai/ai-models";

import {
  MunitionPack,
} from "./contracts/munitions";

export interface PremiumATSAnalysis {
  candidateId: string;
  jobTitle: string;
  analyzedAt: string;

  score: PremiumATSScore;

  recruiterSignals: string[];
  strengths: string[];
  missingSkills: string[];

  rewriteSuggestions: Array<{
    original: string;
    improved: string;
  }>;

  confidence: number;

  munitionPack: MunitionPack;
}

/**
 * Orchestrateur ATS Premium.
 *
 * Le moteur combine :
 * - extraction CV ;
 * - parsing IA ou local ;
 * - scoring déterministe ;
 * - signaux recruteur ;
 * - risques entretien ;
 * - recommandations de reformulation.
 *
 * Aucun fournisseur IA n'est obligatoire.
 */
export async function processPremiumATSAnalysis(
  cvBuffer: Buffer,
  jobDescription: string,
): Promise<PremiumATSAnalysis> {
  // ==========================================================
  // 1. EXTRACTION
  // ==========================================================

  const extraction =
    await extractCVText(
      cvBuffer,
    );

  // ==========================================================
  // 2. INTELLIGENCE GATHERING
  // ==========================================================

  const [
    jobData,
    cvProfile,
    doubts,
  ] =
    await Promise.all([
      analyzeJobOfferIntelligence(
        jobDescription,
      ),

      extractAdvancedCVProfile(
        extraction.text,
      ),

      generateRecruiterDoubts(
        extraction.text,
        jobDescription,
      ),
    ]);

  // ==========================================================
  // 3. DETERMINISTIC SKILL MATCHING
  // ==========================================================

  const skillMatch =
    calculateSkillScore(
      normalizeSkills(
        jobData.hard_skills,
      ),

      normalizeSkills(
        cvProfile.hard_skills,
      ),
    );

  // ==========================================================
  // 4. ANALYSIS LAYERS
  // ==========================================================

  const [
    techLeadership,
    simulation,
  ] =
    await Promise.all([
      analyzeTechnicalLeadership(
        extraction.text,
      ),

      simulateRecruiterFeedback(
        cvProfile,
        skillMatch.score,
      ),
    ]);

  // ==========================================================
  // 5. MULTI-DIMENSIONAL SCORING
  // ==========================================================

  const premiumScore =
    calculatePremiumATSScore(
      {
        skillMatchScore:
          skillMatch.score,

        seniorityScore:
          calculateSeniorityScore(
            cvProfile.seniority,
          ),

        readabilityScore:
          extraction.confidence *
          100,
      },
      {
        leadershipScore:
          cvProfile.leadership_score,

        metricsScore:
          cvProfile.impact_metrics_score,
      },
    );

  // ==========================================================
  // 6. RECRUITER RISK INTELLIGENCE
  // ==========================================================

  const inconsistencies =
    detectInconsistencies(
      cvProfile,
      jobData,
    );

  const interviewRisks =
    predictInterviewRisks(
      doubts,
    );

  // ==========================================================
  // 7. MUNITION PACK
  // ==========================================================

  const generatedAt =
    new Date()
      .toISOString();

  const munitionPack:
    MunitionPack = {
      generatedAt,

      munitions: [
        ...doubts,
        ...techLeadership,
        ...inconsistencies,
        ...interviewRisks,
      ],

      context: {
        overallATS:
          premiumScore.overall,

        riskLevel:
          premiumScore.overall < 60
            ? "high"
            : premiumScore.overall < 80
              ? "medium"
              : "low",

        coachingFocus:
          skillMatch.missing,
      },
    };

  return {
    candidateId:
      "anonymous",

    jobTitle:
      jobData.title ||
      "Poste non spécifié",

    analyzedAt:
      generatedAt,

    score:
      premiumScore,

    recruiterSignals:
      detectRecruiterSignals(
        jobDescription,
      ),

    strengths:
      simulation.strengths,

    missingSkills:
      skillMatch.missing,

    rewriteSuggestions:
      simulation.rewrites,

    confidence:
      extraction.confidence,

    munitionPack,
  };
}

// ============================================================
// JOB INTELLIGENCE
// ============================================================

async function analyzeJobOfferIntelligence(
  text: string,
): Promise<any> {
  if (
    !isRemoteAIAvailable()
  ) {
    return analyzeJobOfferLocally(
      text,
    );
  }

  try {
    const {
      object,
    } =
      await generateObject({
        model:
          getFastAIModel(),

        schema:
          JobIntelligenceSchema,

        temperature:
          0.1,

        system:
          [
            "Analyze the job offer.",
            "Extract the job title, technical skills, seniority and minimum experience.",
            'Return JSON: { "title": "", "hard_skills": [], "seniority": "", "min_years": 0 }',
          ].join(" "),

        prompt:
          text,
      });

    return object;
  } catch {
    return analyzeJobOfferLocally(
      text,
    );
  }
}

// ============================================================
// CV PROFILE
// ============================================================

async function extractAdvancedCVProfile(
  text: string,
): Promise<any> {
  if (
    !isRemoteAIAvailable()
  ) {
    return analyzeCVLocally(
      text,
    );
  }

  try {
    const {
      object,
    } =
      await generateObject({
        model:
          getFastAIModel(),

        schema:
          AdvancedCVSchema,

        temperature:
          0.1,

        system:
          [
            "Analyze the candidate CV.",
            "Extract technical skills, seniority, leadership evidence, impact metrics and years of experience.",
            'Return JSON: { "hard_skills": [], "seniority": 0, "leadership_score": 0, "impact_metrics_score": 0, "years_experience": 0 }',
          ].join(" "),

        prompt:
          text,
      });

    return object;
  } catch {
    return analyzeCVLocally(
      text,
    );
  }
}

// ============================================================
// RECRUITER SIMULATION
// ============================================================

async function simulateRecruiterFeedback(
  cv: any,
  score: number,
): Promise<any> {
  if (
    !isRemoteAIAvailable()
  ) {
    return generateLocalRecruiterFeedback(
      cv,
      score,
    );
  }

  try {
    const {
      object,
    } =
      await generateObject({
        model:
          getReasoningAIModel(),

        schema:
          RecruiterFeedbackSchema,

        temperature:
          0.1,

        system:
          [
            "Act as a demanding recruiter.",
            "Identify concrete strengths and weaknesses.",
            "Suggest concise rewrites when candidate evidence is weak.",
            'Return JSON: { "concerns": [], "strengths": [], "rewrites": [{ "original": "", "improved": "" }] }',
          ].join(" "),

        prompt:
          JSON.stringify({
            score,
            profile: cv,
          }),
      });

    return object;
  } catch {
    return generateLocalRecruiterFeedback(
      cv,
      score,
    );
  }
}

// ============================================================
// LOCAL JOB ANALYSIS
// ============================================================

function analyzeJobOfferLocally(
  text: string,
): {
  title: string;
  hard_skills: string[];
  seniority: string;
  min_years: number;
} {
  const normalized =
    normalizeText(text);

  return {
    title:
      extractJobTitle(
        text,
      ),

    hard_skills:
      extractTechnicalSkills(
        text,
      ),

    seniority:
      detectSeniority(
        normalized,
      ),

    min_years:
      detectMinimumYears(
        normalized,
      ),
  };
}

// ============================================================
// LOCAL CV ANALYSIS
// ============================================================

function analyzeCVLocally(
  text: string,
): {
  hard_skills: string[];
  seniority: number;
  leadership_score: number;
  impact_metrics_score: number;
  years_experience: number;
} {
  const normalized =
    normalizeText(text);

  const yearsExperience =
    detectMaximumExperienceYears(
      normalized,
    );

  return {
    hard_skills:
      extractTechnicalSkills(
        text,
      ),

    seniority:
      calculateLocalSeniority(
        normalized,
        yearsExperience,
      ),

    leadership_score:
      calculateLeadershipScore(
        normalized,
      ),

    impact_metrics_score:
      calculateImpactMetricsScore(
        text,
      ),

    years_experience:
      yearsExperience,
  };
}

// ============================================================
// LOCAL RECRUITER FEEDBACK
// ============================================================

function generateLocalRecruiterFeedback(
  cv: any,
  score: number,
): {
  concerns: string[];
  strengths: string[];
  rewrites: Array<{
    original: string;
    improved: string;
  }>;
} {
  const strengths:
    string[] = [];

  const concerns:
    string[] = [];

  const rewrites:
    Array<{
      original: string;
      improved: string;
    }> = [];

  const hardSkills =
    Array.isArray(
      cv?.hard_skills,
    )
      ? cv.hard_skills
      : [];

  if (
    hardSkills.length >= 5
  ) {
    strengths.push(
      "Le CV présente plusieurs compétences techniques clairement identifiables.",
    );
  }

  if (
    Number(
      cv?.leadership_score ??
      0,
    ) >= 60
  ) {
    strengths.push(
      "Le parcours contient des signaux de leadership ou de responsabilité.",
    );
  }

  if (
    Number(
      cv?.impact_metrics_score ??
      0,
    ) >= 60
  ) {
    strengths.push(
      "Le CV contient des résultats ou impacts mesurables.",
    );
  }

  if (
    score < 60
  ) {
    concerns.push(
      "L'adéquation technique avec l'offre reste insuffisante.",
    );
  }

  if (
    Number(
      cv?.impact_metrics_score ??
      0,
    ) < 50
  ) {
    concerns.push(
      "Les réalisations sont insuffisamment quantifiées.",
    );

    rewrites.push({
      original:
        "Responsable de plusieurs projets.",

      improved:
        "Pilotage de projets avec résultats mesurables, périmètre précis et impact quantifié.",
    });
  }

  if (
    Number(
      cv?.leadership_score ??
      0,
    ) < 50
  ) {
    concerns.push(
      "Le niveau de responsabilité personnelle n'est pas suffisamment démontré.",
    );
  }

  if (
    strengths.length === 0
  ) {
    strengths.push(
      "Le profil contient des éléments exploitables pour approfondir l'évaluation.",
    );
  }

  return {
    concerns,
    strengths,
    rewrites,
  };
}

// ============================================================
// TECHNICAL SKILL EXTRACTION
// ============================================================

function extractTechnicalSkills(
  text: string,
): string[] {
  const normalized =
    normalizeText(text);

  const dictionary = [
    "javascript",
    "typescript",
    "react",
    "next.js",
    "nextjs",
    "node.js",
    "nodejs",
    "python",
    "java",
    "c#",
    "c++",
    "php",
    "go",
    "golang",
    "rust",
    "sql",
    "postgresql",
    "postgres",
    "mysql",
    "mongodb",
    "redis",
    "elasticsearch",
    "docker",
    "kubernetes",
    "terraform",
    "ansible",
    "aws",
    "azure",
    "gcp",
    "git",
    "github",
    "gitlab",
    "jenkins",
    "graphql",
    "rest",
    "html",
    "css",
    "tailwind",
    "prisma",
    "supabase",
    "linux",
    "figma",
    "power bi",
    "tableau",
    "excel",
    "sap",
    "salesforce",
    "pytorch",
    "tensorflow",
    "scikit-learn",
    "machine learning",
    "data science",
    "devops",
    "ci/cd",
    "agile",
    "scrum",
  ];

  return Array.from(
    new Set(
      dictionary.filter(
        (skill) =>
          normalized.includes(
            normalizeText(
              skill,
            ),
          ),
      ),
    ),
  );
}

// ============================================================
// JOB TITLE
// ============================================================

function extractJobTitle(
  text: string,
): string {
  const lines =
    text
      .split(/\r?\n/)
      .map(
        (line) =>
          line.trim(),
      )
      .filter(Boolean);

  if (
    lines.length === 0
  ) {
    return "";
  }

  const candidate =
    lines.find(
      (line) =>
        line.length >= 3 &&
        line.length <= 120 &&
        !line.includes("@") &&
        !/^https?:\/\//i.test(
          line,
        ),
    );

  return candidate ?? "";
}

// ============================================================
// SENIORITY
// ============================================================

function detectSeniority(
  normalizedText: string,
): string {
  if (
    /\b(principal|lead|staff|expert|senior)\b/.test(
      normalizedText,
    )
  ) {
    return "senior";
  }

  if (
    /\b(junior|debutant|entry level)\b/.test(
      normalizedText,
    )
  ) {
    return "junior";
  }

  return "intermediate";
}

function detectMinimumYears(
  normalizedText: string,
): number {
  const matches =
    Array.from(
      normalizedText.matchAll(
        /(\d{1,2})\s*(?:\+?\s*)?(?:ans|annees|years)/g,
      ),
    );

  if (
    matches.length === 0
  ) {
    return 0;
  }

  const values =
    matches
      .map(
        (match) =>
          Number.parseInt(
            match[1] ?? "0",
            10,
          ),
      )
      .filter(
        Number.isFinite,
      );

  if (
    values.length === 0
  ) {
    return 0;
  }

  return Math.min(
    ...values,
  );
}

function detectMaximumExperienceYears(
  normalizedText: string,
): number {
  const matches =
    Array.from(
      normalizedText.matchAll(
        /(\d{1,2})\s*(?:\+?\s*)?(?:ans|annees|years)/g,
      ),
    );

  const values =
    matches
      .map(
        (match) =>
          Number.parseInt(
            match[1] ?? "0",
            10,
          ),
      )
      .filter(
        (value) =>
          Number.isFinite(
            value,
          ) &&
          value <= 50,
      );

  if (
    values.length === 0
  ) {
    return 0;
  }

  return Math.max(
    ...values,
  );
}

function calculateLocalSeniority(
  normalizedText: string,
  yearsExperience: number,
): number {
  let score = 40;

  if (
    yearsExperience >= 2
  ) {
    score += 10;
  }

  if (
    yearsExperience >= 5
  ) {
    score += 20;
  }

  if (
    yearsExperience >= 8
  ) {
    score += 15;
  }

  if (
    /\b(senior|lead|manager|architect|principal|staff|head)\b/.test(
      normalizedText,
    )
  ) {
    score += 15;
  }

  return clampScore(
    score,
  );
}

// ============================================================
// LEADERSHIP
// ============================================================

function calculateLeadershipScore(
  normalizedText: string,
): number {
  const leadershipTerms = [
    "lead",
    "leader",
    "manager",
    "management",
    "pilotage",
    "coordination",
    "encadrement",
    "mentor",
    "mentorat",
    "equipe",
    "team",
    "responsable",
    "direction",
    "strategie",
  ];

  const occurrences =
    leadershipTerms.reduce(
      (
        count,
        term,
      ) =>
        count +
        (
          normalizedText.includes(
            term,
          )
            ? 1
            : 0
        ),
      0,
    );

  return clampScore(
    30 +
      occurrences *
        10,
  );
}

// ============================================================
// IMPACT METRICS
// ============================================================

function calculateImpactMetricsScore(
  text: string,
): number {
  const metrics =
    text.match(
      /\b\d+(?:[.,]\d+)?\s?(?:%|€|k€|m€|jours?|heures?|mois|ans?|clients?|utilisateurs?|projets?)\b/gi,
    ) ?? [];

  const impactWords =
    normalizeText(text)
      .match(
        /\b(augmente|reduit|ameliore|optimise|economise|accelere|croissance|performance|revenu|conversion|productivite)\b/g,
      ) ?? [];

  return clampScore(
    25 +
      metrics.length *
        10 +
      impactWords.length *
        5,
  );
}

// ============================================================
// SCORE HELPERS
// ============================================================

function calculateSeniorityScore(
  seniority: unknown,
): number {
  if (
    typeof seniority ===
      "number"
  ) {
    return clampScore(
      seniority,
    );
  }

  if (
    typeof seniority !==
      "string"
  ) {
    return 60;
  }

  const normalized =
    normalizeText(
      seniority,
    );

  if (
    normalized.includes(
      "senior",
    ) ||
    normalized.includes(
      "lead",
    )
  ) {
    return 85;
  }

  if (
    normalized.includes(
      "junior",
    )
  ) {
    return 55;
  }

  return 70;
}

function clampScore(
  value: number,
): number {
  return Math.max(
    0,
    Math.min(
      100,
      Math.round(value),
    ),
  );
}

function normalizeText(
  value: string,
): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(
      /[\u0300-\u036f]/g,
      "",
    );
}