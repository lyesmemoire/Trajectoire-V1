// apps/web/src/lib/preview/PreviewStorageService.ts
//
// Service de stockage temporaire des analyses ATS preview
// MVP-007 — ATS Preview Persistence

import { v4 as uuidv4 } from 'uuid'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'
import {
  SavePreviewPayload,
  SavePreviewResponse,
  PreviewAnalysis,
  ATSResult,
  CandidateData,
  JobData,
} from '@/types/preview'

/**
 * Service de stockage temporaire des analyses preview
 * Gère la création, récupération et validation des tokens
 */
export class PreviewStorageService {
  /** TTL par défaut : 24 heures en millisecondes */
  private static readonly DEFAULT_TTL = 24 * 60 * 60 * 1000

  /**
   * Sauvegarde une analyse preview
   * 
   * @param payload - Données de l'analyse à sauvegarder
   * @param ipHash - Hash de l'IP pour rate limiting
   * @param fingerprint - Fingerprint du navigateur pour sécurité
   * @returns Token et date d'expiration
   */
  static async savePreview(
    payload: SavePreviewPayload,
    ipHash: string,
    fingerprint: string
  ): Promise<SavePreviewResponse> {
    try {
      const token = uuidv4()
      const now = new Date()
      const expiresAt = new Date(now.getTime() + this.DEFAULT_TTL)

      const preview = await (prisma as any).previewAnalysis.create({
        data: {
          token,
          createdAt: now,
          expiresAt,
          ipHash,
          fingerprint,
          cvExtract: payload.candidateData,
          jobExtract: payload.jobData,
          analysisResult: payload.atsResult,
          consumed: false,
        },
      })

      logger.info(
        { token, expiresAt, ipHash },
        'Preview analysis saved successfully'
      )

      return {
        token: preview.token,
        expiresAt: preview.expiresAt,
      }
    } catch (error) {
      logger.error({ err: error, ipHash }, 'Error saving preview analysis')
      throw error
    }
  }

  /**
   * Récupère une analyse preview par son token
   * 
   * @param token - Token de l'analyse
   * @returns Analyse preview ou null si non trouvée/expirée
   */
  static async getPreviewByToken(token: string): Promise<PreviewAnalysis | null> {
    try {
      const preview = await (prisma as any).previewAnalysis.findUnique({
        where: { token },
      })

      if (!preview) {
        logger.warn({ token }, 'Preview not found')
        return null
      }

      // Vérifier l'expiration
      if (new Date() > preview.expiresAt) {
        logger.warn({ token, expiresAt: preview.expiresAt }, 'Preview expired')
        return null
      }

      // Vérifier si déjà consommée
      if (preview.consumed) {
        logger.warn({ token, consumedAt: preview.consumedAt }, 'Preview already consumed')
        return null
      }

      return {
        id: preview.id,
        token: preview.token,
        createdAt: preview.createdAt,
        expiresAt: preview.expiresAt,
        ipHash: preview.ipHash,
        fingerprint: preview.fingerprint,
        atsResult: preview.analysisResult as unknown as ATSResult,
        candidateData: preview.cvExtract as unknown as CandidateData,
        jobData: preview.jobExtract as unknown as JobData,
        consumed: preview.consumed,
        consumedAt: preview.consumedAt || undefined,
        claimedBy: preview.claimedByUserId || undefined,
      }
    } catch (error) {
      logger.error({ err: error, token }, 'Error fetching preview by token')
      throw error
    }
  }

  /**
   * Marque une analyse comme consommée
   * 
   * @param token - Token de l'analyse
   * @param userId - ID de l'utilisateur qui claim l'analyse
   * @returns true si succès
   */
  static async markAsConsumed(token: string, userId: string): Promise<boolean> {
    try {
      const preview = await (prisma as any).previewAnalysis.findUnique({
        where: { token },
      })

      if (!preview) {
        logger.warn({ token }, 'Preview not found for consumption')
        return false
      }

      if (preview.consumed) {
        logger.warn({ token }, 'Preview already consumed')
        return false
      }

      if (new Date() > preview.expiresAt) {
        logger.warn({ token }, 'Preview expired')
        return false
      }

      await (prisma as any).previewAnalysis.update({
        where: { token },
        data: {
          consumed: true,
          consumedAt: new Date(),
          claimedByUserId: userId,
        },
      })

      logger.info({ token, userId }, 'Preview marked as consumed')
      return true
    } catch (error) {
      logger.error({ err: error, token, userId }, 'Error marking preview as consumed')
      throw error
    }
  }

  /**
   * Supprime une analyse preview
   * 
   * @param token - Token de l'analyse
   * @returns true si succès
   */
  static async deletePreview(token: string): Promise<boolean> {
    try {
      await prisma.previewAnalysis.delete({
        where: { token },
      })

      logger.info({ token }, 'Preview deleted successfully')
      return true
    } catch (error) {
      logger.error({ err: error, token }, 'Error deleting preview')
      return false
    }
  }

  /**
   * Vérifie si un token est valide
   * 
   * @param token - Token à vérifier
   * @returns true si valide
   */
  static async isTokenValid(token: string): Promise<boolean> {
    const preview = await this.getPreviewByToken(token)
    return preview !== null
  }
}
