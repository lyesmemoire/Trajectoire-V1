// apps/web/src/lib/analytics/ConversionService.ts
//
// Service de calcul des taux de conversion
// Analyse les statistiques de conversion entre les étapes du funnel

import { EventType, ConversionStats } from '@/types/events'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'

/**
 * Service de calcul des taux de conversion
 * Analyse les statistiques de conversion entre les étapes du funnel
 */
export class ConversionService {
  /**
   * Calcule les statistiques de conversion sur une période
   * 
   * @param startDate - Date de début
   * @param endDate - Date de fin
   * @returns Statistiques de conversion
   */
  static async getConversionStats(startDate: Date, endDate: Date): Promise<ConversionStats> {
    try {
      // Récupérer les événements sur la période
      const events = await prisma.behaviorEvent.findMany({
        where: {
          timestamp: {
            gte: startDate,
            lte: endDate,
          },
        },
        select: {
          type: true,
          userId: true,
        },
      })

      // Compter les événements par type
      const counts: Record<string, Set<string>> = {
        [EventType.SIGNUP]: new Set(),
        [EventType.EMAIL_CONFIRMED]: new Set(),
        [EventType.FIRST_CV_UPLOAD]: new Set(),
        [EventType.FIRST_JOB_UPLOAD]: new Set(),
        [EventType.FIRST_MATCHING]: new Set(),
        [EventType.FIRST_COPILOT]: new Set(),
        [EventType.FIRST_SEARCH]: new Set(),
        [EventType.PREMIUM_CLICKED]: new Set(),
        [EventType.UPGRADE_STARTED]: new Set(),
        [EventType.UPGRADE_COMPLETED]: new Set(),
      }

      for (const event of events) {
        if (counts[event.type]) {
          counts[event.type].add(event.userId)
        }
      }

      const totalSignups = counts[EventType.SIGNUP].size
      const emailConfirmed = counts[EventType.EMAIL_CONFIRMED].size
      const cvUploaded = counts[EventType.FIRST_CV_UPLOAD].size
      const jobUploaded = counts[EventType.FIRST_JOB_UPLOAD].size
      const matchingDone = counts[EventType.FIRST_MATCHING].size
      const copilotUsed = counts[EventType.FIRST_COPILOT].size
      const searchDone = counts[EventType.FIRST_SEARCH].size
      const premiumClicked = counts[EventType.PREMIUM_CLICKED].size
      const upgradeStarted = counts[EventType.UPGRADE_STARTED].size
      const upgradeCompleted = counts[EventType.UPGRADE_COMPLETED].size

      // Calculer les taux de conversion
      const signupToEmailConfirmed = totalSignups > 0 ? (emailConfirmed / totalSignups) * 100 : 0
      const emailConfirmedToCVUpload = emailConfirmed > 0 ? (cvUploaded / emailConfirmed) * 100 : 0
      const cvUploadToPremiumClicked = cvUploaded > 0 ? (premiumClicked / cvUploaded) * 100 : 0
      const premiumClickedToUpgradeCompleted = premiumClicked > 0 ? (upgradeCompleted / premiumClicked) * 100 : 0

      return {
        totalSignups,
        emailConfirmed,
        cvUploaded,
        jobUploaded,
        matchingDone,
        copilotUsed,
        searchDone,
        premiumClicked,
        upgradeStarted,
        upgradeCompleted,
        signupToEmailConfirmed,
        emailConfirmedToCVUpload,
        cvUploadToPremiumClicked,
        premiumClickedToUpgradeCompleted,
      }
    } catch (error) {
      logger.error({ err: error, startDate, endDate }, 'Error calculating conversion stats')
      throw error
    }
  }

  /**
   * Calcule le taux de conversion entre deux étapes
   * 
   * @param fromEvent - Type d'événement source
   * @param toEvent - Type d'événement destination
   * @param startDate - Date de début
   * @param endDate - Date de fin
   * @returns Taux de conversion en pourcentage
   */
  static async getConversionRate(
    fromEvent: EventType,
    toEvent: EventType,
    startDate: Date,
    endDate: Date
  ): Promise<number> {
    try {
      const stats = await this.getConversionStats(startDate, endDate)
      
      const fromCount = this.getEventCount(stats, fromEvent)
      const toCount = this.getEventCount(stats, toEvent)

      return fromCount > 0 ? (toCount / fromCount) * 100 : 0
    } catch (error) {
      logger.error({ err: error, fromEvent, toEvent }, 'Error calculating conversion rate')
      return 0
    }
  }

