"use client";

import { useEffect, useState, useCallback } from "react";
import { createLogger } from "@/lib/logger";
import type {
  DashboardSummary,
  CompetencyScore,
  ActionItem,
  PlanMilestone,
  Notification,
  ProgressionSnapshot,
  Simulation,
} from "@/types/database";
import { useSupabase } from "./useSupabase";
import { useUser }     from "./useUser";
import {
  getDashboardSummary,
  getLatestCompetencyScores,
  getActionItems,
  getPlanMilestones,
  getNotifications,
  getProgressionSnapshots,
  toggleActionItem,
  markNotificationRead,
  markAllNotificationsRead,
} from "@/lib/supabase/queries";

const logger = createLogger({ component: "useDashboard" });

/* ── Fetch simulations (not in queries.ts yet) ── */
async function getSimulations(
  supabase: ReturnType<typeof useSupabase>,
  userId: string,
  limit = 20
): Promise<Simulation[]> {
  const { data, error } = await supabase
    .from("simulations")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) { logger.error({ userId, error: error.message }, "getSimulations failed"); return []; }
  return data ?? [];
}

interface UseDashboardReturn {
  summary:       DashboardSummary | null;
  competencies:  CompetencyScore[];
  actions:       ActionItem[];
  milestones:    PlanMilestone[];
  notifications: Notification[];
  progression:   ProgressionSnapshot[];
  simulations:   Simulation[];
  loading:       boolean;
  toggleAction:  (id: string, done: boolean) => Promise<void>;
  readNotif:     (id: string) => Promise<void>;
  readAllNotifs: () => Promise<void>;
  refetch:       () => Promise<void>;
}

export function useDashboard(): UseDashboardReturn {
  const supabase = useSupabase();
  const { user, loading: userLoading } = useUser();

  const [summary,       setSummary]       = useState<DashboardSummary | null>(null);
  const [competencies,  setCompetencies]  = useState<CompetencyScore[]>([]);
  const [actions,       setActions]       = useState<ActionItem[]>([]);
  const [milestones,    setMilestones]    = useState<PlanMilestone[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [progression,   setProgression]   = useState<ProgressionSnapshot[]>([]);
  const [simulations,   setSimulations]   = useState<Simulation[]>([]);
  const [loading,       setLoading]       = useState(true);

  const fetch = useCallback(async () => {
    if (!user) { setLoading(false); return; }
    setLoading(true);

    const [s, c, a, m, n, p, sim] = await Promise.all([
      getDashboardSummary(supabase, user.id),
      getLatestCompetencyScores(supabase, user.id),
      getActionItems(supabase, user.id),
      getPlanMilestones(supabase, user.id),
      getNotifications(supabase, user.id),
      getProgressionSnapshots(supabase, user.id),
      getSimulations(supabase, user.id),
    ]);

    setSummary(s);
    setCompetencies(c);
    setActions(a);
    setMilestones(m);
    setNotifications(n);
    setProgression(p);
    setSimulations(sim);
    setLoading(false);
  }, [supabase, user]);

  useEffect(() => {
    if (!userLoading) fetch();
  }, [userLoading, fetch]);

  /* Realtime — notifications */
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel(`notifications:${user.id}`)
      .on(
        "postgres_changes",
        {
          event:  "INSERT",
          schema: "public",
          table:  "notifications",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          setNotifications((prev) => [payload.new as Notification, ...prev]);
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [supabase, user]);

  const toggleAction = async (id: string, done: boolean) => {
    setActions((prev) =>
      prev.map((a) => (a.id === id ? { ...a, done } : a))
    );
    await toggleActionItem(supabase, id, done);
  };

  const readNotif = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    await markNotificationRead(supabase, id);
  };

  const readAllNotifs = async () => {
    if (!user) return;
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    await markAllNotificationsRead(supabase, user.id);
  };

  return {
    summary,
    competencies,
    actions,
    milestones,
    notifications,
    progression,
    simulations,
    loading,
    toggleAction,
    readNotif,
    readAllNotifs,
    refetch: fetch,
  };
}
