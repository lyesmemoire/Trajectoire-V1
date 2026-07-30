import { bus } from "../events/bus.js";
import { SessionMemory } from "./memory.js";
import { buildPrompt } from "./promptBuilder.js";
import { streamChat } from "./openai.js";
import { bufferChunk } from "./responseStreamer.js";
import { OpenAITTS } from "./tts/openai.js";

type SessionState = {
  memory: SessionMemory;
  controller: AbortController | null;
};

const sessions = new Map<string, SessionState>();

// Listen for transcript events from the event bus.
bus.on("transcript", async (msg) => {
  if (!msg.isFinal) return; // only act on final transcripts

  const { sessionId, transcript } = msg;

  // Retrieve or create session state
  let state = sessions.get(sessionId);
  if (!state) {
    // Placeholder system prompt – can be enriched later
    const memory = new SessionMemory("You are an interview assistant.");
    state = { memory, controller: null };
    sessions.set(sessionId, state);
  }

  // Add user transcript to memory
  state.memory.addUser(transcript);

  // Abort any existing OpenAI stream for this session
  if (state.controller) {
    state.controller.abort();
  }
  const abortController = new AbortController();
  const tts = new OpenAITTS();
  state.controller = abortController;

  // Build prompt (CV and job placeholders for now)
  const prompt = buildPrompt(
    "<CV placeholder>",
    "<Job placeholder>",
    state.memory.getMessages(),
  );

  let buffer = "";
  try {
    await streamChat(
      prompt,
      async (chunk) => {
        // Buffer chunks until a sentence boundary
        buffer = bufferChunk(chunk, buffer, (sentence) => {
          bus.emit("ai_chunk", { sessionId, payload: sentence });
          // Stream TTS for this sentence without blocking the main buffer processing
          (async () => {
            for await (const audioChunk of tts.stream(
              sentence,
              abortController.signal,
            )) {
              bus.emit("ai_audio_chunk", { sessionId, payload: audioChunk });
            }
            bus.emit("ai_audio_done", { sessionId });
          })();
        });
      },
      () => {
        // Flush remaining buffer
        if (buffer) {
          bus.emit("ai_chunk", { sessionId, payload: buffer });
          buffer = "";
        }
        bus.emit("ai_done", { sessionId });
      },
      abortController.signal,
    );
  } catch (error) {
    // If aborted, simply silence; otherwise forward error
    if ((err as unknown).name === "AbortError") {
      bus.emit("ai_error", { sessionId, error: "aborted" });
    } else {
      bus.emit("ai_error", { sessionId, error: (err as Error).message });
    }
  }
});
