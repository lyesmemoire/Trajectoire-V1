import { envServer } from "./config/env.js";
/**
 * llm-strict.ts â€” Appels LLM robustes (OpenAI / Mistral)
 * FonctionnalitÃ©s existantes conservÃ©es :
 * Multi-provider avec basculement automatique OpenAI â†’ Mistral
 * ForÃ§age JSON (response_format: { type: "json_object" })
 * Validation Zod avec retry auto-correction (1 tentative)
 * Timeout strict de 15 secondes via Promise.race
 * Correction B7 :
 * callLLMStrict() accepte dÃ©sormais un AbortSignal optionnel.
 * Ce signal est :
 * 1. PassÃ© au fetch() OpenAI/Mistral â†’ la requÃªte HTTP est annulÃ©e
 *    immÃ©diatement si la session est dÃ©truite
 * 2. AjoutÃ© comme 3e concurrent dans Promise.race â†’ le race se rÃ©sout
 *    en rejet dÃ¨s l'abort, sans attendre les 15s de timeout interne
 * Sans ce correctif :
 * Session dÃ©truite Ã  T+14s â†’ appel OpenAI continue jusqu'Ã  T+15s
 * 50 sessions interrompues simultanÃ©ment = 50 Ã— 1s d'appels inutiles
 * CoÃ»t et occupation mÃ©moire non annulables
 */
import { type ZodSchema } from "zod";
import { captureError } from "./infrastructure/error-telemetry.js";

// â”€â”€ Configuration â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
const MISTRAL_API_URL = "https://api.mistral.ai/v1/chat/completions";

const DEFAULT_TIMEOUT_MS = 15_000;
const MAX_RETRY_ATTEMPTS = 1; // 1 retry Zod auto-correction
const DEFAULT_TEMPERATURE = 0.3; // RÃ©ponses dÃ©terministes pour JSON strict

// â”€â”€ Types â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

type Provider = "openai" | "mistral";

export interface LLMCallOptions<T> {
  /** Prompt systÃ¨me (instructions, persona de l'IA) */
  systemPrompt: string;
  /* Prompt utilisateur (contexte, donnÃ©es Ã  analyser) */
  userPrompt: string;
  /* SchÃ©ma Zod de validation de la rÃ©ponse JSON */
  schema: ZodSchema<T>;
  /* ModÃ¨le Ã  utiliser (dÃ©faut: gpt-4o-mini / mistral-small-latest) */
  model?: string;
  /* Provider prÃ©fÃ©rÃ© (dÃ©faut: openai, fallback: mistral) */
  provider?: Provider;
  /* Timeout en ms (dÃ©faut: 15 000) */
  timeoutMs?: number;
  /*
   * B7 â€” Signal d'annulation de la session.
   * PassÃ© au fetch() et au Promise.race pour annulation immÃ©diate.
   */
  signal?: AbortSignal;
}
interface OpenAIMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

// â”€â”€ Appel LLM principal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

/**
 * Effectue un appel LLM avec validation Zod et retry auto-correction.
 * @returns La rÃ©ponse validÃ©e et typÃ©e selon le schÃ©ma fourni.
 * @throws ZodError si la rÃ©ponse est invalide aprÃ¨s retry.
 * @throws DOMException (AbortError) si le signal est dÃ©clenchÃ©.
 * @throws Error si le timeout est dÃ©passÃ© ou si l'API est indisponible.
 */
export async function callLLMStrict<T>(
  options: LLMCallOptions<T>
): Promise<T> {
  const { systemPrompt, userPrompt, schema, provider = "openai", timeoutMs = DEFAULT_TIMEOUT_MS, signal } = options;
  const messages: OpenAIMessage[] = [
    { role: "system", content: systemPrompt },
    { role: "user", content: userPrompt },
  ];

  return attemptCall(messages, schema, provider, timeoutMs, signal, 0);
}

// â”€â”€ Tentative d'appel avec retry â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

