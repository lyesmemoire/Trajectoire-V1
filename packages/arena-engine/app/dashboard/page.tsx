import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Sparkles, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase-server";

/**
 * Dashboard "Action Unique" - Structure Stricte:
 * Bloc 1: Headline Progression
 * Bloc 2: Point de Focus
 * Bloc 3: Bouton Unique d'entraînement
 */
export default async function SimplifiedDashboard() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/auth/login?redirect=/dashboard");
  }

  const profile = await prisma.careerProfile.findUnique({
    where: { userId: user.id },
  });

  if (!profile) return redirect("/onboarding");

  return (
    <div className="max-w-3xl mx-auto space-y-20 pb-20 font-sans antialiased">
      {/* 1. PROGRESSION */}
      <section className="text-center py-10 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">
          <TrendingUp className="w-3 h-3" /> Vos efforts portent leurs fruits
        </div>
        <h1 className="text-5xl lg:text-7xl font-semibold tracking-[-0.03em] text-[var(--text-primary)] tracking-tighter leading-none">
          Vous progressez.
        </h1>
      </section>

      {/* 2. POINT DE FOCUS */}
      <section className="p-12 rounded-[3rem] border-2 border-blue-100 bg-blue-50/50 flex flex-col md:flex-row gap-10 items-center">
        <div className="w-20 h-20 rounded-[2rem] bg-white shadow-xl flex items-center justify-center text-4xl">
          💡
        </div>
        <div className="flex-1 text-center md:text-left space-y-2">
          <h3 className="text-xl font-semibold text-[var(--text-primary)] tracking-tight">
            Point à travailler
          </h3>
          <p className="text-[17px] text-[var(--text-secondary)] leading-relaxed">
            "Travaillez votre concision. Vos meilleures idées sont diluées par
            des détails secondaires."
          </p>
        </div>
      </section>

      {/* 3. BOUTON UNIQUE */}
      <section className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[var(--radius-card)] p-12 lg:p-16 text-[var(--text-primary)] shadow-[var(--shadow-card)] relative overflow-hidden">
        <div className="absolute top-0 right-0 p-16 opacity-5 pointer-events-none">
          <Sparkles className="w-64 h-64" />
        </div>
        <div className="relative z-10 text-center space-y-8">
          <h2 className="text-3xl font-black italic">
            "Prêt pour une nouvelle session ?"
          </h2>
          <div className="flex justify-center">
            <Button
              asChild
              size="lg"
              className="h-20 px-16 rounded-[2rem] bg-[var(--primary)] text-white hover:bg-[#5C6BE8] font-black text-2xl shadow-2xl transition-transform active:scale-95"
            >
              <Link href="/dashboard/interview/session">
                Commencer l’entraînement
              </Link>
            </Button>
          </div>
          <p className="text-sm text-[var(--text-secondary)]">
            Environ 6 minutes
          </p>
        </div>
      </section>

      <div className="flex justify-center gap-12 pt-8 opacity-40 hover:opacity-100 transition-opacity">
        <Link
          href="/dashboard/career-dna"
          className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] hover:text-blue-600"
        >
          Profil
        </Link>
        <Link
          href="/dashboard/ats"
          className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] hover:text-blue-600"
        >
          Audit CV
        </Link>
      </div>
    </div>
  );
}

export const dynamic = "force-dynamic";
