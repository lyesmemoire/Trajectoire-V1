import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase/client";

/**
 * Hook to get current authenticated user
 */
export function useAuthUser() {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error) {
          setError(error.message);
        } else if (user) {
          setUserId(user.id);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to get user");
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, []);

  return { userId, loading, error };
}
