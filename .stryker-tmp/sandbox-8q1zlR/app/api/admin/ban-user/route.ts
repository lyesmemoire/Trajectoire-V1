// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";
import { createAdminClientSupabase } from "@/lib/supabase/admin";
import { getStrictUser } from "@/lib/auth/session-logic";
import { z } from "zod";

const BanUserSchema = z.object({
  user_id: z.string().uuid(),
});

export async function POST(req: NextRequest) {
  const { user, isAdmin } = await getStrictUser();
  if (!user || !isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const bodyResult = BanUserSchema.safeParse(await req.json());
  if (!bodyResult.success) {
    return NextResponse.json(
      { error: "user_id valide requis" },
      { status: 400 },
    );
  }
  const { user_id } = bodyResult.data;

  const supabase = createAdminClientSupabase();

  const { error } = await supabase
    .from("profiles")
    .update({ banned: true })
    .eq("id", user_id);

  if (error) {
    console.error("Ban error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
