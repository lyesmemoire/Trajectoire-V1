import Image from "next/image"
import { HERO_CARD_NOTE, HERO_QUESTION, SHOW_HERO_AUDIO, SHOW_PORTRAIT } from "./content"
import { HeroAudioPlayer } from "./HeroAudioPlayer"

/** Avatar d'Alexandra : initiale tant que SHOW_PORTRAIT est faux (aucun vrai portrait n'existe encore). */
export function AlexandraAvatar({ size }: { size: number }) {
  if (SHOW_PORTRAIT) {
    return (
      <Image src="/interviewer.png" alt="" width={size} height={size} className="shrink-0 rounded-full object-cover" style={{ width: size, height: size }} />
    )
  }
  return (
    <span
      aria-hidden="true"
      className="font-accent flex shrink-0 items-center justify-center rounded-full bg-calm-accent-soft text-calm-accent-deep"
      style={{ width: size, height: size, fontSize: size * 0.5 }}
    >
      A
    </span>
  )
}

/** Bande mobile (< 760 px) au-dessus du formulaire. */
export function AlexandraStrip() {
  return (
    <div className="flex items-center gap-3 rounded-[20px] border border-calm-line bg-calm-surface p-3 min-[760px]:hidden">
      <AlexandraAvatar size={44} />
      <div>
        <p className="font-semibold text-calm-ink">Alexandra</p>
        <p className="text-sm text-calm-secondary">Votre recruteuse d’entraînement, bienveillante</p>
      </div>
    </div>
  )
}

/** Carte produit du héros (colonne de droite) : aucune photo, aucune donnée inventée sur de vrais candidats. */
export function HeroProductCard() {
  return (
    <aside
      aria-label="Aperçu d’une question d’Alexandra"
      className="w-full rounded-[28px] border border-calm-line bg-calm-surface p-6 shadow-calm sm:p-8"
    >
      <div className="flex items-center gap-4">
        <AlexandraAvatar size={84} />
        <div className="min-w-0">
          <p className="text-xl font-semibold text-calm-ink">Alexandra</p>
          <p className="text-sm text-calm-secondary">Recruteuse d’entraînement · bienveillante</p>
          <span className="mt-2 inline-block rounded-full bg-calm-line-soft px-3 py-1 text-xs font-medium text-calm-secondary">
            Alternance · Chargée de communication
          </span>
        </div>
      </div>

      <div className="mt-6 rounded-[20px] bg-calm-bg p-5">
        <span className="inline-block rounded-full bg-calm-accent-soft px-3 py-1 text-xs font-semibold text-calm-accent-deep">
          Question tirée de votre CV
        </span>
        <p className="mt-3 text-lg leading-relaxed text-calm-ink">«&nbsp;{HERO_QUESTION}&nbsp;»</p>
      </div>

      {HERO_CARD_NOTE && <p className="mt-3 text-xs text-calm-tertiary">{HERO_CARD_NOTE}</p>}

      {SHOW_HERO_AUDIO && <HeroAudioPlayer />}

      <p className="mt-6 text-center text-sm text-calm-secondary">Respirez. Vous pouvez reformuler à tout moment.</p>
    </aside>
  )
}
