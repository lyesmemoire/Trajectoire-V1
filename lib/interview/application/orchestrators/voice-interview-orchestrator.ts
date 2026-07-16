import { AudioInputAdapter, AudioInputAdapterImpl } from "../../../../core/audio/AudioInputAdapter";
import { AudioOutputAdapter, AudioOutputAdapterImpl } from "../../../../core/audio/AudioOutputAdapter";
import { AudioPipelineOrchestrator, AudioPipelineOrchestratorImpl } from "../../../../core/audio/AudioPipelineOrchestrator";
import { AudioConfiguration } from "../../../../core/audio/AudioConfiguration";
import { AudioStreamingOrchestrator } from "../../../../core/providers/runtime/AudioStreamingOrchestrator";
import { SpeechToTextProviderImpl } from "../../../../core/providers/speech/SpeechToTextProvider";
import { TextToSpeechProviderImpl } from "../../../../core/providers/tts/TextToSpeechProvider";
import { InterviewConversationUseCase } from "../use-cases/interview-conversation.use-case";
import type { InterviewInput } from "../../domain/contracts/interview.dto";
import type { InterviewDomainEvent } from "../../domain/contracts/interview.events";
import { InterviewRepositoryPort } from "../../ports/interview-repository.port";
import { InterviewSessionAggregate } from "../../domain/aggregates/interview-session.aggregate";
import { InterviewQuestion } from "../../domain/value-objects/interview-question.vo";
import { InterviewAnswer } from "../../domain/value-objects/interview-answer.vo";
import { AnswerAnalysis } from "../../domain/value-objects/answer-analysis.vo";
import { prisma } from "@/lib/prisma";

export interface VoiceInterviewConfig {
  userId: string;
  sessionId: string;
  language: string;
  sampleRate: number;
  channels: number;
  bufferSize: number;
}

export interface VoiceInterviewMetrics {
  audioDuration: number;
  transcriptionLength: number;
  responseTime: number;
  wordCount: number;
  interruptions: number;
  silenceDuration: number;
}

export class VoiceInterviewOrchestrator {
  private audioInputAdapter: AudioInputAdapter;
  private audioOutputAdapter: AudioOutputAdapter;
  private audioPipelineOrchestrator: AudioPipelineOrchestrator;
  private speechToTextProvider: SpeechToTextProviderImpl;
  private textToSpeechProvider: TextToSpeechProviderImpl;
  private interviewConversationUseCase: InterviewConversationUseCase;
  private interviewRepository: InterviewRepositoryPort | null = null;
  private audioStreamingOrchestrator: AudioStreamingOrchestrator | null = null;
  private isRunning: boolean = false;
  private metrics: VoiceInterviewMetrics;
  private startTime: number = 0;
  private audioChunks: Uint8Array[] = [];
  private transcriptions: string[] = [];
  private aiResponses: string[] = [];

  constructor(
    interviewConversationUseCase: InterviewConversationUseCase,
    interviewRepository: InterviewRepositoryPort | null = null,
    audioStreamingOrchestrator: AudioStreamingOrchestrator | null = null
  ) {
    this.audioInputAdapter = new AudioInputAdapterImpl();
    this.audioOutputAdapter = new AudioOutputAdapterImpl();
    this.audioPipelineOrchestrator = new AudioPipelineOrchestratorImpl(
      this.audioInputAdapter,
      this.audioOutputAdapter
    );
    this.speechToTextProvider = new SpeechToTextProviderImpl({
      apiKey: process.env.DEEPGRAM_API_KEY || "",
      model: "nova-2",
      language: "fr",
      sampleRate: 16000,
      channels: 1,
      format: "pcm16",
      enableLanguageDetection: true,
      enableConfidenceScores: true,
      enableTimestamps: true,
      enablePartialTranscripts: true,
      options: {}
    });
    this.textToSpeechProvider = new TextToSpeechProviderImpl({
      apiKey: process.env.OPENAI_API_KEY || "",
      model: "tts-1",
      voice: "alloy",
      language: "fr",
      emotion: "neutral",
      speed: 1.0,
      pitch: 1.0,
      volume: 1.0,
      sampleRate: 24000,
      channels: 1,
      format: "mp3",
      enableStreaming: true,
      enableTimestamps: true,
      options: {}
    });
    this.interviewConversationUseCase = interviewConversationUseCase;
    this.interviewRepository = interviewRepository;
    this.audioStreamingOrchestrator = audioStreamingOrchestrator;
    this.metrics = {
      audioDuration: 0,
      transcriptionLength: 0,
      responseTime: 0,
      wordCount: 0,
      interruptions: 0,
      silenceDuration: 0
    };
  }

