import { getAuthenticatedUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { CareerIdentityCard } from "@/components/career-dna/career-identity-card";
import { CareerDNACard } from "@/components/share/career-dna-card";
import { EvolutionCard } from "@/components/share/evolution-card";
import { generateIdentityCardData } from "@/lib/share/identity-card";
import {
  History,
  TrendingUp,
  ChevronRight,
  Share2,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { ARCHETYPES_META } from "@/lib/archetypes/career-archetypes";
import { Button } from "@/components/ui/button";

export default async function CareerDNAPage() {
  const user = await getAuthenticatedUser();
  if (!user) redirect("/auth/login");

  const profile = await prisma.careerProfile.findUnique({
    where: { userId: user.id },
  });

  const dna = profile?.careerDNA as any;

  if (!dna || !dna.currentArchetype) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center space-y-8">
        <div className="w-24 h-24 bg-slate-900 rounded-[2.5rem] flex items-center justify-center text-5xl mx-auto shadow-2xl">
          🧬
        </div>
        <h2 className="text-4xl font-black text-slate-900">
          Définissez votre ADN de Carrière
        </h2>
        <p className="text-xl text-slate-500 font-medium max-w-xl mx-auto">
          Nos algorithmes analysent votre comportement en entretien pour définir
          votre identité professionnelle unique.
        </p>
        <div className="pt-6">
          <Link
            href="/dashboard/interview/session"
            className="px-10 py-5 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 inline-flex items-center gap-3"
          >
            Activer mon profil <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    );
  }

  const shareData = generateIdentityCardData(
    dna.currentArchetype,
    12, // Percentile (mocked for now)
    { interruptionCount: 4, clarityScore: 82, stressScore: 91 },
    dna.previousArchetype,
  );

  const history = dna.archetypeHistory || [];

  return (
    <div className="max-w-7xl mx-auto py-8 px-6 space-y-16">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-blue-100">
            <Sparkles className="w-3 h-3" /> Career Intelligence v2
          </div>
          <h1 className="text-5xl font-black tracking-tight text-slate-900">
            Identity <span className="text-blue-600">DNA</span>
          </h1>
          <p className="text-xl text-slate-500 font-medium">
            Votre empreinte comportementale persistante et son évolution.
          </p>
        </div>
        <Button
          variant="primary"
          size="lg"
          className="h-14 px-8 rounded-2xl shadow-blue-500/20"
        >
          <Share2 className="w-5 h-5 mr-2" /> Partager mon DNA
        </Button>
      </div>

      <div className="grid lg:grid-cols-12 gap-12">
        {/* Dashboard Identity View */}
        <div className="lg:col-span-8 space-y-12">
          <CareerIdentityCard
            current={dna.currentArchetype}
            previous={dna.previousArchetype}
          />

          <div className="bg-white rounded-[3rem] border border-slate-100 p-10 shadow-sm space-y-10">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <History className="w-4 h-4 text-slate-400" /> Historique de
              Mutation
            </h3>
            <div className="space-y-12">
              {history.reverse().map((entry: any, i: number) => (
                <div key={i} className="flex gap-8 relative group">
                  {i !== history.length - 1 && (
                    <div className="absolute left-6 top-14 bottom-0 w-1 bg-slate-50 rounded-full group-hover:bg-blue-50 transition-colors" />
                  )}
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-2xl flex-shrink-0 z-10 border border-slate-100 shadow-sm group-hover:scale-110 transition-transform">
                    {
                      ARCHETYPES_META[
                        entry.type as keyof typeof ARCHETYPES_META
                      ]?.icon
                    }
                  </div>
                  <div className="flex-1 pb-12">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-lg font-black text-slate-900">
                        {
                          ARCHETYPES_META[
                            entry.type as keyof typeof ARCHETYPES_META
                          ]?.label
                        }
                      </h4>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        {new Date(entry.date).toLocaleDateString("fr-FR", {
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 font-medium leading-relaxed">
                      Score de maîtrise atteint :{" "}
                      <span className="font-bold text-slate-900">
                        {entry.scores.technical}%
                      </span>
                      .
                      {i === 0
                        ? "Point de départ de votre transformation."
                        : "Progression détectée sur la clarté."}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Shareable Content View */}
        <div className="lg:col-span-4 space-y-8">
          <div className="sticky top-24 space-y-8">
            <div className="flex flex-col items-center">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">
                Objets Partageables
              </p>
              <div className="space-y-12 w-full flex flex-col items-center">
                <CareerDNACard data={shareData} />
                {dna.previousArchetype &&
                  dna.previousArchetype !== dna.currentArchetype && (
                    <EvolutionCard
                      from={dna.previousArchetype}
                      to={dna.currentArchetype}
                    />
                  )}
              </div>
            </div>

            <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl space-y-6">
              <h4 className="text-xs font-black text-blue-400 uppercase tracking-widest flex items-center gap-2">
                <TrendingUp className="w-4 h-4" /> Insight Croissance
              </h4>
              <p className="text-lg font-bold leading-relaxed italic opacity-90">
                "Votre passage au profil '
                {ARCHETYPES_META[dna.currentArchetype as keyof typeof ARCHETYPES_META]?.label?.split(" ")[0]}'
                indique que vous êtes prêt pour des responsabilités de
                management."
              </p>
              <Button
                variant="ghost"
                className="w-full justify-center text-blue-400 hover:text-white hover:bg-white/5 font-black p-0"
              >
                Voir le plan 30 jours →
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
