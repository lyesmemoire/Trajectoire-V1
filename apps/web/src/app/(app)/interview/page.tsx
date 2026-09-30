import { redirect } from "next/navigation"

// L'ancien parcours « /interview » (questions génériques, score non calculé) a été retiré.
// L'entretien se fait dans /simulation : même redirection que /simulation.
export default function InterviewPage() {
  redirect("/simulation/new")
}
