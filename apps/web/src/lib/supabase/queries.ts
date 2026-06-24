import type { Database } from "@/types/database";
import type {
  Profile,
  DashboardSummary,
  Evaluation,
  CompetencyScore,
  ActionItem,
  PlanMilestone,
  Notification,
  ProgressionSnapshot,
} from "@/types/database";

type Client = any; // SupabaseClient<Database>;

/* ── Profile ── */
export async function getProfile(
  supabase: Client,
  userId: string
): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) { console.error("getProfile:", error.message); return null; }
  return data;
}

export async function updateProfile(
  supabase: Client,
  userId: string,
  payload: Database["public"]["Tables"]["profiles"]["Update"]
): Promise<Profile | null> {
  const { data, error } = await (supabase as any)
    .from("profiles")
    .update(payload)
    .eq("id", userId)
    .select()
    .single();

  if (error) { console.error("updateProfile:", error.message); return null; }
  return data;
}

/* ── Dashboard summary ── */
export async function getDashboardSummary(
  supabase: Client,
  userId: string
): Promise<DashboardSummary | null> {
  const { data, error } = await supabase
    .from("dashboard_summary")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error) { console.error("getDashboardSummary:", error.message); return null; }
  return data;
}

/* ── Evaluations ── */
export async function getLatestEvaluation(
  supabase: Client,
  userId: string
): Promise<Evaluation | null> {
  const { data, error } = await supabase
    .from("evaluations")
    .select("*")
    .eq("user_id", userId)
    .not("completed_at", "is", null)
    .order("completed_at", { ascending: false })
    .limit(1)
    .single();

  if (error) { console.error("getLatestEvaluation:", error.message); return null; }
  return data;
}

export async function createEvaluation(
  supabase: Client,
  userId: string
): Promise<Evaluation | null> {
  const { data, error } = await supabase
    .from("evaluations")
    .insert({ user_id: userId })
    .select()
    .single();

  if (error) { console.error("createEvaluation:", error.message); return null; }
  return data;
}

export async function completeEvaluation(
  supabase: Client,
  evaluationId: string,
  scores: {
    confidence_score: number;
    stress_score:     number;
    preparedness:     number;
    decision_score:   number;
    raw_answers?:     Record<string, unknown>;
  }
): Promise<Evaluation | null> {
  const { data, error } = await supabase
    .from("evaluations")
    .update({ ...scores, completed_at: new Date().toISOString() })
    .eq("id", evaluationId)
    .select()
    .single();

  if (error) { console.error("completeEvaluation:", error.message); return null; }
  return data;
}

/* ── Competency scores ── */
export async function getLatestCompetencyScores(
  supabase: Client,
  userId: string
): Promise<CompetencyScore[]> {
  const latest = await getLatestEvaluation(supabase, userId);
  if (!latest) return [];

  const { data, error } = await supabase
    .from("competency_scores")
    .select("*")
    .eq("evaluation_id", latest.id)
    .order("name");

  if (error) { console.error("getLatestCompetencyScores:", error.message); return []; }
  return data ?? [];
}

export async function upsertCompetencyScores(
  supabase: Client,
  userId: string,
  evaluationId: string,
  scores: { name: string; score: number; prev_score?: number }[]
): Promise<void> {
  const payload = scores.map((s) => ({
    evaluation_id: evaluationId,
    user_id:       userId,
    name:          s.name,
    score:         s.score,
    prev_score:    s.prev_score ?? null,
  }));

  const { error } = await supabase.from("competency_scores").insert(payload);
  if (error) console.error("upsertCompetencyScores:", error.message);
}

/* ── Action items ── */
export async function getActionItems(
  supabase: Client,
  userId: string
): Promise<ActionItem[]> {
  const { data, error } = await supabase
    .from("action_items")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  if (error) { console.error("getActionItems:", error.message); return []; }
  return data ?? [];
}

export async function toggleActionItem(
  supabase: Client,
  itemId: string,
  done: boolean
): Promise<ActionItem | null> {
  const { data, error } = await supabase
    .from("action_items")
    .update({ done })
    .eq("id", itemId)
    .select()
    .single();

  if (error) { console.error("toggleActionItem:", error.message); return null; }
  return data;
}

/* ── Plan milestones ── */
export async function getPlanMilestones(
  supabase: Client,
  userId: string
): Promise<PlanMilestone[]> {
  const { data, error } = await supabase
    .from("plan_milestones")
    .select("*")
    .eq("user_id", userId)
    .order("position", { ascending: true });

  if (error) { console.error("getPlanMilestones:", error.message); return []; }
  return data ?? [];
}

/* ── Notifications ── */
export async function getNotifications(
  supabase: Client,
  userId: string,
  limit = 10
): Promise<Notification[]> {
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) { console.error("getNotifications:", error.message); return []; }
  return data ?? [];
}

export async function markNotificationRead(
  supabase: Client,
  notifId: string
): Promise<void> {
  const { error } = await supabase
    .from("notifications")
    .update({ read: true })
    .eq("id", notifId);

  if (error) console.error("markNotificationRead:", error.message);
}

export async function markAllNotificationsRead(
  supabase: Client,
  userId: string
): Promise<void> {
  const { error } = await supabase
    .from("notifications")
    .update({ read: true })
    .eq("user_id", userId)
    .eq("read", false);

  if (error) console.error("markAllNotificationsRead:", error.message);
}

/* ── Progression snapshots ── */
export async function getProgressionSnapshots(
  supabase: Client,
  userId: string,
  limit = 12
): Promise<ProgressionSnapshot[]> {
  const { data, error } = await supabase
    .from("progression_snapshots")
    .select("*")
    .eq("user_id", userId)
    .order("recorded_at", { ascending: true })
    .limit(limit);

  if (error) { console.error("getProgressionSnapshots:", error.message); return []; }
  return data ?? [];
}
