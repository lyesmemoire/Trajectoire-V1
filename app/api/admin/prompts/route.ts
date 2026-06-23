import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
    }

    const supabase = await createSupabaseServerClient();
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "ADMIN") {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }

    const RequestSchema = z.object({
      type:    z.string().min(1).max(100),
      content: z.string().min(1).max(20000),
      version: z.string().min(1).max(50),
    });

    const parsed = RequestSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Paramètres invalides.", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const { type, content, version } = parsed.data;

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
