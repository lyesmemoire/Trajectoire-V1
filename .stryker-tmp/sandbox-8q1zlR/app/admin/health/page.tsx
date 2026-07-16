// @ts-nocheck
"use client";

import { useState, useEffect } from "react";
import {
  ShieldCheck,
  Activity,
  Database,
  Zap,
  Cpu,
  Bug,
  RefreshCw,
  Clock,
  Terminal,
} from "lucide-react";
import { Button } from "@/components/design-system";
import { toast } from "sonner";
import { captureAIError } from "@/lib/monitoring/sentry";

export default function AdminHealthPage() {
  const [health, setHealth] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchHealth = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/health");
      const data = await res.json();
      setHealth(data);
    } catch (e) {
      toast.error("Échec de la récupération de la santé système");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  // Chaos Triggers for Sentry Validation
  const triggerReactError = () => {
    throw new Error("Sentry Test: intentional React frontend error");
  };

  const triggerAIError = () => {
    captureAIError(new Error("Sentry Test: AI Engine Timeout"), {
      feature: "interview",
      userId: "admin_test",
    });
    toast.info("Erreur IA envoyée à Sentry");
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-6 space-y-12 font-sans">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Pre-Launch <span className="text-blue-600">Health Audit</span>
          </h1>
          <p className="text-slate-500 font-medium uppercase tracking-widest text-[10px] mt-1">
            Validation Production Grade Candidate
          </p>
        </div>
        <Button
          onClick={fetchHealth}
          disabled={loading}
          variant="outline"
          className="rounded-2xl"
        >
          {loading ? (
            <RefreshCw className="animate-spin w-4 h-4 mr-2" />
          ) : (
            <Activity className="w-4 h-4 mr-2" />
          )}
          Rafraîchir l'audit
        </Button>
      </div>

      {/* 1. Services Status */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Database", key: "database", icon: Database },
          { label: "Redis Cache", key: "redis", icon: Zap },
          { label: "Mistral AI", key: "mistral", icon: Cpu },
          { label: "Stripe API", key: "stripe", icon: ShieldCheck },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-4"
          >
            <div className="flex justify-between items-center">
              <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                <s.icon className="w-5 h-5" />
              </div>
              <div
                className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest ${
                  health?.services[s.key] === "connected"
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-rose-50 text-rose-600"
                }`}
              >
                {health?.services[s.key] || "Checking..."}
              </div>
            </div>
            <p className="text-xs font-black text-slate-900 uppercase tracking-widest">
              {s.label}
            </p>
          </div>
        ))}
      </div>

      {/* 2. Chaos Engineering (Sentry Validation) */}
      <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl space-y-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-5">
          <Bug className="w-32 h-32" />
        </div>
        <div className="relative space-y-2">
          <h3 className="text-xl font-black flex items-center gap-3">
            <Terminal className="w-6 h-6 text-blue-400" /> Chaos & Observability
            Test
          </h3>
          <p className="text-slate-400 text-sm font-medium">
            Déclenchez volontairement des erreurs pour valider la capture
            Sentry.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 relative">
          <div className="p-8 bg-white/5 border border-white/10 rounded-[2rem] space-y-6">
            <div>
              <h4 className="font-black text-white italic">
                Front-end Resilience
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Teste la capture des erreurs React et le Session Replay.
              </p>
            </div>
            <Button
              onClick={triggerReactError}
              variant="error"
              className="w-full rounded-xl font-black"
            >
              Trigger Runtime Error
            </Button>
          </div>
          <div className="p-8 bg-white/5 border border-white/10 rounded-[2rem] space-y-6">
            <div>
              <h4 className="font-black text-white italic">AI Core Recovery</h4>
              <p className="text-xs text-slate-500 mt-1">
                Teste le logging spécifique aux échecs de l'intelligence
                Mistral.
              </p>
            </div>
            <Button
              onClick={triggerAIError}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black"
            >
              Log AI Exception
            </Button>
          </div>
        </div>
      </div>

      {/* 3. Performance Metrics */}
      <div className="bg-white rounded-[3rem] border border-slate-100 p-10 shadow-sm space-y-8">
        <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
          <Clock className="w-6 h-6 text-emerald-500" /> Latency Benchmarks
        </h3>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="space-y-2">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Internal API Check
            </p>
            <p className="text-2xl font-black text-slate-900">
              {health?.latency.total_check_ms}ms
            </p>
            <div className="h-1 w-full bg-emerald-500 rounded-full" />
          </div>
          <div className="space-y-2">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Target LCP (Mobile)
            </p>
            <p className="text-2xl font-black text-slate-900">&lt; 1.5s</p>
            <div className="h-1 w-full bg-blue-500 rounded-full" />
          </div>
          <div className="space-y-2">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              AI Response Time
            </p>
            <p className="text-2xl font-black text-slate-900">&lt; 2.5s</p>
            <div className="h-1 w-full bg-purple-500 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
