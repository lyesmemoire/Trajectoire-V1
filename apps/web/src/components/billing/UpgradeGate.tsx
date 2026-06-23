// apps/web/src/components/billing/UpgradeGate.tsx
"use client";

import { useRouter }     from "next/navigation";
import { Lock, Sparkles } from "lucide-react";

interface UpgradeGateProps {
  feature?:       string;           // "Simulation vocale", "Analyse ATS premium"
  requiredPlan?:  "PRO" | "EXPERT";
  children:       React.ReactNode;
  isAllowed:      boolean;          // Calculé server-side, passé en prop
  customTitle?:   string;
  customMessage?: string;
  mode?:          "blur" | "block";
}

export function UpgradeGate({
  feature,
  requiredPlan = "PRO",
  children,
  isAllowed,
  customTitle,
  customMessage,
  mode = "blur",
}: UpgradeGateProps) {
  const router = useRouter();

  if (isAllowed) return <>{children}</>;

  const title = customTitle || feature || "Contenu premium";

  return (
    <div className="relative">
      {/* Contenu */}
      <div 
        className={`pointer-events-none select-none ${mode === "blur" ? "opacity-30 blur-sm" : "opacity-0"}`} 
        aria-hidden
      >
        {children}
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 flex flex-col items-center
                      justify-center gap-4 bg-gray-950/80
                      backdrop-blur-sm rounded-xl p-6 text-center">
        <div className="w-12 h-12 rounded-full bg-blue-950
                        border border-blue-800
                        flex items-center justify-center">
          <Lock className="w-5 h-5 text-blue-400" />
        </div>
        <div className="max-w-md">
          <p className="text-white font-semibold">
            {title}
          </p>
          <p className="text-gray-400 text-sm mt-2 leading-relaxed">
            {customMessage || (
              <>
                Disponible avec le plan{" "}
                <span className="text-blue-400 font-medium">
                  {requiredPlan}
                </span>
              </>
            )}
          </p>
        </div>
        <button
          onClick={() => router.push(
            `/pricing?highlight=${requiredPlan.toLowerCase()}`
          )}
          className="flex items-center gap-2
                     bg-blue-600 hover:bg-blue-500 text-white
                     px-5 py-2.5 rounded-xl font-semibold text-sm
                     transition-all duration-200 hover:scale-105 mt-2"
        >
          <Sparkles className="w-4 h-4" />
          Passer au plan {requiredPlan}
        </button>
      </div>
    </div>
  );
}
