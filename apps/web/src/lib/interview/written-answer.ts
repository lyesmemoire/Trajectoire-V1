/**
 * Repli écrit de la simulation : réponse envoyée par POST /api/simulation/message dans la MÊME séance que la voix.
 *
 * Contrat réel de la route (vérifié, rien d'inventé) :
 *  - requête : multipart/form-data { sessionId (uuid), content (1 à 5 000 caractères), durationMs? } ;
 *    en-tête optionnel `Idempotency-Key` ;
 *  - succès 200 : { success: true, data: { messageId, aiResponse, messageCount }, meta } ;
 *    rejeu d'une même clé : { success: true, data: { replayed: true, messages: [...] } } ;
 *  - erreurs : 400 (entrée invalide), 401, 403, 404, 409 (séance terminée), 429 (limite ou quota), 500/504 (IA).
 * La route enregistre le message de la candidate et la réplique de la recruteuse dans `interview_messages`, comme
 * l'entretien vocal : le rapport les lit de la même façon.
 */

export const WRITTEN_ANSWER_MAX_LENGTH = 5000

export function validateWrittenAnswer(text: string): { ok: true; content: string } | { ok: false; message: string } {
  const content = text.trim()
  if (content.length === 0) return { ok: false, message: "Écrivez votre réponse avant de l’envoyer." }
  if (content.length > WRITTEN_ANSWER_MAX_LENGTH) {
    return { ok: false, message: "Votre réponse est trop longue (5 000 caractères au maximum)." }
  }
  return { ok: true, content }
}

export function buildWrittenAnswerForm(sessionId: string, content: string): FormData {
  const form = new FormData()
  form.append("sessionId", sessionId)
  form.append("content", content)
  return form
}

const ERRORS_BY_STATUS: Record<number, string> = {
  400: "Votre réponse n’a pas pu être envoyée. Vérifiez qu’elle n’est ni vide ni trop longue.",
  401: "Votre session a expiré. Reconnectez-vous pour continuer.",
  403: "Cette action n’est pas autorisée.",
  404: "Cette simulation est introuvable.",
  // 409 : verrou de tour (une réponse est déjà en cours) ou séance terminée — la page revérifie l'état réel avant de conclure.
  409: "Une réponse est déjà en cours de traitement. Patientez un instant, puis réessayez.",
  429: "Trop de réponses en peu de temps. Patientez un instant, puis réessayez.",
  500: "Alexandra n’a pas pu répondre. Votre texte est conservé : réessayez.",
  503: "Le service est momentanément indisponible. Votre texte est conservé : réessayez.",
  504: "Alexandra met trop de temps à répondre. Votre texte est conservé : réessayez.",
}

export const WRITTEN_ANSWER_DEFAULT_ERROR = "Votre réponse n’a pas pu être envoyée. Votre texte est conservé : réessayez."

export function writtenAnswerErrorMessage(status: number): string {
  return ERRORS_BY_STATUS[status] ?? WRITTEN_ANSWER_DEFAULT_ERROR
}

const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null

/** Dernier message de la recruteuse dans une liste `interview_messages` (ou null). */
export function lastAssistantMessage(messages: unknown): string | null {
  if (!Array.isArray(messages)) return null
  for (let i = messages.length - 1; i >= 0; i--) {
    const m = messages[i]
    if (isRecord(m) && m.role === "assistant" && typeof m.content === "string" && m.content.trim()) return m.content
  }
  return null
}

export type WrittenAnswerResult = { ok: true; aiResponse: string } | { ok: false; message: string }

/** Interprète la réponse de POST /api/simulation/message (statut HTTP et corps JSON déjà lu). */
export function parseWrittenAnswerResponse(status: number, body: unknown): WrittenAnswerResult {
  if (status !== 200 || !isRecord(body) || body.success !== true || !isRecord(body.data)) {
    return { ok: false, message: writtenAnswerErrorMessage(status) }
  }
  const data = body.data
  if (typeof data.aiResponse === "string" && data.aiResponse.trim()) return { ok: true, aiResponse: data.aiResponse }
  if (data.replayed === true) {
    const last = lastAssistantMessage(data.messages)
    if (last) return { ok: true, aiResponse: last }
  }
  return { ok: false, message: WRITTEN_ANSWER_DEFAULT_ERROR }
}

export type SessionQuestion = { kind: "question"; text: string } | { kind: "ended" } | { kind: "error"; message: string }

/** Interprète GET /api/simulation/[id] : { session, messages, context } ou { redirect } si la séance est terminée. */
export function parseSessionQuestion(status: number, body: unknown): SessionQuestion {
  if (status !== 200 || !isRecord(body)) return { kind: "error", message: writtenAnswerErrorMessage(status) }
  if (typeof body.redirect === "string") return { kind: "ended" }
  if (isRecord(body.session) && body.session.status === "completed") return { kind: "ended" }
  const text = lastAssistantMessage(body.messages)
  return text ? { kind: "question", text } : { kind: "error", message: "La question en cours n’a pas pu être chargée. Réessayez." }
}
