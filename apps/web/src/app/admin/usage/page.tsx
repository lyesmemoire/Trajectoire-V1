"use client";

export default function AdminUsagePage() {
  return (
    <div className="space-y-12">
      <section>
        <h2 className="font-serif text-lg tracking-wide border-b border-[#1F2937] pb-3 mb-6 text-[#E5E7EB]">
          BUDGET & CONSOMMATION
        </h2>
        
        <div className="bg-[#10151C] p-8 border border-[#1F2937]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-8 gap-x-12 font-mono text-sm">
            <div>
              <p className="text-[#9CA3AF] mb-2 uppercase tracking-widest text-xs">LLM tokens (mois)</p>
              <p className="text-2xl text-[#E5E7EB]">48%</p>
            </div>
            <div>
              <p className="text-[#9CA3AF] mb-2 uppercase tracking-widest text-xs">STT minutes</p>
              <p className="text-2xl text-[#E5E7EB]">42%</p>
            </div>
            <div>
              <p className="text-[#9CA3AF] mb-2 uppercase tracking-widest text-xs">Budget Estimé</p>
              <p className="text-2xl text-[#E5E7EB]">312 €</p>
            </div>
            <div>
              <p className="text-[#9CA3AF] mb-2 uppercase tracking-widest text-xs">Projection Fin Mois</p>
              <p className="text-2xl text-[#E5E7EB]">620 €</p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="font-serif text-lg tracking-wide border-b border-[#1F2937] pb-3 mb-6 text-[#E5E7EB]">
          SEUILS D'ALERTE
        </h2>
        
        <div className="bg-[#10151C] border border-[#1F2937] p-8 font-mono text-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <label className="block text-[#9CA3AF] mb-2 uppercase tracking-widest text-xs">Plafond LLM ($)</label>
              <input type="number" defaultValue={500} className="w-full bg-[#0B0F14] border border-[#1F2937] text-[#E5E7EB] px-4 py-3 focus:outline-none focus:border-[#4F46E5] transition-none" />
            </div>
            <div>
              <label className="block text-[#9CA3AF] mb-2 uppercase tracking-widest text-xs">Plafond STT (mins)</label>
              <input type="number" defaultValue={2000} className="w-full bg-[#0B0F14] border border-[#1F2937] text-[#E5E7EB] px-4 py-3 focus:outline-none focus:border-[#4F46E5] transition-none" />
            </div>
            <div>
              <label className="block text-[#9CA3AF] mb-2 uppercase tracking-widest text-xs">Seuil Alerte (%)</label>
              <input type="number" defaultValue={80} className="w-full bg-[#0B0F14] border border-[#1F2937] text-[#E5E7EB] px-4 py-3 focus:outline-none focus:border-[#4F46E5] transition-none" />
            </div>
          </div>
          <div className="mt-8">
            <button className="bg-[#E5E7EB] text-[#0B0F14] px-8 py-3 uppercase tracking-widest text-xs hover:bg-white transition-none font-bold">
              ENREGISTRER LES SEUILS
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
