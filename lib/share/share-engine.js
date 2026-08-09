import { generateShareCopy } from "./share-copy";
/**
 * Main Share Engine to handle all social interactions.
 */
export class ShareEngine {
    async shareToLinkedIn(data) {
        const text = generateShareCopy(data);
        const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(process.env.NEXT_PUBLIC_APP_URL)}&text=${encodeURIComponent(text)}`;
        window.open(url, "_blank");
    }
    async copyCardToClipboard(elementId) {
        // Logic to render component to image and copy to clipboard
        // Requires html2canvas or similar client-side
        console.log(`Rendering element ${elementId} to image...`);
    }
}
export const shareEngine = new ShareEngine();
//# sourceMappingURL=share-engine.js.map