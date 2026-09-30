// apps/web/src/lib/preview/PreviewTransferService.ts
//
// Service de transfert des analyses preview vers le compte utilisateur
// MVP-007 — ATS Preview Persistence

import { logger } from '@/lib/logger'
import { PreviewStorageService } from './PreviewStorageService'
import { ClaimPreviewResponse } from '@/types/preview'

/**
 * Rattachement d'un aperçu anonyme à un compte utilisateur.
 *
 * L'aperçu est seulement MARQUÉ comme consommé et lié à l'utilisateur (anti-rejeu).
 * Rien n'est copié dans son profil, ses analyses (CVAnalysis) ou son nom : ce
 * diagnostic rapide n'est pas une source de vérité sur son parcours.
 */
export class PreviewTransferService {
  /**
   * Rattache une analyse preview à l'utilisateur.
   *
   * @param token - Token de l'analyse preview
   * @param userId - ID de l'utilisateur
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

      // 2. Marquer comme consommée et liée à l'utilisateur (anti-rejeu)
      const consumed = await PreviewStorageService.markAsConsumed(token, userId)

      if (!consumed) {
        return {
          success: false,
          error: 'Failed to mark preview as consumed',
        }
      }

      logger.info({ token, userId }, 'Preview linked to user')

      return { success: true }
    } catch (error) {
      logger.error({ err: error, token, userId }, 'Error linking preview to user')
      return {
        success: false,
        error: 'Failed to transfer preview to user',
      }
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
