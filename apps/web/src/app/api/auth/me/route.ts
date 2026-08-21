import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return NextResponse.json({ authenticated: false, error: "Supabase env missing" }, { status: 500 });
  }

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: () => {},
    },
  });

  const { data } = await supabase.auth.getUser();
  const user = data.user;

  return NextResponse.json({
    authenticated: Boolean(user),
    user: user ? { id: user.id, email: user.email } : null,
  });
}
