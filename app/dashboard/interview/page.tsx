"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Mic2,
  History,
  TrendingUp,
  Play,
  CheckCircle2,
  Brain,
  Zap,
  ArrowRight,
  Plus,
} from "lucide-react";

interface PastSession {
  id: string;
  job_title: string;
  final_score: number | null;
  level: string | null;
  status: string;
  created_at: string;
}

function scoreBadgeColor(score: number | null): string {
  if (!score) return "bg-slate-100 text-slate-600";
  if (score >= 80) return "bg-emerald-50 text-emerald-700 border-emerald-100";
  if (score >= 60) return "bg-blue-50 text-blue-700 border-blue-100";
  if (score >= 40) return "bg-amber-50 text-amber-700 border-amber-100";
  return "bg-red-50 text-red-700 border-red-100";
}

function formatRelativeDate(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "À l'instant";
  if (diffMins < 60) return `Il y a ${diffMins} min`;
  if (diffHours < 24) return `Il y a ${diffHours}h`;
  if (diffDays === 1) return "Hier";
  if (diffDays < 7) return `Il y a ${diffDays} jours`;
  return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

export default function InterviewDashboard() {
  const [sessions, setSessions] = useState<PastSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [sessionsThisMonth, setSessionsThisMonth] = useState(0);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/interview/history");
        if (res.ok) {
          const data = await res.json();
          setSessions(data.sessions || []);
          setSessionsThisMonth(data.sessionsThisMonth ?? 0);
        }
      } catch (err) {
        console.error("[Interview History Error]:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const remainingSessions = Math.max(0, 4 - sessionsThisMonth);

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">
            Mock Interview Lab
          </h1>
          <p className="text-slate-500 font-medium">
            L'entraînement d'élite pour vos entretiens d'embauche.
          </p>
        </div>
        <Link
          href="/dashboard/interview/session"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-black rounded-2xl
                hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/25 active:scale-95"
        >
          <Plus className="w-5 h-5" />
          Nouvelle Session
        </Link>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          {/* Main CTA Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl overflow-hidden relative"
          >
            <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-[100px]" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-violet-500/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-[60px]" />

            <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
              <div className="flex-1 space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-xs font-black uppercase tracking-widest">
                  <Zap className="w-3.5 h-3.5 fill-current" /> Simulation IA
                  Active
                </div>
                <h2 className="text-3xl font-black leading-tight">
                  Prêt à affronter un{" "}
                  <span className="text-blue-400">recruteur virtuel ?</span>
                </h2>
                <p className="text-slate-400 font-medium leading-relaxed">
                  Notre simulateur s'adapte à votre CV et au poste visé.
                  Progressez avec des débriefings détaillés sur votre
                  communication et votre technique.
                </p>
                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <Link
                    href="/dashboard/interview/session"
                    className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-slate-900 font-black rounded-2xl hover:bg-slate-100 transition-all shadow-xl active:scale-95"
                  >
                    Lancer la simulation
                    <Play className="w-5 h-5 fill-current transition-transform group-hover:translate-x-1" />
                  </Link>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Disponibilité
                    </span>
                    <span className="text-sm font-black text-emerald-400">
                      {remainingSessions} crédits offerts
                    </span>
                  </div>
                </div>
              </div>
              <div className="hidden md:block w-48 h-48 bg-slate-800 rounded-3xl border border-slate-700 p-6 shadow-inner flex items-center justify-center">
                <Mic2 className="w-20 h-20 text-blue-500" />
              </div>
            </div>
          </motion.div>

          {/* Feature Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: <Brain className="w-6 h-6" />,
                title: "Analyse Sémantique",
                desc: "Détection de vos mots-clés stratégiques.",
                color: "blue",
              },
              {
                icon: <TrendingUp className="w-6 h-6" />,
                title: "Score de Confiance",
                desc: "Évaluation de votre aisance orale.",
                color: "emerald",
              },
              {
                icon: <CheckCircle2 className="w-6 h-6" />,
                title: "Méthode STAR",
                desc: "Validation de la structure de vos réponses.",
                color: "violet",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div
                  className={`w-12 h-12 rounded-2xl bg-${feature.color}-50 text-${feature.color}-600 flex items-center justify-center mb-4`}
                >
                  {feature.icon}
                </div>
                <h3 className="font-black text-slate-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm font-medium text-slate-500 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Guide Section */}
          <div className="bg-white rounded-[2rem] border border-slate-100 p-10">
            <div className="max-w-xl">
              <h3 className="text-2xl font-black text-slate-900 mb-4">
                Comment réussir vos sessions ?
              </h3>
              <div className="space-y-6">
                {[
                  {
                    step: "01",
                    title: "Préparez votre environnement",
                    text: "Isolez-vous dans un endroit calme pour favoriser votre concentration.",
                  },
                  {
                    step: "02",
                    title: "Soyez spécifique",
                    text: "Utilisez des exemples chiffrés et des résultats concrets pour chaque expérience.",
                  },
                  {
                    step: "03",
                    title: "Analysez le feedback",
                    text: "Lisez attentivement le débriefing IA pour corriger vos erreurs lors de la session suivante.",
                  },
                ].map((item, i) => (
                  <div key={i} className="flex gap-6">
                    <span className="text-3xl font-black text-slate-100 tabular-nums">
                      {item.step}
                    </span>
                    <div>
                      <h4 className="font-bold text-slate-900 mb-1">
                        {item.title}
                      </h4>
                      <p className="text-sm font-medium text-slate-500">
                        {item.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-4 space-y-8">
          {/* Quick Progress Summary */}
          <div className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm">
            <h3 className="font-black text-slate-900 mb-6 flex items-center gap-2">
              <History className="w-5 h-5 text-slate-400" /> Historique Récent
            </h3>

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-16 bg-slate-50 rounded-2xl animate-pulse"
                  />
                ))}
              </div>
            ) : sessions.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 rounded-[1.5rem] border border-dashed border-slate-200">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4">
                  <Mic2 className="w-8 h-8 text-slate-300" />
                </div>
                <p className="font-bold text-slate-900">Aucune session</p>
                <p className="text-xs text-slate-500 mt-1 max-w-[150px] mx-auto">
                  Lancez votre premier entraînement pour voir vos résultats.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {sessions.slice(0, 6).map((s) => (
                  <div
                    key={s.id}
                    className="group flex items-center justify-between p-4 rounded-2xl border border-transparent hover:border-slate-100 hover:bg-slate-50 transition-all cursor-pointer"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-black text-sm text-slate-900 truncate pr-2 group-hover:text-blue-600 transition-colors">
                        {s.job_title || "Simulation Générale"}
                      </div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                        {formatRelativeDate(s.created_at)}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {s.status === "completed" ? (
                        <div
                          className={`px-3 py-1 text-xs font-black rounded-xl border ${scoreBadgeColor(s.final_score)}`}
                        >
                          {s.final_score}
                        </div>
                      ) : (
                        <div className="px-3 py-1 text-xs font-black rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
                          Live
                        </div>
                      )}
                      <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-colors group-hover:translate-x-0.5" />
                    </div>
                  </div>
                ))}

                {sessions.length > 6 && (
                  <Link
                    href="/dashboard/progress"
                    className="block text-center pt-4 text-xs font-black text-blue-600 hover:text-blue-700 uppercase tracking-widest"
                  >
                    Voir tout l'historique
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Motivation Card */}
          <div className="bg-gradient-to-br from-violet-600 to-indigo-700 rounded-[2rem] p-8 text-white shadow-lg">
            <TrendingUp className="w-10 h-10 mb-4 opacity-50" />
            <h4 className="text-xl font-black mb-2">92% de réussite</h4>
            <p className="text-violet-100 text-sm font-medium leading-relaxed opacity-90">
              C'est le taux de candidats ayant obtenu une offre après au moins 3
              sessions d'entraînement sur StudioEntretien.
            </p>
            <Link
              href="/dashboard/progress"
              className="mt-6 inline-flex items-center gap-2 text-sm font-black text-white underline underline-offset-4"
            >
              Voir mes statistiques de réussite
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
