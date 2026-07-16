import { getAuthenticatedUser } from "@/lib/auth";
import { Button } from "@/components/design-system";
import { Badge } from "@/components/design-system";
import {
  Search,
  Filter,
  AlertTriangle,
  Zap,
} from "lucide-react";

export default async function AdminUsersPage() {
  const user = await getAuthenticatedUser();

  // Mock data for demo
  const users = [
    {
      id: "1",
      name: "Omar D.",
      email: "omar@example.com",
      plan: "PRO",
      archetype: "Strategic Leader",
      activation: 94,
      churnRisk: 0.12,
      streak: 5,
      color: "blue",
    },
    {
      id: "2",
      name: "Julien R.",
      email: "julien@example.com",
      plan: "FREE",
      archetype: "Analytical Operator",
      activation: 42,
      churnRisk: 0.65,
      streak: 0,
      color: "slate",
    },
    {
      id: "3",
      name: "Marie P.",
      email: "marie@example.com",
      plan: "PRO",
      archetype: "Confident Performer",
      activation: 100,
      churnRisk: 0.05,
      streak: 12,
      color: "emerald",
    },
    {
      id: "4",
      name: "Kevin L.",
      email: "kevin@example.com",
      plan: "PRO",
      archetype: "Concise Executor",
      activation: 88,
      churnRisk: 0.24,
      streak: 3,
      color: "purple",
    },
  ];

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            User <span className="text-blue-600">Intelligence</span>
          </h1>
          <p className="text-slate-500 font-medium mt-1 uppercase tracking-widest text-[10px]">
            Segmentations et analyses comportementales
          </p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Chercher un candidat..."
              className="w-full pl-12 pr-4 h-14 rounded-2xl bg-white border border-slate-100 font-bold text-sm shadow-sm outline-none focus:border-blue-500"
            />
          </div>
          <Button
            variant="outline"
            className="h-14 px-6 rounded-2xl font-black"
          >
            <Filter className="w-4 h-4 mr-2" /> Filtres
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Utilisateur
                </th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Abonnement
                </th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Archetype
                </th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Activation
                </th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Churn Risk
                </th>
                <th className="px-8 py-5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {users.map((u) => (
                <tr
                  key={u.id}
                  className="hover:bg-slate-50/30 transition-colors group"
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-xl bg-${u.color}-50 text-${u.color}-600 flex items-center justify-center font-black text-xs`}
                      >
                        {u.name[0]}
                      </div>
                      <div>
                        <p className="font-black text-slate-900">{u.name}</p>
                        <p className="text-xs text-slate-400 font-medium">
                          {u.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <Badge
                      className={
                        u.plan === "PRO"
                          ? "bg-blue-50 text-blue-600"
                          : "bg-slate-50 text-slate-500"
                      }
                    >
                      {u.plan}
                    </Badge>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <Zap className="w-3.5 h-3.5 text-amber-500" />
                      <span className="text-sm font-bold text-slate-700">
                        {u.archetype}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-black text-slate-900">
                        {u.activation}%
                      </span>
                      <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600"
                          style={{ width: `${u.activation}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      {u.churnRisk > 0.5 ? (
                        <div className="flex items-center gap-1.5 text-rose-500">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span className="text-xs font-black uppercase">
                            Élevé
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-emerald-500">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span className="text-xs font-black uppercase">
                            Sain
                          </span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity font-black text-blue-600"
                    >
                      Détails →
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function CheckCircle2(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
