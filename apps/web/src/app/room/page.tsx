/**
 * Cette page a été supprimée dans le cadre de l'unification du flux interview.
 *
 * Point d'entrée unique : /interview  (InterviewInitializer → InterviewRoom)
 *
 * Une redirection permanente est mise en place pour les éventuels liens
 * entrants vers /room.
 */
import { redirect } from "next/navigation";

export default function RoomRedirect() {
  redirect("/interview");
}
