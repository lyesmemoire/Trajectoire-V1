// @ts-nocheck
export interface EnvConfig {
  readonly OPENAI_API_KEY: string;
  readonly GROQ_API_KEY: string;
  readonly DEEPGRAM_API_KEY: string;
  readonly ELEVENLABS_API_KEY: string;
  readonly SUPABASE_URL: string;
  readonly SUPABASE_SERVICE_ROLE_KEY: string;
}

export class EnvironmentConfigurationProvider {
  public get(): EnvConfig {
    const getVar = (name: string): string => {
      const val = process.env[name];
      if (!val) {
        throw new Error(`Missing required environment variable: ${name}`);
      }
      return val;
    };

    return {
      OPENAI_API_KEY: getVar("OPENAI_API_KEY"),
      GROQ_API_KEY: getVar("GROQ_API_KEY"),
      DEEPGRAM_API_KEY: getVar("DEEPGRAM_API_KEY"),
      ELEVENLABS_API_KEY: getVar("ELEVENLABS_API_KEY"),
      SUPABASE_URL: getVar("SUPABASE_URL"),
      SUPABASE_SERVICE_ROLE_KEY: getVar("SUPABASE_SERVICE_ROLE_KEY"),
    };
  }
}
