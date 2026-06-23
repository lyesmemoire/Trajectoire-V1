import { getAuthenticatedUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import ATSDashboardClient from "./client";

export const metadata = {
  title: "Audit de Crédibilité ATS — StudioEntretien.fr",
  description: "Comprenez ce qu'un recruteur pense vraiment de votre CV.",
};

export default async function ATSPage() {
  const user = await getAuthenticatedUser();
  if (!user) redirect("/auth/login");

  return <ATSDashboardClient />;
}
