import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { requireAuth } from "@/lib/auth";

export async function POST() {
  try {
    const user = await requireAuth();
    const supabase = await createSupabaseServerClient();

    const { error } = await supabase
      .from("profiles")
      .update({ cv_editor_completed: true })
      .eq("id", user.id);

    if (error) {
      console.error("[SET_CV_EDITOR_COMPLETED]", error);
      return NextResponse.json(
        { error: "Unable to update profile" },
        { status: 500 },
      );
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set("cv-editor-completed", "true", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24,
    });
    return response;
  } catch (error) {
    console.error("[CV_EDITOR_COMPLETION_API]", error);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
