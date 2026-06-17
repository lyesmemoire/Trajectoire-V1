import { NextRequest, NextResponse } from "next/server";
import { BillingService } from "@/lib/db/billing.service";
import { createServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const supabase = await createServerClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const balance = await BillingService.getBalance(user.id);
    
    // We could fetch the plan from UserService as well if needed. For now, default to "free"
    // or fetch it if there's a plan column in profiles.
    return NextResponse.json({ balance, plan: "free" });
  } catch (error) {
    console.error("[API/Billing/Balance] Error fetching balance:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
