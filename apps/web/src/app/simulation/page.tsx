import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Nouvelle simulation – Trajectoire",
  description: "Configurez et lancez une simulation d'entretien.",
};

export default async function SimulationPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Vérifier si l'utilisateur a un CareerProfile (CV uploadé)
  const careerProfile = await prisma.careerProfile.findUnique({
    where: { userId: user.id },
    select: { id: true },
  });

  if (!careerProfile) {
    redirect("/dashboard");
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900 mb-4"
        >
          ← Retour au tableau de bord
        </Link>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Nouvelle simulation</h1>
        <p className="text-slate-600">Configurez votre entretien pour commencer.</p>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 p-8">
        <form action="/api/simulation/create" method="POST" className="space-y-6">
          <div>
            <label htmlFor="jobTitle" className="block text-sm font-medium text-slate-700 mb-2">
              Poste recherché *
            </label>
            <input
              type="text"
              id="jobTitle"
              name="jobTitle"
              required
              placeholder="Ex: Développeur Full Stack"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label htmlFor="level" className="block text-sm font-medium text-slate-700 mb-2">
              Niveau *
            </label>
            <select
              id="level"
              name="level"
              required
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value="">Sélectionnez un niveau</option>
              <option value="Junior">Junior</option>
              <option value="Mid">Mid</option>
              <option value="Senior">Senior</option>
            </select>
          </div>

          <div>
            <label htmlFor="interviewType" className="block text-sm font-medium text-slate-700 mb-2">
              Type d&apos;entretien *
            </label>
            <select
              id="interviewType"
              name="interviewType"
              required
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value="">Sélectionnez un type</option>
              <option value="RH">RH</option>
              <option value="Technique">Technique</option>
              <option value="Manager">Manager</option>
            </select>
          </div>

          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-slate-700 mb-2">
              Durée *
            </label>
            <select
              id="duration"
              name="duration"
              required
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value="">Sélectionnez une durée</option>
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="45">45 minutes</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Commencer
          </button>
        </form>
      </div>
    </div>
  );
}
