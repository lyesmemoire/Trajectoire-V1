// apps/web/src/validation/CompleteOnboardingSchema.test.ts
//
// Tests du schéma de POST /api/onboarding/complete.

import { describe, it, expect } from 'vitest'
import {
  CompleteOnboardingSchema,
  ONBOARDING_INTERVIEW_TYPES,
  ONBOARDING_LEVELS,
  ONBOARDING_SECTORS,
} from './CompleteOnboardingSchema'
import { CreateSessionSchema } from './CreateSessionSchema'

const valid = {
  targetJob: { title: 'Product Manager', sector: 'Tech', level: 'Senior' },
  name: 'Léa Martin',
  goal: { interviewType: 'RH' },
  cvProvided: false,
}

describe('CompleteOnboardingSchema', () => {
  describe('Entrée valide', () => {
    it('accepte un corps complet', () => {
      expect(CompleteOnboardingSchema.safeParse(valid).success).toBe(true)
    })

    it('accepte cvProvided à true', () => {
      expect(
        CompleteOnboardingSchema.safeParse({ ...valid, cvProvided: true }).success,
      ).toBe(true)
    })

    it('supprime les espaces autour du poste et du nom', () => {
      const parsed = CompleteOnboardingSchema.parse({
        ...valid,
        targetJob: { ...valid.targetJob, title: '  Product Manager  ' },
        name: '  Léa Martin ',
      })

      expect(parsed.targetJob.title).toBe('Product Manager')
      expect(parsed.name).toBe('Léa Martin')
    })

    it.each(ONBOARDING_SECTORS)('accepte le secteur %s', (sector) => {
      const result = CompleteOnboardingSchema.safeParse({
        ...valid,
        targetJob: { ...valid.targetJob, sector },
      })
      expect(result.success).toBe(true)
    })

    it.each(ONBOARDING_LEVELS)('accepte le niveau %s', (level) => {
      const result = CompleteOnboardingSchema.safeParse({
        ...valid,
        targetJob: { ...valid.targetJob, level },
      })
      expect(result.success).toBe(true)
    })

    it.each(ONBOARDING_INTERVIEW_TYPES)("accepte le type d'entretien %s", (interviewType) => {
      const result = CompleteOnboardingSchema.safeParse({
        ...valid,
        goal: { interviewType },
      })
      expect(result.success).toBe(true)
    })
  })

  describe('Clés inattendues (schéma strict)', () => {
    it('rejette un userId fourni par le client', () => {
      expect(
        CompleteOnboardingSchema.safeParse({ ...valid, userId: 'someone-else' }).success,
      ).toBe(false)
    })

    it('rejette une clé inattendue dans targetJob', () => {
      expect(
        CompleteOnboardingSchema.safeParse({
          ...valid,
          targetJob: { ...valid.targetJob, extra: 1 },
        }).success,
      ).toBe(false)
    })

    it('rejette une clé inattendue dans goal', () => {
      expect(
        CompleteOnboardingSchema.safeParse({
          ...valid,
          goal: { interviewType: 'RH', extra: true },
        }).success,
      ).toBe(false)
    })
  })

  describe('Valeurs invalides', () => {
    it.each([
      ['secteur inconnu', { ...valid, targetJob: { ...valid.targetJob, sector: 'Crypto' } }],
      ['niveau inconnu', { ...valid, targetJob: { ...valid.targetJob, level: 'Stagiaire' } }],
      ["type d'entretien inconnu", { ...valid, goal: { interviewType: 'Comportemental' } }],
      ['titre vide après trim', { ...valid, targetJob: { ...valid.targetJob, title: '   ' } }],
      ['nom vide après trim', { ...valid, name: '   ' }],
      ['cvProvided en chaîne', { ...valid, cvProvided: 'true' }],
      ['cvProvided absent', { targetJob: valid.targetJob, name: valid.name, goal: valid.goal }],
      ['goal absent', { targetJob: valid.targetJob, name: valid.name, cvProvided: true }],
      ['targetJob absent', { name: valid.name, goal: valid.goal, cvProvided: true }],
    ])('rejette : %s', (_label, body) => {
      expect(CompleteOnboardingSchema.safeParse(body).success).toBe(false)
    })

    it.each(['hello', null, 42, []])('rejette un corps qui n\'est pas un objet (%j)', (body) => {
      expect(CompleteOnboardingSchema.safeParse(body).success).toBe(false)
    })
  })

  describe('Limites de longueur', () => {
    it('accepte un titre de 100 caractères, rejette 101', () => {
      const withTitle = (title: string) =>
        CompleteOnboardingSchema.safeParse({
          ...valid,
          targetJob: { ...valid.targetJob, title },
        }).success

      expect(withTitle('a'.repeat(100))).toBe(true)
      expect(withTitle('a'.repeat(101))).toBe(false)
    })

    it('accepte un nom de 80 caractères, rejette 81', () => {
      const withName = (name: string) =>
        CompleteOnboardingSchema.safeParse({ ...valid, name }).success

      expect(withName('a'.repeat(80))).toBe(true)
      expect(withName('a'.repeat(81))).toBe(false)
    })
  })

  describe('Caractères de contrôle', () => {
    it('rejette un nom contenant un caractère NUL', () => {
      expect(CompleteOnboardingSchema.safeParse({ ...valid, name: 'Lea\u0000' }).success).toBe(false)
    })

    it('rejette un poste contenant un caractère de contrôle', () => {
      expect(
        CompleteOnboardingSchema.safeParse({
          ...valid,
          targetJob: { ...valid.targetJob, title: 'PM\u001b[31m' },
        }).success,
      ).toBe(false)
    })
  })

  describe('Cohérence avec /simulation/new', () => {
    it("reprend exactement les types d'entretien de CreateSessionSchema", () => {
      expect([...ONBOARDING_INTERVIEW_TYPES]).toEqual([
        ...CreateSessionSchema.shape.interviewType.options,
      ])
    })

    it("garde les niveaux d'expérience proposés par la page de simulation", () => {
      expect([...ONBOARDING_LEVELS]).toEqual([
        'Junior',
        'Intermédiaire',
        'Senior',
        'Lead',
        'Manager',
      ])
    })
  })
})
