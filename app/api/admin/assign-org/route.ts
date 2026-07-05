import { NextRequest, NextResponse } from "next/server";
import { createAdminClientSupabase } from "@/lib/supabase/admin";
import { getStrictUser } from "@/lib/auth/session-logic";
import { z } from "zod";

const AssignOrgSchema = z.object({
  target_user_id: z.string().uuid(),
  organization_id: z.string().uuid(),
});

export async function POST(req: NextRequest) {
  try {
    const { user, isAdmin } = await getStrictUser();

    if (!user || !isAdmin) {
      return NextResponse.json(
        { error: "Accès refusé. Admin requis." },
        { status: 403 },
      );
    }

    const bodyResult = AssignOrgSchema.safeParse(await req.json());
    if (!bodyResult.success) {
      return NextResponse.json(
        { error: "Paramètres valides requis" },
        { status: 400 },
      );
    }
    const { target_user_id, organization_id } = bodyResult.data;

    // Use admin client to perform the update bypassing RLS if needed, or if the admin policy allows it
    const supabaseAdmin = createAdminClientSupabase();

    // Check if organization exists
    const { data: org, error: orgError } = await supabaseAdmin
      .from("organizations")
      .select("id")
      .eq("id", organization_id)
      .single();

    if (orgError || !org) {
      return NextResponse.json(
        { error: "Organisation introuvable" },
        { status: 404 },
      );
    }

    // Assign user to organization
    const { error: updateError } = await supabaseAdmin
      .from("profiles")
      .update({ organization_id })
      .eq("id", target_user_id);

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json({
      success: true,
      message: "Utilisateur assigné à l'organisation avec succès.",
    });
  } catch (error) {
    console.error("[Admin Assign Org] Error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
