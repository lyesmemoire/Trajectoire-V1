// @ts-nocheck
import { envServer } from "../../../lib/env.server.js";
/**
 * llm-strict.ts — Appels LLM robustes (OpenAI / Mistral)
 * Fonctionnalités existantes conservées :
 * Multi-provider avec basculement automatique OpenAI → Mistral
 * Forçage JSON (response_format: { type: "json_object" })
 * Validation Zod avec retry auto-correction (1 tentative)
 * Timeout strict de 15 secondes via Promise.race
 * Correction B7 :
 * callLLMStrict() accepte désormais un AbortSignal optionnel.
 * Ce signal est :
 * 1. Passé au fetch() OpenAI/Mistral → la requête HTTP est annulée
 *    immédiatement si la session est détruite
 * 2. Ajouté comme 3e concurrent dans Promise.race → le race se résout
 *    en rejet dès l'abort, sans attendre les 15s de timeout interne
 * Sans ce correctif :
 * Session détruite à T+14s → appel OpenAI continue jusqu'à T+15s
 * 50 sessions interrompues simultanément = 50 × 1s d'appels inutiles
 * Coût et occupation mémoire non annulables
 */
import { type ZodSchema } from "zod";
import { captureError } from "../../../lib/sentry-context.js";

// ── Configuration ─────────────────────────────────────────────────────────

const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
const MISTRAL_API_URL = "https://api.mistral.ai/v1/chat/completions";

const DEFAULT_TIMEOUT_MS = 15_000;
const MAX_RETRY_ATTEMPTS = 1; // 1 retry Zod auto-correction
const DEFAULT_TEMPERATURE = 0.3; // Réponses déterministes pour JSON strict

// ── Types ─────────────────────────────────────────────────────────────────

type Provider = "openai" | "mistral";

export interface LLMCallOptions<T> {
  /** Prompt système (instructions, persona de l'IA) */
  systemPrompt: string;
  /* Prompt utilisateur (contexte, données à analyser) */
  userPrompt: string;
  /* Schéma Zod de validation de la réponse JSON */
  schema: ZodSchema<T>;
  /* Modèle à utiliser (défaut: gpt-4o-mini / mistral-small-latest) */
  model?: string;
  /* Provider préféré (défaut: openai, fallback: mistral) */
  provider?: Provider;
  /* Timeout en ms (défaut: 15 000) */
  timeoutMs?: number;
  /*
   * B7 — Signal d'annulation de la session.
   * Passé au fetch() et au Promise.race pour annulation immédiate.
   */
  signal?: AbortSignal;
}
interface OpenAIMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

// ── Appel LLM principal ───────────────────────────────────────────────────

/**
 * Effectue un appel LLM avec validation Zod et retry auto-correction.
 * @returns La réponse validée et typée selon le schéma fourni.
 * @throws ZodError si la réponse est invalide après retry.
 * @throws DOMException (AbortError) si le signal est déclenché.
 * @throws Error si le timeout est dépassé ou si l'API est indisponible.
 */
export async function callLLMStrict<T>(
  options: LLMCallOptions<T>
): Promise<T> {
  const {
    systemPrompt,
    userPrompt,
    schema,
    provider = "openai",
    timeoutMs = DEFAULT_TIMEOUT_MS,
    signal,
  } = options;
  const messages: OpenAIMessage[] = [
    { role: "system", content: systemPrompt },
    { role: "user", content: userPrompt },
  ];

  return attemptCall(messages, schema, provider, timeoutMs, signal, 0);
}

// ── Tentative d'appel avec retry ──────────────────────────────────────────

