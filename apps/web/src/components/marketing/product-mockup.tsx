import React from "react"

export default function ProductMockup() {
  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-tr from-bronze-600/10 to-ink-600/10 rounded-3xl blur-3xl -z-10" />

      {/* Browser Window Mockup */}
      <div className="border border-ivoire-200/80 rounded-3xl bg-white/90 backdrop-blur-sm shadow-premium-lg shadow-ivoire-200/80 overflow-hidden relative">
        {/* Browser top bar */}
        <div className="h-12 border-b border-ivoire-100 flex items-center justify-between gap-3 px-6 bg-ivoire-50/50">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-brick-400"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-terracotta-400"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-forest-400"></span>
          </div>
          <div className="flex-1 max-w-xs h-7 rounded-full bg-white border border-ivoire-100 text-ink-400 flex items-center px-4 text-xs font-semibold">
            app.aicareercopilot.com/analyse-ats
          </div>
          <div className="w-16"></div>
        </div>

        {/* Dashboard Content */}
        <div className="p-5 md:p-6 grid gap-4 bg-ivoire-50/30">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Score Card */}
            <div className="border border-ivoire-100 bg-white rounded-2xl p-5 shadow-premium flex gap-4 items-center">
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center relative flex-shrink-0"
                style={{
                  background: "conic-gradient(#2F6844 0 84%, #E7E2DB 84% 100%)",
                }}
              >
                <div className="absolute inset-2.5 rounded-full bg-white flex items-center justify-center shadow-inner">
                  <strong className="text-2xl font-serif font-black text-ink-800">
                    84%
                  </strong>
                </div>
              </div>
              <div>
                <span className="text-[10px] font-bold text-ink-400 tracking-wider uppercase">
                  Score ATS
                </span>
                <h3 className="font-serif font-extrabold text-ink-800 text-sm leading-snug mt-1">
                  Compatible avec l'offre Product Manager
                </h3>
                <div className="mt-3 space-y-1.5">
                  <div className="grid grid-cols-[60px_1fr_15px] items-center gap-2 text-[10px] font-bold text-ink-500">
                    <span>Mots-clés</span>
                    <div className="h-1.5 rounded-full bg-ivoire-100 overflow-hidden">
                      <span
                        className="block h-full bg-gradient-to-r from-bronze-500 to-bronze-600"
                        style={{ width: "88%" }}
                      ></span>
                    </div>
                    <span className="text-right">88</span>
                  </div>
                  <div className="grid grid-cols-[60px_1fr_15px] items-center gap-2 text-[10px] font-bold text-ink-500">
                    <span>Structure</span>
                    <div className="h-1.5 rounded-full bg-ivoire-100 overflow-hidden">
                      <span
                        className="block h-full bg-gradient-to-r from-bronze-500 to-bronze-600"
                        style={{ width: "79%" }}
                      ></span>
                    </div>
                    <span className="text-right">79</span>
                  </div>
                  <div className="grid grid-cols-[60px_1fr_15px] items-center gap-2 text-[10px] font-bold text-ink-500">
                    <span>Impact</span>
                    <div className="h-1.5 rounded-full bg-ivoire-100 overflow-hidden">
                      <span
                        className="block h-full bg-gradient-to-r from-bronze-500 to-bronze-600"
                        style={{ width: "92%" }}
                      ></span>
                    </div>
                    <span className="text-right">92</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Audit Panel Card */}
            <div className="border border-ivoire-100 bg-white rounded-2xl p-5 shadow-premium flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-ink-400 tracking-wider uppercase">
                  Audit sémantique
                </span>
                <div className="flex flex-wrap gap-1 mt-2.5">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-forest-50 text-forest-700 border border-forest-100">
                    roadmap produit
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-forest-50 text-forest-700 border border-forest-100">
                    A/B testing
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-brick-50 text-brick-700 border border-brick-100">
                    stakeholder
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-brick-50 text-brick-700 border border-brick-100">
                    SQL
                  </span>
                </div>
              </div>
              <div className="mt-3 p-3 rounded-xl bg-gradient-to-br from-bronze-500/5 to-ink-500/5 border border-bronze-100/50 text-[11px] leading-relaxed text-ink-600">
                <strong className="text-bronze-700 font-bold block mb-0.5">
                  Suggestion XYZ :
                </strong>
                “Augmenté l'activation de 23% en 6 mois en priorisant 4
                expérimentations data-driven.”
              </div>
            </div>
          </div>

          {/* Chat Card */}
          <div className="border border-ivoire-100 bg-white rounded-2xl p-5 shadow-premium space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-ink-900 text-ivoire-50 flex items-center justify-center font-bold text-xs shadow-premium">
                  IA
                </div>
                <div>
                  <strong className="text-ink-800 text-xs font-bold block">
                    Recruteur Big Tech
                  </strong>
                  <span className="text-[9px] font-bold text-ink-400 uppercase tracking-wider">
                    Mock Interview Lab
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-extrabold text-bronze-800 bg-bronze-50 border border-bronze-100 px-2.5 py-0.5 rounded-full">
                Élite
              </span>
            </div>
            <div className="bg-ivoire-100 text-ink-600 text-xs p-3 rounded-2xl rounded-tl-sm leading-relaxed max-w-[85%]">
              Explique-moi une décision produit difficile et les métriques
              utilisées pour arbitrer.
            </div>
            <div className="bg-gradient-to-r from-bronze-600 to-ink-700 text-ivoire-50 text-xs p-3 rounded-2xl rounded-tr-sm leading-relaxed max-w-[85%] ml-auto">
              J'ai comparé l'impact business, l'effort ingénierie et le risque
              utilisateur avant d'arbitrer...
            </div>
          </div>
        </div>
      </div>

      {/* Floating metric indicator */}
      <div className="absolute -right-6 -bottom-6 hidden md:block bg-white/90 backdrop-blur-md border border-ivoire-200/80 rounded-2xl p-4 shadow-premium-lg max-w-[210px]">
        <strong className="text-lg font-serif font-black text-ink-800 block">
          +3 entretiens
        </strong>
        <p className="text-ink-500 text-xs leading-normal mt-1">
          obtenus en moyenne après optimisation ciblée du CV.
        </p>
      </div>
    </div>
  )
}
