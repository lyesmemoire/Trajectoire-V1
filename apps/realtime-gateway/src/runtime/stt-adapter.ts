import { CandidateMessage } from "../../../../core/p6/types";

export class STTAdapter {
  public async recognize(audio: Uint8Array): Promise<CandidateMessage> {
    // Abstracted/Mock logic
    return {
      text: "Recognized text placeholder",
      metadata: { audioLength: audio.length },
    };
  }
}
