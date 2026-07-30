"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { CVUploader } from "@/components/analyze/CVUploader"
import { JobInput } from "@/components/analyze/JobInput"
import { AnalyzeButton } from "@/components/analyze/AnalyzeButton"

const heroImage = "/images/hero-professional.jpg"

export default function HomePage() {
  const [file, setFile] = useState<File | null>(null)
  const [job, setJob] = useState("")
  const [loading, setLoading] = useState(false)

  const canAnalyze = !!file && !loading

  return (
    <div className="bg-ivoire-50 min-h-screen text-ink-900">
      {/* Lumières d'ambiance premium */}
      <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full bg-bronze-100/25 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[35%] h-[35%] rounded-full bg-bronze-50/30 blur-[100px] pointer-events-none" />

      <main className="max-w-7xl mx-auto px-6 relative z-10 min-h-[calc(100vh-73px)] flex items-center py-8">
        <div className="w-full grid lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* Colonne gauche */}
          <motion.div
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 flex flex-col"
          >
            <p className="font-medium text-[11px] text-bronze-700 tracking-[0.3em] uppercase mb-3">
              Plateforme d'entraînement stratégique
            </p>
            
            <h1
              className="text-3xl md:text-4xl font-serif font-bold text-ink-900 leading-[1.15]"
            >
              Préparez vos entretiens{" "}
              <span className="bg-gradient-to-r from-bronze-700 via-ink-800 to-bronze-700 bg-clip-text text-transparent">
                comme un stratège.
              </span>
            </h1>
            
            <p className="mt-3 text-sm text-ink-600 leading-relaxed max-w-md">
              Analyse de votre profil, simulations réalistes et feedback structuré pour performer dans les environnements les plus exigeants.
            </p>
            
            {/* Formulaire compacté */}
            <div className="mt-5 space-y-3 bg-white/70 backdrop-blur-xl p-5 rounded-2xl border border-ivoire-200/60 shadow-premium">
              <CVUploader file={file} onFile={setFile} />
              <JobInput value={job} onChange={setJob} />
              
              <Link 
                href={canAnalyze ? "/analyze" : "#"}
                className={!canAnalyze ? 'pointer-events-none block' : 'block'}
                aria-disabled={!canAnalyze}
              >
                <AnalyzeButton
                  disabled={!canAnalyze}
                  loading={loading}
                  onClick={() => { if(canAnalyze) setLoading(true) }}
                />
              </Link>
              
              <p className="text-[11px] text-ink-400 text-center tracking-wide">
                Accès immédiat et confidentiel
              </p>
            </div>

            {/* Barre de réassurance compactée */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-5 pt-4 border-t border-ivoire-200/60 flex items-center gap-4"
            >
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div 
                    key={i}
                    className="w-7 h-7 rounded-full bg-gradient-to-br from-bronze-200 to-bronze-100 border-2 border-white shadow-sm"
                  />
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1 text-bronze-600 text-xs">
                  {"★★★★★"}
                </div>
                <p className="text-[11px] text-ink-500 mt-0.5">
                  Plus de <span className="font-semibold text-ink-700">2 400 professionnels</span> accompagnés
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Colonne droite */}
          <motion.div
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 flex justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-[480px]">
              <Image
                src={heroImage}
                alt="Professionnel en entretien"
                width={480}
                height={600}
                className="rounded-2xl object-cover w-full h-auto shadow-premium-lg"
                priority
              />
              <div className="absolute inset-0 rounded-2xl border border-white/40 pointer-events-none" />
              <div className="absolute -bottom-4 -right-4 w-full h-full rounded-2xl bg-gradient-to-br from-bronze-100/40 to-bronze-50/40 blur-xl -z-10" />
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}