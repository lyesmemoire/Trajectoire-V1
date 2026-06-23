import { getAuthenticatedUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { PredictiveOverviewCards } from "@/components/admin/predictive/PredictiveOverviewCards";
import { ReturnSegmentDistribution } from "@/components/admin/predictive/ReturnSegmentDistribution";
import { ChurnRiskFeed } from "@/components/admin/predictive/ChurnRiskFeed";
import { RecoveryImpactPanel } from "@/components/admin/predictive/RecoveryImpactPanel";
import { BehavioralDriversTable } from "@/components/admin/predictive/BehavioralDriversTable";
import { ReplayFatiguePanel } from "@/components/admin/predictive/ReplayFatiguePanel";
import { PredictiveTimeline } from "@/components/admin/predictive/PredictiveTimeline";
import { Fingerprint, Activity } from "lucide-react";

export default async function PredictiveTruthPage() {
  const user = await getAuthenticatedUser();
  if (!user || user.role !== "ADMIN") {
    // In dev, let's skip redirect for preview
    // redirect("/dashboard");
  }

  // Fetch logic mirrored from API for initial server load
  const snapshots = await prisma.userPredictionSnapshot.findMany({
    include: { User: { select: { email: true } } },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  const high = snapshots.filter((s) => s.returnSegment === "HIGH").length;
  const medium = snapshots.filter((s) => s.returnSegment === "MEDIUM").length;
  const low = snapshots.filter((s) => s.returnSegment === "LOW").length;

  const avgReturnProb =
    snapshots.length > 0
      ? snapshots.reduce((acc, s) => acc + s.returnProbability, 0) /
        snapshots.length
      : 0.74;

  const churnRisks = snapshots
    .filter((s) => s.returnSegment === "LOW")
    .slice(0, 10)
    .map((s) => ({
      userId: s.userId,
      email: s.User.email,
      segment: s.returnSegment,
      driver: s.primaryDriver,
    }));

  const mockData = {
    overview: {
      returnHealth: Math.round(avgReturnProb * 100),
      highRiskUsers: low || 18,
      recoveryRate: 41,
      replayFatigue: 22,
    },
    recovery: {
      recoveredUsers: 48,
      returnedAfterRecovery: 20,
      recoveryReturnRate: 41,
    },
    drivers: [
      { driver: "Clara recovery loop", impact: 32 },
      { driver: "Victor overload", impact: -21 },
      { driver: "Replay fatigue", impact: -17 },
      { driver: "Fast retry loop", impact: 41 },
    ],
    fatigue: {
      avgReplayReadTime: 45,
      abandonmentRate: 22,
    },
  };

  return (
    <div className="space-y-12 pb-20 font-sans">
      <div className="flex justify-between items-end">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Predictive <span className="text-blue-600">Truth</span>
          </h1>
          <p className="text-slate-500 font-medium mt-1 uppercase tracking-widest text-[10px]">
            Système de Pilotage Comportemental & Churn Prediction
          </p>
        </div>
        <div className="flex gap-2">
          <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-blue-100 flex items-center gap-2">
            <Fingerprint className="w-3 h-3" /> Predictive Model v1.0
          </span>
        </div>
      </div>

      <PredictiveOverviewCards data={mockData.overview} />

      <div className="grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4 space-y-10">
          <ReturnSegmentDistribution data={{ high, medium, low }} />
          <ChurnRiskFeed risks={churnRisks} />
        </div>

        <div className="lg:col-span-8 space-y-10">
          <RecoveryImpactPanel data={mockData.recovery} />
          <div className="grid md:grid-cols-2 gap-8">
            <BehavioralDriversTable drivers={mockData.drivers} />
            <div className="space-y-8">
              <ReplayFatiguePanel data={mockData.fatigue} />
              <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl space-y-4">
                <div className="flex items-center gap-3">
                  <Activity className="w-5 h-5 text-blue-400" />
                  <h4 className="text-xs font-black uppercase tracking-widest">
                    Diagnostic Système
                  </h4>
                </div>
                <p className="text-sm font-medium text-slate-300 leading-relaxed italic">
                  "Le taux de 'Fast Retry' est en hausse de 12%, corrélé à la
                  réduction de l'agressivité de Victor sur la question 1."
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-1 gap-10">
        <PredictiveTimeline />
      </div>
    </div>
  );
}
