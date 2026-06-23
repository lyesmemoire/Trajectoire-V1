import { createClient }           from "@/lib/supabase/server";
import { redirect }               from "next/navigation";
import { InterviewSimulationV3 }  from "@/components/interview/InterviewSimulationV3";
import { getUserSubscription, hasPremiumAccess } from "@/lib/billing/get-user-subscription";

interface PageProps {
  params:       { sessionId: string };
  searchParams: { atsReportId?: string };
}

export default async function InterviewSessionPage({
  params,
  searchParams,
}: PageProps) {
  // Auth guard
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: { session } } = await supabase.auth.getSession();
  if (!user || !session) redirect("/login");

  // Premium verification
  const subscription = await getUserSubscription(user.id);
  const isAllowed    = hasPremiumAccess(subscription)
    || subscription.credits > 0;

  if (!isAllowed) {
    // Redirect vers pricing — pas de 403 silencieux
    redirect("/pricing?source=interview&required=PRO");
  }

  // Construction URL WebSocket
  // Le Gateway attend : /api/voice?engine=v3&sessionId=UUID&token=JWT
  const gatewayBase = process.env.NEXT_PUBLIC_GATEWAY_URL
    ?? "http://localhost:3001";
  const wsBase = gatewayBase.replace(
    /^https?/,
    (p) => p === "https" ? "wss" : "ws"
  );

  // TODO SECURITY: Token exposé dans l'URL WebSocket.
  // Migrer vers auth par message onopen quand le Gateway le supportera.
  const wsUrl = `${wsBase}/api/voice?engine=v3` +
    `&sessionId=${params.sessionId}` +
    `&token=${session.access_token}`;

  return (
    <InterviewSimulationV3
      sessionId={params.sessionId}
      wsUrl={wsUrl}
      token={session.access_token}
      atsReportId={searchParams.atsReportId ?? null}
    />
  );
}
