"use client";

import { useState } from "react";

export default function AdminConfigPage() {
  const [loading, setLoading] = useState(false);
  const [log, setLog] = useState<string[]>([]);
  const [budget, setBudget] = useState("50");

  const executeAction = async (action: string, payload: any = {}) => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, payload })
      });
      const data = await res.json();
      setLog(prev => [`[${new Date().toLocaleTimeString()}] ${action}: ${JSON.stringify(data)}`, ...prev]);
    } catch (err: any) {
      setLog(prev => [`[${new Date().toLocaleTimeString()}] ERROR: ${err.message}`, ...prev]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-xl border-b border-[#1F2937] pb-2">/CONFIG/PARAMETERS</h2>
      
      <div className="bg-[#111827] p-6 border border-[#1F2937] space-y-6">
        <div>
          <h3 className="mb-2 text-[#E5E7EB]">Budget Plafond (Interviews / Jour)</h3>
          <p className="text-[#9CA3AF] text-xs mb-4">Définit le plafond quotidien global de sessions d'entretiens autorisées (Soft Launch Limit).</p>
          <div className="flex space-x-4">
            <input 
              type="number" 
              value={budget} 
              onChange={e => setBudget(e.target.value)}
              className="bg-black border border-[#374151] px-4 py-2 text-[#E5E7EB] w-32" 
            />
            <button disabled={loading} onClick={() => executeAction("SET_BUDGET_LIMIT", { daily_limit: Number(budget) })} className="bg-[#1F2937] text-[#E5E7EB] px-4 py-2 hover:bg-[#374151]">UPDATE BUDGET</button>
          </div>
        </div>

        <div className="border-t border-[#1F2937] pt-6">
          <h3 className="mb-2 text-[#E5E7EB]">Engine Thresholds</h3>
          <p className="text-[#9CA3AF] text-xs mb-4">Modifie les paramètres comportementaux du moteur V3.</p>
          <div className="space-x-4">
            <button disabled={loading} onClick={() => executeAction("UPDATE_THRESHOLD", { key: "integrity_weight", value: 0.30 })} className="bg-[#1F2937] text-[#E5E7EB] px-4 py-2 hover:bg-[#374151]">SET INTEGRITY WEIGHT: 0.30</button>
            <button disabled={loading} onClick={() => executeAction("UPDATE_THRESHOLD", { key: "pressure_escalation", value: "high" })} className="bg-[#1F2937] text-[#E5E7EB] px-4 py-2 hover:bg-[#374151]">ESCALATION: HIGH</button>
          </div>
        </div>
      </div>

      <div className="bg-black p-4 border border-[#1F2937] font-mono text-xs text-[#9CA3AF] h-48 overflow-y-auto">
        {log.length === 0 ? "System log idle..." : log.map((l, i) => <div key={i}>{l}</div>)}
      </div>
    </div>
  );
}
