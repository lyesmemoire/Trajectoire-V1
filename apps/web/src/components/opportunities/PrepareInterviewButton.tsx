"use client"

import { useFormStatus } from "react-dom"
import { Loader2, Mic2 } from "lucide-react"
import { prepareInterview } from "@/app/(app)/opportunities/actions"
import { cn } from "@/lib/utils"

function SubmitButton({ className, children }: { className?: string; children: React.ReactNode }) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      className={cn(
        "inline-flex items-center justify-center gap-1.5 rounded-lg bg-indigo-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-indigo-400 disabled:cursor-wait disabled:opacity-60",
        className,
      )}
    >
      {pending ? <Loader2 className="size-3.5 animate-spin" aria-hidden /> : <Mic2 className="size-3.5" aria-hidden />}
      {pending ? "Préparation de l'entretien…" : children}
    </button>
  )
}

/**
 * Lance directement l'entretien d'une opportunité : la Server Action crée la simulation préremplie et redirige
 * vers elle. Le bouton se verrouille pendant la création (une seule simulation décomptée).
 */
export function PrepareInterviewButton({ opportunityId, className, label = "Simuler cet entretien" }: { opportunityId: string; className?: string; label?: string }) {
  return (
    <form action={prepareInterview.bind(null, opportunityId)}>
      <SubmitButton className={className}>{label}</SubmitButton>
    </form>
  )
}