  /**
   * Récupère le nombre d'événements depuis les stats
   */
  private static getEventCount(stats: ConversionStats, eventType: EventType): number {
    switch (eventType) {
      case EventType.SIGNUP:
        return stats.totalSignups
      case EventType.EMAIL_CONFIRMED:
        return stats.emailConfirmed
      case EventType.FIRST_CV_UPLOAD:
        return stats.cvUploaded
      case EventType.FIRST_JOB_UPLOAD:
        return stats.jobUploaded
      case EventType.FIRST_MATCHING:
        return stats.matchingDone
      case EventType.FIRST_COPILOT:
        return stats.copilotUsed
      case EventType.FIRST_SEARCH:
        return stats.searchDone
      case EventType.PREMIUM_CLICKED:
        return stats.premiumClicked
      case EventType.UPGRADE_STARTED:
        return stats.upgradeStarted
      case EventType.UPGRADE_COMPLETED:
        return stats.upgradeCompleted
      default:
        return 0
    }
  }

  /**
   * Récupère le temps moyen entre deux événements
   * 
   * @param fromEvent - Type d'événement source
   * @param toEvent - Type d'événement destination
   * @param startDate - Date de début
   * @param endDate - Date de fin
   * @returns Temps moyen en millisecondes
   */
  static async getAverageTimeBetweenEvents(
    fromEvent: EventType,
    toEvent: EventType,
    startDate: Date,
    endDate: Date
  ): Promise<number> {
    try {
      const fromEvents = await prisma.behaviorEvent.findMany({
        where: {
          type: fromEvent,
          timestamp: {
            gte: startDate,
            lte: endDate,
          },
        },
        select: {
          userId: true,
          timestamp: true,
        },
      })

      const toEvents = await prisma.behaviorEvent.findMany({
        where: {
          type: toEvent,
          timestamp: {
            gte: startDate,
            lte: endDate,
          },
        },
        select: {
          userId: true,
          timestamp: true,
        },
      })

      // Créer une map des événements de destination par utilisateur
      const toEventsByUser = new Map<string, Date>()
      for (const event of toEvents) {
        toEventsByUser.set(event.userId, event.timestamp)
      }

      // Calculer les différences de temps
      const timeDiffs: number[] = []
      for (const fromEvent of fromEvents) {
        const toEventTimestamp = toEventsByUser.get(fromEvent.userId)
        if (toEventTimestamp && toEventTimestamp > fromEvent.timestamp) {
          timeDiffs.push(toEventTimestamp.getTime() - fromEvent.timestamp.getTime())
        }
      }

      if (timeDiffs.length === 0) return 0

      // Calculer la moyenne
      const sum = timeDiffs.reduce((acc, diff) => acc + diff, 0)
      return sum / timeDiffs.length
    } catch (error) {
      logger.error({ err: error, fromEvent, toEvent }, 'Error calculating average time between events')
      return 0
    }
  }

  /**
   * Récupère les utilisateurs qui ont converti entre deux étapes
   * 
   * @param fromEvent - Type d'événement source
   * @param toEvent - Type d'événement destination
   * @param startDate - Date de début
   * @param endDate - Date de fin
   * @returns Liste des IDs utilisateurs qui ont converti
   */
  static async getConvertedUsers(
    fromEvent: EventType,
    toEvent: EventType,
    startDate: Date,
    endDate: Date
  ): Promise<string[]> {
    try {
      const fromEvents = await prisma.behaviorEvent.findMany({
        where: {
          type: fromEvent,
          timestamp: {
            gte: startDate,
            lte: endDate,
          },
        },
        select: {
          userId: true,
        },
      })

      const toEvents = await prisma.behaviorEvent.findMany({
        where: {
          type: toEvent,
          timestamp: {
            gte: startDate,
            lte: endDate,
          },
        },
        select: {
          userId: true,
        },
      })

      const fromUsers = new Set(fromEvents.map(e => e.userId))
      const toUsers = new Set(toEvents.map(e => e.userId))

      // Retourner les utilisateurs qui sont dans les deux sets
      return [...fromUsers].filter(userId => toUsers.has(userId))
    } catch (error) {
      logger.error({ err: error, fromEvent, toEvent }, 'Error getting converted users')
      return []
    }
  }
}
