// apps/web/src/lib/preview/__tests__/PreviewStorageService.test.ts
//
// Tests unitaires pour PreviewStorageService
// MVP-007 — ATS Preview Persistence

import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { PreviewStorageService } from '../PreviewStorageService'
import { prisma } from '@/lib/prisma'
import { SavePreviewPayload, ATSResult, CandidateData, JobData } from '@/types/preview'

describe('PreviewStorageService', () => {
  const mockPayload: SavePreviewPayload = {
    atsResult: {
      score: 75,
      gapToOptimal: 5,
      percentile: 75,
      strengths: ['Bonne structure', 'Mots-clés pertinents'],
      weakness: ['Manque de détails'],
      radarDimensions: {
        structure: 80,
        keywords: 75,
        impact: 70,
        clarity: 75,
        relevance: 80,
      },
      message: 'CV bien structuré',
    } as ATSResult,
    candidateData: {
      fullName: 'John Doe',
      email: 'john@example.com',
    } as CandidateData,
    jobData: {
      title: 'Développeur Full Stack',
      description: 'Poste de développeur',
    } as JobData,
  }

  const mockIpHash = 'test-ip-hash'
  const mockFingerprint = 'test-fingerprint'

  beforeEach(async () => {
    // Nettoyer la base de données avant chaque test
    await prisma.previewAnalysis.deleteMany({})
  })

  afterEach(async () => {
    // Nettoyer la base de données après chaque test
    await prisma.previewAnalysis.deleteMany({})
  })

  describe('savePreview', () => {
    it('devrait sauvegarder une preview avec un token UUID', async () => {
      const result = await PreviewStorageService.savePreview(
        mockPayload,
        mockIpHash,
        mockFingerprint
      )

      expect(result).toBeDefined()
      expect(result.token).toBeDefined()
      expect(result.expiresAt).toBeInstanceOf(Date)
      expect(result.expiresAt.getTime()).toBeGreaterThan(Date.now())
    })

    it('devrait générer un token UUID v4 valide', async () => {
      const result = await PreviewStorageService.savePreview(
        mockPayload,
        mockIpHash,
        mockFingerprint
      )

      // UUID v4 format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      expect(result.token).toMatch(uuidRegex)
    })

    it('devrait définir l\'expiration à 24 heures', async () => {
      const result = await PreviewStorageService.savePreview(
        mockPayload,
        mockIpHash,
        mockFingerprint
      )

      const now = new Date()
      const twentyFourHoursLater = new Date(now.getTime() + 24 * 60 * 60 * 1000)
      
      // Tolérance de 1 seconde
      expect(Math.abs(result.expiresAt.getTime() - twentyFourHoursLater.getTime())).toBeLessThan(1000)
    })
  })

  describe('getPreviewByToken', () => {
    it('devrait récupérer une preview par son token', async () => {
      const { token } = await PreviewStorageService.savePreview(
        mockPayload,
        mockIpHash,
        mockFingerprint
      )

      const preview = await PreviewStorageService.getPreviewByToken(token)

      expect(preview).toBeDefined()
      expect(preview?.token).toBe(token)
      expect(preview?.atsResult).toEqual(mockPayload.atsResult)
      expect(preview?.candidateData).toEqual(mockPayload.candidateData)
      expect(preview?.jobData).toEqual(mockPayload.jobData)
      expect(preview?.consumed).toBe(false)
    })

    it('devrait retourner null pour un token inexistant', async () => {
      const preview = await PreviewStorageService.getPreviewByToken('non-existent-token')
      expect(preview).toBeNull()
    })

    it('devrait retourner null pour une preview expirée', async () => {
      const { token } = await PreviewStorageService.savePreview(
        mockPayload,
        mockIpHash,
        mockFingerprint
      )

      // Modifier manuellement l'expiration dans la BDD
      await prisma.previewAnalysis.update({
        where: { token },
        data: { expiresAt: new Date(Date.now() - 1000) }, // Expiré il y a 1 seconde
      })

      const preview = await PreviewStorageService.getPreviewByToken(token)
      expect(preview).toBeNull()
    })

    it('devrait retourner null pour une preview déjà consommée', async () => {
      const { token } = await PreviewStorageService.savePreview(
        mockPayload,
        mockIpHash,
        mockFingerprint
      )

      // Marquer comme consommée
      await PreviewStorageService.markAsConsumed(token, 'user-123')

      const preview = await PreviewStorageService.getPreviewByToken(token)
      expect(preview).toBeNull()
    })
  })

  describe('markAsConsumed', () => {
    it('devrait marquer une preview comme consommée', async () => {
      const { token } = await PreviewStorageService.savePreview(
        mockPayload,
        mockIpHash,
        mockFingerprint
      )

      const result = await PreviewStorageService.markAsConsumed(token, 'user-123')

      expect(result).toBe(true)

      const preview = await prisma.previewAnalysis.findUnique({ where: { token } })
      expect(preview?.consumed).toBe(true)
      expect(preview?.consumedAt).toBeInstanceOf(Date)
    })

    it('devrait retourner false pour un token inexistant', async () => {
      const result = await PreviewStorageService.markAsConsumed('non-existent-token', 'user-123')
      expect(result).toBe(false)
    })

    it('devrait retourner false pour une preview déjà consommée', async () => {
      const { token } = await PreviewStorageService.savePreview(
        mockPayload,
        mockIpHash,
        mockFingerprint
      )

      await PreviewStorageService.markAsConsumed(token, 'user-123')
      const result = await PreviewStorageService.markAsConsumed(token, 'user-456')

      expect(result).toBe(false)
    })

    it('devrait retourner false pour une preview expirée', async () => {
      const { token } = await PreviewStorageService.savePreview(
        mockPayload,
        mockIpHash,
        mockFingerprint
      )

      await prisma.previewAnalysis.update({
        where: { token },
        data: { expiresAt: new Date(Date.now() - 1000) },
      })

      const result = await PreviewStorageService.markAsConsumed(token, 'user-123')
      expect(result).toBe(false)
    })
  })

  describe('deletePreview', () => {
    it('devrait supprimer une preview', async () => {
      const { token } = await PreviewStorageService.savePreview(
        mockPayload,
        mockIpHash,
        mockFingerprint
      )

      const result = await PreviewStorageService.deletePreview(token)

      expect(result).toBe(true)

      const preview = await prisma.previewAnalysis.findUnique({ where: { token } })
      expect(preview).toBeNull()
    })

    it('devrait retourner false pour un token inexistant', async () => {
      const result = await PreviewStorageService.deletePreview('non-existent-token')
      expect(result).toBe(false)
    })
  })

  describe('isTokenValid', () => {
    it('devrait retourner true pour un token valide', async () => {
      const { token } = await PreviewStorageService.savePreview(
        mockPayload,
        mockIpHash,
        mockFingerprint
      )

      const isValid = await PreviewStorageService.isTokenValid(token)
      expect(isValid).toBe(true)
    })

    it('devrait retourner false pour un token invalide', async () => {
      const isValid = await PreviewStorageService.isTokenValid('non-existent-token')
      expect(isValid).toBe(false)
    })

    it('devrait retourner false pour un token expiré', async () => {
      const { token } = await PreviewStorageService.savePreview(
        mockPayload,
        mockIpHash,
        mockFingerprint
      )

      await prisma.previewAnalysis.update({
        where: { token },
        data: { expiresAt: new Date(Date.now() - 1000) },
      })

      const isValid = await PreviewStorageService.isTokenValid(token)
      expect(isValid).toBe(false)
    })
  })
})
