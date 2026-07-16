// @ts-nocheck
import { getAuthenticatedUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { CVAnalyzer } from "./components/CVAnalyzer";

export const metadata = {
  title: "Optimiseur de CV — StudioEntretien.fr",
  description: "Analysez et exportez votre CV optimisé ATS en PDF.",
};

export default async function CVPage() {
  const user = await getAuthenticatedUser();
  if (!user) redirect("/auth/login");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-black text-slate-900 mb-2">
            Optimiseur de CV
          </h1>
          <p className="text-slate-500 max-w-xl mx-auto font-medium">
            Uploadez votre CV, l'IA l'analyse et vous génère une version
            optimisée ATS. Téléchargez-la en PDF en un clic.
          </p>
        </div>
        <CVAnalyzer userId={user.id} />
      </div>
    </div>
  );
}
