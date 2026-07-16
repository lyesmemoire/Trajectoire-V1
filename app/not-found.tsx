import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Abstract Background Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-blue-500/10 to-violet-500/10 rounded-full blur-3xl -z-10" />

      <div className="text-center space-y-8 p-6 relative z-10">
        <div className="text-9xl font-black text-slate-200 tracking-tighter mix-blend-multiply">
          404
        </div>
        <div className="space-y-4">
          <h1 className="text-4xl font-black tracking-tight text-slate-900">
            Oops, cette page n'existe pas.
          </h1>
          <p className="text-xl text-slate-600 max-w-md mx-auto">
            Il semble que le recruteur ait retiré cette offre... ou que vous
            vous soyez perdu.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
          <Link
            href="/"
            className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:scale-105 transition-transform shadow-lg shadow-blue-500/25"
          >
            Retour à l'accueil
          </Link>
          <Link
            href="/dashboard"
            className="w-full sm:w-auto px-8 py-3 bg-white text-slate-700 font-bold rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            Aller au Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
