"use client";

import { useState } from "react";

export default function CreditsDashboard() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRecharge = async () => {
    try {
      console.log("Recharge clicked");
      setIsLoading(true);
      setError(null);
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId: "price_starter_5credits" }),
      });

      const data = await res.json();
      console.log("Stripe response:", data);

      if (!res.ok) {
        throw new Error(data.error || `Erreur serveur: ${res.status}`);
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("URL de redirection manquante");
      }
    } catch (err) {
      console.error("[Checkout Error]:", err);
      setError(err instanceof Error ? err.message : "Erreur inconnue");
      alert(
        `Erreur de paiement : ${err instanceof Error ? err.message : String(err)}`,
      );
    } finally {
      setIsLoading(false);
    }
  };
  const transactions = [
    {
      id: "1",
      date: "2026-05-20",
      desc: "Analyse ATS (Product Manager)",
      amount: -1,
      type: "usage",
    },
    {
      id: "2",
      date: "2026-05-18",
      desc: "Mock Interview (Tech Lead)",
      amount: -2,
      type: "usage",
    },
    {
      id: "3",
      date: "2026-05-15",
      desc: "Recharge Pack Pro",
      amount: 15,
      type: "purchase",
    },
    {
      id: "4",
      date: "2026-05-15",
      desc: "Bonus de bienvenue",
      amount: 2,
      type: "bonus",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-slate-900">
          Mes Crédits
        </h1>
        <p className="text-slate-500 mt-1">
          Gérez votre solde et rechargez vos crédits.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Balance Card */}
        <div className="lg:col-span-1">
          <div className="bg-gradient-to-br from-blue-600 to-violet-600 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-10 text-8xl">
              💎
            </div>
            <div className="relative">
              <div className="text-blue-100 font-bold mb-2 uppercase tracking-wider text-sm">
                Solde actuel
              </div>
              <div className="text-6xl font-black mb-6">14</div>

              <button
                onClick={handleRecharge}
                disabled={isLoading}
                className="w-full py-3 bg-white text-blue-600 font-black rounded-xl hover:scale-105 transition-transform shadow-lg disabled:opacity-50"
              >
                {isLoading ? "Redirection..." : "Recharger"}
              </button>
              {error && (
                <div className="mt-4 p-2 bg-red-100 text-red-700 text-sm rounded-lg font-bold">
                  {error}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Transactions History */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h2 className="font-bold text-slate-900">
                Historique des transactions
              </h2>
            </div>
            <div className="divide-y divide-slate-100">
              {transactions.map((t) => (
                <div
                  key={t.id}
                  className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        t.type === "purchase"
                          ? "bg-green-100 text-green-600"
                          : t.type === "bonus"
                            ? "bg-amber-100 text-amber-600"
                            : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {t.type === "purchase"
                        ? "💳"
                        : t.type === "bonus"
                          ? "🎁"
                          : "📉"}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">{t.desc}</div>
                      <div className="text-sm text-slate-500">
                        {new Date(t.date).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </div>
                    </div>
                  </div>
                  <div
                    className={`font-black text-lg ${t.amount > 0 ? "text-green-600" : "text-slate-900"}`}
                  >
                    {t.amount > 0 ? "+" : ""}
                    {t.amount}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-slate-100 bg-slate-50 text-center">
              <button className="text-sm font-bold text-slate-500 hover:text-slate-900">
                Voir plus
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
