export enum SessionState {
  IDLE = 'IDLE',
  LISTENING = 'LISTENING',
  TRANSCRIBING = 'TRANSCRIBING',
  THINKING = 'THINKING',
  SPEAKING = 'SPEAKING',
  INTERRUPTED = 'INTERRUPTED',
}

export interface InterviewSession {
  sessionId: string;
  createdAt: number;
  lastActivityAt: number;
  state: SessionState;
  // Controllers for aborting streams
  asrAbort?: AbortController;
  ttsAbort?: AbortController;
  // Subject to feed incoming audio chunks to Deepgram
  audioSubject?: import('rxjs').Subject<Buffer>;
}
