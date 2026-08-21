import {
  generateText,
} from "ai";

import {
  getReasoningAIModel,
  isRemoteAIAvailable,
} from "@/lib/ai/ai-models";

import {
  CVData,
} from "./types";

const EXTRACTION_PROMPT = `
Tu es un expert en analyse de CV.

Analyse le texte fourni et extrais les informations dans un JSON STRICT.

IMPORTANT :
- conserve la langue originale du CV ;
- n'invente aucune information ;
- si une information n'existe pas, utilise une chaîne vide, undefined ou un tableau vide selon le champ ;
- retourne uniquement le JSON.

Schéma attendu :
{
  "personalInfo": {
    "name": "string",
    "email": "string",
    "phone": "string",
    "location": "string",
    "linkedin": "string | undefined"
  },
  "summary": "string",
  "experience": [
    {
      "title": "string",
      "company": "string",
      "period": "string",
      "location": "string | null",
      "achievements": ["string"]
    }
  ],
  "education": [
    {
      "degree": "string",
      "school": "string",
      "year": "string",
      "mention": "string | null"
    }
  ],
  "skills": {
    "technical": ["string"],
    "soft": ["string"],
    "languages": ["string"]
  },
  "certifications": [
    {
      "name": "string",
      "issuer": "string",
      "year": "string"
    }
  ]
}
`.trim();

export async function parseCVToStructure(
  cvText: string,
): Promise<CVData> {
  const normalizedInput =
    cvText.trim();

  if (!normalizedInput) {
    return createEmptyCV();
  }

  if (
    !isRemoteAIAvailable()
  ) {
    return parseCVLocally(
      normalizedInput,
    );
  }

  try {
    const {
      text,
    } =
      await generateText({
        model:
          getReasoningAIModel(),

        temperature:
          0.1,

        system:
          EXTRACTION_PROMPT,

        prompt:
          `TEXTE DU CV :\n\n${normalizedInput}`,
      });

    const parsed =
      parseAIResponse(
        text,
      );

    if (!parsed) {
      return parseCVLocally(
        normalizedInput,
      );
    }

    return parsed;
  } catch (error) {
    console.error(
      "[ParseCVToStructure Error]:",
      error,
    );

    return parseCVLocally(
      normalizedInput,
    );
  }
}

