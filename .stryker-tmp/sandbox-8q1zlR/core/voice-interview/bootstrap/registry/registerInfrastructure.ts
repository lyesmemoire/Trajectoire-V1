// @ts-nocheck
import type { BootstrapConfig } from "../configuration/BootstrapConfiguration.js";
import type { InterviewSessionRepository } from "../../application/ports/InterviewSessionRepository.js";
import type { TextEvaluationPort, QuestionGenerationPort, SpeechRecognitionPort, SpeechSynthesisPort } from "../../application/ports/AIPorts.js";

// Infrastructure adapter imports
import { SupabaseInterviewRepository } from "../../infrastructure/adapters/supabase/SupabaseInterviewRepository.js";
import { OpenAIEvaluationAdapter } from "../../infrastructure/adapters/openai/OpenAIEvaluationAdapter.js";
import { OpenAIQuestionGenerationAdapter } from "../../infrastructure/adapters/openai/OpenAIQuestionGenerationAdapter.js";
import { DeepgramSTTAdapter } from "../../infrastructure/adapters/deepgram/DeepgramSTTAdapter.js";
import { ElevenLabsTTSAdapter } from "../../infrastructure/adapters/elevenlabs/ElevenLabsTTSAdapter.js";
import { SilentAudioAdapter } from "../../infrastructure/adapters/tts/SilentAudioAdapter.js";
import { ChainTTSAdapter } from "../../infrastructure/adapters/tts/ChainTTSAdapter.js";

export interface InfrastructureServices {
  readonly repository: InterviewSessionRepository;
  readonly evaluationPort: TextEvaluationPort;
  readonly questionPort: QuestionGenerationPort;
  readonly sttPort: SpeechRecognitionPort;
  readonly ttsPort: SpeechSynthesisPort;
}

export function registerInfrastructure(config: BootstrapConfig): InfrastructureServices {
  // Supabase client stub — in production, use createClient from @supabase/supabase-js
  const supabaseClient = { from: (_table: string) => ({}) } as ReturnType<typeof createSupabaseStub>;
  const repository = new SupabaseInterviewRepository(supabaseClient);

  // LLM clients — in production, these are SDK instances
  const openAIClient = { chat: { completions: { create: async (_params: unknown) => ({ choices: [{ message: { content: "{}" } }] }) } } };
  const evaluationPort = new OpenAIEvaluationAdapter(openAIClient);
  const questionPort = new OpenAIQuestionGenerationAdapter(openAIClient);

  // STT
  const deepgramClient = { transcription: { preRecorded: async (_source: unknown, _options: unknown) => ({ results: { channels: [{ alternatives: [{ transcript: "" }] }] } }) } };
  const sttPort = new DeepgramSTTAdapter(deepgramClient);

  // TTS — Chain: ElevenLabs → Silent fallback
  const elevenLabsClient = { textToSpeech: async (_voiceId: string, _text: string) => new ArrayBuffer(0) };
  const elevenLabsTTS = new ElevenLabsTTSAdapter(elevenLabsClient, config.ELEVENLABS_VOICE_ID);
  const silentTTS = new SilentAudioAdapter();
  const ttsPort = new ChainTTSAdapter([elevenLabsTTS, silentTTS]);

  return { repository, evaluationPort, questionPort, sttPort, ttsPort };
}

function createSupabaseStub() {
  return {
    from: (_table: string) => {
      const builder = {
        upsert: () => builder,
        select: () => builder,
        delete: () => builder,
        eq: () => builder,
        neq: () => builder,
        single: async () => ({ data: {}, error: null, count: 0 })
      };
      return builder;
    }
  };
}
