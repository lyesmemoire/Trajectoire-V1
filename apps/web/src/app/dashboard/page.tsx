import type { Metadata } from "next";
import DashboardOverview from "@/components/dashboard/DashboardOverview";

export const metadata: Metadata = {
  title: "Tableau de bord – Trajectoire",
  description: "Votre progression et vos recommandations personnalisées.",
};

export default function DashboardPage() {
  return <DashboardOverview />;
}
