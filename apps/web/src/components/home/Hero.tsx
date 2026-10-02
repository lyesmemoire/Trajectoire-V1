import Image from "next/image"
import { Mic } from "lucide-react"
import {
  ALEXANDRA_PORTRAIT_CAPTION,
  ALEXANDRA_PORTRAIT_NOTE,
  ALEXANDRA_PORTRAIT_SRC,
  HERO_CARD_BADGE,
  HERO_QUESTION,
  HERO_VIDEO_BUTTON,
  HERO_VIDEO_CAPTION,
  SHOW_HERO_AUDIO,
  SHOW_HERO_VIDEO,
  SHOW_PORTRAIT,
} from "./content"
import { HeroVideo } from "./HeroVideo"
import { HeroAudioPlayer } from "./HeroAudioPlayer"

/** Avatar d'Alexandra : portrait si SHOW_PORTRAIT, sinon initiale. */
export function AlexandraAvatar({ size }: { size: number }) {
  if (SHOW_PORTRAIT) {
    return (
      <Image src={ALEXANDRA_PORTRAIT_SRC} alt="" width={size} height={size} className="shrink-0 rounded-full object-cover object-top" style={{ width: size, height: size }} />
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
  // Le grand portrait suit le formulaire sur mobile : la bande ferait doublon.
  if (SHOW_PORTRAIT && !SHOW_HERO_VIDEO) return null
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

/** Carte d'Alexandra (ancienne colonne de droite) : conservée derrière SHOW_HERO_VIDEO = false. */
function HeroAlexandraCard() {
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

/** Portrait d'Alexandra en 4:5, avec la question tirée du CV posée en bas de la photo (SHOW_PORTRAIT = true). */
function HeroPortraitCard() {
  return (
    <figure className="relative w-full pb-6 pr-6">
      <div aria-hidden="true" className="absolute inset-0 left-6 top-6 rounded-[40px] bg-calm-accent-wash" />
      <div className="relative overflow-hidden rounded-[28px] border border-calm-line bg-calm-surface shadow-calm">
        <Image
          src={ALEXANDRA_PORTRAIT_SRC}
          alt="Portrait d’Alexandra, recruteuse d’entraînement"
          width={960}
          height={1200}
          sizes="(min-width: 1024px) 520px, 100vw"
          className="aspect-[4/5] w-full object-cover object-top"
        />
        <div className="absolute inset-x-4 bottom-4 rounded-[20px] border border-calm-line bg-calm-surface p-5 sm:inset-x-5 sm:bottom-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-block rounded-full bg-calm-accent-soft px-3 py-1 text-xs font-semibold text-calm-accent-deep">
              Question tirée de votre CV
            </span>
            {HERO_CARD_BADGE && (
              <span className="inline-block rounded-full bg-calm-line-soft px-3 py-1 text-xs font-medium text-calm-secondary">
                {HERO_CARD_BADGE}
              </span>
            )}
          </div>
          <p className="font-accent mt-3 text-lg leading-snug text-calm-ink sm:text-xl">«&nbsp;{HERO_QUESTION}&nbsp;»</p>
        </div>
      </div>
      <figcaption className="relative mt-4 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 px-1">
        <span className="font-accent text-lg text-calm-ink">{ALEXANDRA_PORTRAIT_CAPTION}</span>
        <span className="text-sm text-calm-secondary">{ALEXANDRA_PORTRAIT_NOTE}</span>
      </figcaption>
      {SHOW_HERO_AUDIO && <HeroAudioPlayer />}
    </figure>
  )
}

/** Cadre commun de la colonne de droite : carte blanche arrondie et fond accent-wash décalé de 24 px. */
function HeroFrame({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="relative w-full pb-6 pr-6">
      <div aria-hidden="true" className="absolute inset-0 left-6 top-6 rounded-[40px] bg-calm-accent-wash" />
      <aside aria-label={label} className="relative w-full rounded-[28px] border border-calm-line bg-calm-surface p-4 shadow-calm sm:p-5">
        {children}
      </aside>
    </div>
  )
}

/** Carte vidéo : poster + bouton, légende et badge. Aucune lecture automatique. */
function HeroVideoCard() {
  return (
    <HeroFrame label="Démonstration vidéo">
      <HeroVideo label={HERO_VIDEO_BUTTON} />
      <div className="mt-4 flex flex-wrap items-center gap-2 px-1 pb-1">
        <p className="text-sm font-medium text-calm-ink">{HERO_VIDEO_CAPTION}</p>
        {HERO_CARD_BADGE && (
          <span className="inline-block rounded-full bg-calm-line-soft px-3 py-1 text-xs font-medium text-calm-secondary">
            {HERO_CARD_BADGE}
          </span>
        )}
      </div>
    </HeroFrame>
  )
}

/** Colonne de droite du héros : vidéo (SHOW_HERO_VIDEO), sinon portrait (SHOW_PORTRAIT), sinon carte au monogramme. */
export function HeroProductCard() {
  if (SHOW_HERO_VIDEO) return <HeroVideoCard />
  return SHOW_PORTRAIT ? <HeroPortraitCard /> : <HeroAlexandraCard />
}
