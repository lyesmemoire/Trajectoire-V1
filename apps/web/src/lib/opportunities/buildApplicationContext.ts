export type ApplicationContextStory = {
  id: string
  title: string
  situation: string
  task: string
  action: string
  result: string
  skills: string[]
  tags: string[]
  relevance?: number | null
  reason?: string | null
}

export type ApplicationContextMemory = {
  id: string
  category: string
  key: string
  value: string
  origin: string
  confidence: number
  relevance?: number | null
  reason?: string | null
}

export type ApplicationContextOpportunity = {
  id: string
  title: string
  company?: string | null
  location?: string | null
  description: string
  matchScore?: number | null
  recommendation?: string | null
  strengths?: unknown
  gaps?: unknown
}

export type ApplicationContextInput = {
  opportunity: ApplicationContextOpportunity
  stories: ApplicationContextStory[]
  memories: ApplicationContextMemory[]
}

export type ApplicationContext = {
  opportunity: ApplicationContextOpportunity
  stories: ApplicationContextStory[]
  memories: ApplicationContextMemory[]
  evidenceCount: number
  plainText: string
  guardrails: string[]
}

function normalizeLine(value: unknown) {
  if (typeof value === "string") {
    return value.trim()
  }

  if (
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return String(value)
  }

  return ""
}

function flattenUnknown(
  value: unknown,
  depth = 0,
): string[] {
  if (
    value === null ||
    value === undefined ||
    depth > 4
  ) {
    return []
  }

  if (typeof value === "string") {
    const normalized = value.trim()
    return normalized ? [normalized] : []
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

function storyToText(
  story: ApplicationContextStory,
) {
  const lines = [
    `Histoire: ${story.title}`,
    `Situation: ${story.situation}`,
    `Tâche: ${story.task}`,
    `Action: ${story.action}`,
    `Résultat: ${story.result}`,
  ]

  if (story.skills.length > 0) {
    lines.push(
      `Compétences: ${story.skills.join(", ")}`,
    )
  }

  if (
    story.relevance !== null &&
    story.relevance !== undefined
  ) {
    lines.push(
      `Pertinence: ${story.relevance}%`,
    )
  }

  return lines.join("\n")
}

function memoryToText(
  memory: ApplicationContextMemory,
) {
  const lines = [
    `Fait confirmé: ${memory.key}`,
    `Catégorie: ${memory.category}`,
    `Valeur: ${memory.value}`,
    `Confiance: ${memory.confidence}%`,
  ]

  if (
    memory.relevance !== null &&
    memory.relevance !== undefined
  ) {
    lines.push(
      `Pertinence: ${memory.relevance}%`,
    )
  }

  return lines.join("\n")
}

export function buildApplicationContext(
  input: ApplicationContextInput,
): ApplicationContext {
  const { opportunity } = input

  const stories =
    input.stories.filter(
      (story) =>
        story.title.trim() &&
        story.action.trim() &&
        story.result.trim(),
    )

  const memories =
    input.memories.filter(
      (memory) =>
        memory.key.trim() &&
        memory.value.trim(),
    )

  const strengths =
    flattenUnknown(
      opportunity.strengths,
    )

  const gaps =
    flattenUnknown(
      opportunity.gaps,
    )

  const sections: string[] = [
    "=== OPPORTUNITÉ ===",
    `Poste: ${opportunity.title}`,
    `Entreprise: ${
      normalizeLine(opportunity.company) ||
      "Non précisée"
    }`,
    `Localisation: ${
      normalizeLine(opportunity.location) ||
      "Non précisée"
    }`,
    "",
    "Description de l'offre:",
    opportunity.description,
  ]

  if (
    opportunity.matchScore !== null &&
    opportunity.matchScore !== undefined
  ) {
    sections.push(
      "",
      `Score de compatibilité: ${Math.round(
        opportunity.matchScore,
      )}%`,
    )
  }

  if (opportunity.recommendation) {
    sections.push(
      `Recommandation: ${opportunity.recommendation}`,
    )
  }

  if (strengths.length > 0) {
    sections.push(
      "",
      "Forces déjà identifiées:",
      ...strengths.map(
        (item) => `- ${item}`,
      ),
    )
  }

  if (gaps.length > 0) {
    sections.push(
      "",
      "Écarts déjà identifiés:",
      ...gaps.map(
        (item) => `- ${item}`,
      ),
    )
  }

  sections.push(
    "",
    "=== HISTOIRES PROFESSIONNELLES SÉLECTIONNÉES ===",
  )

  if (stories.length === 0) {
    sections.push(
      "Aucune histoire professionnelle sélectionnée.",
    )
  } else {
    stories.forEach((story, index) => {
      sections.push(
        "",
        `--- Histoire ${index + 1} ---`,
        storyToText(story),
      )
    })
  }

  sections.push(
    "",
    "=== CAREER MEMORY CONFIRMÉE ET SÉLECTIONNÉE ===",
  )

  if (memories.length === 0) {
    sections.push(
      "Aucun fait Career Memory sélectionné.",
    )
  } else {
    memories.forEach((memory, index) => {
      sections.push(
        "",
        `--- Mémoire ${index + 1} ---`,
        memoryToText(memory),
      )
    })
  }

  const guardrails = [
    "Utiliser uniquement les informations explicitement présentes dans ce contexte.",
    "Ne jamais inventer une expérience, un résultat, un chiffre, une compétence ou une responsabilité.",
    "Une absence d'information doit rester une absence d'information.",
    "Les Career Memories présentes ici ont été confirmées par l'utilisateur.",
    "Les histoires présentes ici ont été explicitement sélectionnées pour cette candidature.",
  ]

  sections.push(
    "",
    "=== RÈGLES DE VÉRITÉ ===",
    ...guardrails.map(
      (rule) => `- ${rule}`,
    ),
  )

  return {
    opportunity,
    stories,
    memories,
    evidenceCount:
      stories.length +
      memories.length,
    plainText:
      sections.join("\n"),
    guardrails,
  }
}