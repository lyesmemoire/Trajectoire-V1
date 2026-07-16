// @ts-nocheck
import React from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { loginHref, signupHref } from "./landing-config";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-[#050816]/70 backdrop-blur-md border-b border-white/5 transition-all duration-300">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 transition-transform group-hover:scale-105 duration-200">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="font-black text-white text-lg tracking-tight font-display">
            Trajectoire
          </span>
        </Link>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-400">
          <a href="#features" className="hover:text-blue-600 transition-colors">
            Fonctionnalités
          </a>
          <a href="#how" className="hover:text-blue-600 transition-colors">
            Comment ça marche
          </a>
          <a href="#pricing" className="hover:text-blue-600 transition-colors">
            Tarifs
          </a>
          <a
            href="#testimonials"
            className="hover:text-blue-600 transition-colors"
          >
            Témoignages
          </a>
          <a href="#faq" className="hover:text-blue-600 transition-colors">
            FAQ
          </a>
        </div>

        {/* CTA Buttons */}
        <div className="flex items-center gap-3">
          <Link
            href={loginHref}
            className="text-sm font-bold text-slate-400 hover:text-white px-4 py-2 transition-colors hidden md:block"
          >
            Connexion
          </Link>
          <Link
            href={signupHref}
            className="text-sm bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-2.5 rounded-full transition-all duration-200 shadow-md shadow-blue-500/10 font-bold hover:shadow-lg hover:shadow-blue-500/20 transform hover:-translate-y-0.5"
          >
            Essai gratuit
          </Link>
        </div>
      </div>
    </nav>
  );
}
