import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import {
  LayoutDashboard,
  Upload,
  Target,
  Mic2,
  TrendingUp,
  CreditCard,
  Settings,
  LogOut,
  Sparkles,
} from "lucide-react";

// Utilisation des routes virtualisées pour masquer la structure interne
const navItems = [
  {
    label: "Aperçu",
    href: "/dashboard",
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    label: "Mon CV",
    href: "/dashboard/upload",
    icon: <Upload className="w-5 h-5" />,
  },
  {
    label: "Analyse ATS",
    href: "/app/audit",
    icon: <Target className="w-5 h-5" />,
  },
  {
    label: "Entretien Lab",
    href: "/app/session",
    icon: <Mic2 className="w-5 h-5" />,
  },
  {
    label: "Ma Progression",
    href: "/app/progress",
    icon: <TrendingUp className="w-5 h-5" />,
  },
  {
    label: "Identité DNA",
    href: "/app/identity",
    icon: <Sparkles className="w-5 h-5" />,
  },
  {
    label: "Crédits",
    href: "/dashboard/credits",
    icon: <CreditCard className="w-5 h-5" />,
  },
];

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?redirect=/dashboard");
  }

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 hidden h-full w-72 flex-col border-r border-slate-200 bg-white lg:flex z-50">
        <div className="p-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <Sparkles className="w-6 h-6" />
            </div>
            <span className="font-black text-xl text-slate-900 tracking-tight">
              StudioEntretien
            </span>
          </Link>
        </div>

        <nav className="flex-1 space-y-1 px-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-slate-500 transition-all hover:bg-slate-50 hover:text-blue-600"
            >
              <span className="text-slate-400 group-hover:text-blue-500 transition-colors">
                {item.icon}
              </span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="border-t border-slate-100 p-6 space-y-1">
          <Link
            href="/dashboard/settings"
            className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-slate-500 hover:bg-slate-50 hover:text-blue-600"
          >
            <Settings className="w-5 h-5" />
            Paramètres
          </Link>
          <form action="/auth/signout" method="post">
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Déconnexion
            </button>
          </form>
        </div>
      </aside>

      <main className="flex-1 lg:ml-72">
        <header className="sticky top-0 z-40 flex h-20 items-center justify-between border-b border-slate-200 bg-white/80 px-8 backdrop-blur-md lg:hidden">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="font-black text-slate-900">StudioEntretien</span>
          </Link>
        </header>

        <div className="p-8 lg:p-12 max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
