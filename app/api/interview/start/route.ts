// app/api/interview/start/route.ts
// Démarre une nouvelle session d'entretien simulé

import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { requireAuth } from "@/lib/auth";
import { requireCVEditor } from "@/lib/security/require-cv-editor";
import { generateInterviewQuestions } from "@/lib/interview/generate-questions";
import crypto from "crypto";
import { interviewStartLimiter } from "@/lib/security/rate-limit";
import { logEvent } from "@/lib/security/audit-log";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    // Ensure the user has completed the CV editor flow before starting interview
    const user = await requireAuth();
    const cvAccess = await requireCVEditor(user.id);
    if (!cvAccess.success) {
      return NextResponse.json(
        { error: "CV editor completion required" },
        { status: 403 },
      );
    }
    const { success } = await interviewStartLimiter.limit(
      `interview-start:${user.id}`,
    );
    if (!success) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }
    const supabase = await createSupabaseServerClient();

    const { job_title, job_description, cv_id } = await req.json();

    if (!job_title?.trim()) {
      return NextResponse.json(
        { error: "Le titre du poste est requis." },
        { status: 400 },
      );
    }

    let candidateSummary = null;
    if (cv_id) {
      // 1. Chercher le CV optimisé pour ce poste spécifique via le hash
      const jobHash = crypto
        .createHash("sha256")
        .update((job_description || "").trim().toLowerCase())
        .digest("hex");

      const { data: optCv } = await (supabase as any)
        .from("optimized_cvs")
        .select("improved_summary")
        .eq("cv_id", cv_id)
        .eq("job_hash", jobHash)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (optCv?.improved_summary) {
        candidateSummary = optCv.improved_summary;
      } else {
        // 2. Chercher le CV raw
        const { data: rawCv } = await (supabase as any)
          .from("cvs")
          .select("extracted_text")
          .eq("id", cv_id)
          .single();

        if (rawCv?.extracted_text) {
          candidateSummary = rawCv.extracted_text.slice(0, 1500);
        }
      }
    }

    // Récupérer le profil utilisateur pour vérifier le plan et le trial
    const { data: userProfile } = await (supabase as any)
      .from("profiles")
      .select("plan, has_used_premium_trial")
      .eq("id", user.id)
      .single();

    // Marquer le trial comme utilisé dès le début
    if (userProfile?.plan === "free" && !userProfile?.has_used_premium_trial) {
      await (supabase as any)
        .from("profiles")
        .update({ has_used_premium_trial: true })
        .eq("id", user.id);
    }

    // Vérifier la limite de sessions
    const now = new Date();
    const firstOfMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      1,
    ).toISOString();

    const { count } = await (supabase as any)
      .from("interview_sessions")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("created_at", firstOfMonth);

    const isPremium = userProfile?.plan === "premium";
    const isFree = userProfile?.plan === "free" || !userProfile?.plan;
    const canUsePremiumTrial =
      isFree && userProfile?.has_used_premium_trial === false;

    const ADMIN_EMAILS = ["anislamine1980@gmail.com"];
    const isAdmin = ADMIN_EMAILS.includes(user.email ?? "");

    let sessionLimit = 1; // Plan free par défaut : 1 session
    if (isPremium) {
      sessionLimit = 4;
    } else if (canUsePremiumTrial) {
      sessionLimit = 2; // 1 free + 1 trial
    }

    if (!isAdmin && (count ?? 0) >= sessionLimit) {
      return NextResponse.json(
        {
          error: `Vous avez atteint votre limite de ${sessionLimit} session(s) ce mois-ci.`,
        },
        { status: 403 },
      );
    }

    // Générer les questions avec variation contrôlée
    const questions = generateInterviewQuestions();

    const { data, error } = await (supabase as any)
      .from("interview_sessions")
      .insert({
        user_id: user.id,
        job_title: job_title.trim(),
        job_description: job_description?.trim() || null,
        candidate_summary: candidateSummary,
        questions,
        answers: [],
      })
      .select()
      .single();

    if (error) {
      console.error("Failed to create interview session:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    logEvent(
      user.id,
      "INTERVIEW_START",
      { job_title, job_description },
      req.headers.get("x-forwarded-for") ?? "",
      req.headers.get("user-agent") ?? "",
    );
    return NextResponse.json(data);
  } catch (err: any) {
    if (err.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("POST /api/interview/start error:", err);
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
