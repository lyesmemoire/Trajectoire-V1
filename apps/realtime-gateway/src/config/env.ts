import { z } from "zod";

const httpUrl = z
  .string()
  .url()
  .refine(
    (value) => {
      const protocol = new URL(value).protocol;
      return protocol === "http:" || protocol === "https:";
    },
    "must use http or https",
  );

const optionalNonEmptyString = z.string().trim().min(1).optional();

const optionalHttpUrl = httpUrl.optional();

const envSchemaBase = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),

  PORT: z.string().default("3000"),

  HOST: z.string().trim().min(1).default("0.0.0.0"),

  LOG_LEVEL: optionalNonEmptyString,

  FRONTEND_URL: optionalHttpUrl,

  ALLOWED_ORIGINS: optionalNonEmptyString,

  SUPABASE_URL: z.string().url().optional(),

  SUPABASE_SERVICE_ROLE_KEY: optionalNonEmptyString,

  OPENAI_API_KEY: optionalNonEmptyString,

  OPENAI_MODEL: optionalNonEmptyString,

  MISTRAL_API_KEY: optionalNonEmptyString,

  MISTRAL_MODEL: optionalNonEmptyString,

  DEEPGRAM_API_KEY: optionalNonEmptyString,

  STRIPE_SECRET_KEY: optionalNonEmptyString,

  STRIPE_WEBHOOK_SECRET: optionalNonEmptyString,

  STRIPE_PRICE_PRO_ID: optionalNonEmptyString,

  UPSTASH_REDIS_REST_URL: z.string().url().optional(),

  UPSTASH_REDIS_REST_TOKEN: optionalNonEmptyString,

  SLACK_ALERT_WEBHOOK_URL: z.string().url().optional(),

  ALERT_EMAIL_TO: optionalNonEmptyString,

  RESEND_API_KEY: optionalNonEmptyString,

  RENDER_INSTANCE_ID: optionalNonEmptyString,

  STRESS_TEST_BYPASS: optionalNonEmptyString,

  TURN_URL: optionalNonEmptyString,

  TURN_USERNAME: optionalNonEmptyString,

  TURN_PASSWORD: optionalNonEmptyString,
});

export const envSchema = envSchemaBase.superRefine((env, ctx) => {
  if (env.NODE_ENV !== "production") {
    return;
  }

  if (!env.FRONTEND_URL) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["FRONTEND_URL"],
      message: "is required in production",
    });
  }

  if (!env.ALLOWED_ORIGINS?.trim()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["ALLOWED_ORIGINS"],
      message: "is required in production",
    });
  } else {
    const origins = env.ALLOWED_ORIGINS
      .split(",")
      .map((origin) => origin.trim())
      .filter(Boolean);

    if (origins.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["ALLOWED_ORIGINS"],
        message: "must contain at least one origin",
      });
    }

    for (const origin of origins) {
      try {
        const parsed = new URL(origin);

        if (!["http:", "https:"].includes(parsed.protocol)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["ALLOWED_ORIGINS"],
            message: "must contain only http(s) origins",
          });
          break;
        }

        if (
          parsed.hostname === "localhost" ||
          parsed.hostname === "127.0.0.1" ||
          parsed.hostname === "::1"
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["ALLOWED_ORIGINS"],
            message: "must not contain localhost in production",
          });
          break;
        }
      } catch {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["ALLOWED_ORIGINS"],
          message: "contains an invalid URL",
        });
        break;
      }
    }
  }

  if (!env.SUPABASE_URL) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["SUPABASE_URL"],
      message: "is required in production",
    });
  }

  if (!env.SUPABASE_SERVICE_ROLE_KEY) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["SUPABASE_SERVICE_ROLE_KEY"],
      message: "is required in production",
    });
  }

  if (!env.STRIPE_SECRET_KEY) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["STRIPE_SECRET_KEY"],
      message: "is required in production",
    });
  }

  const hasRedisUrl = Boolean(env.UPSTASH_REDIS_REST_URL);
  const hasRedisToken = Boolean(env.UPSTASH_REDIS_REST_TOKEN);

  if (hasRedisUrl !== hasRedisToken) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["UPSTASH_REDIS_REST_URL"],
      message:
        "UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN must be configured together",
    });
  }
});

export type Env = z.infer<typeof envSchema>;

function formatEnvErrors(
  issues: z.ZodIssue[],
): string {
  return issues
    .map((issue) => {
      const path = issue.path.length > 0
        ? issue.path.join(".")
        : "environment";

      return `${path}: ${issue.message}`;
    })
    .join("; ");
}

function loadEnv(): Env {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    throw new Error(
      `[realtime-gateway] Invalid environment: ${formatEnvErrors(
        result.error.issues,
      )}`,
    );
  }

  return result.data;
}

/**
 * Runtime environment owned by realtime-gateway.
 *
 * Keep the envServer export name temporarily so existing gateway modules
 * can migrate away from the repository-level lib/env.server.ts without
 * requiring unrelated business-logic changes.
 */
export const envServer = loadEnv();