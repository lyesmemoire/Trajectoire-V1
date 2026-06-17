import Link from "next/link";

export default function ManifestePage() {
  return (
    <main className="min-h-screen bg-[#0B0F14] text-[#E5E7EB] font-sans antialiased flex flex-col selection:bg-neutral-800 selection:text-white">
      {/* HEADER MINIMAL */}
      <header className="w-full px-8 py-10 flex justify-between items-center border-b border-white/5">
        <Link href="/" className="flex flex-col hover:opacity-80 transition-opacity">
          <div className="font-serif text-xl font-semibold tracking-[0.08em] uppercase text-primary">
            TRAJECTOIRE
          </div>
          <div className="text-[10px] uppercase tracking-widest text-secondary font-mono mt-1">
            Executive Assessment System
          </div>
        </Link>
      </header>

      {/* MANIFESTE CONTENT */}
      <section className="flex-1 flex flex-col px-8 py-24 max-w-3xl mx-auto w-full">
        <div className="space-y-16">
          <div className="space-y-6">
            <h1 className="font-serif text-4xl font-semibold tracking-wide text-primary">
              Le Manifeste
            </h1>
            <p className="font-mono text-xs uppercase tracking-widest text-[#9CA3AF]">
              Philosophie d'évaluation exécutive
            </p>
          </div>

          <div className="space-y-4 border-l-2 border-white/10 pl-6">
            <p className="text-xl font-medium text-primary">Trajectoire ne prépare pas.</p>
            <p className="text-xl font-medium text-primary">Trajectoire évalue.</p>
          </div>

          <div className="pt-8">
            <h2 className="text-xs font-bold font-sans text-[#9CA3AF] uppercase tracking-widest mb-10 border-b border-white/5 pb-4">
              Notre Approche
            </h2>

            <div className="space-y-12">
              <div className="space-y-3">
                <h3 className="font-serif text-2xl text-primary">1. Réalisme</h3>
                <p className="text-secondary leading-relaxed font-light">
                  Nous simulons un entretien tel qu'il se déroule réellement au niveau exécutif. Pas de complaisance, pas de scénarios artificiels.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-serif text-2xl text-primary">2. Cohérence</h3>
                <p className="text-secondary leading-relaxed font-light">
                  Les revendications écrites de votre CV sont systématiquement confrontées à votre profondeur d'articulation orale.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-serif text-2xl text-primary">3. Intégrité</h3>
                <p className="text-secondary leading-relaxed font-light">
                  L'incohérence narrative est pénalisée plus sévèrement que la lacune technique. La survente déclenche automatiquement un niveau de scrutinité maximal.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-serif text-2xl text-primary">4. Exigence</h3>
                <p className="text-secondary leading-relaxed font-light">
                  L'escalade de la pression est progressive, adaptative et contextuelle, jamais arbitraire.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-serif text-2xl text-primary">5. Neutralité</h3>
                <p className="text-secondary leading-relaxed font-light">
                  Aucun encouragement artificiel. Aucun jugement moral. Une objectivité absolue, traduite par des données froides.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER MINIMAL */}
      <footer className="w-full px-8 py-10 border-t border-white/5 text-[#9CA3AF] text-xs font-mono uppercase tracking-widest flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <span className="font-serif font-semibold tracking-[0.08em] text-primary">TRAJECTOIRE</span>
          <span className="ml-3 text-[10px]">© {new Date().getFullYear()}</span>
        </div>
        <div className="text-[10px]">Strictement Confidentiel</div>
      </footer>
    </main>
  );
}
