// apps/web/src/lib/preview-analysis/previewTokenManager.ts
//
// Gestion du previewToken (sessionStorage + cookie)
// MVP-012 — Preview Analysis System

const PREVIEW_TOKEN_KEY = 'preview_token'

export class PreviewTokenManager {
  /**
   * Sauvegarder le previewToken dans sessionStorage
   */
  static setSessionToken(token: string): void {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(PREVIEW_TOKEN_KEY, token)
    }
  }

  /**
   * Récupérer le previewToken depuis sessionStorage
   */
  static getSessionToken(): string | null {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem(PREVIEW_TOKEN_KEY)
    }
    return null
  }

  /**
   * Supprimer le previewToken de sessionStorage
   */
  static clearSessionToken(): void {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(PREVIEW_TOKEN_KEY)
    }
  }

  /**
   * Vérifier si un previewToken existe
   */
  static hasToken(): boolean {
    return this.getSessionToken() !== null
  }
}
