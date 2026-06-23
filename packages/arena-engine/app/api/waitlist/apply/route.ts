import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, pressureType, weakness, intentReason, isWillingToRetry } =
      body;

    if (!email)
      return NextResponse.json({ error: "Email requis" }, { status: 400 });

    const entry = await prisma.waitlistEntry.upsert({
      where: { email },
      update: {
        pressureType,
        weakness,
        intentReason,
        isWillingToRetry,
        status: "PENDING",
      },
      create: {
        email,
        pressureType,
        weakness,
        intentReason,
        isWillingToRetry,
        status: "PENDING",
      },
    });

    return NextResponse.json({ success: true, entry });
  } catch (error: any) {
    console.error("[Waitlist API Error]:", error);
    return NextResponse.json(
      { error: "Erreur lors de la demande d'accès" },
      { status: 500 },
    );
  }
}
