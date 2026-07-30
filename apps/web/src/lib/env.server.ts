import { z } from "zod";
import { logError } from "@/lib/logger/Logger";

const EnvServerSchema = z.object({

  // ── Supabase ───────────────────────────────────────────────────────────────
  NEXT_PUBLIC_SUPABASE_URL: z
    .string()
    .url("NEXT_PUBLIC_SUPABASE_URL doit être une URL valide"),

  SUPABASE_URL: z
    .string()
    .url()
    .optional(), // Alias legacy — préférer NEXT_PUBLIC_SUPABASE_URL

  SUPABASE_ANON_KEY: z
    .string()
    .min(1)
    .optional(),

  NEXT_PUBLIC_SUPABASE_ANON_KEY: z
    .string()
    .min(1, "NEXT_PUBLIC_SUPABASE_ANON_KEY manquante"),

  SUPABASE_SERVICE_ROLE_KEY: z
    .string()
    .min(1, "SUPABASE_SERVICE_ROLE_KEY manquante"),

  // ── LLM ───────────────────────────────────────────────────────────────────
  OPENAI_API_KEY: z
    .string()
    .startsWith("sk-", "OPENAI_API_KEY doit commencer par sk-"),

  OPENAI_BASE_URL: z
    .string()
    .url()
    .optional(), // Proxy OpenAI — optionnel

  MISTRAL_API_KEY: z
    .string()
    .min(1, "MISTRAL_API_KEY manquante"),

  // ── Voice (ElevenLabs) ────────────────────────────────────────────────────
  ELEVENLABS_API_KEY: z
    .string()
    .min(1)
    .optional(),

  ELEVENLABS_VOICE_ID: z
    .string()
    .min(1)
    .optional(),

  VOICE_DEBUG: z
    .string()
    .optional()
    .transform((v) => v === "true"), // "true" → boolean

  // ── Stripe ────────────────────────────────────────────────────────────────
  STRIPE_SECRET_KEY: z
    .string()
    .min(1, "STRIPE_SECRET_KEY manquante"),

  STRIPE_WEBHOOK_SECRET: z
    .string()
    .startsWith("whsec_", "STRIPE_WEBHOOK_SECRET doit commencer par whsec_")
    .optional(),

  STRIPE_PRICE_EARLY: z
    .string()
    .startsWith("price_")
    .optional(),

  STRIPE_PRO_PRICE_ID: z
    .string()
    .startsWith("price_")
    .optional(),

  STRIPE_EXPERT_PRICE_ID: z
    .string()
    .startsWith("price_")
    .optional(),

  STRIPE_PRICE_STARTER_MONTHLY: z
    .string()
    .startsWith("price_")
    .optional(),

  NEXT_PUBLIC_APP_URL: z
    .string()
    .url()
    .optional(),

  // ── Cache Redis / Upstash ─────────────────────────────────────────────────
  UPSTASH_REDIS_REST_URL: z
    .string()
    .url("UPSTASH_REDIS_REST_URL doit être une URL valide")
    .optional(),

  UPSTASH_REDIS_REST_TOKEN: z
    .string()
    .min(1)
    .optional(),

  REDIS_URL: z
    .string()
    .url()
    .optional(),

  // ── Email ─────────────────────────────────────────────────────────────────
  RESEND_API_KEY: z
    .string()
    .startsWith("re_", "RESEND_API_KEY doit commencer par re_")
    .optional(),

  // ── Notifications ─────────────────────────────────────────────────────────
  SLACK_WEBHOOK_URL: z
    .string()
    .url()
    .optional(),

  // ── Sécurité / Fraud ──────────────────────────────────────────────────────
  IPQS_KEY: z
    .string()
    .min(1)
    .optional(), // IP Quality Score — fraud detection

  ABSTRACT_KEY: z
    .string()
    .min(1)
    .optional(), // Abstract API — email validation ou autre

  // ── WebRTC ────────────────────────────────────────────────────────────────
  TURN_URL: z
    .string()
    .url()
    .optional(), // TURN server pour entretien vocal WebRTC

  // ── Database ──────────────────────────────────────────────────────────────
  DATABASE_URL: z
    .string()
    .url()
    .optional(), // Prisma — legacy ou parallel à Supabase

  // ── Cron / Jobs ───────────────────────────────────────────────────────────
  CRON_SECRET: z
    .string()
    .min(1)
    .optional(),

  // ── Analytics ─────────────────────────────────────────────────────────────
  POSTHOG_API_KEY: z
    .string()
    .startsWith("phc_")
    .optional(),

  // ── Deepgram (STT alternatif) ─────────────────────────────────────────────
  DEEPGRAM_API_KEY: z
    .string()
    .min(1)
    .optional(),

  // ── Runtime ───────────────────────────────────────────────────────────────
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),

  PORT: z
    .string()
    .optional()
    .transform((v) => (v ? parseInt(v, 10) : 3000)),

  CI: z
    .string()
    .optional()
    .transform((v) => v === "true" || v === "1"),

  // ── Flags expérimentaux (à documenter) ────────────────────────────────────
  // STORE : usage inconnu — à investiguer avant de typer
  STORE: z
    .string()
    .optional(),

  // ── Sentry ────────────────────────────────────────────────────────────────
  SENTRY_DSN: z
    .string()
    .url()
    .optional(),

  SENTRY_AUTH_TOKEN: z
    .string()
    .min(1)
    .optional(),

  SENTRY_ORG: z
    .string()
    .min(1)
    .optional(),

  SENTRY_PROJECT: z
    .string()
    .min(1)
    .optional(),

  LOG_LEVEL: z
    .string()
    .optional()
    .default("info"),

});

// ── Validation au démarrage ────────────────────────────────────────────────────
function validateEnv() {
  const result = EnvServerSchema.safeParse(process.env);

  if (!result.success) {
    const missingKeys = result.error.issues
      .map((e: z.ZodIssue) => e.path.join("."))
      .join(", ");
    logError(
      `[ENV SERVER] Variables invalides ou manquantes : ${missingKeys}`,
      { issues: result.error.issues.map((e: z.ZodIssue) => `  - ${e.path.join(".")} : ${e.message}`).join("\n") }
    );

    if (process.env.NODE_ENV === "production") {
      throw new Error(`[ENV SERVER] Missing environment variables: ${missingKeys}`);
    }
  }

  return result.data ?? ({} as z.infer<typeof EnvServerSchema>);
}

export const envServer = validateEnv();
export type EnvServer = z.infer<typeof EnvServerSchema>;
