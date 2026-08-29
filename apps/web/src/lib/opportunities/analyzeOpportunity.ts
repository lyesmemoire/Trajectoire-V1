export type OpportunityRecommendation =
  | "APPLY"
  | "CAUTION"
  | "SKIP"

export type OpportunityAnalysisResult = {
  matchScore: number
  skillsScore: number
  experienceScore: number
  seniorityScore: number
  relevanceScore: number
  recommendation: OpportunityRecommendation
  recommendationLabel: string
  strengths: string[]
  gaps: string[]
  matchedKeywords: string[]
  missingKeywords: string[]
  summary: string
  potentialScore: number
}

const STOP_WORDS = new Set([
  "avec",
  "avoir",
  "dans",
  "des",
  "elle",
  "elles",
  "entre",
  "etre",
  "faire",
  "les",
  "leur",
  "leurs",
  "mais",
  "nous",
  "notre",
  "pour",
  "plus",
  "que",
  "qui",
  "sans",
  "ses",
  "son",
  "sont",
  "sur",
  "une",
  "vous",
  "votre",
  "aux",
  "ces",
  "cette",
  "cet",
  "comme",
  "tout",
  "tous",
  "toute",
  "toutes",
  "par",
  "pas",
  "est",
  "and",
  "the",
  "with",
  "from",
  "your",
  "you",
  "our",
  "for",
  "this",
  "that",
  "will",
  "are",
  "have",
  "has",
  "into",
  "about",
  "role",
  "poste",
  "mission",
  "missions",
  "profil",
  "candidate",
  "candidat",
  "company",
  "entreprise",
])

const TECHNICAL_SKILLS = [
  "javascript",
  "typescript",
  "react",
  "next",
  "nextjs",
  "node",
  "nodejs",
  "nestjs",
  "python",
  "java",
  "sql",
  "postgresql",
  "postgres",
  "mysql",
  "mongodb",
  "redis",
  "docker",
  "kubernetes",
  "aws",
  "azure",
  "gcp",
  "terraform",
  "git",
  "github",
  "gitlab",
  "figma",
  "jira",
  "notion",
  "salesforce",
  "hubspot",
  "sap",
  "tableau",
  "powerbi",
  "excel",
  "stripe",
  "supabase",
  "prisma",
  "graphql",
  "rest",
  "api",
  "saas",
  "b2b",
  "b2c",
  "crm",
  "erp",
  "seo",
  "sem",
  "analytics",
  "data",
  "machine",
  "learning",
  "ai",
  "ia",
  "llm",
  "product",
  "scrum",
  "agile",
]

const SENIORITY_LEVELS = [
  {
    score: 5,
    terms: [
      "chief",
      "c-level",
      "vp",
      "vice president",
      "vice-president",
      "head of",
      "directeur",
      "directrice",
      "director",
    ],
  },
  {
    score: 4,
    terms: [
      "lead",
      "principal",
      "staff",
      "manager",
      "responsable",
      "senior manager",
    ],
  },
  {
    score: 3,
    terms: [
      "senior",
      "confirme",
      "confirmee",
      "experienced",
      "experimente",
      "experimentee",
    ],
  },
  {
    score: 2,
    terms: [
      "intermediaire",
      "mid level",
      "mid-level",
      "associate",
    ],
  },
  {
    score: 1,
    terms: [
      "junior",
      "debutant",
      "debutante",
      "graduate",
      "entry level",
      "entry-level",
      "stage",
      "stagiaire",
      "intern",
    ],
  },
]

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9+#.\-\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

function clampScore(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)))
}

function unique<T>(values: T[]) {
  return Array.from(new Set(values))
}

function tokenize(value: string) {
  return unique(
    normalizeText(value)
      .split(/\s+/)
      .map((token) => token.replace(/^[.\-]+|[.\-]+$/g, ""))
      .filter(
        (token) =>
          token.length >= 3 &&
          token.length <= 40 &&
          !STOP_WORDS.has(token) &&
          !/^\d+$/.test(token),
      ),
  )
}

function getSkillTerms(value: string) {
  const normalized = ` ${normalizeText(value)} `

  return TECHNICAL_SKILLS.filter((skill) => {
    const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    return new RegExp(`(?:^|[^a-z0-9])${escaped}(?:$|[^a-z0-9])`).test(
      normalized,
    )
  })
}

function inferSeniority(value: string) {
  const normalized = normalizeText(value)

  for (const level of SENIORITY_LEVELS) {
    if (level.terms.some((term) => normalized.includes(term))) {
      return level.score
    }
  }

  return 2
}

function seniorityCompatibility(jobLevel: number, cvLevel: number) {
  const distance = Math.abs(jobLevel - cvLevel)

  if (distance === 0) return 100
  if (distance === 1) return 82
  if (distance === 2) return 58
  if (distance === 3) return 35

  return 20
}

function calculateKeywordCoverage(
  cvText: string,
  jobText: string,
) {
  const cvTokens = new Set(tokenize(cvText))

  const jobTokens = tokenize(jobText)
    .filter((token) => token.length >= 4)
    .slice(0, 300)

  const matched = jobTokens.filter((token) => cvTokens.has(token))
  const missing = jobTokens.filter((token) => !cvTokens.has(token))

  const denominator = Math.max(jobTokens.length, 1)

  return {
    matchedKeywords: matched.slice(0, 20),
    missingKeywords: missing.slice(0, 20),
    score: clampScore((matched.length / denominator) * 100),
  }
}

