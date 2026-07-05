import { NextRequest, NextResponse } from "next/server";
import { createAdminClientSupabase } from "@/lib/supabase/admin";
import crypto from "crypto";
import { getStrictUser } from "@/lib/auth/session-logic";
import { z } from "zod";

const RestoreCreditsSchema = z.object({
  user_id: z.string().uuid(),
  amount: z.number().int().positive(),
});

export async function POST(req: NextRequest) {
  const { user, isAdmin } = await getStrictUser();
  if (!user || !isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const bodyResult = RestoreCreditsSchema.safeParse(await req.json());
  if (!bodyResult.success) {
    return NextResponse.json(
      { error: "Paramètres valides requis" },
      { status: 400 },
    );
  }
  const { user_id, amount } = bodyResult.data;

  const supabase = createAdminClientSupabase();

  const { error } = await supabase.rpc("apply_credit_transaction", {
    user_id_input: user_id,
    type_input: "credit",
    amount_input: amount,
    reason_input: "admin_restore",
    reference_input: crypto.randomUUID(),
  });

  if (error) {
    console.error("Restore credits error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    message: `${amount} crédits restaurés`,
  });
}
