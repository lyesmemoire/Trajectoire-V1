import { describe, it, expect } from "vitest"
import { decideReportView, endDestination, parseReportStatus, reportIdFromPath } from "./report-resolution"

const REPORT = "aaaaaaaa-1111-4111-8111-aaaaaaaaaaaa"
const SESSION = "bbbbbbbb-2222-4222-8222-bbbbbbbbbbbb"

describe("reportIdFromPath", () => {
  it("extrait l'id d'un chemin /report/<uuid>", () => {
    expect(reportIdFromPath(`/report/${REPORT}`)).toBe(REPORT)
    expect(reportIdFromPath(`/report/${REPORT}/`)).toBe(REPORT)
  })
  it("refuse tout autre chemin", () => {
    for (const p of ["/dashboard", "/report/abc", `/report/${REPORT}/x`, "", null, undefined]) {
      expect(reportIdFromPath(p as string | null)).toBeNull()
    }
  })
})

describe("endDestination : fin d'entretien → bon rapport", () => {
  it("redirigé vers un rapport : ce rapport, pas l'id de séance", () => {
    expect(endDestination({ redirectedTo: `/report/${REPORT}`, sessionId: SESSION })).toBe(`/report/${REPORT}`)
  })
  it("génération échouée (redirigé vers /dashboard), conflit ou réseau : l'id de séance, que la page rapport résout", () => {
    expect(endDestination({ redirectedTo: "/dashboard", sessionId: SESSION })).toBe(`/report/${SESSION}`)
    expect(endDestination({ redirectedTo: null, sessionId: SESSION })).toBe(`/report/${SESSION}`)
  })
})

describe("decideReportView : /report/[id]", () => {
  it("id d'un rapport de l'utilisateur : affichage", () => {
    expect(decideReportView({ foundReport: true, session: null, reportIdForSession: null })).toEqual({ kind: "show" })
  })
  it("id de séance dont le rapport existe : redirection vers le rapport", () => {
    expect(decideReportView({ foundReport: false, session: { status: "completed" }, reportIdForSession: REPORT })).toEqual({ kind: "redirect", reportId: REPORT })
  })
  it("séance terminée sans rapport (encore en génération) : attente, jamais un 404", () => {
    expect(decideReportView({ foundReport: false, session: { status: "completed" }, reportIdForSession: null })).toEqual({ kind: "pending" })
  })
  it("séance encore en cours : on la propose de reprendre", () => {
    expect(decideReportView({ foundReport: false, session: { status: "in_progress" }, reportIdForSession: null })).toEqual({ kind: "in_progress" })
  })
  it("ni rapport ni séance : introuvable", () => {
    expect(decideReportView({ foundReport: false, session: null, reportIdForSession: null })).toEqual({ kind: "not_found" })
  })
})

describe("parseReportStatus", () => {
  it("ready / pending / missing", () => {
    expect(parseReportStatus(200, { status: "ready", reportId: REPORT })).toEqual({ status: "ready", reportId: REPORT })
    expect(parseReportStatus(200, { status: "pending" })).toEqual({ status: "pending" })
    expect(parseReportStatus(404, {})).toEqual({ status: "missing" })
    expect(parseReportStatus(200, null)).toEqual({ status: "missing" })
    expect(parseReportStatus(200, { status: "ready" })).toEqual({ status: "missing" })
  })
})

describe("câblage", () => {
  it("la page de simulation passe par endDestination (plus de redirection directe vers l'id de séance)", async () => {
    const { readFileSync } = await import("node:fs")
    const src = readFileSync(new URL("../../app/(app)/simulation/[id]/page.tsx", import.meta.url), "utf-8")
    expect(src).toMatch(/endDestination\(\{ redirectedTo, sessionId \}\)/)
    expect(src).not.toMatch(/router\.push\('\/report\/' \+ sessionId\)/)
  })
  it("la page rapport résout un id de séance via decideReportView", async () => {
    const { readFileSync } = await import("node:fs")
    const src = readFileSync(new URL("../../app/(app)/report/[id]/page.tsx", import.meta.url), "utf-8")
    expect(src).toMatch(/decideReportView/)
    expect(src).toMatch(/ReportPending/)
  })
})
