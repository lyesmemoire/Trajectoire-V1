import { track } from "../analytics";
/**
 * Tracks sharing events for the Identity Distribution Engine.
 */
export function trackShareEvent(type, cardType) {
    track("share_event", {
        method: type,
        card_type: cardType,
        timestamp: new Date().toISOString(),
    });
}
export function trackCardView(cardType) {
    track("dna_card_view", {
        card_type: cardType,
    });
}
//# sourceMappingURL=share-analytics.js.map