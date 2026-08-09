// apps/web/src/lib/analytics/FunnelService.ts
//
// Service d'analyse de funnel
// Analyse le parcours utilisateur à travers les étapes du funnel

import { EventType, FunnelData } from '@/types/events'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'

/**
 * Configuration des étapes du funnel
 */
interface FunnelStep {
  /** Nom de l'étape */
  name: string
  /** Type d'événement correspondant */
  eventType: EventType
  /** Ordre dans le funnel */
  order: number
}

/**
 * Service d'analyse de funnel
 * Analyse le parcours utilisateur à travers les étapes du funnel
 */
export class FunnelService {
  /**
   * Définition du funnel principal
   */
  private static readonly MAIN_FUNNEL: FunnelStep[] = [
    { name: 'Inscription', eventType: EventType.SIGNUP, order: 1 },
    { name: 'Email confirmé', eventType: EventType.EMAIL_CONFIRMED, order: 2 },
    { name: 'CV uploadé', eventType: EventType.FIRST_CV_UPLOAD, order: 3 },
    { name: 'Fiche de poste uploadée', eventType: EventType.FIRST_JOB_UPLOAD, order: 4 },
    { name: 'Matching effectué', eventType: EventType.FIRST_MATCHING, order: 5 },
    { name: 'Copilot utilisé', eventType: EventType.FIRST_COPILOT, order: 6 },
    { name: 'Recherche effectuée', eventType: EventType.FIRST_SEARCH, order: 7 },
    { name: 'Premium cliqué', eventType: EventType.PREMIUM_CLICKED, order: 8 },
    { name: 'Upgrade commencé', eventType: EventType.UPGRADE_STARTED, order: 9 },
    { name: 'Upgrade complété', eventType: EventType.UPGRADE_COMPLETED, order: 10 },
  ]

  /**
   * Analyse le funnel principal sur une période
   * 
   * @param startDate - Date de début
   * @param endDate - Date de fin
   * @returns Données du funnel
   */
  static async analyzeFunnel(startDate: Date, endDate: Date): Promise<FunnelData[]> {
    try {
      const funnelData: FunnelData[] = []
      let previousCount = 0

      for (const step of this.MAIN_FUNNEL) {
        const count = await this.getStepCount(step.eventType, startDate, endDate)
        const percentage = previousCount > 0 ? (count / previousCount) * 100 : 100
        const cumulativePercentage = funnelData.length > 0 
          ? (count / funnelData[0].count) * 100 
          : 100

        funnelData.push({
          step: step.name,
          count,
          percentage,
          cumulativePercentage,
        })

        previousCount = count
      }

      return funnelData
    } catch (error) {
      logger.error({ err: error, startDate, endDate }, 'Error analyzing funnel')
      throw error
    }
  }

  /**
   * Récupère le nombre d'utilisateurs à une étape du funnel
   */
  private static async getStepCount(eventType: EventType, startDate: Date, endDate: Date): Promise<number> {
    const events = await prisma.behaviorEvent.findMany({
      where: {
        type: eventType,
        timestamp: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        userId: true,
      },
    })

    // Compter les utilisateurs uniques
    return new Set(events.map(e => e.userId)).size
  }

  /**
   * Analyse le funnel pour un utilisateur spécifique
   * 
   * @param userId - ID de l'utilisateur
   * @returns Étapes complétées par l'utilisateur
   */
  static async getUserFunnel(userId: string): Promise<FunnelData[]> {
    try {
      const userEvents = await prisma.behaviorEvent.findMany({
        where: { userId },
        select: {
          type: true,
          timestamp: true,
        },
        orderBy: { timestamp: 'asc' },
      })

      const completedSteps = new Set<EventType>()
      for (const event of userEvents) {
        completedSteps.add(event.type as EventType)
      }

      const funnelData: FunnelData[] = []
      let previousCount = 0

      for (const step of this.MAIN_FUNNEL) {
        const count = completedSteps.has(step.eventType) ? 1 : 0
        const percentage = previousCount > 0 ? (count / previousCount) * 100 : 100
        const cumulativePercentage = funnelData.length > 0 
          ? (count / (funnelData[0].count || 1)) * 100 
          : 100

        funnelData.push({
          step: step.name,
          count,
          percentage,
          cumulativePercentage,
        })

        previousCount = count
      }

      return funnelData
    } catch (error) {
      logger.error({ err: error, userId }, 'Error analyzing user funnel')
      throw error
    }
  }

