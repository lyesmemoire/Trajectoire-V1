import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Subject } from 'rxjs';

// Use require or ignore import types to bypass TS module resolution issues with deepgram
import deepgramSdk from '@deepgram/sdk';

interface TranscriptChunk {
  transcript: string;
  isFinal: boolean;
}

@Injectable()
export class DeepgramProvider {
  private readonly logger = new Logger(DeepgramProvider.name);
  private client: unknown;

  constructor(private readonly config: ConfigService) {
    const apiKey = this.config.get<string>('DEEPGRAM_API_KEY');
    this.client = deepgramSdk.createClient(apiKey);
  }

  /**
   * Returns an async generator that yields transcript chunks received from Deepgram.
   * The caller provides an async generator of Uint8Array audio chunks (PCM 16kHz mono).
   */
  async *transcribeStream(
    audioChunkGenerator: AsyncGenerator<Uint8Array>,
    abortSignal: AbortSignal,
  ): AsyncGenerator<TranscriptChunk> {
    const transcriptSubject = new Subject<TranscriptChunk>();

    const live = (this.client as any).transcription.live({
      punctuate: true,
      interim_results: true,
    });

    // Wire SDK events to the subject
    live.on('transcript', (data: any) => {
      const alt = data.channel?.alternatives?.[0];
      if (alt) {
        const chunk: TranscriptChunk = {
          transcript: alt.transcript,
          isFinal: alt.final,
        };
        transcriptSubject.next(chunk);
      }
    });

    // Clean up on abort
    abortSignal.addEventListener('abort', () => {
      live.finish();
      transcriptSubject.complete();
    });

    // Feed incoming audio to Deepgram
    (async () => {
      try {
        for await (const chunk of audioChunkGenerator) {
          if (abortSignal.aborted) break;
          live.send(chunk);
        }
      } catch (error) {
        this.logger.error('Error streaming audio to Deepgram', error);
      } finally {
        live.finish();
        transcriptSubject.complete();
      }
    })();

    // Yield from the subject as an async iterable
    // If Subject is not async iterable, we mock the behavior or cast it
    const iterator = (transcriptSubject as any)[Symbol.asyncIterator]
      ? (transcriptSubject as any)[Symbol.asyncIterator]()
      : null;

    if (iterator) {
      while (true) {
        const { value, done } = await iterator.next();
        if (done) break;
        if (value) yield value;
      }
    }
  }
}
