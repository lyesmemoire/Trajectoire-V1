"use client";

import { useEffect, useState } from "react";

interface Metrics {
  totalCost: number;
  totalCreditsUsed: number;
  orgCount: number;
}

export default function AdminDashboard() {
  const [data, setData] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/dashboard-metrics")
      .then((res) => res.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-gray-400 text-lg">Chargement des métriques...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-red-400 text-lg">Erreur de chargement</div>
      </div>
    );
  }

  const estimatedRevenue = data.totalCreditsUsed * 0.2;
  const margin = estimatedRevenue - data.totalCost;
  const marginPercent =
    estimatedRevenue > 0 ? (margin / estimatedRevenue) * 100 : 0;

  const cards = [
    {
      title: "💰 Revenue Estimé (24h)",
      value: `€${estimatedRevenue.toFixed(2)}`,
      color: "from-emerald-600 to-emerald-800",
    },
    {
      title: "🤖 Coût OpenAI (24h)",
      value: `€${data.totalCost.toFixed(4)}`,
      color: "from-red-600 to-red-800",
    },
    {
      title: "📊 Marge Estimée (24h)",
      value: `€${margin.toFixed(2)} (${marginPercent.toFixed(0)}%)`,
      color:
        margin >= 0
          ? "from-blue-600 to-blue-800"
          : "from-orange-600 to-orange-800",
    },
    {
      title: "🧾 Crédits Consommés (24h)",
      value: data.totalCreditsUsed.toString(),
      color: "from-purple-600 to-purple-800",
    },
    {
      title: "🏢 Organisations Actives",
      value: data.orgCount.toString(),
      color: "from-cyan-600 to-cyan-800",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">📈 Admin Dashboard</h1>
          <p className="text-gray-400 mt-1">Vue macro — dernières 24 heures</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card) => (
            <div
              key={card.title}
              className={`bg-gradient-to-br ${card.color} rounded-2xl p-6 shadow-lg`}
            >
              <h2 className="text-sm font-medium text-white/70">
                {card.title}
              </h2>
              <p className="text-3xl font-bold mt-3">{card.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          <a
            href="/admin/fraud"
            className="block p-6 bg-gray-900 border border-gray-800 rounded-xl hover:border-red-500/50 transition-colors"
          >
            <h3 className="text-lg font-semibold">🚨 Fraud Control Center</h3>
            <p className="text-gray-400 text-sm mt-1">
              Gérer les utilisateurs suspects, bannir, unflag, restaurer crédits
            </p>
          </a>
          <a
            href="/admin/organizations"
            className="block p-6 bg-gray-900 border border-gray-800 rounded-xl hover:border-cyan-500/50 transition-colors"
          >
            <h3 className="text-lg font-semibold">🏢 Organisations B2B</h3>
            <p className="text-gray-400 text-sm mt-1">
              Voir les organisations, crédits pool, assigner des utilisateurs
            </p>
          </a>
        </div>
      </div>
    </div>
  );
}
