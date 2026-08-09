import { createSupabaseServerClient } from "@/lib/supabase/server";
export async function requireCVEditor(userId) {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
        .from("profiles")
        .select("cv_editor_completed")
        .eq("id", userId)
        .single();
    if (error || !data || data.cv_editor_completed !== true) {
        return {
            success: false,
        };
    }
    return {
        success: true,
    };
}
//# sourceMappingURL=require-cv-editor.js.map