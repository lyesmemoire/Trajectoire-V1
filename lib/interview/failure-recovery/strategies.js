/**
 * Gère les échecs et propose des stratégies de repli.
 */
export function getSafeFallbackResponse(persona) {
    const fallbacks = {
        stress: "Concentrons-nous. Pouvez-vous préciser votre dernière réponse ?",
        faang: "Ok. Passons à un autre aspect de votre parcours technique.",
        supportive: "Prenez votre temps. Souhaitez-vous clarifier ce point ou passer à la suite ?",
    };
    return fallbacks[persona] || "Poursuivons l'échange.";
}
export function isAudioCorrupted(size) {
    // Si l'audio fait moins de 1KB, il est probablement corrompu
    return size < 1024;
}
//# sourceMappingURL=strategies.js.map