import React, { memo } from "react";
import { ConnectionBadge } from "./ConnectionBadge";

export const InterviewHeader = memo(function InterviewHeader() {
  return (
    <header className="w-full flex items-center justify-between p-6 max-w-5xl mx-auto">
      <div className="flex flex-col">
        <h1 className="text-xl font-semibold text-text-primary tracking-tight">Trajectoire</h1>
        <p className="text-sm text-text-secondary">Coach d'Entretien</p>
      </div>
      <div className="flex items-center gap-4">
        {/* <LatencyIndicator /> Masqué pour réduire la charge cognitive */}
        <ConnectionBadge />
      </div>
    </header>
  );
});
