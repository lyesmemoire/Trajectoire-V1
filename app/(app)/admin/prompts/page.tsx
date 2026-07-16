import { getAuthenticatedUser } from "@/lib/auth";
import { Button } from "@/components/design-system";
import { Badge } from "@/components/design-system";
import {
  Save,
  Sparkles,
  History,
  ShieldAlert,
  Cpu,
} from "lucide-react";

export default async function PromptsAdminPage() {
  const user = await getAuthenticatedUser();
  // Security check here...

  // Fetch prompts (Mocked or from DB)
  const prompts = [
    {
      id: "1",
      type: "CORE_SYSTEM",
      version: "1.2.0",
      content: "Tu es un expert RH...",
      active: true,
    },
    {
      id: "2",
      type: "VICTOR_STRESS",
      version: "2.1.4",
      content: "Tu es Victor, un Partner froid...",
      active: true,
    },
    {
      id: "3",
      type: "CLARA_SUPPORT",
      version: "1.0.8",
      content: "Tu es Clara, directrice People...",
      active: true,
    },
    {
      id: "4",
      type: "PRESSURE_ENGINE",
      version: "1.5.0",
      content: "Le candidat est vague. Interromps...",
      active: true,
    },
  ];

  return (
    <div className="space-y-10 pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Prompt <span className="text-blue-600">Engine</span>
          </h1>
          <p className="text-slate-500 font-medium mt-1 uppercase tracking-widest text-[10px]">
            Contrôle et versionning des intelligences
          </p>
        </div>
        <Button variant="primary" className="h-14 px-8 rounded-2xl">
          <Sparkles className="w-5 h-5 mr-2" /> Publier une mise à jour
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {prompts.map((p) => (
          <div
            key={p.id}
            className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden"
          >
            <div className="bg-slate-50 px-8 py-6 border-b border-slate-100 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-blue-400">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-black text-slate-900">{p.type}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Version {p.version}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge className="bg-emerald-50 text-emerald-600 border border-emerald-100 px-3 py-1 font-black uppercase text-[10px]">
                  Active
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  className="font-black text-slate-400"
                >
                  <History className="w-4 h-4 mr-2" /> Rollback
                </Button>
              </div>
            </div>
            <div className="p-8 space-y-6">
              <textarea
                defaultValue={p.content}
                className="w-full h-48 bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] p-6 font-mono text-xs text-slate-600 leading-relaxed focus:border-blue-500 outline-none transition-all"
              />
              <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                <div className="flex items-center gap-2 text-amber-500">
                  <ShieldAlert className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase">
                    Changement critique — Impact global
                  </span>
                </div>
                <Button className="h-12 px-8 rounded-xl font-black">
                  <Save className="w-4 h-4 mr-2" /> Sauvegarder V.
                  {parseInt(p.version.split(".")[0] ?? "1") + 1}.0
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
