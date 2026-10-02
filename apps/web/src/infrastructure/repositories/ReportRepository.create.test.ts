import { describe, it, expect, vi, beforeEach } from "vitest"

/**
 * Sécurité de l'écriture des rapports : les utilisateurs n'ont aucune policy INSERT sur `reports` (un rapport porte
 * un score, il ne doit pas être falsifiable). `create` écrit avec le client service, mais seulement après avoir
 * vérifié, avec le client de l'utilisateur authentifié (soumis à la RLS), que la séance lui appartient.
 */
const state = vi.hoisted(() => ({
  authUserId: "user-a" as string | null,
  sessionOwners: { "session-of-a": "user-a", "session-of-b": "user-b" } as Record<string, string>,
  insert: vi.fn(),
  adminFrom: vi.fn(),
  existingReport: null as unknown,
}))

vi.mock("@/lib/supabase/server", () => ({
  createClient: async () => ({
    auth: { getUser: async () => ({ data: { user: state.authUserId ? { id: state.authUserId } : null } }) },
    // Lecture soumise à la RLS : la séance n'est visible que si elle appartient à l'utilisateur.
    from: (table: string) => {
      const filters: Record<string, string> = {}
      const q = {
        select: () => q,
        eq: (col: string, val: string) => ((filters[col] = val), q),
        maybeSingle: async () => {
          if (table !== "interview_sessions") return { data: null }
          const owner = state.sessionOwners[filters.id]
          return { data: owner && owner === filters.user_id && owner === state.authUserId ? { id: filters.id } : null }
        },
      }
      return q
    },
  }),
}))

vi.mock("@/lib/supabase/service", () => ({
  createAdminClient: () => ({
    from: (table: string) => {
      state.adminFrom(table)
      return {
        insert: (row: unknown) => ({
          select: () => ({
            single: async () => {
              state.insert(row)
              return state.existingReport === "duplicate"
                ? { data: null, error: { code: "23505", message: "duplicate" } }
                : { data: { id: "r1", ...(row as object) }, error: null }
            },
          }),
        }),
        select: () => ({ eq: () => ({ single: async () => ({ data: { id: "existing" } }) }) }),
      }
    },
  }),
}))

import { ReportRepository } from "./ReportRepository"

const report = (session_id: string) =>
  ({
    session_id,
    overall_score: 100,
    communication: 100,
    technical: 100,
    confidence: 100,
    strengths: [],
    improvements: [],
    summary: "s",
    recommendation: "r",
  }) as never

describe("ReportRepository.create : écriture par le client service après contrôle de propriété", () => {
  beforeEach(() => {
    state.authUserId = "user-a"
    state.existingReport = null
    state.insert.mockClear()
    state.adminFrom.mockClear()
  })

  it("séance de l'utilisateur authentifié : le rapport est écrit via le client service", async () => {
    const created = await new ReportRepository().create(report("session-of-a"))
    expect(state.insert).toHaveBeenCalledTimes(1)
    expect(state.adminFrom).toHaveBeenCalledWith("reports")
    expect(created).toMatchObject({ id: "r1", session_id: "session-of-a" })
  })

  it("un utilisateur ne peut PAS créer un rapport pour la séance d'un autre : 403, rien d'écrit", async () => {
    await expect(new ReportRepository().create(report("session-of-b"))).rejects.toMatchObject({ statusCode: 403 })
    expect(state.insert).not.toHaveBeenCalled()
    expect(state.adminFrom).not.toHaveBeenCalled() // le client service n'est même pas utilisé
  })

  it("séance inexistante : 403, rien d'écrit", async () => {
    await expect(new ReportRepository().create(report("session-inconnue"))).rejects.toMatchObject({ statusCode: 403 })
    expect(state.insert).not.toHaveBeenCalled()
  })

  it("non authentifié : 401, rien d'écrit", async () => {
    state.authUserId = null
    await expect(new ReportRepository().create(report("session-of-a"))).rejects.toMatchObject({ statusCode: 401 })
    expect(state.insert).not.toHaveBeenCalled()
  })

  it("rapport déjà existant (clé en double) : renvoie l'existant, sans doublon", async () => {
    state.existingReport = "duplicate"
    const created = await new ReportRepository().create(report("session-of-a"))
    expect(created).toMatchObject({ id: "existing" })
  })
})
