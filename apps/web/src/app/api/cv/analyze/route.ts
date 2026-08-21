// apps/web/src/app/api/cv/analyze/route.ts
//
// PASS 13ZQ-C23
// CV ANALYSIS - PROVIDER NEUTRAL
//
// Principes :
// - aucune dépendance Mistral
// - aucune clé IA obligatoire au démarrage
// - OpenAI utilisé uniquement lorsqu'un provider distant est disponible
// - fallback local déterministe si aucune IA distante n'est configurée
// - conservation du billing, de l'idempotence, de Prisma et de HIIOS

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { generateText } from "ai";

import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";

import {
  getReasoningAIModel,
  isRemoteAIAvailable,
} from "@/lib/ai/ai-models";

import { CVHIIOSBridge } from "@/application/services/CVHIIOSBridge";
import { BillingService } from "@/lib/db/billing.service";
import { IdempotencyService } from "@/core/idempotency/IdempotencyService";

import { rateLimit } from "@/lib/rate-limiting/rate-limit.middleware";
import {
  RateLimitScope,
  RouteType,
} from "@/lib/rate-limiting/centralized-rate-limit.service";

import { csrfProtect } from "@/lib/security/csrf-middleware";

// ============================================================
// SCHEMA
// ============================================================

const CvAnalysisSchema = z.object({
  personal: z.object({
    name: z.string().optional(),
    email: z.string().optional(),
    phone: z.string().optional(),
    location: z.string().optional(),
    linkedin: z.string().optional(),
  }),

  currentPosition: z
    .object({
      title: z.string().optional(),
      company: z.string().optional(),
      yearsInRole: z.number().optional(),
    })
    .optional(),

  totalExperience: z.number().optional(),

  experiences: z.array(
    z.object({
      company: z.string(),
      title: z.string(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      current: z.boolean().optional(),
      highlights: z.array(z.string()).optional(),
    }),
  ),

  education: z.array(
    z.object({
      institution: z.string(),
      degree: z.string().optional(),
      field: z.string().optional(),
      year: z.number().optional(),
    }),
  ),

  skills: z.object({
    technical: z.array(z.string()),
    soft: z.array(z.string()),
    languages: z.array(z.string()),
  }),

  careerDNA: z.object({
    seniority: z.enum([
      "junior",
      "mid",
      "senior",
      "executive",
    ]),
    strengths: z.array(z.string()),
    patterns: z.array(z.string()),
    targetRoles: z.array(z.string()),
    industries: z.array(z.string()),
    redFlags: z.array(z.string()),
  }),
});

type CvAnalysis = z.infer<typeof CvAnalysisSchema>;

// ============================================================
// PROMPT
// ============================================================

const SYSTEM_PROMPT = `
Tu es un expert en analyse de parcours professionnels.

Tu analyses des CV et extrais les informations de manière
structurée, factuelle et objective.

RÈGLES ABSOLUES :
- Ne jamais inventer une information absente du CV.
- Ne jamais extrapoler une entreprise, un diplôme ou une date.
- Les compétences doivent provenir du contenu du CV.
- Les forces doivent être justifiables par le CV.
- Les red flags doivent rester factuels.
- Retourner uniquement un JSON valide.
- Aucun Markdown.
- Aucun commentaire autour du JSON.

Structure attendue :

{
  "personal": {
    "name": "",
    "email": "",
    "phone": "",
    "location": "",
    "linkedin": ""
  },
  "currentPosition": {
    "title": "",
    "company": "",
    "yearsInRole": 0
  },
  "totalExperience": 0,
  "experiences": [],
  "education": [],
  "skills": {
    "technical": [],
    "soft": [],
    "languages": []
  },
  "careerDNA": {
    "seniority": "junior|mid|senior|executive",
    "strengths": [],
    "patterns": [],
    "targetRoles": [],
    "industries": [],
    "redFlags": []
  }
}
`.trim();

// ============================================================
// AI / LOCAL ANALYSIS
// ============================================================

async function analyzeCV(
  text: string,
): Promise<CvAnalysis> {
  if (!isRemoteAIAvailable()) {
    logger.info(
      {
        event: "CV analyze - local fallback",
        reason: "remote_ai_unavailable",
      },
      "Remote AI unavailable, using local CV analyzer",
    );

    return analyzeCVLocally(text);
  }

  try {
    const response = await generateText({
      model: getReasoningAIModel(),
      system: SYSTEM_PROMPT,
      prompt: `Analyse ce CV :\n\n${text.slice(0, 12000)}`,
      temperature: 0.1,
    });

    const rawContent = cleanJsonResponse(
      response.text,
    );

    if (!rawContent) {
      throw new Error(
        "Réponse IA vide",
      );
    }

    const parsed: unknown =
      JSON.parse(rawContent);

    return CvAnalysisSchema.parse(
      parsed,
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      logger.error(
        {
          event:
            "CV analyze - remote schema validation failed",
          errorType:
            "ZOD_VALIDATION",
          fieldCount:
            error.issues.length,
        },
        "Invalid remote AI CV structure",
      );
    } else {
      logger.error(
        {
          event:
            "CV analyze - remote AI unavailable",
          message:
            error instanceof Error
              ? error.message
              : "Unknown error",
        },
        "Remote CV analysis failed",
      );
    }

    /*
     * L'indisponibilité du provider IA ne doit jamais
     * bloquer le tunnel CV.
     */
    return analyzeCVLocally(text);
  }
}

function cleanJsonResponse(
  value: string,
): string {
  return value
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();
}
function analyzeCVLocally(
  text: string,
): CvAnalysis {
  const lines = text
    .split(/\r?\n/)
    .map((line) =>
      line
        .replace(/\s+/g, " ")
        .trim(),
    )
    .filter(Boolean);

  const email =
    text.match(
      /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i,
    )?.[0];

  const phone =
    text
      .match(
        /(?:\+?\d[\d\s().-]{7,}\d)/,
      )?.[0]
      ?.replace(/\s+/g, " ")
      .trim();

  const linkedin =
    text.match(
      /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[^\s,;]+/i,
    )?.[0];

  const name =
    detectCandidateName(
      lines,
      email,
    );

  const technical =
    detectTechnicalSkills(
      text,
    );

  const soft =
    detectSoftSkills(
      text,
    );

  const languages =
    detectLanguages(
      text,
    );

  const totalExperience =
    estimateExperienceYears(
      text,
    );

  const seniority =
    detectSeniority(
      text,
      totalExperience,
    );

  const targetRoles =
    detectTargetRoles(
      lines,
    );

  const strengths =
    buildStrengths({
      technical,
      soft,
      languages,
      totalExperience,
    });

  return CvAnalysisSchema.parse({
    personal: {
      ...(name
        ? { name }
        : {}),

      ...(email
        ? { email }
        : {}),

      ...(phone
        ? { phone }
        : {}),

      ...(linkedin
        ? { linkedin }
        : {}),

      location:
        detectLocation(
          lines,
        ),
    },

    currentPosition:
      detectCurrentPosition(
        lines,
      ),

    totalExperience,

    experiences: [],

    education: [],

    skills: {
      technical,
      soft,
      languages,
    },

    careerDNA: {
      seniority,
      strengths,

      patterns:
        detectCareerPatterns(
          text,
        ),

      targetRoles,

      industries:
        detectIndustries(
          text,
        ),

      redFlags:
        detectRedFlags(
          text,
          lines,
        ),
    },
  });
}

function detectCandidateName(
  lines: string[],
  email?: string,
): string | undefined {
  const candidate =
    lines.find(
      (line) => {
        if (
          line.length < 3 ||
          line.length > 80
        ) {
          return false;
        }

        if (
          email &&
          line.includes(email)
        ) {
          return false;
        }

        if (
          /@|https?:\/\/|linkedin|curriculum|curriculum vitae|\bcv\b/i.test(
            line,
          )
        ) {
          return false;
        }

        if (
          /\d{3,}/.test(line)
        ) {
          return false;
        }

        const words =
          line
            .split(/\s+/)
            .filter(Boolean);

        return (
          words.length >= 2 &&
          words.length <= 5
        );
      },
    );

  return candidate;
}

function detectLocation(
  lines: string[],
): string | undefined {
  const knownLocations =
    /\b(?:Paris|Lyon|Marseille|Toulouse|Bordeaux|Lille|Nantes|Nice|Montpellier|Rennes|Strasbourg|Alger|Algerie|Algérie|Oran|Constantine|Blida|Tipaza|Bruxelles|Belgique|Genève|Geneve|Suisse|Montréal|Montreal|Canada|London|Londres)\b/i;

  return lines.find(
    (line) =>
      knownLocations.test(line),
  );
}

function detectCurrentPosition(
  lines: string[],
):
  | {
      title?: string;
      company?: string;
      yearsInRole?: number;
    }
  | undefined {
  const titlePatterns = [
    /\bsoftware engineer\b/i,
    /\bdeveloper\b/i,
    /\bdéveloppeur\b/i,
    /\bdeveloppeur\b/i,
    /\bproduct manager\b/i,
    /\bproject manager\b/i,
    /\bchef de projet\b/i,
    /\bdata analyst\b/i,
    /\bdata scientist\b/i,
    /\bconsultant\b/i,
    /\bmanager\b/i,
    /\bdirector\b/i,
    /\bdirecteur\b/i,
    /\bengineer\b/i,
    /\bingénieur\b/i,
    /\bingenieur\b/i,
    /\bdesigner\b/i,
    /\bcommercial\b/i,
    /\bsales\b/i,
    /\bmarketing\b/i,
  ];

  const title =
    lines.find((line) =>
      titlePatterns.some(
        (pattern) =>
          pattern.test(line),
      ),
    );

  if (!title) {
    return undefined;
  }

  return {
    title:
      title.slice(0, 150),
  };
}
function detectTechnicalSkills(
  text: string,
): string[] {
  return detectTerms(
    text,
    [
      "JavaScript",
      "TypeScript",
      "React",
      "Next.js",
      "Node.js",
      "Python",
      "Java",
      "C#",
      "C++",
      "PHP",
      "Go",
      "Rust",
      "HTML",
      "CSS",
      "Tailwind",
      "SQL",
      "PostgreSQL",
      "MySQL",
      "MongoDB",
      "Redis",
      "Elasticsearch",
      "Supabase",
      "Prisma",
      "Docker",
      "Kubernetes",
      "Terraform",
      "Ansible",
      "AWS",
      "Azure",
      "GCP",
      "Git",
      "GitHub",
      "GitLab",
      "Jenkins",
      "GraphQL",
      "REST",
      "Linux",
      "DevOps",
      "CI/CD",
      "Figma",
      "Power BI",
      "Tableau",
      "Excel",
      "SAP",
      "Salesforce",
      "PyTorch",
      "TensorFlow",
      "Scikit-learn",
      "Machine Learning",
      "Data Science",
    ],
  );
}

function detectSoftSkills(
  text: string,
): string[] {
  return detectTerms(
    text,
    [
      "Leadership",
      "Communication",
      "Autonomie",
      "Organisation",
      "Créativité",
      "Adaptabilité",
      "Collaboration",
      "Travail en équipe",
      "Gestion de projet",
      "Management",
      "Négociation",
      "Résolution de problèmes",
    ],
  );
}

function detectLanguages(
  text: string,
): string[] {
  const languages: Array<{
    label: string;
    aliases: string[];
  }> = [
    {
      label: "Français",
      aliases: [
        "français",
        "francais",
        "french",
      ],
    },
    {
      label: "Anglais",
      aliases: [
        "anglais",
        "english",
      ],
    },
    {
      label: "Arabe",
      aliases: [
        "arabe",
        "arabic",
      ],
    },
    {
      label: "Espagnol",
      aliases: [
        "espagnol",
        "spanish",
      ],
    },
    {
      label: "Allemand",
      aliases: [
        "allemand",
        "german",
      ],
    },
    {
      label: "Italien",
      aliases: [
        "italien",
        "italian",
      ],
    },
  ];

  const normalized =
    normalizeText(text);

  return languages
    .filter(({ aliases }) =>
      aliases.some((alias) =>
        normalized.includes(
          normalizeText(alias),
        ),
      ),
    )
    .map(({ label }) => label);
}

function detectTerms(
  text: string,
  terms: string[],
): string[] {
  const normalized =
    normalizeText(text);

  return Array.from(
    new Set(
      terms.filter((term) =>
        normalized.includes(
          normalizeText(term),
        ),
      ),
    ),
  );
}

function estimateExperienceYears(
  text: string,
): number {
  const normalized =
    normalizeText(text);

  const explicit =
    normalized.match(
      /(\d{1,2})\s*(?:ans|annees|annee|years?|yrs?)\s+(?:d[' ]?)?(?:experience|expérience)/i,
    );

  if (explicit?.[1]) {
    return clampNumber(
      Number(explicit[1]),
      0,
      50,
    );
  }

  const currentYear =
    new Date().getFullYear();

  const years =
    Array.from(
      text.matchAll(
        /\b(19\d{2}|20\d{2})\b/g,
      ),
    )
      .map((match) =>
        Number(match[1]),
      )
      .filter(
        (year) =>
          year >= 1970 &&
          year <= currentYear,
      );

  if (years.length < 2) {
    return 0;
  }

  const earliest =
    Math.min(...years);

  return clampNumber(
    currentYear - earliest,
    0,
    50,
  );
}

function detectSeniority(
  text: string,
  years: number,
):
  | "junior"
  | "mid"
  | "senior"
  | "executive" {
  const normalized =
    normalizeText(text);

  if (
    /\b(?:ceo|cto|cfo|coo|chief|vp|vice president|directeur general|directrice generale)\b/i.test(
      normalized,
    )
  ) {
    return "executive";
  }

  if (
    /\b(?:senior|lead|principal|staff|manager|directeur|directrice|head of)\b/i.test(
      normalized,
    ) ||
    years >= 8
  ) {
    return "senior";
  }

  if (years >= 3) {
    return "mid";
  }

  return "junior";
}

function detectTargetRoles(
  lines: string[],
): string[] {
  const patterns = [
    "Software Engineer",
    "Full Stack Developer",
    "Frontend Developer",
    "Backend Developer",
    "Product Manager",
    "Project Manager",
    "Data Analyst",
    "Data Scientist",
    "DevOps Engineer",
    "Consultant",
    "Designer",
    "Sales Manager",
    "Marketing Manager",
  ];

  const source =
    lines.join("\n");

  return detectTerms(
    source,
    patterns,
  ).slice(0, 8);
}

function detectIndustries(
  text: string,
): string[] {
  return detectTerms(
    text,
    [
      "SaaS",
      "FinTech",
      "HealthTech",
      "EdTech",
      "E-commerce",
      "Banque",
      "Assurance",
      "Télécom",
      "Industrie",
      "Automobile",
      "Énergie",
      "Conseil",
      "Retail",
      "Logistique",
      "Cybersécurité",
      "Intelligence artificielle",
    ],
  ).slice(0, 10);
}

function detectCareerPatterns(
  text: string,
): string[] {
  const patterns: string[] = [];

  const normalized =
    normalizeText(text);

  if (
    normalized.includes(
      "management",
    ) ||
    normalized.includes(
      "manager",
    )
  ) {
    patterns.push(
      "Expérience de management",
    );
  }

  if (
    normalized.includes(
      "international",
    )
  ) {
    patterns.push(
      "Exposition internationale",
    );
  }

  if (
    normalized.includes(
      "freelance",
    ) ||
    normalized.includes(
      "independant",
    )
  ) {
    patterns.push(
      "Expérience indépendante",
    );
  }

  if (
    normalized.includes(
      "startup",
    )
  ) {
    patterns.push(
      "Environnement startup",
    );
  }

  return patterns;
}

function detectRedFlags(
  text: string,
  lines: string[],
): string[] {
  const redFlags: string[] = [];

  if (
    text.trim().length < 500
  ) {
    redFlags.push(
      "CV très peu détaillé",
    );
  }

  if (
    lines.length < 8
  ) {
    redFlags.push(
      "Structure du CV difficile à identifier",
    );
  }

  if (
    !/@/.test(text)
  ) {
    redFlags.push(
      "Adresse email non détectée",
    );
  }

  return redFlags;
}

function buildStrengths({
  technical,
  soft,
  languages,
  totalExperience,
}: {
  technical: string[];
  soft: string[];
  languages: string[];
  totalExperience: number;
}): string[] {
  const strengths: string[] = [];

  if (
    totalExperience >= 5
  ) {
    strengths.push(
      "Expérience professionnelle significative",
    );
  }

  if (
    technical.length >= 5
  ) {
    strengths.push(
      "Socle de compétences techniques diversifié",
    );
  }

  if (
    soft.length >= 3
  ) {
    strengths.push(
      "Compétences comportementales identifiables",
    );
  }

  if (
    languages.length >= 2
  ) {
    strengths.push(
      "Profil multilingue",
    );
  }

  return strengths.slice(
    0,
    8,
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

function clampNumber(
  value: number,
  min: number,
  max: number,
): number {
  if (
    !Number.isFinite(value)
  ) {
    return min;
  }

  return Math.min(
    max,
    Math.max(
      min,
      value,
    ),
  );
}
// ============================================================
// HANDLER
// ============================================================

export const POST =
  csrfProtect(
    rateLimit(
      RouteType.UPLOAD,

      async (
        request: NextRequest,
      ) => {
        const supabase =
          await createClient();

        const {
          data: {
            user,
          },
          error:
            authError,
        } =
          await supabase.auth.getUser();

        if (
          authError ||
          !user
        ) {
          return NextResponse.json(
            {
              error:
                "Non authentifié",
            },
            {
              status: 401,
            },
          );
        }

        let body: {
          extractedText: string;
          fileName?: string;
        };

        try {
          body =
            await request.json();
        } catch {
          return NextResponse.json(
            {
              error:
                "Corps de requête invalide — JSON attendu",
            },
            {
              status: 400,
            },
          );
        }

        const text =
          body?.extractedText?.trim();

        if (
          !text ||
          text.length < 50
        ) {
          return NextResponse.json(
            {
              error:
                "Texte CV absent ou trop court (minimum 50 caractères)",
            },
            {
              status: 400,
            },
          );
        }

        const enableATSBilling =
          process.env
            .ENABLE_ATS_BILLING ===
          "true";

        const atsAnalyzeCost =
          10;

        const idempotencyKey =
          request.headers.get(
            "Idempotency-Key",
          );

        if (
          enableATSBilling &&
          !idempotencyKey
        ) {
          return NextResponse.json(
            {
              error:
                "Idempotency-Key header is required for billing operations",
            },
            {
              status: 400,
            },
          );
        }

        const idempotencyService =
          new IdempotencyService();

        const effectiveIdempotencyKey =
          idempotencyKey ||
          `cv-analyze-${user.id}-${Date.now()}`;

        try {
          const finalResult =
            await idempotencyService.execute(
              effectiveIdempotencyKey,

              user.id,

              "cv_analyze",

              {
                fileName:
                  body.fileName,
              },

              async () => {
                let txId:
                  | string
                  | undefined;

                if (
                  enableATSBilling
                ) {
                  const reserveResult =
                    await BillingService.reserveCredits(
                      {
                        userId:
                          user.id,

                        amount:
                          atsAnalyzeCost,

                        action:
                          "cv_analyze" as any,

                        operationId:
                          effectiveIdempotencyKey,
                      },
                    );

                  if (
                    !reserveResult.success
                  ) {
                    throw new Error(
                      `BILLING_ERROR:${reserveResult.error}`,
                    );
                  }

                  txId =
                    reserveResult.txId;
                }

                let structured:
                  CvAnalysis;

                let dbRecordId =
                  "";

                try {
                  structured =
                    await analyzeCV(
                      text,
                    );
                } catch (
                  error
                ) {
                  if (
                    txId
                  ) {
                    await BillingService.rollbackCredits(
                      txId,

                      error instanceof
                        Error
                        ? error.message
                        : "CV analysis failed",
                    );
                  }

                  logger.error(
                    {
                      event:
                        "CV analyze - analysis error",

                      userId:
                        user.id,

                      message:
                        error instanceof
                        Error
                          ? error.message
                          : "Unknown error",
                    },
                    "CV analysis failed",
                  );

                  throw new Error(
                    "Erreur lors de l'analyse du CV",
                  );
                }

                try {
                  await prisma.$transaction(
                    async (
                      tx,
                    ) => {
                      const cvRecord =
                        await tx.cVAnalysis.create(
                          {
                            data: {
                              userId:
                                user.id,

                              fileName:
                                body.fileName ??
                                "cv",

                              originalText:
                                text,

                              optimizedText:
                                text,

                              cvData:
                                structured,
                            },
                          },
                        );

                      dbRecordId =
                        cvRecord.id;

                      const existingProfile =
                        await tx.careerProfile.findUnique(
                          {
                            where: {
                              userId:
                                user.id,
                            },
                          },
                        );

                      let mergedDNA =
                        structured.careerDNA;

                      if (
                        existingProfile &&
                        existingProfile.careerDNA
                      ) {
                        const oldDNA =
                          existingProfile.careerDNA as any;

                        const mergeArrays =
                          (
                            oldArray:
                              string[] =
                                [],

                            newArray:
                              string[] =
                                [],
                          ) => {
                            const unique =
                              Array.from(
                                new Set([
                                  ...newArray,
                                  ...oldArray,
                                ]),
                              );

                            return unique.slice(
                              0,
                              15,
                            );
                          };

                        mergedDNA =
                          {
                            seniority:
                              structured
                                .careerDNA
                                .seniority,

                            strengths:
                              mergeArrays(
                                oldDNA.strengths,
                                structured
                                  .careerDNA
                                  .strengths,
                              ),

                            patterns:
                              mergeArrays(
                                oldDNA.patterns,
                                structured
                                  .careerDNA
                                  .patterns,
                              ),

                            targetRoles:
                              mergeArrays(
                                oldDNA.targetRoles,
                                structured
                                  .careerDNA
                                  .targetRoles,
                              ),

                            industries:
                              mergeArrays(
                                oldDNA.industries,
                                structured
                                  .careerDNA
                                  .industries,
                              ),

                            redFlags:
                              mergeArrays(
                                oldDNA.redFlags,
                                structured
                                  .careerDNA
                                  .redFlags,
                              ),
                          };
                      }

                      await tx.careerProfile.upsert(
                        {
                          where: {
                            userId:
                              user.id,
                          },

                          create: {
                            userId:
                              user.id,

                            careerDNA:
                              mergedDNA,
                          },

                          update: {
                            careerDNA:
                              mergedDNA,
                          },
                        },
                      );
                    },
                  );
                } catch (
                  error
                ) {
                  if (
                    txId
                  ) {
                    await BillingService.rollbackCredits(
                      txId,

                      error instanceof
                        Error
                        ? error.message
                        : "Database error",
                    );
                  }

                  throw new Error(
                    "Erreur lors de la sauvegarde",
                  );
                }

                let hiiosContext:
                  any = null;

                try {
                  const hiiOSContext =
                    CVHIIOSBridge.initializeFromCV(
                      structured,
                      user.id,
                    );

                  hiiosContext =
                    {
                      sessionId:
                        hiiOSContext.sessionId,

                      seniority:
                        structured
                          .careerDNA
                          .seniority,

                      strengths:
                        structured
                          .careerDNA
                          .strengths,

                      targetRoles:
                        structured
                          .careerDNA
                          .targetRoles,

                      skills: [
                        ...structured
                          .skills
                          .technical,

                        ...structured
                          .skills
                          .soft,
                      ],

                      totalExperience:
                        structured.totalExperience ??
                        0,

                      hypothesesCount:
                        hiiOSContext.hypothesisEngine
                          .getAll()
                          .length,

                      evidenceCount:
                        hiiOSContext.evidenceEngine
                          .getAll()
                          .length,

                      skillCoverage:
                        hiiOSContext.skillGraph.getCoveragePercent(),
                    };
                } catch (
                  error
                ) {
                  logger.error(
                    {
                      event:
                        "CV analyze - HIIOS initialization error",

                      userId:
                        user.id,

                      message:
                        error instanceof
                          Error
                          ? error.message
                          : "Unknown error",
                    },
                    "HIIOS initialization failed",
                  );

                  hiiosContext =
                    {
                      sessionId:
                        null,

                      seniority:
                        structured
                          .careerDNA
                          .seniority,

                      strengths:
                        structured
                          .careerDNA
                          .strengths,

                      targetRoles:
                        structured
                          .careerDNA
                          .targetRoles,

                      skills: [
                        ...structured
                          .skills
                          .technical,

                        ...structured
                          .skills
                          .soft,
                      ],

                      totalExperience:
                        structured.totalExperience ??
                        0,
                    };
                }

                if (
                  txId
                ) {
                  await BillingService.commitCredits(
                    txId,
                    0,
                  );
                }

                return {
                  resultRef:
                    dbRecordId,

                  data: {
                    structured,
                    hiiosContext,
                  },
                };
              },

              async (
                resultRef:
                  string,
              ) => {
                const analysis =
                  await prisma.cVAnalysis.findUnique(
                    {
                      where: {
                        id:
                          resultRef,
                      },
                    },
                  );

                if (
                  !analysis
                ) {
                  throw new Error(
                    "Cached CV analysis not found",
                  );
                }

                return {
                  structured:
                    analysis.cvData as unknown as CvAnalysis,

                  hiiosContext: {
                    sessionId:
                      null,

                    cached:
                      true,
                  },
                };
              },
            );

          return NextResponse.json(
            {
              success:
                true,

              data:
                finalResult.structured,

              hiiosContext:
                finalResult.hiiosContext,
            },
          );
        } catch (
          error
        ) {
          const message =
            error instanceof Error
              ? error.message
              : "Unknown error";

          if (
            message.startsWith(
              "BILLING_ERROR:",
            )
          ) {
            return NextResponse.json(
              {
                error:
                  "Crédits insuffisants ou erreur de facturation",
              },
              {
                status: 402,
              },
            );
          }

          logger.error(
            {
              event:
                "CV analyze - fatal error",

              userId:
                user.id,

              message,
            },
            "CV analysis fatal error",
          );

          return NextResponse.json(
            {
              error:
                "Erreur lors de l'analyse",
            },
            {
              status: 500,
            },
          );
        }
      },

      {
        scopes: [
          RateLimitScope.USER,
          RateLimitScope.IP,
        ],
      },
    ),
  );