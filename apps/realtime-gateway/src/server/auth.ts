import { envServer } from "../config/env.js";
import { createClient } from "@supabase/supabase-js";

export interface VoiceTokenPayload {
  userId: string;
  [key: string]: unknown;
}

const supabase = createClient(
  envServer.SUPABASE_URL,
  envServer.SUPABASE_SERVICE_ROLE_KEY
);

export async function verifyVoiceToken(token?: _string): Promise<VoiceTokenPayload | null> {
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

