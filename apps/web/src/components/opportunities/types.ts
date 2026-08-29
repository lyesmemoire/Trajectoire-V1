export type OpportunityStatus =
  | "DISCOVERED"
  | "TO_ANALYZE"
  | "TO_APPLY"
  | "APPLIED"
  | "INTERVIEW"
  | "OFFER"
  | "REJECTED"
  | "ARCHIVED"

export type OpportunityListItem = {
  id: string
  title: string
  company: string | null
  location: string | null
  sourceUrl: string | null
  source: string | null
  description: string
  status: OpportunityStatus
  matchScore: number | null
  recommendationLabel: string | null
  nextAction: string | null
  nextActionAt: string | null
  discoveredAt: string
  updatedAt: string
}

export const opportunityColumns: Array<{
  status: OpportunityStatus
  label: string
  description: string
}> = [
  {
    status: "DISCOVERED",
    label: "Découvertes",
    description: "Offres à qualifier",
  },
  {
    status: "TO_ANALYZE",
    label: "À analyser",
    description: "Décider si elles valent ton temps",
  },
  {
    status: "TO_APPLY",
    label: "À candidater",
    description: "Opportunités prioritaires",
  },
  {
    status: "APPLIED",
    label: "Envoyées",
    description: "Candidatures en cours",
  },
  {
    status: "INTERVIEW",
    label: "Entretiens",
    description: "Préparation et suivi",
  },
  {
    status: "OFFER",
    label: "Offres",
    description: "Propositions reçues",
  },
]