// apps/web/src/lib/preview-analysis/PreviewAnalysisRepository.ts
//
// Repository pour PreviewAnalysis
// Système de sauvegarde temporaire des analyses ATS sans authentification

import { prisma } from '@/lib/prisma'
import { randomUUID } from 'crypto'

export interface PreviewAnalysisData {
  token?: string
  ipHash?: string
  fingerprint?: string
  cvExtract?: any
  jobExtract?: any
  analysisResult?: any
  atsScore?: number
  strengths?: any
  weaknesses?: any
  recommendations?: any
  rawPayload?: any
  status?: string
  expiresAt?: Date
}

export class PreviewAnalysisRepository {
  /**
   * Créer une nouvelle preview analysis
   */
  async create(data: Omit<PreviewAnalysisData, 'token'>): Promise<string> {
    const token = randomUUID()
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24h TTL

    const preview = await (prisma as any).previewAnalysis.create({
      data: {
        token,
        expiresAt,
        ...data,
      },
    })

    return preview.token
  }

  /**
   * Récupérer une preview analysis par token
   */
  async findByToken(token: string) {
    return prisma.previewAnalysis.findUnique({
      where: { token },
    })
  }

  /**
   * Récupérer une preview analysis par userId (déjà revendiquée)
   */
  async findByUserId(userId: string) {
    return prisma.previewAnalysis.findFirst({
      where: { 
        claimedByUserId: userId,
        consumed: true,
      },
    })
  }

  /**
   * Marquer une preview analysis comme consommée
   */
  async markAsConsumed(token: string): Promise<void> {
    await prisma.previewAnalysis.update({
      where: { token },
      data: {
        consumed: true,
        consumedAt: new Date(),
      },
    })
  }

  /**
   * Revendiquer une preview analysis pour un utilisateur
   */
  async claimForUser(token: string, userId: string): Promise<void> {
    await (prisma as any).previewAnalysis.update({
      where: { token },
      data: {
        claimedByUserId: userId,
        claimedAt: new Date(),
        consumed: true,
        consumedAt: new Date(),
        status: 'claimed',
      },
    })
  }

  /**
   * Supprimer les preview analyses expirées
   */
  async deleteExpired(): Promise<number> {
    const result = await (prisma as any).previewAnalysis.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
        consumed: false,
      },
    })

    return result.count
  }

  /**
   * Nettoyer les preview analyses non revendiquées après un certain temps
   */
  async cleanupOldUnclaimed(days: number = 7): Promise<number> {
    const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)

    const result = await prisma.previewAnalysis.deleteMany({
      where: {
        createdAt: {
          lt: cutoffDate,
        },
        claimedByUserId: null,
      },
    })

    return result.count
  }

  /**
   * Vérifier si un token est valide (non expiré et non consommé)
   */
  async isValidToken(token: string): Promise<boolean> {
    const preview = await this.findByToken(token)
    
    if (!preview) return false
    if (preview.consumed) return false
    if (preview.expiresAt < new Date()) return false

    return true
  }
}

export const previewAnalysisRepository = new PreviewAnalysisRepository()
