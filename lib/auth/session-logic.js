import { createSupabaseServerClient } from "../supabase-server";
/**
 * Source de vérité absolue pour l'identité utilisateur côté serveur.
 * Ignore la session locale et valide directement avec Supabase Auth.
 */
export async function getStrictUser() {
    const supabase = await createSupabaseServerClient();
    // ✅ Jamais getSession(), toujours getUser() pour les données sensibles
    const { data: { user }, error: authError, } = await supabase.auth.getUser();
    if (authError || !user) {
        return { user: null, profile: null, error: "Unauthorized" };
    }
    // ✅ Récupération du profil et des permissions
    const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("plan, credits, role, full_name")
        .eq("id", user.id)
        .single();
    if (profileError) {
        console.error("[Auth] Profile fetch error:", profileError);
    }
    const adminRoles = ["ADMIN_SUPPORT", "ADMIN_PRODUCT", "ADMIN_FOUNDER"];
    return {
        user,
        profile,
        isAdmin: profile?.role ? adminRoles.includes(profile.role) : false,
        isPro: profile?.plan === "PRO" || profile?.plan === "EXPERT",
    };
}
/**
 * Valide l'accès à un Replay spécifique.
 * Anti-énumération et validation d'ownership stricte.
 */
export async function validateReplayAccess(sessionId) {
    const { user } = await getStrictUser();
    if (!user)
        return false;
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
        .from("interview_sessions")
        .select("user_id")
        .eq("id", sessionId)
        .single();
    if (error || !data)
        return false;
    // Validation d'ownership stricte
    return data.user_id === user.id;
}
//# sourceMappingURL=session-logic.js.map