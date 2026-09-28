// apps/web/src/app/api/onboarding/complete/route.test.ts
//
// Tests pour l'endpoint POST /api/onboarding/complete
// Couvre : authentification, validation, écriture limitée à la session, 409, 500.

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { NextRequest } from 'next/server'
import * as route from './route'

const { POST } = route

// vi.hoisted : les mocks existent avant le hissage de vi.mock().
const mockPrisma = vi.hoisted(() => ({
  user: {
    updateMany: vi.fn(),
  },
}))

const mockGetUser = vi.hoisted(() => vi.fn())

vi.mock('@/lib/prisma', () => ({
  prisma: mockPrisma,
}))

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(async () => ({
    auth: {
      getUser: mockGetUser,
    },
  })),
}))

vi.mock('@/lib/logger', () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn(),
  },
}))

const SESSION_USER_ID = 'session-user-123'

const validBody = {
  targetJob: { title: 'Product Manager', sector: 'Tech', level: 'Senior' },
  name: 'Léa Martin',
  goal: { interviewType: 'RH' },
  cvProvided: false,
}

function post(body: unknown) {
  return new NextRequest('http://localhost:3000/api/onboarding/complete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  })
}

function signedIn() {
  mockGetUser.mockResolvedValue({
    data: { user: { id: SESSION_USER_ID } },
    error: null,
  })
}

describe('POST /api/onboarding/complete', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    signedIn()
    mockPrisma.user.updateMany.mockResolvedValue({ count: 1 })
  })

  describe('Méthodes exposées', () => {
    it('expose POST uniquement', () => {
      const exported = route as Record<string, unknown>

      expect(typeof exported.POST).toBe('function')
      for (const method of ['GET', 'PUT', 'PATCH', 'DELETE']) {
        expect(exported[method]).toBeUndefined()
      }
    })
  })

  describe('401 — non authentifié', () => {
    it("retourne 401 sans session et n'écrit rien", async () => {
      mockGetUser.mockResolvedValue({ data: { user: null }, error: null })

      const response = await POST(post(validBody))

      expect(response.status).toBe(401)
      const data = await response.json()
      expect(data.success).toBe(false)
      expect(data.error.code).toBe('UNAUTHORIZED')
      expect(mockPrisma.user.updateMany).not.toHaveBeenCalled()
    })

    it("retourne 401 si Supabase renvoie une erreur d'authentification", async () => {
      mockGetUser.mockResolvedValue({
        data: { user: { id: SESSION_USER_ID } },
        error: new Error('jwt expired'),
      })

      const response = await POST(post(validBody))

      expect(response.status).toBe(401)
      expect(mockPrisma.user.updateMany).not.toHaveBeenCalled()
    })

    it("vérifie l'authentification avant de lire le corps", async () => {
      mockGetUser.mockResolvedValue({ data: { user: null }, error: null })

      const response = await POST(post('{corps illisible'))

      expect(response.status).toBe(401)
    })
  })

  describe('400 — requête invalide', () => {
    it('retourne 400 INVALID_JSON si le corps est illisible', async () => {
      const response = await POST(post('{pas du json'))

      expect(response.status).toBe(400)
      const data = await response.json()
      expect(data.error.code).toBe('INVALID_JSON')
      expect(mockPrisma.user.updateMany).not.toHaveBeenCalled()
    })

    it('retourne 400 VALIDATION_ERROR avec le détail par champ', async () => {
      const response = await POST(
        post({ ...validBody, targetJob: { ...validBody.targetJob, sector: 'Crypto' } }),
      )

      expect(response.status).toBe(400)
      const data = await response.json()
      expect(data.success).toBe(false)
      expect(data.error.code).toBe('VALIDATION_ERROR')
      expect(data.error.details).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ path: 'targetJob.sector' }),
        ]),
      )
      expect(mockPrisma.user.updateMany).not.toHaveBeenCalled()
    })

    it('retourne 400 si un champ obligatoire manque', async () => {
      const withoutGoal = {
        targetJob: validBody.targetJob,
        name: validBody.name,
        cvProvided: validBody.cvProvided,
      }

      const response = await POST(post(withoutGoal))

      expect(response.status).toBe(400)
      expect(mockPrisma.user.updateMany).not.toHaveBeenCalled()
    })

    it("rejette un userId fourni par le client (l'identité vient de la session)", async () => {
      const response = await POST(post({ ...validBody, userId: 'attacker-999' }))

      expect(response.status).toBe(400)
      expect(mockPrisma.user.updateMany).not.toHaveBeenCalled()
    })
  })

  describe('200 — succès', () => {
    it("écrit uniquement sur l'utilisateur de la session", async () => {
      const response = await POST(post(validBody))

      expect(response.status).toBe(200)
      expect(await response.json()).toEqual({ success: true })

      expect(mockPrisma.user.updateMany).toHaveBeenCalledTimes(1)
      const call = mockPrisma.user.updateMany.mock.calls[0][0]
      expect(call.where).toEqual({ id: SESSION_USER_ID })
    })

    it('enregistre le nom, le statut, la date et onboardingData v1', async () => {
      await POST(post(validBody))

      expect(mockPrisma.user.updateMany).toHaveBeenCalledWith({
        where: { id: SESSION_USER_ID },
        data: {
          name: 'Léa Martin',
          onboardingCompleted: true,
          onboardingCompletedAt: expect.any(Date),
          onboardingData: {
            version: 1,
            targetJob: { title: 'Product Manager', sector: 'Tech', level: 'Senior' },
            goal: { interviewType: 'RH' },
            cvProvided: false,
          },
        },
      })
    })

    it('nettoie les espaces avant écriture et conserve cvProvided', async () => {
      await POST(
        post({
          ...validBody,
          targetJob: { ...validBody.targetJob, title: '  Product Manager  ' },
          name: '  Léa Martin  ',
          cvProvided: true,
        }),
      )

      const { data } = mockPrisma.user.updateMany.mock.calls[0][0]
      expect(data.name).toBe('Léa Martin')
      expect(data.onboardingData.targetJob.title).toBe('Product Manager')
      expect(data.onboardingData.cvProvided).toBe(true)
    })

    it('interdit la mise en cache de la réponse', async () => {
      const response = await POST(post(validBody))

      expect(response.headers.get('Cache-Control')).toBe('no-store')
    })
  })

  describe('409 — profil absent', () => {
    it("retourne 409 quand aucune ligne utilisateur n'est mise à jour", async () => {
      mockPrisma.user.updateMany.mockResolvedValue({ count: 0 })

      const response = await POST(post(validBody))

      expect(response.status).toBe(409)
      const data = await response.json()
      expect(data.success).toBe(false)
      expect(data.error.code).toBe('PROFILE_NOT_FOUND')
    })
  })

  describe('500 — erreur inattendue', () => {
    it("retourne 500 sans divulguer l'erreur interne", async () => {
      mockPrisma.user.updateMany.mockRejectedValue(new Error('connection to db-secret-host refused'))

      const response = await POST(post(validBody))

      expect(response.status).toBe(500)
      const data = await response.json()
      expect(data.error.code).toBe('INTERNAL_ERROR')
      expect(JSON.stringify(data)).not.toContain('db-secret-host')
    })

    it("journalise l'erreur avec l'identifiant seul, sans donnée saisie", async () => {
      mockPrisma.user.updateMany.mockRejectedValue(new Error('Database error'))
      const { logger } = await import('@/lib/logger')

      await POST(post(validBody))

      expect(logger.error).toHaveBeenCalledTimes(1)
      const logged = JSON.stringify(vi.mocked(logger.error).mock.calls[0])
      expect(logged).toContain(SESSION_USER_ID)
      expect(logged).not.toContain('Léa')
      expect(logged).not.toContain('Product Manager')
    })
  })
})