function parseAIResponse(
  text: string,
): CVData | null {
  try {
    const cleanText =
      text
        .trim()
        .replace(
          /^```json\s*/i,
          "",
        )
        .replace(
          /^```\s*/i,
          "",
        )
        .replace(
          /```$/,
          "",
        )
        .trim();

    const parsed =
      JSON.parse(
        cleanText,
      ) as Partial<CVData>;

    return normalizeCVData(
      parsed,
    );
  } catch {
    return null;
  }
}

function parseCVLocally(
  cvText: string,
): CVData {
  const lines =
    cvText
      .split(/\r?\n/)
      .map(
        (line) =>
          line
            .replace(
              /\s+/g,
              " ",
            )
            .trim(),
      )
      .filter(Boolean);

  const email =
    cvText.match(
      /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i,
    )?.[0] ?? "";

  const phone =
    cvText.match(
      /(?:\+?\d[\d\s().-]{7,}\d)/,
    )?.[0]
      ?.replace(
        /\s+/g,
        " ",
      )
      .trim() ?? "";

  const linkedin =
    cvText.match(
      /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[^\s,;]+/i,
    )?.[0];

  const name =
    detectCandidateName(
      lines,
      email,
    );

  const technical =
    extractTechnicalSkills(
      cvText,
    );

  const soft =
    extractSoftSkills(
      cvText,
    );

  const languages =
    extractLanguages(
      cvText,
    );

  return {
    personalInfo: {
      name,
      email,
      phone,

      location:
        detectLocation(
          lines,
        ),

      linkedin,
    },

    summary:
      extractSummary(
        lines,
      ),

    experience: [],

    education: [],

    skills: {
      technical,
      soft,
      languages,
    },

    certifications: [],
  };
}

function detectCandidateName(
  lines: string[],
  email: string,
): string {
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
          line.includes(
            email,
          )
        ) {
          return false;
        }

        if (
          /@|https?:\/\/|linkedin|curriculum|cv\b/i.test(
            line,
          )
        ) {
          return false;
        }

        if (
          /\d{3,}/.test(
            line,
          )
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

  return candidate ?? "";
}

function detectLocation(
  lines: string[],
): string {
  const locationPattern =
    /\b(?:Paris|Lyon|Marseille|Toulouse|Bordeaux|Lille|Nantes|Nice|Montpellier|Rennes|Strasbourg|Alger|Algerie|Algérie|Oran|Constantine|Blida|Tipaza|Bruxelles|Belgique|Genève|Geneve|Suisse|Montréal|Montreal|Canada|London|Londres)\b/i;

  return (
    lines.find(
      (line) =>
        locationPattern.test(
          line,
        ),
    ) ?? ""
  );
}

function extractSummary(
  lines: string[],
): string {
  const ignored =
    /^(experience|expérience|formation|education|éducation|competences|compétences|skills|langues|languages|certifications?)$/i;

  const candidates =
    lines.filter(
      (line) =>
        line.length >= 50 &&
        line.length <= 500 &&
        !ignored.test(
          line,
        ),
    );

  return candidates[0] ?? "";
}

function extractTechnicalSkills(
  text: string,
): string[] {
  const normalized =
    normalizeText(
      text,
    );

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
    "html",
    "css",
    "tailwind",
    "sql",
    "postgresql",
    "postgres",
    "mysql",
    "mongodb",
    "redis",
    "elasticsearch",
    "supabase",
    "prisma",
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
    "linux",
    "devops",
    "ci/cd",
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

function extractSoftSkills(
  text: string,
): string[] {
  const normalized =
    normalizeText(
      text,
    );

  const dictionary = [
    "leadership",
    "communication",
    "autonomie",
    "organisation",
    "creativite",
    "créativité",
    "adaptabilite",
    "adaptabilité",
    "collaboration",
    "travail en equipe",
    "travail en équipe",
    "esprit d'equipe",
    "esprit d'équipe",
    "resolution de problemes",
    "résolution de problèmes",
    "gestion de projet",
    "management",
    "negociation",
    "négociation",
  ];

  return Array.from(
    new Set(
      dictionary
        .filter(
          (skill) =>
            normalized.includes(
              normalizeText(
                skill,
              ),
            ),
        )
        .map(
          (skill) =>
            skill.normalize(
              "NFC",
            ),
        ),
    ),
  );
}

function extractLanguages(
  text: string,
): string[] {
  const normalized =
    normalizeText(
      text,
    );

  const dictionary = [
    "francais",
    "français",
    "anglais",
    "english",
    "arabe",
    "arabic",
    "espagnol",
    "spanish",
    "allemand",
    "german",
    "italien",
    "italian",
    "portugais",
    "chinois",
    "mandarin",
  ];

  return Array.from(
    new Set(
      dictionary.filter(
        (language) =>
          normalized.includes(
            normalizeText(
              language,
            ),
          ),
      ),
    ),
  );
}

function normalizeCVData(
  value: Partial<CVData>,
): CVData {
  const personalInfo =
    value.personalInfo as
      | Partial<
          CVData["personalInfo"]
        >
      | undefined;

  const skills =
    value.skills as
      | Partial<
          CVData["skills"]
        >
      | undefined;

  return {
    personalInfo: {
      name:
        safeString(
          personalInfo?.name,
        ),

      email:
        safeString(
          personalInfo?.email,
        ),

      phone:
        safeString(
          personalInfo?.phone,
        ),

      location:
        safeString(
          personalInfo?.location,
        ),

      linkedin:
        safeOptionalString(
          personalInfo?.linkedin,
        ),
    },

    summary:
      safeString(
        value.summary,
      ),

    experience:
      Array.isArray(
        value.experience,
      )
        ? value.experience
        : [],

    education:
      Array.isArray(
        value.education,
      )
        ? value.education
        : [],

    skills: {
      technical:
        safeStringArray(
          skills?.technical,
        ),

      soft:
        safeStringArray(
          skills?.soft,
        ),

      languages:
        safeStringArray(
          skills?.languages,
        ),
    },

    certifications:
      Array.isArray(
        value.certifications,
      )
        ? value.certifications
        : [],
  };
}

function createEmptyCV(): CVData {
  return {
    personalInfo: {
      name: "",
      email: "",
      phone: "",
      location: "",
      linkedin:
        undefined,
    },

    summary: "",

    experience: [],

    education: [],

    skills: {
      technical: [],
      soft: [],
      languages: [],
    },

    certifications: [],
  };
}

function safeString(
  value: unknown,
): string {
  return typeof value ===
    "string"
    ? value.trim()
    : "";
}

function safeOptionalString(
  value: unknown,
): string | undefined {
  if (
    typeof value !==
    "string"
  ) {
    return undefined;
  }

  const cleaned =
    value.trim();

  return cleaned || undefined;
}

function safeStringArray(
  value: unknown,
): string[] {
  if (
    !Array.isArray(
      value,
    )
  ) {
    return [];
  }

  return Array.from(
    new Set(
      value
        .filter(
          (
            item,
          ): item is string =>
            typeof item ===
              "string",
        )
        .map(
          (item) =>
            item.trim(),
        )
        .filter(Boolean),
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