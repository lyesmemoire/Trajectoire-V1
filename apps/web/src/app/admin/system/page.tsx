"use client";

import { useState } from "react";

export default function AdminSystemPage() {
  const [loading, setLoading] = useState(false);
  const [log, setLog] = useState<string[]>([]);

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
    <div className="space-y-12">
      <section>
        <h2 className="font-serif text-lg tracking-wide border-b border-[#1F2937] pb-3 mb-6 text-[#E5E7EB]">
          STATUT DU MOTEUR
        </h2>
        
        <div className="bg-[#10151C] p-8 border border-[#1F2937]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-8 gap-x-12 font-mono text-sm mb-12">
            <div>
              <p className="text-[#9CA3AF] mb-2 uppercase tracking-widest text-xs">Engine Version</p>
              <p className="text-lg text-[#E5E7EB]">v3_stable_realistic</p>
            </div>
            <div>
              <p className="text-[#9CA3AF] mb-2 uppercase tracking-widest text-xs">Engine Status</p>
              <p className="text-lg text-green-500">ENABLED</p>
            </div>
            <div>
              <p className="text-[#9CA3AF] mb-2 uppercase tracking-widest text-xs">Kill Switch</p>
              <p className="text-lg text-[#E5E7EB]">OFF</p>
            </div>
            <div>
              <p className="text-[#9CA3AF] mb-2 uppercase tracking-widest text-xs">Maintenance Mode</p>
              <p className="text-lg text-[#E5E7EB]">OFF</p>
            </div>
          </div>

          <div className="border-t border-[#1F2937] pt-8 flex gap-4">
            <button 
              disabled={loading} 
              onClick={() => {
                if (window.confirm("Êtes-vous sûr de vouloir couper le moteur ?")) {
                  executeAction("ENGINE_DISABLE");
                }
              }} 
              className="bg-red-900/20 text-red-500 border border-red-900/50 px-6 py-3 uppercase tracking-widest text-xs hover:bg-red-900/40 transition-none font-bold"
            >
              TRIGGER KILL SWITCH
            </button>
            <button 
              disabled={loading} 
              onClick={() => executeAction("UPDATE_THRESHOLD", { key: "maintenance_mode", value: true })} 
              className="bg-yellow-900/10 text-yellow-500 border border-yellow-900/30 px-6 py-3 uppercase tracking-widest text-xs hover:bg-yellow-900/20 transition-none font-bold"
            >
              ACTIVATE MAINTENANCE
            </button>
          </div>
        </div>
      </section>

      <section>
        <h2 className="font-serif text-lg tracking-wide border-b border-[#1F2937] pb-3 mb-6 text-[#E5E7EB]">
          RECENT ADMIN ACTIONS
        </h2>
        <div className="bg-[#0B0F14] border border-[#1F2937] overflow-x-auto">
          <table className="w-full text-left border-collapse font-mono text-sm">
            <thead>
              <tr className="border-b border-[#1F2937] text-[#9CA3AF] uppercase tracking-widest text-xs bg-[#10151C]">
                <th className="py-4 px-6 font-normal">Date</th>
                <th className="py-4 px-6 font-normal">Admin</th>
                <th className="py-4 px-6 font-normal">Action</th>
                <th className="py-4 px-6 font-normal">Payload</th>
              </tr>
            </thead>
            <tbody className="text-[#9CA3AF]">
              {log.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-[#4B5563] italic">Aucune action récente.</td>
                </tr>
              ) : (
                log.map((l, i) => (
                  <tr key={i} className="border-b border-[#1F2937]">
                    <td colSpan={4} className="py-4 px-6">{l}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
