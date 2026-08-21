import { z } from "zod";

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
    .startsWith("sk-", "OPENAI_API_KEY doit commencer par sk-"),

  OPENAI_BASE_URL: z
    .string()
    .url()
    .optional(), // Proxy OpenAI â€” optionnel

  MISTRAL_API_KEY: z
    .string()
    .min(1, "MISTRAL_API_KEY manquante"),

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

  // ——— Realtime-gateway extra env (compat) ———
  LOG_LEVEL: z.string().optional(),
  HOST: z.string().optional(),
  STRESS_TEST_BYPASS: z.string().optional(),
  OPENAI_MODEL: z.string().optional(),
  MISTRAL_MODEL: z.string().optional(),
  FRONTEND_URL: z.string().url().optional(),
  STRIPE_PRICE_PRO_ID: z.string().startsWith("price_").optional(),
  SLACK_ALERT_WEBHOOK_URL: z.string().url().optional(),
  ALERT_EMAIL_TO: z.string().optional(),
  RENDER_INSTANCE_ID: z.string().optional(),

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

});

// â”€â”€ Validation au dÃ©marrage â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function validateEnv() {
  // En mode test, on permet l'exÃ©cution sans variables d'environnement obligatoires
  const isTest = process.env.NODE_ENV === "test" || process.env.VITEST === "true";
  
  if (isTest) {
    // Retourne un objet dummy pour les tests
    return {
      NEXT_PUBLIC_SUPABASE_URL: "https://test.supabase.co",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: "test-anon-key",
      OPENAI_API_KEY: "sk-test-key",
      MISTRAL_API_KEY: "test-mistral-key",
      STRIPE_SECRET_KEY: "sk-test-stripe-key",
      SUPABASE_SERVICE_ROLE_KEY: "test-service-role-key",
      NODE_ENV: "test" as const,
      PORT: 3000,
    } as z.infer<typeof EnvServerSchema>;
  }

  const result = EnvServerSchema.safeParse(process.env);

  if (!result.success) {
    // SÃ©pare les erreurs critiques des warnings
    const errors = result.error.errors.filter((e) => {
      const key = e.path[0] as string;
      const field = EnvServerSchema.shape[key as keyof typeof EnvServerSchema.shape];
      // Une variable optionnelle qui Ã©choue = warning, pas crash
      return field && !field.isOptional();
    });

    if (errors.length > 0) {
      const missing = errors
        .map((e) => `  â€¢ ${e.path.join(".")} : ${e.message}`)
        .join("\n");

      throw new Error(
        `\n\nâŒ Variables d'environnement serveur manquantes :\n${missing}\n\n` +
        `VÃ©rifiez votre .env.local\n`
      );
    }

    // Variables optionnelles invalides â†’ warning uniquement
    if (result.error.errors.length > 0 && process.env.NODE_ENV === "development") {
      console.warn(
        `âš ï¸  Variables optionnelles invalides :`,
        result.error.errors.map((e) => e.path.join("."))
      );
    }
  }

  return result.data!;
}

export const envServer = validateEnv();
export type EnvServer = z.infer<typeof EnvServerSchema>;
