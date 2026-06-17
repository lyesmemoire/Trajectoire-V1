import { getAuthenticatedUser } from "@/lib/auth";
import { RealtimeActivityFeed } from "@/components/admin/realtime-activity-feed";
import {
  Cpu,
  Globe,
  Activity,
  ShieldAlert,
  Heart,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function AdminDashboard() {
  const user = await getAuthenticatedUser();

  // Fetch Global KPIs (Mocked for now)
  const stats = {
    dau: 142,
    interviewsStarted: 1284,
    interviewsCompleted: 1042,
    completionRate: 81,
    avgPressure: 64,
    activationRate: 42,
    dnaShares: 312,
    revenue: "2,840€",
  };

  return (
    <div className="space-y-10 pb-20 font-sans">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Admin <span className="text-blue-600">Intelligence</span>
        </h1>
        <div className="flex gap-4">
          <Link href="/admin/behavioral-stability">
            <span className="px-4 py-2 bg-blue-50 text-blue-600 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-blue-100 flex items-center gap-2 hover:bg-blue-100 transition-colors">
              <ShieldAlert className="w-3 h-3" /> Stabilité Comportementale
            </span>
          </Link>
          <Link href="/admin/product-truth">
            <span className="px-4 py-2 bg-purple-50 text-purple-600 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-purple-100 flex items-center gap-2 hover:bg-purple-100 transition-colors">
              <Heart className="w-3 h-3" /> Product Truth
            </span>
          </Link>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Realtime Activity */}
        <div className="lg:col-span-8 bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-500" /> Flux d'Activité
              Live
            </h3>
          </div>
          <RealtimeActivityFeed />
        </div>

        {/* System Health / AI Stats */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Cpu className="w-32 h-32" />
            </div>
            <h4 className="text-xs font-black text-blue-400 uppercase tracking-widest">
              Observabilité IA
            </h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-slate-400">
                  Latence Moyenne
                </span>
                <span className="text-lg font-black text-white">840ms</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-slate-400">
                  Coût / Session
                </span>
                <span className="text-lg font-black text-white">0.08$</span>
              </div>
            </div>
            <Button
              asChild
              variant="ghost"
              className="w-full text-blue-400 font-black hover:text-white hover:bg-white/5 border border-white/10 mt-4"
            >
              <Link href="/admin/ai-observability">Ouvrir AI Center →</Link>
            </Button>
          </div>

          <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm space-y-6">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-500" /> Viralité
            </h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-slate-600">
                  DNA Shares
                </span>
                <span className="text-lg font-black text-slate-900">
                  {stats.dnaShares}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-slate-600">
                  Waitlist
                </span>
                <span className="text-lg font-black text-slate-900">2,412</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const dynamic = "force-dynamic";
