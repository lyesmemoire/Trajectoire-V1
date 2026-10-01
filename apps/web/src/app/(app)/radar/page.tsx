import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { createClient } from "@/lib/supabase/server"
import { RadarBoard, type RadarMatchItem, type RadarSearchItem } from "@/components/radar/RadarBoard"
import { MATCH_LIST_SELECT, toMatchListItem } from "@/lib/radar/mappers"
import { MAX_RADAR_SEARCHES_PER_USER } from "@/lib/radar/schemas"
import { getConfiguredSources } from "@/lib/radar/sources"

export const metadata: Metadata = { title: "Radar des offres – Trajectoire" }
export const dynamic = "force-dynamic"

const PAGE_SIZE = 30

export default async function RadarPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const [searches, rows, cvCount] = await Promise.all([
    prisma.radarSearch.findMany({ where: { userId: user.id }, orderBy: { createdAt: "asc" } }),
    prisma.radarMatch.findMany({
      where: { userId: user.id, state: { not: "DISMISSED" } },
      orderBy: [{ score: { sort: "desc", nulls: "last" } }, { matchedAt: "desc" }, { id: "asc" }],
      take: PAGE_SIZE + 1,
      select: MATCH_LIST_SELECT,
    }),
    prisma.cVAnalysis.count({ where: { userId: user.id } }),
  ])

  const page = rows.slice(0, PAGE_SIZE)

  const initialSearches: RadarSearchItem[] = searches.map(s => ({
    id: s.id,
    name: s.name,
    keywords: s.keywords,
    departments: s.departments,
    contractTypes: s.contractTypes,
    sources: s.sources,
    enabled: s.enabled,
    lastRunAt: s.lastRunAt?.toISOString() ?? null,
    lastRunError: s.lastRunError,
  }))

  return (
    <RadarBoard
      initialSearches={initialSearches}
      initialMatches={page.map(toMatchListItem) as unknown as RadarMatchItem[]}
      initialCursor={rows.length > PAGE_SIZE ? page[page.length - 1].id : null}
      sourcesConfigured={getConfiguredSources().length > 0}
      hasCv={cvCount > 0}
      maxSearches={MAX_RADAR_SEARCHES_PER_USER}
    />
  )
}
