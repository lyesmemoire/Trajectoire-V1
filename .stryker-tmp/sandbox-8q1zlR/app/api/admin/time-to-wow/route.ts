// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";
import { getStrictUser } from "@/lib/auth/get-user";

export async function GET(req: NextRequest) {
  try {
    const user = await getStrictUser(req);
    // Admin check omitted for dev

    // In production, we'd query real PostHog or our internal analytics table
    // Mocking the response according to the requested structure
    return NextResponse.json({
      medianTimeToWow: 84, // seconds
      dropOffs: [
        { step: "Landing", count: 1240 },
        { step: "Upload", count: 820 },
        { step: "Offer Paste", count: 640 },
        { step: "Doubt Reveal", count: 412 },
        { step: "Signup", count: 184 },
        { step: "Interview", count: 112 },
      ],
      triggers: [
        { name: "Doubt Reveal", impact: 42 },
        { name: "Victor Tone", impact: 28 },
        { name: "Replay Story", impact: 15 },
        { name: "CV Correction", impact: 10 },
        { name: "Clara Rescue", impact: 5 },
      ],
      returnRateAfterWow: 38, // %
      segmentComparison: [
        { segment: "Junior Anxious", time: 62 },
        { segment: "Senior Skeptic", time: 145 },
        { segment: "Reconversion", time: 94 },
        { segment: "Tech Pro", time: 110 },
      ],
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