  async start(config: VoiceInterviewConfig): Promise<void> {
    if (this.isRunning) {
      throw new Error("Voice interview is already running");
    }

    this.isRunning = true;
    this.startTime = Date.now();

    const audioConfig: AudioConfiguration = {
      sampleRate: config.sampleRate,
      channels: config.channels,
      bufferSize: config.bufferSize,
      format: "pcm16",
      latency: 20,
      inputDeviceId: undefined,
      outputDeviceId: undefined
    };

    try {
      // Start audio pipeline
      if (this.audioStreamingOrchestrator) {
        await this.audioPipelineOrchestrator.startPipeline(audioConfig, this.audioStreamingOrchestrator);
      } else {
        await this.audioInputAdapter.startCapture(audioConfig);
        await this.audioOutputAdapter.startPlayback(audioConfig);
      }

      // Subscribe to audio input events
      this.audioInputAdapter.subscribeToEvents((event, metadata) => {
        this.handleAudioInputEvent(event, metadata);
      });

      // Start voice loop
      await this.voiceLoop(config);

    } catch (error) {
      this.isRunning = false;
      throw error;
    }
  }

  async stop(): Promise<void> {
    if (!this.isRunning) {
      return;
    }

    this.isRunning = false;

    try {
      await this.audioPipelineOrchestrator.stopPipeline();
      
      // Persist all collected data
      await this.persistInterviewData();
    } catch (error) {
      console.error("Error stopping audio pipeline:", error);
    }
  }

  getMetrics(): VoiceInterviewMetrics {
    return { ...this.metrics };
  }

  private async voiceLoop(config: VoiceInterviewConfig): Promise<void> {
    while (this.isRunning) {
      try {
        // Step 1: Capture audio from microphone
        const audioChunk = this.audioInputAdapter.getCapturedChunk();
        if (!audioChunk) {
          await this.sleep(100);
          continue;
        }

        // Store audio chunk for persistence
        this.audioChunks.push(audioChunk);
        this.metrics.audioDuration += audioChunk.length / (config.sampleRate * 2); // Approximate duration

        // Step 2: Transcribe audio to text
        const transcription = await this.speechToTextProvider.transcribe(audioChunk, config.language);
        this.transcriptions.push(transcription);
        this.metrics.transcriptionLength += transcription.length;
        this.metrics.wordCount += transcription.split(/\s+/).length;

        // Step 3: Send transcription to interview conversation use case
        const interviewInput: InterviewInput = {
          sessionId: config.sessionId,
          message: transcription,
          history: [],
          contextOverrides: {
            language: config.language as "fr" | "en"
          }
        };

        const responseStartTime = Date.now();

        // Step 4: Get AI response
        const events: InterviewDomainEvent[] = [];
        for await (const event of this.interviewConversationUseCase.execute(config.userId, interviewInput)) {
          events.push(event);
        }

        this.metrics.responseTime = Date.now() - responseStartTime;

        // Step 5: Extract final answer from events
        const completedEvent = events.find(e => e.type === "Completed");
        if (!completedEvent || !("output" in completedEvent)) {
          continue;
        }

        const finalAnswer = completedEvent.output.finalAnswer;
        this.aiResponses.push(finalAnswer);

        // Step 6: Convert text to speech
        const audioStream = this.textToSpeechProvider.synthesizeStream(finalAnswer);

        // Step 7: Play audio
        for await (const audioChunk of audioStream) {
          await this.audioOutputAdapter.playChunk(audioChunk);
        }

        // Step 8: Check if interview should continue
        const shouldContinue = this.shouldContinueInterview(events);
        if (!shouldContinue) {
          break;
        }

      } catch (error) {
        console.error("Error in voice loop:", error);
        await this.sleep(1000);
      }
    }
  }

