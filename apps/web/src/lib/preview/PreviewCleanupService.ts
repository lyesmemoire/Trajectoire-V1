// apps/web/src/lib/preview/PreviewCleanupService.ts
//
// Service de nettoyage automatique des analyses preview expirées
// MVP-007 — ATS Preview Persistence

import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'

/**
 * Service de nettoyage automatique des analyses preview expirées
 * Supprime les previews expirées pour libérer de l'espace
 */
export class PreviewCleanupService {
  /**
   * Supprime toutes les analyses preview expirées
   * 
   * @returns Nombre de previews supprimées
   */
  static async cleanupExpiredPreviews(): Promise<number> {
    try {
      const now = new Date()

      const result = await prisma.previewAnalysis.deleteMany({
        where: {
          expiresAt: {
            lt: now,
          },
        },
      })

      const deletedCount = result.count

      if (deletedCount > 0) {
        logger.info(
          { deletedCount, timestamp: now },
          'Expired previews cleaned up successfully'
        )
      }

      return deletedCount
    } catch (error) {
      logger.error({ err: error }, 'Error cleaning up expired previews')
      throw error
    }
  }

  /**
   * Supprime les analyses preview consommées (optionnel)
   * Utile pour nettoyer les previews qui ont été claimées
   * 
   * @param olderThanHours - Âge minimum en heures avant suppression
   * @returns Nombre de previews supprimées
   */
  static async cleanupConsumedPreviews(olderThanHours: number = 24): Promise<number> {
    try {
      const cutoffDate = new Date()
      cutoffDate.setHours(cutoffDate.getHours() - olderThanHours)

      const result = await prisma.previewAnalysis.deleteMany({
        where: {
          consumed: true,
          consumedAt: {
            lt: cutoffDate,
          },
        },
      })

      const deletedCount = result.count

      if (deletedCount > 0) {
        logger.info(
          { deletedCount, cutoffDate },
          'Consumed previews cleaned up successfully'
        )
      }

      return deletedCount
    } catch (error) {
      logger.error({ err: error }, 'Error cleaning up consumed previews')
      throw error
    }
  }

  /**
   * Supprime toutes les analyses preview (DANGEREUX - à utiliser avec précaution)
   * 
   * @returns Nombre de previews supprimées
   */
  static async cleanupAllPreviews(): Promise<number> {
    try {
      const result = await prisma.previewAnalysis.deleteMany({})

      const deletedCount = result.count

      logger.warn(
        { deletedCount },
        'All previews deleted (dangerous operation)'
      )

      return deletedCount
    } catch (error) {
      logger.error({ err: error }, 'Error cleaning up all previews')
      throw error
    }
  }

  /**
   * Obtient des statistiques sur les previews
   * 
   * @returns Statistiques sur les previews
   */
  static async getPreviewStats(): Promise<{
    total: number
    expired: number
    consumed: number
    active: number
  }> {
    try {
      const now = new Date()

      const [total, expired, consumed] = await Promise.all([
        prisma.previewAnalysis.count(),
        prisma.previewAnalysis.count({
          where: {
            expiresAt: {
              lt: now,
            },
          },
        }),
        prisma.previewAnalysis.count({
          where: {
            consumed: true,
          },
        }),
      ])

      const active = total - expired - consumed

      return {
        total,
        expired,
        consumed,
        active,
      }
    } catch (error) {
      logger.error({ err: error }, 'Error getting preview stats')
      throw error
    }
  }
}
