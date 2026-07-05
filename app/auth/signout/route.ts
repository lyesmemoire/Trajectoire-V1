import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createServerClient();
  await supabase.auth.signOut();

  // Forcer la redirection vers la page d'accueil avec revalidation
  // Clear cv-editor flow cookie
  const response = NextResponse.redirect(new URL("/", request.url));
  response.cookies.set("cv-editor-completed", "", { path: "/", maxAge: 0 });
  return response;
}

export async function GET(request: Request) {
  return POST(request);
}
