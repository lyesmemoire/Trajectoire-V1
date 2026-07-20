import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { checkUserSubscription } from "@/lib/subscription/check-subscription";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Tableau de bord – Trajectoire",
  description: "Votre progression et vos recommandations personnalisées.",
};

async function getDashboardData(userId: string) {
  const supabase = await createClient();
  
  // Fetch profile data
  const { data: profile } = await supabase
    .from("profiles")
    .select("firstname, lastname, created_at")
    .eq("id", userId)
    .single();

  // Fetch recent sessions (last 10)
  const { data: recentSessions } = await supabase
    .from("interview_sessions")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(10);

  return {
    profile,
    recentSessions: recentSessions || [],
  };
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) return "Aujourd'hui";
  if (diffInDays === 1) return "Hier";
  if (diffInDays < 7) return `Il y a ${diffInDays} jours`;
  
  return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Vérifier si l'utilisateur a un CareerProfile (CV uploadé)
  const careerProfile = await prisma.careerProfile.findUnique({
    where: { userId: user.id },
    select: { id: true },
  });
  const hasCareerProfile = !!careerProfile;

  const data = await getDashboardData(user.id);

  const displayName = data.profile?.firstname 
    ? `${data.profile.firstname} ${data.profile.lastname || ""}`.trim()
    : user.email;

  const hasSimulations = data.recentSessions.length > 0;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Tableau de bord</h1>
        <p className="text-slate-600">
          Bonjour, {displayName} 👋
        </p>
      </div>

      {/* CAS 1 — Pas de CV */}
      {!hasCareerProfile && (
        <div className="bg-white p-8 rounded-xl border border-slate-200 text-center">
          <div className="max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              Commencez par analyser votre CV
            </h2>
            <p className="text-slate-600 mb-6">
              Trajectoire personnalise vos simulations d'entretien à partir de votre CV.
              Téléchargez-le pour générer votre profil carrière.
            </p>
            <Link href="/cv/upload">
              <Button size="lg" className="w-full sm:w-auto">
                Télécharger mon CV
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* CAS 2 — CV présent mais aucune simulation */}
      {hasCareerProfile && !hasSimulations && (
        <div className="bg-white p-8 rounded-xl border border-slate-200 text-center">
          <div className="max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              Votre profil est prêt ✅
            </h2>
            <p className="text-slate-600 mb-6">
              Lancez votre première simulation d'entretien personnalisée.
            </p>
            <Link href="/simulation">
              <Button size="lg" className="w-full sm:w-auto">
                Lancer ma première simulation
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* CAS 3 — Utilisateur actif (avec CV et simulations) */}
      {hasCareerProfile && hasSimulations && (
        <>
          {/* Bloc principal - Nouvelle simulation */}
          <div className="bg-white p-8 rounded-xl border border-slate-200">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h2 className="text-xl font-semibold text-slate-900 mb-1">
                  Nouvelle simulation
                </h2>
                <p className="text-slate-600 text-sm">
                  Pratiquez avec un entretien personnalisé
                </p>
              </div>
              <Link href="/simulation">
                <Button size="lg">
                  Lancer une simulation
                </Button>
              </Link>
            </div>
          </div>

          {/* Historique simulations */}
          <div className="bg-white p-8 rounded-xl border border-slate-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-slate-900">
                Historique des simulations
              </h2>
              <Link
                href="/history"
                className="text-sm text-blue-600 hover:underline font-medium"
              >
                Voir tout
              </Link>
            </div>
            <div className="space-y-4">
              {data.recentSessions.map((session) => (
                <div key={session.id} className="flex justify-between items-center py-4 border-b border-slate-100 last:border-0">
                  <div>
                    <p className="font-medium text-slate-900">{session.job_title}</p>
                    <p className="text-sm text-slate-600">{session.level} • {formatDate(session.created_at)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                      session.status === "completed" 
                        ? "bg-green-100 text-green-700" 
                        : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {session.status === "completed" ? "Terminé" : "En cours"}
                    </span>
                    {session.status === "completed" && (
                      <Link
                        href={`/simulation/${session.id}`}
                        className="text-sm text-blue-600 hover:underline font-medium"
                      >
                        Voir
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
