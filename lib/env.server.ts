import { z } from "zod";

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

});

// ── Validation au démarrage ────────────────────────────────────────────────────
function validateEnv() {
  // En mode test, on permet l'exécution sans variables d'environnement obligatoires
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
    // Sépare les erreurs critiques des warnings
    const errors = result.error.errors.filter((e) => {
      const key = e.path[0] as string;
      const field = EnvServerSchema.shape[key as keyof typeof EnvServerSchema.shape];
      // Une variable optionnelle qui échoue = warning, pas crash
      return field && !field.isOptional();
    });

    if (errors.length > 0) {
      const missing = errors
        .map((e) => `  • ${e.path.join(".")} : ${e.message}`)
        .join("\n");

      throw new Error(
        `\n\n❌ Variables d'environnement serveur manquantes :\n${missing}\n\n` +
        `Vérifiez votre .env.local\n`
      );
    }

    // Variables optionnelles invalides → warning uniquement
    if (result.error.errors.length > 0 && process.env.NODE_ENV === "development") {
      console.warn(
        `⚠️  Variables optionnelles invalides :`,
        result.error.errors.map((e) => e.path.join("."))
      );
    }
  }

  return result.data!;
}

export const envServer = validateEnv();
export type EnvServer = z.infer<typeof EnvServerSchema>;
