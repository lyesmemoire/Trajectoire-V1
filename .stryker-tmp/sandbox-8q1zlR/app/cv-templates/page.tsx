// @ts-nocheck
import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Shield } from "lucide-react";
import { Button } from "@/components/design-system";
import { cvTemplates } from "@/lib/seo/data/templates";
import CVPreviewSVG from "@/lib/seo/components/CVPreviewSVG";

export const metadata: Metadata = {
  title: "Templates CV Gratuits Optimisés ATS | AI Career Copilot",
  description:
    "4 templates CV professionnels et optimisés pour les systèmes ATS. Téléchargez, personnalisez et décrochez 3x plus d'entretiens.",
};

const ATS_COLOR: Record<number, string> = {
  99: "text-green-400",
  97: "text-green-400",
  94: "text-yellow-400",
  88: "text-orange-400",
};

export default async function CVTemplatesPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-black to-red-950/10">
      {/* Header */}
      <header className="border-b border-red-900/30 bg-black/80 backdrop-blur">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <Link href="/" className="text-xl font-bold text-white">
            AI Career Copilot
          </Link>
          <Button asChild size="sm" className="bg-red-600 hover:bg-red-700">
            <Link href="/dashboard">Analyser mon CV</Link>
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="mb-6 text-5xl font-black text-white md:text-6xl">
          Templates CV{" "}
          <span className="bg-gradient-to-r from-red-500 to-red-300 bg-clip-text text-transparent">
            optimisés ATS
          </span>
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-xl text-gray-300">
          4 templates professionnels conçus pour passer les filtres automatiques
          et atteindre les recruteurs humains.
        </p>
        <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
          <Shield className="h-4 w-4 text-green-500" />
          <span>
            Tous testés et validés sur Lever, Greenhouse, Workday et SAP
            SuccessFactors
          </span>
        </div>
      </section>

      {/* Grille de templates */}
      <section className="container mx-auto px-4 pb-24">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {cvTemplates.map((template) => {
            const atsColor = ATS_COLOR[template.atsScore] || "text-green-400";
            return (
              <div
                key={template.id}
                className="group relative flex flex-col rounded-2xl border border-red-900/30 bg-black/50 p-6 transition-all hover:border-red-700/50 hover:shadow-2xl hover:shadow-red-900/20"
              >
                {/* Badge Popular */}
                {template.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white">
                      ★ Populaire
                    </span>
                  </div>
                )}

                {/* Preview */}
                <CVPreviewSVG
                  template={template}
                  className="mb-5 w-full rounded-lg border border-red-900/20 bg-black/20"
                />

                {/* Infos */}
                <div className="flex flex-1 flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-white">
                      {template.name}
                    </h2>
                    {template.premium && (
                      <span className="text-xs text-yellow-400">Premium</span>
                    )}
                  </div>

                  <p className="flex-1 text-sm leading-relaxed text-gray-400 line-clamp-2">
                    {template.description}
                  </p>

                  <div className="flex items-center justify-between text-sm">
                    <span className={`font-bold ${atsColor}`}>
                      ATS {template.atsScore}/100
                    </span>
                    <span className="capitalize text-gray-500">
                      {template.style}
                    </span>
                  </div>

                  <Button
                    asChild
                    className="mt-2 w-full bg-red-600 hover:bg-red-700"
                  >
                    <Link href={`/cv-templates/${template.id}`}>
                      Voir le template
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
