// apps/web/src/lib/preview-analysis/PreviewAnalysisService.ts
//
// Service pour PreviewAnalysis
// Sauvegarde temporaire (24 h) du résultat de l'aperçu gratuit.
//
// Règles :
// - on ne persiste que le RÉSULTAT réellement calculé (score, forces, faiblesse) ;
//   jamais le texte du CV ni celui de l'offre ;
// - réclamer un aperçu (claim) le lie seulement à l'utilisateur : rien n'est copié
//   dans son profil, ses analyses ou son graphe de connaissances. L'aperçu est un
//   diagnostic rapide, pas une source de vérité sur le parcours.

import { previewAnalysisRepository } from './PreviewAnalysisRepository'

/** Résultat réellement calculé par generatePreviewAnalysis. */
export interface PreviewResult {
  score: number
  strengths: string[]
  weakness?: string
}

export interface SavePreviewAnalysisRequest {
  result: PreviewResult
  ipHash?: string
  fingerprint?: string
}

export class PreviewAnalysisService {
  /**
   * Enregistre le résultat d'un aperçu anonyme et renvoie son jeton.
   */
  async savePreviewAnalysis(
    request: SavePreviewAnalysisRequest,
  ): Promise<{ previewToken: string }> {
    const { result } = request

    const previewToken = await previewAnalysisRepository.create({
      ipHash: request.ipHash,
      fingerprint: request.fingerprint,
      analysisResult: result,
      atsScore: result.score,
      strengths: result.strengths,
      weaknesses: result.weakness ? [result.weakness] : [],
      status: 'completed',
    })

    return { previewToken }
  }

  /**
   * Lie un aperçu à un utilisateur (pas de copie dans son profil).
   */
  async claimPreview(token: string, userId: string): Promise<void> {
    const isValid = await previewAnalysisRepository.isValidToken(token)
    if (!isValid) {
      throw new Error('Invalid or expired preview token')
    }

    const preview = await previewAnalysisRepository.findByToken(token)
    if (!preview) {
      throw new Error('Preview analysis not found')
    }

    if (preview.claimedByUserId) {
      throw new Error('Preview analysis already claimed')
    }

    await previewAnalysisRepository.claimForUser(token, userId)
  }

  /**
   * Récupérer une preview analysis par token
   */
  async getPreviewAnalysis(token: string) {
    const preview = await previewAnalysisRepository.findByToken(token)

    if (!preview) {
      throw new Error('Preview analysis not found')
    }

    if (preview.expiresAt < new Date()) {
      throw new Error('Preview analysis expired')
    }

    return preview
  }

  /**
   * Récupérer la preview analysis revendiquée d'un utilisateur
   */
  async getUserClaimedPreview(userId: string) {
    return previewAnalysisRepository.findByUserId(userId)
  }

  /**
   * Nettoyer les tokens expirés
   */
  async cleanupExpired(): Promise<number> {
    return previewAnalysisRepository.deleteExpired()
  }
}

export const previewAnalysisService = new PreviewAnalysisService()
