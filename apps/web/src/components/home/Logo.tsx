import Link from "next/link"

/** Logo : « Trajectoire » en serif, précédé d'un point accent. `size` : en-tête (29 px) ou pied de page (23 px). */
export function Logo({ href = "/", size = "header" }: { href?: string; size?: "header" | "footer" }) {
  const header = size === "header"
  return (
    <Link
      href={href}
      className={`inline-flex min-h-11 items-center font-serif font-semibold tracking-[-0.04em] text-calm-ink no-underline ${
        header ? "gap-[9px] text-[29px] max-[700px]:text-[25px] max-[400px]:text-[21px]" : "gap-2 text-[23px]"
      }`}
    >
      <span
        aria-hidden="true"
        className={`rounded-full bg-calm-accent ${header ? "mt-[5px] size-[7px]" : "mt-1 size-1.5"}`}
      />
      Trajectoire
    </Link>
  )
}
