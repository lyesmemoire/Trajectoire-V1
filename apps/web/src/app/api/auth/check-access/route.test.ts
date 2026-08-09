// apps/web/src/app/api/auth/check-access/route.test.ts
//
// Tests pour l'endpoint /api/auth/check-access
// Couvre les scénarios : nouvel utilisateur, utilisateur existant, admin, premium

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { GET } from './route'
import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'

// Mock des dépendances
const mockPrisma = {
  user: {
    findUnique: vi.fn(),
    create: vi.fn(),
  },
  subscription: {
    findFirst: vi.fn(),
  },
}

vi.mock('@/lib/prisma', () => ({
  prisma: mockPrisma,
}))

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(() => ({
    auth: {
      getUser: vi.fn(),
    },
  })),
}))

vi.mock('@/lib/logger', () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn(),
  },
}))

describe('GET /api/auth/check-access', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Accès non autorisé', () => {
    it('devrait retourner 403 si x-internal-request header est absent', async () => {
      const request = new NextRequest('http://localhost:3000/api/auth/check-access')
      const response = await GET(request)
      
      expect(response.status).toBe(403)
      const data = await response.json()
      expect(data).toEqual({ error: 'Accès non autorisé' })
    })

    it('devrait retourner 403 si x-internal-request header est incorrect', async () => {
      const request = new NextRequest('http://localhost:3000/api/auth/check-access', {
        headers: { 'x-internal-request': 'not-middleware' },
      })
      const response = await GET(request)
      
      expect(response.status).toBe(403)
      const data = await response.json()
      expect(data).toEqual({ error: 'Accès non autorisé' })
    })
  })

  describe('Utilisateur non authentifié', () => {
    it('devrait retourner PUBLIC pour utilisateur non connecté', async () => {
      const { createClient } = await import('@/lib/supabase/server')
      vi.mocked(createClient).mockReturnValue({
        auth: {
          getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: new Error('Not authenticated') }),
        },
      } as any)

      const request = new NextRequest('http://localhost:3000/api/auth/check-access', {
        headers: { 'x-internal-request': 'middleware' },
      })
      const response = await GET(request)
      
      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data).toEqual({
        authenticated: false,
        accessLevel: 'PUBLIC',
        subscription: {
          hasAccess: false,
          status: 'none',
          plan: null,
        },
        role: null,
      })
    })
  })

  describe('Nouvel utilisateur (profil absent)', () => {
    it('devrait créer automatiquement le profil utilisateur', async () => {
      const mockUserId = 'new-user-id'
      const mockEmail = 'new@example.com'

      mockPrisma.user.findUnique.mockResolvedValue(null)
      mockPrisma.user.create.mockResolvedValue({
        id: mockUserId,
        email: mockEmail,
        name: null,
        plan: 'FREE',
        role: null,
        referralCode: 'ABC12345',
      } as any)
      mockPrisma.subscription.findFirst.mockResolvedValue(null)

      const request = new NextRequest('http://localhost:3000/api/auth/check-access', {
        headers: { 
          'x-internal-request': 'middleware',
          'x-user-id': mockUserId,
        },
      })
      const response = await GET(request)
      
      expect(response.status).toBe(200)
      expect(mockPrisma.user.create).toHaveBeenCalledWith({
        data: {
          id: mockUserId,
          email: '',
          name: null,
          plan: 'FREE',
          referralCode: expect.any(String),
        },
        select: {
          id: true,
          email: true,
          name: true,
          plan: true,
          role: true,
          referralCode: true,
        },
      })

      const data = await response.json()
      expect(data.authenticated).toBe(true)
      expect(data.accessLevel).toBe('AUTHENTICATED')
      expect(data.subscription.plan).toBe('FREE')
    })

    it('devrait assigner le plan FREE par défaut', async () => {
      const mockUserId = 'new-user-id'
      
      mockPrisma.user.findUnique.mockResolvedValue(null)
      mockPrisma.user.create.mockResolvedValue({
        id: mockUserId,
        email: '',
        name: null,
        plan: 'FREE',
        role: null,
        referralCode: 'ABC12345',
      } as any)
      mockPrisma.subscription.findFirst.mockResolvedValue(null)

      const request = new NextRequest('http://localhost:3000/api/auth/check-access', {
        headers: { 
          'x-internal-request': 'middleware',
          'x-user-id': mockUserId,
        },
      })
      const response = await GET(request)
      
      const data = await response.json()
      expect(data.subscription.plan).toBe('FREE')
      expect(data.subscription.hasAccess).toBe(false)
    })
  })

  describe('Utilisateur existant (plan FREE)', () => {
    it('devrait retourner AUTHENTICATED pour utilisateur FREE', async () => {
      const mockUserId = 'existing-user-id'
      
      mockPrisma.user.findUnique.mockResolvedValue({
        id: mockUserId,
        email: 'user@example.com',
        name: 'John Doe',
        plan: 'FREE',
        role: null,
        referralCode: 'ABC12345',
      } as any)
      mockPrisma.subscription.findFirst.mockResolvedValue(null)

      const request = new NextRequest('http://localhost:3000/api/auth/check-access', {
        headers: { 
          'x-internal-request': 'middleware',
          'x-user-id': mockUserId,
        },
      })
      const response = await GET(request)
      
      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.authenticated).toBe(true)
      expect(data.accessLevel).toBe('AUTHENTICATED')
      expect(data.subscription.hasAccess).toBe(false)
      expect(data.subscription.plan).toBe('FREE')
    })
  })

  describe('Utilisateur PREMIUM', () => {
    it('devrait retourner PREMIUM pour utilisateur avec abonnement actif', async () => {
      const mockUserId = 'premium-user-id'
      
      mockPrisma.user.findUnique.mockResolvedValue({
        id: mockUserId,
        email: 'premium@example.com',
        name: 'Premium User',
        plan: 'PREMIUM',
        role: null,
        referralCode: 'ABC12345',
      } as any)
      mockPrisma.subscription.findFirst.mockResolvedValue({
        status: 'active',
        plan: 'PREMIUM',
      } as any)

      const request = new NextRequest('http://localhost:3000/api/auth/check-access', {
        headers: { 
          'x-internal-request': 'middleware',
          'x-user-id': mockUserId,
        },
      })
      const response = await GET(request)
      
      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.authenticated).toBe(true)
      expect(data.accessLevel).toBe('PREMIUM')
      expect(data.subscription.hasAccess).toBe(true)
      expect(data.subscription.plan).toBe('PREMIUM')
    })

    it('devrait retourner PREMIUM pour utilisateur en période d\'essai', async () => {
      const mockUserId = 'trial-user-id'
      
      mockPrisma.user.findUnique.mockResolvedValue({
        id: mockUserId,
        email: 'trial@example.com',
        name: 'Trial User',
        plan: 'FREE',
        role: null,
        referralCode: 'ABC12345',
      } as any)
      mockPrisma.subscription.findFirst.mockResolvedValue({
        status: 'trialing',
        plan: 'PREMIUM',
      } as any)

      const request = new NextRequest('http://localhost:3000/api/auth/check-access', {
        headers: { 
          'x-internal-request': 'middleware',
          'x-user-id': mockUserId,
        },
      })
      const response = await GET(request)
      
      const data = await response.json()
      expect(data.accessLevel).toBe('PREMIUM')
      expect(data.subscription.hasAccess).toBe(true)
    })
  })

  describe('Utilisateur ADMIN', () => {
    it('devrait retourner ADMIN pour utilisateur avec rôle ADMIN_FOUNDER', async () => {
      const mockUserId = 'admin-user-id'
      
      mockPrisma.user.findUnique.mockResolvedValue({
        id: mockUserId,
        email: 'admin@example.com',
        name: 'Admin User',
        plan: 'FREE',
        role: 'ADMIN_FOUNDER',
        referralCode: 'ABC12345',
      } as any)
      mockPrisma.subscription.findFirst.mockResolvedValue(null)

      const request = new NextRequest('http://localhost:3000/api/auth/check-access', {
        headers: { 
          'x-internal-request': 'middleware',
          'x-user-id': mockUserId,
        },
      })
      const response = await GET(request)
      
      const data = await response.json()
      expect(data.authenticated).toBe(true)
      expect(data.accessLevel).toBe('ADMIN')
      expect(data.role).toBe('ADMIN_FOUNDER')
      expect(data.subscription.hasAccess).toBe(true)
    })

    it('devrait retourner ADMIN pour utilisateur avec rôle ADMIN_PRODUCT', async () => {
      const mockUserId = 'admin-product-id'
      
      mockPrisma.user.findUnique.mockResolvedValue({
        id: mockUserId,
        email: 'admin-product@example.com',
        name: 'Admin Product',
        plan: 'FREE',
        role: 'ADMIN_PRODUCT',
        referralCode: 'ABC12345',
      } as any)
      mockPrisma.subscription.findFirst.mockResolvedValue(null)

      const request = new NextRequest('http://localhost:3000/api/auth/check-access', {
        headers: { 
          'x-internal-request': 'middleware',
          'x-user-id': mockUserId,
        },
      })
      const response = await GET(request)
      
      const data = await response.json()
      expect(data.accessLevel).toBe('ADMIN')
      expect(data.role).toBe('ADMIN_PRODUCT')
    })

    it('devrait retourner ADMIN pour utilisateur avec rôle ADMIN_SUPPORT', async () => {
      const mockUserId = 'admin-support-id'
      
      mockPrisma.user.findUnique.mockResolvedValue({
        id: mockUserId,
        email: 'admin-support@example.com',
        name: 'Admin Support',
        plan: 'FREE',
        role: 'ADMIN_SUPPORT',
        referralCode: 'ABC12345',
      } as any)
      mockPrisma.subscription.findFirst.mockResolvedValue(null)

      const request = new NextRequest('http://localhost:3000/api/auth/check-access', {
        headers: { 
          'x-internal-request': 'middleware',
          'x-user-id': mockUserId,
        },
      })
      const response = await GET(request)
      
      const data = await response.json()
      expect(data.accessLevel).toBe('ADMIN')
      expect(data.role).toBe('ADMIN_SUPPORT')
    })
  })

  describe('Gestion des erreurs', () => {
    it('devrait retourner une réponse par défaut en cas d\'erreur BDD (fail-open)', async () => {
      const mockUserId = 'error-user-id'
      
      mockPrisma.user.findUnique.mockRejectedValue(new Error('Database error'))

      const request = new NextRequest('http://localhost:3000/api/auth/check-access', {
        headers: { 
          'x-internal-request': 'middleware',
          'x-user-id': mockUserId,
        },
      })
      const response = await GET(request)
      
      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.authenticated).toBe(true)
      expect(data.accessLevel).toBe('AUTHENTICATED')
      expect(data.subscription.hasAccess).toBe(false)
      expect(data.subscription.plan).toBe('FREE')
    })

    it('devrait logger l\'erreur en cas d\'échec', async () => {
      const mockUserId = 'error-user-id'
      const { logger } = await import('@/lib/logger')
      
      mockPrisma.user.findUnique.mockRejectedValue(new Error('Database error'))

      const request = new NextRequest('http://localhost:3000/api/auth/check-access', {
        headers: { 
          'x-internal-request': 'middleware',
          'x-user-id': mockUserId,
        },
      })
      await GET(request)
      
      expect(logger.error).toHaveBeenCalled()
    })
  })

  describe('Structure de la réponse', () => {
    it('devrait toujours retourner les champs requis', async () => {
      const mockUserId = 'test-user-id'
      
      mockPrisma.user.findUnique.mockResolvedValue({
        id: mockUserId,
        email: 'test@example.com',
        name: 'Test User',
        plan: 'FREE',
        role: null,
        referralCode: 'ABC12345',
      } as any)
      mockPrisma.subscription.findFirst.mockResolvedValue(null)

      const request = new NextRequest('http://localhost:3000/api/auth/check-access', {
        headers: { 
          'x-internal-request': 'middleware',
          'x-user-id': mockUserId,
        },
      })
      const response = await GET(request)
      
      const data = await response.json()
      
      // Vérifier que tous les champs sont présents
      expect(data).toHaveProperty('authenticated')
      expect(data).toHaveProperty('accessLevel')
      expect(data).toHaveProperty('subscription')
      expect(data).toHaveProperty('role')
      
      // Vérifier la structure de subscription
      expect(data.subscription).toHaveProperty('hasAccess')
      expect(data.subscription).toHaveProperty('status')
      expect(data.subscription).toHaveProperty('plan')
    })

    it('devrait avoir des types corrects pour chaque champ', async () => {
      const mockUserId = 'test-user-id'
      
      mockPrisma.user.findUnique.mockResolvedValue({
        id: mockUserId,
        email: 'test@example.com',
        name: 'Test User',
        plan: 'FREE',
        role: null,
        referralCode: 'ABC12345',
      } as any)
      mockPrisma.subscription.findFirst.mockResolvedValue(null)

      const request = new NextRequest('http://localhost:3000/api/auth/check-access', {
        headers: { 
          'x-internal-request': 'middleware',
          'x-user-id': mockUserId,
        },
      })
      const response = await GET(request)
      
      const data = await response.json()
      
      expect(typeof data.authenticated).toBe('boolean')
      expect(typeof data.accessLevel).toBe('string')
      expect(typeof data.subscription.hasAccess).toBe('boolean')
      expect(typeof data.subscription.status).toBe('string')
      expect(['PUBLIC', 'AUTHENTICATED', 'PREMIUM', 'ADMIN']).toContain(data.accessLevel)
    })
  })
})
