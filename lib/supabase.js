// lib/supabase.ts
// Client browser — utilisé dans les composants 'use client' uniquement
import { createBrowserClient } from "@supabase/ssr";
export function createClient() {
    return createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL || "https://dummy.supabase.co", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "dummy");
}
//# sourceMappingURL=supabase.js.map