// @ts-nocheck
import { Resend } from "resend";
import { envServer } from "@/lib/env.server";

let resend: Resend;
export function getResend() {
  if (!resend) {
    resend = new Resend(envServer.RESEND_API_KEY || "dummy");
  }
  return resend;
}

export async function sendWelcomeEmail(to: string, name: string) {
  const resend = getResend();
  return resend.emails.send({
    from: "StudioEntretien <bonjour@studioentretien.fr>",
    to,
    subject: `Bienvenue ${name} — Votre coach IA est prêt 🎯`,
    html: `<h1>Bienvenue sur StudioEntretien</h1><p>Prêt pour votre prochain poste ?</p>`,
  });
}

export async function sendInterviewResultsEmail(to: string, score: number) {
  const resend = getResend();
  const { data, error } = await resend.emails.send({
    from: "StudioEntretien <resultats@studioentretien.fr>",
    to,
    subject: `Résultats de votre entretien : ${score}/100`,
    html: `<p>Votre score est de ${score}/100. Consultez le détail sur votre tableau de bord.</p>`,
  });
  return { data, error };
}
