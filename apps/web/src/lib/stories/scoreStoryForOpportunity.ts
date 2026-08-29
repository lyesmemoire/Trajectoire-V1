export type StoryRelevanceInput = {
  title: string
  situation: string
  task: string
  action: string
  result: string
  skills: string[]
  tags: string[]
}

export type OpportunityRelevanceInput = {
  title: string
  company?: string | null
  description: string
  strengths?: unknown
  gaps?: unknown
  analysis?: unknown
}

export type StoryRelevanceResult = {
  score: number
  reason: string
  matchedTerms: string[]
}

const STOP_WORDS = new Set([
  "avec",
  "dans",
  "pour",
  "des",
  "les",
  "une",
  "sur",
  "par",
  "aux",
  "est",
  "sont",
  "vous",
  "nous",
  "vos",
  "notre",
  "votre",
  "the",
  "and",
  "for",
  "with",
  "from",
  "that",
  "this",
  "will",
  "have",
  "has",
  "our",
  "your",
  "job",
  "role",
  "poste",
  "mission",
  "missions",
])

function normalize(value: string) {
  return value
    .toLocaleLowerCase("fr")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9+#.\s-]/g, " ")
}

function tokenize(value: string) {
  return Array.from(
    new Set(
      normalize(value)
        .split(/\s+/)
        .map((token) => token.trim())
        .filter(
          (token) =>
            token.length >= 3 &&
            !STOP_WORDS.has(token),
        ),
    ),
  )
}

function flattenUnknown(value: unknown): string {
  if (value === null || value === undefined) {
    return ""
  }

  if (typeof value === "string") {
    return value
  }

  if (
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return String(value)
  }

  if (Array.isArray(value)) {
    return value
      .map((item) => flattenUnknown(item))
      .join(" ")
  }

  if (typeof value === "object") {
    return Object.values(
      value as Record<string, unknown>,
    )
      .map((item) => flattenUnknown(item))
      .join(" ")
  }

  return ""
}

export function scoreStoryForOpportunity(
  story: StoryRelevanceInput,
  opportunity: OpportunityRelevanceInput,
): StoryRelevanceResult {
  const opportunityText = [
    opportunity.title,
    opportunity.company ?? "",
    opportunity.description,
    flattenUnknown(opportunity.strengths),
    flattenUnknown(opportunity.gaps),
    flattenUnknown(opportunity.analysis),
  ].join(" ")

  const storyText = [
    story.title,
    story.situation,
    story.task,
    story.action,
    story.result,
    ...story.skills,
    ...story.tags,
  ].join(" ")

  const opportunityTokens =
    tokenize(opportunityText)

  const storyTokens =
    new Set(tokenize(storyText))

  const matchedTerms =
    opportunityTokens.filter(
      (token) => storyTokens.has(token),
    )

  const opportunitySet =
    new Set(opportunityTokens)

  const skillMatches =
    story.skills.filter((skill) => {
      const tokens = tokenize(skill)

      return tokens.some((token) =>
        opportunitySet.has(token),
      )
    })

  const tagMatches =
    story.tags.filter((tag) => {
      const tokens = tokenize(tag)

      return tokens.some((token) =>
        opportunitySet.has(token),
      )
    })

  const lexicalCoverage =
    opportunityTokens.length > 0
      ? matchedTerms.length /
        opportunityTokens.length
      : 0

  const skillCoverage =
    story.skills.length > 0
      ? skillMatches.length /
        story.skills.length
      : 0

  const tagCoverage =
    story.tags.length > 0
      ? tagMatches.length /
        story.tags.length
      : 0

  const resultTokens =
    tokenize(story.result)

  const quantifiedResult =
    /\d/.test(story.result) ||
    resultTokens.some((token) =>
      [
        "croissance",
        "reduction",
        "augmentation",
        "gain",
        "economies",
        "impact",
        "revenu",
        "conversion",
        "performance",
      ].includes(token),
    )

  const rawScore =
    lexicalCoverage * 55 +
    skillCoverage * 25 +
    tagCoverage * 10 +
    (quantifiedResult ? 10 : 0)

  const score = Math.max(
    0,
    Math.min(100, Math.round(rawScore)),
  )

  const topMatches =
    matchedTerms.slice(0, 6)

  let reason =
    "Cette histoire apporte une preuve complémentaire pour cette opportunité."

  if (score >= 75) {
    reason =
      "Très forte correspondance avec les compétences et enjeux de l’offre."
  } else if (score >= 50) {
    reason =
      "Bonne correspondance avec plusieurs attentes importantes de l’offre."
  } else if (score >= 25) {
    reason =
      "Correspondance partielle ; utile comme preuve secondaire."
  }

  if (topMatches.length > 0) {
    reason += ` Points communs : ${topMatches.join(", ")}.`
  }

  return {
    score,
    reason,
    matchedTerms: topMatches,
  }
}