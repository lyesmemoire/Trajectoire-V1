import { z } from "zod";
import { logError } from "@/lib/logger/Logger";

const EnvServerSchema = z.object({

  // â”€â”€ Supabase â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  NEXT_PUBLIC_SUPABASE_URL: z
    .string()
    .url("NEXT_PUBLIC_SUPABASE_URL doit Ãªtre une URL valide"),

  SUPABASE_URL: z
    .string()
    .url()
    .optional(), // Alias legacy â€” prÃ©fÃ©rer NEXT_PUBLIC_SUPABASE_URL

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

  // â”€â”€ LLM â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  OPENAI_API_KEY: z
  .string()
  .startsWith("sk-", "OPENAI_API_KEY doit commencer par sk-")
  .optional(),

OPENAI_BASE_URL: z
  .string()
  .url()
  .optional(),

  // â”€â”€ Voice (ElevenLabs) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
    .transform((v) => v === "true"), // "true" â†’ boolean

  // â”€â”€ Stripe â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

  STRIPE_PRICE_INTERVIEW_PACK: z
    .string()
    .startsWith("price_")
    .optional(),

  NEXT_PUBLIC_APP_URL: z
    .string()
    .url()
    .optional(),

  // â”€â”€ Cache Redis / Upstash â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  UPSTASH_REDIS_REST_URL: z
    .string()
    .url("UPSTASH_REDIS_REST_URL doit Ãªtre une URL valide")
    .optional(),

  UPSTASH_REDIS_REST_TOKEN: z
    .string()
    .min(1)
    .optional(),

  REDIS_URL: z
    .string()
    .url()
    .optional(),

  // â”€â”€ Email â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  RESEND_API_KEY: z
    .string()
    .startsWith("re_", "RESEND_API_KEY doit commencer par re_")
    .optional(),

  // â”€â”€ Notifications â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  SLACK_WEBHOOK_URL: z
    .string()
    .url()
    .optional(),

  // â”€â”€ SÃ©curitÃ© / Fraud â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  IPQS_KEY: z
    .string()
    .min(1)
    .optional(), // IP Quality Score â€” fraud detection

  ABSTRACT_KEY: z
    .string()
    .min(1)
    .optional(), // Abstract API â€” email validation ou autre

  // â”€â”€ WebRTC â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  TURN_URL: z
    .string()
    .url()
    .optional(), // TURN server pour entretien vocal WebRTC

  // â”€â”€ Database â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  DATABASE_URL: z
    .string()
    .url()
    .optional(), // Prisma â€” legacy ou parallel Ã  Supabase

  // â”€â”€ Cron / Jobs â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  CRON_SECRET: z
    .string()
    .min(1)
    .optional(),

  // â”€â”€ Analytics â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  POSTHOG_API_KEY: z
    .string()
    .startsWith("phc_")
    .optional(),

  // â”€â”€ Deepgram (STT alternatif) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  DEEPGRAM_API_KEY: z
    .string()
    .min(1)
    .optional(),

  // â”€â”€ Runtime â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

  // â”€â”€ Flags expÃ©rimentaux (Ã  documenter) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // STORE : usage inconnu â€” Ã  investiguer avant de typer
  STORE: z
    .string()
    .optional(),

  // â”€â”€ Sentry â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

// â”€â”€ Validation au dÃ©marrage â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function validateEnv() {
  if (process.env.SKIP_ENV_VALIDATION === "1" || process.env.SKIP_ENV_VALIDATION === "true") {
    return process.env as any;
  }

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
