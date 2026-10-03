import Image from "next/image"
import { CvPreviewForm } from "@/components/marketing/CvPreviewForm"
import {
  ALEXANDRA_NAME,
  ALEXANDRA_ROLE,
  ALEXANDRA_PORTRAIT_NOTE,
  ALEXANDRA_PORTRAIT_SRC,
  HERO_EYEBROW,
  HERO_QUESTION,
  HERO_SUBTITLE,
  SHOW_PORTRAIT,
} from "./content"
import { eyebrow } from "./styles"

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

/** Portrait 4:5 d'Alexandra (max 492 px) avec la question tirée du CV posée en bas ; légende dessous. */
function HeroPortrait() {
  return (
    <figure className="m-0 w-full max-w-[492px] justify-self-end max-[980px]:justify-self-start">
      <div className="relative aspect-[4/5] overflow-hidden rounded-[6px] bg-[#4B4944] shadow-portrait">
        {SHOW_PORTRAIT && (
          <Image
            src={ALEXANDRA_PORTRAIT_SRC}
            alt="Alexandra, recruteuse d’entraînement, face caméra"
            fill
            sizes="(max-width: 520px) calc(100vw - 32px), 492px"
            className="object-cover object-top"
          />
        )}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(16,18,16,0)_45%,rgba(10,20,17,0.34)_100%)]"
        />
        <div className="absolute inset-x-4 bottom-4 rounded-[5px] bg-white px-[18px] pb-4 pt-[17px] shadow-report">
          <span className="block text-xs font-bold uppercase tracking-[0.13em] text-calm-accent">Question tirée de votre CV</span>
          <p className="mb-0 mt-2.5 text-[18px] font-medium leading-[1.3] tracking-[-0.01em]">
            «&nbsp;{HERO_QUESTION}&nbsp;»
          </p>
        </div>
      </div>
      <figcaption className="mt-3 text-sm leading-[1.4]">
        <strong>{ALEXANDRA_NAME}</strong>, {ALEXANDRA_ROLE}
        <br />
        <span className="text-[13px] text-calm-secondary">{ALEXANDRA_PORTRAIT_NOTE}</span>
      </figcaption>
    </figure>
  )
}

/** Héros : deux colonnes centrées verticalement. Rien d'animé. */
export function Hero() {
  return (
    <section
      aria-labelledby="hero-titre"
      className="home-wrap grid grid-cols-[minmax(0,1fr)_minmax(360px,0.82fr)] items-center gap-[9%] pb-[clamp(56px,6vw,88px)] pt-[clamp(44px,5.5vw,78px)] max-[980px]:grid-cols-1 max-[980px]:gap-12"
    >
      <div className="max-w-[650px]">
        <p className={`${eyebrow} mb-[22px]`}>
          <i aria-hidden="true" className="inline-block h-px w-6 bg-current" />
          {HERO_EYEBROW}
        </p>
        <h1 id="hero-titre" className="text-[clamp(46px,5.5vw,82px)] leading-[0.94]">
          Entraînez-vous face au recruteur qui a <em>lu votre&nbsp;CV.</em>
        </h1>
        <p className="mb-7 mt-7 max-w-[560px] text-lg leading-[1.6] text-calm-tertiary">{HERO_SUBTITLE}</p>
        <div id="diagnostic">
          <CvPreviewForm />
        </div>
      </div>
      <HeroPortrait />
    </section>
  )
}
