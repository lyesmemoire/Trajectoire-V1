import React from "react"
import Link from "next/link"
import { Sparkles } from "lucide-react"
import { loginHref, signupHref } from "./landing-config"

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-[#050816]/70 backdrop-blur-md border-b border-white/5 transition-all duration-300">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 bg-gradient-to-br from-ink-700 to-ink-900 rounded-xl flex items-center justify-center shadow-lg shadow-ink-500/20 transition-transform group-hover:scale-105 duration-200">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="font-black text-white text-lg tracking-tight font-display">
            Trajectoire
          </span>
        </Link>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-bold text-ink-400">
          <a href="#features" className="hover:text-ink-300 transition-colors">
            Fonctionnalités
          </a>
          <a href="#how" className="hover:text-ink-300 transition-colors">
            Comment ça marche
          </a>
          <a href="#pricing" className="hover:text-ink-300 transition-colors">
            Tarifs
          </a>
          <a
            href="#testimonials"
            className="hover:text-ink-300 transition-colors"
          >
            Témoignages
          </a>
          <a href="#faq" className="hover:text-ink-300 transition-colors">
            FAQ
          </a>
        </div>

        {/* CTA Buttons */}
        <div className="flex items-center gap-3">
          <Link
            href={loginHref}
            className="text-sm font-bold text-ink-400 hover:text-white px-4 py-2 transition-colors hidden md:block"
          >
            Connexion
          </Link>
          <Link
            href={signupHref}
            className="text-sm bg-gradient-to-r from-ink-700 to-ink-900 hover:from-ink-800 hover:to-ink-900 text-white px-5 py-2.5 rounded-full transition-all duration-200 shadow-md shadow-ink-500/10 font-bold hover:shadow-lg hover:shadow-ink-500/20 transform hover:-translate-y-0.5"
          >
            Essai gratuit
          </Link>
        </div>
      </div>
    </nav>
  )
}
