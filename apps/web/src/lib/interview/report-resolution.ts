/**
 * Fin d'entretien → bon rapport. Flux réel :
 *  1. POST /api/simulation/end clôt la séance puis génère le rapport (jusqu'à 60 s) et redirige vers
 *     /report/<reportId> (ou vers /dashboard si la génération échoue) ;
 *  2. la page /report/[id] attend l'id d'un RAPPORT ; elle accepte aussi l'id de la SÉANCE : elle retrouve alors le
 *     rapport correspondant, ou affiche un état d'attente tant qu'il n'existe pas.
 */

const UUID = "[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}"
const REPORT_PATH = new RegExp(`^/report/(${UUID})/?$`, "i")

/** Id de rapport contenu dans un chemin /report/<uuid>, sinon null. */
export function reportIdFromPath(pathname: string | null | undefined): string | null {
  const match = pathname ? REPORT_PATH.exec(pathname) : null
  return match ? match[1] : null
}

/**
 * Destination après POST /api/simulation/end. Redirection vers un rapport → ce rapport. Tout autre cas (échec de
 * génération redirigé vers /dashboard, conflit, réseau) → l'id de séance : la page rapport le résout ou attend.
 */
export function endDestination(input: { redirectedTo: string | null; sessionId: string }): string {
  const reportId = reportIdFromPath(input.redirectedTo)
  return `/report/${reportId ?? input.sessionId}`
}

export type ReportView =
  | { kind: "show" }
  | { kind: "redirect"; reportId: string }
  | { kind: "pending" }
  | { kind: "in_progress" }
  | { kind: "not_found" }

/**
 * Que montrer pour /report/[id] ?
 *  - `foundReport` : l'id est celui d'un rapport de l'utilisateur ;
 *  - `session` : sinon, la séance de l'utilisateur portant cet id (ou null) ;
 *  - `reportIdForSession` : le rapport de cette séance s'il existe.
 */
export function decideReportView(input: {
  foundReport: boolean
  session: { status: string } | null
  reportIdForSession: string | null
}): ReportView {
  if (input.foundReport) return { kind: "show" }
  if (!input.session) return { kind: "not_found" }
  if (input.reportIdForSession) return { kind: "redirect", reportId: input.reportIdForSession }
  if (input.session.status === "completed") return { kind: "pending" }
  return { kind: "in_progress" }
}

export type ReportStatus = { status: "ready"; reportId: string } | { status: "pending" } | { status: "missing" }

/** Interprète la réponse de GET /api/simulation/[id]/report. */
export function parseReportStatus(httpStatus: number, body: unknown): ReportStatus {
  if (httpStatus !== 200 || typeof body !== "object" || body === null) return { status: "missing" }
  const b = body as Record<string, unknown>
  if (b.status === "ready" && typeof b.reportId === "string") return { status: "ready", reportId: b.reportId }
  if (b.status === "pending") return { status: "pending" }
  return { status: "missing" }
}
