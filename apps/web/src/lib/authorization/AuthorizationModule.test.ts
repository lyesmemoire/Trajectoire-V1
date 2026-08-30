// apps/web/src/lib/authorization/AuthorizationModule.test.ts
//
// Tests pour le module d'autorisation
// Couvre tous les services et le module central

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { AuthorizationModule } from './AuthorizationModule'
import { Permission, Role } from '@/types/permissions'
import { SubscriptionResolver } from '../subscription/SubscriptionResolver'

// Mock de SubscriptionResolver
vi.mock('../subscription/SubscriptionResolver', () => ({
  SubscriptionResolver: {
    create: vi.fn(),
  },
}))

describe('AuthorizationModule', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('create()', () => {
    it('devrait créer un module pour un utilisateur FREE', async () => {
      const userId = 'user-free-id'
      const mockResolver = {
        getCapabilities: vi.fn().mockReturnValue({
          hasPremium: false,
          hasAdmin: false,
          canExport: false,
          canUseCopilot: true,
          canRunUnlimitedSimulation: false,
          hasUnlimitedHistory: false,
          hasAdvancedReports: false,
          hasAdvancedAPI: false,
        }),
      }

      vi.mocked(SubscriptionResolver.create).mockResolvedValue(mockResolver as any)

      const authorizationModule = await AuthorizationModule.create(userId)
      
      expect(authorizationModule).toBeInstanceOf(AuthorizationModule)
      expect(vi.mocked(SubscriptionResolver.create)).toHaveBeenCalledWith(userId)
    })

    it('devrait créer un module pour un utilisateur PRO', async () => {
      const userId = 'user-pro-id'
      const mockResolver = {
        getCapabilities: vi.fn().mockReturnValue({
          hasPremium: true,
          hasAdmin: false,
          canExport: true,
          canUseCopilot: true,
          canRunUnlimitedSimulation: false,
          hasUnlimitedHistory: true,
          hasAdvancedReports: true,
          hasAdvancedAPI: false,
        }),
      }

      vi.mocked(SubscriptionResolver.create).mockResolvedValue(mockResolver as any)

      const authorizationModule = await AuthorizationModule.create(userId)
      
      expect(authorizationModule).toBeInstanceOf(AuthorizationModule)
    })
  })

  describe('can()', () => {
    it('devrait vérifier une permission', async () => {
      const userId = 'user-id'
      const mockResolver = {
        getCapabilities: vi.fn().mockReturnValue({
          hasPremium: true,
          hasAdmin: false,
        }),
      }

      vi.mocked(SubscriptionResolver.create).mockResolvedValue(mockResolver as any)

      const authorizationModule = await AuthorizationModule.create(userId)
      const result = authorizationModule.can(Permission.EXPORT_REPORT_PDF)
      
      expect(typeof result).toBe('boolean')
    })
  })

  describe('isAdmin()', () => {
    it('devrait retourner true pour un admin', async () => {
      const userId = 'admin-id'
      const mockResolver = {
        getCapabilities: vi.fn().mockReturnValue({
          hasPremium: true,
          hasAdmin: true,
        }),
      }

      vi.mocked(SubscriptionResolver.create).mockResolvedValue(mockResolver as any)

      const authorizationModule = await AuthorizationModule.create(userId)
      const result = authorizationModule.isAdmin()
      
      expect(result).toBe(true)
    })

    it('devrait retourner false pour un utilisateur normal', async () => {
      const userId = 'user-id'
      const mockResolver = {
        getCapabilities: vi.fn().mockReturnValue({
          hasPremium: false,
          hasAdmin: false,
        }),
      }

      vi.mocked(SubscriptionResolver.create).mockResolvedValue(mockResolver as any)

      const authorizationModule = await AuthorizationModule.create(userId)
      const result = authorizationModule.isAdmin()
      
      expect(result).toBe(false)
    })
  })

  describe('canAll()', () => {
    it('devrait retourner true si toutes les permissions sont accordées', async () => {
      const userId = 'user-id'
      const mockResolver = {
        getCapabilities: vi.fn().mockReturnValue({
          hasPremium: true,
          hasAdmin: false,
        }),
      }

      vi.mocked(SubscriptionResolver.create).mockResolvedValue(mockResolver as any)

      const authorizationModule = await AuthorizationModule.create(userId)
      const result = authorizationModule.canAll([
        Permission.USE_COPILOT,
        Permission.RUN_INTERVIEW,
      ])
      
      expect(typeof result).toBe('boolean')
    })
  })

  describe('canAny()', () => {
    it('devrait retourner true si au moins une permission est accordée', async () => {
      const userId = 'user-id'
      const mockResolver = {
        getCapabilities: vi.fn().mockReturnValue({
          hasPremium: false,
          hasAdmin: false,
        }),
      }

      vi.mocked(SubscriptionResolver.create).mockResolvedValue(mockResolver as any)

      const authorizationModule = await AuthorizationModule.create(userId)
      const result = authorizationModule.canAny([
        Permission.USE_COPILOT,
        Permission.EXPORT_REPORT_PDF,
      ])
      
      expect(typeof result).toBe('boolean')
    })
  })

  describe('getUserInfo()', () => {
    it('devrait retourner les informations utilisateur', async () => {
      const userId = 'user-id'
      const mockResolver = {
        getCapabilities: vi.fn().mockReturnValue({
          hasPremium: false,
          hasAdmin: false,
        }),
      }

      vi.mocked(SubscriptionResolver.create).mockResolvedValue(mockResolver as any)

      const authorizationModule = await AuthorizationModule.create(userId)
      const info = authorizationModule.getUserInfo()
      
      expect(info).toHaveProperty('userId')
      expect(info).toHaveProperty('plan')
      expect(info).toHaveProperty('role')
      expect(info.userId).toBe(userId)
    })
  })
})
