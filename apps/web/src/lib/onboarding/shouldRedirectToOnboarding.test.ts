// apps/web/src/lib/onboarding/shouldRedirectToOnboarding.test.ts
//
// Règle de redirection vers /onboarding : non terminé ET compte de moins de 30 jours.

import { describe, it, expect } from 'vitest'
import {
  NEW_USER_WINDOW_MS,
  shouldRedirectToOnboarding,
} from './shouldRedirectToOnboarding'

const NOW = Date.parse('2026-09-28T12:00:00.000Z')
const DAY = 24 * 60 * 60 * 1000
const createdDaysAgo = (days: number) => new Date(NOW - days * DAY)

describe('shouldRedirectToOnboarding', () => {
  it('fixe la fenêtre « nouvel utilisateur » à 30 jours', () => {
    expect(NEW_USER_WINDOW_MS).toBe(30 * DAY)
  })

  describe('Redirige', () => {
    it('un compte créé aujourd\'hui, onboarding non terminé', () => {
      expect(
        shouldRedirectToOnboarding({ onboardingCompleted: false, createdAt: createdDaysAgo(0) }, NOW),
      ).toBe(true)
    })

    it('un compte de 10 jours, onboarding non terminé', () => {
      expect(
        shouldRedirectToOnboarding({ onboardingCompleted: false, createdAt: createdDaysAgo(10) }, NOW),
      ).toBe(true)
    })

    it('un compte à 1 ms de la limite des 30 jours', () => {
      const createdAt = new Date(NOW - NEW_USER_WINDOW_MS + 1)
      expect(shouldRedirectToOnboarding({ onboardingCompleted: false, createdAt }, NOW)).toBe(true)
    })

    it('accepte une date sérialisée (chaîne ISO)', () => {
      expect(
        shouldRedirectToOnboarding(
          { onboardingCompleted: false, createdAt: createdDaysAgo(2).toISOString() },
          NOW,
        ),
      ).toBe(true)
    })
  })

  describe('Ne redirige pas', () => {
    it('un utilisateur qui a terminé l\'onboarding, même récent', () => {
      expect(
        shouldRedirectToOnboarding({ onboardingCompleted: true, createdAt: createdDaysAgo(1) }, NOW),
      ).toBe(false)
    })

    it('un compte de plus de 30 jours non onboardé (utilisateurs existants)', () => {
      expect(
        shouldRedirectToOnboarding({ onboardingCompleted: false, createdAt: createdDaysAgo(31) }, NOW),
      ).toBe(false)
    })

    it('un compte d\'exactement 30 jours (borne stricte)', () => {
      const createdAt = new Date(NOW - NEW_USER_WINDOW_MS)
      expect(shouldRedirectToOnboarding({ onboardingCompleted: false, createdAt }, NOW)).toBe(false)
    })

    it('un profil absent (null ou undefined)', () => {
      expect(shouldRedirectToOnboarding(null, NOW)).toBe(false)
      expect(shouldRedirectToOnboarding(undefined, NOW)).toBe(false)
    })

    it('une date de création manquante', () => {
      expect(shouldRedirectToOnboarding({ onboardingCompleted: false, createdAt: null }, NOW)).toBe(false)
    })

    it('une date de création illisible', () => {
      expect(
        shouldRedirectToOnboarding({ onboardingCompleted: false, createdAt: 'pas une date' }, NOW),
      ).toBe(false)
    })
  })

  it('utilise l\'heure courante par défaut', () => {
    expect(
      shouldRedirectToOnboarding({ onboardingCompleted: false, createdAt: new Date() }),
    ).toBe(true)
    expect(
      shouldRedirectToOnboarding({
        onboardingCompleted: false,
        createdAt: new Date(Date.now() - 40 * DAY),
      }),
    ).toBe(false)
  })
})
