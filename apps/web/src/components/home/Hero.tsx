import Image from "next/image"
import { Mic } from "lucide-react"
import { HERO_CARD_BADGE, HERO_QUESTION, SHOW_HERO_AUDIO, SHOW_PORTRAIT } from "./content"
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
    <div className="relative w-full pb-6 pr-6">
      {/* Fond arrondi décalé de 24 px en bas à droite : de la profondeur, rien d'interactif. */}
      <div aria-hidden="true" className="absolute inset-0 left-6 top-6 rounded-[40px] bg-calm-accent-wash" />
    <aside
      aria-label="Aperçu d’une question d’Alexandra"
      className="relative w-full rounded-[28px] border border-calm-line bg-calm-surface p-6 shadow-calm sm:p-8"
    >
      <div className="flex items-center gap-4">
        <AlexandraAvatar size={84} />
        <div className="min-w-0">
          <p className="text-xl font-semibold text-calm-ink">Alexandra</p>
          <p className="text-sm text-calm-secondary">Recruteuse d’entraînement · bienveillante</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <span className="inline-block rounded-full bg-calm-line-soft px-3 py-1 text-xs font-medium text-calm-secondary">
              Alternance · Chargée de communication
            </span>
            {HERO_CARD_BADGE && (
              <span className="inline-block rounded-full bg-calm-line-soft px-3 py-1 text-xs font-medium text-calm-secondary">
                {HERO_CARD_BADGE}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-[20px] bg-calm-bg p-5">
        <span className="inline-block rounded-full bg-calm-accent-soft px-3 py-1 text-xs font-semibold text-calm-accent-deep">
          Question tirée de votre CV
        </span>
        <p className="mt-3 text-lg leading-relaxed text-calm-ink">«&nbsp;{HERO_QUESTION}&nbsp;»</p>
      </div>

      {/* Illustration statique : ni son ni interaction (le vrai lecteur reste derrière SHOW_HERO_AUDIO). */}
      <div aria-hidden="true" className="mt-5 flex items-center justify-center gap-4">
        <span className="flex size-[84px] shrink-0 items-center justify-center rounded-full bg-calm-accent-wash">
          <span className="flex size-[62px] items-center justify-center rounded-full bg-calm-accent-soft">
            <span className="flex size-[42px] items-center justify-center rounded-full bg-calm-accent">
              <Mic className="size-5 text-white" />
            </span>
          </span>
        </span>
        <div>
          <p className="text-sm font-medium text-calm-ink">Alexandra vous écoute…</p>
          <div className="mt-2 flex h-6 items-center gap-[3px]">
            {[6, 12, 18, 10, 22, 14, 8, 20, 12, 16, 9, 18, 7, 13].map((h, i) => (
              <span key={i} className="w-[3px] rounded-full bg-calm-accent-line" style={{ height: h }} />
            ))}
          </div>
        </div>
      </div>

      {SHOW_HERO_AUDIO && <HeroAudioPlayer />}

      <p className="mt-6 text-center text-sm text-calm-secondary">Respirez. Vous pouvez reformuler à tout moment.</p>
    </aside>
    </div>
  )
}