async function attemptCall<T>(
  messages: OpenAIMessage[],
  schema: ZodSchema<T>,
  provider: Provider,
  timeoutMs: number,
  signal: AbortSignal | undefined,
  attempt: number
): Promise<T> {
  // VÃ©rification prÃ©alable : si le signal est dÃ©jÃ  aborted, on ne lance
  // mÃªme pas la requÃªte rÃ©seau
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

  // â”€â”€ Retry auto-correction â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  if (attempt < MAX_RETRY_ATTEMPTS) {
    const zodErrors = result.error.errors
      .map((e) => `${e.path.join(".")}: ${e.message}`)
      .join("; ");

    console.warn(
      `[LLM] RÃ©ponse invalide (tentative ${attempt + 1}/${MAX_RETRY_ATTEMPTS + 1}) â€” rÃ©injection erreurs Zod: ${zodErrors}`
    );

    // RÃ©injection des erreurs dans le contexte pour auto-correction
    const correctionMessages: OpenAIMessage[] = [
      ...messages,
      { role: "assistant", content },
      {
        role: "user",
        content: `Ta rÃ©ponse JSON est invalide. Erreurs: ${zodErrors}. Corrige et retourne uniquement le JSON valide.`,
      },
    ];

    return attemptCall(
      correctionMessages,
      schema,
      // Fallback sur Mistral si OpenAI a Ã©chouÃ©
      attempt === 0 && provider === "openai" ? "mistral" : provider,
      timeoutMs,
      signal,
      attempt + 1
    );
  }

  throw result.error;
}

// â”€â”€ Fetch avec race (timeout + signal) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

async function fetchWithRace(messages: OpenAIMessage[], provider: Provider, timeoutMs: number, signal: AbortSignal | undefined): Promise<{
  choices: Array<{ message: { content: string } }>;
}> {
  // â”€â”€ Promise 1 : appel LLM â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const llmPromise = fetchLLM(messages, provider, signal);

  // â”€â”€ Promise 2 : timeout interne (15s) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const timeoutPromise = new Promise<never>((_, reject) => {
    const timer = setTimeout(
      () => reject(new Error(`LLM_TIMEOUT aprÃ¨s ${timeoutMs}ms (provider: ${provider})`)),
      timeoutMs
    );
    // Si le signal est dÃ©clenchÃ©, on annule aussi le timer pour ne pas
    // laisser de ressources pendantes
    signal?.addEventListener("abort", () => clearTimeout(timer), { once: true });
  });

  // â”€â”€ Promise 3 : B7 â€” abort de session â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // RÃ©sout immÃ©diatement si le signal est dÃ©jÃ  aborted,
  // sinon Ã©coute l'Ã©vÃ©nement "abort" pour rejeter sans attendre le timeout.
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

// â”€â”€ Fetch vers le provider â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

async function fetchLLM(messages: OpenAIMessage[], provider: Provider, signal: AbortSignal | undefined): Promise<{ choices: Array<{ message: { content: string } }> }> {
  const isOpenAI = provider === "openai";

  const apiKey = isOpenAI
    ? envServer.OPENAI_API_KEY
    : envServer.MISTRAL_API_KEY;

  if (!apiKey) {
    throw new Error(`ClÃ© API manquante pour le provider: ${provider}`);
  }

  const url = isOpenAI ? OPENAI_API_URL : MISTRAL_API_URL;
  const model = isOpenAI
    ? (envServer.OPENAI_MODEL ?? "gpt-4o-mini")
    : (envServer.MISTRAL_MODEL ?? "mistral-small-latest");

  const response = await fetch(url, {
    method: "POST",
    // B7 : signal transmis au fetch â€” null si absent (RequestInit attend AbortSignal | null)
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
      `${provider} API error: ${response.status} ${response.statusText} â€” ${body.slice(0, 300)}`
    );
    captureError(err, { component: 'llm-strict', provider, model, status: response.status });
    throw err;
  }

  return response.json() as Promise<{ choices: Array<{ message: { content: string } }> }>;
}
