"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FinalCTA() {
  return (
    <section className="section px-6 bg-[#050816] relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#7C3AED]/10 rounded-full blur-[160px] -z-10" />

      <div className="max-w-5xl mx-auto text-center space-y-16">
        <motion.h2
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="text-6xl lg:text-[10rem] font-black tracking-tighter leading-[0.8] text-white"
        >
          Pouvez-vous <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] to-[#06B6D4]">
            dominer l'arène ?
          </span>
        </motion.h2>

        <p className="text-2xl text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
          La plupart des candidats découvrent leurs limites comportementales
          trop tard. Révélez les vôtres aujourd'hui.
        </p>

        <div className="pt-10">
          <Button
            asChild
            size="lg"
            className="h-24 px-16 rounded-[2.5rem] bg-[#7C3AED] text-white hover:bg-[#6D28D9] font-black text-2xl shadow-[0_0_50px_rgba(124,58,237,0.3)] transition-all hover:scale-105 active:scale-95 group"
          >
            <Link href="/auth/signup">
              Révéler mon Career DNA{" "}
              <ChevronRight className="ml-3 w-8 h-8 group-hover:translate-x-2 transition-transform" />
            </Link>
          </Button>
        </div>

        <div className="flex items-center justify-center gap-6 pt-12">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span className="text-xs font-black text-slate-600 uppercase tracking-widest">
              Test de pression gratuit
            </span>
          </div>
          <div className="h-4 w-px bg-white/10" />
          <div className="flex items-center gap-2">
            <ShieldCheckIcon className="w-4 h-4 text-blue-500" />
            <span className="text-xs font-black text-slate-600 uppercase tracking-widest">
              Accès instantané
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

function ShieldCheckIcon(props: _unknown) {
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
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.5 3.8 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
