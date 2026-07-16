// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";
import { getStrictUser } from "@/lib/auth/get-user";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const user = await getStrictUser(req);
    if (!user || (user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const snapshots = await prisma.userPredictionSnapshot.findMany({
      include: { User: { select: { email: true } } },
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    const high = snapshots.filter((s) => s.returnSegment === "HIGH").length;
    const medium = snapshots.filter((s) => s.returnSegment === "MEDIUM").length;
    const low = snapshots.filter((s) => s.returnSegment === "LOW").length;

    const avgReturnProb =
      snapshots.length > 0
        ? snapshots.reduce((acc, s) => acc + s.returnProbability, 0) /
          snapshots.length
        : 0;

    const churnRisks = snapshots
      .filter((s) => s.returnSegment === "LOW")
      .slice(0, 10)
      .map((s) => ({
        userId: s.userId,
        email: s.User?.email,
        segment: s.returnSegment,
        driver: s.primaryDriver,
      }));

    // In a real scenario, these would be calculated from behavioral logs
    // Mocking for the dashboard structure
    return NextResponse.json({
      overview: {
        high,
        medium,
        low,
        avgReturnProbability: Math.round(avgReturnProb * 100),
      },
      churnRisks,
      recoveryImpact: {
        recoveredUsers: 48,
        returnedAfterRecovery: 20,
        recoveryReturnRate: 41,
      },
      topDrivers: [
        { driver: "Clara recovery loop", impact: 32 },
        { driver: "Victor overload", impact: -21 },
        { driver: "Replay fatigue", impact: -17 },
        { driver: "Fast retry loop", impact: 41 },
      ],
      replayFatigue: {
        avgReplayReadTime: 45,
        abandonmentRate: 22,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
