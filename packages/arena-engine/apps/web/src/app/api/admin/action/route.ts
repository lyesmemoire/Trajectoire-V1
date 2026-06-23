export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import crypto from "crypto";

const AdminActionSchema = z.object({
  action: z.enum([
    "ENGINE_DISABLE",
    "ENGINE_ENABLE",
    "SET_BUDGET_LIMIT",
    "UPDATE_THRESHOLD"
  ]),
  payload: z.record(z.string(), z.any()),
});

function hashValue(value: string): string {
  return crypto.createHash("sha256").update(value).digest("hex");
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // 1. Auth check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Check role = 'admin'
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("user_id", user.id)
      .single();

    if (!profile || profile.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // 3. Validate payload
    const body = await request.json();
    const parsed = AdminActionSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid action schema" }, { status: 400 });
    }

    const { action, payload } = parsed.data;

    // 4. Hash IP and User Agent
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const userAgent = request.headers.get("user-agent") || "unknown";
    const ipHash = hashValue(ip);
    const uaHash = hashValue(userAgent);

    // 5. Log the action FIRST — never execute without audit trail
    const { error: logError } = await supabase
      .from("admin_actions_log")
      .insert({
        admin_user_id: user.id,
        action,
        payload,
        ip_hash: ipHash,
        user_agent_hash: uaHash
      });

    if (logError) {
      console.error("[ADMIN_AUDIT_ERROR] Failed to log action", logError);
      return NextResponse.json({ error: "Audit trail failed. Action aborted." }, { status: 500 });
    }

    // 6. Execute action
    let result: Record<string, unknown> | null = null;

    if (action === "ENGINE_DISABLE" || action === "ENGINE_ENABLE") {
      const enabled = action === "ENGINE_ENABLE";
      const { error } = await supabase
        .from("engine_settings")
        .update({ engine_enabled: enabled })
        .eq("id", "default");
        
      if (error) throw error;
      result = { engine_enabled: enabled };
    } else if (action === "SET_BUDGET_LIMIT") {
      const dailyLimit = payload.daily_limit;
      result = { updated: true, daily_limit: dailyLimit };
    } else if (action === "UPDATE_THRESHOLD") {
      const thresholdKey = String(payload.key);
      const thresholdValue = payload.value;
      result = { updated: true, key: thresholdKey, value: thresholdValue };
    }

    // 7. Return success
    return NextResponse.json({ success: true, result });
  } catch (error: unknown) {
    console.error("[ADMIN_ACTION_ERROR]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
