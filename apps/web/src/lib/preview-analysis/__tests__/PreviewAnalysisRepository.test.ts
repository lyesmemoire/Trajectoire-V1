// apps/web/src/lib/preview-analysis/__tests__/PreviewAnalysisRepository.test.ts
//
// Tests unitaires pour PreviewAnalysisRepository
// MVP-012 — Preview Analysis System

import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { previewAnalysisRepository } from '../PreviewAnalysisRepository'
import { prisma } from '@/lib/prisma'

describe('PreviewAnalysisRepository', () => {
  beforeEach(async () => {
    // Nettoyer la base de données avant chaque test
    await prisma.previewAnalysis.deleteMany({})
  })

  afterEach(async () => {
    // Nettoyer la base de données après chaque test
    await prisma.previewAnalysis.deleteMany({})
  })

  describe('create', () => {
    it('devrait créer une nouvelle preview analysis avec un token', async () => {
      const data = {
        ipHash: 'test-ip-hash',
        fingerprint: 'test-fingerprint',
        cvExtract: { name: 'Test CV' },
        jobExtract: { title: 'Test Job' },
        analysisResult: { score: 75 },
        atsScore: 75,
        strengths: ['Experience'],
        weaknesses: ['Education'],
        recommendations: ['Add details'],
        rawPayload: { test: true },
        status: 'completed',
      }

      const token = await previewAnalysisRepository.create(data)

      expect(token).toBeDefined()
      expect(typeof token).toBe('string')

      const preview = await previewAnalysisRepository.findByToken(token)
      expect(preview).toBeDefined()
      expect(preview?.token).toBe(token)
      expect(preview?.ipHash).toBe(data.ipHash)
      expect(preview?.atsScore).toBe(data.atsScore)
    })

    it('devrait générer un token unique', async () => {
      const data = {
        ipHash: 'test-ip-hash',
        fingerprint: 'test-fingerprint',
      }

      const token1 = await previewAnalysisRepository.create(data)
      const token2 = await previewAnalysisRepository.create(data)

      expect(token1).not.toBe(token2)
    })

    it('devrait définir expiresAt à 24h', async () => {
      const data = {
        ipHash: 'test-ip-hash',
        fingerprint: 'test-fingerprint',
      }

      const token = await previewAnalysisRepository.create(data)
      const preview = await previewAnalysisRepository.findByToken(token)

      const now = new Date()
      const expiresAt = new Date(preview!.expiresAt)
      const diff = expiresAt.getTime() - now.getTime()

      // 24h en millisecondes = 86400000
      expect(diff).toBeGreaterThan(86000000) // ~23h50min
      expect(diff).toBeLessThan(86800000) // ~24h10min
    })
  })

  describe('findByToken', () => {
    it('devrait récupérer une preview par token', async () => {
      const data = {
        ipHash: 'test-ip-hash',
        fingerprint: 'test-fingerprint',
        atsScore: 80,
      }

      const token = await previewAnalysisRepository.create(data)
      const preview = await previewAnalysisRepository.findByToken(token)

      expect(preview).toBeDefined()
      expect(preview?.token).toBe(token)
      expect(preview?.atsScore).toBe(80)
    })

    it('devrait retourner null si token inexistant', async () => {
      const preview = await previewAnalysisRepository.findByToken('non-existent-token')
      expect(preview).toBeNull()
    })
  })

  describe('findByUserId', () => {
    it('devrait récupérer une preview revendiquée par userId', async () => {
      const userId = 'test-user-id'
      const data = {
        ipHash: 'test-ip-hash',
        fingerprint: 'test-fingerprint',
        atsScore: 85,
      }

      const token = await previewAnalysisRepository.create(data)
      await previewAnalysisRepository.claimForUser(token, userId)

      const preview = await previewAnalysisRepository.findByUserId(userId)

      expect(preview).toBeDefined()
      expect(preview?.claimedByUserId).toBe(userId)
      expect(preview?.consumed).toBe(true)
    })

    it('devrait retourner null si aucune preview revendiquée', async () => {
      const preview = await previewAnalysisRepository.findByUserId('non-existent-user')
      expect(preview).toBeNull()
    })
  })

  describe('markAsConsumed', () => {
    it('devrait marquer une preview comme consommée', async () => {
      const data = {
        ipHash: 'test-ip-hash',
        fingerprint: 'test-fingerprint',
      }

      const token = await previewAnalysisRepository.create(data)
      await previewAnalysisRepository.markAsConsumed(token)

      const preview = await previewAnalysisRepository.findByToken(token)
      expect(preview?.consumed).toBe(true)
      expect(preview?.consumedAt).toBeDefined()
    })
  })

  describe('claimForUser', () => {
    it('devrait revendiquer une preview pour un utilisateur', async () => {
      const userId = 'test-user-id'
      const data = {
        ipHash: 'test-ip-hash',
        fingerprint: 'test-fingerprint',
        atsScore: 90,
      }

      const token = await previewAnalysisRepository.create(data)
      await previewAnalysisRepository.claimForUser(token, userId)

      const preview = await previewAnalysisRepository.findByToken(token)
      expect(preview?.claimedByUserId).toBe(userId)
      expect(preview?.claimedAt).toBeDefined()
      expect(preview?.consumed).toBe(true)
      expect(preview?.status).toBe('claimed')
    })
  })

  describe('deleteExpired', () => {
    it('devrait supprimer les previews expirées', async () => {
      const data = {
        ipHash: 'test-ip-hash',
        fingerprint: 'test-fingerprint',
        expiresAt: new Date(Date.now() - 1000), // Expiré
      }

      const token = await previewAnalysisRepository.create(data)
      const deletedCount = await previewAnalysisRepository.deleteExpired()

      expect(deletedCount).toBe(1)

      const preview = await previewAnalysisRepository.findByToken(token)
      expect(preview).toBeNull()
    })

    it('ne devrait pas supprimer les previews non expirées', async () => {
      const data = {
        ipHash: 'test-ip-hash',
        fingerprint: 'test-fingerprint',
        expiresAt: new Date(Date.now() + 86400000), // Non expiré
      }

      await previewAnalysisRepository.create(data)
      const deletedCount = await previewAnalysisRepository.deleteExpired()

      expect(deletedCount).toBe(0)
    })
  })

  describe('cleanupOldUnclaimed', () => {
    it('devrait supprimer les anciennes previews non revendiquées', async () => {
      const oldDate = new Date(Date.now() - 8 * 24 * 60 * 60 * 1000) // 8 jours
      const data = {
        ipHash: 'test-ip-hash',
        fingerprint: 'test-fingerprint',
        createdAt: oldDate,
      }

      await previewAnalysisRepository.create(data)
      const deletedCount = await previewAnalysisRepository.cleanupOldUnclaimed(7)

      expect(deletedCount).toBe(1)
    })
  })

  describe('isValidToken', () => {
    it('devrait retourner true pour un token valide', async () => {
      const data = {
        ipHash: 'test-ip-hash',
        fingerprint: 'test-fingerprint',
      }

      const token = await previewAnalysisRepository.create(data)
      const isValid = await previewAnalysisRepository.isValidToken(token)

      expect(isValid).toBe(true)
    })

    it('devrait retourner false pour un token inexistant', async () => {
      const isValid = await previewAnalysisRepository.isValidToken('non-existent')
      expect(isValid).toBe(false)
    })

    it('devrait retourner false pour un token expiré', async () => {
      const data = {
        ipHash: 'test-ip-hash',
        fingerprint: 'test-fingerprint',
        expiresAt: new Date(Date.now() - 1000),
      }

      const token = await previewAnalysisRepository.create(data)
      const isValid = await previewAnalysisRepository.isValidToken(token)

      expect(isValid).toBe(false)
    })

    it('devrait retourner false pour un token consommé', async () => {
      const data = {
        ipHash: 'test-ip-hash',
        fingerprint: 'test-fingerprint',
      }

      const token = await previewAnalysisRepository.create(data)
      await previewAnalysisRepository.markAsConsumed(token)
      const isValid = await previewAnalysisRepository.isValidToken(token)

      expect(isValid).toBe(false)
    })
  })
})
