"use client";

import { useEffect, useState, useCallback } from "react";
import type { Profile } from "@/types/database";
import { useSupabase } from "./useSupabase";
import { useUser } from "./useUser";
import { getProfile, updateProfile } from "@/lib/supabase/queries";
import type { Database } from "@/types/database";

type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];

interface UseProfileReturn {
  profile: Profile | null;
  loading: boolean;
  saving: boolean;
  update: (payload: ProfileUpdate) => Promise<void>;
  refetch: () => Promise<void>;
}

export function useProfile(): UseProfileReturn {
  const supabase = useSupabase();
  const { user, loading: userLoading } = useUser();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetch = useCallback(async () => {
    if (!user) { setLoading(false); return; }
    setLoading(true);
    const data = await getProfile(supabase, user.id);
    setProfile(data);
    setLoading(false);
  }, [supabase, user]);

  useEffect(() => {
    if (!userLoading) fetch();
  }, [userLoading, fetch]);

  const update = async (payload: ProfileUpdate) => {
    if (!user) return;
    setSaving(true);
    const updated = await updateProfile(supabase, user.id, payload);
    if (updated) setProfile(updated);
    setSaving(false);
  };

  return { profile, loading, saving, update, refetch: fetch };
}
