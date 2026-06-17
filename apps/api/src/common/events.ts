export type ClientToServerEvents = {
  audio_chunk: (payload: {
    sessionId: string;
    chunk: Buffer;
    timestamp: number;
  }) => void;

  interrupt: (payload: { sessionId: string }) => void;
};

export type ServerToClientEvents = {
  transcript_partial: (payload: {
    sessionId: string;
    transcript: string;
    isFinal: false;
  }) => void;

  transcript_final: (payload: {
    sessionId: string;
    transcript: string;
    isFinal: true;
  }) => void;

  llm_token: (payload: { sessionId: string; token: string }) => void;

  audio_chunk: (payload: { sessionId: string; chunk: Buffer }) => void;

  interrupted: (payload: { sessionId: string }) => void;

  error: (payload: { sessionId: string; error: string }) => void;
};
