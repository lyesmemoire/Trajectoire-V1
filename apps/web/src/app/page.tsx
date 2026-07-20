import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getAuthenticatedUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Trajectoire – Préparez vos entretiens avec une IA personnalisée",
  description: "Uploadez votre CV. Simulez vos entretiens. Recevez un feedback structuré.",
};

export default async function HomePage() {
  const user = await getAuthenticatedUser();
  const ctaHref = user ? "/dashboard" : "/signup";
  const ctaText = user ? "Accéder au Dashboard" : "Commencer gratuitement";

  return (
    <div className="min-h-screen bg-white">
      {/* HERO SECTION */}
      <section className="bg-white py-20 lg:py-24">
        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">

          {/* Colonne gauche — Texte */}
          <div className="text-center lg:text-left">

            <p className="text-xs tracking-[0.25em] uppercase text-slate-400 mb-10">
              Plateforme d'entraînement stratégique
            </p>

            <h1 className="
              text-4xl
              md:text-5xl
              lg:text-6xl
              font-semibold
              tracking-tight
              text-slate-900
              leading-[1.1]
            ">
              Préparez vos entretiens
              <br />
              comme un stratège.
            </h1>

            <p className="
              mt-8
              text-lg
              text-slate-600
              max-w-xl
              mx-auto
              lg:mx-0
              leading-relaxed
            ">
              Analyse de votre profil, simulations réalistes,
              feedback structuré pour performer dans les environnements exigeants.
            </p>

            <div className="mt-12 flex flex-col sm:flex-row justify-center lg:justify-start gap-6">
              <Link href={ctaHref}>
                <button className="
                  bg-slate-900
                  text-white
                  px-10
                  py-4
                  rounded-xl
                  font-medium
                  hover:bg-slate-800
                  transition
                  focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2
                ">
                  Accéder à la plateforme
                </button>
              </Link>

              <Link href="/pricing">
                <button className="
                  text-slate-700
                  font-medium
                  hover:text-slate-900
                  transition
                  underline-offset-4
                  hover:underline
                  focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2
                ">
                  Voir les tarifs →
                </button>
              </Link>
            </div>

            <p className="mt-8 text-sm text-slate-400 text-center lg:text-left">
              Aucune carte bancaire requise · Accès immédiat
            </p>

          </div>

          {/* Colonne droite — Image */}
          <div className="relative">
            <div className="
              relative
              rounded-2xl
              overflow-hidden
              aspect-[4/5]
              max-h-[600px]
              shadow-2xl
              ring-1
              ring-slate-200
            ">
              <Image
                src="/images/hero-professional.webp"
                alt="Professionnel en préparation stratégique pour ses entretiens"
                fill
                className="object-cover object-[60%_center]"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>

        </div>
      </section>

      {/* SECTION ÉDITORIALE */}
      <section className="bg-slate-50 py-20 md:py-36">
        <div className="max-w-5xl mx-auto px-5 md:px-6 grid md:grid-cols-2 gap-16 md:gap-24 items-center">

          {/* Colonne gauche — Texte */}
          <div>
            <p className="text-xs tracking-[0.2em] uppercase text-slate-400 mb-6">
              Notre approche
            </p>

            <h2 className="
              text-3xl
              md:text-4xl
              font-semibold
              tracking-tight
              text-slate-900
            ">
              Une méthode structurée,
              pas un simple simulateur.
            </h2>

            <p className="mt-6 text-slate-600 leading-relaxed">
              Trajectoire analyse votre profil en profondeur
              pour générer des simulations réellement adaptées
              à votre parcours et vos ambitions.
            </p>
          </div>

          {/* Colonne droite — Steps */}
          <div className="space-y-12">

            <div className="flex gap-8 items-start">
              <span className="text-5xl font-semibold text-slate-200">
                01
              </span>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  Analyse de votre profil
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Lecture complète de votre CV,
                  extraction de votre ADN professionnel.
                </p>
              </div>
            </div>

            <div className="flex gap-8 items-start">
              <span className="text-5xl font-semibold text-slate-200">
                02
              </span>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  Simulation réaliste
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Questions adaptées à votre secteur
                  et au type d'entreprise ciblé.
                </p>
              </div>
            </div>

            <div className="flex gap-8 items-start">
              <span className="text-5xl font-semibold text-slate-200">
                03
              </span>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  Feedback structuré
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Rapport précis sur votre structure,
                  clarté et impact.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* SECTION LÉGITIMITÉ CANDIDAT */}
      <section className="bg-white py-20 md:py-36">
        <div className="max-w-4xl mx-auto px-5 md:px-6 text-center">

          <p className="text-xs tracking-[0.2em] uppercase text-slate-400 mb-6">
            Conçu pour
          </p>

          <h2 className="
            text-3xl
            md:text-4xl
            font-semibold
            tracking-tight
            text-slate-900
          ">
            Les candidats qui refusent
            de laisser leur préparation au hasard.
          </h2>

          <p className="
            mt-8
            text-lg
            text-slate-600
            max-w-2xl
            mx-auto
            leading-relaxed
          ">
            Consulting, finance, technologie, management.
            Trajectoire s'adresse à ceux qui considèrent
            chaque entretien comme un exercice stratégique.
          </p>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-12">

            <div>
              <p className="text-4xl font-semibold text-slate-900">
                +150
              </p>
              <p className="text-slate-500 text-sm mt-2">
                Simulations générées
              </p>
            </div>

            <div>
              <p className="text-4xl font-semibold text-slate-900">
                4.8/5
              </p>
              <p className="text-slate-500 text-sm mt-2">
                Satisfaction beta
              </p>
            </div>

            <div>
              <p className="text-4xl font-semibold text-slate-900">
                3 min
              </p>
              <p className="text-slate-500 text-sm mt-2">
                Pour commencer
              </p>
            </div>

            <div>
              <p className="text-4xl font-semibold text-slate-900">
                100%
              </p>
              <p className="text-slate-500 text-sm mt-2">
                Personnalisé
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* CTA FINAL FORT */}
      <section className="bg-slate-50 py-20 md:py-36">
        <div className="max-w-3xl mx-auto px-5 md:px-6 text-center">

          <h2 className="
            text-3xl
            md:text-4xl
            font-semibold
            tracking-tight
            text-slate-900
          ">
            Votre prochain entretien
            mérite une préparation sérieuse.
          </h2>

          <p className="mt-8 text-lg text-slate-600">
            Rejoignez Trajectoire et transformez
            votre façon de vous préparer.
          </p>

          <div className="mt-12">
            <Link href={ctaHref}>
              <button className="
                bg-slate-900
                text-white
                px-14
                py-4
                rounded-xl
                font-medium
                hover:bg-slate-800
                transition-all
                duration-200
                focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2
              ">
                Commencer gratuitement
              </button>
            </Link>
          </div>

          <p className="mt-6 text-sm text-slate-400">
            Aucune carte bancaire requise.
          </p>

        </div>
      </section>
    </div>
  );
}