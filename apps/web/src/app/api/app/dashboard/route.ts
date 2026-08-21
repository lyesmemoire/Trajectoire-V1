import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

type InterviewSessionRow = {
  score: number | null;
  duration_seconds: number | null;
};

function unauthorized() {
  return NextResponse.json(
    {
      error: "Unauthorized",
      code: "UNAUTHORIZED",
    },
    { status: 401 },
  );
}

function serverError(message: string, code: string) {
  return NextResponse.json(
    {
      error: message,
      code,
    },
    { status: 500 },
  );
}

export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return unauthorized();
  }

  /*
   * The authenticated Supabase user is the canonical identity.
   *
   * We intentionally do NOT trust:
   * - x-user-id
   * - x-user-role
   * - x-user-plan
   *
   * Those headers may be useful as middleware metadata, but they are
   * never the authorization source for API data access.
   */

  const {
    data: sessions,
    error: sessionsError,
  } = await supabase
    .from("interview_sessions")
    .select("score,duration_seconds")
    .eq("user_id", user.id);

  if (sessionsError) {
    console.error("[dashboard] interview_sessions query failed", {
      userId: user.id,
      code: sessionsError.code,
      message: sessionsError.message,
    });

    return serverError(
      "Unable to load dashboard sessions",
      "DASHBOARD_SESSIONS_QUERY_FAILED",
    );
  }

  const rows = (sessions ?? []) as InterviewSessionRow[];

  const sessionsTotal = rows.length;

  const scores = rows
    .map((row) => row.score)
    .filter(
      (score): score is number =>
        typeof score === "number" && Number.isFinite(score),
    );

  const avgScore =
    scores.length > 0
      ? Math.round(
          scores.reduce((sum, score) => sum + score, 0) / scores.length,
        )
      : null;

  const totalSeconds = rows
    .map((row) => row.duration_seconds)
    .filter(
      (duration): duration is number =>
        typeof duration === "number" && Number.isFinite(duration),
    )
    .reduce((sum, duration) => sum + duration, 0);

  const totalTimeMin = Math.round(totalSeconds / 60);

  const [
    { data: allBadges, error: badgesError },
    { data: userBadges, error: userBadgesError },
  ] = await Promise.all([
    supabase
      .from("badges")
      .select("key"),

    supabase
      .from("user_badges")
      .select("badge_key")
      .eq("user_id", user.id),
  ]);

  if (badgesError) {
    console.error("[dashboard] badges query failed", {
      userId: user.id,
      code: badgesError.code,
      message: badgesError.message,
    });

    return serverError(
      "Unable to load dashboard badges",
      "DASHBOARD_BADGES_QUERY_FAILED",
    );
  }

  if (userBadgesError) {
    console.error("[dashboard] user_badges query failed", {
      userId: user.id,
      code: userBadgesError.code,
      message: userBadgesError.message,
    });

    return serverError(
      "Unable to load user badges",
      "DASHBOARD_USER_BADGES_QUERY_FAILED",
    );
  }

  return NextResponse.json({
    sessionsTotal,
    avgScore,
    totalTimeMin,
    badgesUnlocked: userBadges?.length ?? 0,
    badgesTotal: allBadges?.length ?? 0,
  });
}
