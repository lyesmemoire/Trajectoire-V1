// lib/supabase/service.ts
// Client service role — RLS DÉSACTIVÉ — pour admin/cron/webhooks UNIQUEMENT
//
// RÈGLE : Ce client ne doit JAMAIS être utilisé dans une route qui reçoit
// une requête directe d'un utilisateur final. Uniquement :
//   - Routes /api/admin/*
//   - Routes /api/cron/*
//   - Webhooks Stripe
//   - Backend realtime-gateway
//   - Scripts d'administration
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { envServer } from "@/lib/env.server";
// Singleton — une seule instance par process
let adminClient = null;
export function createAdminClient() {
    if (adminClient)
        return adminClient;
    adminClient = createSupabaseClient(envServer.NEXT_PUBLIC_SUPABASE_URL, envServer.SUPABASE_SERVICE_ROLE_KEY, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
            detectSessionInUrl: false,
        },
    });
    return adminClient;
}
//# sourceMappingURL=service.js.map