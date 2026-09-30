// apps/web/src/lib/subscription/SubscriptionResolver.test.ts
//
// Le plan vient de `lib/quota/plan-access` (source unique) : ces tests vérifient que le
// resolver applique les mêmes règles (grâce past_due, Pack expiré, annulation) et
// traduit correctement le plan effectif en capacités.

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { SubscriptionResolver } from './SubscriptionResolver'

const mocks = vi.hoisted(() => ({ findUnique: vi.fn() }))

vi.mock('@/lib/prisma', () => ({
  prisma: { user: { findUnique: mocks.findUnique } },
}))

const DAY = 24 * 3600 * 1000
const inDays = (n: number) => new Date(Date.now() + n * DAY)

function row(over: Record<string, unknown> = {}) {
  return {
    plan: 'FREE',
    role: 'USER',
    simulationsUsed: 0,
    packExpiresAt: null,
    Subscription: null,
    ...over,
  }
}

const pro = (status: string) =>
  row({ plan: 'PRO', Subscription: { status, currentPeriodEnd: inDays(10) } })

async function resolverFor(userRow: ReturnType<typeof row> | null) {
  mocks.findUnique.mockResolvedValue(userRow)
  return SubscriptionResolver.create('u1')
}

describe('SubscriptionResolver — plan effectif (mêmes règles que plan-access)', () => {
  beforeEach(() => vi.resetAllMocks())

  it('utilisateur inconnu ou FREE : pas premium', async () => {
    expect((await resolverFor(null)).hasPremium()).toBe(false)
    expect((await resolverFor(row())).hasPremium()).toBe(false)
  })

  it('PRO actif : premium', async () => {
    expect((await resolverFor(pro('active'))).hasPremium()).toBe(true)
  })

  it('PRO past_due : premium maintenu (période de grâce)', async () => {
    expect((await resolverFor(pro('past_due'))).hasPremium()).toBe(true)
  })

  it.each(['canceled', 'unpaid', 'incomplete_expired'])(
    'PRO %s : plus premium, même si Subscription.plan vaut encore PRO',
    async (status) => {
      const r = await resolverFor(pro(status))
      expect(r.hasPremium()).toBe(false)
      expect(r.canExport()).toBe(false)
    },
  )

  it('PRO sans ligne d’abonnement : pas premium', async () => {
    expect((await resolverFor(row({ plan: 'PRO' }))).hasPremium()).toBe(false)
  })

  it('PACK valide : premium ; PACK expiré : pas premium', async () => {
    expect((await resolverFor(row({ plan: 'PACK', packExpiresAt: inDays(30) }))).hasPremium()).toBe(true)
    expect((await resolverFor(row({ plan: 'PACK', packExpiresAt: inDays(-1) }))).hasPremium()).toBe(false)
  })

  it('administrateur : toujours premium', async () => {
    expect((await resolverFor(row({ role: 'ADMIN_SUPPORT' }))).hasPremium()).toBe(true)
  })
})

describe('SubscriptionResolver — administrateur', () => {
  beforeEach(() => vi.resetAllMocks())

  it.each(['ADMIN_FOUNDER', 'ADMIN_PRODUCT', 'ADMIN_SUPPORT'])('%s : admin', async (role) => {
    expect((await resolverFor(row({ role }))).hasAdmin()).toBe(true)
  })

  it('utilisateur normal : pas admin', async () => {
    expect((await resolverFor(row())).hasAdmin()).toBe(false)
  })
})

describe('SubscriptionResolver — capacités', () => {
  beforeEach(() => vi.resetAllMocks())

  it('FREE : ni export, ni historique illimité, ni simulations illimitées', async () => {
    const r = await resolverFor(row())
    expect(r.canExport()).toBe(false)
    expect(r.hasUnlimitedHistory()).toBe(false)
    expect(r.hasAdvancedReports()).toBe(false)
    expect(r.canRunUnlimitedSimulation()).toBe(false)
    expect(r.canUseCopilot()).toBe(false)
  })

  it('PRO : export, historique, rapports ET simulations illimitées', async () => {
    const r = await resolverFor(pro('active'))
    expect(r.canExport()).toBe(true)
    expect(r.hasUnlimitedHistory()).toBe(true)
    expect(r.hasAdvancedReports()).toBe(true)
    expect(r.canRunUnlimitedSimulation()).toBe(true)
    expect(r.hasAdvancedAPI()).toBe(false)
  })

  it('PACK : mêmes fonctionnalités que PRO, mais simulations limitées à 5', async () => {
    const r = await resolverFor(row({ plan: 'PACK', packExpiresAt: inDays(30) }))
    expect(r.canExport()).toBe(true)
    expect(r.hasAdvancedReports()).toBe(true)
    expect(r.canRunUnlimitedSimulation()).toBe(false)
  })

  it('administrateur : toutes les capacités', async () => {
    const caps = (await resolverFor(row({ role: 'ADMIN_FOUNDER' }))).getCapabilities()
    expect(Object.values(caps).every(Boolean)).toBe(true)
  })
})

describe('SubscriptionResolver — canAccess', () => {
  beforeEach(() => vi.resetAllMocks())

  it('PUBLIC et AUTHENTICATED : autorisés', async () => {
    const r = await resolverFor(row())
    expect(r.canAccess('PUBLIC').allowed).toBe(true)
    expect(r.canAccess('AUTHENTICATED').allowed).toBe(true)
  })

  it('PREMIUM : refusé pour FREE et pour un abonnement annulé, accepté pour PRO en grâce', async () => {
    expect((await resolverFor(row())).canAccess('PREMIUM').allowed).toBe(false)
    expect((await resolverFor(pro('canceled'))).canAccess('PREMIUM').allowed).toBe(false)

    const grace = (await resolverFor(pro('past_due'))).canAccess('PREMIUM')
    expect(grace.allowed).toBe(true)
    expect(grace.currentLevel).toBe('PREMIUM')
  })

  it('ADMIN : réservé aux administrateurs', async () => {
    expect((await resolverFor(row())).canAccess('ADMIN').allowed).toBe(false)
    expect((await resolverFor(row({ role: 'ADMIN_PRODUCT' }))).canAccess('ADMIN').allowed).toBe(true)
  })
})
