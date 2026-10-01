import { describe, it, expect } from "vitest"
import {
  WRITTEN_ANSWER_DEFAULT_ERROR,
  WRITTEN_ANSWER_MAX_LENGTH,
  buildWrittenAnswerForm,
  lastAssistantMessage,
  parseSessionQuestion,
  parseWrittenAnswerResponse,
  validateWrittenAnswer,
  writtenAnswerErrorMessage,
} from "./written-answer"

describe("validateWrittenAnswer", () => {
  it("refuse le vide et les espaces", () => {
    expect(validateWrittenAnswer("   ").ok).toBe(false)
  })
  it("refuse au-delà de la limite de la route (5 000)", () => {
    expect(validateWrittenAnswer("a".repeat(WRITTEN_ANSWER_MAX_LENGTH + 1)).ok).toBe(false)
    expect(validateWrittenAnswer("a".repeat(WRITTEN_ANSWER_MAX_LENGTH)).ok).toBe(true)
  })
  it("rogne les espaces autour", () => {
    expect(validateWrittenAnswer("  Bonjour  ")).toEqual({ ok: true, content: "Bonjour" })
  })
})

describe("buildWrittenAnswerForm", () => {
  it("utilise les champs réels de la route : sessionId et content", () => {
    const form = buildWrittenAnswerForm("11111111-1111-4111-8111-111111111111", "Ma réponse")
    expect([...form.keys()].sort()).toEqual(["content", "sessionId"])
    expect(form.get("content")).toBe("Ma réponse")
  })
})

describe("parseWrittenAnswerResponse", () => {
  it("succès : lit data.aiResponse", () => {
    const r = parseWrittenAnswerResponse(200, { success: true, data: { messageId: "m", aiResponse: "Question suivante ?", messageCount: 4 } })
    expect(r).toEqual({ ok: true, aiResponse: "Question suivante ?" })
  })
  it("rejeu d'une même clé : reprend la dernière réplique de la recruteuse", () => {
    const r = parseWrittenAnswerResponse(200, {
      success: true,
      data: { replayed: true, messages: [{ role: "assistant", content: "Q1" }, { role: "user", content: "R1" }, { role: "assistant", content: "Q2" }] },
    })
    expect(r).toEqual({ ok: true, aiResponse: "Q2" })
  })
  it("erreurs : messages en français, sans code ni fournisseur", () => {
    for (const status of [400, 401, 403, 404, 409, 429, 500, 503, 504, 418]) {
      const r = parseWrittenAnswerResponse(status, { success: false, error: { code: "AI_ERROR", message: "OpenAI 429" } })
      expect(r.ok).toBe(false)
      const msg = (r as { message: string }).message
      expect(msg).not.toMatch(/openai|\b[45]\d{2}\b|AI_ERROR|exception/i)
      expect(msg.length).toBeGreaterThan(10)
    }
  })
  it("réponse 200 de forme inattendue : erreur générique, pas de plantage", () => {
    expect(parseWrittenAnswerResponse(200, { success: true, data: {} })).toEqual({ ok: false, message: WRITTEN_ANSWER_DEFAULT_ERROR })
    expect(parseWrittenAnswerResponse(200, null)).toEqual({ ok: false, message: writtenAnswerErrorMessage(200) })
  })
  it("le texte saisi est conservé : les erreurs d'IA le disent", () => {
    expect(writtenAnswerErrorMessage(504)).toMatch(/conservé/)
  })
})

describe("question en cours (GET /api/simulation/[id])", () => {
  it("dernière réplique de la recruteuse", () => {
    expect(lastAssistantMessage([{ role: "assistant", content: "Q1" }, { role: "user", content: "R" }, { role: "assistant", content: "Q2" }])).toBe("Q2")
    expect(lastAssistantMessage([{ role: "user", content: "R" }])).toBeNull()
    expect(lastAssistantMessage("x")).toBeNull()
  })
  it("séance terminée : redirect", () => {
    expect(parseSessionQuestion(200, { redirect: "/report/abc" })).toEqual({ kind: "ended" })
  })
  it("question trouvée / erreurs", () => {
    expect(parseSessionQuestion(200, { messages: [{ role: "assistant", content: "Parlez-moi de vous." }] })).toEqual({ kind: "question", text: "Parlez-moi de vous." })
    expect(parseSessionQuestion(404, { error: "Session introuvable" }).kind).toBe("error")
    expect(parseSessionQuestion(200, { messages: [] }).kind).toBe("error")
  })
})
