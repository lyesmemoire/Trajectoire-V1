import { NextResponse } from "next/server";

export async function POST(request: Request) {
  // Call the logout API
  const response = await fetch(new URL("/api/logout", request.url), {
    method: "POST",
  });

  // Forcer la redirection vers la page d'accueil avec revalidation
  // Clear cv-editor flow cookie
  const redirectResponse = NextResponse.redirect(new URL("/", request.url));
  redirectResponse.cookies.set("cv-editor-completed", "", { path: "/", maxAge: 0 });
  return redirectResponse;
}

export async function GET(request: Request) {
  return POST(request);
}
