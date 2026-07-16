import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("sessionId");

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID is required" }, { status: 400 });
    }

    // Fetch interview session with persisted data
    const interviewSession = await prisma.interviewSession.findUnique({
      where: { id: sessionId },
      select: {
        id: true,
        userId: true,
        persona: true,
        currentState: true,
        pressureLevel: true,
        jobTitle: true,
        status: true,
        questions: true,
        answers: true,
        analysis: true,
        startedAt: true,
        completedAt: true,
        createdAt: true
      }
    });

    if (!interviewSession) {
      return NextResponse.json({ error: "Interview session not found" }, { status: 404 });
    }

    // Extract voice interview metrics from the analysis field if available
    const analysis = interviewSession.analysis as any;
    const voiceMetrics = analysis?.voiceMetrics || null;

    // Build report from persisted data
    const report = {
      globalScore: analysis?.globalScore || 70,
      level: analysis?.level || "intermédiaire",
      progression: analysis?.progression || { previousScore: 65, change: 5, trend: "stable" },
      duration: analysis?.duration || 0,
      company: interviewSession.jobTitle || "Entreprise non spécifiée",
      position: interviewSession.jobTitle || "Poste non spécifié",
      date: interviewSession.createdAt,
      scores: analysis?.scores || {},
      questionAnalysis: analysis?.questionAnalysis || [],
      timeline: analysis?.timeline || [],
      highlights: analysis?.highlights || [],
      improvements: analysis?.improvements || [],
      starAnalysis: analysis?.starAnalysis || [],
      languageAnalysis: analysis?.languageAnalysis || {},
      postureAnalysis: analysis?.postureAnalysis || {},
      recruiterVision: analysis?.recruiterVision || {},
      comparison: analysis?.comparison || {},
      actionPlan: analysis?.actionPlan || {},
      nextSimulation: analysis?.nextSimulation || {},
      behavioralAnalysis: analysis?.behavioralAnalysis || {},
      recruiterPrivateNotes: analysis?.recruiterPrivateNotes || {},
      decisionEstimation: analysis?.decisionEstimation || {},
      tippingFactors: analysis?.tippingFactors || {},
      executiveSummary: analysis?.executiveSummary || {},
      enhancedComparison: analysis?.enhancedComparison || {},
      voiceMetrics: voiceMetrics
    };

    return NextResponse.json(report);
  } catch (error) {
    console.error("Error fetching interview report:", error);
    return NextResponse.json({ error: "Failed to fetch interview report" }, { status: 500 });
  }
}
