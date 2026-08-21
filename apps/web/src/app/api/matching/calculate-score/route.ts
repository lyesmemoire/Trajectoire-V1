import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const MAX_TEXT_LENGTH = 50_000;

const STOP_WORDS = new Set([
  // Français
  "afin",
  "ainsi",
  "avec",
  "avoir",
  "cette",
  "comme",
  "dans",
  "des",
  "elle",
  "elles",
  "entre",
  "être",
  "faire",
  "leur",
  "leurs",
  "mais",
  "nous",
  "notre",
  "pour",
  "plus",
  "poste",
  "sont",
  "sur",
  "une",
  "vous",
  "votre",

  // Anglais
  "about",
  "also",
  "and",
  "are",
  "but",
  "candidate",
  "for",
  "from",
  "have",
  "into",
  "job",
  "looking",
  "our",
  "that",
  "the",
  "their",
  "they",
  "this",
  "with",
  "you",
  "your",
]);

interface MatchingRequest {
  cvText?: unknown;
  jobDescription?: unknown;
}

interface MatchingResult {
  score: number;
  matchedSkills: string[];
  missingSkills: string[];
  recommendations: string[];
}

function normalizeToken(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/^[^a-z0-9+#.]+|[^a-z0-9+#.]+$/g, "");
}

function extractKeywords(text: string): string[] {
  const normalizedText = text
    .replace(/[–—]/g, "-")
    .replace(/[()/,;:!?[\]{}"'“”‘’]/g, " ");

  const tokens = normalizedText
    .split(/\s+/)
    .map(normalizeToken)
    .filter(Boolean)
    .filter((token) => token.length >= 3)
    .filter((token) => !STOP_WORDS.has(token));

  return Array.from(new Set(tokens));
}

function prettifyKeyword(keyword: string): string {
  const labels: Record<string, string> = {
    "next.js": "Next.js",
    nextjs: "Next.js",
    react: "React",
    typescript: "TypeScript",
    javascript: "JavaScript",
    nodejs: "Node.js",
    "node.js": "Node.js",
    postgresql: "PostgreSQL",
    postgres: "PostgreSQL",
    prisma: "Prisma",
    supabase: "Supabase",
    github: "GitHub",
    gitlab: "GitLab",
    docker: "Docker",
    kubernetes: "Kubernetes",
    aws: "AWS",
    azure: "Azure",
    gcp: "GCP",
    sql: "SQL",
    html: "HTML",
    css: "CSS",
    api: "API",
    rest: "REST",
    graphql: "GraphQL",
  };

  return labels[keyword] ?? keyword;
}

function calculateMatching(
  cvText: string,
  jobDescription: string,
): MatchingResult {
  const cvKeywords = extractKeywords(cvText);
  const jobKeywords = extractKeywords(jobDescription);

  if (jobKeywords.length === 0) {
    return {
      score: 0,
      matchedSkills: [],
      missingSkills: [],
      recommendations: [
        "Ajoutez une description de poste plus détaillée afin de calculer un score pertinent.",
      ],
    };
  }

  const cvSet = new Set(cvKeywords);

  const matched = jobKeywords.filter((keyword) => cvSet.has(keyword));
  const missing = jobKeywords.filter((keyword) => !cvSet.has(keyword));

  /*
   * MVP deterministic score:
   * percentage of job keywords found in the CV.
   *
   * The job description is the reference set because matching answers:
   * "How much of the job requirement is represented in this CV?"
   */
  const rawScore = (matched.length / jobKeywords.length) * 100;
  const score = Math.max(0, Math.min(100, Math.round(rawScore)));

  const matchedSkills = matched
    .slice(0, 20)
    .map(prettifyKeyword);

  const missingSkills = missing
    .slice(0, 20)
    .map(prettifyKeyword);

  const recommendations: string[] = [];

  if (score >= 80) {
    recommendations.push(
      "Le CV présente une forte correspondance avec les éléments identifiés dans l’offre.",
    );
  } else if (score >= 60) {
    recommendations.push(
      "La correspondance est solide, mais certains éléments importants de l’offre ne sont pas explicitement présents dans le CV.",
    );
  } else if (score >= 40) {
    recommendations.push(
      "La correspondance est partielle. Renforcez le CV avec les compétences réellement maîtrisées qui sont demandées dans l’offre.",
    );
  } else {
    recommendations.push(
      "La correspondance textuelle est faible. Vérifiez que le CV cible réellement ce poste avant de l’adapter.",
    );
  }

  if (missingSkills.length > 0) {
    recommendations.push(
      `Vérifiez notamment les éléments manquants suivants : ${missingSkills
        .slice(0, 5)
        .join(", ")}.`,
    );
  }

  recommendations.push(
    "N’ajoutez au CV que des compétences et expériences que vous pouvez réellement justifier.",
  );

  return {
    score,
    matchedSkills,
    missingSkills,
    recommendations,
  };
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      );
    }

    let body: MatchingRequest;

    try {
      body = (await request.json()) as MatchingRequest;
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON body" },
        { status: 400 },
      );
    }

    const cvText =
      typeof body.cvText === "string"
        ? body.cvText.trim()
        : "";

    const jobDescription =
      typeof body.jobDescription === "string"
        ? body.jobDescription.trim()
        : "";

    if (!cvText || !jobDescription) {
      return NextResponse.json(
        {
          error: "cvText and jobDescription are required",
        },
        { status: 400 },
      );
    }

    if (
      cvText.length > MAX_TEXT_LENGTH ||
      jobDescription.length > MAX_TEXT_LENGTH
    ) {
      return NextResponse.json(
        {
          error: `Each text field must contain at most ${MAX_TEXT_LENGTH} characters`,
        },
        { status: 413 },
      );
    }

    const result = calculateMatching(
      cvText,
      jobDescription,
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error(
      "[Matching Calculate Score] Unexpected error:",
      error,
    );

    return NextResponse.json(
      {
        error: "Failed to calculate matching score",
      },
      { status: 500 },
    );
  }
}