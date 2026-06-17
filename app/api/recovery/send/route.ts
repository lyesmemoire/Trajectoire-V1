export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth";
import {
  sendRecoveryEmail,
  RecoveryEmailInput,
} from "@/lib/engagement/resend-coaching";

export async function POST(req: NextRequest) {
  try {
    const admin = await getAuthenticatedUser();

    // Auth admin check
    if (!admin || admin.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = (await req.json()) as RecoveryEmailInput;

    if (!body.userId || !body.email) {
      return NextResponse.json(
        { error: "userId et email requis" },
        { status: 400 },
      );
    }

    const result = await sendRecoveryEmail(body);

    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    console.error("[Recovery Email API Error]:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
