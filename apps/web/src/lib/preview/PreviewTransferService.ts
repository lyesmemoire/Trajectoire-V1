// apps/web/src/lib/preview/PreviewTransferService.ts
//
// Service de transfert des analyses preview vers le compte utilisateur
// MVP-007 — ATS Preview Persistence

import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'
import { PreviewStorageService } from './PreviewStorageService'
import { PreviewAnalysis, ClaimPreviewResponse } from '@/types/preview'

/**
 * Service de transfert des analyses preview vers le compte utilisateur
 * Transfère les données de PreviewAnalysis vers CVAnalysis, CareerProfile, etc.
 */
export class PreviewTransferService {
  /**
   * Transfère une analyse preview vers le compte utilisateur
   * 
   * @param token - Token de l'analyse preview
   * @param userId - ID de l'utilisateur
   * @returns Réponse du claim avec ID de l'analyse créée
   */
  static async transferPreviewToUser(
    token: string,
    userId: string
  ): Promise<ClaimPreviewResponse> {
    try {
      // 1. Récupérer la preview
      const preview = await PreviewStorageService.getPreviewByToken(token)

      if (!preview) {
        return {
          success: false,
          error: 'Preview not found, expired, or already consumed',
        }
      }

      // 2. Marquer comme consommée (anti-replay)
      const consumed = await PreviewStorageService.markAsConsumed(token, userId)

      if (!consumed) {
        return {
          success: false,
          error: 'Failed to mark preview as consumed',
        }
      }

      // 3. Créer l'analyse CV dans le compte utilisateur
      const cvAnalysis = await prisma.cVAnalysis.create({
        data: {
          userId,
          fileName: 'CV Preview',
          originalText: JSON.stringify(preview.candidateData),
          optimizedText: JSON.stringify(preview.atsResult),
          cvData: preview.candidateData as any,
          atsScoreBefore: preview.atsResult.score,
          atsScoreAfter: preview.atsResult.score,
          improvements: {
            strengths: preview.atsResult.strengths,
            weakness: preview.atsResult.weakness,
            radarDimensions: preview.atsResult.radarDimensions,
          } as any,
          keywords: {
            score: preview.atsResult.score,
            gapToOptimal: preview.atsResult.gapToOptimal,
            percentile: preview.atsResult.percentile,
          } as any,
        },
      })

      // 4. Mettre à jour le profil utilisateur si nécessaire
      await this.updateUserProfile(userId, preview)

      // 5. Logger le transfert
      logger.info(
        {
          token,
          userId,
          analysisId: cvAnalysis.id,
        },
        'Preview transferred to user successfully'
      )

      return {
        success: true,
        analysisId: cvAnalysis.id,
      }
    } catch (error) {
      logger.error({ err: error, token, userId }, 'Error transferring preview to user')
      return {
        success: false,
        error: 'Failed to transfer preview to user',
      }
    }
  }

  /**
   * Met à jour le profil utilisateur avec les données de la preview
   * 
   * @param userId - ID de l'utilisateur
   * @param preview - Données de la preview
   */
  private static async updateUserProfile(
    userId: string,
    preview: PreviewAnalysis
  ): Promise<void> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { name: true, email: true },
      })

      if (!user) {
        logger.warn({ userId }, 'User not found for profile update')
        return
      }

      // Mettre à jour le nom si non défini
      if (!user.name && preview.candidateData.fullName) {
        await prisma.user.update({
          where: { id: userId },
          data: { name: preview.candidateData.fullName },
        })
      }

      // Mettre à jour l'email si non défini
      if (!user.email && preview.candidateData.email) {
        await prisma.user.update({
          where: { id: userId },
          data: { email: preview.candidateData.email },
        })
      }

      logger.info({ userId }, 'User profile updated from preview')
    } catch (error) {
      logger.error({ err: error, userId }, 'Error updating user profile')
      // Ne pas throw l'erreur, le transfert a réussi même si la mise à jour échoue
    }
  }

  /**
   * Vérifie si un utilisateur a des previews à claimer
   * 
   * @param userId - ID de l'utilisateur
   * @returns Liste des tokens disponibles
   */
  static async getUserAvailablePreviews(userId: string): Promise<string[]> {
    try {
      // Cette fonction pourrait être utilisée pour afficher des previews non claimées
      // Pour l'instant, on retourne une liste vide car l'auto-claim se fait à la connexion
      return []
    } catch (error) {
      logger.error({ err: error, userId }, 'Error getting user available previews')
      return []
    }
  }
}
