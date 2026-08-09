// apps/web/src/lib/preview-analysis/__tests__/PreviewTokenManager.test.ts
//
// Tests unitaires pour PreviewTokenManager
// MVP-012 — Preview Analysis System

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { PreviewTokenManager } from '../previewTokenManager'

describe('PreviewTokenManager', () => {
  const mockSessionStorage = {
    setItem: vi.fn(),
    getItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  }

  beforeEach(() => {
    // Mock sessionStorage
    Object.defineProperty(window, 'sessionStorage', {
      value: mockSessionStorage,
      writable: true,
    })
    mockSessionStorage.clear()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('setSessionToken', () => {
    it('devrait sauvegarder un token dans sessionStorage', () => {
      const token = 'test-token-123'
      PreviewTokenManager.setSessionToken(token)
      
      expect(mockSessionStorage.setItem).toHaveBeenCalledWith('preview_token', token)
    })
  })

  describe('getSessionToken', () => {
    it('devrait récupérer un token depuis sessionStorage', () => {
      const token = 'test-token-456'
      mockSessionStorage.getItem.mockReturnValue(token)
      
      const retrievedToken = PreviewTokenManager.getSessionToken()
      
      expect(retrievedToken).toBe(token)
      expect(mockSessionStorage.getItem).toHaveBeenCalledWith('preview_token')
    })

    it('devrait retourner null si aucun token', () => {
      mockSessionStorage.getItem.mockReturnValue(null)
      
      const retrievedToken = PreviewTokenManager.getSessionToken()
      
      expect(retrievedToken).toBeNull()
    })
  })

  describe('clearSessionToken', () => {
    it('devrait supprimer le token de sessionStorage', () => {
      PreviewTokenManager.clearSessionToken()
      
      expect(mockSessionStorage.removeItem).toHaveBeenCalledWith('preview_token')
    })
  })

  describe('hasToken', () => {
    it('devrait retourner true si un token existe', () => {
      mockSessionStorage.getItem.mockReturnValue('existing-token')
      
      const hasToken = PreviewTokenManager.hasToken()
      
      expect(hasToken).toBe(true)
    })

    it('devrait retourner false si aucun token', () => {
      mockSessionStorage.getItem.mockReturnValue(null)
      
      const hasToken = PreviewTokenManager.hasToken()
      
      expect(hasToken).toBe(false)
    })
  })
})
