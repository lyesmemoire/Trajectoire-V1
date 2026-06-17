import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import {
  getOrCreateRequestId,
  attachRequestId,
} from "@/lib/security/request-id";

export async function middleware(request: NextRequest) {
  const requestId = getOrCreateRequestId(request);
  const response = (await updateSession(request)) as NextResponse;
  // Attach both lowercase and capitalized headers for compatibility
  attachRequestId(response, requestId);
  response.headers.set("X-Request-ID", requestId);
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
