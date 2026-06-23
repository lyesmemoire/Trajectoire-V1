import { getAuthenticatedUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import CareerScoreCard from "@/components/dashboard/career-score-card";
import SkillRadar from "@/components/dashboard/skill-radar";
import {
  Zap,
  BarChart3,
  Share2,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

function getCTSLabel(score: number): string {
  if (score <= 40) return "Foundation Phase";
  if (score <= 60) return "Emerging Candidate";
  if (score <= 75) return "Strong Candidate";
  if (score <= 90) return "Executive Ready";
  return "Board-Level Ready";
}

// Composant Sparkline simpliste pour la trajectoire
function CTSSparkline({ data }: { data: number[] }) {
  if (!data || data.length < 2) return <div className="h-12 flex items-end"><div className="w-full h-1 bg-[var(--border)] rounded-full" /></div>;
  const max = Math.max(...data, 100);
  const min = Math.max(0, Math.min(...data) - 10);
  const range = max - min;
  
  return (
    <div className="flex items-end gap-1 h-12">
      {data.map((score, i) => {
        const heightPct = range === 0 ? 50 : ((score - min) / range) * 100;
        return (
          <div key={i} className="flex-1 bg-[var(--primary)]/10 rounded-t-sm relative group hover:bg-[var(--primary)]/20 transition-colors" style={{ height: `${Math.max(10, heightPct)}%` }}>
            <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-[var(--text-primary)] text-[var(--bg-card)] text-[10px] px-2 py-1 rounded shadow-lg whitespace-nowrap transition-opacity">
              {score}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default async function ProgressPage() {
  const user = await getAuthenticatedUser();
  if (!user) redirect("/auth/login");

  const profile = await prisma.careerProfile.findUnique({
    where: { userId: user.id },
  });

  const recentSessions = await prisma.interviewSession.findMany({
    where: { userId: user.id, status: 'completed', careerTrajectoryScore: { not: null } },
    orderBy: { createdAt: 'desc' },
    take: 10,
    select: { careerTrajectoryScore: true, createdAt: true }
  });

  const ctsHistory = recentSessions.map(s => s.careerTrajectoryScore!).reverse();
  const currentCTS = ctsHistory.length > 0 ? ctsHistory[ctsHistory.length - 1] : null;
  const previousCTS = ctsHistory.length > 1 ? ctsHistory[ctsHistory.length - 2] : null;
  const delta = (currentCTS !== null && previousCTS !== null) ? Math.round((currentCTS - previousCTS) * 10) / 10 : 0;

  if (!profile && ctsHistory.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center space-y-10">
        <div className="w-24 h-24 bg-slate-100 rounded-[2.5rem] flex items-center justify-center text-5xl mx-auto mb-6">
          📊
        </div>
        <h2 className="text-4xl font-black text-slate-900">
          Commencez votre ascension
        </h2>
        <p className="text-xl text-slate-500 font-medium max-w-xl mx-auto">
          Votre premier entretien activera votre profil de compétences et votre
          score d'employabilité.
        </p>
        <div className="pt-6">
          <Link
            href="/dashboard/interview/session"
            className="px-10 py-5 bg-blue-600 text-[var(--bg-card)] font-black rounded-2xl hover:bg-blue-700 transition-all shadow-[var(--shadow-card)] shadow-blue-500/20 inline-flex items-center gap-4"
          >
            Lancer ma première session
          </Link>
        </div>
      </div>
    );
  }

  const dna = (profile?.careerDNA as any) || {};
  const radarData = [
    { skill: "Communication", score: profile?.communicationScore || 0 },
    { skill: "Confiance", score: profile?.confidenceTrend || 0 },
    { skill: "Technique", score: profile?.employabilityScore || 0 },
    { skill: "Leadership", score: profile?.leadershipScore || 0 },
  ];

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-5xl font-black tracking-tight text-slate-900">
            Production <span className="text-blue-600">Intelligence</span>
          </h1>
          <p className="text-xl text-slate-500 font-medium italic">
            Analyse comportementale et trajectoire de carrière.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
              <Zap className="w-6 h-6 fill-current" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
                Série actuelle
              </p>
              <p className="text-lg font-black text-slate-900">
                {dna.currentStreak || 0} jours
              </p>
            </div>
          </div>
          <Button variant="outline" className="h-14 rounded-2xl font-black">
            <Share2 className="w-4 h-4 mr-2" /> Partager mon DNA
          </Button>
        </div>
      </div>

      {/* HERO BANNER: CAREER TRAJECTORY SCORE */}
      {currentCTS !== null && (
        <div className="bg-slate-900 rounded-[2.5rem] p-8 md:p-12 text-[var(--bg-card)] shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <BarChart3 className="w-64 h-64" />
          </div>
          
          <div className="relative z-10 space-y-4">
            <h2 className="text-sm font-black text-blue-400 uppercase tracking-widest">
              Career Trajectory Score
            </h2>
            <div className="flex items-baseline gap-4">
              <span className="text-6xl md:text-7xl font-black">{currentCTS}</span>
              <span className={`text-xl font-bold px-3 py-1 rounded-full ${delta >= 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                {delta > 0 ? '+' : ''}{delta}
              </span>
            </div>
            <p className="text-2xl font-bold text-slate-300">
              {getCTSLabel(currentCTS)}
            </p>
          </div>

          <div className="relative z-10 w-full md:w-1/3 bg-white/5 rounded-2xl p-6 border border-white/10">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
              10 dernières sessions
            </p>
            <CTSSparkline data={ctsHistory} />
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-10">
          {profile && (
            <CareerScoreCard
              score={profile.employabilityScore}
            />
          )}

          <div className="bg-slate-900 rounded-[var(--radius-card)] p-10 text-[var(--bg-card)] shadow-2xl space-y-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <BarChart3 className="w-32 h-32" />
            </div>
            <h4 className="text-xs font-black text-blue-400 uppercase tracking-widest">
              Benchmarking
            </h4>
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-sm font-bold text-slate-400">
                  Communication
                </span>
                <span className="text-2xl font-black text-[var(--bg-card)]">Top 15%</span>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500" style={{ width: "85%" }} />
              </div>
              <p className="text-[10px] font-medium text-slate-500 leading-relaxed">
                Vous surpassez 85% des candidats sur votre clarté oratoire.
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8">
          <SkillRadar data={radarData} />
        </div>
      </div>
    </div>
  );
}
