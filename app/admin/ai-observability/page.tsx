import { getAuthenticatedUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { AICostOverview } from "@/components/admin/ai/ai-cost-overview";
import { AIModelDistribution } from "@/components/admin/ai/ai-model-distribution";
import { AIFeatureCosts } from "@/components/admin/ai/ai-feature-costs";
import { AIAnomalyTable } from "@/components/admin/ai/ai-anomaly-table";
import { detectAIAnomalies } from "@/lib/ai-monitoring/detect-anomaly";
import { Cpu, Zap, Activity, AlertCircle } from "lucide-react";

export default async function AIObservabilityPage() {
  const user = await getAuthenticatedUser();
  if (!user || user.role !== "ADMIN") {
    // redirect("/"); // For now allowed for dev preview
  }

  // Fetch metrics for last 24h
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const logs = await prisma.aIUsageLog.findMany({
    where: { createdAt: { gte: yesterday } },
  });

  const totalCost = logs.reduce((acc, l) => acc + l.costUsd, 0);
  const totalTokens = logs.reduce(
    (acc, l) => acc + l.tokensInput + l.tokensOutput,
    0,
  );
  const avgLatency =
    logs.length > 0
      ? Math.round(logs.reduce((acc, l) => acc + l.latencyMs, 0) / logs.length)
      : 0;
  const cacheHitRate =
    logs.length > 0
      ? Math.round((logs.filter((l) => l.cacheHit).length / logs.length) * 100)
      : 0;

  const anomalies = await detectAIAnomalies();

  return (
    <div className="space-y-10 pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            AI <span className="text-blue-600">Observability</span>
          </h1>
          <p className="text-slate-500 font-medium mt-1 uppercase tracking-widest text-[10px]">
            Command Center for AI Intelligence
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AICostOverview
          title="Daily AI Spend"
          value={`$${totalCost.toFixed(2)}`}
          trend="+5%"
          icon={<Zap className="w-5 h-5" />}
        />
        <AICostOverview
          title="Tokens Consumed"
          value={`${(totalTokens / 1000).toFixed(1)}k`}
          trend="-2%"
          icon={<Cpu className="w-5 h-5" />}
        />
        <AICostOverview
          title="Avg Latency"
          value={`${avgLatency}ms`}
          trend="Stable"
          icon={<Activity className="w-5 h-5" />}
        />
        <AICostOverview
          title="Cache Hit Rate"
          value={`${cacheHitRate}%`}
          trend="+12%"
          icon={<AlertCircle className="w-5 h-5" />}
        />
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Model & Feature Charts */}
        <div className="lg:col-span-8 space-y-8">
          <AIFeatureCosts logs={logs as any} />
          <AIAnomalyTable anomalies={anomalies} />
        </div>

        {/* Sidebar Distribution */}
        <div className="lg:col-span-4 space-y-8">
          <AIModelDistribution logs={logs as any} />
        </div>
      </div>
    </div>
  );
}
