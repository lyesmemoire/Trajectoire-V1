import { describe, it, expect, vi, beforeEach } from "vitest"

const db = vi.hoisted(() => ({ count: vi.fn(), findMany: vi.fn() }))
vi.mock("@/lib/prisma", () => ({ prisma: { interview_sessions: { count: db.count, findMany: db.findMany } } }))

import { RECENT_SESSIONS_LIMIT, loadInterviewActivity, toInterviewEvent, type ActivityRow } from "./interview-activity"

const row = (over: Partial<ActivityRow> = {}): ActivityRow => ({
  id: "s1",
  job_title: "Développeur",
  score: 72,
  status: "completed",
  created_at: new Date("2026-10-01T10:00:00Z"),
  reports: { id: "r1" },
  ...over,
})

describe("toInterviewEvent", () => {
  it("séance terminée : score, rapport, statut « completed »", () => {
    expect(toInterviewEvent(row())).toEqual({
      id: "timeline-interview-s1",
      type: "interview",
      title: "Entretien simulé · Développeur",
      description: "Score : 72/100",
      date: new Date("2026-10-01T10:00:00Z"),
      status: "completed",
      href: "/report/r1",
      actionLabel: "Voir le rapport",
    })
  })

  it("séance en cours : « Reprendre » vers la simulation, jamais de score affiché", () => {
    const e = toInterviewEvent(row({ status: "in_progress", score: 55, reports: null }))
    expect(e).toMatchObject({ status: "in-progress", href: "/simulation/s1", actionLabel: "Reprendre" })
    expect(e?.description).toBeUndefined()
  })

  it("terminée sans rapport (génération échouée) : pas de lien ; sans score : pas de description", () => {
    const e = toInterviewEvent(row({ reports: null, score: null }))
    expect(e?.href).toBeUndefined()
    expect(e?.actionLabel).toBeUndefined()
    expect(e?.description).toBeUndefined()
  })

  it("titre du poste absent ou blanc : titre générique", () => {
    expect(toInterviewEvent(row({ job_title: null }))?.title).toBe("Entretien simulé")
    expect(toInterviewEvent(row({ job_title: "   " }))?.title).toBe("Entretien simulé")
  })

  it("statut inconnu (échec, abandon…) : absent de la chronologie", () => {
    expect(toInterviewEvent(row({ status: "failed" }))).toBeNull()
    expect(toInterviewEvent(row({ status: "abandoned" }))).toBeNull()
  })
})

describe("loadInterviewActivity", () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it("lit interview_sessions pour l'utilisateur : compteur = terminées, chronologie = terminées et en cours", async () => {
    db.count.mockResolvedValue(4)
    db.findMany.mockResolvedValue([row({ id: "a", status: "in_progress", reports: null }), row({ id: "b" })])

    const result = await loadInterviewActivity("u1")

    expect(result.completedCount).toBe(4)
    expect(result.events.map(e => e.id)).toEqual(["timeline-interview-a", "timeline-interview-b"])
    expect(db.count.mock.calls[0][0].where).toEqual({ user_id: "u1", status: "completed" })

    const query = db.findMany.mock.calls[0][0]
    expect(query.where).toEqual({ user_id: "u1", status: { in: ["completed", "in_progress"] } })
    expect(query.orderBy).toEqual({ created_at: "desc" })
    expect(query.take).toBe(RECENT_SESSIONS_LIMIT)
    // Sélection explicite : jamais de lecture de ligne entière (colonnes ajoutées plus tard).
    expect(Object.keys(query.select).sort()).toEqual(["created_at", "id", "job_title", "reports", "score", "status"])
  })

  it("aucune simulation : compteur à 0 et chronologie vide", async () => {
    db.count.mockResolvedValue(0)
    db.findMany.mockResolvedValue([])
    expect(await loadInterviewActivity("u1")).toEqual({ completedCount: 0, events: [] })
  })
})
