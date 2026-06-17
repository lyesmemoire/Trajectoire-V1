import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth";
import prisma from "@/lib/prisma";

/**
 * GDPR Data Portability: Allows users to download their progress and data.
 */
export async function GET(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const fullData = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        careerProfile: true,
        BehavioralPattern: true,
        interviewSessions: {
          select: {
            jobTitle: true,
            score: true,
            createdAt: true,
            analysis: true,
          },
        },
      },
    });

    return NextResponse.json({
      exported_at: new Date().toISOString(),
      user_profile: {
        name: fullData?.name,
        email: fullData?.email,
        role: fullData?.role,
      },
      career_data: fullData?.careerProfile,
      patterns: fullData?.BehavioralPattern,
      sessions: fullData?.interviewSessions,
    });
  } catch (error: any) {
    return NextResponse.json({ error: "Export failed" }, { status: 500 });
  }
}
