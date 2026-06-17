import { getAuthenticatedUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ChallengeBanner } from "@/components/challenges/challenge-banner";
import { LiveLeaderboard } from "@/components/challenges/live-leaderboard";
import {
  getActiveChallenges,
  getChallengeLeaderboard,
} from "@/lib/challenges/public/challenge-engine";
import { Trophy, Target, Star, History } from "lucide-react";

export default async function ChallengesPage() {
  const user = await getAuthenticatedUser();
  if (!user) redirect("/auth/login");

  const activeChallenges = await getActiveChallenges();

  // For the demo, let's take the first active challenge for the leaderboard
  const mainChallenge = activeChallenges[0];
  const leaderboard = mainChallenge
    ? await getChallengeLeaderboard(mainChallenge.id)
    : [];

  return (
    <div className="max-w-6xl mx-auto py-8 px-6 space-y-16">
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-amber-100">
          <Trophy className="w-3 h-3" /> Événements Publics
        </div>
        <h1 className="text-5xl font-black tracking-tight text-slate-900">
          Arena <span className="text-blue-600">Behavior</span>
        </h1>
        <p className="text-xl text-slate-500 font-medium">
          Rejoignez les défis collectifs et comparez votre résilience aux
          meilleurs.
        </p>
      </div>

      {mainChallenge ? (
        <ChallengeBanner challenge={mainChallenge as any} />
      ) : (
        <div className="bg-slate-50 rounded-[3rem] p-20 text-center border-2 border-dashed border-slate-200">
          <p className="text-slate-400 font-black uppercase tracking-widest">
            Aucun défi actif pour le moment
          </p>
        </div>
      )}

      <div className="grid lg:grid-cols-12 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-8 space-y-12">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm space-y-4">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-slate-900">
                Measure. Compare. Adapt.
              </h3>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">
                Les défis ne mesurent pas vos connaissances, mais votre
                stabilité émotionnelle face aux interruptions et à la tension.
              </p>
            </div>
            <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm space-y-4">
              <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                <Star className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-slate-900">
                Récompenses Élite
              </h3>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">
                Chaque défi relevé débloque des Personas exclusifs, des badges
                de profil et des crédits bonus.
              </p>
            </div>
          </div>

          <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl space-y-8">
            <h3 className="text-xs font-black text-blue-400 uppercase tracking-widest flex items-center gap-2">
              <History className="w-4 h-4" /> Prochains Événements
            </h3>
            <div className="divide-y divide-white/5">
              {[
                {
                  date: "15 Juin",
                  name: "The Silence Test",
                  desc: "Survivrez-vous au scepticisme froid de l'IA ?",
                },
                {
                  date: "01 Juil",
                  name: "Executive Presence Week",
                  desc: "Le défi ultime pour les futurs directeurs.",
                },
              ].map((next, i) => (
                <div
                  key={i}
                  className="py-6 flex justify-between items-center group cursor-pointer"
                >
                  <div>
                    <p className="text-sm font-black group-hover:text-blue-400 transition-colors">
                      {next.name}
                    </p>
                    <p className="text-xs text-slate-500 mt-1 font-medium">
                      {next.desc}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-black text-slate-400 uppercase">
                      {next.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Leaderboard Sidebar */}
        <div className="lg:col-span-4">
          <div className="sticky top-24">
            <LiveLeaderboard entries={leaderboard as any} />
          </div>
        </div>
      </div>
    </div>
  );
}

export const dynamic = "force-dynamic";
