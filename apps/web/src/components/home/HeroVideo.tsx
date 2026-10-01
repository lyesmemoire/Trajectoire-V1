"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { Play } from "lucide-react"

const BASE = "/videos/trajectoire-demo"

/**
 * Vidéo de démonstration du héros. Aucune lecture automatique : l'affichage initial est une image (poster) et un
 * bouton. Au clic, le lecteur natif (son et contrôles) remplace l'image ; le fichier vidéo n'est jamais chargé avant
 * (preload="none"). L'image n'est pas prioritaire : elle ne doit pas devenir le LCP de la page.
 */
export function HeroVideo({ label }: { label: string }) {
  const [started, setStarted] = useState(false)
  const video = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    if (!started || !video.current) return
    video.current.focus()
    void video.current.play().catch(() => {
      // Lecture refusée par le navigateur : les contrôles natifs restent disponibles.
    })
  }, [started])

  return (
    <div className="relative aspect-video overflow-hidden rounded-[20px] bg-calm-ink">
      {started ? (
        <video
          ref={video}
          className="size-full bg-calm-ink object-contain focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-white"
          controls
          playsInline
          preload="none"
          poster={`${BASE}-poster.webp`}
          aria-label="Démonstration d’un entretien avec Alexandra"
        >
          <source src={`${BASE}.mp4`} type="video/mp4" />
          <source src={`${BASE}.webm`} type="video/webm" />
          <track kind="captions" srcLang="fr" label="Français" src={`${BASE}.fr.vtt`} default />
          Votre navigateur ne peut pas lire cette vidéo.
        </video>
      ) : (
        <>
          <Image
            src={`${BASE}-poster.webp`}
            alt=""
            fill
            sizes="(min-width: 900px) 540px, 100vw"
            className="object-cover"
            unoptimized
          />
          <button
            type="button"
            onClick={() => setStarted(true)}
            className="absolute left-1/2 top-1/2 flex min-h-[52px] w-[calc(100%-24px)] -translate-x-1/2 -translate-y-1/2 items-center justify-center gap-3 rounded-full bg-calm-surface px-4 py-2 text-center text-sm font-semibold sm:w-auto sm:px-5 text-calm-ink shadow-calm transition-colors hover:bg-calm-accent-wash focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:text-base"
          >
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-calm-accent text-white" aria-hidden="true">
              <Play className="size-4" />
            </span>
            {label}
          </button>
        </>
      )}
    </div>
  )
}
