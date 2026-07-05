import { IdentityCardData } from "./identity-card";
import { generateShareCopy } from "./share-copy";
import { envClient } from "@/lib/env.client";

/**
 * Main Share Engine to handle all social interactions.
 */
export class ShareEngine {
  async shareToLinkedIn(data: IdentityCardData) {
    const text = generateShareCopy(data);
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(envClient.NEXT_PUBLIC_APP_URL!)}&text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  }

  async copyCardToClipboard(elementId: string) {
    // Logic to render component to image and copy to clipboard
    // Requires html2canvas or similar client-side
    // Client-side file - console.log is appropriate for browser debugging
    console.log(`Rendering element ${elementId} to image...`);
  }
}

export const shareEngine = new ShareEngine();
