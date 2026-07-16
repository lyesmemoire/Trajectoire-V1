// @ts-nocheck
export interface BootstrapConfig {
  readonly OPENAI_API_KEY: string;
  readonly GROQ_API_KEY: string;
  readonly DEEPGRAM_API_KEY: string;
  readonly ELEVENLABS_API_KEY: string;
  readonly ELEVENLABS_VOICE_ID: string;
  readonly SUPABASE_URL: string;
  readonly SUPABASE_SERVICE_ROLE_KEY: string;
}

export function loadAndValidateConfig(): BootstrapConfig {
  const required = [
    "OPENAI_API_KEY",
    "GROQ_API_KEY",
    "DEEPGRAM_API_KEY",
    "ELEVENLABS_API_KEY",
    "ELEVENLABS_VOICE_ID",
    "SUPABASE_URL",
    "SUPABASE_SERVICE_ROLE_KEY"
  ] as const;

  const missing: string[] = [];

  for (const key of required) {
    if (!process.env[key]) {
      missing.push(key);
    }
  }

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }

  return {
    OPENAI_API_KEY: process.env["OPENAI_API_KEY"]!,
    GROQ_API_KEY: process.env["GROQ_API_KEY"]!,
    DEEPGRAM_API_KEY: process.env["DEEPGRAM_API_KEY"]!,
    ELEVENLABS_API_KEY: process.env["ELEVENLABS_API_KEY"]!,
    ELEVENLABS_VOICE_ID: process.env["ELEVENLABS_VOICE_ID"]!,
    SUPABASE_URL: process.env["SUPABASE_URL"]!,
    SUPABASE_SERVICE_ROLE_KEY: process.env["SUPABASE_SERVICE_ROLE_KEY"]!
  };
}
