// apps/web/src/app/pricing/page.tsx
//
// Page Pricing finale institutionnelle

import Link from "next/link";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="bg-white py-20 md:py-36">
        <div className="max-w-5xl mx-auto px-5 md:px-6 text-center">

          <p className="text-xs tracking-[0.2em] uppercase text-slate-400 mb-6">
            Tarifs
          </p>

          <h1 className="
            text-4xl
            md:text-5xl
            font-semibold
            tracking-tight
            text-slate-900
          ">
            Un investissement structuré.
          </h1>

          <p className="mt-6 text-lg text-slate-600">
            Pour une progression mesurable.
          </p>

          <div className="mt-24 grid md:grid-cols-3 gap-10">

            {/* Starter */}
            <div className="p-12 border border-slate-200 rounded-2xl text-left">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Starter
              </h3>
              <p className="text-sm text-slate-500 mb-8">
                Pour commencer.
              </p>
              <p className="text-4xl font-semibold text-slate-900 mb-2">
                29€
              </p>
              <p className="text-slate-400 text-sm mb-10">
                / mois
              </p>
              <button className="
                w-full
                border
                border-slate-900
                text-slate-900
                py-3
                rounded-xl
                font-medium
                hover:bg-slate-50
                transition
                focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2
              ">
                Choisir Starter
              </button>
            </div>

            {/* Pro — Recommandé */}
            <div className="
              p-12
              border
              border-slate-900
              rounded-2xl
              text-left
              relative
            ">
              <div className="
                absolute
                -top-4
                left-1/2
                -translate-x-1/2
                bg-slate-900
                text-white
                text-xs
                px-4
                py-1
                rounded-full
              ">
                Recommandé
              </div>

              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Pro
              </h3>
              <p className="text-sm text-slate-500 mb-8">
                Pour performer.
              </p>
              <p className="text-5xl font-semibold text-slate-900 mb-2">
                59€
              </p>
              <p className="text-slate-400 text-sm mb-10">
                / mois
              </p>
              <button className="
                w-full
                bg-slate-900
                text-white
                py-3
                rounded-xl
                font-medium
                hover:bg-slate-800
                transition
                focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2
              ">
                Choisir Pro
              </button>
            </div>

            {/* Expert */}
            <div className="p-12 border border-slate-200 rounded-2xl text-left">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Expert
              </h3>
              <p className="text-sm text-slate-500 mb-8">
                Pour dominer.
              </p>
              <p className="text-4xl font-semibold text-slate-900 mb-2">
                99€
              </p>
              <p className="text-slate-400 text-sm mb-10">
                / mois
              </p>
              <button className="
                w-full
                border
                border-slate-900
                text-slate-900
                py-3
                rounded-xl
                font-medium
                hover:bg-slate-50
                transition
                focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2
              ">
                Choisir Expert
              </button>
            </div>

          </div>

        </div>
      </section>
    </div>
  );
}
