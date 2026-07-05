import { envServer } from "../../../../lib/env.server.js";
import { createClient } from "@supabase/supabase-js";

export interface VoiceTokenPayload {
  userId: string;
  [key: string]: unknown;
}

const supabase = createClient(
  envServer.SUPABASE_URL || envServer.NEXT_PUBLIC_SUPABASE_URL,
  envServer.SUPABASE_SERVICE_ROLE_KEY
);

export async function verifyVoiceToken(token?: string): Promise<VoiceTokenPayload | null> {
  // DEV bypass for local testing without Supabase
  if (process.env.NODE_ENV === "development") {
    return {
      userId: "00000000-0000-0000-0000-000000000000",
      tenantId: "dev-tenant"
    };
  }

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

