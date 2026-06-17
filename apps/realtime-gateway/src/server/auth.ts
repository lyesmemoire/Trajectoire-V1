import { createClient } from "@supabase/supabase-js";

export interface VoiceTokenPayload {
  userId: string;
  [key: string]: unknown;
}

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function verifyVoiceToken(token?: string): Promise<VoiceTokenPayload | null> {
  if (!token) return null;

  try {
    const { data, error } = await supabase.auth.getUser(token);
    
    if (error || !data?.user) {
      return null;
    }

    return {
      userId: data.user.id,
      ...data.user.user_metadata,
    };
  } catch {
    return null;
  }
}

