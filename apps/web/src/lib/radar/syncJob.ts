import { prisma } from "@/lib/prisma"
import { logger } from "@/lib/logger"
import { criteriaFromSearch } from "./mappers"
import { getConfiguredSources } from "./sources"
import { getLatestCvText, refreshOfferStatuses, runRadarSearch } from "./sync"
import type { OfferSource } from "./types"

/** Une recherche n'est relancée par la tâche planifiée qu'après ce délai. */
export const SEARCH_REFRESH_HOURS = 6
/** Recherches traitées par appel (les plus anciennes d'abord) : tient dans la durée maximale d'une fonction. */
export const MAX_SEARCHES_PER_JOB = 15

export type RadarJobResult = {
  success: boolean
  sources: number
  searchesRun: number
  searchesFailed: number
  offersUpserted: number
  statuses: { stale: number; closed: number; purged: number }
}

/**
 * Tâche planifiée : vieillit le catalogue (toujours), puis relance les recherches actives qui n'ont pas été
 * actualisées récemment. Sans source configurée, seul le vieillissement est effectué. Chaque appel est consigné
 * dans `radar_sync_runs` (une ligne par source, ou une ligne « NONE » si aucune source).
 */
export async function radarSyncJob(options: { now?: Date; sources?: OfferSource[] } = {}): Promise<RadarJobResult> {
  const now = options.now ?? new Date()
  const sources = options.sources ?? getConfiguredSources()
  const run = await prisma.radarSyncRun.create({ data: { source: sources.map(s => s.id).join(",") || "NONE", status: "RUNNING", startedAt: now }, select: { id: true } })

  const result: RadarJobResult = { success: true, sources: sources.length, searchesRun: 0, searchesFailed: 0, offersUpserted: 0, statuses: { stale: 0, closed: 0, purged: 0 } }
  let errorText: string | null = null

  try {
    result.statuses = await refreshOfferStatuses(now)

    if (sources.length > 0) {
      const dueBefore = new Date(now.getTime() - SEARCH_REFRESH_HOURS * 3_600_000)
      const searches = await prisma.radarSearch.findMany({
        where: { enabled: true, OR: [{ lastRunAt: null }, { lastRunAt: { lt: dueBefore } }] },
        orderBy: [{ lastRunAt: { sort: "asc", nulls: "first" } }, { id: "asc" }],
        take: MAX_SEARCHES_PER_JOB,
      })

      const cvCache = new Map<string, string | null>()
      for (const search of searches) {
        try {
          if (!cvCache.has(search.userId)) cvCache.set(search.userId, await getLatestCvText(search.userId))
          const r = await runRadarSearch({
            search: { id: search.id, userId: search.userId, criteria: criteriaFromSearch(search) },
            cvText: cvCache.get(search.userId) ?? null,
            sources,
            now,
          })
          result.searchesRun += 1
          result.offersUpserted += r.upserted
          if (r.failedSources.length === sources.length) result.searchesFailed += 1
        } catch (error) {
          result.searchesFailed += 1
          logger.error({ err: error, searchId: search.id }, "[radar] recherche en échec")
          errorText = error instanceof Error ? error.message.slice(0, 300) : "Erreur inconnue"
        }
      }
    }
  } catch (error) {
    result.success = false
    errorText = error instanceof Error ? error.message.slice(0, 300) : "Erreur inconnue"
    logger.error({ err: error }, "[radar] tâche planifiée en échec")
  }

  await prisma.radarSyncRun
    .update({
      where: { id: run.id },
      data: {
        status: !result.success ? "FAILED" : result.searchesFailed > 0 ? "PARTIAL" : "OK",
        fetched: result.offersUpserted,
        upserted: result.offersUpserted,
        closed: result.statuses.closed,
        error: errorText,
        finishedAt: new Date(),
      },
    })
    .catch(error => logger.error({ err: error }, "[radar] journal de synchronisation non mis à jour"))

  return result
}
