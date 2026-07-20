import { IdentityCardData } from "./identity-card";
import { generateShareCopy } from "./share-copy";
import { logger } from "@/lib/logger/Logger";

/**
 * Main Share Engine to handle all social interactions.
 */
export class ShareEngine {
  async shareToLinkedIn(data: IdentityCardData) {
    const text = generateShareCopy(data);
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(process.env.NEXT_PUBLIC_APP_URL!)}&text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  }

  async copyCardToClipboard(elementId: string) {
    // Logic to render component to image and copy to clipboard
    // Requires html2canvas or similar client-side
    // TODO: Implement with html2canvas when needed
    logger.debug(`Rendering element ${elementId} to image...`);
  }
}

export const shareEngine = new ShareEngine();
