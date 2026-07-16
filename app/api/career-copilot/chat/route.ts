import { NextRequest, NextResponse } from "next/server";
import { getStrictUser } from "@/lib/auth/get-user";

// Redirect legacy career-copilot API to new copilot API
export async function POST(req: NextRequest) {
  try {
    const user = await getStrictUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Redirect to new API
    const newUrl = new URL("/api/copilot/chat", req.url);
    return NextResponse.redirect(newUrl, 307);
  } catch (error) {
    console.error("[Career Copilot API Redirect] Error", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