  /**
   * Identifie les étapes où les utilisateurs abandonnent le plus
   * 
   * @param startDate - Date de début
   * @param endDate - Date de fin
   * @returns Étapes avec le taux d'abandon
   */
  static async getDropoffPoints(startDate: Date, endDate: Date): Promise<{
    step: string
    dropoffRate: number
    dropoffCount: number
  }[]> {
    try {
      const funnel = await this.analyzeFunnel(startDate, endDate)
      const dropoffPoints: {
        step: string
        dropoffRate: number
        dropoffCount: number
      }[] = []

      for (let i = 0; i < funnel.length - 1; i++) {
        const currentStep = funnel[i]
        const nextStep = funnel[i + 1]

        const dropoffCount = currentStep.count - nextStep.count
        const dropoffRate = currentStep.count > 0 
          ? (dropoffCount / currentStep.count) * 100 
          : 0

        dropoffPoints.push({
          step: currentStep.step,
          dropoffRate,
          dropoffCount,
        })
      }

      // Trier par taux d'abonnement décroissant
      return dropoffPoints.sort((a, b) => b.dropoffRate - a.dropoffRate)
    } catch (error) {
      logger.error({ err: error, startDate, endDate }, 'Error getting dropoff points')
      throw error
    }
  }

  /**
   * Calcule le temps moyen entre chaque étape du funnel
   * 
   * @param startDate - Date de début
   * @param endDate - Date de fin
   * @returns Temps moyen entre chaque étape (en secondes)
   */
  static async getAverageTimeBetweenSteps(startDate: Date, endDate: Date): Promise<{
    from: string
    to: string
    averageTime: number
  }[]> {
    try {
      const timeBetweenSteps: {
        from: string
        to: string
        averageTime: number
      }[] = []

      for (let i = 0; i < this.MAIN_FUNNEL.length - 1; i++) {
        const fromStep = this.MAIN_FUNNEL[i]
        const toStep = this.MAIN_FUNNEL[i + 1]

        const fromEvents = await prisma.behaviorEvent.findMany({
          where: {
            type: fromStep.eventType,
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
            type: toStep.eventType,
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

        const toEventsByUser = new Map<string, Date>()
        for (const event of toEvents) {
          toEventsByUser.set(event.userId, event.timestamp)
        }

        const timeDiffs: number[] = []
        for (const fromEvent of fromEvents) {
          const toEventTimestamp = toEventsByUser.get(fromEvent.userId)
          if (toEventTimestamp && toEventTimestamp > fromEvent.timestamp) {
            timeDiffs.push((toEventTimestamp.getTime() - fromEvent.timestamp.getTime()) / 1000) // En secondes
          }
        }

        const averageTime = timeDiffs.length > 0
          ? timeDiffs.reduce((acc, diff) => acc + diff, 0) / timeDiffs.length
          : 0

        timeBetweenSteps.push({
          from: fromStep.name,
          to: toStep.name,
          averageTime,
        })
      }

      return timeBetweenSteps
    } catch (error) {
      logger.error({ err: error, startDate, endDate }, 'Error getting average time between steps')
      throw error
    }
  }

  /**
   * Compare le funnel entre deux périodes
   * 
   * @param startDate1 - Date de début période 1
   * @param endDate1 - Date de fin période 1
   * @param startDate2 - Date de début période 2
   * @param endDate2 - Date de fin période 2
   * @returns Comparaison des funnels
   */
  static async compareFunnels(
    startDate1: Date,
    endDate1: Date,
    startDate2: Date,
    endDate2: Date
  ): Promise<{
    step: string
    count1: number
    count2: number
    change: number
    changePercentage: number
  }[]> {
    try {
      const funnel1 = await this.analyzeFunnel(startDate1, endDate1)
      const funnel2 = await this.analyzeFunnel(startDate2, endDate2)

      return funnel1.map((step1, index) => {
        const step2 = funnel2[index]
        const change = step2.count - step1.count
        const changePercentage = step1.count > 0 
          ? ((step2.count - step1.count) / step1.count) * 100 
          : 0

        return {
          step: step1.step,
          count1: step1.count,
          count2: step2.count,
          change,
          changePercentage,
        }
      })
    } catch (error) {
      logger.error({ err: error }, 'Error comparing funnels')
      throw error
    }
  }
}
