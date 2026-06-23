export const dynamic = "force-dynamic";

import { z } from "zod";
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

    const RequestSchema = z.object({
      userId: z.string().uuid("userId doit être un UUID valide"),
      email:  z.string().email("Email invalide"),
    });

    const parsed = RequestSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Paramètres invalides.", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const body = parsed.data as unknown as RecoveryEmailInput;

    const result = await sendRecoveryEmail(body);

    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    console.error("[Recovery Email API Error]:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
