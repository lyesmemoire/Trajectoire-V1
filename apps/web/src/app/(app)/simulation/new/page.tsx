import {
  headers,
} from "next/headers";

import {
  redirect,
} from "next/navigation";

import {
  AppTopbar,
} from "@/components/app/AppTopbar";

export default async function SimulationNewPage() {
  const requestHeaders =
    await headers();

  const userId =
    requestHeaders.get(
      "x-user-id",
    );

  if (!userId) {
    redirect(
      "/login?redirect=/simulation/new&reason=Authentication+required",
    );
  }

  return (
    <div className="space-y-6">
      <AppTopbar
        title="Nouvelle simulation"
        subtitle="Configurez un entretien adapté au poste que vous ciblez."
      />

      <section className="rounded-3xl border border-ivoire-200 bg-white/85 p-6 shadow-premium backdrop-blur">
        <form
          action="/api/simulation/create"
          method="POST"
          className="space-y-6"
        >
          <div>
            <label
              htmlFor="jobTitle"
              className="block text-sm font-semibold text-ink-900"
            >
              Poste ciblé
            </label>

            <p className="mt-1 text-sm text-ink-600">
              Indiquez le poste pour lequel vous souhaitez vous préparer.
            </p>

            <input
              id="jobTitle"
              name="jobTitle"
              required
              maxLength={160}
              placeholder="Ex. Développeur Full Stack"
              className="mt-3 w-full rounded-2xl border border-ivoire-200 bg-white px-4 py-3 text-sm text-ink-900 outline-none focus-visible:ring-2 focus-visible:ring-bronze-400"
            />
          </div>

          <div>
            <label
              htmlFor="jobDescription"
              className="block text-sm font-semibold text-ink-900"
            >
              Offre d'emploi
            </label>

            <p className="mt-1 text-sm text-ink-600">
              Collez l'annonce pour contextualiser les futures questions et relances.
            </p>

            <textarea
              id="jobDescription"
              name="jobDescription"
              rows={8}
              maxLength={20_000}
              placeholder="Collez ici la description du poste, les missions et les compétences recherchées..."
              className="mt-3 w-full resize-y rounded-2xl border border-ivoire-200 bg-white px-4 py-3 text-sm text-ink-900 outline-none focus-visible:ring-2 focus-visible:ring-bronze-400"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="level"
                className="block text-sm font-semibold text-ink-900"
              >
                Niveau
              </label>

              <select
                id="level"
                name="level"
                required
                defaultValue="Confirmé"
                className="mt-3 w-full rounded-2xl border border-ivoire-200 bg-white px-4 py-3 text-sm text-ink-900 outline-none focus-visible:ring-2 focus-visible:ring-bronze-400"
              >
                <option value="Junior">
                  Junior
                </option>
                <option value="Confirmé">
                  Confirmé
                </option>
                <option value="Senior">
                  Senior
                </option>
              </select>
            </div>

            <div>
              <label
                htmlFor="interviewType"
                className="block text-sm font-semibold text-ink-900"
              >
                Type d'entretien
              </label>

              <select
                id="interviewType"
                name="interviewType"
                required
                defaultValue="RH"
                className="mt-3 w-full rounded-2xl border border-ivoire-200 bg-white px-4 py-3 text-sm text-ink-900 outline-none focus-visible:ring-2 focus-visible:ring-bronze-400"
              >
                <option value="RH">
                  RH
                </option>
                <option value="Technique">
                  Technique
                </option>
                <option value="Manager">
                  Manager
                </option>
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="duration"
              className="block text-sm font-semibold text-ink-900"
            >
              Durée
            </label>

            <select
              id="duration"
              name="duration"
              required
              defaultValue="15"
              className="mt-3 w-full rounded-2xl border border-ivoire-200 bg-white px-4 py-3 text-sm text-ink-900 outline-none focus-visible:ring-2 focus-visible:ring-bronze-400"
            >
              <option value="12">
                12 minutes
              </option>
              <option value="15">
                15 minutes
              </option>
              <option value="20">
                20 minutes
              </option>
              <option value="30">
                30 minutes
              </option>
            </select>
          </div>

          <div className="rounded-2xl border border-bronze-200 bg-bronze-50/50 p-4">
            <p className="text-sm font-medium text-ink-900">
              Simulation contextualisée
            </p>

            <p className="mt-1 text-sm text-ink-600">
              L'offre sera associée à cette session. Le branchement automatique CV + Matching sera ajouté après validation de ce flux de base.
            </p>
          </div>

          <button
            type="submit"
            className="inline-flex w-full items-center justify-center rounded-2xl bg-ink-900 px-5 py-3.5 text-sm font-semibold text-white shadow-premium-lg ring-1 ring-bronze-400/35 transition hover:-translate-y-[1px] hover:ring-bronze-400/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bronze-400"
          >
            Démarrer la simulation
          </button>
        </form>
      </section>
    </div>
  );
}