import { IdentityCardData } from "./identity-card";
/**
 * Main Share Engine to handle all social interactions.
 */
export declare class ShareEngine {
    shareToLinkedIn(data: IdentityCardData): Promise<void>;
    copyCardToClipboard(elementId: string): Promise<void>;
}
export declare const shareEngine: ShareEngine;
//# sourceMappingURL=share-engine.d.ts.map