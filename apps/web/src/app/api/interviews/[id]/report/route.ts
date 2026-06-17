import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; // Or anon key if RLS handles it. Assuming service role for this endpoint.
    
    if (!supabaseUrl || !supabaseKey) {
      console.warn("Supabase credentials missing");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch the interview
    const { data: interview, error } = await supabase
      .from("interviews")
      .select("*")
      .eq("session_id", params.id)
      .single();

    if (error || !interview) {
      return NextResponse.json({ error: "Interview not found" }, { status: 404 });
    }

    // Fetch the user's CV score
    const { data: profile } = await supabase
      .from("profiles")
      .select("cv_score")
      .eq("user_id", interview.user_id)
      .single();

    // Check Premium Status
    let isPremium = false;
    
    // 1. Check early access tracking
    const { count: earlyCount } = await supabase
      .from("early_access_tracking")
      .select("*", { count: "exact", head: true })
      .eq("user_id", interview.user_id);
      
    if (earlyCount && earlyCount > 0) {
      isPremium = true;
    } else {
      // 2. Check user_usage credits or subscription
      const { data: usage } = await supabase
        .from("user_usage")
        .select("credits, subscription_status")
        .eq("user_id", interview.user_id)
        .single();
        
      if (usage && (usage.credits > 0 || usage.subscription_status === "active")) {
        isPremium = true;
      }
    }

    const scoreData = interview.score || {};

    // Map DB JSONB fields to the requested response schema
    const report = {
      finalExecutiveScore: scoreData.finalExecutiveScore || 0,
      percentile: 72, // TODO: Mocked for now, needs ranking logic across DB
      integrityRiskIndex: scoreData.integrityRiskIndex || 0,
      integrityRiskLevel: scoreData.integrityRiskLevel || "Low",
      
      cvScore: profile?.cv_score || 0,
      interviewScore: scoreData.interviewScore || 0,
      
      communicationScore: scoreData.communicationScore || 0,
      technicalDepthScore: scoreData.technicalDepthScore || 0,
      quantificationDepthScore: scoreData.quantificationDepthScore || 0,
      leadershipCompositeScore: scoreData.leadershipCompositeScore || 0,
      consistencyGap: scoreData.consistencyGap || 0,
      
      executiveImpression: scoreData.executiveImpression || "Pending analysis...",
      decisionSimulation: scoreData.decisionSimulation || { hr: "BORDERLINE", technical: "BORDERLINE", committee: "BORDERLINE" },
      
      metadata: scoreData.metadata || { engineVersion: "unified_v1", timestamp: new Date().toISOString() },
      isPremium
    };

    return NextResponse.json(report);
  } catch (error) {
    console.error("Error generating report:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
