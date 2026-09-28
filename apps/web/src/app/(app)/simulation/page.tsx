import { redirect } from "next/navigation"

// /simulation n'a plus de contenu propre : l'entrée unique est /simulation/new.
// L'ancienne barrière « careerProfile requis » est devenue un bandeau non bloquant
// dans /simulation/new (l'API de création ne l'a jamais exigé).
export default function SimulationPage() {
  redirect("/simulation/new")
}
