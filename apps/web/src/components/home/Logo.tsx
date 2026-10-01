import Link from "next/link"

/** Logo : carré arrondi accent-soft avec une courbe montante et un point en accent. */
export function Logo({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="inline-flex min-h-11 items-center gap-2.5 rounded-[14px] font-bold text-calm-ink">
      <span className="flex size-8 items-center justify-center rounded-[10px] bg-calm-accent-soft" aria-hidden="true">
        <svg viewBox="0 0 24 24" className="size-5" fill="none">
          <path
            d="M3 17c4 0 5-6 9-6 2.3 0 3.4 1.4 5 1.4"
            stroke="rgb(var(--calm-accent))"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="19" cy="7.5" r="2.4" fill="rgb(var(--calm-accent))" />
        </svg>
      </span>
      <span className="text-[17px]">Trajectoire</span>
    </Link>
  )
}
