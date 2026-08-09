interface TranscriptState {
    transcripts: Array<{
        id: number;
        text: string;
        isFinal: boolean;
    }>;
    addTranscript: (msg: unknown) => void;
    clear: () => void;
}
export declare const useTranscriptStore: import("zustand").UseBoundStore<import("zustand").StoreApi<TranscriptState>>;
export {};
//# sourceMappingURL=transcriptStore.d.ts.map