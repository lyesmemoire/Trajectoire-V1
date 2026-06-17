import React from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { footerLinks } from "./landing-config";

export default function Footer() {
  return (
    <footer className="py-12 border-t border-slate-100 bg-slate-50/30 px-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <Link href="#" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center transition-transform group-hover:scale-105 duration-200">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-extrabold text-slate-800 text-base tracking-tight font-display">
                AI Career Copilot
              </span>
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed max-w-sm">
              Passe les ATS. Réussis tes entretiens. Le copilote IA pour
              transformer chaque candidature en opportunité mesurable.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-6">
            {footerLinks.map((group, gIdx) => (
              <div key={gIdx} className="space-y-3">
                <strong className="text-slate-800 text-sm font-bold block">
                  {group.title}
                </strong>
                {group.links.map((link, lIdx) => {
                  const isExternal =
                    link.href.startsWith("http") ||
                    link.href.startsWith("#") === false;
                  if (isExternal) {
                    return (
                      <Link
                        key={lIdx}
                        href={link.href}
                        className="text-slate-500 hover:text-slate-800 text-xs font-semibold block transition-colors"
                      >
                        {link.label}
                      </Link>
                    );
                  } else {
                    return (
                      <a
                        key={lIdx}
                        href={link.href}
                        className="text-slate-500 hover:text-slate-800 text-xs font-semibold block transition-colors"
                      >
                        {link.label}
                      </a>
                    );
                  }
                })}
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-slate-100 text-xs font-bold text-slate-400">
          <span>© 2026 AI Career Copilot. Tous droits réservés.</span>
          <span>Made for candidates who refuse to be filtered out.</span>
        </div>
      </div>
    </footer>
  );
}
