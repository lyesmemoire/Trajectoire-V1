// @ts-nocheck
import { track } from "../analytics";

/**
 * Tracks sharing events for the Identity Distribution Engine.
 */
export function trackShareEvent(
  type: "linkedin" | "twitter" | "copy",
  cardType: string,
) {
  track("share_event", {
    method: type,
    card_type: cardType,
    timestamp: new Date().toISOString(),
  });
}

export function trackCardView(cardType: string) {
  track("dna_card_view", {
    card_type: cardType,
  });
}
