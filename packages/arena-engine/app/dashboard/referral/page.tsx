import { getAuthenticatedUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getReferralStats } from "@/lib/referral/referral-engine";
import { Gift, Users, Trophy, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function ReferralPage() {
  const user = await getAuthenticatedUser();
  if (!user) redirect("/auth/login");

  const stats = await getReferralStats(user.id);

  return (
    <div className="max-w-6xl mx-auto py-8 px-6 space-y-16">
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-50 text-purple-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-purple-100">
          <Gift className="w-3 h-3" /> Programme Ambassadeur
        </div>
        <h1 className="text-5xl font-black tracking-tight text-slate-900">
          Invite & <span className="text-blue-600">Unlock</span>
        </h1>
        <p className="text-xl text-slate-500 font-medium">
          Partagez StudioEntretien et débloquez l'IA la plus puissante du
          marché.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-12">
        {/* Main Referral Card */}
        <div className="lg:col-span-8 space-y-12">
          <div className="bg-white rounded-[3rem] border border-slate-100 p-12 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Gift className="w-48 h-48" />
            </div>

            <div className="relative z-10 space-y-10">
              <div className="max-w-md">
                <h2 className="text-3xl font-black text-slate-900 leading-tight">
                  Gagnez des accès Élite pour chaque ami parrainé.
                </h2>
                <p className="text-slate-500 font-medium mt-4">
                  Dès 3 amis inscrits, vous débloquez le persona "Hardcore CTO"
                  et 50 crédits bonus.
                </p>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">
                  Votre code unique
                </label>
                <div className="flex gap-4 p-4 bg-slate-50 border-2 border-slate-100 rounded-3xl items-center justify-between">
                  <span className="text-2xl font-black text-slate-900 tracking-wider ml-4">
                    {stats?.referralCode}
                  </span>
                  <Button variant="primary" className="h-14 px-8 rounded-2xl">
                    <Copy className="w-5 h-5 mr-2" /> Copier
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                label: "Inscrits",
                value: stats?.referralCount || 0,
                icon: Users,
                color: "blue",
              },
              {
                label: "Personas Débloqués",
                value: "2/5",
                icon: Trophy,
                color: "purple",
              },
              {
                label: "Crédits Gagnés",
                value: (stats?.referralCount || 0) * 10,
                icon: Gift,
                color: "emerald",
              },
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm text-center space-y-2"
              >
                <div
                  className={`w-12 h-12 rounded-2xl bg-${stat.color}-50 text-${stat.color}-600 flex items-center justify-center mx-auto mb-4`}
                >
                  <stat.icon className="w-6 h-6" />
                </div>
                <p className="text-3xl font-black text-slate-900">
                  {stat.value}
                </p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Reward Roadmap */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl space-y-8">
            <h3 className="text-xs font-black text-blue-400 uppercase tracking-widest">
              Roadmap des Récompenses
            </h3>
            <div className="space-y-6">
              {[
                { count: 1, label: "Badge 'Pioneer'", status: "locked" },
                { count: 3, label: "Persona: Hardcore CTO", status: "locked" },
                { count: 10, label: "Accès Pro à vie", status: "locked" },
              ].map((reward, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 group cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-black text-xs">
                    {reward.count}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold opacity-70 group-hover:opacity-100 transition-opacity">
                      {reward.label}
                    </p>
                    <div className="h-1 bg-white/5 rounded-full mt-2 overflow-hidden">
                      <div className="h-full bg-blue-500 w-0" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
