export type EmailTemplateParams = {
    name?: string;
    observation: string;
    improvementAxis: string;
    actionTitle: string;
    actionDuration: string;
};
/**
 * Générateur de contenu d'email sobre et protecteur.
 */
export declare function generateRecoveryEmailHtml(params: _EmailTemplateParams): string;
//# sourceMappingURL=email-templates.d.ts.map