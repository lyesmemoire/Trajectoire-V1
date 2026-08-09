import { Resend } from "resend";
import prisma from "@/lib/prisma";
import { checkEmailFrequency } from "./email-frequency-guard";
import { generateRecoveryEmailHtml } from "./email-templates";
let resend;
function getResend() {
    if (!resend)
        resend = new Resend(process.env.RESEND_API_KEY || "dummy");
    return resend;
}
/**
 * Service unique d'envoi d'email de reprise doux et minimaliste.
 */
export async function sendRecoveryEmail(input) {
    // 1. Vérification de la fréquence
    const lastLog = await prisma.recoveryEmailLog.findFirst({
        where: { userId: input.userId },
        orderBy: { sentAt: "desc" },
    });
    const { canSend, nextEligibleDate } = checkEmailFrequency({
        lastRecoveryEmailAt: lastLog?.sentAt,
        riskLevel: input.riskLevel,
    });
    if (!canSend) {
        throw new Error(`Limite de fréquence atteinte. Prochain envoi possible le ${nextEligibleDate?.toLocaleDateString("fr-FR")}`);
    }
    // 2. Définition du contenu selon la cause (Static mappings only)
    const contentMap = {
        overwhelm: {
            obs: "Vous avez montré une excellente résilience lors de vos dernières sessions.",
            axis: "La structure de vos réponses reste stable malgré la difficulté des questions.",
        },
        rumination: {
            obs: "Votre analyse post-session est très rigoureuse et montre une volonté de comprendre vos patterns.",
            axis: "Le prochain cap est de transformer cette réflexion en automatismes vocaux.",
        },
        frustration: {
            obs: "Vous gérez mieux les interruptions tactiques qu'auparavant.",
            axis: "Votre clarté devient plus percutante quand vous ralentissez le rythme.",
        },
        fatigue: {
            obs: "Votre parcours de progression montre une base technique très solide.",
            axis: "Continuer à affiner votre ton sous pression est votre prochain axe de travail.",
        },
    };
    const content = contentMap[input.probableCause];
    // 3. Construction de l'email
    const html = generateRecoveryEmailHtml({
        name: input.firstName,
        observation: content.obs,
        improvementAxis: content.axis,
        actionTitle: input.recommendedAction.title,
        actionDuration: input.recommendedAction.duration,
    });
    // 4. Envoi via Resend
    const resend = getResend();
    const { data, error } = await resend.emails.send({
        from: "StudioEntretien <coaching@studioentretien.fr>",
        to: input.email,
        subject: "Suite à votre dernière session",
        html,
    });
    if (error)
        throw error;
    // 5. Logging Prisma
    await prisma.recoveryEmailLog.create({
        data: {
            userId: input.userId,
            riskLevel: input.riskLevel,
            cause: input.probableCause,
            sentAt: new Date(),
        },
    });
    return data;
}
//# sourceMappingURL=resend-coaching.js.map