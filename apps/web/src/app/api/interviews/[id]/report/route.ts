import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  getUserSubscription,
  hasPremiumAccess,
} from "@/lib/billing/get-user-subscription";

type InterviewScore = {
  finalExecutiveScore?: number;
  integrityRiskIndex?: number;
  integrityRiskLevel?: string;
  interviewScore?: number;
  communicationScore?: number;
  technicalDepthScore?: number;
  quantificationDepthScore?: number;
  leadershipCompositeScore?: number;
  consistencyGap?: number;
  executiveImpression?: string;
  decisionSimulation?: {
    hr: string;
    technical: string;
    committee: string;
  };
  metadata?: {
    engineVersion?: string;
    timestamp?: string;
  };
};

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const resolvedParams = await params;

  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
    }

    const { data: interview, error: fetchError } = await (supabase as any)
      .from("interviews")
      .select("session_id, user_id, score")
      .eq("session_id", resolvedParams.id)
      .single();

    if (fetchError || !interview) {
      return NextResponse.json({ error: "Interview not found" }, { status: 404 });
    }

    if (interview.user_id !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { data: profile } = await (supabase as any)
      .from("profiles")
      .select("cv_score")
      .eq("id", user.id)
      .maybeSingle();

    const subscription = await getUserSubscription(user.id);
    const isPremium = hasPremiumAccess(subscription);

    const scoreData = (interview.score ?? {}) as InterviewScore;

    const report = {
      finalExecutiveScore: scoreData.finalExecutiveScore ?? 0,
      percentile: 72,
      integrityRiskIndex: scoreData.integrityRiskIndex ?? 0,
      integrityRiskLevel: scoreData.integrityRiskLevel ?? "Low",
      cvScore: profile?.cv_score ?? 0,
      interviewScore: scoreData.interviewScore ?? 0,
      communicationScore: scoreData.communicationScore ?? 0,
      technicalDepthScore: scoreData.technicalDepthScore ?? 0,
      quantificationDepthScore: scoreData.quantificationDepthScore ?? 0,
      leadershipCompositeScore: scoreData.leadershipCompositeScore ?? 0,
      consistencyGap: scoreData.consistencyGap ?? 0,
      executiveImpression: scoreData.executiveImpression ?? "Pending analysis...",
      decisionSimulation: scoreData.decisionSimulation ?? {
        hr: "BORDERLINE",
        technical: "BORDERLINE",
        committee: "BORDERLINE",
      },
      metadata: scoreData.metadata ?? {
        engineVersion: "unified_v1",
        timestamp: new Date().toISOString(),
      },
      isPremium,
    };

    return NextResponse.json(report);
  } catch (error) {
    console.error("Error generating report:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
