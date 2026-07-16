import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { JourneyWizard } from "@/components/journey/journey-wizard";

export default async function JourneyPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  return <JourneyWizard userId={user.id} />;
}
