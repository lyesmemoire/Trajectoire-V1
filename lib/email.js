import { Resend } from "resend";
let resend;
export function getResend() {
    if (!resend) {
        resend = new Resend(process.env.RESEND_API_KEY || "dummy");
    }
    return resend;
}
export async function sendWelcomeEmail(to, name) {
    const resend = getResend();
    return resend.emails.send({
        from: "StudioEntretien <bonjour@studioentretien.fr>",
        to,
        subject: `Bienvenue ${name} — Votre coach IA est prêt 🎯`,
        html: `<h1>Bienvenue sur StudioEntretien</h1><p>Prêt pour votre prochain poste ?</p>`,
    });
}
export async function sendInterviewResultsEmail(to, score) {
    const resend = getResend();
    const { data, error } = await resend.emails.send({
        from: "StudioEntretien <resultats@studioentretien.fr>",
        to,
        subject: `Résultats de votre entretien : ${score}/100`,
        html: `<p>Votre score est de ${score}/100. Consultez le détail sur votre tableau de bord.</p>`,
    });
    return { data, error };
}
//# sourceMappingURL=email.js.map