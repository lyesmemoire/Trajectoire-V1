import { createClient } from "@/lib/supabase/client";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

async function getAuthHeaders(): Promise<Record<string, string>> {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.access_token) {
    throw new Error("Not authenticated");
  }

  return {
    Authorization: `Bearer ${session.access_token}`,
    "Content-Type": "application/json",
  };
}

export async function fetchInterviews() {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_URL}/api/interviews`, { headers });
  if (!res.ok) throw new Error("Failed to fetch interviews");
  return res.json();
}

export async function fetchInterview(sessionId: string) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_URL}/api/interviews/${sessionId}`, {
    headers,
  });
  if (!res.ok) throw new Error("Failed to fetch interview");
  return res.json();
}

export async function createCheckoutSession() {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_URL}/api/create-checkout-session`, {
    method: "POST",
    headers,
  });
  if (!res.ok) throw new Error("Failed to create checkout session");
  return res.json();
}

export async function createPortalSession() {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_URL}/api/create-portal-session`, {
    method: "POST",
    headers,
  });
  if (!res.ok) throw new Error("Failed to create portal session");
  return res.json();
}

export function getWsUrl(token: string, role?: string): string {
  const wsBase = API_URL.replace(/^http/, "ws");
  const params = new URLSearchParams({ token });
  if (role) params.set("role", role);
  return `${wsBase}/api/voice?${params.toString()}`;
}
