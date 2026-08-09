// apps/web/src/lib/analytics/EventTrackingService.ts
//
// Service de tracking d'événements
// Enregistre les événements utilisateur pour l'analyse de conversion

import { EventType, EventPayload, TrackedEvent } from '@/types/events'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'

/**
 * Service de tracking d'événements
 * Enregistre les événements utilisateur dans la base de données
 */
export class EventTrackingService {
  /**
   * Enregistre un événement utilisateur
   * 
   * @param payload - Payload de l'événement
   * @returns L'événement enregistré
   */
  static async trackEvent(payload: EventPayload): Promise<TrackedEvent> {
    try {
      // Vérifier si c'est un "first" event et si l'utilisateur a déjà effectué cet événement
      const isFirstEvent = this.isFirstEvent(payload.type)
      
      if (isFirstEvent) {
        // Vérifier si l'utilisateur a déjà effectué cet événement
        const existingEvent = await prisma.behaviorEvent.findFirst({
          where: {
            userId: payload.userId,
            type: payload.type,
          },
        })

        if (existingEvent) {
          logger.info({ userId: payload.userId, type: payload.type }, 'Event already tracked, skipping')
          // Retourner l'événement existant
          return {
            id: existingEvent.id,
            type: payload.type as EventType,
            payload,
            createdAt: existingEvent.timestamp,
          }
        }
      }

      // Enregistrer l'événement dans BehaviorEvent
      const event = await prisma.behaviorEvent.create({
        data: {
          userId: payload.userId,
          sessionId: `analytics-${payload.userId}-${Date.now()}`, // ID de session généré pour les événements analytics
          type: payload.type,
          subtype: this.getSubtype(payload.type),
          timestamp: payload.timestamp,
          payload: payload as any,
        },
      })

      logger.info({ userId: payload.userId, type: payload.type }, 'Event tracked successfully')

      return {
        id: event.id,
        type: payload.type as EventType,
        payload,
        createdAt: event.timestamp,
      }
    } catch (error) {
      logger.error({ err: error, userId: payload.userId, type: payload.type }, 'Error tracking event')
      throw error
    }
  }

  /**
   * Vérifie si un type d'événement est un "first" event
   */
  private static isFirstEvent(type: string): boolean {
    return type.startsWith('first_')
  }

  /**
   * Obtient le subtype pour un type d'événement
   */
  private static getSubtype(type: string): string | undefined {
    switch (type) {
      case EventType.SIGNUP:
        return 'auth'
      case EventType.LOGIN:
        return 'auth'
      case EventType.EMAIL_CONFIRMED:
        return 'auth'
      case EventType.FIRST_CV_UPLOAD:
        return 'upload'
      case EventType.FIRST_JOB_UPLOAD:
        return 'upload'
      case EventType.FIRST_MATCHING:
        return 'analysis'
      case EventType.FIRST_COPILOT:
        return 'ai'
      case EventType.FIRST_SEARCH:
        return 'search'
      case EventType.PREMIUM_CLICKED:
        return 'conversion'
      case EventType.UPGRADE_STARTED:
        return 'conversion'
      case EventType.UPGRADE_COMPLETED:
        return 'conversion'
      default:
        return undefined
    }
  }

  /**
   * Récupère tous les événements d'un utilisateur
   * 
   * @param userId - ID de l'utilisateur
   * @returns Liste des événements
   */
  static async getUserEvents(userId: string): Promise<TrackedEvent[]> {
    try {
      const events = await prisma.behaviorEvent.findMany({
        where: { userId },
        orderBy: { timestamp: 'asc' },
      })

      return events.map(event => ({
        id: event.id,
        type: event.type as EventType,
        payload: event.payload as unknown as EventPayload,
        createdAt: event.timestamp,
      }))
    } catch (error) {
      logger.error({ err: error, userId }, 'Error fetching user events')
      throw error
    }
  }

  /**
   * Vérifie si un utilisateur a effectué un type d'événement
   * 
   * @param userId - ID de l'utilisateur
   * @param type - Type d'événement
   * @returns True si l'événement a été effectué
   */
  static async hasUserEvent(userId: string, type: EventType): Promise<boolean> {
    try {
      const event = await prisma.behaviorEvent.findFirst({
        where: {
          userId,
          type,
        },
      })

      return !!event
    } catch (error) {
      logger.error({ err: error, userId, type }, 'Error checking user event')
      return false
    }
  }

  /**
   * Récupère les statistiques d'événements sur une période
   * 
   * @param startDate - Date de début
   * @param endDate - Date de fin
   * @returns Statistiques par type d'événement
   */
  static async getEventStats(startDate: Date, endDate: Date): Promise<Record<EventType, number>> {
    try {
      const events = await prisma.behaviorEvent.findMany({
        where: {
          timestamp: {
            gte: startDate,
            lte: endDate,
          },
        },
      })

      const stats: Record<string, number> = {}

      for (const event of events) {
        stats[event.type] = (stats[event.type] || 0) + 1
      }

      return stats as Record<EventType, number>
    } catch (error) {
      logger.error({ err: error, startDate, endDate }, 'Error fetching event stats')
      throw error
    }
  }
}
