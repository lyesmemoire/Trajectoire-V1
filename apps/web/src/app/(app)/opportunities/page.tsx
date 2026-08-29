import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { createClient } from "@/lib/supabase/server"
import { OpportunitiesPipeline } from "@/components/opportunities/OpportunitiesPipeline"
import type { OpportunityListItem } from "@/components/opportunities/types"

export const dynamic = "force-dynamic"

export default async function OpportunitiesPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const opportunities = await prisma.opportunity.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      updatedAt: "desc",
    },
  })

  const serialized: OpportunityListItem[] = opportunities.map(
    (opportunity) => ({
      id: opportunity.id,
      title: opportunity.title,
      company: opportunity.company,
      location: opportunity.location,
      sourceUrl: opportunity.sourceUrl,
      source: opportunity.source,
      description: opportunity.description,
      status: opportunity.status,
      matchScore: opportunity.matchScore,
      recommendationLabel: opportunity.recommendationLabel,
      nextAction: opportunity.nextAction,
      nextActionAt: opportunity.nextActionAt?.toISOString() ?? null,
      discoveredAt: opportunity.discoveredAt.toISOString(),
      updatedAt: opportunity.updatedAt.toISOString(),
    }),
  )

  return <OpportunitiesPipeline initialOpportunities={serialized} />
}