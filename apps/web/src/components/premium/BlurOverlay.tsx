// apps/web/src/components/premium/BlurOverlay.tsx
//
// Composant pour flouter et verrouiller le contenu Premium
// Affiche un overlay avec CTA vers /pricing

import { ReactNode } from "react";
import { UpgradeCTA } from "./UpgradeCTA";

interface BlurOverlayProps {
  children: ReactNode;
}

export function BlurOverlay({ children }: BlurOverlayProps) {
  return (
    <div className="relative">
      <div className="blur-sm pointer-events-none select-none">
        {children}
      </div>

      <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-lg">
        <UpgradeCTA />
      </div>
    </div>
  );
}
