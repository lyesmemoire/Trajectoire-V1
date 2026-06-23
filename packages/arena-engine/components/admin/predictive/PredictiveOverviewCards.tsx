"use client";

import { TrendingUp, UserMinus, RotateCcw, EyeOff } from "lucide-react";

interface Props {
  data: {
    returnHealth: number;
    highRiskUsers: number;
    recoveryRate: number;
    replayFatigue: number;
  };
}

export function PredictiveOverviewCards({ data }: Props) {
  const cards = [
    {
      title: "Predicted Return Health",
      value: `${data.returnHealth}%`,
      icon: TrendingUp,
      color: "text-blue-500",
    },
    {
      title: "High-Risk Users",
      value: data.highRiskUsers,
      icon: UserMinus,
      color: "text-rose-500",
    },
    {
      title: "Recovery Return Rate",
      value: `${data.recoveryRate}%`,
      icon: RotateCcw,
      color: "text-emerald-500",
    },
    {
      title: "Replay Fatigue",
      value: `${data.replayFatigue}%`,
      icon: EyeOff,
      color: "text-amber-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card) => (
        <div
          key={card.title}
          className="bg-[#0B1023] rounded-3xl border border-white/[0.08] p-8 space-y-4 shadow-xl"
        >
          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
            <card.icon className={`w-5 h-5 ${card.color}`} />
          </div>
          <div>
            <p className="text-4xl font-black text-white">{card.value}</p>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">
              {card.title}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
