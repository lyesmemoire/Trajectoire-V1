// apps/web/src/lib/subscription/SubscriptionResolver.test.ts
//
// Tests pour le service SubscriptionResolver
// Couvre tous les plans d'abonnement et leurs capacités

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { SubscriptionResolver } from './SubscriptionResolver'
import { SubscriptionPlan, SubscriptionStatus } from '@/types/subscription'

// Mock de Prisma
const mockPrisma = {
  user: {
    findUnique: vi.fn(),
  },
  subscription: {
    findFirst: vi.fn(),
  },
}

vi.mock('@/lib/prisma', () => ({
  prisma: mockPrisma,
}))

describe('SubscriptionResolver', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('create()', () => {
    it('devrait créer un resolver pour un utilisateur FREE', async () => {
      const userId = 'user-free-id'
      
      mockPrisma.user.findUnique.mockResolvedValue({
        plan: 'FREE',
        role: null,
      })
      mockPrisma.subscription.findFirst.mockResolvedValue(null)

      const resolver = await SubscriptionResolver.create(userId)
      
      expect(resolver).toBeInstanceOf(SubscriptionResolver)
    })

    it('devrait créer un resolver pour un utilisateur PRO', async () => {
      const userId = 'user-pro-id'
      
      mockPrisma.user.findUnique.mockResolvedValue({
        plan: 'PRO',
        role: null,
      })
      mockPrisma.subscription.findFirst.mockResolvedValue({
        status: 'ACTIVE',
        plan: 'PRO',
      })

      const resolver = await SubscriptionResolver.create(userId)
      
      expect(resolver).toBeInstanceOf(SubscriptionResolver)
    })

    it('devrait créer un resolver pour un utilisateur ADMIN', async () => {
      const userId = 'user-admin-id'
      
      mockPrisma.user.findUnique.mockResolvedValue({
        plan: 'FREE',
        role: 'ADMIN_FOUNDER',
      })
      mockPrisma.subscription.findFirst.mockResolvedValue(null)

      const resolver = await SubscriptionResolver.create(userId)
      
      expect(resolver).toBeInstanceOf(SubscriptionResolver)
    })
  })

  describe('hasPremium()', () => {
    it('devrait retourner false pour un utilisateur FREE', async () => {
      const userId = 'user-free-id'
      
      mockPrisma.user.findUnique.mockResolvedValue({
        plan: 'FREE',
        role: null,
      })
      mockPrisma.subscription.findFirst.mockResolvedValue(null)

      const resolver = await SubscriptionResolver.create(userId)
      
      expect(resolver.hasPremium()).toBe(false)
    })

    it('devrait retourner true pour un utilisateur PRO actif', async () => {
      const userId = 'user-pro-id'
      
      mockPrisma.user.findUnique.mockResolvedValue({
        plan: 'PRO',
        role: null,
      })
      mockPrisma.subscription.findFirst.mockResolvedValue({
        status: 'ACTIVE',
        plan: 'PRO',
      })

      const resolver = await SubscriptionResolver.create(userId)
      
      expect(resolver.hasPremium()).toBe(true)
    })

    it('devrait retourner true pour un utilisateur en période d\'essai', async () => {
      const userId = 'user-trial-id'
      
      mockPrisma.user.findUnique.mockResolvedValue({
        plan: 'FREE',
        role: null,
      })
      mockPrisma.subscription.findFirst.mockResolvedValue({
        status: 'TRIAL',
        plan: 'PRO',
      })

      const resolver = await SubscriptionResolver.create(userId)
      
      expect(resolver.hasPremium()).toBe(true)
    })

    it('devrait retourner true pour un utilisateur ADMIN', async () => {
      const userId = 'user-admin-id'
      
      mockPrisma.user.findUnique.mockResolvedValue({
        plan: 'FREE',
        role: 'ADMIN_FOUNDER',
      })
      mockPrisma.subscription.findFirst.mockResolvedValue(null)

      const resolver = await SubscriptionResolver.create(userId)
      
      expect(resolver.hasPremium()).toBe(true)
    })

    it('devrait retourner false pour un abonnement expiré', async () => {
      const userId = 'user-expired-id'
      
      mockPrisma.user.findUnique.mockResolvedValue({
        plan: 'PRO',
        role: null,
      })
      mockPrisma.subscription.findFirst.mockResolvedValue({
        status: 'EXPIRED',
        plan: 'PRO',
      })

      const resolver = await SubscriptionResolver.create(userId)
      
      expect(resolver.hasPremium()).toBe(false)
    })
  })

  describe('hasAdmin()', () => {
    it('devrait retourner true pour ADMIN_FOUNDER', async () => {
      const userId = 'admin-founder-id'
      
      mockPrisma.user.findUnique.mockResolvedValue({
        plan: 'FREE',
        role: 'ADMIN_FOUNDER',
      })
      mockPrisma.subscription.findFirst.mockResolvedValue(null)

      const resolver = await SubscriptionResolver.create(userId)
      
      expect(resolver.hasAdmin()).toBe(true)
    })

    it('devrait retourner true pour ADMIN_PRODUCT', async () => {
      const userId = 'admin-product-id'
      
      mockPrisma.user.findUnique.mockResolvedValue({
        plan: 'FREE',
        role: 'ADMIN_PRODUCT',
      })
      mockPrisma.subscription.findFirst.mockResolvedValue(null)

      const resolver = await SubscriptionResolver.create(userId)
      
      expect(resolver.hasAdmin()).toBe(true)
    })

    it('devrait retourner true pour ADMIN_SUPPORT', async () => {
      const userId = 'admin-support-id'
      
      mockPrisma.user.findUnique.mockResolvedValue({
        plan: 'FREE',
        role: 'ADMIN_SUPPORT',
      })
      mockPrisma.subscription.findFirst.mockResolvedValue(null)

      const resolver = await SubscriptionResolver.create(userId)
      
      expect(resolver.hasAdmin()).toBe(true)
    })

    it('devrait retourner false pour un utilisateur normal', async () => {
      const userId = 'user-normal-id'
      
      mockPrisma.user.findUnique.mockResolvedValue({
        plan: 'FREE',
        role: null,
      })
      mockPrisma.subscription.findFirst.mockResolvedValue(null)

      const resolver = await SubscriptionResolver.create(userId)
      
      expect(resolver.hasAdmin()).toBe(false)
    })
  })

  describe('canExport()', () => {
    it('devrait retourner false pour FREE', async () => {
      const userId = 'user-free-id'
      
      mockPrisma.user.findUnique.mockResolvedValue({
        plan: 'FREE',
        role: null,
      })
      mockPrisma.subscription.findFirst.mockResolvedValue(null)

      const resolver = await SubscriptionResolver.create(userId)
      
      expect(resolver.canExport()).toBe(false)
    })

    it('devrait retourner true pour PRO', async () => {
      const userId = 'user-pro-id'
      
      mockPrisma.user.findUnique.mockResolvedValue({
        plan: 'PRO',
        role: null,
      })
      mockPrisma.subscription.findFirst.mockResolvedValue({
        status: 'ACTIVE',
        plan: 'PRO',
      })

      const resolver = await SubscriptionResolver.create(userId)
      
      expect(resolver.canExport()).toBe(true)
    })

    it('devrait retourner true pour TEAM', async () => {
      const userId = 'user-team-id'
      
      mockPrisma.user.findUnique.mockResolvedValue({
        plan: 'TEAM',
        role: null,
      })
      mockPrisma.subscription.findFirst.mockResolvedValue({
        status: 'ACTIVE',
        plan: 'TEAM',
      })

      const resolver = await SubscriptionResolver.create(userId)
      
      expect(resolver.canExport()).toBe(true)
    })

    it('devrait retourner true pour ENTERPRISE', async () => {
      const userId = 'user-enterprise-id'
      
      mockPrisma.user.findUnique.mockResolvedValue({
        plan: 'ENTERPRISE',
        role: null,
      })
      mockPrisma.subscription.findFirst.mockResolvedValue({
        status: 'ACTIVE',
        plan: 'ENTERPRISE',
      })

      const resolver = await SubscriptionResolver.create(userId)
      
      expect(resolver.canExport()).toBe(true)
    })

    it('devrait retourner true pour ADMIN', async () => {
      const userId = 'admin-id'
      
      mockPrisma.user.findUnique.mockResolvedValue({
        plan: 'FREE',
        role: 'ADMIN_FOUNDER',
      })
      mockPrisma.subscription.findFirst.mockResolvedValue(null)

      const resolver = await SubscriptionResolver.create(userId)
      
      expect(resolver.canExport()).toBe(true)
    })
  })

  describe('canUseCopilot()', () => {
    it('devrait retourner true pour tous les utilisateurs authentifiés', async () => {
      const userId = 'user-id'
      
      mockPrisma.user.findUnique.mockResolvedValue({
        plan: 'FREE',
        role: null,
      })
      mockPrisma.subscription.findFirst.mockResolvedValue(null)

      const resolver = await SubscriptionResolver.create(userId)
      
      expect(resolver.canUseCopilot()).toBe(true)
    })
  })

  describe('canRunUnlimitedSimulation()', () => {
    it('devrait retourner false pour FREE', async () => {
      const userId = 'user-free-id'
      
      mockPrisma.user.findUnique.mockResolvedValue({
        plan: 'FREE',
        role: null,
      })
      mockPrisma.subscription.findFirst.mockResolvedValue(null)

      const resolver = await SubscriptionResolver.create(userId)
      
      expect(resolver.canRunUnlimitedSimulation()).toBe(false)
    })

    it('devrait retourner false pour PRO', async () => {
      const userId = 'user-pro-id'
      
      mockPrisma.user.findUnique.mockResolvedValue({
        plan: 'PRO',
        role: null,
      })
      mockPrisma.subscription.findFirst.mockResolvedValue({
        status: 'ACTIVE',
        plan: 'PRO',
      })

      const resolver = await SubscriptionResolver.create(userId)
      
      expect(resolver.canRunUnlimitedSimulation()).toBe(false)
    })

    it('devrait retourner true pour TEAM', async () => {
      const userId = 'user-team-id'
      
      mockPrisma.user.findUnique.mockResolvedValue({
        plan: 'TEAM',
        role: null,
      })
      mockPrisma.subscription.findFirst.mockResolvedValue({
        status: 'ACTIVE',
        plan: 'TEAM',
      })

      const resolver = await SubscriptionResolver.create(userId)
      
      expect(resolver.canRunUnlimitedSimulation()).toBe(true)
    })

    it('devrait retourner true pour ENTERPRISE', async () => {
      const userId = 'user-enterprise-id'
      
      mockPrisma.user.findUnique.mockResolvedValue({
        plan: 'ENTERPRISE',
        role: null,
      })
      mockPrisma.subscription.findFirst.mockResolvedValue({
        status: 'ACTIVE',
        plan: 'ENTERPRISE',
      })

      const resolver = await SubscriptionResolver.create(userId)
      
      expect(resolver.canRunUnlimitedSimulation()).toBe(true)
    })

    it('devrait retourner true pour ADMIN', async () => {
      const userId = 'admin-id'
      
      mockPrisma.user.findUnique.mockResolvedValue({
        plan: 'FREE',
        role: 'ADMIN_FOUNDER',
      })
      mockPrisma.subscription.findFirst.mockResolvedValue(null)

      const resolver = await SubscriptionResolver.create(userId)
      
      expect(resolver.canRunUnlimitedSimulation()).toBe(true)
    })
  })

  describe('hasUnlimitedHistory()', () => {
    it('devrait retourner false pour FREE', async () => {
      const userId = 'user-free-id'
      
      mockPrisma.user.findUnique.mockResolvedValue({
        plan: 'FREE',
        role: null,
      })
      mockPrisma.subscription.findFirst.mockResolvedValue(null)

      const resolver = await SubscriptionResolver.create(userId)
      
      expect(resolver.hasUnlimitedHistory()).toBe(false)
    })

    it('devrait retourner true pour PRO', async () => {
      const userId = 'user-pro-id'
      
      mockPrisma.user.findUnique.mockResolvedValue({
        plan: 'PRO',
        role: null,
      })
      mockPrisma.subscription.findFirst.mockResolvedValue({
        status: 'ACTIVE',
        plan: 'PRO',
      })

      const resolver = await SubscriptionResolver.create(userId)
      
      expect(resolver.hasUnlimitedHistory()).toBe(true)
    })
  })

  describe('hasAdvancedReports()', () => {
    it('devrait retourner false pour FREE', async () => {
      const userId = 'user-free-id'
      
      mockPrisma.user.findUnique.mockResolvedValue({
        plan: 'FREE',
        role: null,
      })
      mockPrisma.subscription.findFirst.mockResolvedValue(null)

      const resolver = await SubscriptionResolver.create(userId)
      
      expect(resolver.hasAdvancedReports()).toBe(false)
    })

    it('devrait retourner true pour PRO', async () => {
      const userId = 'user-pro-id'
      
      mockPrisma.user.findUnique.mockResolvedValue({
        plan: 'PRO',
        role: null,
      })
      mockPrisma.subscription.findFirst.mockResolvedValue({
        status: 'ACTIVE',
        plan: 'PRO',
      })

      const resolver = await SubscriptionResolver.create(userId)
      
      expect(resolver.hasAdvancedReports()).toBe(true)
    })
  })

  describe('hasAdvancedAPI()', () => {
    it('devrait retourner false pour FREE', async () => {
      const userId = 'user-free-id'
      
      mockPrisma.user.findUnique.mockResolvedValue({
        plan: 'FREE',
        role: null,
      })
      mockPrisma.subscription.findFirst.mockResolvedValue(null)

      const resolver = await SubscriptionResolver.create(userId)
      
      expect(resolver.hasAdvancedAPI()).toBe(false)
    })

    it('devrait retourner false pour PRO', async () => {
      const userId = 'user-pro-id'
      
      mockPrisma.user.findUnique.mockResolvedValue({
        plan: 'PRO',
        role: null,
      })
      mockPrisma.subscription.findFirst.mockResolvedValue({
        status: 'ACTIVE',
        plan: 'PRO',
      })

      const resolver = await SubscriptionResolver.create(userId)
      
      expect(resolver.hasAdvancedAPI()).toBe(false)
    })

    it('devrait retourner true pour TEAM', async () => {
      const userId = 'user-team-id'
      
      mockPrisma.user.findUnique.mockResolvedValue({
        plan: 'TEAM',
        role: null,
      })
      mockPrisma.subscription.findFirst.mockResolvedValue({
        status: 'ACTIVE',
        plan: 'TEAM',
      })

      const resolver = await SubscriptionResolver.create(userId)
      
      expect(resolver.hasAdvancedAPI()).toBe(true)
    })

    it('devrait retourner true pour ENTERPRISE', async () => {
      const userId = 'user-enterprise-id'
      
      mockPrisma.user.findUnique.mockResolvedValue({
        plan: 'ENTERPRISE',
        role: null,
      })
      mockPrisma.subscription.findFirst.mockResolvedValue({
        status: 'ACTIVE',
        plan: 'ENTERPRISE',
      })

      const resolver = await SubscriptionResolver.create(userId)
      
      expect(resolver.hasAdvancedAPI()).toBe(true)
    })
  })

  describe('canAccess()', () => {
    it('devrait autoriser l\'accès PUBLIC pour tous', async () => {
      const userId = 'user-id'
      
      mockPrisma.user.findUnique.mockResolvedValue({
        plan: 'FREE',
        role: null,
      })
      mockPrisma.subscription.findFirst.mockResolvedValue(null)

      const resolver = await SubscriptionResolver.create(userId)
      const resolution = resolver.canAccess('PUBLIC')
      
      expect(resolution.allowed).toBe(true)
      expect(resolution.requiredLevel).toBe('PUBLIC')
    })

    it('devrait autoriser l\'accès AUTHENTICATED pour tous les utilisateurs', async () => {
      const userId = 'user-id'
      
      mockPrisma.user.findUnique.mockResolvedValue({
        plan: 'FREE',
        role: null,
      })
      mockPrisma.subscription.findFirst.mockResolvedValue(null)

      const resolver = await SubscriptionResolver.create(userId)
      const resolution = resolver.canAccess('AUTHENTICATED')
      
      expect(resolution.allowed).toBe(true)
      expect(resolution.requiredLevel).toBe('AUTHENTICATED')
    })

    it('devrait refuser l\'accès PREMIUM pour FREE', async () => {
      const userId = 'user-free-id'
      
      mockPrisma.user.findUnique.mockResolvedValue({
        plan: 'FREE',
        role: null,
      })
      mockPrisma.subscription.findFirst.mockResolvedValue(null)

      const resolver = await SubscriptionResolver.create(userId)
      const resolution = resolver.canAccess('PREMIUM')
      
      expect(resolution.allowed).toBe(false)
      expect(resolution.reason).toBe('Premium subscription required')
      expect(resolution.requiredLevel).toBe('PREMIUM')
    })

    it('devrait autoriser l\'accès PREMIUM pour PRO', async () => {
      const userId = 'user-pro-id'
      
      mockPrisma.user.findUnique.mockResolvedValue({
        plan: 'PRO',
        role: null,
      })
      mockPrisma.subscription.findFirst.mockResolvedValue({
        status: 'ACTIVE',
        plan: 'PRO',
      })

      const resolver = await SubscriptionResolver.create(userId)
      const resolution = resolver.canAccess('PREMIUM')
      
      expect(resolution.allowed).toBe(true)
      expect(resolution.requiredLevel).toBe('PREMIUM')
    })

    it('devrait refuser l\'accès ADMIN pour un utilisateur normal', async () => {
      const userId = 'user-normal-id'
      
      mockPrisma.user.findUnique.mockResolvedValue({
        plan: 'FREE',
        role: null,
      })
      mockPrisma.subscription.findFirst.mockResolvedValue(null)

      const resolver = await SubscriptionResolver.create(userId)
      const resolution = resolver.canAccess('ADMIN')
      
      expect(resolution.allowed).toBe(false)
      expect(resolution.reason).toBe('Admin role required')
      expect(resolution.requiredLevel).toBe('ADMIN')
    })

    it('devrait autoriser l\'accès ADMIN pour ADMIN_FOUNDER', async () => {
      const userId = 'admin-id'
      
      mockPrisma.user.findUnique.mockResolvedValue({
        plan: 'FREE',
        role: 'ADMIN_FOUNDER',
      })
      mockPrisma.subscription.findFirst.mockResolvedValue(null)

      const resolver = await SubscriptionResolver.create(userId)
      const resolution = resolver.canAccess('ADMIN')
      
      expect(resolution.allowed).toBe(true)
      expect(resolution.requiredLevel).toBe('ADMIN')
    })
  })

  describe('getCapabilities()', () => {
    it('devrait retourner toutes les capacités pour FREE', async () => {
      const userId = 'user-free-id'
      
      mockPrisma.user.findUnique.mockResolvedValue({
        plan: 'FREE',
        role: null,
      })
      mockPrisma.subscription.findFirst.mockResolvedValue(null)

      const resolver = await SubscriptionResolver.create(userId)
      const capabilities = resolver.getCapabilities()
      
      expect(capabilities.hasPremium).toBe(false)
      expect(capabilities.hasAdmin).toBe(false)
      expect(capabilities.canExport).toBe(false)
      expect(capabilities.canUseCopilot).toBe(true)
      expect(capabilities.canRunUnlimitedSimulation).toBe(false)
      expect(capabilities.hasUnlimitedHistory).toBe(false)
      expect(capabilities.hasAdvancedReports).toBe(false)
      expect(capabilities.hasAdvancedAPI).toBe(false)
    })

    it('devrait retourner toutes les capacités pour PRO', async () => {
      const userId = 'user-pro-id'
      
      mockPrisma.user.findUnique.mockResolvedValue({
        plan: 'PRO',
        role: null,
      })
      mockPrisma.subscription.findFirst.mockResolvedValue({
        status: 'ACTIVE',
        plan: 'PRO',
      })

      const resolver = await SubscriptionResolver.create(userId)
      const capabilities = resolver.getCapabilities()
      
      expect(capabilities.hasPremium).toBe(true)
      expect(capabilities.hasAdmin).toBe(false)
      expect(capabilities.canExport).toBe(true)
      expect(capabilities.canUseCopilot).toBe(true)
      expect(capabilities.canRunUnlimitedSimulation).toBe(false)
      expect(capabilities.hasUnlimitedHistory).toBe(true)
      expect(capabilities.hasAdvancedReports).toBe(true)
      expect(capabilities.hasAdvancedAPI).toBe(false)
    })

    it('devrait retourner toutes les capacités pour TEAM', async () => {
      const userId = 'user-team-id'
      
      mockPrisma.user.findUnique.mockResolvedValue({
        plan: 'TEAM',
        role: null,
      })
      mockPrisma.subscription.findFirst.mockResolvedValue({
        status: 'ACTIVE',
        plan: 'TEAM',
      })

      const resolver = await SubscriptionResolver.create(userId)
      const capabilities = resolver.getCapabilities()
      
      expect(capabilities.hasPremium).toBe(true)
      expect(capabilities.hasAdmin).toBe(false)
      expect(capabilities.canExport).toBe(true)
      expect(capabilities.canUseCopilot).toBe(true)
      expect(capabilities.canRunUnlimitedSimulation).toBe(true)
      expect(capabilities.hasUnlimitedHistory).toBe(true)
      expect(capabilities.hasAdvancedReports).toBe(true)
      expect(capabilities.hasAdvancedAPI).toBe(true)
    })

    it('devrait retourner toutes les capacités pour ENTERPRISE', async () => {
      const userId = 'user-enterprise-id'
      
      mockPrisma.user.findUnique.mockResolvedValue({
        plan: 'ENTERPRISE',
        role: null,
      })
      mockPrisma.subscription.findFirst.mockResolvedValue({
        status: 'ACTIVE',
        plan: 'ENTERPRISE',
      })

      const resolver = await SubscriptionResolver.create(userId)
      const capabilities = resolver.getCapabilities()
      
      expect(capabilities.hasPremium).toBe(true)
      expect(capabilities.hasAdmin).toBe(false)
      expect(capabilities.canExport).toBe(true)
      expect(capabilities.canUseCopilot).toBe(true)
      expect(capabilities.canRunUnlimitedSimulation).toBe(true)
      expect(capabilities.hasUnlimitedHistory).toBe(true)
      expect(capabilities.hasAdvancedReports).toBe(true)
      expect(capabilities.hasAdvancedAPI).toBe(true)
    })

    it('devrait retourner toutes les capacités pour ADMIN', async () => {
      const userId = 'admin-id'
      
      mockPrisma.user.findUnique.mockResolvedValue({
        plan: 'FREE',
        role: 'ADMIN_FOUNDER',
      })
      mockPrisma.subscription.findFirst.mockResolvedValue(null)

      const resolver = await SubscriptionResolver.create(userId)
      const capabilities = resolver.getCapabilities()
      
      expect(capabilities.hasPremium).toBe(true)
      expect(capabilities.hasAdmin).toBe(true)
      expect(capabilities.canExport).toBe(true)
      expect(capabilities.canUseCopilot).toBe(true)
      expect(capabilities.canRunUnlimitedSimulation).toBe(true)
      expect(capabilities.hasUnlimitedHistory).toBe(true)
      expect(capabilities.hasAdvancedReports).toBe(true)
      expect(capabilities.hasAdvancedAPI).toBe(true)
    })
  })
})
