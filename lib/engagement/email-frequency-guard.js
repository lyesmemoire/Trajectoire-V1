/**
 * Empêche toute sur-sollicitation (MAX 1 email tous les 10 jours).
 */
export function checkEmailFrequency(input) {
    if (!input.lastRecoveryEmailAt) {
        return { canSend: true };
    }
    const TEN_DAYS_IN_MS = 10 * 24 * 60 * 60 * 1000;
    const nextEligibleDate = new Date(input.lastRecoveryEmailAt.getTime() + TEN_DAYS_IN_MS);
    const canSend = Date.now() >= nextEligibleDate.getTime();
    return {
        canSend,
        nextEligibleDate: canSend ? undefined : nextEligibleDate,
    };
}
//# sourceMappingURL=email-frequency-guard.js.map