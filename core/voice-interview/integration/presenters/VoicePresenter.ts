import type { StartInterviewResponse, ProcessTurnResponse } from "../../application/dtos/index.js";
import type { OutboundAudioMessage, OutboundTextMessage, OutboundCompletedMessage, OutboundMessage } from "../transport/WebSocketMessage.js";

export class VoicePresenter {
  static presentStartResponse(sessionId: string, response: StartInterviewResponse): OutboundMessage[] {
    const messages: OutboundMessage[] = [];

    messages.push({
      type: "TEXT",
      sessionId,
      text: response.initialQuestionText,
      feedbackSignal: null
    } satisfies OutboundTextMessage);

    if (response.initialAudioChunk) {
      messages.push({
        type: "AUDIO",
        sessionId,
        audioChunk: response.initialAudioChunk
      } satisfies OutboundAudioMessage);
    }

    return messages;
  }

  static presentTurnResponse(sessionId: string, response: ProcessTurnResponse): OutboundMessage[] {
    const messages: OutboundMessage[] = [];

    if (response.generatedText) {
      messages.push({
        type: "TEXT",
        sessionId,
        text: response.generatedText,
        feedbackSignal: response.feedbackSignal
      } satisfies OutboundTextMessage);
    }

    if (response.audioChunk) {
      messages.push({
        type: "AUDIO",
        sessionId,
        audioChunk: response.audioChunk
      } satisfies OutboundAudioMessage);
    }

    if (response.isFinished) {
      messages.push({
        type: "COMPLETED",
        sessionId
      } satisfies OutboundCompletedMessage);
    }

    return messages;
  }
}
