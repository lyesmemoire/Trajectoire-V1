import { getAuthenticatedUser } from "@/lib/auth";
import { ThreatIntelligenceDashboard } from "@/components/admin/security/ThreatIntelligenceDashboard";

export default async function AdminSecurityPage() {
  const user = await getAuthenticatedUser();
  if (!user || user.role !== "ADMIN") {
    // redirect("/");
  }

  return (
    <div className="pb-20">
      <ThreatIntelligenceDashboard />
    </div>
  );
}
