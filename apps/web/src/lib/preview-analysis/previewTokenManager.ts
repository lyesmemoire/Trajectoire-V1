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
   * Pose le cookie lu par /api/auth/callback pour rattacher l'aperçu au compte
   * une fois la session créée. Nécessaire quand l'inscription exige une
   * confirmation d'e-mail : le lien s'ouvre souvent dans un autre onglet, où le
   * sessionStorage est perdu.
   */
  static setLinkCookie(token: string): void {
    if (typeof document === 'undefined') return
    const secure = window.location.protocol === 'https:' ? '; Secure' : ''
    document.cookie = `${PREVIEW_TOKEN_KEY}=${encodeURIComponent(token)}; Max-Age=86400; Path=/; SameSite=Lax${secure}`
  }

  /**
   * Vérifier si un previewToken existe
   */
  static hasToken(): boolean {
    return this.getSessionToken() !== null
  }
}
