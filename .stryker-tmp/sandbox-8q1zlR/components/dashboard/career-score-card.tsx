// @ts-nocheck
"use client";

interface Props {
  score: number;
}

export default function CareerScoreCard({ score }: Props) {
  return (
    <div className="rounded-2xl border p-6 bg-white shadow-sm border-slate-100">
      <h3 className="text-lg font-black text-slate-900 mb-2 tracking-tight">
        Score d'Employabilité
      </h3>

      <div className="text-5xl font-black text-blue-600">{score}</div>

      <p className="text-sm font-medium text-slate-400 mt-2">
        Mis à jour après chaque session d'entraînement
      </p>
    </div>
  );
}
