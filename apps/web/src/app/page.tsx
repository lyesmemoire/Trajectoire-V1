"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { CVUploader } from "@/components/analyze/CVUploader"
import { JobInput } from "@/components/analyze/JobInput"
import { AnalyzeButton } from "@/components/analyze/AnalyzeButton"
import { PreviewTokenManager } from "@/lib/preview-analysis/previewTokenManager"

const heroImage = "/images/hero-professional.jpg"

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] },
  }),
} as any

const fadeScale = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: (delay = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] },
  }),
} as any

export default function HomePage() {
  const [file, setFile] = useState<File | null>(null)
  const [job, setJob] = useState("")
  const [loading, setLoading] = useState(false)
  const [previewToken, setPreviewToken] = useState<string | null>(null)

  const canAnalyze = !!file && !loading

  // Sauvegarder le previewToken lors de la réception
  const handleAnalyze = async () => {
    if (!canAnalyze) return
    setLoading(true)
    
    try {
      const formData = new FormData()
      formData.append('cv', file!)
      if (job) formData.append('jobDescription', job)

      const response = await fetch('/api/public/analyze-preview', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        if (data.previewToken) {
          setPreviewToken(data.previewToken)
          PreviewTokenManager.setSessionToken(data.previewToken)
        }
        // Rediriger vers la page d'analyse avec les données
        window.location.href = `/analyze?preview=${data.previewToken}`
      }
    } catch (error) {
      console.error('Analysis failed:', error)
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        backgroundColor: "var(--color-bg)",
        minHeight: "calc(100dvh - 72px)",
      }}
      className="flex items-center"
    >
      <main className="w-full max-w-[1080px] mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-10 items-center">
          {/* ─── Colonne gauche ─── */}
          <div className="flex flex-col gap-5 lg:gap-6">
            {/* Eyebrow */}
            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0}
              style={{
                color: "var(--color-accent)",
                fontSize: "11px",
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                fontWeight: 600,
                margin: 0,
              }}
            >
              Votre coach d&apos;entretien intelligent
            </motion.p>

            {/* Titre */}
            <motion.h1
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.1}
              style={{
                fontSize: "clamp(24px, 2.6vw, 36px)",
                lineHeight: 1.14,
                fontWeight: 700,
                color: "var(--color-text-main)",
                margin: 0,
                fontFamily: "Georgia, serif",
              }}
            >
              Pendant que les autres espèrent,
              <br />
              Vous vous préparez à{" "}
              <span style={{ color: "var(--color-accent)" }}>
                réussir.
              </span>
            </motion.h1>

            {/* Sous-titre */}
            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.2}
              style={{
                fontSize: "15px",
                lineHeight: 1.65,
                color: "var(--color-text-body)",
                maxWidth: "460px",
                margin: 0,
              }}
            >
              Importez votre CV, décrivez le poste visé et
              entraînez-vous avec un recruteur IA qui adapte ses
              questions à votre profil. Recevez une analyse détaillée,
              des conseils concrets et les compétences à renforcer
              avant votre véritable entretien.
            </motion.p>

            {/* Séparateur */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.25}
              style={{
                width: "40px",
                height: "2px",
                backgroundColor: "var(--color-accent-soft)",
                borderRadius: "2px",
              }}
            />

            {/* Formulaire */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.3}
              style={{
                backgroundColor: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                borderRadius: "16px",
                padding: "18px",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                boxShadow:
                  "rgba(0,0,0,0.03) 0px 1px 0px 0px, " +
                  "rgba(26,26,46,0.07) 0px 10px 28px -8px",
              }}
            >
              <CVUploader file={file} onFile={setFile} />
              <JobInput value={job} onChange={setJob} />

              <AnalyzeButton
                disabled={!canAnalyze}
                loading={loading}
                onClick={handleAnalyze}
              />

              <p
                style={{
                  fontSize: "11px",
                  color: "var(--color-text-muted)",
                  textAlign: "center",
                  margin: 0,
                  lineHeight: 1.55,
                }}
              >
                🎤 Simulation vocale • 📄 Analyse de CV • 🎯 Feedback
                personnalisé • 🧠 IA spécialisée RH
              </p>
            </motion.div>

            {/* Réassurance */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.4}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <div style={{ display: "flex" }}>
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "50%",
                      background:
                        "linear-gradient(135deg, #d4b896, #e8d5b7)",
                      border: "2px solid var(--color-surface)",
                      marginLeft: i === 1 ? 0 : "-8px",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                    }}
                  />
                ))}
              </div>
              <div>
                <div
                  style={{
                    color: "var(--color-accent)",
                    fontSize: "12px",
                  }}
                >
                  ★★★★★
                </div>
                <p
                  style={{
                    fontSize: "11px",
                    color: "var(--color-text-muted)",
                    margin: "2px 0 0",
                  }}
                >
                  Plus de{" "}
                  <span
                    style={{
                      fontWeight: 600,
                      color: "var(--color-text-body)",
                    }}
                  >
                    2 400 professionnels
                  </span>{" "}
                  accompagnés
                </p>
              </div>
            </motion.div>
          </div>

          {/* ─── Colonne droite — VERSION PREMIUM ─── */}
          <motion.div
            variants={fadeScale}
            initial="hidden"
            animate="visible"
            custom={0.15}
            style={{ position: "relative" }}
          >
            {/* Double halo premium */}
            <div
              style={{
                position: "absolute",
                inset: "-20px",
                borderRadius: "28px",
                background:
                  "radial-gradient(ellipse at 30% 20%, " +
                  "rgba(156,111,62,0.10) 0%, transparent 50%), " +
                  "radial-gradient(ellipse at 70% 80%, " +
                  "rgba(212,184,150,0.12) 0%, transparent 50%)",
                zIndex: 0,
                pointerEvents: "none",
              }}
            />

            {/* Container image principal */}
            <div
              style={{
                position: "relative",
                zIndex: 1,
                borderRadius: "20px",
                overflow: "hidden",
                border: "1px solid var(--color-border)",
                boxShadow:
                  "rgba(0,0,0,0.06) 0px 2px 4px, " +
                  "rgba(26,26,46,0.12) 0px 20px 50px -12px",
              }}
            >
              {/* Image */}
              <Image
                src={heroImage}
                alt="Professionnel se préparant à un entretien"
                width={440}
                height={520}
                className="object-cover w-full h-auto"
                style={{ maxHeight: "480px" }}
                priority
              />

              {/* Overlay gradient subtil en bas */}
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: "40%",
                  background:
                    "linear-gradient(to top, " +
                    "rgba(0,0,0,0.35) 0%, transparent 100%)",
                  borderRadius: "0 0 20px 20px",
                  pointerEvents: "none",
                }}
              />

              {/* Badge "Simulation terminée" — sur l'image */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.7 }}
                style={{
                  position: "absolute",
                  bottom: "16px",
                  left: "16px",
                  backgroundColor: "rgba(255,255,255,0.94)",
                  backdropFilter: "blur(14px)",
                  border: "1px solid rgba(255,255,255,0.6)",
                  borderRadius: "14px",
                  padding: "10px 14px",
                  boxShadow:
                    "rgba(0,0,0,0.08) 0px 8px 24px -4px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "10px",
                    background:
                      "linear-gradient(135deg, var(--color-accent-light), var(--color-accent-soft))",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    fontSize: "18px",
                  }}
                >
                  🎯
                </div>
                <div>
                  <p
                    style={{
                      fontSize: "12px",
                      fontWeight: 700,
                      color: "var(--color-text-main)",
                      margin: 0,
                    }}
                  >
                    Simulation terminée
                  </p>
                  <p
                    style={{
                      fontSize: "11px",
                      color: "var(--color-text-muted)",
                      margin: "2px 0 0",
                    }}
                  >
                    Score global :{" "}
                    <span
                      style={{
                        fontWeight: 700,
                        color: "var(--color-accent)",
                      }}
                    >
                      87 / 100
                    </span>
                  </p>
                </div>
              </motion.div>

              {/* Badge "En cours" — coin haut droit */}
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                style={{
                  position: "absolute",
                  top: "16px",
                  right: "16px",
                  backgroundColor: "rgba(255,255,255,0.92)",
                  backdropFilter: "blur(14px)",
                  border: "1px solid rgba(255,255,255,0.5)",
                  borderRadius: "10px",
                  padding: "8px 12px",
                  boxShadow:
                    "rgba(0,0,0,0.06) 0px 4px 16px -2px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                {/* Pastille verte "live" */}
                <div
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    backgroundColor: "#22c55e",
                    boxShadow: "0 0 6px rgba(34,197,94,0.4)",
                  }}
                />
                <p
                  style={{
                    fontSize: "11px",
                    fontWeight: 600,
                    color: "var(--color-text-main)",
                    margin: 0,
                  }}
                >
                  Entretien en cours
                </p>
              </motion.div>
            </div>

            {/* Bloc stats premium */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.5}
              style={{
                marginTop: "12px",
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "10px",
              }}
            >
              {[
                { value: "12 min", label: "Durée moyenne", icon: "⏱️" },
                { value: "94 %", label: "Satisfaction", icon: "💎" },
                { value: "3 actes", label: "Structure", icon: "📋" },
              ].map((stat) => (
                <motion.div
                  key={stat.label}
                  whileHover={{ y: -2, transition: { duration: 0.2 } }}
                  style={{
                    backgroundColor: "var(--color-surface)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "14px",
                    padding: "14px 16px",
                    textAlign: "center",
                    boxShadow:
                      "rgba(0,0,0,0.03) 0px 1px 0px, " +
                      "rgba(26,26,46,0.06) 0px 8px 24px -6px",
                    cursor: "default",
                  }}
                >
                  <p
                    style={{
                      fontSize: "16px",
                      margin: "0 0 6px",
                    }}
                  >
                    {stat.icon}
                  </p>
                  <p
                    style={{
                      fontSize: "18px",
                      fontWeight: 700,
                      color: "var(--color-text-main)",
                      margin: 0,
                    }}
                  >
                    {stat.value}
                  </p>
                  <p
                    style={{
                      fontSize: "11px",
                      color: "var(--color-text-muted)",
                      margin: "3px 0 0",
                    }}
                  >
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </motion.div>

            {/* Barre de confiance */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.6}
              style={{
                marginTop: "10px",
                backgroundColor: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                borderRadius: "12px",
                padding: "12px 16px",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                boxShadow:
                  "rgba(0,0,0,0.02) 0px 1px 0px, " +
                  "rgba(26,26,46,0.04) 0px 6px 20px -4px",
              }}
            >
              {/* Barre de progression */}
              <div
                style={{
                  flex: 1,
                  height: "6px",
                  backgroundColor: "var(--color-border)",
                  borderRadius: "3px",
                  overflow: "hidden",
                }}
              >
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: "87%" }}
                  transition={{
                    delay: 0.9,
                    duration: 1.2,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  style={{
                    height: "100%",
                    background:
                      "linear-gradient(90deg, var(--color-accent), var(--color-accent-soft))",
                    borderRadius: "3px",
                  }}
                />
              </div>

              {/* Label */}
              <p
                style={{
                  fontSize: "11px",
                  fontWeight: 600,
                  color: "var(--color-text-muted)",
                  margin: 0,
                  whiteSpace: "nowrap",
                }}
              >
                Indice de préparation :{" "}
                <span style={{ color: "var(--color-accent)" }}>
                  87%
                </span>
              </p>
            </motion.div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}