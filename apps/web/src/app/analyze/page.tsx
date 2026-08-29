import { prisma } from "@/lib/prisma"
import { createClient } from "@/lib/supabase/server"
import { AnalyzeOpportunityClient } from "@/components/analyze/AnalyzeOpportunityClient"

export const dynamic = "force-dynamic"

type PageProps = {
  searchParams: Promise<{
    opportunity?: string
  }>
}

function stringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return []

  return value.filter(
    (item): item is string =>
      typeof item === "string",
  )
}

export default async function AnalyzePage({
  searchParams,
}: PageProps) {
  const params = await searchParams

  const opportunityId =
    typeof params.opportunity === "string"
      ? params.opportunity.trim()
      : ""

  let opportunity = null

  if (opportunityId) {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (user) {
      const record = await prisma.opportunity.findFirst({
        where: {
          id: opportunityId,
          userId: user.id,
        },
        select: {
          id: true,
          title: true,
          company: true,
          description: true,
          matchScore: true,
          recommendationLabel: true,
          strengths: true,
          gaps: true,
        },
      })

      if (record) {
        opportunity = {
          ...record,
          strengths: stringArray(record.strengths),
          gaps: stringArray(record.gaps),
        }
      }
    }
  }

  return (
    <AnalyzeOpportunityClient
      opportunity={opportunity}
    />
  )
}