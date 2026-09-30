// apps/web/src/hooks/usePreviewStorage.ts
//
// Hook React pour la gestion du stockage temporaire des analyses preview
// MVP-007 — ATS Preview Persistence

'use client'

import { useState, useCallback, useEffect } from 'react'
import { PreviewAnalysis, ClaimPreviewResponse } from '@/types/preview'

const STORAGE_KEY = 'preview_token'

/**
 * Hook React pour la gestion du stockage temporaire des analyses preview
 * Gère la sauvegarde, récupération et claim des previews
 */
export function usePreviewStorage() {
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Charger le token depuis le storage au montage
  useEffect(() => {
    const storedToken = sessionStorage.getItem(STORAGE_KEY)
    if (storedToken) {
      setToken(storedToken)
    }
  }, [])

  /**
   * Récupère une analyse preview par son token
   * 
   * @param previewToken - Token de l'analyse (optionnel, utilise le token stocké si non fourni)
   * @returns Analyse preview ou null
   */
  const getPreview = useCallback(async (previewToken?: string): Promise<PreviewAnalysis | null> => {
    const tokenToUse = previewToken || token

    if (!tokenToUse) {
      setError('Aucun token disponible')
      return null
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/public/preview/${tokenToUse}`)

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Erreur lors de la récupération')
      }

      const preview: PreviewAnalysis = await response.json()
      return preview
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue'
      setError(errorMessage)
      return null
    } finally {
      setLoading(false)
    }
  }, [token])

  /**
   * Claim une analyse preview et la transfère vers le compte utilisateur
   * 
   * @param previewToken - Token de l'analyse (optionnel, utilise le token stocké si non fourni)
   * @returns Réponse du claim
   */
  const claimPreview = useCallback(async (previewToken?: string): Promise<ClaimPreviewResponse | null> => {
    const tokenToUse = previewToken || token

    if (!tokenToUse) {
      setError('Aucun token disponible')
      return null
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/public/preview/claim', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: tokenToUse }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Erreur lors du claim')
      }

      const result: ClaimPreviewResponse = await response.json()

      // Supprimer le token du storage après un claim réussi
      if (result.success) {
        sessionStorage.removeItem(STORAGE_KEY)
        setToken(null)
      }

      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue'
      setError(errorMessage)
      return null
    } finally {
      setLoading(false)
    }
  }, [token])

  /**
   * Supprime le token du storage
   */
  const clearToken = useCallback(() => {
    sessionStorage.removeItem(STORAGE_KEY)
    setToken(null)
    setError(null)
  }, [])

  /**
   * Vérifie si un token est disponible
   */
  const hasToken = useCallback(() => {
    return !!token
  }, [token])

  return {
    token,
    loading,
    error,
    getPreview,
    claimPreview,
    clearToken,
    hasToken,
  }
}
