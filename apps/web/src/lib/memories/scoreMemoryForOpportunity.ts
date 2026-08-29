type MemoryInput = {
  category: string
  key: string
  value: string
  confidence?: number | null
  isFavorite?: boolean
}

type OpportunityInput = {
  title: string
  company?: string | null
  description: string
  strengths?: unknown
  gaps?: unknown
  analysis?: unknown
}

export type MemoryOpportunityScore = {
  relevance: number
  reason: string
  matchedTerms: string[]
}

const STOP_WORDS = new Set([
  "avec",
  "dans",
  "pour",
  "plus",
  "une",
  "des",
  "les",
  "sur",
  "aux",
  "par",
  "que",
  "qui",
  "ses",
  "son",
  "leur",
  "leurs",
  "the",
  "and",
  "for",
  "with",
  "from",
  "this",
  "that",
  "your",
  "you",
  "our",
  "are",
  "job",
  "role",
  "poste",
  "mission",
  "missions",
  "profil",
])

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9+#.]+/g, " ")
    .trim()
}

function tokenize(value: string) {
  return Array.from(
    new Set(
      normalize(value)
        .split(/\s+/)
        .filter(
          (token) =>
            token.length >= 3 &&
            !STOP_WORDS.has(token),
        ),
    ),
  )
}

function flattenUnknown(
  value: unknown,
  depth = 0,
): string[] {
  if (
    value === null ||
    value === undefined ||
    depth > 5
  ) {
    return []
  }

  if (typeof value === "string") {
    return [value]
  }

  if (
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return [String(value)]
  }

  if (Array.isArray(value)) {
    return value.flatMap((item) =>
      flattenUnknown(item, depth + 1),
    )
  }

  if (typeof value === "object") {
    return Object.values(
      value as Record<string, unknown>,
    ).flatMap((item) =>
      flattenUnknown(item, depth + 1),
    )
  }

  return []
}

function clamp(value: number) {
  return Math.max(
    0,
    Math.min(100, Math.round(value)),
  )
}

export function scoreMemoryForOpportunity(
  memory: MemoryInput,
  opportunity: OpportunityInput,
): MemoryOpportunityScore {
  const opportunityText = [
    opportunity.title,
    opportunity.company ?? "",
    opportunity.description,
    ...flattenUnknown(opportunity.strengths),
    ...flattenUnknown(opportunity.gaps),
    ...flattenUnknown(opportunity.analysis),
  ].join(" ")

  const memoryText = [
    memory.category,
    memory.key,
    memory.value,
  ].join(" ")

  const opportunityTokens =
    new Set(tokenize(opportunityText))

  const memoryTokens =
    tokenize(memoryText)

  const matchedTerms =
    memoryTokens
      .filter((token) =>
        opportunityTokens.has(token),
      )
      .slice(0, 8)

  const lexicalRatio =
    memoryTokens.length > 0
      ? matchedTerms.length /
        Math.min(memoryTokens.length, 12)
      : 0

  const lexicalScore =
    Math.min(70, lexicalRatio * 100)

  const confidenceScore =
    Math.max(
      0,
      Math.min(
        15,
        ((memory.confidence ?? 100) / 100) *
          15,
      ),
    )

  const favoriteBonus =
    memory.isFavorite ? 8 : 0

  const exactTitleBonus =
    normalize(memory.key).length >= 3 &&
    normalize(opportunityText).includes(
      normalize(memory.key),
    )
      ? 7
      : 0

  const relevance = clamp(
    lexicalScore +
      confidenceScore +
      favoriteBonus +
      exactTitleBonus,
  )

  let reason: string

  if (matchedTerms.length >= 3) {
    reason =
      `Très pertinent pour cette offre : correspondances sur ${matchedTerms
        .slice(0, 4)
        .join(", ")}.`
  } else if (matchedTerms.length > 0) {
    reason =
      `Pertinence contextuelle détectée sur ${matchedTerms.join(
        ", ",
      )}.`
  } else if (memory.isFavorite) {
    reason =
      "Fait important de ton parcours, mais avec peu de correspondance lexicale directe avec cette offre."
  } else {
    reason =
      "Peu de correspondance directe avec les besoins exprimés dans cette offre."
  }

  return {
    relevance,
    reason,
    matchedTerms,
  }
}