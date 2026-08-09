import { NextResponse } from 'next/server';
import { createServerClient } from "@supabase/ssr";
/**
 * Middleware de sécurité pour l'authentification et la continuité cognitive.
 * Assure le rafraîchissement des tokens sur chaque route protégée.
 */
export async function updateSession(request) {
    let supabaseResponse = NextResponse.next({
        request,
    });
    const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL || "https://dummy.supabase.co", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "dummy", {
        cookies: {
            getAll() {
                return request.cookies.getAll();
            },
            setAll(cookiesToSet) {
                cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));
                supabaseResponse = NextResponse.next({
                    request,
                });
                cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options));
            },
        },
    });
    // ✅ Utilisation de getUser() conformément aux recommandations de sécurité
    const { data: { user }, } = await supabase.auth.getUser();
    const pathname = request.nextUrl.pathname;
    // =============================
    // CV EDITOR FLOW GUARD
    // =============================
    // Guard for interview lab – ensure user completed CV editor flow (cookie only)
    if (pathname.startsWith("/interview-lab") &&
        !pathname.startsWith("/cv-editor")) {
        const cookieCompleted = request.cookies.get("cv-editor-completed")?.value === "true";
        if (!cookieCompleted) {
            return NextResponse.redirect(new URL("/cv-editor", request.url));
        }
    }
    const PROTECTED_ROUTES = [
        "/dashboard",
        "/interview-lab",
        "/truth-tunnel",
        "/premium",
        "/settings",
        "/admin",
        "/onboarding",
        "/cv-editor",
    ];
    const PROTECTED_API_ROUTES = [
        "/api/interview",
        "/api/premium",
        "/api/truth-tunnel",
        "/api/cv",
    ];
    const isProtectedRoute = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
    const isProtectedApiRoute = PROTECTED_API_ROUTES.some((route) => pathname.startsWith(route));
    if (!user) {
        if (isProtectedApiRoute) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        if (isProtectedRoute) {
            const url = request.nextUrl.clone();
            url.pathname = "/auth/login";
            // Préserver le chemin exact comme paramètre de redirection
            url.searchParams.set("redirect", pathname);
            return NextResponse.redirect(url);
        }
    }
    // Protection Role Admin strict
    if (user && pathname.startsWith("/admin")) {
        const { _data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .single();
        const adminRoles = ["ADMIN_SUPPORT", "ADMIN_PRODUCT", "ADMIN_FOUNDER"];
        if (!profile?.role || !adminRoles.includes(profile.role)) {
            return NextResponse.redirect(new URL("/dashboard", request.url));
        }
    }
    return supabaseResponse;
}
//# sourceMappingURL=middleware.js.map