function calculateSkillsScore(
  cvText: string,
  jobText: string,
) {
  const required = getSkillTerms(jobText)
  const present = new Set(getSkillTerms(cvText))

  if (required.length === 0) {
    return {
      score: 70,
      matched: [] as string[],
      missing: [] as string[],
    }
  }

  const matched = required.filter((skill) => present.has(skill))
  const missing = required.filter((skill) => !present.has(skill))

  return {
    score: clampScore((matched.length / required.length) * 100),
    matched,
    missing,
  }
}

function calculateExperienceScore(
  cvText: string,
  jobText: string,
) {
  const experienceTerms = [
    "management",
    "manager",
    "leadership",
    "strategie",
    "strategy",
    "roadmap",
    "budget",
    "client",
    "customer",
    "produit",
    "product",
    "projet",
    "project",
    "equipe",
    "team",
    "croissance",
    "growth",
    "vente",
    "sales",
    "marketing",
    "operations",
    "finance",
    "recrutement",
    "hiring",
    "international",
    "stakeholder",
    "delivery",
    "discovery",
    "execution",
  ]

  const normalizedCv = normalizeText(cvText)
  const normalizedJob = normalizeText(jobText)

  const expected = experienceTerms.filter((term) =>
    normalizedJob.includes(term),
  )

  if (expected.length === 0) {
    return 70
  }

  const demonstrated = expected.filter((term) =>
    normalizedCv.includes(term),
  )

  return clampScore(
    (demonstrated.length / expected.length) * 100,
  )
}

export function analyzeOpportunity(input: {
  cvText: string
  jobTitle: string
  jobDescription: string
}): OpportunityAnalysisResult {
  const { cvText, jobTitle, jobDescription } = input

  const completeJobText = `${jobTitle}\n${jobDescription}`

  const keywordCoverage = calculateKeywordCoverage(
    cvText,
    completeJobText,
  )

  const skills = calculateSkillsScore(
    cvText,
    completeJobText,
  )

  const experienceScore = calculateExperienceScore(
    cvText,
    completeJobText,
  )

  const jobSeniority = inferSeniority(completeJobText)
  const cvSeniority = inferSeniority(cvText)

  const seniorityScore = seniorityCompatibility(
    jobSeniority,
    cvSeniority,
  )

  const relevanceScore = clampScore(
    keywordCoverage.score * 0.7 +
      skills.score * 0.3,
  )

  const matchScore = clampScore(
    skills.score * 0.35 +
      experienceScore * 0.25 +
      seniorityScore * 0.15 +
      relevanceScore * 0.25,
  )

  const strengths: string[] = []
  const gaps: string[] = []

  if (skills.matched.length > 0) {
    strengths.push(
      `Compétences alignées : ${skills.matched
        .slice(0, 6)
        .join(", ")}`,
    )
  }

  if (experienceScore >= 75) {
    strengths.push(
      "Ton expérience contient plusieurs signaux directement pertinents pour les missions du poste.",
    )
  }

  if (seniorityScore >= 80) {
    strengths.push(
      "Le niveau de séniorité détecté semble cohérent avec le poste visé.",
    )
  }

  if (keywordCoverage.matchedKeywords.length >= 5) {
    strengths.push(
      "Ton CV reprend déjà une partie importante du vocabulaire utilisé dans cette offre.",
    )
  }

  if (skills.missing.length > 0) {
    gaps.push(
      `Compétences peu ou pas démontrées dans le CV : ${skills.missing
        .slice(0, 6)
        .join(", ")}`,
    )
  }

  if (experienceScore < 60) {
    gaps.push(
      "Certaines responsabilités centrales de l'offre sont encore peu visibles dans ton CV.",
    )
  }

  if (seniorityScore < 60) {
    gaps.push(
      "Le niveau de séniorité attendu et celui démontré dans le CV semblent éloignés.",
    )
  }

  if (
    gaps.length === 0 &&
    keywordCoverage.missingKeywords.length > 0
  ) {
    gaps.push(
      "Quelques attentes de l'offre ne sont pas encore explicitement démontrées dans le CV.",
    )
  }

  if (strengths.length === 0) {
    strengths.push(
      "Des éléments compatibles existent, mais ils doivent être davantage explicités dans le CV.",
    )
  }

  let recommendation: OpportunityRecommendation
  let recommendationLabel: string
  let summary: string

  if (matchScore >= 80) {
    recommendation = "APPLY"
    recommendationLabel = "Candidature recommandée"
    summary =
      "Le niveau d'alignement est élevé. Cette opportunité mérite une candidature ciblée."
  } else if (matchScore >= 60) {
    recommendation = "CAUTION"
    recommendationLabel = "À considérer avec prudence"
    summary =
      "Le potentiel est réel, mais certains écarts doivent être traités avant de candidater."
  } else {
    recommendation = "SKIP"
    recommendationLabel = "Priorité faible"
    summary =
      "L'écart actuel est important. Ton temps sera probablement mieux investi sur une opportunité plus alignée."
  }

  const improvableGap =
    Math.max(0, 100 - relevanceScore) * 0.35 +
    Math.max(0, 100 - skills.score) * 0.15

  const potentialScore = clampScore(
    matchScore + Math.min(improvableGap, 15),
  )

  return {
    matchScore,
    skillsScore: skills.score,
    experienceScore,
    seniorityScore,
    relevanceScore,
    recommendation,
    recommendationLabel,
    strengths: strengths.slice(0, 4),
    gaps: gaps.slice(0, 4),
    matchedKeywords: unique([
      ...skills.matched,
      ...keywordCoverage.matchedKeywords,
    ]).slice(0, 20),
    missingKeywords: unique([
      ...skills.missing,
      ...keywordCoverage.missingKeywords,
    ]).slice(0, 20),
    summary,
    potentialScore,
  }
}