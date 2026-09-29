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
    // previewTokenManager.ts guarde ses appels avec `typeof window !== 'undefined'`
    // puis lit le global `sessionStorage` : dans l'environnement `node` de Vitest,
    // ni l'un ni l'autre n'existe, donc on stub les deux plutôt que de dépendre de jsdom.
    vi.stubGlobal('window', {})
    vi.stubGlobal('sessionStorage', mockSessionStorage)
    mockSessionStorage.clear()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
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
