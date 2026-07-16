// @ts-nocheck
"use client";

import { useState } from "react";
import { getRecommendedRecoveryAction } from "@/lib/engagement/recovery-action";
import { calculateRiskScore } from "@/lib/emotional-safety/risk-score";
import { User, Clock, Loader2 } from "lucide-react";
import { Button } from "@/components/design-system";
import { toast } from "sonner";

export default function RecoveryDashboardPage() {
  const [isSending, setIsSending] = useState<string | null>(null);

  // Demo users at risk
  const [usersAtRisk, setUsersAtRisk] = useState([
    {
      id: "user_1",
      name: "Omar D.",
      email: "omar@example.com",
      lastActive: "Il y a 3 jours",
      lastEmailSentAt: null as string | null,
      metrics: {
        interruptionsCount: 8,
        pressurePeak: 92,
        confidenceDrop: 35,
        hesitationIncrease: 12,
        replayReturns: 7,
        replayDurationAvg: 145,
        sessionAbortions: 2,
        inactivityDays: 3,
      },
    },
  ]);

  const handleSendEmail = async (user: (typeof usersAtRisk)[0]) => {
    setIsSending(user.id);
    const risk = calculateRiskScore(user.metrics);
    const action = getRecommendedRecoveryAction(risk);

    try {
      const res = await fetch("/api/recovery/send", {
        method: "POST",
        body: JSON.stringify({
          userId: user.id,
          email: user.email,
          firstName: user.name.split(" ")[0],
          riskLevel: risk.riskLevel,
          probableCause: risk.probableCause,
          recommendedAction: {
            title: action.title,
            duration: action.duration,
          },
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      toast.success("Email de coaching envoyé");

      // Update local state to show "Last sent"
      setUsersAtRisk((users) =>
        users.map((u) =>
          u.id === user.id
            ? { ...u, lastEmailSentAt: new Date().toISOString() }
            : u,
        ),
      );
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsSending(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-6 space-y-10 font-sans text-slate-900">
      <div className="space-y-2 text-left">
        <h1 className="text-3xl font-black tracking-tight">
          Recovery <span className="text-blue-600">Dashboard</span>
        </h1>
        <p className="text-slate-500 font-medium uppercase tracking-widest text-[10px]">
          Supervision de la santé comportementale
        </p>
      </div>

      <div className="grid gap-6">
        {usersAtRisk.map((user) => {
          const risk = calculateRiskScore(user.metrics);
          const action = getRecommendedRecoveryAction(risk);

          return (
            <div
              key={user.id}
              className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col md:flex-row"
            >
              <div className="p-8 flex-1 space-y-6">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-4 text-left">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400">
                      <User className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-slate-900">
                        {user.name}
                      </h3>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                        {user.lastActive}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
                      risk.riskLevel === "high"
                        ? "bg-rose-50 text-rose-600 border-rose-100"
                        : "bg-blue-50 text-blue-600 border-blue-100"
                    }`}
                  >
                    Risque {risk.riskLevel}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
                  <div className="space-y-1">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">
                      Cause Probable
                    </p>
                    <p className="text-sm font-bold text-slate-700 capitalize">
                      {risk.probableCause}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">
                      Confidence Drop
                    </p>
                    <p className="text-sm font-bold text-slate-700">
                      -{user.metrics.confidenceDrop}%
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">
                      Abandons
                    </p>
                    <p className="text-sm font-bold text-slate-700">
                      {user.metrics.sessionAbortions}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">
                      Last Email
                    </p>
                    <p className="text-sm font-bold text-slate-700">
                      {user.lastEmailSentAt
                        ? new Date(user.lastEmailSentAt).toLocaleDateString()
                        : "Jamais"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-8 md:w-80 border-t md:border-t-0 md:border-l border-slate-100 flex flex-col justify-center space-y-4 text-left">
                <div className="space-y-1">
                  <p className="text-[8px] font-black text-blue-600 uppercase tracking-widest leading-none">
                    Action Recommandée
                  </p>
                  <p className="text-sm font-black text-slate-900 leading-tight">
                    {action.title}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                  <Clock className="w-3.5 h-3.5" /> {action.duration} ·{" "}
                  {action.difficulty}
                </div>
                <Button
                  onClick={() => handleSendEmail(user)}
                  disabled={isSending === user.id}
                  variant="primary"
                  className="w-full py-6 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg"
                >
                  {isSending === user.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Envoyer Coaching"
                  )}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
