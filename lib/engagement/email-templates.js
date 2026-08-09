/**
 * Générateur de contenu d'email sobre et protecteur.
 */
export function generateRecoveryEmailHtml(params) {
    const greeting = params.name ? `Bonjour ${params.name},` : "Bonjour,";
    return `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; color: #334155; line-height: 1.6; margin: 0 auto; padding: 20px;">
      <p style="font-size: 16px;">${greeting}</p>
      
      <p style="font-size: 15px; margin-top: 20px;">
        ${params.observation}
      </p>
      
      <p style="font-size: 15px; margin-top: 15px;">
        ${params.improvementAxis}
      </p>
      
      <p style="font-size: 15px; margin-top: 15px;">
        Un <strong>${params.actionTitle}</strong> de ${params.actionDuration} est disponible si vous souhaitez retravailler ce point à votre rythme.
      </p>
      
      <p style="font-size: 15px; margin-top: 20px;">
        Aucune pression. Vous pouvez reprendre quand vous vous sentirez prêt.
      </p>
      
      <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #f1f5f9;">
        <p style="font-size: 13px; color: #94a3b8;">
          — StudioEntretien
        </p>
      </div>
    </div>
  `;
}
//# sourceMappingURL=email-templates.js.map