async function attemptCall<T>(
  messages: OpenAIMessage[],
  schema: ZodSchema<T>,
  provider: Provider,
  timeoutMs: number,
  signal: AbortSignal | undefined,
  attempt: number
): Promise<T> {
  // Vérification préalable : si le signal est déjà aborted, on ne lance
  // même pas la requête réseau
  if (signal?.aborted) {
    throw new DOMException("Signal aborted before LLM call", "AbortError");
  }

  const rawResponse = await fetchWithRace(messages, provider, timeoutMs, signal);

  // Extraction et parsing JSON
  const content = rawResponse.choices?.[0]?.message?.content ?? "";
  let parsed: unknown;

  try {
    parsed = JSON.parse(content);
  } catch {
    throw new Error(
      `LLM response non-parseable en JSON (provider: ${provider}): ${content.slice(0, 200)}`
    );
  }

  // Validation Zod
  const result = schema.safeParse(parsed);

  if (result.success) {
    return result.data;
  }

  // ── Retry auto-correction ─────────────────────────────────────────────
  if (attempt < MAX_RETRY_ATTEMPTS) {
    const zodErrors = result.error.errors
      .map((e) => `${e.path.join(".")}: ${e.message}`)
      .join("; ");

    console.warn(
      `[LLM] Réponse invalide (tentative ${attempt + 1}/${MAX_RETRY_ATTEMPTS + 1}) — réinjection erreurs Zod: ${zodErrors}`
    );

    // Réinjection des erreurs dans le contexte pour auto-correction
    const correctionMessages: OpenAIMessage[] = [
      ...messages,
      { role: "assistant", content },
      {
        role: "user",
        content: `Ta réponse JSON est invalide. Erreurs: ${zodErrors}. Corrige et retourne uniquement le JSON valide.`,
      },
    ];

    return attemptCall(
      correctionMessages,
      schema,
      // Fallback sur Mistral si OpenAI a échoué
      attempt === 0 && provider === "openai" ? "mistral" : provider,
      timeoutMs,
      signal,
      attempt + 1
    );
  }

  throw result.error;
}

// ── Fetch avec race (timeout + signal) ───────────────────────────────────

async function fetchWithRace(
  messages: OpenAIMessage[],
  provider: Provider,
  timeoutMs: number,
  signal: AbortSignal | undefined
): Promise<{
  choices: Array<{ message: { content: string } }>;
}> {
  // ── Promise 1 : appel LLM ───────────────────────────────────────────────
  const llmPromise = fetchLLM(messages, provider, signal);

  // ── Promise 2 : timeout interne (15s) ───────────────────────────────────
  const timeoutPromise = new Promise<never>((_, reject) => {
    const timer = setTimeout(
      () => reject(new Error(`LLM_TIMEOUT après ${timeoutMs}ms (provider: ${provider})`)),
      timeoutMs
    );
    // Si le signal est déclenché, on annule aussi le timer pour ne pas
    // laisser de ressources pendantes
    signal?.addEventListener("abort", () => clearTimeout(timer), { once: true });
  });

  // ── Promise 3 : B7 — abort de session ───────────────────────────────────
  // Résout immédiatement si le signal est déjà aborted,
  // sinon écoute l'événement "abort" pour rejeter sans attendre le timeout.
  const abortPromise = signal
    ? new Promise<never>((_, reject) => {
        if (signal.aborted) {
          reject(new DOMException("LLM call aborted", "AbortError"));
          return;
        }
        signal.addEventListener(
          "abort",
          () => reject(new DOMException("LLM call aborted", "AbortError")),
          { once: true }
        );
      })
    : null;

  const raceConcurrents: Promise<never | { choices: Array<{ message: { content: string } }> }>[] = [
    llmPromise,
    timeoutPromise,
  ];

  if (abortPromise) raceConcurrents.push(abortPromise);

  return Promise.race(raceConcurrents) as Promise<{
    choices: Array<{ message: { content: string } }>;
  }>;
}

// ── Fetch vers le provider ────────────────────────────────────────────────

async function fetchLLM(
  messages: OpenAIMessage[],
  provider: Provider,
  signal: AbortSignal | undefined
): Promise<{ choices: Array<{ message: { content: string } }> }> {
  const isOpenAI = provider === "openai";

  const apiKey = isOpenAI
    ? envServer.OPENAI_API_KEY
    : envServer.MISTRAL_API_KEY;

  if (!apiKey) {
    throw new Error(`Clé API manquante pour le provider: ${provider}`);
  }

  const url = isOpenAI ? OPENAI_API_URL : MISTRAL_API_URL;
  const model = isOpenAI
    ? (envServer.OPENAI_MODEL ?? "gpt-4o-mini")
    : (envServer.MISTRAL_MODEL ?? "mistral-small-latest");

  const response = await fetch(url, {
    method: "POST",
    // B7 : signal transmis au fetch — null si absent (RequestInit attend AbortSignal | null)
    signal: signal ?? null,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: DEFAULT_TEMPERATURE,
      response_format: { type: "json_object" },
    }),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    const err = new Error(
      `${provider} API error: ${response.status} ${response.statusText} — ${body.slice(0, 300)}`
    );
    captureError(err, { component: 'llm-strict', provider, model, status: response.status });
    throw err;
  }

  return response.json() as Promise<{ choices: Array<{ message: { content: string } }> }>;
}
