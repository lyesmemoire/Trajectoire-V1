// @ts-nocheck
import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const RequestSchema = z.object({
      email:            z.string().email("Email invalide"),
      pressureType:     z.string().max(200).optional(),
      weakness:         z.string().max(500).optional(),
      intentReason:     z.string().max(500).optional(),
      isWillingToRetry: z.boolean().optional(),
    });

    const parsed = RequestSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Paramètres invalides.", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const { email, pressureType, weakness, intentReason, isWillingToRetry } = parsed.data;

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
