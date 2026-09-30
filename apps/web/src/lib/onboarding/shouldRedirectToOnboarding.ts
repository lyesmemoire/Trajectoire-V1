/**
 * Règle de redirection vers /onboarding après connexion.
 *
 * Un utilisateur est envoyé vers l'onboarding uniquement s'il :
 * - n'a pas terminé l'onboarding (`onboardingCompleted === false`), ET
 * - est « nouveau » : compte créé il y a moins de 30 jours.
 *
 * Les comptes plus anciens ne sont volontairement PAS concernés (tous les comptes
 * existants ont `onboardingCompleted = false` par défaut : sans cette fenêtre, on
 * les forcerait tous à passer par l'onboarding).
 *
 * Fonction pure (le temps est injectable) : testable sans base ni Next.
 */

export const NEW_USER_WINDOW_MS = 30 * 24 * 60 * 60 * 1000

export interface OnboardingGuardUser {
  onboardingCompleted: boolean
  createdAt: Date | string | null
}

export function shouldRedirectToOnboarding(
  user: OnboardingGuardUser | null | undefined,
  now: number = Date.now(),
): boolean {
  // Profil absent : rien à faire ici (le profil est créé par le déclencheur on_auth_user_created et par /api/auth/sync-user).
  if (!user) return false

  if (user.onboardingCompleted) return false

  if (!user.createdAt) return false

  const createdAt = new Date(user.createdAt).getTime()
  if (Number.isNaN(createdAt)) return false

  // Borne stricte : à exactement 30 jours, le compte n'est plus « nouveau ».
  return now - createdAt < NEW_USER_WINDOW_MS
}
