import React from "react";
import Image from "next/image";

interface AuthArenaLayoutProps {
  children: React.ReactNode;
  quote?: string;
  author?: string;
  image?: string;
  showLeftPanel?: boolean;
}

export function AuthArenaLayout({
  children,
  quote = "Reprenons votre préparation là où vous l'avez laissée.",
  author = "Trajectoire",
  image = "/illustrations/founder-portrait.svg",
  showLeftPanel = true,
}: AuthArenaLayoutProps) {
  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "#F8F6F3" }}>
      {/* Left Panel - Image with Quote */}
      {showLeftPanel && (
        <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden items-end">
          <div
            className="absolute inset-0 animate-in fade-in zoom-in-105 duration-700 fill-mode-forwards"
          >
            <Image
              src={image}
              alt="Cadre dirigeant préparant sa stratégie d'entretien"
              fill
              className="object-cover object-center"
              priority
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent z-10" />
          <div
            className="relative z-20 p-12 text-white animate-in fade-in slide-in-from-bottom-8 duration-500 delay-300 fill-mode-both"
          >
            <p className="font-serif text-2xl leading-relaxed mb-5 max-w-md opacity-95">
              « {quote} »
            </p>
            <p className="text-sm font-medium opacity-75 tracking-wide">— {author}</p>
          </div>
        </div>
      )}

      {/* Right Panel - Content */}
      <div className="w-full lg:w-[55%] flex items-center justify-center p-6 lg:p-12 relative">
        {children}
      </div>
    </div>
  );
}
