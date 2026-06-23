"use client";

import { useEffect, useState } from "react";

export default function AdminEnginePage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/engine/metrics")
      .then(res => res.json())
      .then(json => setData(json))
      .catch(console.error);
  }, []);

  if (!data) return <div>Loading Engine Metrics...</div>;

  return (
    <div className="space-y-12">
      <section>
        <h2 className="font-serif text-lg tracking-wide border-b border-[#1F2937] pb-3 mb-6 text-[#E5E7EB]">
          VUE SYNTHÉTIQUE
        </h2>
        
        <div className="bg-[#10151C] p-8 border border-[#1F2937]">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-y-8 gap-x-12 font-mono text-sm">
            <div>
              <p className="text-[#9CA3AF] mb-2 uppercase tracking-widest text-xs">Interviews (24h)</p>
              <p className="text-2xl text-[#E5E7EB]">{data.global?.count || 0}</p>
            </div>
            <div>
              <p className="text-[#9CA3AF] mb-2 uppercase tracking-widest text-xs">Score Moyen</p>
              <p className="text-2xl text-[#E5E7EB]">{data.global?.meanScore?.toFixed(2) || "N/A"}</p>
            </div>
            <div>
              <p className="text-[#9CA3AF] mb-2 uppercase tracking-widest text-xs">Integrity Moyen</p>
              <p className="text-2xl text-[#E5E7EB]">{data.global?.meanIntegrity?.toFixed(2) || "N/A"}</p>
            </div>
            <div>
              <p className="text-[#9CA3AF] mb-2 uppercase tracking-widest text-xs">Pression Max Moyenne</p>
              <p className="text-2xl text-[#E5E7EB]">3.1 <span className="text-[#4B5563] text-sm">/ 4.0</span></p>
            </div>
            <div>
              <p className="text-[#9CA3AF] mb-2 uppercase tracking-widest text-xs">Timeout Rate</p>
              <p className="text-2xl text-[#E5E7EB]">{data.global?.timeoutRate ? (data.global.timeoutRate * 100).toFixed(1) + "%" : "0%"}</p>
            </div>
            <div>
              <p className="text-[#9CA3AF] mb-2 uppercase tracking-widest text-xs">Error Rate</p>
              <p className="text-2xl text-[#E5E7EB]">{data.global?.errorRate ? (data.global.errorRate * 100).toFixed(1) + "%" : "0%"}</p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="font-serif text-lg tracking-wide border-b border-[#1F2937] pb-3 mb-6 text-[#E5E7EB]">
          DISTRIBUTION PAR NIVEAU
        </h2>
        
        <div className="bg-[#10151C] border border-[#1F2937] overflow-x-auto">
          <table className="w-full text-left border-collapse font-mono text-sm">
            <thead>
              <tr className="border-b border-[#1F2937] text-[#9CA3AF] uppercase tracking-widest text-xs bg-[#0B0F14]">
                <th className="py-4 px-6 font-normal">Candidate Level</th>
                <th className="py-4 px-6 font-normal">Mean Score</th>
                <th className="py-4 px-6 font-normal">Mean Integrity</th>
                <th className="py-4 px-6 font-normal">High Pressure %</th>
              </tr>
            </thead>
            <tbody className="text-[#E5E7EB]">
              <tr className="border-b border-[#1F2937] hover:bg-[#1A222C] transition-none">
                <td className="py-4 px-6">Executive</td>
                <td className="py-4 px-6">7.10</td>
                <td className="py-4 px-6">0.25</td>
                <td className="py-4 px-6">45%</td>
              </tr>
              <tr className="border-b border-[#1F2937] hover:bg-[#1A222C] transition-none">
                <td className="py-4 px-6">Senior</td>
                <td className="py-4 px-6">6.40</td>
                <td className="py-4 px-6">0.40</td>
                <td className="py-4 px-6">20%</td>
              </tr>
              <tr className="hover:bg-[#1A222C] transition-none">
                <td className="py-4 px-6">Mid-Level</td>
                <td className="py-4 px-6">5.90</td>
                <td className="py-4 px-6">0.55</td>
                <td className="py-4 px-6">5%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
