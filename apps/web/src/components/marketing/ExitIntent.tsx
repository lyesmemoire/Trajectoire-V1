"use client";

import { useState, useEffect } from "react";
import { X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export function ExitIntent() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("exitShown")) return;
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY > 20) return;
      setShow(true);
      sessionStorage.setItem("exitShown", "1");
    };
    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-[#050816]/95 backdrop-blur-xl transition-opacity"
        onClick={() => setShow(false)}
      />
      <div className="relative z-10 bg-[#0B1023] border border-white/[0.08] rounded-[3.5rem] shadow-[0_0_100px_rgba(124,58,237,0.1)] max-w-lg w-full p-12 text-center animate-in fade-in zoom-in-95 duration-500 overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#7C3AED] to-transparent opacity-50" />

        <button
          onClick={() => setShow(false)}
          className="absolute top-8 right-8 p-3 hover:bg-white/5 rounded-2xl transition-colors text-slate-500 hover:text-white"
        >
          <X className="w-6 h-6" />
        </button>

        {!done ? (
          <div className="space-y-10">
            <div className="w-24 h-24 bg-[#7C3AED]/10 rounded-[2.5rem] flex items-center justify-center text-5xl mx-auto shadow-inner border border-[#7C3AED]/20">
              🎁
            </div>
            <div className="space-y-3">
              <h2 className="text-4xl font-black text-white leading-tight tracking-tight">
                Attendez !
              </h2>
              <p className="text-slate-400 font-medium text-lg leading-relaxed">
                Recevez gratuitement notre guide <br />
                <span className="text-[#06B6D4] font-black italic">
                  "Maîtriser la Haute Pression"
                </span>
              </p>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setDone(true);
                toast.success("Guide envoyé !");
              }}
              className="space-y-5"
            >
              <Input
                type="email"
                placeholder="votre@email.fr"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-16 rounded-2xl bg-white/[0.03] border-white/10 text-white text-center font-bold text-lg focus:ring-[#7C3AED]"
                required
              />
              <Button
                type="submit"
                className="w-full h-16 bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-black rounded-2xl shadow-2xl shadow-[#7C3AED]/20 text-lg transition-transform active:scale-95 group"
              >
                Recevoir mon guide{" "}
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </form>
            <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
              50 Questions + Réponses modèles incluses
            </p>
          </div>
        ) : (
          <div className="space-y-10 py-10">
            <div className="text-7xl animate-bounce">🎉</div>
            <div className="space-y-3">
              <h3 className="text-3xl font-black text-white tracking-tight">
                C'est dans votre boîte !
              </h3>
              <p className="text-slate-400 font-medium text-lg">
                Le guide arrive dans quelques secondes. <br />
                Préparez-vous à la mutation.
              </p>
            </div>
            <Button
              className="w-full h-16 bg-white text-[#050816] font-black rounded-2xl text-lg hover:bg-slate-200 transition-transform active:scale-95"
              onClick={() => setShow(false)}
            >
              Lancer mon Test Gratuit
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
