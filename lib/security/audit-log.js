import "server-only";
import { createSupabaseServiceClient } from "@/lib/supabase/service-client";
export async function logEvent(userId, action, details = {}, ip, userAgent, requestId) {
    try {
        const supabase = createSupabaseServiceClient();
        await supabase.from("audit_logs").insert({
            user_id: userId,
            action,
            details,
            ip,
            user_agent: userAgent,
            request_id: requestId,
            created_at: new Date().toISOString(),
        });
    }
    catch (error) {
        console.error("[AUDIT_LOG_ERROR]", error);
    }
}
//# sourceMappingURL=audit-log.js.map