
/**
 * Sends a weekly summary email with behavioral insights.
 */
// @ts-nocheck

export async function sendWeeklyBehavioralInsights(
  userId: string,
  email: string,
  insights: any[],
) {
  const html = `
        <h1>Votre semaine sur StudioEntretien</h1>
        <p>Vous avez fait des progrès notables cette semaine.</p>
        <ul>
            ${insights.map((i) => `<li><strong>${i.title}</strong>: ${i.content}</li>`).join("")}
        </ul>
        <a href="https://studioentretien.fr/dashboard/progress">Voir ma progression complète</a>
    `;

  // Logic to send via Resend
}
