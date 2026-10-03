import { describe, it, expect, vi, beforeEach } from "vitest"

const db = vi.hoisted(() => ({ opportunityFindFirst: vi.fn() }))
vi.mock("@/lib/prisma", () => ({ prisma: { opportunity: { findFirst: db.opportunityFindFirst } } }))

import { UnifiedInterviewContextService } from "../UnifiedInterviewContextService"

/**
 * Faux client Supabase qui se comporte comme PostgREST sur un point précis : une requête qui sélectionne une
 * colonne inexistante échoue en entier (« column … does not exist »). C'est ce qui rendait tout le contexte
 * indisponible quand le service demandait `opportunityId` à `interview_sessions`, où cette colonne n'existe pas.
 */
type Row = Record<string, unknown>
type Scenario = {
  sessionColumns: string[]
  session: Row | null
  cvRows: Row[]
}

function fakeSupabase(scenario: Scenario) {
  const selects: Array<{ table: string; columns: string }> = []

  const from = (table: string) => {
    let columns = ""
    const result = (kind: "list" | "single") => {
      const missing = table === "interview_sessions" ? columns.split(",").map(c => c.trim()).filter(c => c && !scenario.sessionColumns.includes(c)) : []
      if (missing.length > 0) return { data: null, error: { message: `column interview_sessions.${missing[0]} does not exist` } }
      if (table === "interview_sessions" && kind === "single") {
        const data = scenario.session ? Object.fromEntries(Object.entries(scenario.session).filter(([k]) => columns.split(",").map(c => c.trim()).includes(k))) : null
        return { data, error: scenario.session ? null : { message: "not found" } }
      }
      if (table === "interview_sessions") return { data: [], error: null } // historique
      if (table === "CVAnalysis") return { data: scenario.cvRows, error: null }
      return { data: [], error: null }
    }

    const chain: Record<string, unknown> = {
      select: (c: string) => {
        columns = c
        selects.push({ table, columns: c })
        return chain
      },
      single: async () => result("single"),
      maybeSingle: async () => result("single"),
      then: (resolve: (v: unknown) => void) => resolve(result("list")),
    }
    for (const m of ["eq", "neq", "order", "limit", "in", "gt", "lt"]) chain[m] = () => chain
    return chain
  }

  return { client: { from }, selects }
}

const SESSION = {
  id: "s1",
  user_id: "u1",
  job_title: "Développeur TypeScript",
  job_description: "Entreprise : Acme\n\nNous recherchons un développeur TypeScript maîtrisant React et PostgreSQL.",
  level: "Senior",
  interview_type: "Technique",
}
const CV_ROW = {
  id: "cv1",
  userId: "u1",
  fileName: "cv.pdf",
  originalText: "Marie Dupont, développeuse full stack. Huit ans d'expérience en TypeScript, React et PostgreSQL.",
  optimizedText: "",
  cvData: {},
  keywords: ["TypeScript", "React"],
  improvements: [],
  createdAt: "2026-10-01T00:00:00Z",
}

// Colonnes réelles de interview_sessions (hors `opportunityId`, absente en base au 2026-10-05).
const COLUMNS_WITHOUT_LINK = ["id", "user_id", "job_title", "job_description", "level", "interview_type", "score", "career_trajectory_score", "feedback_json", "created_at"]

beforeEach(() => {
  vi.resetAllMocks()
  vi.spyOn(console, "warn").mockImplementation(() => {})
})

describe("UnifiedInterviewContextService : CV et offre", () => {
  it("le contexte contient le CV et l'offre quand ils existent, même si la colonne opportunityId n'existe pas", async () => {
    const { client } = fakeSupabase({ sessionColumns: COLUMNS_WITHOUT_LINK, session: SESSION, cvRows: [CV_ROW] })
    const ctx = await new UnifiedInterviewContextService(client).build({ userId: "u1", sessionId: "s1" })

    expect(ctx.candidate.cvId).toBe("cv1")
    expect(ctx.candidate.cvText).toContain("Marie Dupont")
    expect(ctx.candidate.cvText).toContain("PostgreSQL")
    expect(ctx.job.title).toBe("Développeur TypeScript")
    expect(ctx.job.description).toContain("Nous recherchons un développeur TypeScript")
    expect(ctx.job.level).toBe("Senior")
    expect(ctx.job.interviewType).toBe("Technique")
    expect(ctx.matching.matchedSkills).toEqual(["TypeScript", "React"])
  })

  it("régression : la requête principale ne demande plus opportunityId (colonne absente de interview_sessions)", async () => {
    const { client, selects } = fakeSupabase({ sessionColumns: COLUMNS_WITHOUT_LINK, session: SESSION, cvRows: [CV_ROW] })
    await new UnifiedInterviewContextService(client).build({ userId: "u1", sessionId: "s1" })
    const main = selects.find(s => s.table === "interview_sessions" && s.columns.includes("job_title"))
    expect(main).toBeDefined()
    expect(main!.columns).not.toContain("opportunityId")
  })

  it("sans CV : le contexte garde l'offre, le texte du CV est vide", async () => {
    const { client } = fakeSupabase({ sessionColumns: COLUMNS_WITHOUT_LINK, session: SESSION, cvRows: [] })
    const ctx = await new UnifiedInterviewContextService(client).build({ userId: "u1", sessionId: "s1" })
    expect(ctx.candidate.cvId).toBeNull()
    expect(ctx.candidate.cvText).toBe("")
    expect(ctx.job.description).toContain("PostgreSQL")
  })

  it("séance introuvable ou d'un autre utilisateur : erreur explicite", async () => {
    const { client } = fakeSupabase({ sessionColumns: COLUMNS_WITHOUT_LINK, session: null, cvRows: [CV_ROW] })
    await expect(new UnifiedInterviewContextService(client).build({ userId: "u1", sessionId: "s1" })).rejects.toThrow("INTERVIEW_SESSION_NOT_FOUND")
  })
})

describe("UnifiedInterviewContextService : lien avec une opportunité (colonne présente)", () => {
  it("quand opportunityId existe, les risques sémantiques de l'offre sont utilisés ; propriété revérifiée", async () => {
    db.opportunityFindFirst.mockResolvedValue({
      analysis: {
        semanticAnalysis: {
          candidateRisks: [{ title: "Preuves sur PostgreSQL", reasoning: "Peu détaillé dans le CV", severity: "medium", competency: "Bases de données", status: "unproven" }],
        },
      },
    })
    const { client } = fakeSupabase({
      sessionColumns: [...COLUMNS_WITHOUT_LINK, "opportunityId"],
      session: { ...SESSION, opportunityId: "o1" },
      cvRows: [CV_ROW],
    })
    const ctx = await new UnifiedInterviewContextService(client).build({ userId: "u1", sessionId: "s1" })

    expect(db.opportunityFindFirst.mock.calls[0][0].where).toEqual({ id: "o1", userId: "u1" })
    expect(ctx.topRisks[0]).toMatchObject({ title: "Preuves sur PostgreSQL", source: "semantic_llm" })
    expect(ctx.candidate.cvText).toContain("Marie Dupont")
    expect(ctx.job.description).toContain("PostgreSQL")
  })
})
