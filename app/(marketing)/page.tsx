import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-base text-primary font-sans antialiased flex flex-col selection:bg-neutral-800 selection:text-white">
      {/* HEADER MINIMAL */}
      <header className="w-full px-8 py-10 flex justify-between items-center">
        <div className="flex flex-col">
          <div className="font-serif text-xl font-semibold tracking-[0.08em] uppercase text-primary">
            TRAJECTOIRE
          </div>
          <div className="text-[10px] uppercase tracking-widest text-secondary font-mono mt-1">
            Executive Assessment System
          </div>
        </div>
        <Link
          href="/login"
          className="text-sm font-medium text-secondary hover:text-primary transition-colors duration-150"
        >
          Connexion
        </Link>
      </header>

      {/* HERO SECTION */}
      <section className="flex-1 flex flex-col justify-center px-8 py-20 max-w-4xl mx-auto w-full">
        <div className="space-y-10">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-semibold tracking-wide leading-tight text-primary">
            Évaluez votre niveau réel <br className="hidden md:block" />
            avant l’entretien.
          </h1>
          <p className="text-secondary text-lg md:text-xl max-w-2xl leading-relaxed font-normal">
            Une simulation structurée pour comprendre vos forces et vos écarts.
          </p>

          <div className="pt-6">
            <Link
              href="/interview"
              className="inline-block px-8 py-4 bg-primary text-base text-sm font-medium hover:bg-gray-200 transition-colors duration-150"
            >
              Commencer l’évaluation
            </Link>
          </div>
        </div>

        {/* DIFFERENTIATION SECTION */}
        <div className="mt-32 space-y-12 max-w-2xl">
          <div className="flex flex-col gap-10">
            {/* Item 1 */}
            <div className="pl-6 border-l border-white/10 space-y-2">
              <h3 className="text-primary font-medium text-lg">Évaluation contextualisée</h3>
              <p className="text-secondary leading-relaxed font-light">
                Basée sur votre CV et une offre réelle.
              </p>
            </div>
            
            {/* Item 2 */}
            <div className="pl-6 border-l border-white/10 space-y-2">
              <h3 className="text-primary font-medium text-lg">Détection d’incohérence</h3>
              <p className="text-secondary leading-relaxed font-light">
                Analyse croisée entre revendications écrites et articulation orale.
              </p>
            </div>

            {/* Item 3 */}
            <div className="pl-6 border-l border-white/10 space-y-2">
              <h3 className="text-primary font-medium text-lg">Simulation de comité exécutif</h3>
              <p className="text-secondary leading-relaxed font-light">
                Escalade progressive, quantification forcée, contradiction ciblée.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER MINIMAL */}
      <footer className="w-full px-8 py-10 border-t border-white/5 text-secondary text-xs font-mono uppercase tracking-widest flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <span className="font-serif font-semibold tracking-[0.08em] text-primary">TRAJECTOIRE</span>
          <span className="ml-3 text-[10px]">© {new Date().getFullYear()}</span>
        </div>
        <div className="flex gap-8 items-center text-[10px]">
          <Link href="/manifeste" className="hover:text-primary transition-colors">Manifeste</Link>
          <span>Strictement Confidentiel</span>
        </div>
      </footer>
    </main>
  );
}