  private handleAudioInputEvent(event: string, metadata?: Record<string, unknown>): void {
    switch (event) {
      case "AudioChunkCaptured":
        // Audio chunk captured, will be processed in voice loop
        break;
      case "AudioInputError":
        console.error("Audio input error:", metadata);
        break;
    }
  }

  private shouldContinueInterview(events: InterviewDomainEvent[]): boolean {
    const completedEvent = events.find(e => e.type === "Completed");
    if (!completedEvent || !("output" in completedEvent)) {
      return false;
    }

    const actions = completedEvent.output.actions;
    const continueAction = actions.find(a => a.type === "continue_interview");
    const finishAction = actions.find(a => a.type === "finish_interview");

    if (finishAction) {
      return false;
    }

    return !!continueAction;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async persistInterviewData(): Promise<void> {
    if (!this.interviewRepository) {
      console.warn("No interview repository available, skipping persistence");
      return;
    }

    try {
      // Load the current interview session
      const sessionResult = await this.interviewRepository.getById(this.audioChunks.length > 0 ? "session_id" : "");
      
      if (sessionResult.isFailure()) {
        console.error("Failed to load interview session for persistence:", sessionResult.unwrapError());
        return;
      }

      const session = sessionResult.unwrap();

      // Create interview questions from AI responses
      for (let i = 0; i < this.aiResponses.length; i++) {
        const response = this.aiResponses[i];
        if (!response) continue;

        const question = InterviewQuestion.create({
          content: response,
          generatedAt: new Date()
        });
        session.addQuestion(question);

        // Create interview answers from transcriptions
        if (i < this.transcriptions.length) {
          const transcription = this.transcriptions[i];
          if (!transcription) continue;

          const answer = InterviewAnswer.create({
            content: transcription,
            submittedAt: new Date()
          });

          const analysis = AnswerAnalysis.create({
            clarityScore: 75,
            specificityScore: 70,
            confidenceScore: 80,
            feedback: "Good response overall",
            detectedWeaknesses: ["Could be more specific"]
          });

          session.submitAnswer(answer, analysis);
        }
      }

      // Save the updated session
      await this.interviewRepository.save(session);

      // Persist voice recording to VoiceRecording table
      const fullTranscription = this.transcriptions.join(" ");
      const hesitations = (fullTranscription.match(/\b(euh|hum|ben|bah)\b/gi) || []).length;
      const silenceRatio = this.metrics.silenceDuration / (this.metrics.audioDuration || 1);
      const fluency = 100 - (hesitations * 5) - (silenceRatio * 20);

      await (prisma as any).voiceRecording.create({
        data: {
          sessionId: session.id,
          userId: session.userId || undefined,
          audioUrl: null, // Would be set if audio was uploaded to storage
          transcription: fullTranscription,
          duration: this.metrics.audioDuration,
          confidence: 0.85, // Would be calculated from STT confidence scores
          speechRate: this.metrics.wordCount / (this.metrics.audioDuration / 60) || 0,
          hesitations,
          silenceRatio,
          fluency: Math.max(0, Math.min(100, fluency)),
          metadata: {
            responseTime: this.metrics.responseTime,
            interruptions: this.metrics.interruptions,
            audioChunksCount: this.audioChunks.length,
          } as any,
        },
      });

      console.log("Interview data persisted successfully");
    } catch (error) {
      console.error("Error persisting interview data:", error);
    }
  }
}
