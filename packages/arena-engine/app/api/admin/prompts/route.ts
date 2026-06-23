import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { type, content, version } = await req.json();

    const supabase = await createSupabaseServerClient();

    // Désactiver l'ancien prompt actif pour ce type
    await supabase
      .from("prompt_versions")
      .update({ active: false })
      .eq("type", type);

    // Créer le nouveau prompt actif
    const { data, error } = await supabase
      .from("prompt_versions")
      .insert({
        type,
        content,
        version,
        active: true,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
