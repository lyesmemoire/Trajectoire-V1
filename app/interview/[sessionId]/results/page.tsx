import { redirect } from "next/navigation";
import { getAuthenticatedUser } from "@/lib/auth";

type Props = {
  params: Promise<{ sessionId: string }>;
};

export default async function ResultsPage({ params }: Props) {
  const { sessionId } = await params;
  const user = await getAuthenticatedUser();
  if (!user) redirect("/auth/login");

  return <div className="p-8">Interview Results - Session: {sessionId}</div>;
}
