import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/service";
import { getStrictUser } from "@/lib/auth/session-logic";
import { z } from "zod";

const UnflagUserSchema = z.object({
  user_id: z.string().uuid(),
});

export async function POST(req: NextRequest) {
  const { user, isAdmin } = await getStrictUser();
  if (!user || !isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const bodyResult = UnflagUserSchema.safeParse(await req.json());
  if (!bodyResult.success) {
    return NextResponse.json(
      { error: "user_id valide requis" },
      { status: 400 },
    );
  }
  const { user_id } = bodyResult.data;

  const supabase = createAdminClient();

  const { error } = await supabase
    .from("user_risk_scores")
    .update({ fraud_flag: false, risk_score: 0, flags: [] })
    .eq("user_id", user_id);

  if (error) {
    console.error("Unflag error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
