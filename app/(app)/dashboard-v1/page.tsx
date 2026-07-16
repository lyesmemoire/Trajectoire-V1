"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { CareerProgressionCard } from "@/components/dashboard/CareerProgressionCard";
import { CareerCopilotCard } from "@/components/dashboard/CareerCopilotCard";
import { ObjectivesList } from "@/components/dashboard/ObjectivesList";
import { PriorityActionsList } from "@/components/dashboard/PriorityActionsList";
import { RecentActivityList } from "@/components/dashboard/RecentActivityList";
import { IntelligenceEnginesStatus } from "@/components/dashboard/IntelligenceEnginesStatus";
import { CardSkeleton, ListSkeleton, ProgressSkeleton } from "@/components/dashboard/Skeleton";
import { DashboardData } from "@/modules/dashboard/domain/entities/dashboard.entity";

export default function DashboardV1() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const response = await fetch("/api/dashboard");
        const result = await response.json();

        if (!response.ok) {
          if (response.status === 401) {
            router.push("/auth/login?redirect=/dashboard");
            return;
          }
          throw new Error(result.message || "Failed to load dashboard");
        }

        if (result.success && result.data) {
          setData(result.data);
        } else {
          throw new Error(result.message || "Invalid response");
        }
      } catch (err: any) {
        setError(err.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, [router]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="space-y-3">
          <div className="h-8 bg-gray-200 rounded w-64 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-96 animate-pulse" />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CardSkeleton />
          <CardSkeleton />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <CardSkeleton />
          </div>
          <CardSkeleton />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || "Failed to load dashboard"}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  const now = new Date();
  const greeting = now.getHours() < 12 ? "Bonjour" : now.getHours() < 18 ? "Bon après-midi" : "Bonsoir";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-semibold text-gray-900">
            {greeting}, {data.userName} 👋
          </h1>
          <p className="text-gray-600 mt-1">
            {now.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <button
          onClick={() => router.push("/(app)/dashboard/profile")}
          className="bg-white border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Profil
        </button>
      </div>

      {/* Top cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CareerProgressionCard data={data.careerProgression} />
        <CareerCopilotCard 
          data={data.careerCopilot} 
        />
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          <DashboardCard title="Objectifs">
            <ObjectivesList objectives={data.objectives} />
          </DashboardCard>

          <DashboardCard title="Actions prioritaires">
            <PriorityActionsList actions={data.priorityActions} />
          </DashboardCard>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          <IntelligenceEnginesStatus engines={data.intelligenceEngines} />

          <DashboardCard title="Activité récente">
            <RecentActivityList activities={data.recentActivity} />
          </DashboardCard>
        </div>
      </div>
    </div>
  );
}
